# 配置 DHCP

DHCP 服务器 第一步是在路由器上启用 DHCP 服务。如下图所示，使用 service dhcp 命令即可完成。

### 思科路由器上的 DHCP 服务器

**DHCP Servers on Cisco Routers**

第一步就是在路由器上开启 DHCP 服务。这是通过使用`service dhcp`命令完成的，如下面所示（as exemplified below）。

```console
Router#configure terminal
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#service dhcp
```

下一步就是创建一个 DHCP 池，该 DHCP 池定义出将分配给客户端的 IP 地址池。在本例中，名为`SUBNET_A`的池将提供来自范围`192.168.1.0/24`的 IP 地址。

```console
Router(config)#ip dhcp pool SUBNET_A
Router(dhcp-config)#network 192.168.1.0 255.255.255.0
Router(dhcp-config)#default-router 192.168.1.1
Router(dhcp-config)#dns-server 8.8.8.8
Router(dhcp-config)#domain-name Network+
Router(dhcp-config)#lease 30
```

该 DHCP 池配置模式（the DHCP Pool Configuration mode）同时也是配置其它 DHCP 选项的地方。在上面的配置输出中，配置了以下这些参数。

- 默认网关：`192.168.1.1`(指派到将该路由器作为 DHCP 服务器所服务网络中的路由器接口地址)
- DNS服务器：`8.8.8.8`
- 域名：`Network+`
- 租期：`30`天

在需要时，也可以配置一些从`192.168.1.0/24`范围中排除的地址。我们就说要排除路由器接口 IP 地址（`192.168.1.1`）及`192.168.1.250`到`192.168.1.255`地址范围，从该范围就可手动为网络中的服务器分配地址。这是通过下面的配置完成的。

```console
Router(config)#ip dhcp excluded-address 192.168.1.1
Router(config)#ip dhcp excluded-address 192.168.1.250 192.168.1.255
```

可使用下面的命令来查看当前由该路由器 DHCP 服务器所服务的客户端。

```console
Router#show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address      Client-ID/  Lease expiration    Type    Hardware address/
192.168.1.2     Mar 02 2014 12:07 AM       Automatic    0063.6973.636f.2d63
```

在上面的输出中，由该 DHCP 服务器服务的是单独一台客户端，同时分到到 DHCP 范围的第一个非排除 IP 地址：`192.168.1.2`。还可以看到租期超时日期及设备 MAC 地址。

### 思科路由器上的 DHCP 客户端

**DHCP Clients on Cisco Routers**

除了 DHCP 服务器功能，思科路由器同样允许将其接口配置为 DHCP 客户端。这就是说接口将使用标准 DHCP 过程，请求到一个地址，而在特定子网上的任何服务器，都能分配该 IP 地址。

将一个路由器接口配置为 DHCP 客户端的命令如下。

```console
Router(config)#int FastEthernet0/0
Router(config-if)#ip address dhcp
```

一旦某台 DHCP 服务器分配了一个 IP 地址，在路由器控制台上就可以看到下面的通知消息（该消息包含了地址和掩码）。

```console
*Mar 1 00:29:15.779: %DHCP-6-ADDRESS_ASSIGN: Interface FastEthernet0/0 assigned DHCP address 10.10.10.2, mask 255.255.255.0, hostname Router
```

使用命令`show ip interface brief`，就可以观察到该 DHCP 分配方式。

```console
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status                  Protocol
FastEthernet0/0 10.10.10.2  YES DHCP    up                      up
FastEthernet0/1 unassigned  YES unset   administratively down   down
```

### DHCP数据包分析

**DHCP Packet Analysis**

为实际掌握在本模块中介绍的这些知识点，将生成一些上述示例中涉及到设备的流量捕获。在配置好 DHCP 服务器及客户端工作站启动起来后，就会发生`4`步的 DHCP 过程，可在下面的截屏中观察到。

![DHCP 4步过程](../images/1404.png)

*图14.4 -- DHCP 4步过程*

下面可以观察到 DHCP 发现数据包所包含的部分。

![DCHP发现数据包](../images/1405.png)

*图14.5 -- DHCP发现数据包*

正如你在截屏中看到的，该数据包（DHCP Discover packet）是由客户端发出，将其广播到网络上（目的地址是`255.255.255.255`）。同时还看到其报文类型为“Boot Request（`1`)”。

下一个数据包就是 DHCP 提议数据包（DHCP Offer packet），如下面所示。

![DHCP提议数据包](../images/1406.png)

*图14.6 -- DHCP提议数据包*

该数据包是由服务器（源 IP ：`192.168.1.1`）发出到广播地址（目的地址：`255.255.255.255`）,同时包含了提议的 IP 地址（`192.168.1.2`）。同时也可看到报文类型为“Boot Reply(`2`)”。

第三个数据包是 DHCP 请求数据包（DHCP Request packet）。

![DHCP请求数据包](../images/1407.png)

*图14.7 -- DHCP请求数据包*

DHCP请求数据包是由客户端发出到广播地址。可以看到报文类型是`Boot Request(1)`。该数据包与最初的 DHCP 发现数据包类似，但包含了一个非常重要的字段，就是`50`选项: 被请求的 IP 地址（`192.168.1.2`）（a very important field, which is Option 50: Requested IP Address(192.168.1.2)）。这就是在 DHCP 提议数据包中由 DHCP 服务器所提供的同一 IP 地址，而该客户端对其进行了确认和接受。

DHCP分配过程的最后数据包就是由服务器发出的 DCHP 确认数据包了(the DHCP ACK packet)。

![DHCP确认选项数据包](../images/1408.png)

*图14.8 -- DHCP确认选项数据包*

该数据包发自 DHCP 服务器并被广播到网络上；其同样包含了在上面的截屏中所看到的一些额外字段。

- DHCP服务器标识：该 DHCP 服务器的 IP 地址（`192.168.1.1`）
+ 路由器上配置的所有选项。
    - 租期：`30`天（以及派生出的早前讨论的过续租时间和重新绑定时间值）
    - 子网掩码：`255.255.255.0`
    - 默认网关（路由器）: `192.168.1.1`
    - DNS服务器：`8.8.8.8`
    - 域名：`Network+`

## DHCP故障排除

**Troubleshooting DHCP Issues**

跟 NAT 一样， DHCP 故障基本上总是因为错误配置造成的（开玩笑说就是第 8 层问题，意思是人为疏忽，jokingly referred to as Layer 8 issue, meaning somebody messed up）。

命令`service dhcp`默认是开启的，但有些时候其已被网络管理员因为某些原因关闭了。（作者就曾遇到过有管理员在他们的路由器上敲入`no ip routing`命令后因为紧急的路由故障打电话给思科 -- 真的！）

如在另一子网上使用一台服务器来管理 DHCP 配置，就要允许路由器放行 DHCP 数据包。在地址分配过程中， DHCP 用到广播报文（而路由器是不会转发广播报文的），那么就**需要将 DHCP 服务器的 IP 地址加入到路由器，以令到路由器将该广播报文作为单播数据包进行转发**。**命令`ip helper-address`**就可以实现这点。这是另一个考试喜欢的问题哦。

同样可以使用下面的`debug`命令作为排错过程中的部分。

```console
debug ip dhcp server events
debug ip dhcp server packet
```

### DNS操作

**DNS Operations**

DNS将主机名映射到 IP 地址（而不是反过来）。这就允许你在 web 浏览器中浏览一个网址，而无需输入服务器 IP 地址。

在主机或路由器想要将一个域名解析到 IP 地址（或反过来将 IP 地址解析到域名时）， DNS 用到UDP `53`号端口。而在两台 DNS 服务器之间打算同步或分享它们的数据库时，就使用TCP `53`号端口。

## 配置DNS

**Configuring DNS**

如想要容许路由器找到 web 上的某台 DNS 服务器，就使用命令`ip name-server 1.1.1.1`，或是服务器相应的地址。

也可以将某个主机名设置到路由器上的一个 IP 地址表中来节省时间，或是令到更易于记住要`ping`的或是连接到的哪台设备，如下面的输出所示。

```console
Router(config)#ip host R2 192.168.1.2
Router(config)#ip host R3 192.168.1.3
Router(config)#exit
Router#ping R2
Router#pinging 192.168.1.2
!!!!!
```

### DNS故障排除

**Troubleshooting DNS Issues**

路由器配置默认将会有一个`ip domain-lookup`命令。如此命令已被关闭，则 DNS 将不工作。某些时候路由器管理员会因避免在输入错误命令时，等待路由器执行数秒 DNS 查询，而关闭该命令。可通过下面的命令关闭 DNS 查询。

`Router(config)#no ip domain-lookup`

访问控制清单（access control lists, ACL）常常拦阻 DNS ，那么这是另一个故障原因。使用命令`debug domain`，可在路由器上对 DNS 进行调试。


## 第 14 天问题

1. DHCP simplifies network administrative tasks by automatically assigning `_______` to hosts on a network.
2. DHCP uses UDP ports `_______` and `_______`.
3. What are the six DHCP states for clients?
4. Which command will prevent IP addresses `192.168.1.1` to `192.168.1.10` from being used in the pool?
5. Which command will set a DHCP lease of 7 days, 7 hours, and 7 minutes?
6. Which command will enable the router to forward a DHCP Broadcast as a Unicast?
7. DNS uses UDP port `_______`.
8. Which command will set a DNS server address of `192.168.1.1` on your router?
9. If the `_______` `_______`-`_______` command has been disabled on your router, then DNS won’t work.
10. Which command will debug DNS packets on your router?

## 第 14 天问题答案

1. IP information (IP addresses).
2. 67 and 68.
3. Initialising, Selecting, Requesting, Bound, Renewing, and Rebinding.
4. The `ip dhcp excluded-address 192.168.1.1 192.168.1.10`
5. The `lease 7 7 7` command under DHCP Pool Configuration mode.
6. The `ip helper-address` command.
7. 53.
8. The `ip name-server 192.168.1.1` command.
9. `ip domain-lookup`.
10. The `debug domain` command.

## 第 14 天实验

### 路由器上的 DHCP 实验

**拓扑**

![路由器上的 DHCP 实验拓扑图](../images/1409.png)

**实验目的**

学习可如何将路由器用作 DHCP 服务器。

**实验步骤**

1. 如你使用着家用电脑或笔记本电脑，就将网络适配器设置为自动获取 IP 地址。在Packet Tracer中也可这样设置。让后使用交叉线将 PC 连接到路由器的以太网端口。


    ![网络适配器设置](../images/1410.png)

2. 将 IP 地址`172.16.1.1 255.255.0.0`加入到路由器接口。如忘记了这个怎么配置，就请看看前面的实验。要确保`no shut`该接口。

3. 配置 DHCP 地址池。接着为地址配置一个`3`天`3`小时`5`分的租期。最后将`1`到`10`的地址排除在分配给主机的地址之外。假设这些地址已为其它服务器或接口使用。


    ```console
    Router#conf t
    Router(config)#ip dhcp pool 60days
    Router(dhcp-config)#network 172.16.0.0 255.255.0.0
    Router1(dhcp-config)#lease 3 3 5    ← command won’t work on Packet Trer
    Router1(dhcp-config)#exit
    Router(config)#ip dhcp excluded-address 172.16.1.1 172.16.1.10
    Router(config)#
    ```

4. 执行一个`ipconfig /all`命令，查看是否有 IP 地址分配到 PC 。如旧地址仍在使用，就需要执行一下`ipconfig /renew`命令。


    ```console
    PC>ipconfig /all
    Physical Address................: 0001.C7DD.CB19
    IP Address......................: 172.16.0.1
    Subnet Mask.....................: 255.255.0.0
    Default Gateway.................: 0.0.0.0
    DNS Servers.....................: 0.0.0.0
    ```

5. 如想要的话，可回到 DHCP 地址池配置模式（DHCP Pool Configuration mode），加入一个默认网关及 DNS 服务器地址，它们也将在主机 PC 上得到设置。


    ```console
    Router(config)#ip dhcp pool 60days
    Router(dhcp-config)#default-router 172.16.1.2
    Router(dhcp-config)#dns-server 172.16.1.3
    PC>ipconfig /renew
    IP Address......................: 172.16.0.1
    Subnet Mask.....................: 255.255.0.0
    Default Gateway.................: 172.16.1.2
    DNS Server......................: 172.16.1.3
    ```

### 路由器上的 DNS 实验

**DNS on a Router lab**

在一台有着某种到互联网连通性的路由器上完成此实验。确保该路由器可以`ping`通比如 Google 公司的 DNS 服务器`8.8.8.8`这样的公网 IP 地址。将该地址配置为一个名字服务器。

`ip name-server 8.8.8.8`

接着尝试解析一些公网网站名字，比如通过`ping www.cisco.com`。

请访问[www.in60days.com](http://www.in60days.com), 观看我是怎么完成这个实验的。


（End）



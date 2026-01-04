# DNS 的运行


DNS 将主机名映射到 IP 地址（而不是相反）。这样就可以通过网络浏览器浏览网址，而不是服务器 IP 地址。当主机或路由器要将域名解析为 IP 地址（反之亦然）时，DNS 使用 UDP 端口 53。当两个 DNS 服务器要同步或共享数据库（区域传输）或响应大小超过 512 字节时，两个 DNS 服务器之间会使用 TCP 端口 53。
配置 DNS
如果要允许路由器在网上查找 DNS 服务器，请使用 ip name-server [ip 地址] 命令。
您也可以在路由器的 IP 地址表中设置一个主机名，以节省时间或更容易记住要 ping 或连接的设备，如下图所示。
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



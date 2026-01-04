# 网络时间协议

NTP 是一种用于使机器网络时间同步的协议。NTP 记录在 RFC 1305 中，通过 UDP 运行。
NTP 网络通常从权威时间源获取时间，如无线电时钟或连接到时间服务器的原子钟。然后，NTP 在网络上分配时间。NTP 的效率极高，每分钟只需一个数据包就能将两台机器的时间同步到毫秒以内。
NTP 使用 "层 "的概念来描述一台机器距离权威时间源的 NTP 跳数。请记住，这不是路由或交换跳数，而是 NTP 跳数，这是一个完全不同的概念。层 1 时间服务器通常直接连接无线电或原子钟，而层 2 时间服务器通过 NTP 从层 1 时间服务器接收时间，以此类推。当设备配置了多个 NTP 参考服务器时，它会自动选择配置为通过 NTP 通信的层号最低的机器作为时间源。
在 Cisco IOS 软件中，使用 ntp server [address] 全局配置命令可为设备配置一个或多个 NTP 服务器的 IP 地址。如前所述，重复使用同一命令可指定多个 NTP 参考地址。此外，该命令还可用于配置服务器和客户端之间的安全和其他功能。下面的配置示例说明了如何配置设备与 IP 地址为 10.0.0.1 的 NTP 服务器同步时间：
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



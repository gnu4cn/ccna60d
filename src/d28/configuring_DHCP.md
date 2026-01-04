# 配置 DHCP

## Cisco 路由器上的 DHCP 服务器

第一步是在路由器上启用 DHCP 服务。如下所示，这是通过使用 `service dhcp` 命令完成的。

```console
Router#configure terminal
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#service dhcp
```

下一步是创建一个定义了将分配给客户端的 IP 地址池的 DHCP 池。在下面的示例中，名为 `"SUBNET _A"` 的池，将提供 `192.168.1.0/24` 范围内的 IP 地址：

```console
Router(config)#ip dhcp pool SUBNET_A
Router(dhcp-config)#network 192.168.1.0 255.255.255.0
Router(dhcp-config)#default-router 192.168.1.1
Router(dhcp-config)#dns-server 8.8.8.8
Router(dhcp-config)#domain-name Network+
Router(dhcp-config)#lease 30
```

这种 DHCP 池配置模式，也是咱们可配置其他 DHCP 选项之处。在上面的配置输出中，以下参数已被配置：

- 默认网关：`192.168.1.1`（支配到其作为 `DHCP` 服务器所服务网络的那个路由器接口）
- DNS 服务器：`8.8.8.8`
- 域名：`Network+`
- 租期：30 天

当需要时，咱们还可配置一些 `192.168.1.0/24` 范围中的排除地址。假设咱们打算排除路由器接口的 IP 地址 (`192.168.1.1`) 及地址范围 `192.168.1.250` 至 `192.168.1.255`，因为咱们将从这一范围，手动分配地址给咱们网络中的服务器。这是通过使用下面的配置完成的。


```console
Router(config)#ip dhcp excluded-address 192.168.1.1
Router(config)#ip dhcp excluded-address 192.168.1.250 192.168.1.255
```


咱们将注意到，上面两条命令并非是在 `Router(dhcp-config)#` 模式下执行的。要验证当前由这个路由器 DHCP 服务器提供服务的那些客户端，咱们可使用下面的命令。


```console
Router#show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address      Client-ID/  Lease expiration    Type    Hardware address/
192.168.1.2     Mar 02 2014 12:07 AM       Automatic    0063.6973.636f.2d63
```

在上面的输出中，有一个客户端由该 DHCP 服务器提供服务，同时其被分配了 DHCP 范围中第一个未排除的 IP 地址：`192.168.1.2`。咱们还可以看到，租约的超时日期及该设备的 MAC 地址。

## 思科路由器上的 DHCP 客户端


除了 DHCP 服务器功能外，Cisco IOS 路由器还允许将接口配置为 DHCP 的客户端。这样做意味着，该接口将使用标准 DHCP 过程，以及出现在该特定子网上的，任何可分配 IP 地址的服务器，请求一个地址。

将某个路由器接口配置为 DHCP 客户端的命令如下：

```console
Router(config)#int FastEthernet0/0
Router(config-if)#ip address dhcp
```
一旦某个 DHCP 服务器分配了一个 IP 地址，那么以下通知（其会包括该地址与掩码），就将在路由器控制台上看到：

```console
*Mar 1 00:29:15.779: %DHCP-6-ADDRESS_ASSIGN: Interface FastEthernet0/0 assigned DHCP address 10.10.10.2, mask 255.255.255.0, hostname Router
```

这种 DHCP 的分配方式，可在 `show ip interface brief` 命令的 `Method` 表头下观察到。

```console
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status                  Protocol
FastEthernet0/0 10.10.10.2  YES DHCP    up                      up
FastEthernet0/1 unassigned  YES unset   administratively down   down
```

## DHCP 的数据包分析

为了切实理解这一教学模组中介绍的这些主题，对上述示例中涉及的设备的一些流量捕获，将得以生成。如同在下图 28.4 可观察到的，在 DHCP 服务器已被配置，同时客户端工作站启动时，四个步骤的 DHCP 过程便会发生。


![DHCP 4步过程](../images/1404.png)


**图 28.4** -- **DHCP 的四步过程**

DHCP 的 `Discover` 数据包组件，可在下面观察到。


![DCHP 的 `Discover` 数据包](../images/1405.png)


**图 28.5** -- **DHCP 的 `Discover` 数据包**

正如咱们在图 28.5 中可以看到的，这种数据包是由在网络上广播了该数据包（目的地址 `255.255.255.255`）的客户端发送。咱们还可以看到报文类型 `"Boot Request(1)"`。

下一种数据包是 DHCP 的 `Offer` 数据包，如下所示。

![DHCP 的 `Offer` 数据包](../images/1406.png)

**图 28.6** -- **DHCP 的 `Offer` 数据包**

这个数据包是由服务器（源 IP：`192.168.1.1`）发送到广播地址（目的地址：`255.255.255.255`），其包含了提议的 IP 地址 (`192.168.1.2`)。咱们同样可以看到报文类型 `"Boot Reply(2)"`。

第三种数据包是 DHCP 的 `Request` 数据包。


![DHCP 的 `Request` 数据包](../images/1407.png)


**图 28.7** -- **DHCP 的 `Request` 数据包**

DHCP 的 `Request` 数据包，是由客户端发送到广播地址。咱们可以看到报文类型 `"Boot Request(1)"`。这种数据包与初始的 DHCP `Discover` 数据包类似，但包含了个非常重要的字段，即 `Option 50`：请求的 IP 地址（`192.168.1.2`）。这正是由 DHCP 服务器在 DHCP `Offer` 数据包中所提供的那同一个 IP 地址，而客户机确认了他并接受了他。

DHCP 分配过程的最后一种数据包，是由服务器发送的 DCHP `ACK` 数据包。

![DHCP 的 `Ack` 选项数据包](../images/1408.png)

**图 28.8** -- **DHCP 的 `Ack` 选项数据包**

这种数据包源自 DHCP 服务器，并在网络上广播；正如在上图 28.8 所看到的，他还包含了一些额外字段。

- DHCP 服务器的标识符：DHCP 服务器的 IP 地址（`192.168.1.1`）
+ 配置于该路由器上的所有选项：
    - 租期：30 天（以及早先曾讨论过的派生续订时间与重新绑定时间值)
    - 子网掩码：`255.255.255.255.0`
    - 默认网关（路由器）：`192.168.1.1`
    - DNS 服务器：`8.8.8.8`
    - 域名：`Network+`




# 虚拟路由器冗余协议

**Virtual Router Redundancy Protocol**

虚拟路由器冗余协议（Virtual Router Redundancy Protocol, VRRP），是一个动态地将一个或多个网关的职责，指派给 LAN 上的 VRRP 路由器的网关选举协议（a gateway election protocol）, 其令到在诸如以太网这样的某个多路访问网段（a Multi-Access segment）上的数台路由器，能够使用同一个虚拟 IP 地址，作为它们的默认网关。

VRRP以与 HSRP 类似的方式运作；但与 HSRP 不同， VRRP 是一个定义在[RFC 2338](http://www.ietf.org/rfc/rfc2338.txt)中的开放标准，RFC 2338 在[RFC 3768](http://www.ietf.org/rfc/rfc3768.txt)中被废弃。 VRRP 将通告发送到多播目的地址`224.0.0.18`（ VRRP ）, 使用的是 IP 协议编号`112`。在数据链路层，通告是从主虚拟路由器（the master virtual router）的 MAC 地址`00-00-5e-00-01xx`发出的，这里的"xx"表示了两位十六进制的组编号。这在下图34.18中进行了演示：

![VRRP的多播地址](../images/3418.png)

*图 34.18 -- VRRP的多播地址，VRRP Multicast Addresses*

> **注意：** 这里的协议编号是十六进制形式的。而十六进制值`0x70`就等于是进制的 112 。与此类似，数据链路层目的地址`01-00-5e-00-00-12`中的十六进制值`12`就是十进制值 18 （也就是`224.0.0.18`）了。如你仍对这些数值是如何转换的没有掌握，那么本 CCNA 手册的十六进制到十进制转换在网上是很详细的。

> **真是世界的部署**

> 与 HSRP 不同， VRRP 并没有允许网关使用出厂地址（Burnt-in Address, BIA）或静态配置的地址作为 VRRP 组的 MAC 地址的选项。因此，在带有多于 VRRP 组的生产网络中，对在某个特定接口上应用多个 MAC 地址的理解掌握，尤其是当部署了诸如端口安全这样的特性时， 是重要的。记得要着重于整体上；否则就会发现，尽管有正确配置，一些特性或协议也不会如预期那样跑起来。

一个 VRRP 网关是在一台或多台连接到 LAN 的路由器上，配置用于运行 VRRP 协议的（A VRRP gateway is configured to run the VRRP protocol in conjunction with one or more other routers attached to a LAN）。在 VRRP 配置中，一台网关被选举为主虚拟路由器（the master router）, 而其它网关则扮演在主虚拟路由器失效时的备份虚拟路由器。下图34.19对此概念进行了演示：

![VRRP的基本运作](../images/3419.png)

*图 34.19 -- VRRP的基本运作*

### VRRP的多虚拟路由器支持特性

可在某个接口上配置多大 255 个的虚拟路由器。而某个路由器接口实际能支持的虚拟路由器数目，由以下因素决定：

- 路由器的处理能力，Router processing capability

- 路由器的内存容量，Router memory capability

- 路由器接口对多 MAC 地址的支持情况，Router interface support of multiple MAC addresses

### VRRP的主路由器选举

**VRRP Master Router Election**

VRRP默认使用优先级值来决定哪台路由器将被选举为主虚拟路由器。默认的 VRRP 优先级值为100; 但此数值可被手工修改为一个 1 到 254 之间的数值。而如多台网关有着相同的优先级数值，那么有着最高 IP 地址的网关将被选举为主虚拟路由器，同时有着较低 IP 地址的那台就成为备份虚拟路由器。

加入有多于两台的路由器被配置为 VRRP 组的组成部分，那么备份虚拟路由器中有着第二高优先级的，就会在当前主虚拟路由器失效或不可用时，被选举为主虚拟路由器。又假如那些备份虚拟路由器又有着相同的优先级，那么这些备份路由器中有着最高 IP 地址的那台，将被选举为主路由器。下图34.20对此概念进行了演示：

![VRRP主虚拟路由器及备份虚拟路由器的选举](../images/3420.png)

*图 34.20 -- VRRP主虚拟路由器及备份虚拟路由器的选举*

图34.20演示了一个采用了 VRRP 作为网关冗余的网络。主机 1 与主机 2 都配置了默认`192.168.1.254`作为默认网关，此网关就是配置在交换机`VRRP-1`、`VRRP-2`及`VRRP-3`上，给VRRP `group 192`的虚拟 IP 地址。

交换机`VRRP-1`已被配置了优先级值110, `VRRP-2`的是105, `VRRP-3`的是默认 VRRP 优先级 100 。基于此种配置，`VRRP-1`就被选举为主虚拟路由器，同时`VRRP-2`和`VRRP-3`就成为备份虚拟路由器。

在`VRRP-1`失效时，因为`VRRP-2`有着比起`VRRP-3`更高的优先级，所以它就成为主虚拟路由器。但如果`VRRP-2`与`VRRP-3`有着相同优先级的话，`VRRP-3`将被选举为主虚拟路由器，因为它有着更高的 IP 地址。

### VRRP的抢占

与 HSRP 不同， VRRP 的抢占特性是默认开启的，因此无需管理员为开启此功能而进行显式的配置。但此功能可经由使用接口配置命令`no vrrp [number] preempt`进行关闭。

### VRRP的负载均衡

VRRP允许以与 HSRP 类似的方式，实现负载均衡。比如，在一个于某台网关上配置了多个虚拟路由器（ VRRP 组）的网络中，一个接口可作为某个虚拟路由器（ VRRP 组）的主接口（虚拟路由器），同时又可作为另一或更多虚拟路由器（ VRRP 组）的备份（虚拟路由器）。下图34.21对此进行了演示：

![VRRP的负载均衡](../images/3421.png)

*图 34.21 -- VRRP的负载均衡*

### VRRP的版本

默认情况下，当在某台运行思科 IOS 软件的网关上配置了 VRRP 时，开启的是 VRRP 版本 2 （见下图）。版本 2 正是默认的以及当前的 VRRP 版本。这里并不能如同在 HSRP 中那样改变版本，因为并没有 VRRP 版本 1 的标准。

> **注意:** 在本手册编写过程中，为 IPv4 与 IPv6 定义 VRRP 的版本 3 ，正处于草案阶段，且并未标准化。


![VRRP版本 2 的数据包](../images/3422.png)

*图 34.22 -- VRRP版本 2 的数据包*

### VRRP的各种通告

**VRRP Advertisements**

主虚拟路由器将通告发送给同一 VRRP 组中的其它 VRRP 路由器。通告就主虚拟路由器的优先级与状态进行通信。 VRRP 的通告是以 IP 数据包进行封装的，并被发送到在图34.18中所演示的那个指派给该 VRRP 组的 IPv4 多播地址。通告默认以每秒的频率发送；不过此时间间隔是可被用户配置的，因而可以改变。同时备份虚拟路由器收听主虚拟路由器通告的间隔，也可进行配置。

### 在网关上配置VRRP

在网关上配置 VRRP ，需要以下步骤：

1. 使用接口配置命令`ip address [address] [mask] [secondary]`，给网关接口配置正确的 IP 地址与子网掩码。

2. 通过接口配置命令`vrrp [number] ip [virtual address] [secondary]`，在该网关接口上建立一个 VRRP 组，并为其指派一个虚拟 IP 地址。关键字`[secondary]`将该虚拟 IP 地址配置为指定 VRRP 组的次网关地址。

3. 作为可选项，使用接口配置命令`vrrp [number] description [name]`, 为该 VRRP 组指派一个描述性名称。

4. 作为可选项，在打算对主虚拟路由器及备份虚拟路由器的选举进行控制时，就要经由接口配置命令`vrrp [number] priority [value]`, 对该组的优先级进行配置。

本小节的 VRRP 配置输出，将基于下图34.23的网络：

![VRRP配置示例的拓扑](../images/3423.png)

*图 34.23 -- VRRP配置示例的拓扑*

> **注意：** 这里假定在`VTP-Server-1`与`VTP-Server-2`之间的 VLAN 与中继已有配置妥当，同时交换机之间可以经由VLAN192 `ping`通。为简短起见，这些配置已在配置示例中省略。

```console
VTP-Server-1(config)#interface vlan192
VTP-Server-1(config-if)#ip address 192.168.1.1 255.255.255.0
VTP-Server-1(config-if)#vrrp 1 ip 192.168.1.254
VTP-Server-1(config-if)#vrrp 1 priority 105
VTP-Server-1(config-if)#vrrp 1 description ‘SWITCH-VRRP-Example’
VTP-Server-1(config-if)#exit
VTP-Server-2(config)#interface vlan192
VTP-Server-2(config-if)#ip address 192.168.1.2 255.255.255.0
VTP-Server-2(config-if)#vrrp 1 ip 192.168.1.254
VTP-Server-2(config-if)#vrrp 1 description ‘SWITCH-VRRP-Example’
VTP-Server-2(config-if)#exit
```

> **注意：** 这里没有为`VTP-Server-2`上所应用的 VRRP 配置手动指派优先级数值。那么默认情况下， VRRP 将使用 100 的优先级数值，这就令到带有优先级数值 105 的`VTP-Server-1`，在选举中获胜而被选举为该 VRRP 组的主虚拟路由器。此外，这里还为该 VRRP 组配置了一个描述信息。

下面还使用命令`show vrrp [all|brief|interface]`, 对此配置进行了验证。关键字`[all]`展示了有关该 VRRP 配置的所有信息，包括了组的状态、描述信息（在配置了的情况下）、本地网关优先级，以及主虚拟路由器和其它信息。关键字`[brief]`则会列印出该 VRRP 配置的摘要信息。而`[interface]`关键字会列印出特定接口的 VRRP 信息。下面的输出展示了`show vrrp all`命令的输出：

```console
VTP-Server-1#show vrrp all
Vlan192 - Group 1
‘SWITCH-VRRP-Example’
    State is Master
    Virtual IP address is 192.168.1.254
    Virtual MAC address is 0000.5e00.0101
    Advertisement interval is 1.000 sec
    Preemption enabled
    Priority is 105
    Master Router is 192.168.1.1 (local), priority is 105
    Master Advertisement interval is 1.000 sec
    Master Down interval is 3.589 sec
VTP-Server-2#show vrrp all
Vlan192 - Group 1
‘SWITCH-VRRP-Example’
    State is Backup
    Virtual IP address is 192.168.1.254
    Virtual MAC address is 0000.5e00.0101
    Advertisement interval is 1.000 sec
    Preemption enabled
    Priority is 100
    Master Router is 192.168.1.1, priority is 105
    Master Advertisement interval is 1.000 sec
    Master Down interval is 3.609 sec (expires in 3.328 sec)
```

下面的输出展示了由命令`show vrrp brief`所列印出的信息：

```console
VTP-Server-1#show vrrp brief
Interface          Grp Pri Time Own Pre State   Master addr     Group addr
Vl192              1   105 3589      Y  Master  192.168.1.1     192.168.1.254
VTP-Server-2#show vrrp brief
Interface          Grp Pri Time Own Pre State   Master addr     Group addr
Vl192              1   100 3609      Y  Backup  192.168.1.1     192.168.1.254
```

### 配置 VRRP 的接口跟踪特性

为将 VRRP 配置为对某个接口进行跟踪，就必须要在全局配置模式下，为接口追踪而使用全局配置命令`track [object number] interface [line-protocol|ip routing]`, 或为 IP 前缀追踪而使用全局配置命令`track [object number] ip route [address | prefix] [reachablity | metric threshold]`，建立一个被跟踪的对象。依据软件与平台的不同，交换机上可对高达 500 个的被追踪对象进行跟踪。随后再使用接口配置命令`vrrp [number] track [object]`, 实现 VRRP 对被追踪对象的跟踪。

> **注意：** CCNA考试不要求完成这些高级对象追踪的配置。

下面的输出展示了如何配置 VRRP 的跟踪，引用了对象1, 该被跟踪对象对`Loopback0`接口的线路协议进行跟踪：

```console
VTP-Server-1(config)#track 1 interface Loopback0 line-protocol
VTP-Server-1(config-track)#exit
VTP-Server-1(config)#interface vlan192
VTP-Server-1(config-if)#vrrp 1 track 1
VTP-Server-1(config-if)#exit
```

而下面的输出则展示了如何将 VRRP 配置为对引用对象 2 的追踪，此被追踪对象追踪了到前缀`1.1.1.1/32`的可达性。一个被追踪的 IP 路由对象在存在一个该路由的路由表条目时，被认为是在线且可达的，同时该路由不是无法访问的（无法访问就是说有着 255 的路由度量值）, 当发生无法访问时，该路由就会从路由信息数据库中被移除（a tracked IP route object is considered to be up and reachable when a routing table entry exists for the route and the route is not accessible(i.e., has a route metric of 255)，in which case the route is removed from the Routing Information Base(RIB) anyway）。

```console
VTP-Server-1(config)#track 2 ip route 1.1.1.1/32 reachability
VTP-Server-1(config-track)#exit
VTP-Server-1(config)#interface vlan192
VTP-Server-1(config-if)#vrrp 1 track 2
```

VRRP跟踪的配置，是通过使用命令`show vrrp interface [name]`命令进行验证的。下面的输出对此进行了演示：

```console
VTP-Server-1#show vrrp interface vlan192
Vlan192 - Group 1
‘SWITCH-VRRP-Example’
    State is Master
    Virtual IP address is 192.168.1.254
    Virtual MAC address is 0000.5e00.0101
    Advertisement interval is 0.100 sec
    Preemption enabled
    Priority is 105
        Track object 1 state Up decrement 10
        Track object 2 state Up decrement 10
    Authentication MD5, key-string
    Master Router is 192.168.1.1 (local), priority is 105
    Master Advertisement interval is 0.100 sec
    Master Down interval is 0.889 sec
```

而要查看被追踪对象的各项参数，就使用命令`show track [number] [brief] [interface] [ip] [resolution] [timers]`。下面是`show track`命令输出的演示：

```console
VTP-Server-1#show track
Track 1
    Interface Loopback0 line-protocol
    Line protocol is Up
        1 change, last change 00:11:36
    Tracked by:
        VRRP Vlan192 1
Track 2
    IP route 1.1.1.1 255.255.255.255 reachability
    Reachability is Up (connected)
        1 change, last change 00:08:48
    First-hop interface is Loopback0
    Tracked by:
        VRRP Vlan192 1
```

> **注意：** 这些被追踪对象亦可与 HSRP 和 GLBP 配合使用。 GLBP 在下面的小节进行说明。

### VRRP的调试

命令`debug vrrp`提供给管理员用于查看有关 VRRP 运作情况实时信息的诸多选项。这些选项如下面的输出所示：

```console
VTP-Server-1#debug vrrp ?
    all Debug all VRRP information
    auth VRRP authentication reporting
    errors VRRP error reporting
    events Protocol and Interface events
    packets VRRP packet details
    state VRRP state reporting
    track Monitor tracking
    <cr>
```




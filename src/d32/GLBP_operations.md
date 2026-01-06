# GLBP的运作

在启用了 GLBP 后，该 GLBP 组的那些成员就选举出一台网关，作为改组的活动虚拟网关（the active virtual gateway, AVG）。该活动网关有着最高的优先级值。在成员优先级值相等时，组中带有最高 IP 地址的活动虚拟网关将被选举为网关。组中剩下的其它网关，就会在活动虚拟网关不可用时，提供活动虚拟网关的备份。

活动虚拟网关将应答所有对虚拟路由器地址的地址解析协议（Address Resolution Protocol, ARP）请求。此外活动虚拟网关还会为 GLBP 组的每个成员网关，都分配一个虚拟 MAC 地址。因此每个成员网关都要负责转发发送到由活动虚拟网关所指派的虚拟 MAC 地址上的数据包了。这些网关一起, 作为它们所分配到的虚拟 MAC 地址所对应的活动虚拟转发器（active virtual forwarders, AVFs）被看待。这就令到 GLBP 能够提供负载的共同承担。下图34.25对此概念进行了演示:

![GLBP的活动虚拟网关与活动虚拟转发器](../images/3425.png)

*图 34.25 -- GLBP的活动虚拟网关与活动虚拟转发器，GLBP Active Virtual Gateway and Active Virtual Forwarders*

图34.25展示了一个使用 GLBP 作为 FHRP 的网络。这里的三台网关都被配置在GLBP `Group 1`中。网关`GLBP-1`配置了 110 的优先级值，网关`GLBP-2`配置的优先级值是105, 网关`GLBP-3`使用了默认的优先级值 100 。那么`GLBP-1`就被选举为活动虚拟网关，同时`GLBP-2`和`GLBP-3`又被分配到相应的虚拟 MAC 地址`bbbb.bbbb.bbbb.bbbb`及`cccc.cccc.cccc`， 且各自成为这些虚拟 MAC 地址对应的活动虚拟转发器。`GLBP-1`也是其本身虚拟 MAC 地址`aaaa.aaaa.aaaa`的活动虚拟转发器。

主机 1 、 2 、 3 都配置了默认网关地址`192.168.1.254`, 此 IP 地址正是指派给该 GLBP 组的虚拟 IP 地址。主机 1 发出了查询其网关 IP 地址的 ARP 广播。此查询被活动虚拟网关（`GLBP-1`）接收到，`GLBP-1`就以其自身的虚拟 MAC 地址`aaaa.aaaa.aaaa`加以响应。主机 1 于是就将到`192.168.1.254`的流量，转发到这个 MAC 地址了。

主机 2 发出一个查询其网关 IP 地址的 ARP 广播。此查询被活动虚拟网关（`GLBP-1`）接收，进而以虚拟 MAC 地址`bbbb.bbbb.bbbb`进行响应。那么主机 2 就将那些到`192.168.1.254`的流量，都转发到这个 MAC 地址了，并由`GLBP-2`来进一步转发这些流量。

主机 3 的情况与此类似，将会把到`192.168.1.254`的流量，转发到虚拟 MAC 地址`cccc.cccc.cccc`, 由`GLBP-3`来转发这些流量。

通过使用上组中的所有网关， GLBP 实现了无需像在 HSRP 或 VRRP 中那样需要配置多个组，就能做到负载均衡。

### GLBP的虚拟 MAC 地址分配

一个 GLBP 允许每组有 4 个的虚拟 MAC 地址。由活动虚拟网关来负责将虚拟 MAC 地址分配给组中的各个成员。其它组成员是在它们发现了活动虚拟网关后，精油 Hello 报文，请求到虚拟 MAC 地址的。

这些网关是依序分配到下一个虚拟 MAC 地址的。已通过活动虚拟网关分配到了虚拟 MAC 地址的网关，被称作主虚拟转发器（a primary virtual forwarder）, 而已学习到某个虚拟 MAC 地址的网关，被称作是从虚拟转发器（a secondary virtual forwarder）。

### GLBP的冗余

在 GLBP 组中，是单一一台网关被选举为活动虚拟网关，有另一网关被选举为备份虚拟网关（the standby virtual gateway）的。组中剩下的其它网关，都被置于侦听状态（a Listen state）。在活动虚拟网关失效时，备份虚拟网关将接过该虚拟 IP 地址的角色。于此同时，又会再进行一次选举，此时将从那些处于侦听状态的网关中选出一个新的备份虚拟网关。

在该活动虚拟网关失效时，处于侦听状态的某台从虚拟转发器，会接过该虚拟 MAC 地址的职责。但是因为新的活动虚拟转发器已是使用了另一虚拟 MAC 地址的转发器， GLBP 就需要确保原有的转发器 MAC 地址停止使用，同时那些主机已从此 MAC 地址迁移。这是通过使用下面的两个计时器实现的（in the event the AVF fails, one of the secondary virtual forwarders in the Listen state assumes responsibility for the virtual MAC address. However, because the new AVF is already a forwarder using another virtual MAC address, GLBP needs to ensure that the old forwarder MAC address ceases being used and hosts are migrated away from this address. This is archived using the following two timers）：

- 重定向计时器，the redirect timer

- 超时计时器，the timeout timer


重定向时间是指在活动虚拟网关持续将主机重新到原有该虚拟转发器 MAC 地址的间隔。在此计时器超时后，活动虚拟网关就在 ARP 应答中停止使用原有的虚拟转发器 MAC 地址了，就算该虚拟转发器仍将持续发送到原有虚拟转发器 MAC 地址的数据包（the redirect time is the interval during which the AVG continues to redirect hosts to the old virtual forwarder MAC address. When this timer expires, the AVG stops using the old virtual forwarder MAC address in ARP replies, although the virtual forwarder will continue to forward packets that were sent to the old virtual forwarder MAC address）。

而在超时计时器超时后，该虚拟转发器就被从该 GLBP 组的所有网关中移除。那些仍在使用 ARP 缓存中原有 MAC 地址的客户端，就必须刷新此项项目，以获取到新的虚拟 MAC 地址。 GLBP 使用 Hello 报文，来就这两个计时器的当前状态进行通信（when the timeout timer expires, the virtual forwarder is removed from all gateways in the GLBP group. Any clients still using the old MAC address in their ARP caches must refresh the entry to obtain the new virtual MAC address. GLBP uses Hello messages to communicate the current state of these two timers）。

### GLBP的负载抢占

GLBP抢占默认是关闭的，也就是说仅在当前活动虚拟网关失效时，备份虚拟网关才能成为活动虚拟网关，这与分配给那些虚拟网关的优先级无关。这种运作方式，与 HSRP 中用到的类似。

思科 IOS 软件允许管理员开启 GLBP 的抢占特性，这就令到在备份虚拟网关被指派了一个比当前活动虚拟网关更高的优先级值时，成为活动虚拟网关。默认 GLBP 的虚拟转发器抢占性方案是开启的，有一个 30 秒的延迟（By default, the GLBP virtual forwarder preemptive scheme is enabled with a delay of 30 seconds）。但这个延迟可由管理员手动调整。

### GLBP的权重

**GLBP Weighting**

GLBP采用了一种权重方案（a weighting scheme），来确定 GLBP 组中各台网关的转发容量。指派给 GLBP 组中某台网关的权重，可用于确定其是否要转发数据包，因此就可以依比例来确定该网关所要转发的 LAN 中主机的数据包了（the weighting assigned to a gateway in the GLBP group can be used to determine whether it will forward packets and, if so, the proportion of hosts in the LAN for which it will forward packets）。

每台网关都默认指派了 100 的权重。管理员可通过配置结合了 GLBP 的对象跟踪，比如接口及 IP 前缀跟踪，来进一步将网关配置为动态权重调整。在某个接口失效时，权重就被动态地降低一个指定数值，如此令到那些有着更高权重值的网关，用于转发比那些有着更低权重值的网关更多的流量。

此外，在某个 GLBP 组（成员）的权重降低到某个值时，还可设置一个阈值，用于关闭数据包的转发，且在权重值上升到另一与之时，又可自动开启转发。在当前活动虚拟转发器的权重掉到低权重阈值 30 秒时，备份虚拟转发器将成为活动虚拟转发器。

### GLBP负载共同分担

**GLBP Load Sharing**

GLBP支持以下三种方式的负载分担：

- 有赖于主机的，Host-dependent

- 轮转调度的，Round-robin

- 加权的，Weighted

在有赖于主机的负载共担下，生成虚拟路由器地址 ARP 请求的各台客户端，总是会在响应中收到同样的虚拟 MAC 地址。此方式为客户端提供了一致的网关 MAC 地址。

而轮询的负载共担机制，将流量平均地分发到组中作为活动虚拟转发器的所有网关（the round-robin load-sharing mechanism distributes the traffic evenly across all gateways participating as AVFs in the group）。这是默认的负载分担机制。

加权的负载分担机制，使用权重值来确定发送到某个特定 AVF 的流量比例。较高的权重值会带来更频繁的包含那台网关虚拟 MAC 地址的 ARP 响应。

### GLBP的客户端缓存

GLBP的客户端缓存，包含了使用到某个 GLBP 组作为默认网关的那些网络主机的信息。此缓存项目包含了关于发送了IPv4 ARP或IPv6 邻居发现（Neighbor Discovery, ND）请求主机，以及 AVG 指派了哪个转发器给它的信息，还有每台网络主机已被分配的 GLBP 转发器的编号，和当前分配给 GLBP 组中各台转发器的网络主机总数。

可以开启某个 GLBP 组的活动虚拟网关，来存储一个使用到此 GLBP 组的所有 LAN 客户端的客户端缓存数据库（a client cache database）。客户端缓存数据库最多可以存储 2000 个条目，但建议条目数不要超过 1000 。同时 GLBP 缓存的配置，是超出 CCNA 考试要求的，此特性可使用命令`glbp client-cache`进行配置，使用命令`show glbp detail`进行验证。

### 在网关上配置GLBP

在网关上配置 GLBP ，需要以下步骤：

1. 使用接口配置命令`ip address [address] [mask] [secondary]`，为网关接口配置正确的 IP 地址与子网掩码。

2. 通过接口配置命令`glbp [number] ip [virtual address] [secondary]`, 在网关接口上建立一个 GLBP 组，并给该组指派上虚拟 IP 地址。关键字`[secondary]`将该虚拟 IP 地址配置为指定组的第二网关地址。

3. 作为可选项，可通过接口配置命令`glbp [number] name [name]`，为该 GLBP 组指派一个名称。

4. 作为可选项，如打算对活动虚拟网关的选举进行控制，就要通过接口配置命令`glbp [number] priority [value]`，配置该组的优先级。

本小节中的 GLBP 示例，将基于下图34.26的网络：

![GLBP配置示例的拓扑](../images/3426.png)

*图 34.26 -- GLBP配置示例的拓扑*

> **注意：** 这里假定在`VTP-Server-1`与`VTP-Server-2`之间的 VLAN 与中继已有配置妥当，同时交换机之间可以经由VLAN192 `ping`通。为简短起见，这些配置已在配置示例中省略。

```console
VTP-Server-1(config)#interface vlan192
VTP-Server-1(config-if)#glbp 1 ip 192.168.1.254
VTP-Server-1(config-if)#glbp 1 priority 110
VTP-Server-1(config-if)#exit
VTP-Server-2(config)#interface vlan192
VTP-Server-2(config-if)#glbp 1 ip 192.168.1.254
VTP-Server-2(config-if)#exit
VTP-Server-3(config)#interface vlan192
VTP-Server-3(config-if)#glbp 1 ip 192.168.1.254
VTP-Server-3(config-if)#exit
VTP-Server-4(config)#interface vlan192
VTP-Server-4(config-if)#glbp 1 ip 192.168.1.254
VTP-Server-4(config-if)#exit
```

一旦该 GLBP 组已被配置，就可使用命令`show glbp brief`来查看该 GLBP 配置的摘要信息了，如同下面的输出所示：

```console
VTP-Server-1#show glbp brief
Interface   Grp  Fwd Pri State      Address         Active router   Standby router
Vl192       1    -   110 Active     192.168.1.254   local           192.168.1.4
Vl192       1    1   -   Active     0007.b400.0101  local           -
Vl192       1    2   -   Listen     0007.b400.0102  192.168.1.2     -
Vl192       1    3   -   Listen     0007.b400.0103  192.168.1.3     -
Vl192       1    4   -   Listen     0007.b400.0104  192.168.1.4     -

VTP-Server-2#show glbp brief
Interface   Grp  Fwd Pri State      Address         Active router   Standby router
Vl192       1    -   100 Listen     192.168.1.254   192.168.1.1     192.168.1.4
Vl192       1    1   -   Listen     0007.b400.0101  192.168.1.1     -
Vl192       1    2   -   Active     0007.b400.0102  local           -
Vl192       1    3   -   Listen     0007.b400.0103  192.168.1.3     -
Vl192       1    4   -   Listen     0007.b400.0104  192.168.1.4     -

VTP-Server-3#show glbp brief
Interface   Grp  Fwd Pri State      Address         Active router   Standby router
Vl192       1    -   100 Listen     192.168.1.254   192.168.1.1     192.168.1.4
Vl192       1    1   -   Listen     0007.b400.0101  192.168.1.1     -
Vl192       1    2   -   Listen     0007.b400.0102  192.168.1.2     -
Vl192       1    3   -   Active     0007.b400.0103  local           -
Vl192       1    4   -   Listen     0007.b400.0104  192.168.1.4     -

VTP-Server-4#show glbp brief
Interface   Grp  Fwd Pri State      Address         Active router   Standby router
Vl192       1    -   100 Standby    192.168.1.254   192.168.1.1     local
Vl192       1    1   -   Listen     0007.b400.0101  192.168.1.1     -
Vl192       1    2   -   Listen     0007.b400.0102  192.168.1.2     -
Vl192       1    3   -   Listen     0007.b400.0103  192.168.1.3     -
Vl192       1    4   -   Active     0007.b400.0104  local           -
```

从上面的输出可以看出，基于`VTP-Server-1`（192.168.1.1）有着优先级值110, 该值高于所有其它网关的优先级值，而已被选举作为活动虚拟网关。网关`VTP-Server-4`（192.168.1.4）, 由于有着剩下三台网关中最高的 IP 地址，而就算这三台网关有着同样的优先级值，被选举作备份虚拟网关。因此网关`VTP-Server-2`与`VTP-Server-3`都被置于侦听状态了。

命令`show glbp`将有关该 GLBP 组状态的详细信息打印了出来，下面对此命令的输出进行了演示：

```console
VTP-Server-1#show glbp
Vlan192 - Group 1
    State is Active
        2 state changes, last state change 02:52:22
    Virtual IP address is 192.168.1.254
    Hello time 3 sec, hold time 10 sec
        Next hello sent in 1.465 secs
    Redirect time 600 sec, forwarder time-out 14400 sec
    Preemption disabled
    Active is local
    Standby is 192.168.1.4, priority 100 (expires in 9.619 sec)
    Priority 110 (configured)
    Weighting 100 (default 100), thresholds: lower 1, upper 100
    Load balancing: round-robin
    Group members:
        0004.c16f.8741 (192.168.1.3)
        000c.cea7.f3a0 (192.168.1.2)
        0013.1986.0a20 (192.168.1.1) local
        0030.803f.ea81 (192.168.1.4)
    There are 4 forwarders (1 active)
    Forwarder 1
        State is Active
            1 state change, last state change 02:52:12
        MAC address is 0007.b400.0101 (default)
        Owner ID is 0013.1986.0a20
        Redirection enabled
        Preemption enabled, min delay 30 sec
        Active is local, weighting 100
    Forwarder 2
        State is Listen
        MAC address is 0007.b400.0102 (learnt)
        Owner ID is 000c.cea7.f3a0
        Redirection enabled, 599.299 sec remaining (maximum 600 sec)
        Time to live: 14399.299 sec (maximum 14400 sec)
        Preemption enabled, min delay 30 sec
        Active is 192.168.1.2 (primary), weighting 100 (expires in 9.295 sec)
    Forwarder 3
        State is Listen
        MAC address is 0007.b400.0103 (learnt)
        Owner ID is 0004.c16f.8741
        Redirection enabled, 599.519 sec remaining (maximum 600 sec)
        Time to live: 14399.519 sec (maximum 14400 sec)
        Preemption enabled, min delay 30 sec
        Active is 192.168.1.3 (primary), weighting 100 (expires in 9.515 sec)
    Forwarder 4
        State is Listen
        MAC address is 0007.b400.0104 (learnt)
        Owner ID is 0030.803f.ea81
        Redirection enabled, 598.514 sec remaining (maximum 600 sec)
        Time to live: 14398.514 sec (maximum 14400 sec)
        Preemption enabled, min delay 30 sec
        Active is 192.168.1.4 (primary), weighting 100 (expires in 8.510 sec)
```

当在活动虚拟网关上执行时，命令`show glbp`除了展示其它内容外，还会给出备份虚拟网关的地址和组中所有活动虚拟转发器的数目，以及由活动虚拟网关所指派给这些活动虚拟转发器的状态。同时还显示了各台活动虚拟转发器的虚拟 MAC 地址。



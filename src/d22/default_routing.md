# 使用 EIGRP 的默认路由

增强型 IGRP 支持数种动态地通告最后网关，或最后网络到路由域内其他路由器的方式。所谓最后网关，或默认路由，是目的网络未在路由表中明确列出时，路由器引导流量的一种方法。EIGRP 的这些方法如下：

- 使用 `ip default-network` 命令
- 使用 `network` 命令通告网络 `0.0.0.0/0`
- 重分发默认的静态路由
- 使用 `ip summary-address eigrp [asn] [network] [mask]` 命令


使用 `ip default-network` 命令，被视为是使用 EIGRP 动态通告默认路由的一种过时方法。不过，由于其在当前 IOS 软件版本中仍受支持，因此值得一提。

`ip default-network` 这条配置命令，通过在路由表中的某个网络旁插入星号 (`*`)，而将该网络标记为默认网络。那些没有特定路由数据表条目的目的地流量，随后就会被路由器转发到这个网络。这一特性的实现，通过参考下图 22.12 中的 EIGRP 拓扑得以演示。


![EIGRP的默认路由](../images/3612.png)

**图 22.12** -- **EIGRP 的默认路由**

参照图 22.12，假设 `200.10.10.0/24` 这个子网，连接到互联网。这个子网位于 `R1` 的 `FastEthernet0/0` 接口处。`R1` 和 `R2` 则通过一条背靠背的串行连接相连。两台路由器都位于 EIGRP 的 AS 150 中。要将 `200.10.10.0/24` 这个网络，标记为最后网络，那么以下配置便会在 `R1` 上部署：


```console
R1(config)#router eigrp 150
R1(config-router)#network 200.10.10.0 0.0.0.255
R1(config-router)#exit
R1(config)#ip default-network 200.10.10.0
R1(config)#exit
```

根据这一配置，`R2` 就会收到作为最后网络的 `200.10.10.0/24`，如下所示：

```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is 150.2.2.1 to network 200.10.10.0

D*   200.10.10.0/24 [90/2172416] via 150.2.2.1, 00:01:03, Serial0/0
     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
```

`network` 命令可用于通告某条指向某个物理接口，或某个逻辑接口，通常是 `NullO` 接口，的现有静态默认路由。

**注意**：所谓 `NullO` 接口，是路由器上的一个会丢弃路由到他的全部流量的虚拟接口。当咱们有条指向 `NullO` 的静态路由时，那么所有目的地为这条静态路由中所指定网络的流量，就会直接被丢弃。请将 `Null0` 接口当成一个黑洞：数据包会进入，但不会有任何数据包离开。他本质上是路由器上的一个比特垃圾桶。


参考上图 22.11 中的示意图，`network` 命令与某条现有默认静态路由的结合用法，在以下 `R1` 上的配置中得以演示：

```console
R1(config)#ip route 0.0.0.0 0.0.0.0 FastEthernet0/0
R1(config)#router eigrp 150
R1(config-router)#network 0.0.0.0
R1(config-router)#exit
```


基于这一配置，`R2` 上的 IP 路由表在以下输出中得以演示：


```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is 150.1.1.1 to network 0.0.0.0

D    200.10.10.0/24 [90/2172416] via 150.1.1.1, 00:01:11, Serial0/0
     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
D*   0.0.0.0/0 [90/2172416] via 150.1.1.1, 00:00:43, Serial0/0
```


虽然路由重新分配不属于 CCNA 考试的一部分，但其还是将在此概述一下。这是经由 EIGRP 通告一条默认路由的第三种方式。要将这条现有静态默认路由，重分发到 EIGRP 中，就要使用 `redistribute static metric [bandwidth] [delay] [reliability] [load] [MTU]` 这条路由器配置命令。用于这个小节前面输出的同一网络拓扑，将用于演示这一方式的实施，如下图 22.13 中所示。


![EIGRP的默认路由（续）](../images/3613.png)

<a name="f-22.13"></a>
**图 22.13** -- **EIGRP 的默认路由**（续）

参照图 22.13，以下命令会于 `R1` 上执行：

```console
R1(config)#ip route 0.0.0.0 0.0.0.0 FastEthernet0/0
R1(config)#router eigrp 150
R1(config-router)#redistribute static metric 100000 100 255 1 1500
R1(config-router)#exit
```


**注意**： 在运用这条命令时，`metric` 选项中用到的那些值，可从其中的接口推导出，或者咱们也可指定咱们想要的任何值。


基于这一配置，`R2` 上的路由表如下所示：


```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is 150.1.1.1 to network 0.0.0.0

     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
D*EX 0.0.0.0/0 [170/2195456] via 150.1.1.1, 00:01:16, Serial0/0
```

由于该路由是在 `R1` 上被重分发到 EIGRP 中的，因此他属于一条外部的 EIGRP 路由，正如上面输出所反映的那样。对于外部路由，EIGRP 拓扑主句表会包含诸如发起该路由的路由器、该路由被接收的协议，以及这条外部路由的度量值等信息。这点在以下输出中得以演示。


```console
R2#show ip eigrp topology 0.0.0.0/0
IP-EIGRP (AS 150): Topology entry for 0.0.0.0/0
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 2195456
  Routing Descriptor Blocks:
  150.1.1.1 (Serial0/0), from 150.1.1.1, Send flag is 0x0
      Composite metric is (2195456/51200), Route is External
      Vector metric:
        Minimum bandwidth is 1544 Kbit
        Total delay is 21000 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
      External data:
        Originating router is 1.1.1.1
        AS number of route is 0
        External protocol is Static, external metric is 0
        Administrator tag is 0 (0x00000000)
        Exterior flag is set
```


从上面的输出中，咱们可以看出，这条默认路由是条在 `R1` 上重分发到 EIGRP 中的静态路由。这条路由有着 0 的度量值。此外，咱们还可以看到，`R1` 的 EIGRP 路由器 ID (RID) 为 `1.1.1.1`。


最后一种通告默认路由的方式，是通过使用 `ip summary-address eigrp [asn] [network] [mask]` 这条接口配置命令。EIGRP 的路由摘要，将在这一教学模组稍后详细介绍 。目前，要着重于在使用 EIGRP 时，使用这条命令通告默认路由。

参考上 [图 22.13](#f-22.13) 中所示的网络拓扑图，`R1` 会以 `ip summary-address eigrp [asn] [network] [mask]` 这条接口配置命令，配置为通告默认路由到 `R2`，如下所示：

```console
R1(config)#interface Serial0/0
R1(config-if)#description ‘Back-to-Back Serial Connection To R2 Serial0/0’
R1(config-if)#ip summary-address eigrp 150 0.0.0.0 0.0.0.0
R1(config-if)#exit
```

使用这一命令的主要优点，是为让 EIGRP 通告网络 `0.0.0.0/0` 到其邻居路由器，某条默认路由或某个默认网络无需存在。在这条命令执行后后，本地路由器会生成一条到 `NullO` 接口的摘要路由，同时会将该条目标记为候选默认路由。这在以下输出中得以演示。

```console
R1#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is 0.0.0.0 to network 0.0.0.0

     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
D*   0.0.0.0/0 is a summary, 00:02:26, Null0
```

这条汇总路由会在 `R2` 上作为一条内部 EIGRP 路由被接收到，如下所示。

```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is 150.1.1.1 to network 0.0.0.0

     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
D*   0.0.0.0/0 [90/2297856] via 150.1.1.1, 00:03:07, Serial0/0
```

> *知识点*：
>
> - default routing using EIGRP
>
> + Enhanced IGRP supports numerous ways to dynamically advertise the gateway or network of last resort, to other routers within the routing domain
>   - using the `ip default-network` command
>   - using the `network` command to advertise network `0.0.0.0/0`
>   - redistributing the default static route
>   - using the `ip summary-address eigrp [asn] [network] [maske]` command
>
> + using the `ip default-network` command
>   - is considered a legacy method for dynamically advertising the default using EIGRP
>   - flags a network as the default network by inserting an asterisk(`*`) next to the network in the routing table
>   - traffic for destination to which there is no specific routing table entry, is then forwarded by the router to this network
>
> + using the `network` command
>   - to advertise an existing static default route point to either a physically or a logical interface, typically the `Null0` interface
>   - the `Null0` interface is a virtual interface on the router, that discards all traffic that is routed to it
>   - think of the `Null0` interface as a black hole: packets enter, but none ever leaves, it is essentially a bit-bucket on the router
>
> + redistributing the default static route
>   - is the third method of advertising a default route via EIGRP
>   - use the `redistribute static metric [bandwidth] [delay] [reliability] [load] [MTU]` router configuration command
>   - the values used in the `metric`, can be derived from the interface, or we can specify any values that we want when using this command
>   - the route redistributed into EIGRP, is an external EIGRP route
>   - for the external routes, the EIGRP topology table includes information such as the router that originated the route, the protocol the route was received for, and the metric of the external route, for example
>
> + using the `ip summary-address eigrp [asn] [network] [mask]` interface configuration command
>   - the primary advantage of this method, is that a default route or network does not need to exist in the routing table, in order for EIGRP to advertise network `0.0.0.0/0` to its neighbor routers
>   - when this command is issued, the local router generates a summary route to the `Null0` interface, and flags the entry as the candidate default route

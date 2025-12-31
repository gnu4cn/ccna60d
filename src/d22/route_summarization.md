# EIGRP 的路由汇总


路由汇总，减少了路由器所必须处理的信息量，这允许网络内的更快速收敛。汇总还通过隐藏网络内特定区域的详细拓扑信息，限制了受网络变化影响的区域大小。最后，正如这一教学模组前面所指出的，汇总用于定义 [EIGRP 的查询边界](./metrics_dual_and_topology_table.md#query-boundary)，EIGRP 支持两种类型的路由汇总，如下所示：

- 自动的路由汇总
- 手动的路由汇总


默认情况下，当 EIGRP 于路由器上启用时，自动的路由汇总即生效了。这是使用 `auto-summary` 命令实现的。这条命令允许 EIGRP 在有类边界处，执行自动的路由汇总。这一默认特性的运行，通过使用下图 22.15 中的网络拓扑得以演示。


![EIGRP的自动路由汇总](../images/3615.png)

<a name="f-22.15"></a>
**图 22.15** -- **EIGRP 的自动路由汇总**


参考图 22.15 中所示的 EIGRP 网络，`R1` 和 `R2` 正运行着 EIGRP，并使用着自治系统 150。子网 `10.1.1.0/24`、`10.2.2.0/24` 及 `10.3.3.0/24` 均直连到 `R1`，`R1` 正通过将这些路由发布到 `R2`。`R1` 和 `R2` 通过 `150.1.1.0/24` 子网（其是个不同于 `10.1.1.0/24`、`10.2.2.0/24` 和 `10.3.3.0/24` 子网的主网络）上的背靠背串行连接相连。根据连接到这些路由器的网络，默认情况下 EIGRP 将执行自动汇总，如下所示：

- 子网 `10.1.1.0/24`、`10.2.2.0/24` 及 `10.3.3.0/24`，将被汇总为 `10.0.0.0/8`
- 子网 `150.1.1.0/24` 将被汇总为 `150.1.0.0/16`


这种默认行为，可通过查看 `show ip protocols` 命令的输出加以验证。这一命令在 `R1` 上的输出如下所示。


```console
R1#show ip protocols
Routing Protocol is “eigrp 150”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Default networks flagged in outgoing updates
  Default networks accepted from incoming updates
  EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  EIGRP maximum hopcount 100
  EIGRP maximum metric variance 1
  Redistributing: eigrp 150
  EIGRP NSF-aware route hold timer is 240s
  Automatic network summarization is in effect
  Automatic address summarization:
    150.1.0.0/16 for Loopback1, Loopback2, Loopback3
      Summarizing with metric 2169856
    10.0.0.0/8 for Serial0/0
      Summarizing with metric 128256
  Maximum path: 4
  Routing for Networks:
    10.1.1.0/24
    10.2.2.0/24
    10.3.3.0/24
    150.1.1.0/24
  Routing Information Sources:
    Gateway         Distance      Last Update
    (this router)         90      00:03:12
    150.1.1.2             90      00:03:12
  Distance: internal 90 external 170
```

在上面的输出中，子网 `10.1.1.0/24`、`10.2.2.0/24` 和 `10.3.3.0/24`，已被自动汇总为 `10.0.0.0/8`。这个摘要地址，会从 `Serial0/0` 通告出去。子网 `150.1.1.0/24` 已被汇总为 `150.1.0.0/16`。这个摘要地址会从 `Loopback1`、`Loopback2` 及 `Loopback3` 通告出去。请记住，默认情况下，EIGRP 将在 EIGRP 路由启用了的所有接口上发出更新。


<a name="passive-interface"></a>
参考上面打印的输出，咱们可以看到，在某个 `Loopback` 接口上发送更新，是种资源浪费，因为某个设备无法物理连接到路由器的 `Loopback` 接口去监听此类更新。这种默认行为，可通过使用 `passive-interface` 这条路由器配置命令禁用，如下所示：


```console
R1(config)#router eigrp 150
R1(config-router)#passive-interface Loopback1
R1(config-router)#passive-interface Loopback2
R1(config-router)#passive-interface Loopback3
R1(config-router)#exit
```

这一配置的结果，便是 EIGRP 数据包不再从这些环回接口发出。因此，如下所示，摘要地址便不会从这些接口发出了。

```console
R1#show ip protocols
Routing Protocol is “eigrp 150”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Default networks flagged in outgoing updates
  Default networks accepted from incoming updates
  EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  EIGRP maximum hopcount 100
  EIGRP maximum metric variance 1
  Redistributing: eigrp 150
  EIGRP NSF-aware route hold timer is 240s
  Automatic network summarization is in effect
  Automatic address summarization:
    10.0.0.0/8 for Serial0/0
      Summarizing with metric 128256
  Maximum path: 4
  Routing for Networks:
    10.0.0.0
    150.1.0.0
  Passive Interface(s):
    Loopback0
    Loopback1
    Loopback2
    Loopback3
  Routing Information Sources:
    Gateway         Distance     Last Update
    (this router)         90     00:03:07
    150.1.1.2             90     00:01:12
  Distance: internal 90 external 170
```

**注意**：`passive-interface` 这条命令，会在这一教学模组稍后详细介绍。

继续自动汇总，在有类边界处的自动汇总后，EIGRP 会将到摘要地址的一条路由，安装到 EIGRP 的拓扑数据表与 IP 路由表中。这条会与那些更具体的条目，以及他们各自的直连接口一起，出现在下面的 EIGRP 拓扑数据表中。


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.0.0.0/8, 1 successors, FD is 128256
        via Summary (128256/0), Null0
P 10.3.3.0/24, 1 successors, FD is 128256
        via Connected, Loopback3
P 10.2.2.0/24, 1 successors, FD is 128256
        via Connected, Loopback2
P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
...
[Truncated Output]
```

在路由表中，这条摘要路由，是直连到 `NullO` 接口的。这条路由有着默认 5 的管理距离值。这在以下输出中得以演示：


```console
R1#show ip route 10.0.0.0 255.0.0.0
Routing entry for 10.0.0.0/8
  Known via “eigrp 150”, distance 5, metric 128256, type internal
  Redistributing via eigrp 150
  Routing Descriptor Blocks:
  * directly connected, via Null0
      Route metric is 128256, traffic share count is 1
      Total delay is 5000 microseconds, minimum bandwidth is 10000000 Kbit
      Reliability 255/255, minimum MTU 1514 bytes
      Loading 1/255, Hops 0
```

在 EIGRP 执行自动汇总时，路由器会通告摘要路由，并抑制那些更具体的路由。换句话说，在摘要路由被通告的同时，那些更具体路由，会在到 EIGRP 邻居的更新中被抑制。如下所示，这点可以通过查看 `R2` 上的路由表加以验证。


```console
R2#show ip route eigrp
D    10.0.0.0/8 [90/2298856] via 150.1.1.1, 00:29:05, Serial0/0
```

这种默认行为在一些诸如上 [图 22.12](#f-22.15) 中所示的基本网络中工作良好。但是，他会对不连续网络有着不利影响，所谓不连续网络，由一个将另一主网络分开的主网络构成，如下图 22.16 中所示。


![不连续网络](../images/3616.png)

**图 22.16** -- **不连续的网络**

> *译注*：
>
> - 原文这里插图编号有误，"Figure 23.13"
>
> - 本小节及前面小节中所提到的主网络，the major network，是指按网络大类分的网络，也就是 A 、 B 、 C 、 D 及 E 类网络。



参照图 22.16 中所示的图表，其中的主 `150.1.0.0/16` 网络，分开了两个主 `10.0.0.0/8` 的网络。在自动汇总被启用后，`R1` 和 `R2` 将同时把子网 `10.1.1.0/24` 和 `10.2.2.0/24`，分别汇总为 `10.0.0.0/8` 这个地址。这条汇总路由，都将以 `Null0` 的下一跳接口安装。而 `Null0` 接口是个 “二进制位垃圾桶”。任何发送到这个接口的数据包都会被丢弃。


由于两台路由器都只通告对方摘要地址，因此两台路由器都将无法到达另一路由器的 `10.x.x.x/24` 子网。要理解图 22.16 所示网络中的自动汇总影响，我们来从 `R1` 和 `R2` 上的配置开始，逐步深入如下：


```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0 0.0.0.255
R1(config-router)#network 150.1.1.0 0.0.0.255
R1(config-router)#exit
```

```console
R2(config)#router eigrp 150
R2(config-router)#network 10.2.2.0 0.0.0.255
R2(config-router)#network 150.1.1.0 0.0.0.255
R2(config-router)#exit
```


由于有类边界处的自动汇总，在两台路由器上都被默认启用，因此两台路由器均都将生成两个汇总地址：一个是 `10.0.0.0/8`，另一个是 `150.1.0.0/16`。这两个摘要地址都将指向 `NullO` 接口，同时 `R1` 上的路由表，将显示以下条目：


```console
R1#show ip route eigrp
     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
D       10.0.0.0/8 is a summary, 00:04:51, Null0
     150.1.0.0/16 is variably subnetted, 2 subnets, 2 masks
D       150.1.0.0/16 is a summary, 00:06:22, Null0
```

同样，`R2` 上的路由表也反映了同样情况，如下所示：

```console
R2#show ip route eigrp
     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
D       10.0.0.0/8 is a summary, 00:01:58, Null0
     150.1.0.0/16 is variably subnetted, 2 subnets, 2 masks
D       150.1.0.0/16 is a summary, 00:01:58, Null0
```

即使 `150.1.0.0/16` 的一个摘要地址，已被安装到 IP 路由表中，`R1` 和 `R2` 仍能互相 `ping` 通，因为更具体的路由条目（`150.1.1.0/24`）位于一个直连接口上。摘要路由中的那些更具体条目，可通过执行 `show ip route [address]imask] longer-prefixes` 命令查看。这条命令的输出，在下面 `150.1.0.0/16` 这条摘要的输出中得以演示。


```console
R1#show ip route 150.1.0.0 255.255.0.0 longer-prefixes
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is not set

     150.1.0.0/16 is variably subnetted, 2 subnets, 2 masks
C       150.1.1.0/24 is directly connected, Serial0/0
D       150.1.0.0/16 is a summary, 00:10:29, Null0
```

由于那条更具体的 `150.1.1.0/24` 路由条目存在，发送到 `150.1.1.2` 这个地址的数据包，将经由 `Serial0/0` 接口转发。这就实现了 `R1` 与 `R2` 之间的连通性，如下所示。


```console
R1#ping 150.1.1.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 150.1.1.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/3/4 ms
```

但是，由于没有具体路由条目存在，到主 `150.1.0.0/16` 网络任何其他子网的数据包，都将被发送到 `Null0` 这个接口。

到目前为之，一切似乎都井然有序。咱们可以看到，由于主 `150.1.0.0/16` 网络的更具体路由条目，`R1` 和 `R2` 可以互相 `ping` 通。但问题在于 `R1` 和 `R2` 上的那些主 `10.0.0.0/8` 网络子网之间的连通性。路由器 `R1` 显示了其所生成的 `10.0.0.0/8` 摘要地址的以下具体路由条目：


```console
R1#show ip route 10.0.0.0 255.0.0.0 longer-prefixes
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is not set

     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C       10.1.1.0/24 is directly connected, FastEthernet0/0
D       10.0.0.0/8 is a summary, 00:14:23, Null0
```

同样，路由器 `R2` 会显示其所生成的 `10.0.0.0/8` 摘要地址的以下具体条目：

```console
R2#show ip route 10.0.0.0 255.0.0.0 longer-prefixes
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is not set

     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C       10.2.2.0/24 is directly connected, FastEthernet0/0
D       10.0.0.0/8 is a summary, 00:14:23, Null0
```

两台路由器都没有到另一路由器的 `10.x.x.x/24` 子网的路由。例如，当 `R1` 尝试发送数据包到 `10.2.2.0/24` 时，那个摘要地址将被用到，同时这些数据包将被转发到 `NullO` 接口。这在以下输出中得以演示：


```console
R1#show ip route 10.2.2.0
Routing entry for 10.0.0.0/8
  Known via “eigrp 150”, distance 5, metric 28160, type internal
  Redistributing via eigrp 150
  Routing Descriptor Blocks:
  * directly connected, via Null0
      Route metric is 28160, traffic share count is 1
      Total delay is 100 microseconds, minimum bandwidth is 100000 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 0
```

如下所示，`R1` 将无法 `ping` 到 `R2` 上的 `10.x.x.x/24` 子网，反之亦然。

```console
R1#ping 10.2.2.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.2.2.2, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)
```

这个问题的两种解决方案如下：

- 在两台路由器上手动配置 `10.x.x.x/24` 子网的静态路由
- 禁用 EIGRP 的自动有类网络汇总


第一种选项非常基础。但是，静态路由的配置不具扩展性，而在大型网络中需要大量配置开销。第二个选项，同时也是推荐的选项，既具备扩展性，同时相比第一种所需的配置开销也更少。如下所示，自动的汇总，是通过执行 `no auto-summary` 命令禁用的（在较新的 IOS 版本中，其默认已禁用）：

```console
R1(config)#router eigrp 150
R1(config-router)#no auto-summary
R1(config-router)#exit
```

```console
R2(config)#router eigrp 150
R2(config-router)#no auto-summary
R2(config-router)#exit
```

这一配置的结果，便是主网络的那些具体路由，同时会由两个路由器通告。摘要路由不会被生成，如下所示。

```console
R2#show ip route eigrp
     10.0.0.0/24 is subnetted, 2 subnets
D       10.1.1.0 [90/2172416] via 150.1.1.1, 00:01:17, Serial0/0
```

`10.x.x.x/24` 子网之间的 IP 连通性，可使用一次简单的 `ping` 验证，如下所示。

```console
R2#ping 10.1.1.1 source 10.2.2.2 repeat 10
Type escape sequence to abort.
Sending 10, 100-byte ICMP Echos to 10.1.1.1, timeout is 2 seconds:
Packet sent with a source address of 10.2.2.2
!!!!!!!!!!
Success rate is 100 percent (10/10), round-trip min/avg/max = 1/3/4 ms
```

在我们提及手动的路由汇总（不在考试大纲中）前，重要的是要清楚，除非某个内部将包含在摘要路由中，否则 EIGRP 不会自动汇总外部网络。要更好地地理解这一概念，请参阅下图 22.17，其演示了个基本的 EIGRP 网络。


![对外部网络的汇总](../images/3617.png)

**图 22.17** -- **汇总外部网络**

参考图 22.17，`R1` 正在重分发（这使他们成为外部网络），并随后在经由 EIGRP 通告 `10.0.0.0/24`、`10.1.1.0/24`、`10.2.2.0/24` 和 `10.3.3.0/24` 这些外部网络。自动的路由汇总在 `R1` 上是启用的。`R1` 上的初始配置如下：


```console
R1(config)#router eigrp 150
R1(config-router)#redistribute connected metric 8000000 5000 255 1 1514
R1(config-router)#network 150.1.1.1 0.0.0.0
R1(config-router)#exit
```

`show ip protocols` 命令显示，EIGRP 在 `Serial0/0` 上是启用的，并正在重分发那些直连网络。自动汇总也是启用的，如下所示。


```console
R1#show ip protocols
Routing Protocol is “eigrp 150”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Default networks flagged in outgoing updates
  Default networks accepted from incoming updates
  EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  EIGRP maximum hopcount 100
  EIGRP maximum metric variance 1
  Redistributing: connected, eigrp 150
  EIGRP NSF-aware route hold timer is 240s
  Automatic network summarization is in effect
  Maximum path: 4
  Routing for Networks:
    150.1.1.1/32
Routing Information Sources:
Gateway             Distance        Last Update
150.1.1.2                 90        00:00:07
  Distance: internal 90 external 170
```

正如前一示例所示，由于这些 `10.x.x.x/24` 前缀均为外部路由，因此 EIGRP 将不会自动汇总这些前缀。因此，EIGRP 将不会添加一条汇总路由，到拓扑数据表与 IP 路由表中。者在以下输出中得以演示：


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.0.0.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
P 10.1.1.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
P 10.2.2.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
P 10.3.3.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
...

[Truncated Output]
```


如下所示，这些具体路由条目，会作为一些外部 EIGRP 路由通告给 `R2`：


```console
R2#show ip route eigrp
     10.0.0.0/24 is subnetted, 4 subnets
D EX    10.3.3.0 [170/3449856] via 150.1.1.1, 00:07:02, Serial0/0
D EX    10.2.2.0 [170/3449856] via 150.1.1.1, 00:07:02, Serial0/0
D EX    10.1.1.0 [170/3449856] via 150.1.1.1, 00:07:02, Serial0/0
D EX    10.0.0.0 [170/3449856] via 150.1.1.1, 00:07:02, Serial0/0
```


现在，假设子网 `10.0.0.0/24` 是个内部网络，而子网 `10.1.1.0/24`、`10.2.2.0/24` 和 `10.3.3.0/24` 均为一些外部路由。由于将构成有类摘要地址 `10.0.0.0/8` 的这些路由之一，是条内部路由，因此 EIGRP 就将创建一个摘要地址，并将这条内部路由，包含在 EIGRP 的拓扑数据表及 IP 路由表中。`show ip protocols` 命令显示，网络 `10.0.0.0/24` 现在是个内部的 EIGRP 网络，如下所示。


```console
R1#show ip protocols
Routing Protocol is “eigrp 150”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Default networks flagged in outgoing updates
  Default networks accepted from incoming updates
  EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  EIGRP maximum hopcount 100
  EIGRP maximum metric variance 1
  Redistributing: connected, eigrp 150
  EIGRP NSF-aware route hold timer is 240s
  Automatic network summarization is in effect
  Automatic address summarization:
    150.1.0.0/16 for Loopback0
      Summarizing with metric 2169856
    10.0.0.0/8 for Serial0/0
      Summarizing with metric 128256
  Maximum path: 4
  Routing for Networks:
    10.0.0.1/32
    150.1.1.1/32
  Routing Information Sources:
    Gateway         Distance        Last Update
    (this router)         90        00:00:05
    150.1.1.2             90        00:00:02
  Distance: internal 90 external 170
```

在上面的输出中，由于 `10.0.0.0/24` 这个内部子网，属于聚合地址的一部分，因此 EIGRP 的自动汇总，已生成了 `10.0.0.0/8` 的摘要地址。EIGRP 的拓扑数据表，显示了外部与内部条目，以及这个摘要地址，如下所示。


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.0.0.0/8, 1 successors, FD is 128256
        via Summary (128256/0), Null0
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
P 10.1.1.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
P 10.2.2.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
P 10.3.3.0/24, 1 successors, FD is 1280256
        via Rconnected (1280256/0)
...

[Truncated Output]
```

正如以下输出中所示，这次就只有一条路由被通告到 `R2`：

```console
R2#show ip route eigrp
D    10.0.0.0/8 [90/2297856] via 150.1.1.1, 00:04:05, Serial0/0
```

从 `R2` 的角度看，这只是一条内部的 EIGRP 路由。换句话说，该路由器并不知道，这个摘要地址还包含了外部路由，如下所示。

```console
R2#show ip route 10.0.0.0 255.0.0.0
Routing entry for 10.0.0.0/8
  Known via “eigrp 150”, distance 90, metric 2297856, type internal
  Redistributing via eigrp 150
  Last update from 150.1.1.1 on Serial0/0, 00:05:34 ago
  Routing Descriptor Blocks:
  * 150.1.1.1, from 150.1.1.1, 00:05:34 ago, via Serial0/0
      Route metric is 2297856, traffic share count is 1
      Total delay is 25000 microseconds, minimum bandwidth is 1544 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
```

如下所示，经由所接收到的那条摘要路由，`R2` 能够同时到达那个内部的 `10.0.0.0/24` 网络，以及别的外部 `10.x.x.x/24` 网络。

```console
R2#ping 10.0.0.1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms

R2#ping 10.3.3.1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.3.3.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/3/4 ms
```

与 EIGRP 的自动汇总不同，EIGRP 的手动路由汇总，是通过使用 `ip summary-address eigrp [ASN] [network] [mask] [distance] [leak-map <name>]` 这条接口配置命令，在接口级别配置与实施的。默认情况下，EIGRP 的摘要地址，会指派一个 5 的默认管理距离值。这种默认指派，可通过指定由 `[distance]` 关键字指定的所需管理距离值加以修改。

（由于手动摘要不在 CCNA 考试大纲中，我们将不再详述。）

> *译注*：以下内容为早期版本中的内容，已在第 4 版中移除。

默认情况下，在配置了手动的路由汇总时，EIGRP 将不通告落在汇总后网络条目中的那些更具体路由条目。`[1eak-map <name>]` 关键字可被配置来允许 EIGRP 的路由泄漏，其中 EIGRP 会允许一些指定的具体路由条目，与摘要地址一起得以通告。那些未在泄漏映射中指定的条目，仍将被抑制。

在手动汇总路由时，重要的是要尽可能具体。否则，配置便可能以早先曾描述过的有关不连续网络的示例类似方式，导致流量黑洞。这一概念在下图 22.18 中得以演示。

![不良路由汇总下的流量黑洞问题](../images/3618.png)

**图 22.18** -- **不良路由摘要下的黑洞流量**


参考图 22.18，当一个 `10.0.0.0/8` 的手动摘要地址，于两台路由器上同时配置了时，那么那些更具体前缀就会被抑制。由于 EIGRP 还会以 `Null0` 的下一跳接口，同时安装一条到这个摘要地址的路由到 EIGRP 拓扑数据表及 IP 路由表中，因此在不连续网络的自动摘要下曾遇到过的同样问题，在这个网络中也会遇到，同时两台路由器上的相应子网，都将无法相互通信。

此外，重要的是要理解，当在网络中部署不良时，路由汇总会导致网络中的次优路由问题。这一概念在下图 22.19 中得以演示：

![路由汇总下的次优路由问题](../images/3619.png)

**图 22.19** -- **路由汇总下的次优路由问题**

默认情况下，在一条 EIGRP 的摘要路由被创建时，路由器会以与所有那些更具体路由中相等的最小度量值，通告这个摘要地址。换句话说，这个摘要地址将有着与包含在这个摘要地址创建过程中，最低、最具体路由的同一度量值。

参考图 22.19 中所示的网络拓扑，`R2` 和 `R3` 都在通告摘要地址 `10.0.0.0/8` 到 `R1`。这个摘要地址由更具体的 `10.4.4.0/24` 和 `10.6.6.0/24` 两个前缀构成。两个路由器上的摘要地址同时用到的度量值，是以下表 22.5 中所示方式计算出的：

**表 22.5** -- **摘要路由的度量值计算**

| 起点（路由器） | 到 `10.4.4.0/24` 的度量值 | 到 `10.6.6.0/24` 的度量值 |
| ----- | -----: | -----: |
| `R2` | 5 + 5 = 10 | 5 + 45 + 5 + 5 = 60 |
| `R3` | 5 + 45 + 5 = 55 | 5 + 5 + 5 = 15 |


根据表 22.5 中的度量值计算，对于源自 `R1` 的流量，`R2` 无疑有着到 `10.4.4.0/24` 的最低度量值路径，而对于源自 `R1` 的流量，`R3` 这有着到 `10.6.6.0/24` 的最低度量值路径。但是，当 `10.0.0.0/8` 这个摘要地址被通告到 `R1` 时，这个摘要地址会使用这个摘要所构成的所有路由中，最低的最小度量值。基于这个示例，`R2` 会以 10 的度量值，通告这个摘要地址到 `R1`。`R3` 会遵循同一逻辑，以 15 的度量值通告这条摘要路由到 `R1`。

当 `R1` 收到来自 `R2` 和 `R3` 的两条摘要路由时，他会使用有着最低度量值的那条，经由 `R2` 转发以包含于 `10.0.0.0/8` 这个主类网络中的那些子网为目的地的流量。这点在下图 22.20 中得以演示：

![路由汇总下的次优路由](../images/3620.png)

**图 22.20** -- **路由摘要下的次优路由问题**


参照图 22.20，咱们可以清楚看到，虽然这是 `10.4.4.0/24` 子网的最优路径，但其却是 `10.6.6.0/24` 子网的次优路径。因此，在网络中部署路由汇总前，掌握网络拓扑结构就非常重要。

回到使用 EIGRP 时的手动路由汇总配置，下图 22.21 所示的网络拓扑，将用于演示手动的路由汇总与路由泄漏：


![EIGRP手动路由汇总的配置](../images/3621.png)

**图 22.21** -- **配置 EIGRP 的手动路由汇总**


根据 `R1` 上所配置的接口，`R2` 上的路由表，会显示以下条目：


```console
R2#show ip route eigrp
     10.0.0.0/24 is subnetted, 4 subnets
D       10.3.3.0 [90/2297856] via 150.1.1.1, 00:00:14, Serial0/0
D       10.2.2.0 [90/2297856] via 150.1.1.1, 00:00:14, Serial0/0
D       10.1.1.0 [90/2297856] via 150.1.1.1, 00:00:14, Serial0/0
D       10.0.0.0 [90/2297856] via 150.1.1.1, 00:00:14, Serial0/0
```


要汇总 `R1` 上的这些条目，以及要通告一条具体路由，那么以下配置就要应用到 `R1` 的 `Serial0/0` 接口：


```console
R1(config)#interface Serial0/0
R1(config-if)#ip summary-address eigrp 150 10.0.0.0 255.252.0.0
R1(config-if)#exit
```

这一配置之后，摘要条目 `10.0.0.0/14` 就会被安装到 `R1` 上的 EIGRP 拓扑数据表与 IP 路由表中。EIGRP 的拓扑数据表条目如下：


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
P 10.0.0.0/14, 1 successors, FD is 128256
        via Summary (128256/0), Null0
P 10.3.3.0/24, 1 successors, FD is 128256
        via Connected, Loopback3
P 10.2.2.0/24, 1 successors, FD is 128256
        via Connected, Loopback2
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
...
[Truncated Output]
```

路由表条目也反映了这条有着 `Null0` 的下一跳接口的摘要路由，如下所示：

```console
R1#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route
Gateway of last resort is not set
     10.0.0.0/8 is variably subnetted, 5 subnets, 2 masks
C       10.3.3.0/24 is directly connected, Loopback3
C       10.2.2.0/24 is directly connected, Loopback2
C       10.1.1.0/24 is directly connected, Loopback1
C       10.0.0.0/24 is directly connected, Loopback0
D*      10.0.0.0/14 is a summary, 00:02:37, Null0
     150.1.0.0/24 is subnetted, 1 subnets
C       150.1.1.0 is directly connected, Serial0/0
     150.2.0.0/24 is subnetted, 1 subnets
C       150.2.2.0 is directly connected, Serial0/1
```

同样，`show ip route [address] [mask] longer-prefixes` 这条命令可用于查看构成这条聚合路由，或摘要路由的那些具体路由条目，如 `R1` 上的以下输出中所示：


```console
R1#show ip route 10.0.0.0 255.252.0.0 longer-prefixes
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route
Gateway of last resort is not set
     10.0.0.0/8 is variably subnetted, 5 subnets, 2 masks
C       10.3.3.0/24 is directly connected, Loopback3
C       10.2.2.0/24 is directly connected, Loopback2
C       10.1.1.0/24 is directly connected, Loopback1
C       10.0.0.0/24 is directly connected, Loopback0
D       10.0.0.0/14 is a summary, 00:04:03, Null0
```

在 `R2` 上，`10.0.0.0/14` 这个摘要地址的单个路由条目会被收到，如下所示：

```console
R2#show ip route eigrp
     10.0.0.0/14 is subnetted, 1 subnets
D       10.0.0.0 [90/2297856] via 150.1.1.1, 00:06:22, Serial0/0
```


为强化有关摘要路由度量值的概念，假设 `R1` 上的那些路由，都是一些有着不同度量值的外部 EIGRP 路由（即，他们已被重分发到 EIGRP 中）。那么 `R1` 上的 EIGRP 拓扑数据表，就会显示以下内容：


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
P 10.0.0.0/24, 1 successors, FD is 10127872
        via Rconnected (10127872/0)
P 10.1.1.0/24, 1 successors, FD is 3461120
        via Rconnected (3461120/0)
P 10.2.2.0/24, 1 successors, FD is 2627840
        via Rconnected (2627840/0)
P 10.3.3.0/24, 1 successors, FD is 1377792
        via Rconnected (1377792/0)
...
[Truncated Output]
```

上一示例中配置在 `R1` 上同一个摘要地址，被再次配置为如下：


```console
R1(config)#int s0/0
R1(config-if)#ip summary-address eigrp 150 10.0.0.0 255.252.0.0
R1(config-if)#exit
```

基于这一配置，这条摘要路由，就会以一个等于其所包含的所有路由的最低度量值，被置于 EIGRP 的拓扑数据表与 IP 路由表中。根据早先给出的 `show ip eigrp topology` 命令的输出，那么这个汇总地址将被分配与分配给 `10.3.3.0/24` 前缀的同一度量值，如下所示：


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
    r - reply Status, s - sia Status
P 10.0.0.0/14, 1 successors, FD is 1377792
        via Summary (1377792/0), Null0
P 10.0.0.0/24, 1 successors, FD is 10127872
        via Rconnected (10127872/0)
P 10.1.1.0/24, 1 successors, FD is 3461120
        via Rconnected (3461120/0)
P 10.2.2.0/24, 1 successors, FD is 2627840
        via Rconnected (2627840/0)
P 10.3.3.0/24, 1 successors, FD is 1377792
        via Rconnected (1377792/0)
P 150.1.1.0/24, 1 successors, FD is 2169856
        via Connected, Serial0/0
```



# OSPF 的故障排除

再次强调，开放最短路径优先（OSPF），属于一种通告其链路状态的，开放标准的链路状态路由协议。当某个链路状态（LS）路由器开始在某条网络链路上运行时，与该逻辑网络相关的信息，就会被添加到其本地链路状态数据库（LSDB）中。这个本地路由器随后就会在其运行链路上，发送 `Hello` 报文，以确定是否有其他 LS 路由器也在接口上运行。OSPF 使用 IP 编号 80，直接运行在互联网协议（IP）上。

虽然深入研究所有潜在 OSPF 问题情况不大可能，但接下来的小节讨论了在 OSPF 作为 IGP 选项部署时，一些最常见的问题场景。


## 邻居关系的故障排除

运行 OSPF 的路由器，在建立邻接关系前，会经历数种状态。这些不同状态为 `Down`、`Attempt`、`Init`、`2-Way`、`Exstart`、`Exchange`、`Loading` 及 `Full` 状态。OSPF 邻接关系的首选状态，为 `Full` 状态。这种状态表明，两个邻居已交换了他们的整个数据库，同时双方有着对网络的同一视图。虽然 `Full` 状态是首选的邻接状态，但在邻接关系建立期间，两个邻居 “卡” 在其他状态之一是可能的。出于这一原因，为了问题的故障排除，了解要排查什么就很重要。


### 邻居数据表为空

OSPF 的邻居数据表可能为空的原因（即为何 `show ip ospf neighbor` 命令可能未产生任何结果）有数种。一些常见原因如下：

- 基本的 OSPF 错误配置
- 一层与二层的故障
- ACL 的过滤
- 接口的错误配置

所谓基本的 OSPF 配置错误，涵盖数种情况。例如，这些可能包括不匹配的计时器、区域 ID、认证参数，及末梢配置等。Cisco IOS 软件中有大量可用于排除基本 OSPF 配置错误的工具。例如，咱们可使用 `show ip protocols` 这条命令，确定出一些信息（如有关启用了 OSPF 的那些网络）；`show ip ospf` 这条命令，可用于确定区域配置及每个区域的接口；而 `show ip ospf interface brief` 这条命令，可在假设 OSPF 已针对接口启用时，用于确定出哪些接口位于哪个区域，以及这些接口已启用了哪些 OSPF 进程 ID。

另一种常见的错误配置，是正将接口指定为被动接口。当情况如此时，那么该接口将不发送 `Hello` 数据包，进而邻居关系也将不使用该接口建立。咱们可使用 `show ip protocols` 或 `show ip ospf interface` 命令，检查哪些接口已被配置或指定为被动接口。下面是后一命令在某个被动接口上的示例输出：

```console
R1#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
  Internet Address 172.16.0.1/30, Area 0
  Process ID 1, Router ID 10.1.0.1, Network Type POINT_TO_POINT, Cost: 64
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    oob-resync timeout 40
    No Hellos (Passive interface)
  Supports Link-Local Signaling (LLS)
  Index 1/1, flood queue length 0
  Next 0x0(0)/0x0(0)
  Last flood scan length is 0, maximum is 0
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 0, Adjacent neighbor count is 0
  Suppress hello for 0 neighbor(s)
```

最后，当在比如帧中继等一些 NBMA 技术上启用 OSPF 时，就要记住，邻居必须被静态配置，因为针对默认非广播的网络类型，OSPF 不会将组播传输用于邻居发现。这是在部署 OSPF 时，空邻居数据表的一种常见原因。我们将在 [WAN 部分](../d37/NBMA.md) 讨论 NBMA。

一层及二层故障，也会导致没有 OSPF 邻居关系信息。一层与二层的故障排除，已在前面的教学模组中详细介绍过。要使用诸如 `show interfaces` 等命令，检查接口状态（即线路协议），以及接口上任何接收到的错误。比如当启用 OSPF 的路由器，位于某个跨越多个交换机的 VLAN 中时，那么就要验证该 VLAN 内是否有端到端的连通性问题，以及是否所有端口或接口，都处于正确的生成树状态等。

ACL 的过滤，是导致邻接关系建立失败的另一种常见原因。为了排除此类问题，熟悉拓扑结构就非常重要。例如，当建立邻接关系失败的两台路由器，是经由不同物理交换机相连时，那么就可能是出于安全目的，在一些交换机上已配置的 ACL 过滤，正以 VACL 形式部署着。一项可指示出 OSPF 数据包，是否正被拦截或丢弃的有用故障排除工具，便是 `show ip ospf traffic` 这条命令，其会打印如以下输出所示的，有关传输及发送的 OSPF 数据包的信息。


```console
R1#show ip ospf traffic Serial0/0
    Interface Serial0/0

OSPF packets received/sent
    Invalid  Hellos   DB-des   LS-req    LS-upd    LS-ack    Total
Rx: 0        0        0        0         0         0         0
Tx: 0        6        0        0         0         0         6

OSPF header errors
  Length 0, Auth Type 0, Checksum 0, Version 0,
  Bad Source 0, No Virtual Link 0, Area Mismatch 0,
  No Sham Link 0, Self Originated 0, Duplicate ID 0,
  Hello 0, MTU Mismatch 0, Nbr Ignored 0,
  LLS 0, Unknown Neighbor 0, Authentication 0,
  TTL Check Fail 0,

OSPF LSA errors
  Type 0, Length 0, Data 0, Checksum 0,
```

在上面的输出中，要注意到这个本地路由器正在发送 OSPF 的 `Hello` 数据包，却未在接收任何数据包。当路由器上的配置正确时，那么就要检查这些路由器，或一些中间设备上的 ACL，确保 OSPF 数据包未正被过滤或丢弃。

空邻居数据表的另一种常见原因，是接口的错误配置。与 EIGRP 类似，OSPF 将不使用辅助接口地址，secondary interface addresses, 建立邻居关系。但与 EIGRP 不同，当接口的子网掩码不一致时，OSPF 也将不建立邻居关系。

即使接口子网掩码不同，启用 EIGRP 的路由器也会建立邻居关系。例如，当其中一台有着使用 `10.1.1.1/24` 的接口，另一台有着使用 `10.1.1.2/30` 接口的两台路由器，被配置为背靠背的 EIGRP 部署时，他们将成功建立邻居关系。但应注意的是，这种部署可能会导致这两台路由器之间的路由环路。除了不匹配的子网掩码外，启用 EIGRP 的路由器还会忽略最大传输单元 (MTU) 配置，并在即使两个接口 MTU 值不同的情况下，建立邻居关系。要使用 `show ip interfaces` 及 `show interfaces` 两条命令，验证 IP 地址及掩码配置。


### 路由通告的故障排除

正如 EIGRP 下的情形，有时咱们会发现，OSPF 未在通告某些路由。在大多数情况下，这通常是由于一些错误配置，而不是协议故障。这种问题的一些常见原因，包括以下这些：

- OSPF 未在接口上启用
- 接口已宕掉
- 接口地址在某一不同区域中
- OSPF 的错误配置


OSPF 未通告路由的一种常见原因，便是网络未经由 OSPF 通告。在当前的 Cisco 10S 版本中，网络可通过使用 `network` 这条路由器配置命令，或 `ip ospf` 这条接口配置命令予以通告。无论使用何种方法，`show ip protocols` 这条命令都可用于查看， OSPF 被配置为通告哪些网络，正如以下输出中可以看到的：

```console
R2#show ip protocols
Routing Protocol is “ospf 1”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Router ID 2.2.2.2
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Maximum path: 4
  Routing for Networks:
    10.2.2.0 0.0.0.128 Area 1
    20.2.2.0 0.0.0.255 Area 1
  Routing on Interfaces Configured Explicitly (Area 1):
    Loopback0
  Reference bandwidth unit is 100 mbps
  Routing Information Sources:
    Gateway         Distance        Last Update
    1.1.1.1         110             00:00:17
Distance: (default is 110)
```

此外，还要记住，咱们还可使用 `show ip ospf interfaces` 命令，找出哪些接口已启用 OSPF 等信息。除了网络配置外，当接口宕掉时，OSPF 也将不通告路由。咱们可以使用 `show ip ospf interface` 这条命令，确定出接口的状态，如下所示：


```console
R1#show ip ospf interface brief
Interface    PID   Area     IP Address/Mask    Cost   State   Nbrs F/C
Lo100        1     0        100.1.1.1/24       1      DOWN    0/0
Fa0/0        1     0        10.0.0.1/24        1      BDR     1/1
```

参考上面的输出，咱们可以看到 `Loopback100` 处于 `DOWN` 状态。再仔细观察，咱们就会看出，问题出在该接口已被管理性关闭上，如下输出中所示：


```console
R1#show ip ospf interface Loopback100
Loopback100 is administratively down, line protocol is down
  Internet Address 100.1.1.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type LOOPBACK, Cost: 1
  Enabled by interface config, including secondary ip addresses
  Loopback interface is treated as a stub Host
```

若咱们曾使用 `debug ip routing` 命令，调试过 IP 的路由事件，那么随后在这个 `Loopback100` 接口下，执行 `no shutdown` 命令，咱们就将看到以下输出：


```console
R1#debug ip routing
IP routing debugging is on
R1#conf t
Enter configuration commands, one per line.
R1(config)#interface Loopback100
R1(config-if)#no shutdown
R1(config-if)#end
R1#
*Mar 18 20:03:34.687: RT: is_up: Loopback100 1 state: 4 sub state: 1 line: 0 has_route: False
*Mar 18 20:03:34.687: RT: SET_LAST_RDB for 100.1.1.0/24
  NEW rdb: is directly connected

*Mar 18 20:03:34.687: RT: add 100.1.1.0/24 via 0.0.0.0, connected metric [0/0]
*Mar 18 20:03:34.687: RT: NET-RED 100.1.1.0/24
*Mar 18 20:03:34.687: RT: interface Loopback100 added to routing table
...

[Truncated Output]
```

当多个地址于某个接口下配置了时，那么所有辅助地址，都必须位于与主地址的同一区域中；否则，OSPF 将不会通告这些网络。比如，设想下图 25.3 中所示的这个网络拓扑。


![OSPF 的辅助子网通告](../images/3915.png)

**图 25.3** -- **OSPF 的辅助子网通告**

参考图 25.3，路由器 `R1` 与 `R2` 经由背靠背连接相连。这两台路由器共用了 `10.0.0.0/24` 这个子网。不过，`R1` 还在其 `FastEthernet0/0` 接口下，已配置了一些其他（辅助）子网，因此 `R1` 上的这一接口配置打印如下：


```console
R1#show running-config interface FastEthernet0/0
Building configuration...

Current configuration : 183 bytes

!
interface FastEthernet0/0
ip address 10.0.1.1 255.255.255.0 secondary
ip address 10.0.2.1 255.255.255.0 secondary
ip address 10.0.0.1 255.255.255.0
duplex auto
speed auto
end
```

OSPF 在 `R1` 与 `R2` 上均已启用。部署在 `R1` 上的配置如下：

```console
R1#show running-config | section ospf
router ospf 1
router-id 1.1.1.1
log-adjacency-changes
network 10.0.0.1 0.0.0.0 Area 0
network 10.0.1.1 0.0.0.0 Area 1
network 10.0.2.1 0.0.0.0 Area 1
```

部署在 `R2` 上的配置如下：

```console
R2#show running-config | section ospf
router ospf 2
router-id 2.2.2.2
log-adjacency-changes
network 10.0.0.2 0.0.0.0 Area 0
```


默认情况下，由于 `R1` 上的那些辅助子网，已被置于某个不同 OSPF 区域中，因此他们将不会被该路由器通告。这点可在 `R2` 上看到，当 `show ip route` 命令执行后，`R2` 会显示以下输出。


```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route

Gateway of last resort is not set

     10.0.0.0/24 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, FastEthernet0/0
```

要解决这一问题，这些辅助子网也必须指派给 `Area 0`，如下所示：

```console
R1(config)#router ospf 1
R1(config-router)#network 10.0.1.1 0.0.0.0 Area 0
*Mar 18 20:20:37.491: %OSPF-6-AREACHG: 10.0.1.1/32 changed from Area 1 to Area 0
R1(config-router)#network 10.0.2.1 0.0.0.0 Area 0
*Mar 18 20:20:42.211: %OSPF-6-AREACHG: 10.0.2.1/32 changed from Area 1 to Area 0
R1(config-router)#end
```

这一配置修改之后，这些网络现在便会被通告给路由器 `R2`，如下所示：


```console
R2#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static routeo - ODR, P - periodic downloaded static route

Gateway of last resort is not set

     10.0.0.0/24 is subnetted, 3 subnets
O       10.0.2.0 [110/2] via 10.0.0.1, 00:01:08, FastEthernet0/0
C       10.0.0.0 is directly connected, FastEthernet0/0
O       10.0.1.0 [110/2] via 10.0.0.1, 00:01:08, FastEthernet0/0
```

除上述三种常见原因外，糟糕的设计、部署，及错误配置，也是 OSPF 可能未按预期通告网络的另一原因。导致此类问题的常见设计问题，包括不连续或分区的骨干区域，及区域类型的错误配置，比如区域配置为了完全末梢区域等等。出于这一原因，扎实了解这种协议的工作原理，以及在咱们的环境中已被怎样实施部署等，就非常重要。这种了解，将大大简化故障排除过程，因为在咱们开始故障或问题的排除前，就已经赢了一半。

## OSPF 路由的故障排除

在这一教学模组的最后部分，我们将介绍一些更常用到的 OSPF 调试命令。OSPF 的调试，是通过使用 `debug ip ospf` 命令启用的。这条命令可与以下一些额外关键字结合使用：

```console
R1#debug ip ospf ?
  adj             OSPF adjacency events
  database-timer  OSPF database timer
  events          OSPF events
  flood           OSPF flooding
  hello           OSPF hello events
  lsa-generation  OSPF lsa generation
  mpls            OSPF MPLS
  nsf             OSPF non-stop forwarding events
  packet          OSPF packets
  retransmission  OSPF retransmission events
  spf             OSPF spf
  tree            OSPF database tree
```

其中 `debug ip ospf adj` 命令会打印出邻接事件的实时信息。在 OSPF 邻居邻接关系问题的故障排除时，这是一项有用的故障排除工具。以下是由这条命令打印的示例信息。以下示例演示了这条命令可怎样用于确定出MTU 的不匹配，正阻止着邻居邻接关系达到 `Full` 状态：


```console
R1#debug ip ospf adj
OSPF adjacency events debugging is on
R1#
*Mar 18 23:13:21.279: OSPF: DR/BDR election on FastEthernet0/0
*Mar 18 23:13:21.279: OSPF: Elect BDR 2.2.2.2
*Mar 18 23:13:21.279: OSPF: Elect DR 1.1.1.1
*Mar 18 23:13:21.279:        DR: 1.1.1.1 (Id)   BDR: 2.2.2.2 (Id)
*Mar 18 23:13:21.283: OSPF: Neighbor change Event on interface FastEthernet0/0
*Mar 18 23:13:21.283: OSPF: DR/BDR election on FastEthernet0/0
*Mar 18 23:13:21.283: OSPF: Elect BDR 2.2.2.2
*Mar 18 23:13:21.283: OSPF: Elect DR 1.1.1.1
*Mar 18 23:13:21.283:        DR: 1.1.1.1 (Id)   BDR: 2.2.2.2 (Id)
*Mar 18 23:13:21.283: OSPF: Rcv DBD from 2.2.2.2 on FastEthernet0/0 seq 0xA65 opt 0x52 flag 0x7 len 32 mtu 1480 state EXSTART
*Mar 18 23:13:21.283: OSPF: Nbr 2.2.2.2 has smaller interface MTU
*Mar 18 23:13:21.283: OSPF: NBR Negotiation Done. We are the SLAVE
*Mar 18 23:13:21.287: OSPF: Send DBD to 2.2.2.2 on FastEthernet0/0 seq 0xA65 opt 0x52 flag 0x2 len 192
*Mar 18 23:13:26.275: OSPF: Rcv DBD from 2.2.2.2 on FastEthernet0/0 seq 0xA65 opt 0x52 flag 0x7 len 32 mtu 1480 state EXCHANGE
*Mar 18 23:13:26.279: OSPF: Nbr 2.2.2.2 has smaller interface MTU
*Mar 18 23:13:26.279: OSPF: Send DBD to 2.2.2.2 on FastEthernet0/0 seq 0xA65 opt 0x52 flag 0x2 len 192
...

[Truncated Output]
```


从上面的输出，咱们可以得出结论，这个本地路由器上的 MTU 大于 1480 字节，因为这里的调试输出显示，邻居有着较小的 MTU 值。因此建议的解决方案，将是调整那个较小 MTU 值，从而使两个邻居有着同样的接口 MTU 值。这样做将将允许邻接关系达到 `Full` 状态。


`debug ip ospf lsa-generation` 这条命令，会打印有关 OSPF LSA 的信息。这条命令可用于在使用 OSPF 时，排除路由通告故障。以下是由这条命令打印的信息输出示例：


```console
R1#debug ip ospf lsa-generation
OSPF summary lsa generation debugging is on
R1#
R1#
*Mar 18 23:25:59.447: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on FastEthernet0/0 from FULL to DOWN, Neighbor Down: Interface down or detached
*Mar 18 23:25:59.511: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on FastEthernet0/0 from LOADING to FULL, Loading Done
*Mar 18 23:26:00.491: OSPF: Start redist-scanning
*Mar 18 23:26:00.491: OSPF: Scan the RIB for both redistribution and translation
*Mar 18 23:26:00.499: OSPF: max-aged external LSA for summary 150.0.0.0 255.255.0.0, scope: Translation
*Mar 18 23:26:00.499: OSPF: End scanning, Elapsed time 8ms
*Mar 18 23:26:00.499: OSPF: Generate external LSA 192.168.4.0, mask 255.255.255.0, type5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000001
*Mar 18 23:26:00.503: OSPF: Generate external LSA 192.168.5.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000001
*Mar 18 23:26:00.503: OSPF: Generate external LSA 192.168.1.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000001
*Mar 18 23:26:00.503: OSPF: Generate external LSA 192.168.2.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000001
*Mar 18 23:26:00.507: OSPF: Generate external LSA 192.168.3.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000001
*Mar 18 23:26:05.507: OSPF: Generate external LSA 192.168.4.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000006
*Mar 18 23:26:05.535: OSPF: Generate external LSA 192.168.5.0, mask 255.255.255.0, type 5, age 0, metric 20, tag 0, metric-type 2, seq 0x80000006
```

`debug ip ospf spf` 这条命令，提供有关一些最短路径优先算法事件的实时信息。这条命令可与以下关键字结合使用：

```console
R1#debug ip ospf spf ?
  external   OSPF spf external-route
  inter      OSPF spf inter-route
  intra      OSPF spf intra-route
  statistic  OSPF spf statistics
<cr>
```

与所有 `debug` 命令下的情形一样，在调试 SPF 事件前，应给予诸如网络规模，与路由器资源利用率等因素一些考量。以下是 `debug ip ospf spf statistic` 这条命令的一个输出示例：

```console
R1#debug ip ospf spf statistic
OSPF spf statistic debugging is on
R1#clear ip ospf process
Reset ALL OSPF processes? [no]: y
R1#
*Mar 18 23:37:27.795: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on FastEthernet0/0 from FULL to DOWN, Neighbor Down: Interface down or detached
*Mar 18 23:37:27.859: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on FastEthernet0/0 from LOADING to FULL, Loading Done

*Mar 18 23:37:32.859: OSPF: Begin SPF at 28081.328ms, process time 608ms
*Mar 18 23:37:32.859:       spf_time 07:47:56.328, wait_interval 5000ms
*Mar 18 23:37:32.859: OSPF: End SPF at 28081.328ms, Total elapsed time 0ms
*Mar 18 23:37:32.859: Schedule time 07:48:01.328, Next wait_interval 10000ms
*Mar 18 23:37:32.859: Intra: 0ms, Inter: 0ms, External: 0ms
*Mar 18 23:37:32.859: R: 2, N: 1, Stubs: 2
*Mar 18 23:37:32.859: SN: 0, SA: 0, X5: 0, X7: 0
*Mar 18 23:37:32.863: SPF suspends: 0 intra, 0 total
```


**注意**：开始故障排除过程时，在启用 SPF 的 `debug` 命令前，要先考虑使用 `show` 命令，比如 `show ip ospf statistics` 及 `show ip ospf` 两个命令。



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

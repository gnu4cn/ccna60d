

## OSPF的配置（Configuring OSPF）

以一行配置，就可以在路由器上开启基本的 OSPF ，并于随后通过添加 **网络语句**，来指明希望在哪些接口上运行 OSPF ，对于那些不打算通告的网络，则不予添加（Basic OSPF can be enabled on the router with one line of configuration, and then by adding the network statement that specifies on which interfaces you want to run OSPF, not necessarily networks you wish to advertise）:

1. `router ospf 9`，其中 `9` 是本地有意义的编号
2. `network 10.0.0.0 0.255.255.255 area 0`

在至少一个接口处于`up/up`状态之前， OSPF 都不会成为活动状态，并请记住要至少有一个区域必须为`Area 0`。下图39.14演示了一个示例性的 OSPF 网络：

![一个示例性 OSPF 网络](../images/3914.png)

*图 39.14 - 一个示例性 OSPF 网络*

其中路由器 A 的配置为：

```console
router ospf 20
network 4.4.4.4 0.0.0.0 area 0
network 192.168.1.0 0.0.0.255 area 0
router-id 4.4.4.4
```

路由器 B 的配置为：

```console
router ospf 22
network 172.16.1.0 0.0.0.255 area 0
network 192.168.1.0 0.0.0.255 area 0
router-id 192.168.1.2
```

路由器 C 的配置为：

```console
router ospf 44
network 1.1.1.1 0.0.0.0 area 1
network 172.16.1.0 0.0.0.255 area 0
router-id 1.1.1.1
router-id 1.1.1.1
RouterC#show ip route
Gateway of last resort is not set
     1.0.0.0/32 is subnetted, 1 subnets
C       1.1.1.1 is directly connected, Loopback0
     4.0.0.0/32 is subnetted, 1 subnets
O       4.4.4.4 [110/129] via 172.16.1.1, 00:10:39, Serial0/0/0
     172.16.0.0/24 is subnetted, 1 subnets
C       172.16.1.0 is directly connected, Serial0/0/0
O     192.168.1.0/24 [110/128] via 172.16.1.1, 00:10:39, Serial0/0/0
```

## OSPF的故障排除（Troubleshooting OSPF）

这里再度说明一下，开放路径优先协议，是一种就其链路状态进行通告的，开放标准的链路状态路由协议。在一台链路状态路由器于某条网络链路上开始运作时，那个逻辑网络的相关信息，就被添加到该路由器的本地的链路状态数据库中。随后该本地路由器就在其可用的那些链路上，发送`Hello`报文，来判断是否其它链路状态路由器也在接口上运行。 OSPF 使用 IP 编号`89`，直接允许在互联网协议上。

尽管要深入到所有潜在的 OSPF 故障场景是不可能的，不过接下来的小节，仍就在将 OSPF 部署为 IGP 的选择（the IGP of choice, [Interior Gateway Protocol](https://zh.wikipedia.org/wiki/%E5%86%85%E9%83%A8%E7%BD%91%E5%85%B3%E5%8D%8F%E8%AE%AE)）时，一些最为常见的故障场景进行了讨论。

### 邻居关系的故障排除

**Troubleshooting Neighbour Relationships**

运行 OSPF 的路由器在建立临接关系前，会度过好几种状态。这些不同状态分别是`Down`、`Attempt`、`Init`、`2-way`、`Exstart`、`Exchange`、`Loading`以及`Full` 状态。 OSPF 临接关系的首选状态是`Full`状态。该状态表明邻居已经完成了各自完整数据库的交换，并有着对网络的相同视图。但尽管`Full`状态是首选的临接状态，在临接关系建立的过程中，邻居们可能会“卡在”其它的某种状态中。由于这个原因，那么为了排除故障，就有必要掌握需要查找什么。

### 邻居表为空的情况（The Neighbour Table Is Empty）

对于邻居表可能为空的原因（也就是为何`show ip ospf neighbor`命令可能不产生任何输出），有好几种。常见的原因如下所示：

- 基础的 OSPF 错误配置（ misconfigurations ）
- 1层与 2 层故障
- 访问控制清单过滤掉了（ACL filtering）
- 接口的错误配置

基本的 OSPF 错误配置，涵盖了很多东西。其可以包括比如不匹配的计时器、区域 IDs 、认证参数及末梢配置等。思科 IOS 中有大量的工具，可用于对基本的 OSPF 错误配置进行故障排除。比如，可使用`show ip protocols`命令来判断信息（比如有关那些开启了 OSPF 的网络）；可使用`show ip ospf`命令，来判断区域配置及各区域的接口；以及使用`show ip ospf interface brief`命令来判断哪些接口位处哪些区域中，以及在假定接口已开启了 OSPF 时，判断出这些接口已对哪些 OSPF 进程开启了。

另一个常见的错误配置就是将接口指定为了被动接口（Another common misconfiguration is specifying the interface as passive）。如果真这样做了，那么该接口就不会发出`Hello`数据包，同时使用那个接口就不会建立邻居关系。既可使用`show ip protocols`，也可使用`show ip ospf interface`命令，来检查哪些接口被配置或指定为了被动接口。下面是在某个被动接口上的后一个命令的示例输出：

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

最后，当在帧中继这样的非广播多路访问技术上开启 OSPF 时，请记住必须静态地定义出邻居，因为对于默认的非广播网络类型的邻居发现， OSPF 不使用多播传输。在部署 OSPF ，这是一种常见的邻居表为空的原因。

1层与 2 层故障，也能导致 OSPF 临接关系的不形成。在先前的课程模块中，就曾详细介绍了 1 层与 2 层的故障排除。使用诸如`show interfaces`这样的命令来对接口状态（即线路协议），以及接口上接收到的任何错误进行检查。在开启 OSPF 的路由器处于跨越多台交换机的 VLAN 中时，比如应就该 VLAN 中有着端到端的连通性（end-to-end connectivity），以及所有端口或接口都处于正确的生成树状态进行检查。

访问控制清单过滤，是另一种常见的造成临接关系建立失败的原因。为排除此类故障，重要的是熟悉网络拓扑。比如，在建立某个临接关系失败的路由器是通过不同物理交换机进行连接的时，就可能为 ACL 过滤是以先前为安全目的，而已配置在交换机上的 VACL （VLAN ACL）的形式部署的。`show ip ospf traffic`命令，就是一个可找出 OSPF 数据包是被阻塞了还是被丢弃了的有用工具，其会打印出如下输出所演示的，有关发出的 OSPF 数据包的信息：

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

在上面的输出中，留意到本地路由器在发送OSPF`Hello`数据包但没有接收到任何东西。在路由器上的配置正确的情况下，就要对路由器或中间设备进行检查，以确保 OSPF 数据包未被过滤或丢弃。

空白邻居表的另一个常见原因，就是接口的不当配置。与 EIGRP 类似， OSPF 不会使用从接口地址建立邻居关系。但与 EIGRP 不同，在接口子网掩码不一致时， OSPF 也不会建立邻居关系。

就是接口子网掩码不同，开启了 EIGRP 的路由器也会建立邻居关系。比如有这样的两台路由器，其一有着使用地址`10.1.1.1/24`的一个接口，而另一台有着一个使用地址`10.1.1.2/30`的接口，它们被配置为背靠背的 EIGRP 实现（back-to-back EIGRP implementation），那么它们将成功地建立邻居关系。但应注意此类实现可能导致路由器之间的路由环回。处理不匹配的子网掩码，开启 EIGRP 的路由器也忽略最大传输单元（ MTU ）配置，而甚至在接口最大传输单元不同的情况下，建立邻居关系。使用`show ip interfaces`与`show interfaces`命令，就可对 IP 地址与掩码配置进行检查。

### 路由通告的故障排除（Troubleshooting Route Advertisement）

就像 EIGRP 的情况一样，有的时候可能会注意到 OSPF 没有对某些路由进行通告。大多数情况下，这都是由于一些错误配置，而非协议故障造成的（For the most part, this is typically due to some misconfigurations versus a protocol failure）。此类故障的一些常见原因包括下面这些：

- 接口上没有开启OSPF
- 接口宕掉了
- 接口地址出于不同的区域
- OSPF的错误配置

OSPF之所以不对路由器进行通告的一个常见原因，就是该网络未通过 OSPF 进行通告。在当前的思科 IOS 软件中，使用路由器配置命令`network`或接口配置命令`ip ospf`，就可使网络得以通告。不管使用哪种方式，都可以使用`show ip protocols`命令，来查看将 OSPF 配置为对哪些网络进行通告，就如同下面的输出中所看到的：

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

此外，请记住还可以使用`show ip ospf interfaces`命令来找出那些接口开启了 OSPF ，及其它一些信息。除了网络配置，若接口宕掉， OSPF 也不会对路由器进行通告。可使用`show ip ospf interfaces`命令，来确定接口状态，如下所示：

```console
R1#show ip ospf interface brief
Interface    PID   Area     IP Address/Mask    Cost   State   Nbrs F/C
Lo100        1     0        100.1.1.1/24       1      DOWN    0/0
Fa0/0        1     0        10.0.0.1/24        1      BDR     1/1
```

参考上面的输出，可看到`Loopback100`出于`DOWN`状态。细看就可以发现该故障是由于该接口已被管理性关闭，如下面的输出所示：

```console
R1#show ip ospf interface Loopback100
Loopback100 is administratively down, line protocol is down
  Internet Address 100.1.1.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type LOOPBACK, Cost: 1
  Enabled by interface config, including secondary ip addresses
  Loopback interface is treated as a stub Host
```

如使用`debug ip routing`命令对 IP 路由事件（IP routing events）进行调试，并于随后在`Loopback100`接口下执行`no shutdown`命令，那么就可以看到下面的输出：

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

当有多个地址配置在某个接口下时，所有次要地址都必须位处与主要地址相同的区域中；否则 OSPF 不会对这些网络进行通告。比如，考虑下图39.15中所演示的网络拓扑：

![OSPF的次要子网通告](../images/3915.png)

*图 39.15 - OSPF的次要子网通告*

参考图39.15， 路由器`R1`与`R2`通过一条背靠背的连接（a back-to-back connection）相连。这两台路由器共享了`10.0.0.0/24`子网。不过`R1`还配置了一些在其`FastEthernet0/0`接口下的额外（次要）子网，因此`R1`上该接口的配置就如下打印出来：

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

在`R1`与`R2`上都开启了 OSPF 。`R1`上部署的配置如下所示：

```console
R1#show running-config | section ospf
router ospf 1
router-id 1.1.1.1
log-adjacency-changes
network 10.0.0.1 0.0.0.0 Area 0
network 10.0.1.1 0.0.0.0 Area 1
network 10.0.2.1 0.0.0.0 Area 1
```

`R2`上部署的配置如下所示：

```console
R2#show running-config | section ospf
router ospf 2
router-id 2.2.2.2
log-adjacency-changes
network 10.0.0.2 0.0.0.0 Area 0
```

默认情况下，因为`R1`上的次要子网已被放入到一个不同的 OSPF 区域，所以它们不会被该路由器通告。这一点在`R2`上可以看到，在执行了`show ip route`命令时，就显示下面的输出：

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

为解决这个问题，就必须将那些次要子网，指派到`Area 0`，如下所示：

```console
R1(config)#router ospf 1
R1(config-router)#network 10.0.1.1 0.0.0.0 Area 0
*Mar 18 20:20:37.491: %OSPF-6-AREACHG: 10.0.1.1/32 changed from Area 1 to Area 0
R1(config-router)#network 10.0.2.1 0.0.0.0 Area 0
*Mar 18 20:20:42.211: %OSPF-6-AREACHG: 10.0.2.1/32 changed from Area 1 to Area 0
R1(config-router)#end
```

在此配置改变之后，那些网络就被通告给路由器`R2`了，如下所示：

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

除了上书三种常见原因，不良的设计、实现，以及错误配置，也是导致 OSPF 不如预期的那样对网络进行通告的一个原因。导致此类故障常见的设计问题，包括一个不连续或分区的骨干区域（a discontiguous or partitioned backbone）以及区域类型的错误配置，比如将区域配置为完全末梢的区域。对于这种原因，就要对 OSPF 的工作原理及其在自己的环境中如何部署有扎实掌握。这样的掌握将极大地简化故障排除过程，因为在故障排除之前，就已经赢得了战斗的一半了。

### OSPF路由故障的调试（Debugging OSPF Routing Issues）

在本课程模块的最后一节，将看看一些较为常用的 OSPF 调试命令。 OSPF 的调试，是通过使用`debug ip ospf`命令来开启的。该命令可结合下面这些额外关键字一起使用：

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

命令`debug ip osfp adj`将打印有关临接事件的实时信息。在对 OSPF 的邻居临接故障进行故障排除时，这是一个有用的故障排除工具。下面是一个由该命令打印的信息示例。下面的示例演示了如何使用该命令，来判断 MTU 不匹配而导致的无法到达`Full`状态，从而阻止了邻居临接的建立：

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

从上面的输出，可以推断出本地路由器上的 MTU 高于`1480`字节，因为该调试输出显示邻居有着较低的 MTU 值。推荐的解决方案将是调整该较低的 MTU 值，以令到两个邻居有着同样的接口 MTU 值。这就可以允许该临接达到`Full`状态。

命令`debug ip ospf lsa-generation`将打印出有关 OSPF 链路状态通告的信息。该命令可用于在使用 OSPF 时对路由通告的故障排除。下面是由该命令所打印的输出信息的一个示例：

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

命令`debug ip ospf spf`提供有有关最短路径优先算法事件的实时信息。该命令可以下面的关键字结合使用：

```console
R1#debug ip ospf spf ?
  external   OSPF spf external-route
  inter      OSPF spf inter-route
  intra      OSPF spf intra-route
  statistic  OSPF spf statistics
<cr>
```

与所有`debug`命令一样，在对 SPF 事件进行调试之前，都应对诸如网络大小及路由器上资源占用等因素加以考虑。下面是自`debug ip ospf spf statistic`命令的输出示例：

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

> **注意：** 在开始故障排除流程时，在开启 SPF 的`debug`命令之前，请优先考虑使用`show`命令，比如`show ip ospf statistics`与`show ip ospf`命令。

## 第 39 天问题

1. OSPF operates over IP number `_______`.
2. OSPF does NOT support VLSM. True or false?
3. Any router which connects to Area 0 and another area is referred to as an `_______` `_______` `_______` or `_______`.
4. If you have a DR, you must always have a BDR. True or false?
5. The DR/BDR election is based on which two factors?
6. By default, all routers have a default priority value of `_______`. This value can be adjusted using the `_______` `_______` `_______` `<0-255>` interface configuration command.
7. When determining the OSPF router ID, Cisco IOS selects the highest IP address of configured Loopback interfaces. True or false?
8. What roles do the DR and the BDR carry out?
9. Which command would put network `10.0.0.0/8` into `Area 0` on a router?
10. Which command would set the router ID to `1.1.1.1`?
11. Name the common troubleshooting issues for OSPF.

## 第 39 天答案

1. `89`.
2. False.
3. Area Border Router or ABR.
4. False.
5. The highest router priority and the highest router ID.
6. 1, `ip ospf priority` .
7. True.
8. To reduce the number of adjacencies required on the segment; to advertise the routers on the Multi-Access segment; and to ensure that updates are sent to all routers on the segment.
9. The `network 10.0.0.0 0.255.255.255 area 0` command.
10. The `router-id 1.1.1.1` command.
11. Neighbour relationships and route advertisement.



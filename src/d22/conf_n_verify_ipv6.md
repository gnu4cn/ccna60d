# 思科 IOS 软件中 EIGRPv6 的配置与验证

上一小节重点介绍了 EIGRPv4 与 EIGRPv6 之间的配置差异，这一小节继续介绍在 Cisco 10S 软件中，启用并验证 EIGRPv6 功能及路由的步骤序列：

1. 使用 `ipv6 unicast-routing` 这一全局配置命令，全局启用 IPv6 的路由。默认情况下，IPv6 的路由在 Cisco 10S 软件是禁用的；
2. 使用 `ipv6 router eigrp [asn]` 这条全局配置命令，配置一个或多个 EIGRPv6 的进程；
3. 当路由器上未配置带有 IPv4 地址的运行接口时，那么就要使用 `eigrp router-id [IPv4 Address]` 这条路由器配置命令，手动配置 EIGRPv6 的 RID；
4. 使用 `no shutdown` 这条路由器配置命令，启用 EIGRPv6 的进程；
5. 使用 `ipv6 address` 与 `ipv6 enable` 这两条接口配置命令，在所需接口上启用 IPv6；
6. 使用 `ipv6 eigrp [ASN]` 这条接口配置命令，在该接口下启用一个或多个 EIGRPv6 的进程。

由于自动汇总对 EIGRPv6 不适用，因此并无禁用这一行为的需要。为了巩固 EIGRPv6 的配置，请考虑下图 22.22 中所示的拓扑结构，其演示了一个由两台路由器构成的网络。两台路由器均将使用 `AS 1` 运行 EIGRPv6。路由器 `R3` 将经由 EIGRPv6 通告两条额外前缀：


![思科 IOS 软件中 EIGRPv6 的配置](../images/3801.png)

**图 22.22** -- **在思科 IOS 软件下配置 EIGRPv6**


按照上述的配置步骤顺序，EIGRPv6 将于路由器 `R1` 上被配置为如下：

```console
R1(config)#ipv6 unicast-routing
R1(config)#ipv6 router eigrp 1
R1(config-rtr)#eigrp router-id 1.1.1.1
R1(config-rtr)#no shutdown
R1(config-rtr)#exit
R1(config)#interface GigabitEthernet0/0
R1(config-if)#ipv6 address 3fff:1234:abcd:1::1/64
R1(config-if)#ipv6 enable
R1(config-if)#ipv6 eigrp 1
R1(config-if)#exit
```

按照同样的步骤顺序，EIGRPv6 的路由在路由器 `R3` 被被配置为如下：

```console
R3(config)#ipv6 unicast-routing
R3(config)#ipv6 router eigrp 1
R3(config-rtr)#eigrp router-id 3.3.3.3
R3(config-rtr)#no shutdown
R3(config-rtr)#exit
R3(config)#interface GigabitEthernet0/0
R3(config-if)#ipv6 address 3fff:1234:abcd:1::3/64
R3(config-if)#ipv6 enable
R3(config-if)#ipv6 eigrp 1
R3(config-if)#exit
R3(config)#interface GigabitEthernet0/1
R3(config-if)#ipv6 address 3fff:1234:abcd:2::3/64
R3(config-if)#ipv6 address 3fff:1234:abcd:3::3/64
R3(config-if)#ipv6 enable
R3(config-if)#ipv6 eigrp 1
R3(config-if)#exit
```

EIGRPv6 的验证过程与 EIGRPv4 的相同。首先，要验证 EIGRP 的邻居关系是否已成功建立。对于 EIGRPv6，这一步是使用 `show ipv6 eigrp neighbors` 命令完成的，如下所示：


```console
R1#show ipv6 eigrp neighbors
EIGRP-IPv6 Neighbors for AS(1)
H   Address              Interface Hold Uptime    SRTT   RTO Q   Seq
                                   (sec)          (ms)       Cnt Num
0   Link-local address:  Gi0/0      13  00:01:37  1200       0   3
    FE80::1AEF:63FF:FE63:1B00
```

正如早先所指出的，要注意到，下一跳地址（即 EIGRP 邻居的地址）被指定为链路本地地址，而非全球单播地址。由这条命令打印出的所有其他信息，均与 `show ip eigrp neighbors` 命令所打印的相同。要查看详细的邻居信息，咱们只要追加 `[detail]` 关键字到 `show ipv6 eigrp neighbors` 命令末尾即可。使用这一选项，就会打印有关 EIGRP 版本的信息，以及接收自该特定邻居的前缀数量，如下所示：


```console
R1#show ipv6 eigrp neighbors
EIGRP-IPv6 Neighbors for AS(1)
H   Address              Interface Hold Uptime    SRTT   RTO Q   Seq
                                   (sec)          (ms)       Cnt Num
0   Link-local address:  Gi0/0      13  00:01:37  1200       0   3
    FE80::1AEF:63FF:FE63:1B00
   Version 5.0/3.0, Retrans: 1, Retries: 0, Prefixes: 3
   Topology-ids from peer - 0
```

在 EIGRPv6 邻居关系的验证后，咱们随后便可验证路由信息。例如，要查看接收自 EIGRPv6 邻居的那些 IPv6 前缀，咱们就会使用 `show ipv6 route` 这一命令，如下输出中所示：


```console
R1#show ipv6 route eigrp
IPv6 Routing Table - default - 6 entries
Codes: C - Connected, L - Local, S - Static, U - Per-user Static route
       B - BGP, HA - Home Agent, MR - Mobile Router, R - RIP
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS inter area, IS - ISIS summary
       D - EIGRP, EX - EIGRP external, ND - Neighbor Discovery
D   3FFF:1234:ABCD:2::/64 [90/3072]
     via FE80::1AEF:63FF:FE63:1B00, GigabitEthernet0/0
D   3FFF:1234:ABCD:3::/64 [90/3072]
     via FE80::1AEF:63FF:FE63:1B00, GigabitEthernet0/0
```

要再次注意，所接收到的前缀，全都包含邻居的链路本地地址，作为所有接收到的前缀的下一跳 IPv6 地址。要查看 EIGRPv6 的拓扑数据表，`show ipv6 eigrp topology` 这条命令就要用到。这一命令支持与可用于查看 EIGRPv4 拓扑数据表的 `show ip eigrp topology` 命令同样的那些选项。根据所实施的配置，`R1` 上的拓扑数据表会显示以下这些 IPv6 前缀的信息：


```console
R1#show ipv6 eigrp topology
EIGRP-IPv6 Topology Table for AS(1)/ID(1.1.1.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
P 3FFF:1234:ABCD:2::/64, 1 successors, FD is 3072
        via FE80::1AEF:63FF:FE63:1B00 (3072/2816), GigabitEthernet0/0
P 3FFF:1234:ABCD:1::/64, 1 successors, FD is 2816
        via Connected, GigabitEthernet0/0
P 3FFF:1234:ABCD:3::/64, 1 successors, FD is 3072
        via FE80::1AEF:63FF:FE63:1B00 (3072/2816), GigabitEthernet0/0
```

正如 EIGRPv4 下的情形一样，咱们可追加一条前缀到这条命令的末尾，以便查看有关这一前缀或子网的详细信息。例如，要查看有关 `3FFF:1234:ABCD:2::/64` 这个子网的详细信息，咱们将只需输入 `show ipv6 eigrp topology 3FFF:1234:ABCD:2::/64` 这条命令，如下所示：

```console
R1#show ipv6 eigrp topology 3FFF:1234:ABCD:2::/64
EIGRP-IPv6 Topology Entry for AS(1)/ID(1.1.1.1) for 3FFF:1234:ABCD:2::/64
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 3072
  Descriptor Blocks:
  FE80::1AEF:63FF:FE63:1B00 (GigabitEthernet0/0), from FE80::1AEF:63FF:FE63:1B00, Send
flag is 0x0
      Composite metric is (3072/2816), route is Internal
      Vector metric:
        Minimum bandwidth is 1000000 Kbit
        Total delay is 20 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
        Originating router is 3.3.3.3
```

最后，一次简单的 `ping` 就可以，且应当用于验证子网之间的连通性。以下便是一次从 `R1` `ping` 向 `R3` 上的 `3FFF:1234:ABCD:2::3` 这个地址：

```console
R1#ping 3FFF:1234:ABCD:2::3 repeat 10
Type escape sequence to abort.
Sending 10, 100-byte ICMP Echos to 3FFF:1234:ABCD:2::3, timeout is 2 seconds:
!!!!!!!!!!
Success rate is 100 percent (10/10), round-trip min/avg/max = 0/0/4 ms
```

正如 EIGRPv4 下的情形，EIGRPv6 的默认协议值，可使用 `show ipv6 protocols` 命令加以验证，其输出结果已在下面打印出来。这条命令包含了那些启用了 EIGRP 实例的接口、路由重分发的信息（在适用时），以及手动指定或配置的点分十进制 EIGRPv6 路由器 ID。

```console
R1#show ipv6 protocols
IPv6 Routing Protocol is “eigrp 1”
EIGRP-IPv6 Protocol for AS(1)
  Metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  NSF-aware route hold timer is 240
  Router-ID: 1.1.1.1
  Topology : 0 (base)
    Active Timer: 3 min
    Distance: internal 90 external 170
    Maximum path: 16
    Maximum hopcount 100
    Maximum metric variance 1
  Interfaces:
    GigabitEthernet0/0
  Redistribution:
```



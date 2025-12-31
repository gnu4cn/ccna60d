# 理解 EIGRP 路由器 ID 的用法

OSPF 使用路由器 ID (RID) 来识别 OSPF 邻居，与 OSPF 不同，ERP RID 的主要用途是防止路由环路。RID 用于识别外部路由的发端路由器。如果收到的外部路由与本地路由器的 RID 相同，路由将被丢弃。此功能旨在减少在不止一个 ASBR 上执行路由重新分配的网络中出现路由环路的可能性。

# 掌握 EIGRP 路由器 ID 的用法

**Understanding the Use of the EIGRP Router ID**

与 OSPF 使用路由器 ID （the router ID, RID）来识别 OSPF 邻居不同，**EIGRP的 RID 主要用途是阻止路由环回的形成**。 RID 被**用于识别那些外部路由的起源路由器**（the primary use of the EIGRP RID is to prevent routing loops. The RID is used to identify the originating router for external routes）。假如接收到一条有着与本地路由器一致的 RID 外部路由，那么就会将其丢弃。设计此特性的目的，就是降低那些其中有着多台**自治系统边界路由器**（AS Boundary Router, ASBR）正进行路由重分发的网络中，出现路由环回的可能性。

在确定 RID 时，**EIGRP将选取路由器上所配置的 IP 地址中最高的作为RID**。**但如果在路由器上配置了环回接口，那么将优先选取这些接口，因为环回接口是路由器上存在的最稳定接口**。除非将 EIGRP 进程移除，那么 RID 随后就绝不会变化了（也就是，假如 RID 是手动配置的情况）。 RID 始终会在 EIGRP 拓扑表中列出，如下所示：

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
P 10.2.2.0/24, 1 successors, FD is 128256
        via Connected, Loopback2
P 10.3.3.0/24, 1 successors, FD is 128256
        via Connected, Loopback3
P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
P 150.1.1.0/24, 1 successors, FD is 2169856
        via Connected, Serial0/0
```

> **注意：** 这里重要的是掌握到 RID 与邻居 ID 通常是不同的，然而这对于那些比如只有一个接口的路由器可能不适用。（It is important to understand that the RID and the neighbour ID will typically be different, although this may not be the case in routers with a single interface, for example）。

EIGRP的路由器 ID （ RID ）是通过路由器配置命令`eigrp router-id [address]`进行配置的。在输入了此命令后， RID 就以这个新地址，在 EIGRP 的拓扑表中得以更新。为对此进行演示，这里就以查看路由器上的当前 RID 开始，如下面的拓扑表中所指出的：

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
...
[Truncated Output]
```

现在路由器上配置一个`1.1.1.1`的 RID ，如下所示：

```console
R1(config)#router eigrp 150
R1(config-router)#eigrp router-id 1.1.1.1
R1(config-router)#
*Mar 1 05:50:13.642: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 150.1.1.2 (Serial0/0) is down: route configuration changed
*Mar 1 05:50:16.014: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 150.1.1.2 (Serial0/0) is up: new adjacency
```

伴随这个改变， EIGRP 邻居关系就被重置了，同时在 EIGRP 拓扑表中立即反映出了这个新的 RID ，如下所示：

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(1.1.1.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
...
[Truncated Output]
```

在对 EIGRP 的路由器 ID （ RID ）进行配置时，应记住下面两点：

- 不能（无法）将 RID 配置为`0.0.0.0`
- 不能（无法）将 RID 配置为`255.255.255.255`

现在，源自该路由器的所有外部路由，就都包含了这个 EIGRP 路由器 ID 了。在下面的邻居路由器`R2`输出中，就可对此进行验证：

```console
R2#show ip eigrp topology 192.168.254.0/24
IP-EIGRP (AS 150): Topology entry for 192.168.254.0/24
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 7289856
  Routing Descriptor Blocks:
  150.1.1.1 (Serial0/0), from 150.1.1.1, Send flag is 0x0
      Composite metric is (7289856/6777856), Route is External
      Vector metric:
        Minimum bandwidth is 1544 Kbit
        Total delay is 220000 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
      External data:
        Originating router is 1.1.1.1
        AS number of route is 0
        External protocol is Connected, external metric is 0
        Administrator tag is 0 (0x00000000)
```

而对于内部 EIGRP 路由，则是不包含 RID 的，如下面的输出所示：

```console
R2#show ip eigrp topology 10.3.3.0/24
IP-EIGRP (AS 150): Topology entry for 10.3.3.0/24
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 2297856
  Routing Descriptor Blocks:
  150.1.1.1 (Serial0/0), from 150.1.1.1, Send flag is 0x0
      Composite metric is (2297856/128256), Route is Internal
      Vector metric:
      Minimum bandwidth is 1544 Kbit
      Total delay is 25000 microseconds
      Reliability is 255/255
      Load is 1/255
      Minimum MTU is 1500
      Hop count is 1
```

## 第 36 天问题

1. You can see the ASN with the `show ip _______` command.
2. Every router you want to communicate with in your routing domain must have a different ASN. True or false?
3. What is the purpose of the EIGRP topology table?
4. By default, EIGRP uses the `_______` bandwidth on the path to a destination network and the total `_______` to compute routing metrics.
5. Dynamic neighbour discovery is performed by sending EIGRP Hello packets to the destination Multicast group address `_______`.
6. EIGRP packets are sent directly over IP using protocol number `_______`.
7. To populate the topology table, EIGRP runs the `_______` algorithm.
8. The `_______` `_______` includes both the metric of a network as advertised by the connected neighbour, plus the cost of reaching that particular neighbour.
9. Cisco IOS software supports equal cost load sharing for a default of up to four paths for all routing protocols. True or false?
10. What EIGRP command can be used to enable unequal cost load sharing?

## 第 36 天问题答案

1. `protocols`.
2. False.
3. The topology table allows all EIGRP routers to have a consistent view of the entire network. All known destination networks and subnets that are advertised by neighbouring EIGRP routers are stored there.
4. Minimum, delay.
5. `224.0.0.10`.
6. 88.
7. DUAL.
8. Feasible Distance.
9. True.
10. The `variance` command.

## 第 36 天实验

**EIGRP的实验**

### 拓扑图

![EIGRP实验拓扑图](../images/3622.png)

### 实验目的

学习如何配置基本的 EIGRP 。

### 实验步骤

1. 基于上面的拓扑，配置上所有 IP 地址。确保可以经由串行链路`ping`通。

2. 在两台路由器上以自治系统编号30, 配置 EIGRP 。


    ```console
    RouterA(config)#router eigrp 30
    RouterA(config-router)#net 172.20.0.0
    RouterA(config-router)#net 10.0.0.0
    RouterA(config-router)#^Z
    RouterA#
    RouterB#conf t
    Enter configuration commands, one per line.
    End with CNTL/Z.
    RouterB(config)#router eigrp 30
    RouterB(config-router)#net 10.0.0.0
    %DUAL-5-NBRCHANGE: IP-EIGRP 30: Neighbor 10.0.0.1 (Serial0/1/0) is up: new adjacency
    RouterB(config-router)#net 192.168.1.0
    ```

3. 对两台路由器上的路由表分别进行检查。


    ```console
    RouterA#sh ip route
    Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP
           D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
           N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
           E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
           i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
           * - candidate default, U - per-user static route, o - ODR
           P - periodic downloaded static route
    Gateway of last resort is not set
         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:01:43, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
         172.20.0.0/16 is variably subnetted, 2 subnets, 2 masks
    D       172.20.0.0/16 is a summary, 00:01:43, Null0
    C       172.20.1.0/24 is directly connected, Loopback0
    D    192.168.1.0/24 [90/20640000] via 10.0.0.2, 00:00:49, Serial0/1/0
    RouterA#
    ```

    ```console
    RouterB#show ip route
    ...
    [Truncated Output]
    ...
         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:01:21, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
    D    172.20.0.0/16 [90/20640000] via 10.0.0.1, 00:01:27, Serial0/1/0
         192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
    D       192.168.1.0/24 is a summary, 00:01:21, Null0
    C       192.168.1.0/26 is directly connected, Loopback0
    RouterB#
    ```

4. 查明两台路由器都对各个网络进行着自动汇总。并于随后在路由器 B 上关闭自动汇总。


    ```console
    RouterB#show ip protocols
    Routing Protocol is “eigrp 30”
      Outgoing update filter list for all interfaces is not set
      Incoming update filter list for all interfaces is not set
      Default networks flagged in outgoing updates
      Default networks accepted from incoming updates
      EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
      EIGRP maximum hopcount 100
      EIGRP maximum metric variance 1
    Redistributing: eigrp 30
      Automatic network summarization is in effect
      Automatic address summarization:
        192.168.1.0/24 for Serial0/1/0
          Summarizing with metric 128256
        10.0.0.0/8 for Loopback0
          Summarizing with metric 20512000
      Maximum path: 4
      Routing for Networks:
         10.0.0.0
         192.168.1.0
      Routing Information Sources:
        Gateway         Distance      Last Update
        10.0.0.1        90            496078
      Distance: internal 90 external 170
    RouterB(config)#router eigrp 30
    RouterB(config-router)#no auto-summary
    ```

5. 对路由器 A 上的路由表进行检查。


    ```console
    RouterA#show ip route
    ...
    [Truncated Output]
    ...
    Gateway of last resort is not set
         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:00:04, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
         172.20.0.0/16 is variably subnetted, 2 subnets, 2 masks
    D       172.20.0.0/16 is a summary, 00:00:04, Null0
    C       172.20.1.0/24 is directly connected, Loopback0
         192.168.1.0/26 is subnetted, 1 subnets
    D       192.168.1.0 [90/20640000] via 10.0.0.2, 00:00:04, Serial0/1/0
    RouterA#
    ```

请访问[www.in60days.com](http://www.in60days.com)，免费观看作者完成此试验。


（End）




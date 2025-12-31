# 理解 EIGRP 路由器 ID 的用法


与使用路由器 ID (RID) 标识 OSPF 邻居的 OSPF 不同，EIGRP 的 RID 的主要用途，是防止路由环路。RID 用于标识外部路由的始发路由器。当某条有着与本地路由器同一 RID 的外部路由被收到的时，该路由将被丢弃。这一特性设计以减少其中路由重分发，正于不止一个自治系统边界路由器（ASBR）上执行的网络中，路由环路的可能性。

在确定出 RID 时，EIGRP 将选择配置于该路由器上最高的那个 IP 地址。当一些环回接口也配置在该路由器上时，那么这些接口将优先选择，因为环回接口是可存在于路由器上最稳定接口。除非 EIGRP 进程被移除（即当这个 RID 是个手动配置的时），RID 将永远不会更改。RID 将始终列在 EIGRP 的拓扑数据表中，如下所示。



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


**注意**：重要的是要明白，通常 RID 和邻居 ID 将是不同的，尽管对于那些只有一个接口的路由器，情况可能并非如此。

EIGRP 的 RID，是使用 `eigrp router-id [address]` 这条路由器配置命令配置的。在敲入这条命令后，RID 便会以 EIGRP 拓扑数据表中的新地址自动更新。要演示这点，我们来通过看看路由器上当前 RID 开始，如下面的拓扑数据表中所示：


```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
...
[Truncated Output]
```

一个 `1.1.1.1` 的 RID 现在要配置于该路由器上，如下所示：

```console
R1(config)#router eigrp 150
R1(config-router)#eigrp router-id 1.1.1.1
R1(config-router)#
*Mar 1 05:50:13.642: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 150.1.1.2 (Serial0/0) is down: route configuration changed
*Mar 1 05:50:16.014: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 150.1.1.2 (Serial0/0) is up: new adjacency
```

这个更改后，EIGRP 的邻居关系即被重置，同时这个新的 RID 会立即反映在 EIGRP 的拓扑数据表中，如下所示：

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(1.1.1.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
...
[Truncated Output]
```

在配置 EIGRP 的 RID 时，应记住以下两点：

- 不能将 RID 配置为 `0.0.0.0`
- 不能将 RID 配置为 `255.255.255.255`


由该路由器发起的所有外部路由，现在都会包含这个 EIGRP 的 RID。这点可在邻居路由器 `R2` 的以下输出得以验证：


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

如以下输出中所示，对于那些内部的 EIGRP 路由，这个 RID 则并未被包含：


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


请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

# OSPF 概述和基本原理

多份征求意见稿 (RFC）已针对 OSPF 编写。在这一小节中，我们将根据与 OSPF 有关的一些最常见 RFC，了解 OSPF 的历史。OSPF 工作组成立于 1987 年，此后其已发布了大量 RFC。一些有关 OSPF 的最常见 RFC 列出于下：

- [RFC 1131](https://www.rfc-editor.org/rfc/rfc1131) -- OSPF 规范
- [RFC 1584](https://datatracker.ietf.org/doc/html/rfc1584) -- OSPF 的多播扩展
- [RFC 1587](https://www.rfc-editor.org/rfc/rfc1587) -- OSPF 的 NSSA 选项
- [RFC 1850](https://datatracker.ietf.org/doc/html/rfc1850) -- OSPF 版本 2 的管理信息库
- [RFC 2328](https://datatracker.ietf.org/doc/html/rfc2328) -- OSPF 版本 2
- [RFC 2740](https://datatracker.ietf.org/doc/html/rfc2740) -- OSPF 版本 3

RFC 1131 描述了 OSPF 的第一次迭代，而其曾用于一些最初测试中，以确定该协议是否工作。

RFC 1584 提供了对 IP 组播流量支持的一些扩展到 OSPF。这通常称为组播的 OSPF（MOSPF）。不过，这项标准很少被用到，最重要的是，其未受思科支持。

RFC 1587 描述了一种 OSPF 次末梢区域（NSSA）的运行。所谓次末梢区域，通过使用一种次末梢区域的外部链路状态通告，允许外部路由知识由某个自治系统边界路由器（ASBR）注入。次末梢区域将在这一教学模组稍后详细介绍。

RFC 1850 通过使用简单网络管理协议（SNMP），实现了 OSPF 的网络管理。SNMP 被用在一些网络管理系统中，监控那些连接网络的设备，是否存在需要管理注意的情况。这项标准的部署实施，超出了 CCNA 考试要求的范围，而不会在这本指南介绍。

RFC 2328 细化了一些对 OSPF 版本 2 (OSPFv2) 的最新更新，这一版本便是如今在用的 OSPF 默认版本。OSPFv2 最初是在 RFC 1247 中描述的，这个 RFC 解决了在 OSPF 版本 1 (OSPFv1) 最初推出期间所发现的许多问题，并修改了该协议，以允许在不会产生向后兼容性问题下的更多修订。正因为如此，OSPFv2 不与 OSPFv1 兼容。

最后，RFC 2740 介绍了为支持 IPv6 而对 OSPF 的一些修订。应当假设这一教学模组中对 OSPF 的所有引用，都是针对 OSPFv2 的。

## 链路状态的基本原理

当针对某条链路启用链路状态的路由协议时，那么与该网络相关的信息，就会被添加到本地的链路状态数据库（LSDB）中。本地路由器随后便会在其的那些运行链路上发送 `Hello` 报文，以确定是否有别的链路状态路由器，也在这些接口上运行着。所谓 `Hello` 报文，被用于邻居发现，以及维护邻居路由器之间的邻接关系。这些报文将在这一教学模组稍后详细介绍。

某个邻居路由器被找到后，那么本地路由器就会尝试建立邻接关系，前提是两台路由器共享同一共同子网，并在同一区域中，同时诸如身份验证与定时器等其他参数均要一致。这种邻接关系，使得这两台路由器能够通告摘要 LSDB 信息给对方。这种交换不是具体的详细数据库信息。他是数据的摘要。


每个路由器都会根据其本地 LSDB 评估摘要信息，确保自己有着最新信息。当邻接关系的一侧，意识到其需要更新时，那么该路由器就会请求邻接路由器上的新信息。来自邻居的更新，包括了包含于 LSDB 中的具体数据。这一交换过程会一直持续到两个路由器有着一致的 LSDB。OSPF 使用不同类型报文，交换数据库信息，以及确保全体路由器有着网络的一致视图。这些不同数据包类型，将在这一教学模组稍后详细介绍。

交换数据库之后，SPF 算法便会运行，并创建出一棵到某个区域中，或网络主干中所有主机的最短路径树，以执行这次计算的路由器位于该树的根处。SPF 算法曾在第 17 天时简要介绍过。


## OSPF 基础知识


与可支持多种网络层协议的 EIGRP 不同，OSPF 只支持互联网协议 (IP)，具体就是 IPv4 与 IPv6。与 EIGRP 一样，OSPF 支持 VLSM 及身份验证，并在诸如以太网的多路访问网络上发送与接收更新时，使用 IP 的组播。


OSPF 是种会将网络，逻辑划分为一些称为区域的子域的层次化路由协议。这种逻辑划分，用于限制链路状态通告, Link State Advertisement, LSA, 在整个 OSPF 域中泛洪的范围。所谓链路状态通告，属于由运行着 OSPF 的路由器，所发送的一些特殊类型数据包。在区域内与区域间，不同类型的链路状态通告会被用到。通过限制某些 LSA 类型在区域间的传播，OSPF 的层次化实现有效地减少了 OSPF 网络内的路由协议流量数量。

在一个多区域的 OSPF 网络中，必须有个区域被指定为骨干区域，或 `Area 0`。所谓 OSPF 主干区域，便是这个 OSPF 网络的逻辑中心。所有其他非主干区域，都必须与这个主干区域物理相连。但是，由于在非骨干区域和骨干区域之间，建立物理连接并不总是可能或可行，因此 OSPF 标准允许到骨干区域虚拟连接的运用。这些虚拟连接，被称为虚拟链路，但这一概念并未包含在当前的 CCNA 考试大纲中。

每个区域内的路由器，都存储了其所在区域的详细拓扑信息。在每个区域内，有一台或多台称为区域边界路由器（ABR）的路由器，通过在不同区域间通告汇总路由信息，推动着区域间的路由。这项功能，实现了 OSPF 网络中的以下操作：

- 减了链路状态通告在整个 OSPF 域内泛洪的范围
- 隐藏了区域间的详细拓扑信息
- 实现了 OSPF 域内端到端的连通性
- 创建出了 OSPF 域内的逻辑边界

所谓 OSPF 主干区域，会接收来自 ABR 的汇总后的路由信息。这些路由信息会被散布到该 OSPF 网络中所有别的非骨干区域。当网络拓扑的一次变更发生时，这一信息就会在整个 OSPF 域内得以散布，从而允许所有区域内的全体路由器，都有着该网络的一致视图。下图 24.1 所示的网络拓扑，便是多区域 OSPF 部署的一个示例。

![一个多区域 OSPF 网络](../images/1201.png)

**图 24.1** -- **一个多区域的 OSPF 网络**


图 24.1 演示了个基本的多区域 OSPF 网络。`Area 1` 和 `Area 2` 与 OSPF 主干 的 `Area 0` 相连。在 `Area 1` 中，路由器 `R1`、`R2` 及 `R3` 交换着区域内的路由信息，并维护着该区域的详细拓扑结构。R3 作为区域边界路由器（ABR），生成了一条区域间摘要路由，并通告了这条路由到 OSPF 的主干区域。

`R4` 作为 `Area 2` 的 ABR，会收到来自 `Area 0` 的摘要信息，并会将其泛洪到他的邻接区域（译注：这里应为邻接路由器？）。这便允许路由器 `R5` 和 `R6`，获悉位于他们本地区域外，却在这个 OSPF 域内的那些路由。同一概念也适用于 `Area 2` 内的路由信息。


总之，这些 ABR 维护着他们所连接的全部区域的 LSDB 信息。而各个区域内的全体路由器，都有着与该特定区域相关的详细拓扑信息。这些路由器会交换区域内的路由信息。而那些 ABR 则会通告每个他们所连接区域的摘要信息，到别的 OSPF 区域，从而实现这个域内的区域间路由。

**注意**：OSPF 的区域边界路由器，与其他 OSPF 的路由器类型，将在这本指南稍后详细介绍。

## 网络类型

OSPF 会针对不同介质，使用不同的默认网络类型，他们如下：

- 非广播网络，多点 NBMA（FR 及 ATM）上的默认类型
- 点对点网络，HDLC、PPP、FR 与 ATM 上的 P2P 子接口，以及 ISDN 的默认类型
- 广播网络，以太网与令牌环的默认类型
- 点对多点网络
- 点对多点的非广播网络
- 环回网络，环回接口上的默认类型

所谓非广播的网络，属于一些未原生支持广播或组播流量的网络类型。最常见的非广播网络类型示例，便是帧中继。非广播网络类型，需要额外配置，才能同时实现广播与组播的支持。在此类网络上，OSPF 会选出一个指定路由器 (DR) ，和/或一个后备指定路由器 (BDR)。这两个路由器会在这本指南中稍后介绍。

在 Cisco 10S 软件中，默认情况下，启用 OSPF 的路由器在非广播网络类型上，会每 30 秒发送 `Hello` 数据包。当 `Hello` 数据包在四倍 `Hello` 间隔，或 120 秒后都未收到时，那么这个邻居路由器就会被视为 “死亡”。以下输出演示了某个帧中继串行接口上的 `show ip ospf interface` 命令：


```console
R2#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
	Internet Address 150.1.1.2/24, Area 0
	Process ID 2, Router ID 2.2.2.2, Network Type NON_BROADCAST, Cost: 64
	Transmit Delay is 1 sec, State DR, Priority 1
	Designated Router (ID) 2.2.2.2, Interface address 150.1.1.2
	Backup Designated Router (ID) 1.1.1.1, Interface address 150.1.1.1
	Timer intervals configured, Hello 30, Dead 120, Wait 120, Retransmit 5
		oob-resync timeout 120
		Hello due in 00:00:00
	Supports Link-local Signaling (LLS)
	Index 2/2, flood queue length 0
	Next 0x0(0)/0x0(0)
	Last flood scan length is 2, maximum is 2
	Last flood scan time is 0 msec, maximum is 0 msec
	Neighbor Count is 1, Adjacent neighbor count is 1
		Adjacent with neighbor 1.1.1.1 (Backup Designated Router)
	Suppress Hello for 0 neighbor(s)
```

所谓点对点 (P2P) 连接，就是一种两个端点之间的连接。P2P 连接的一些示例包括，使用 HDLC 及 PPP 封装方式的一些物理 WAN 接口，以及帧中继 (FR) 及异步传输模式 (ATM) 的点到点的子接口。在 OSPF 的点到点网络类型上，没有 DR 或 BDR 选出。默认情况下，OSPF 在 P2P 的网络类型上，会每 10 秒发送 `Hello` 数据包。这些网络类型的 “死亡” 间隔，是四倍 `Hello` 间隔即 40 秒。以下输出演示了某条 P2P 链路上的 `show ip ospf interface` 命令。

```console
R2#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
	Internet Address 150.1.1.2/24, Area 0
	Process ID 2, Router ID 2.2.2.2, Network Type POINT_TO_POINT, Cost: 64
	Transmit Delay is 1 sec, State POINT_TO_POINT
	Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
		oob-resync timeout 40
		Hello due in 00:00:03
	Supports Link-local Signaling (LLS)
	Index 2/2, flood queue length 0
	Next 0x0(0)/0x0(0)
	Last flood scan length is 1, maximum is 1
	Last flood scan time is 0 msec, maximum is 0 msec
	Neighbor Count is 1, Adjacent neighbor count is 1
		Adjacent with neighbor 1.1.1.1
	Suppress Hello for 0 neighbor(s)
```

所谓广播网络类型，是那些原生支持广播与组播流量的网络，最常见的示例便是以太网。与非广播网络下的情形一样，OSPF 也会在广播网络上，选出一个 DR 和/或一个 BDR。默认情况下，OSPF 在这些网络类型上会每 10 秒发送 `Hello` 数据包。当在四倍 `Hello` 间隔后，即 40 秒后没有 `Hello` 数据包收到，那么邻居就会被宣布为 “死亡”。以下输出演示了在某个 `FastEthernet` 接口上的 `show ip ospf interface` 命令。


```console
R2#show ip ospf interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	Internet Address 192.168.1.2/24, Area 0
	Process ID 2, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 64
	Transmit Delay is 1 sec, State BDR, Priority 1
	Designated Router (ID) 192.168.1.3, Interface address 192.168.1.3
	Backup Designated Router (ID) 2.2.2.2, Interface address 192.168.1.2
	Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
		oob-resync timeout 40
		Hello due in 00:00:04
	Supports Link-local Signaling (LLS)
	Index 1/1, flood queue length 0
	Next 0x0(0)/0x0(0)
	Last flood scan length is 1, maximum is 1
	Last flood scan time is 0 msec, maximum is 0 msec
	Neighbor Count is 1, Adjacent neighbor count is 1
		Adjacent with neighbor 192.168.1.3 (Designated Router)
	Suppress Hello for 0 neighbor(s)
```

所谓点对多点，属于一种非默认的 OSPF 网络类型。换句话说，这种网络，必须通过使用 `ip ospf network point-to-multipoint [non-broadcast]` 这条接口配置命令，手动加以配置。默认情况下，这条命令默认应用到广播的点到多点网络类型。这种默认的网络类型，允许 OSPF 使用组播数据包，动态地发现其邻居路由器。此外，在广播的点到多点网络类型上，没有 DR/BDR 的选举。

上述命令中的 `[non-broadcast]` 关键字，可将这些点到多点的网络类型，配置为非广播的点到多点网络。这一做法需要静态的 OSPF 邻居配置，因为 OSPF 将不使用组播数据包，动态地发现其邻居路由器。此外，这种网络类型不需要指定网段的一个 DR 和/或一个 BDR 路由器的选举。这种网络类型的主要用途，是允许指派邻居开销给邻居，而不是使用接收自全体邻居的路由的接口指派的开销。

> *译注*：
>
> - the primary use of this Non-Broadcast Point-to-Multipoint network type, is to allow neighbor costs to be assigned, instead of using the interface-assigned cost for routes received from all neighbors.

点对多点的网络类型，通常用于部分网状的中心分支的非广播多路访问（NBMA）网络。不过，这种网络类型也可被指定给其他网络类型，比如广播的多路访问网络（如以太网）。默认情况下，OSPF 在点对多点网络上，会每 30 秒发送 `Hello` 数据包。默认死亡间隔，是四倍 `Hello` 间隔即 120 秒。

以下输出演示了在某个被手动配置为点到多点网络的，帧中继串行接口上的 `show ip ospf interface` 命令：

```console
R2#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
	Internet Address 150.1.1.2/24, Area 0
	Process ID 2, Router ID 2.2.2.2, Network Type POINT_TO_MULTIPOINT, Cost: 64
	Transmit Delay is 1 sec, State POINT_TO_MULTIPOINT
	Timer intervals configured, Hello 30, Dead 120, Wait 120, Retransmit 5
		oob-resync timeout 120
		Hello due in 00:00:04
	Supports Link-local Signaling (LLS)
	Index 2/2, flood queue length 0
	Next 0x0(0)/0x0(0)
	Last flood scan length is 1, maximum is 2
	Last flood scan time is 0 msec, maximum is 0 msec
	Neighbor Count is 1, Adjacent neighbor count is 1
		Adjacent with neighbor 1.1.1.1
	Suppress Hello for 0 neighbor(s)
```


定时器值，是 OSPF 要求两个路由器上的网络类型必须相同的主要原因（这意味着他们要么举行选举，要么不举行选举）。正如上面的那些输出中所示，不同网络类型，会用到不同的 `Hello` 与 `Dead` 定时器间隔。为了 OSPF 邻接能成功建立，那么这些定时器值在两个路由器上就必须匹配。

Cisco 10S 软件允许这些默认 `Hello` 及 `Dead` 定时器，通过使用 `ip ospf hello-interval <1-65535>` 及 `ip ospf dead-interval [<1-65535>|minimal]` 两个接口配置命令更改。`ip ospf hello-interval <1-65535>` 这条命令，用于指定以秒为单位的 `Hello` 间隔。在被执行后，软件会自动将 `Dead` 间隔，配置一个四倍于所配置的 `Hello` 间隔的四倍。例如，假设某个路由器被配置如下：


```console
R2(config)#interface Serial0/0
R2(config-if)#ip ospf hello-interval 1
R2(config-if)#exit
```

上面通过在 R2 上设置 `Hello` 间隔设为 1，那么 Cisco 10S 就会自动调整默认的 `Dead` 定时器为四倍于 `Hello` 间隔，即 4 秒。这点在以下输出中得以演示：

```console
R2#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
	Internet Address 10.0.2.4/24, Area 2
	Process ID 4, Router ID 4.4.4.4, Network Type POINT_TO_POINT, Cost: 64
	Transmit Delay is 1 sec, State POINT_TO_POINT
	Timer intervals configured, Hello 1, Dead 4, Wait 4, Retransmit 5
		oob-resync timeout 40
		Hello due in 00:00:00
...
[Truncated Output]
```



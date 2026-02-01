# Cisco® EIGRP 概述与基础


思科开发了增强型 IGRP，以克服其名为内部网关路由协议（IGRP）的专有距离矢量路由协议的一些局限性，不过 EIGRP 已在几年前作为一个 CCNA 考试主题已被舍弃。与路由信息协议（RIP）相比，IGRP 曾提供了数项改进，如更多跳数的支持等；但 IGRP 仍受到传统距离矢量路由协议的限制，包括以下方面：

- 发送定期的完整路由更新
- 跳数限制
- 缺乏 VLSM 支持
- 慢速收敛
- 缺乏环路预防机制

不同于会发送包含全部路由信息的定期路由更新，到其邻居的传统距离矢量路由协议，EIGRP 会发送一些非定期的增量路由更新，以在整个路由域中分发路由信息。EIGRP 的增量更新，会在在网络拓扑发生变化时发送。

默认情况下，RIP（一个先前的 CCNA 级主题）有着最多 `15` 跳的跳数限制，这使 RIP 仅适用于一些较小网络。EIGRP 有着默认 `100` 的跳数限制；不过，这个值可由管理员在配置 EIGRP 时，使用 `metric maximum-hops <1-255>` 这条路由器配置命令手动调整。这允许 EIGRP 支持包含数百个路由器的网络，使其更具可扩展性，更适合一些大型网络。

增强型 IGRP 使用两种独特的类型/长度/值（TLV）三元组，承载路由条目。这两种 TLV 分别是内部的 EIGRP 路由 TLV，以及外部的 EIGRP 路由 TLV，分别用于内部及外部的 EIGRP 路由。这两种 TLV 都包含一个 8 位前缀长度字段，指定用于目的网络子网掩码位数。包含于这个字段中的信息，允许 EIGRP 支持不同子网划分的网络。

相比传统距离矢量路由协议，增强型 IGRP 收敛得快得多。EIGRP 会运用其拓扑数据表中包含的信息定位备用路径，而不是仅仅依赖定时器。当某条备用路径不在本地路由器的拓扑数据表中时，EIGRP 还可查询相邻路由器的信息。EIGRP 的拓扑数据表将在这个教学模组稍后详细介绍。

为了确保网络中无环路路径，EIGRP 使用了弥散更新算法 (DUAL)，用于跟踪由邻居通告的所有路由，然后选出到目标网络的最佳无环路径。DUAL 是一项将在这个教学模组稍后介绍的 EIGRP 核心概念。


> *知识点*：
>
> + Enhanced Interior Gateway Protocol, EIGRP
>   - developed by Cisco, to overcome some of the limitations of its proprietary Distance Vector routing protocol IGRP
>   - was dropped as a CCNA exam topic a few years ago
>   + IGRP offered improvements over Routing Information Protocol, RIP, such as support for an increased number of hops, still succumbed to the traditional Distance Vector routing protocol limitations, including:
>       - Sending full periodic routing updates
>       - A hop limitation
>       - The lack of VLSM support
>       - Slow convergence
>       - Tha lack of loop prevention mechanisms
>   - sends non-periodic incremental routing updates, to distribute routing information throughout the routing domain
>   - The EIGRP incremental updates, are sent when there is a change in the network topology
>   - RIP has a hop-count limitation of up to 15 hops, which makes RIP suitable only for smaller networks
>   - EIGRP has a default hop-count limitation of 100, and can be mannually adjusted by using the `metric maximum-hops <1-255>` router configuration command when configuring EIGRP, allows EIGRP to support networks that contains hundreds of routers, making it more scalable and better suited for larger networks
>
> + EIGRP uses two unique `Type/Length/Value` （TLV） triplets, to carry route entries
>   - the Internal EIGRP Route TLV
>   - the External EIGRP Route TLV
>   - used for internal and external EIGRP routes, respctively
>   - Both TLVs include an 8-bit Prefix Length field, that specifies the number of bits used for the subnet mask of the destination network
>   - The information that is contained in this field, allows EIGRP to support variably subnetted networks
>
> + Enhanced IGRP converges much faster, than the traditional Distance Vector routing protocols
>   - uses information contained in its topology table, to locate alternate paths, instead of relying solely on timers
>   - can also query neighboring routers for information, if an alternate path is not located in the local router's topology table
>
> + EIGRP uses the Diffusing Update Algorithm, DUAL, to ensure that there are loop-free paths throughout the network,
>   - DUAL is used to track all routes advertised by neighbors, and then select the best loop-free path to the destination network
>   - DUAL is a core EIGRP concept

# 路由协议类别

有两大类别的路由协议：

- 距离矢量
- 链路状态

距离矢量的路由协议在确定通过网络的最优路径时，传统上会使用一个一维的矢量，而链路状态的路由协议在确定通过网络的最优路径时，则会使用最短路径优先（SPF）。在深入研究这两类路由协议的具体内容前，我们将先了解一下矢量值，以及难以捉摸的 SPF 算法。

## 了解矢量值

所谓一维矢量值，是个有方向的量。他只是个某个特定方向，或路线上的量（数字）。矢量这一概念，在下图 17.11 中得以演示。

![理解矢量](../images/1011.png)

**图 17.11** -- **理解矢量值**

参照图 17.11，第一行于 0 处开始并在 8 处结束，而第二行则于 8 处开始并在 13 处结束。第一行的矢量值为 8，而第二行的矢量值为 5。运用基本数学知识，我们知道 8 + 5 = 13。向量的起点和终点并不重要。实际上，唯一重要的是矢量有多长，以及矢量移动了多远。

**注意**：矢量也可以相反方向移动（即他们表示一些负的数字）。

## 最短路径优先算法

SPF 算法创建了到某个区域中，或网络主干中所有主机的一棵最短路径树，执行计算的路由器位于该树的根部。为使 SPF 算法以正确的方式运行，区域内的所有路由器，都应有着同一数据库信息。在 OSPF 下，这是经由数据库交换进程完成的。

## 距离矢量路由协议

所谓距离矢量，使用了距离或跳数，作为其确定最佳转发路径的主要度量值。距离矢量的路由协议，主要基于 [Bellman-Ford 算法](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)。距离矢量的路由协议，会定期向其邻居路由器发送他们整个路由表的副本，让其了解网络的最新状态。虽然在小型网络中这样或许是可接受的，但随着网络规模增长，其会增加跨网络发送的流量。所有距离矢量的路由协议都具有以下特征：

- 计数到无穷大
- 水平分隔
- 反向投毒
- 保持定时器

利用计数到无穷大这一特征，当某个目的网络，远于该路由协议所允许的最大跳数时，那么该网络就会被视为不可达。该网络条目因此便不会安装到 IP 路由数据表中。

水平分割则规定了，路由信息不能通过其被接收的同一接口，再发送出去。这一特征阻止了信息重新通告回该信息被学习到的来源。虽然这一特征是一种很好的循环预防机制，但其也是个重大缺陷，尤其是在中心辐射型网络中。

反向投毒（或路由投毒）是对水平分割的扩展。当与水平分割结合使用时，反向投毒允许网络从他们被接收的同一接口再通告出去。不过，反向投毒会导致路由器将这些网络，以一个 “不可达” 的度量值通告回发送他们的路由器，从而接收到这些条目的路由器，就不会将他们添加回其路由数据表中。

保持定时器用于防止先前被通告为下线的网络，被放回放路由表中。当路由器收到一条某个网络下线的更新时，他就会启动他的保持定时器。这个计时器告诉路由器，在接受任何该网络状态更改前，要等待一段指定时间。

在保持期间，路由器会抑制该网络，并阻止通告虚假信息。路由器也不会路由到这个不可达网络，即使他从另一路由器（其可能没有收到触发的更新）收到了该网络可达的信息。这种机制旨在防止黑洞流量。

两种最常见的距离矢量路由协议，分别是 RIP 及 IGRP。EIGRP 属于一种先进的距离矢量路由协议，同时使用了距离矢量与链路状态的一些特性（即，他属于一种混合协议）。


## 链路状态的路由协议

链路状态路由协议属于一种使用区域概念，对网络中的路由器逻辑分组的层次化路由协议。与距离矢量的路由协议相比，区域概念的运用，允许链路状态路由协议扩展更好，并以效率更高的方式运行。运行链路状态路由协议的路由器，会创建一个包含网络完整拓扑结构的数据库。这样做允许同一区域内的所有路由器，都能有着该网络的同一视图。

由于网络中的所有路由器，都有着该网络的同一视图，因此那些最优路径就会用以转发网络间的数据包，同时路由环路的可能性得以消除。因此，水平分割及路由投毒等技术，就不再如同他们对距离矢量路由协议所做的那样，适用于链路状态的路由协议了。

链路状态路由协议通过向同一区域内的所有其他路由器，发送链路状态通告或链路状态数据包运行。这些数据包包含着有关已连接接口、度量值及其他变量的信息。在路由器积累这些信息的同时，他们会运行 SPF 算法，计算出到每个路由器及每个目的网络的最短（最佳）路径。运用接收到的链路状态信息，路由器会建立链路状态的数据库（LSDB）。在两个相邻路由器的 LSDB 得以同步时，那么这两个路由器就被称为实现了邻接。


与发送给邻居其整个路由表的距离矢量路由协议不同，链路状态的路由协议会在检测到网络拓扑发生变化时，发送一些增量更新，这使他们在大型网络中更有效率。增量更新的使用，还使链路状态路由协议对网络变化响应更快，因此相比距离矢量路由协议，会在更短时间内收敛。下表 17.4 列出了一些不同的内部网关协议（IGP）及其分类。

**表 17.4** -- **IGP 的分类**

| 协议名字 | 有类/五类 | 协议分类 |
| :-- | :-- | :-- |
| RIP（版本 1） | 有类 | 距离矢量 |
| IGRP | 有类 | 距离矢量 |
| RIP（版本 2） | 无类 | 距离矢量 |
| EIGRP | 无类 | 先进的距离矢量 |
| IS-IS | 无类 | 链路状态 |
| OSPF | 无类 | 链路状态 |


> *知识点*：
>
> + routing protocol classess
>   - Distance Vector
>   - Link State
>
> - Distance Vector routing protocols, traditionally use a one-dimensional vertor, when determining the most optimal path(s) through the network.
>
> - Link State routing protocols, use the Shortest Path First, SPF, when determining the most optimal path(s) through the network.
>
> - a one-dimensional vector, is a directed quantity, simply a quantity(number) in particular direction or course
>
> - The SPF algorithm, creates a shortest-path tree, to all hosts in an area or in the network backbone, with the router that is performing the calculation at the root of that tree
>
> - all router in the area, should have the same database information for the SPF algorithm works in the correct manner, in OSPF, this is performed via the database exchange process
>
> - Distance Vector routing protocols, uses distance or hop count, as its primary metric for determining the best forwarding path, are primarily based on the Bellman-Ford algorithm, send neighbor routers their entire routing table, this increase the amount of traffic
>
> + All Distance Vector routing protocols share the following characteristics:
>   - Counting to infinity
>   - Split horizon
>   - Poison reverse
>   - Hold-down timers
>
> - the counting to infinity, if a destination network is farther than the maximum number of hops allowed for that routing protocol, the network would be considered unreachable, and its entry therefore would not be installed
>
> - Split horizon, mandates that routing information cannot be sent back to the same interface through which it was received, prevents the re-advertising of information back to the source from which it was learned, is a great loop prevention mechanism, also a significant drawback, especially in hub-and-spoke topology  networks
>
> - Poison reverse, or routing poisoning, when used in conjunction with split horizon, allows the networks to be advertised back out of the same interface on which they were received, causes the router to advertise these networks back to the sending router with a metric of "unreachable", so that the router receives those entries, will not add them back into its routing table
>
> - Hold-down timers, used to prevent networks that were previously advertised as down, from being placed back into the routing table, the hold-down timer is started when a router receives an update that a network is down, it tells the router to wait for a specific amount of time, before accepting any changes to the status of that network
>
> - during the hold-down period, the router suppresses the network, and prevents advertising false information, also does not route to the unreachable network, even if it receives information from another router that the network is reachable, which may not have received the triggered update. This mechanism is designed to prevent black-hole traffic.
>
> - RIP(both v1 and v2) and IGRP, is the two most common Distance Vector routing protocols
>
> - EIGRP is an advanced Distance Vector routing protocol, using features from both Distance Vector and Link State, thus it is a hybrid protocol
>
> - Link State routing protocols, are hierarchical routing protocols, use the concept of areas, to logically group routers within a network, allows Link State routing protocols scale better, and operate in a more efficient manner, create a database that comprises the complete topology of the network, allows all routers within the same area, have the same view of the network
>
> - as all the routers have the same view of the network, the most optimal paths are used for forwarding packets between network, and the possibility of routing loops, is eliminated, therefore, techniques such as split horizon and route poisoning, do not apply to Link State routing protocols, as they do to Distance Vector ones
>
> - LS routing protocols, operate by sending Link State Advertisements, or Link State Packets to all other routers within the same area, including information about attached interfaces, metrics, and other variables, while the routers accumulating this information, they run the SPF algorithm, and calculate the shortest(best) path to each router and destination network
>
> - with the received Link State information, routers build the Link State Database, LSDB
>
> - when the LSDBs of two neighboring routers are synchronized, they are said to be adjacent
>
> - Link State routing protocol only send incremental updates, when a change in the network topology is detected, this makes LS routing protocols more efficient in larger networks, also allows them to respond much faster to network changes, and thus converge in a shorter amount of time
>
> - Interior Gateway Protocol, IGP

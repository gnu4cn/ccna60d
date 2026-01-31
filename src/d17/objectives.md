# 路由协议的目标

路由算法虽然性质不同，但均有着一些相同的基本目标。虽然一些算法相比其他算法更适合某些网络，但所有路由协议都有其优缺点。路由算法的一些设计宗旨及目标如下：

- 最佳路由
- 稳定性
- 易于使用
- 灵活性
- 快速收敛


## 最佳路由

所有路由协议的主要目标之一，都是要选出从源子网或主机，到目的子网或主机通过网络的最优路径。最优路径取决于这些路由协议所使用的度量值。一种协议认为最佳的路由，从另一协议的角度看，可能不一定是最优路由。例如，RIP 可能会将某条只有两跳长的路径，视为到目的网络的最优路径，即使其间链路都是 64Kbps 的链路，而诸如 OSPF 及 EIGRP 等一些高级协议则可能会确定出，通往同一目的地的最优路径，是那条穿越四个路由器但使用 10Gbps 链路的路径。


## 稳定性

网络的稳定性，或缺乏稳定性，是路由算法的另一主要目标。路由算法应足够稳定，以应对一些诸如硬件故障，甚至不正确实现等不可预见的网络事件。虽然这是所有路由算法的一项典型特征，但他们应对此类事件的方式和时间，使一些算法优于其他算法，而因此在现代网络中更受青睐。

## 易于使用

路由算法被设计得尽可能简单。除了提供支持复杂互联网络部署的能力外，路由协议还应考虑到运行该算法所需的资源。与其他算法相比，一些路由算法需要更多硬件或软件资源（如 CPU 及内存）运行；但相比一些替代的简单算法，他们具备提供更多功能的能力。


## 灵活性

除提供路由功能外，路由算法还应特性充沛，允许他们支持不同网络中遇到的不同需求。需要注意的是，这一能力通常会以一些别的特性为代价，例如接下来介绍的收敛性。


## 快速收敛

快速收敛是所有路由算法的另一个主要目标。正如早先曾提到的，收敛会在网络中的所有路由器，有着同一视图并就最优路由达成一致时出现。当收敛花了很长时间才出现时，远端网络之间就会出现间歇性数据包丢失及连通性丢失。除了这些问题外，缓慢收敛还会导致网络路由环路及彻底的网络中断。


> *知识点*：
>
> + Basic Objectives of Routing Protocols, all routing protocols have their advantages and disadvantages:
>   - optimal routing
>   - statbility
>   - ease of use
>   - flexibility
>   - rapid convergence
>
> - to select the most optimal path through the network from the source subnet or host, to the destination subnet or host, depends upon the metrics used by the routing protocols, the best route considered by one protocol, may not necessarily be the most optimal route from the perspective of another protocol
>
> - network stability, is another major objective for routing protocols, they should be stable enough to accommodate unforseen network events, the manner and time in which routing protocols respond to such events, makes some better than others and thus more preferred in modern-day networks
>
> - routing protocols are designed to be as simple as possible, except providing the capatibility to support comples internetwork deployments, they should take into consideration the resources required to run the algorithm, some protocols require more resources to run than others do, but they are capable of providing more functionality than alternative simple algorithms
>
> - routing algorithms should be feature-rich, to support the different requirements encountered in different networks, this capability typically comes at the expense of other features, such as convergence
>
> - rapid convergence is another primary objective of all routing algorithms, occurs when all routers in the network have the same view, and agree on optimal routes, slow convergence would cause intermittent packet loss and loss of connectivity between remote networks, aslo can result in network routing loops, and outright network outages

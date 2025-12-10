# 生成树的开销与优先级

STP 使用开销及优先级值，确定到根桥的最优路径。这两个值会用于在接下来将介绍的根端口选举中。重要的是，为理解生成树如何选中一个端口，而不是另一端口，而掌握开销与优先级值的计算。

生成树算法（STA ）的一项关键功能，便是尝试提供从根网桥，到网络中各个交换机的最短路径。一旦选定，那么这条路径即会被用于转发数据，而那些冗余链路则会被置于阻塞状态。STA 使用两个值来决定，哪个端口将被置于转发状态（即到根网桥的最佳路径），哪个/些端口将被置于阻塞状态。这两个值便是端口开销，与端口优先级。二者会接着的小节中说明。


## 生成树端口开销


802.1D 规范为每个端口分配了基于端口带宽的 16 位（短）默认端口开销值。由于管理员同样具备手动分配端口开销值（1 到 65535 之间）的能力，故一些 16 位值会仅用于那些未专门配置端口开销值的端口。下表 10.1 列出了使用短方式，计算端口开销时，各种类型端口的默认值：


**表 10.1** -- **默认的 STP 端口开销值**

| 带宽 | 默认端口开销值
| :-- | :-- |
| 4Mbps | 250 |
| 10Mbps | 100 |
| 16Mbps | 62 |
| 100Mbps | 19 |
| 1Gbps | 4 |
| 10Gbps | 2 |


在 Cisco IOS Catalyst 交换机中，默认端口开销值，可通过执行 `show spanning-tree interface [name]` 命令查看，如下输出中所示，其显示了某个 `FastEthernet` 接口的默认短端口开销值：

```console
Switch#show spanning-tree interface FastEthernet0/2
Vlan        Role    Sts    Cost    Prio.Nbr    Type
----        ----    ---    ----    --------    ----
VLAN0050    Desg    FWD    19      128.2       P2p
```

以下输出则显示了同样的长端口开销分配：


```console
Switch#show spanning-tree interface FastEthernet0/2
Vlan        Role    Sts    Cost    Prio.Nbr    Type
----        ----    ---    ----    --------    ----
VLAN0050    Desg    FWD    200000      128.2       P2p
```

重要的是要记住，有着较低开销（数值）的端口，会越受青睐；端口开销越低，那么该特定端口当选根端口的概率就越高。端口开销值具有全局意义，并会影响整个生成树网络。这个值会被配置在生成树域中的所有非根交换机上。

> *知识点*：
>
> - the shortest path to each switch in the network from the Root Bridge
>
> - the best path to the Root Bridge
>
> - 16-bit(short) port cost
>
> - the short method to calculate the port cost
>
> - long port cost assignment

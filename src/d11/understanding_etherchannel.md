# 理解 EtherChannel

一个 EtherChannel，由捆绑在一起成为一条逻辑链路的物理、单条的一些 `FastEthernet`、`GigabitEthernet` 或 `Ten-GigabitEthernet`（10Gbps）链路组成，如下图 11.1 所示。由 `FastEthernet` 链路组成的 EtherChannel，称为快速以太网通道 (FEC)；由 `GigabitEthernet` 链路组成的 EtherChannel，称为千兆以太网通道 (GEC)；而最后，由万兆以太网链路组成的 EtherChannel，就称为万兆以太网通道 (10GEC)。

每条 EtherChannel 最多可由八个端口组成。EtherChannel 中的物理链路，必须共有一些相似特性，例如，要被定义在同一 VLAN 下，或要有着同样的速率及双工设置等。在 Cisco Catalyst 交换机上配置 EtherChannel 时，重要的是记住，不同的 Catalyst 交换机型号间，所支持的 EtherChannel 数量将有所不同。

例如，在 Catalyst 3750 系列交换机上，这个范围是 1 到 48；在 Catalyst 4500 系列交换机上，该范围是 1 到 64；而而在旗舰版的 Catalyst 6500 系列交换机上，EtherChannel 配置的有效值数量，取决于软件版本。对于 12.1(3a)E3 版之前的版本，有效值范围是 1 至 256；对于 12.1(3a)E3、12.1(3a)E4 及 12.1(4)E1 版本，有效值范围为 1 至 64。12.1(5c)EX 及以后版本，支持最大 64 个值，范围从 1 到 256。

![以太网通道的物理和逻辑视图](../images/3301.png)

**图 11.1** -- **EtherChannel 的物理及逻辑视图**

**注意**：咱们不需要都了解每个不同 10S 版本所支持的值。

有两种可用于自动创建 EtherChannel 组的链路聚合协议选项：端口聚合协议（PAgP）与链路聚合控制协议（LACP）。PAgP 是一项思科专有协议，而 LACP 则是用于从多条物理链路创建一条逻辑链路的 IEEE 802.3ad 规范的一部分。这两种协议将在这一教学模组中详细介绍。

> *知识点*：
>
> - a single logical link
>
> - FastEtherChannel, FEC
>
> - GigabitEtherChannel, GEC
>
> - Ten-GigabitEtherChannel, 10GEC
>
> - link aggregation protocol
>
> - Port Aggregation Protocol, PAgP
>
> - Link Aggregation Control Protocol, LACP

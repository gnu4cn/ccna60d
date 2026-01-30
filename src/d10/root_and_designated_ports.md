# 生成树根端口及指定端口

STP 会推选出两种用于转发 BPDU 的端口：

- 指向向根网桥的根端口，`Role Root`
- 及背离根网桥的指定端口, `Role Desg`


重要的是，要掌握这两种端口类型的功能，以及他们如何被 STP 选举出来。

> **译注**：在网络收敛后，被阻塞的端口属于替代 `Role Altn` 端口，这是除根端口与指定端口外的第三种端口。


## 生成树根端口的选举

STA 定义了三种类型的端口：根端口、指定端口及非指定端口。这些端口类型由 STA 选举出来，并被置于相应状态（如转发或阻塞）。在生成树选举过程中，在僵局情况下，那么以下的一些值将被用作（以列出顺序）破局者：

1. 最低的根桥 ID；
2. 最低的到根网桥路径开销；
3. 最低的发送方网桥 ID；
4. 最低的发送方端口 ID。

**注意**： 重要的是，要记住这些破局条件，以掌握生成树在任何情况下，选举及指定不同的端口类型的方式。这不仅是咱们很可能被考查的方面，而且对于现实世界中设计、实现与支持互联网络，扎实地理解这点也非常重要。


所谓生成树根端口，是设备转发数据包到根网桥时，提供了最优路径，或最低开销的那个端口。换句话说，根端口是收到该交换机的最佳 BPDU 的那个端口，而所谓该交换机的最佳 BPDU，表示就路径成本而言，其是到根网桥的最短路径。根端口是根据根桥路径开销选出的。

而所谓根桥路径开销，是根据通往根桥所有链路的累积开销（路径开销）计算出的。路径开销，是各个端口对根网桥路径开销贡献的值。由于这一概念通常很容易混淆，其在下面的图 10.7 中得以说明。

**注意**：图 10.7 中除一条链路外，其余均为 `GigabitEthernet` 链路。应假设传统 802.1D 方式被用作端口开销的计算。那么，`GigabitEthernet` 的默认端口开销为 4，而 `FastEthernet` 的默认端口开销为 19。


![生成树根端口选举](../images/3107.png)

**图 10.7** -- **生成树的根端口选举**

**注意**：以下解释说明了该网络中交换机之间 BPDU 的流动。除其他信息外，这些 BPDU 还包含根桥路径开销信息，其会在接收交换机上的入口端口递增。

1. 根网桥会发送一个带有路径开销值 0 的 BPDU，因为他的端口直接位于根网桥上。这个 BPDU 会被发送到 `Switch 2` 及 `Switch 3`；
2. 当 `Switch 2` 和 `Switch 3` 收根网桥的 BPDU 后，他们会根据入口接口，加上他们自己的路径开销。由于 `Switch 2` 和 `Switch 3` 都通过 `GigabitEthernet` 连接到根网桥，因此他们会将从根网桥接收到的路径开销值 (0)，加到他们的 `GigabitEthernet` 路径开销值 (4)。那么通过 `GigabitEthernet0/1` 连接到根网桥的 `Switch 2` 与 `Switch 3` 的根网桥路径开销，便是 0 + 4 = 4；
3. `Switch 2` 和 `Switch 3` 会将新的 BPDU，发送到其各自的邻居，相应分别为 `Switch 4` 和 `Switch 6`。这些 BPDU 会新的累积值（4），作为根桥路径开销；
4. `Switch 4` 和 `Switch 6` 收到来自 `Switch 2` 和 `Switch 3` 的 BPDU 后，他们会根据入口接口，递增收到的根网桥路径开销值。由于 `GigabitEthernet` 连接正被使用，接收自 `Switch 2` 和 `Switch 3` 的值会被递增 4。`Switch 4` 和 `Switch 6` 上经由各自的 `GigabitEthernet` 接口到根桥的根桥路径开销，因此便为 0 + 4 + 4 = 8；
5. `Switch 5` 会收到两个 BPDU：一个来自 `Switch 4`，另一个来自 `Switch 6`。接收自 `Switch 4` 的 BPDU 有着 0 + 4 + 4 + 4 = 12 的根桥路径开销。而接收自 `Switch 6` 的 BPDU 有着 0 +4 +4 +19 = 27 的根桥路径开销。由于包含在接收自 `Switch 4` BPDU 中的根网桥路径开销值，优于接收自 `Switch 6` 的，因此 `Switch 5` 会选举 `GigabitEthernet0/1` 作为根端口。


**注意**：交换机 2、3、4 和 6，都将选举他们的 `GigabitEthernet0/1` 端口作为根端口。


> **进一步解释**：
>
> 为进一步解释并帮助咱们掌握根端口的选举，我们假设上图 10.7 中的所有端口，都是 `GigabitEthernet` 端口。这就意味着在上面的第 5 步中，`Switch 5` 就会收到两个带有相同根桥 ID 的 BPDU，两个 BPDU 的根路径开销值均为 0 + 4 + 4 + 4 = 12。为了根端口得以选出，STP 将进入下面列出的破局标准中的下一选项（已被用到的前两个选项，已被移除）：
>
> 1. 最低的发送者网桥 ID；
> 2. 最低的发送端口 ID。
>
> 根据第三条选取标准，`Switch 5` 将优先选择接收自 `Switch 4` 的 BPDU，因为其 BID (`0000.0000.000D`) 低于 `Switch 6` 的(`0000.0000.000F`)。`Switch 5` 会将端口 `GigabitEthernet0/1` 选为根端口。

> *知识点*：
>
> - the Root Port, which points towards the Root Bridge
>
> - the Designated Port, which points away from the Root Bridge
>
> - the Non-Designated Port
>
> + the tiebreakers, tie-breaking criterias
>   - Lowest Root Bridge ID
>   - Lowest Root path cost to Root Bridge
>   - Lowest sender Bridge ID
>   - Lowest sender Port ID
>
> - the Root Bridge path cost
>
> - the cumulative cost(path cost) of all the links leading to the Root Bridge
>
> - the value that each port contributes to the Root Bridge path cost
>
> - the ingress port


## 生成树指定端口选举

不同于根端口，指定端口是远离 STP 根的某个端口。这个端口是指定设备连接到 LAN 的那个端口。其也是在从该局域网向根桥转发数据包时，有着最低路径开销的端口。

**注意**：有些人会把指定端口，称为指定交换机。这两个术语可以互换，且指的是同一事物；也就是说，这便是用于将数据帧从某个特定 LAN 网段，转发到根网桥的那台交换机或那个端口。

指定端口的主要目的，是防止环路。当不止一台交换机被连接到同一 LAN 网段时，那么所有交换机都会尝试转发在该网段上接收到的数据帧。这种默认行为，会导致同一帧的多个副本，被多台交换机同时转发 -- 从而造成网络环路。要避免这种默认行为，一个指定端口便会在所有 LAN 网段上选出。默认情况下，根桥上的所有端口，均属于指定端口。这是因为根桥路径开销将始终为 0。指定端口的生成树算法选举，如下图 10.8 中所示。


![生成树指定端口选举](../images/3108.png)

**图 10.8** -- **生成树的指定端口选举**

- 在根网桥与 `Switch 2` 之间的网段上，根网桥的 `GigabitEthernet0/1` 会被选为指定端口，因为他有着较低的根网桥路径开销，为 0；
- 在根网桥与 `Switch 3` 之间的网段上，根网桥的 `GigabitEthernet0/2` 会被选为指定端口，因为他有着较低的根网桥路径开销，为 0；
- 在 `Switch 2` 和 `Switch 4` 之间的网段上，`Switch 2` 上的 `GigabitEthernet0/2` 端口会被选为指定端口，因为 `Switch 2` 有着最低的根桥路径开销，为 4；
- 在 `Switch 3` 和 `Switch 6` 之间的网段上，`Switch 3` 上的 `GigabitEthernet0/2` 端口会被选为指定端口，因为 `Switch 3` 有着最低的根桥路径开销，为 4；
- 在 `Switch 4` 和 `Switch 5` 之间的网段上，`Switch 4` 上的 `GigabitEthernet0/2` 端口会被选为指定端口，因为 `Switch 4` 有着最低的根桥路径开销，为 8；
- 在 `Switch 5` 和 `Switch 6` 之间的网段上，`Switch 6` 上的 `GigabitEthernet0/2` 端口会被选为指定端口，因为 `Switch 6` 有着最低的根桥路径开销，为 8。


非指定端口并非一种真正的生成树端口类型。相反，他只是个术语，指的是某个 LAN 段上不属于指定端口的某个端口。这个端口将始终被 STP 置于阻塞状态。根据根端口和指定端口的计算，根端口和指定端口选举示例中用到的交换网络的生成树拓扑结果，如下图 10.9 中所示。


![已收敛的生成树网络](../images/3109.png)

**图 10.9** -- **已收敛的生成树网络**



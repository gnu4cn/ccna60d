# Cisco® 的生成树增强功能

正如前面所指出的，STP 对于其中启用了他的环境，做出了以下两个假设：

- 所有链路都是双向的，都能发送和接收网桥协议数据单元
- 所有交换机都能定期接收、处理及发送网桥协议数据单元

在现实世界的网络中，这两条假设并不总是成立。在这种情形下，STP 就可能无法防止网络内环路的形成。鉴于这种可能性，并为提升基本 IEEE 802.1D 生成树算法的性能，Cisco® 引入了数项对 IEEE 802.1D 标准的改进，具体如下。

## 端口快速

端口快速是一项通常只针对连接主机的某个端口或接口启用的特性。当这个端口上的链路起来时，交换机会跳过 STA 的第一阶段，而直接过渡到转发状态。与人们普遍认为的相反，端口快速特性不会禁用所选端口上的生成树。这是因为即使在端口快速特性下，该端口仍可发送及接收 BPDU。

在该端口连接到不发送或响应 BPDU 的网络设备，比如某个工作站上的网卡时，这并不是个问题。但是，当该端口被连接到真的发送 BPDU 的设备，比如另一交换机时，这就可能造成交换环路。这是因为该端口会跳过监听与学习状态，而立即进入转发状态。端口快速只是允许端口比要经历所有正常 STA 步骤的某个端口，更快地开始转发帧。

在某个接入与中继接口上配置端口快速的命令分别如下。

```console
Switch#(config-if)#spanning-tree portfast
Switch#(config-if)#spanning-tree portfast trunk
```

> *知识点*：
>
> - the Port Fast feature
>
> - the NIC on a workstation
>
> - a switching loop

## BPDU 防护

BPDU 防护特性用于保护生成树域免受外部影响。BPDU 防护功能默认是禁用的，但对所有启用了端口快速的端口使用该特性。当某个配置了 BPDU 防护特性的端口接收到 BPDU 时，他会立即转换到 `errdisable` 状态。

这样做会在那些以禁用生成树的端口上，阻止错误信息注入生成树域。与端口快速结合下的 BPDU 防护运作情况，在下图 10.10、图 10.11 和图 10.12 中展示了。


![掌握 BPDU 守护](../images/3110.png)

**图 10.10** -- **理解 BPDU 防护**

在图 10.10 中，端口快速在 `Switch 1` 上，对其到 `Host 1` 的连接上启用了。初始化后，那个端口会转入转发状态，这消除了 STA 未被绕过，端口进入监听和学习状态时会经历的 30 秒延迟。由于那个网络主机是台工作站，因此他不会在该端口上发送 BPDU。

由于意外或某种别的恶意原因，`Host 1` 被从 `Switch 1` 拔出。`Switch 3` 被使用同一端口连接到 `Switch 1`。`Switch 3` 还被连接到 `Switch 2`。由于连接 `Switch 1` 到 `Switch 3` 的端口上启用了端口快速，因此这个端口从初始化状态进入转发状态，绕过了正常的 STP 初始化。如下图 10.11 中所示，这个端口还将接收并处理由交换机 3 发送的任何 BPDU。

![掌握 BPDU 守护（续）](../images/3111.png)

**图 10.11** -- **了解 BPDU 防护（续）**

根据上面所示的端口状态，咱们便可很快看出，一个环路在这个网络中如何被创建出来。为防止这种情况出现，BPDU 防护就应在所有启用了端口快速的端口上启用。如下图 10.12 所示。


![掌握 BPDU 守护（续）](../images/3112.png)


**图 10.12** -- **理解 BPDU 防护（续）**

在端口快速的端口上 BPDU 防护启用下，当 `Switch 1` 收到来自 `Switch 3` 的 BPDU 时，他会立即将该端口转换为 `errdisable` 状态。那样做的结果便是，STP 的计算，不会受到这条冗余链路的影响，而该网络将不会有任何环路。

这可在该端口上，使用 `spanning-tree bpduguard enable` 命令配置。


## BPDU 过滤

BPDU 守护和 BPDU 过滤两项特性经常被混淆，甚至被认为同一特性。但他们是不同的，了解他们之间的区别很重要。当端口快速在某个端口上启用时，该端口将发出 BPDU，并将接受于处理接收到的 BPDU。BPDU 防护特性会防止该端口接收任何 BPDU，但不会阻止其发送 BPDU。当任何 BPDU 被接收到时，该端口将被置于 `errdisable` 状态。

BPDU 过滤特性具有双重功能。在配置于接口级时，其会通过阻止所选端口发送或接收任何 BPDU，而有效地在这些端口上禁用 STP。而在全局性配置，并与全局的端口快速结合使用时，他将使任何接收到 BPDU 的端口，退出端口快速。这在下图 10.13 中得以演示。


![掌握 BPDU 过滤器](../images/3113.png)

**图 10.13** -- **理解 BPDU 过滤**

BPDU 过滤可使用 `spanning-tree bpdufilter enable` 命令，在交换机端口上启用。

## 环路防护

环路防护特性用于防止生成树网络内环路的形成。环路防护会检测根端口与阻塞端口，并确保他们继续接收 BPDU。当交换机在阻塞端口上收到 BPDU 时，那些信息会被忽略，因为最优 BPDU 仍在通过根端口，接收自根网桥。

当交换机链路起来且未没有 BPDU 被接收（由于一条单向链路）时，交换机会假定启用这条链路是安全的，而该端口便会转换到转发状态，并开始中继（转发）收到的 BPUD。当某台交换机被连接到该链路的另一侧时，这会有效地创建出一个生成树环路。这一概念在下图 10.14 中得以演示。

![掌握循环守护](../images/3114.png)

**图 10.14** -- **了解环路防护**

在图 10.14 中，生成树网络已经收敛，且所有端口都处于阻塞或转发状态。但是，由于一条单向链路，`Switch 3` 上的阻塞端口会停止接收来自 `Switch 2` 上指定端口的 BPDU。`Switch 3` 假定了该端口可被过渡到转发状态，并因此开始这一（状态）迁移该。该交换机随后会在那个端口上，中继出去接收到的 BPDU，而导致一个网络环路。

在环路防护启用后，交换机会跟踪所有非指定端口。只要端口继续接收 BPDU，就不会有问题；但当端口停止接收 BPDU 时，其就会被迁移到一种环路不一致状态。换句话说，在环路防护启用后，STP 的端口状态机会被修改为阻止端口在 BPDU 缺席时，从非指定端口角色过渡到指定端口角色。在实施环路防护时，咱们应注意以下的一些实施准则：

- 环路防护不能在同时启用了根端口防护的交换机上启用；
- 环路防护不会影响上行快速或骨干快速的运行；
- 环路防护务必只在点对点的链路上启用；
- 环路防护的运行，不受生成树的那些计时器影响；
- 环路防护实际上无法检测单向链路；
- 环路防护不能在端口快速或动态 VLAN 的端口上启用。


环路防护可在交换机端口上，使用 `spanning-tree loopguard default` 命令启用。

> *知识点*：
>
> - Loop Guard
>
> - the formation of loops within the Spanning Tree network
>
> - a unidirectional link
>
> - a loop-inconsistent state
>
> - Uplink Fast
>
> - Backbone Fast
>
> - Point-to-Point links
>
> - the Spanning Tree timers
>
> - Dynamic VLAN ports

## 根端口防护

根端口防护特性会防止指定端口成为根端口。当某个其上启用了根端口防护特性的端口，收到一个优势 BPDU 时，其便会将该端口迁移到根不一致状态，从而维持当前的根桥状态不变。这一概念在下图 10.15 中得以演示。

![掌握根守护](../images/3115.png)

**图 10.15** -- **理解根端口防护**

在图 10.15 中，`Switch 3` 被添加到了当前的 STP 网络，并发出比当前根桥的更优 BPDU。在正常情况下，STP 将重新计算整个拓扑，`Switch 3` 会是选出的根桥。但是，由于根端口守护特性在当前根桥，以及 `Switch 2` 上的指定端口上都启用了，因此当这两个交换机收到来自 `Switch 3` 的优势 BPDU 时，他们都会将这些端口置于根不一致状态。这会保留生成树拓扑。

根端口防护特性会阻止端口成为根端口，从而确保该端口始终是个指定端口。不同于其他可同时在全局基础上启用的 STP 增强功能，根端口防护务必要在那些根桥不应出现的所有端口上，手动启用。由于这个原因，在 LAN 中设计与实施 STP 时，确保一种确定性的拓扑非常重要。根端口防护使管理员能强制执行网络中根网桥的布置，确保没有客户设备会因疏忽，或其他原因成为生成树的根，因此其通常用于面向客户设备的 ISP 网络边缘。

根端口防护可在交换机端口上，使用 `spanning-tree guard root` 命令启用。

> *知识点*：
>
> - the Root Guard feature
>
> - a superior BPDU
>
> - a root-inconsistent state
>
> - the entire topology
>
> - on a globa basis
>
> - a deterministic topology
>
> - to enforce the Root Bridge placement in the network
>
> - the Root of the Spanning Tree
>
> - the network edge of ISP towards the customer's equipment

## 上行链路快速


上行链路快速特性，提供了在主链路发生失效（即根端口直接失效）时，更快的故障切换到冗余链路。这一特性的主要目的，是在上行链路失效时，改进 STP 的收敛时间。这一特性在那些有着到分布层冗余上行链路的接入层交换机上最常用；因此，其也得名于此。


在接入层交换机为双归属到分布层时，其中一条链路会被 STP 置于阻塞状态以防止环路。在到分布层的主链路失效时，处于阻塞状态的端口就必须在其开始转发流量前，先经历监听与学习状态。这会在该交换机能够将数据帧转发到其他网段前，造成 30 秒的延迟。上行链路快速的运行，如下图 10.16 中所示。


![掌握上行快速](../images/3116.png)

**图 10.16** -- **理解上行链路快速**

在图 10.16 中，`Access 1` 和还是 STP 根桥的 `Distribution 1` 之间链路的失效，将意味着 STP 会将 `Access 1` 和 `Distribution 1` 之间的链路，迁移到转发状态（即阻塞 > 侦听 > 学习 > 转发）。监听和学习状态，各需 15 秒，因此该端口只会在总共 30 秒后，才开始转发数据帧。而在上行链路快速特性启用时，到分配层的备份端口，会被立即置于转发状态，从而达到没有网络宕机时间效果。这一概念在下图 10.17 中得以演示。


![掌握上行快速（续）](../images/3117.png)

**图 10.17** -- **理解上行链路快速（续）**

上行链路可在交换机端口上，使用 `spanning-tree uplinkfast` 命令启用。

> *知识点*：
>
> - the Uplink Fast feature
>
> - faster failover to a redundant link when the primary link fails
>
> - direct failure of the Root Port
>
> - to improve the convergence time of STP in the event of a failure of an uplink
>
> - (Access Layer switches) dual-homed to the Distribution Layer
>
> - the backport to the Distribution Layer
>
> - no network downtime

## 骨干快速


骨干快速特性，提供 STP 域中某条间接链路失效时的快速故障切换。当交换机于其指定网桥（其根端口上），接收到某个次优 BPDU 时，故障切换便会发生。次优的 BPDU 表明，该指定网桥已失去了到根网桥的连接，因此该交换机便知道有了某种上游故障，而他会在无需等待定时器超时下，便更换根端口。这在下图 10.18 中进行了演示。

在图 10.18 中，`Switch 1` 和 `Switch 2` 之间的链路失效了。`Switch 2` 检测到这一情况并发出表明自己是根桥的 BPDU。这些次优的 BPDU 会在 `Switch 3` 上被收到，其仍保存着接收自 `Switch 1` 的 BPDU 信息。

![掌握骨干快速](../images/3118.png)


**图 10.18** -- **理解骨干快速**

`Switch 3` 将忽略这些次优 BPDU，直到最大老化值超时。在此期间，`Switch 2` 会继续发送 BPDU 到 `Switch 3`。当最大老化时间超时后，`Switch 3` 将老化掉所存储的来自根桥的 BPDU 信息，并过渡到监听状态，随后将发出接收自根桥的 BPDU 到 `Switch 2`。

由于这个 BPDU 优于自己的 BPDU，因此 `Switch 2` 会停止发送 BPDU，同时 `Switch 2` 上与 `Switch 3` 之间的端口，会历经监听和学习状态，并最后进入转发状态。STP 进程的这种默认运行方式，将意味着 `Switch 2` 会在至少 50 秒内无法转发数据帧。


主干快速特性包含一种允许在某个次优 BPDU 收到时，立即检查存储在某个端口上的 BPDU 信息，是否仍然有效的机制。这是以一种称为 RLQ PDU 的新 PDU 以及根链路查询实现的。

收到次优 BPDU 后，该交换机将在除收到次优 BPDU 的端口外的所有非指定端口上，发出 RLQ PDU。当交换机为根桥，或其已失去到根桥的连接时，那么他将响应 RLQ。否则，RLQ 将向上游传播。当交换机在其根端口上收到 RLQ 响应时，那么到根网桥的连接仍然完好。当响应在非根端口上收到时，就表示到根桥的连通性已丢失，同时本地交换机的生成树必须要在该交换机上重新计算。最大老化计时器已超时，从而就新的根端口就能找到。这一概念在下图 10.19 中进行了演示。


![掌握骨干快速（续）](../images/3119.png)

**图 10.19** -- **理解骨干快速（续）**




> **注意：** RLQ PDU有着与普通 BPDU 同样的包格式，唯一区别在于RLQ PDU包含了两个用于请求和回应的思科SNAP(子网接入协议，[Subnetwork Access Protocol](https://en.wikipedia.org/wiki/Subnetwork_Access_Protocol))地址。

## STP排错

**Troubleshooting STP**

大多数二层故障都跟域中某种循环有关，而这又引起与其相关的多种问题，包括网络停机。在进行交换机配置的工作及将某台设备插入或拔出时，应确保没有在操作过程中建立循环。为缓和这类问题，就通常应在这些交换机上配置生成树协议，以避免出现在网络中的某处偶然创建出循环的情形（to mitigate against such problems, you should usually configure Spanning Tree Protocol on switches in order to avoid situations that might occur if you happen to accidently create a loop somewhere in the network）。

网络中的所有交换机都是靠 MAC 地址进行通信的。在数据包进入时，就对 MAC 地址进行分析，从而基于二层头部中的目的 MAC 地址，确定出那个数据包的去向。网络中的所有设备都有着其自己的 MAC 地址，所以所有数据包在其走向上都是具体的。**不幸的是，像是广播及多播数据包前往交换机的所有端口。**如一个广播帧到达某个交换机端口，它将那个广播拷贝到可能连接到那台交换机的每台其它设备。此过程在网络中有着循环时，通常能是个问题。

应记住 MAC 地址数据包内部没有超时机制。**在TCP/IP中（in the case of TCP/IP）， IP 协议在其头部有一个名为 TTL （存活时间，Time to Live）的功能，该功能就是通过路由器的跳数, 而不是事实上的时间单位。**所以如果 IP 数据包碰巧处于循环中而通过多台路由器，它们将最终超时而被从网络中移除。但是，交换机并未提供那种机制。二层数据帧理论上可以永久循环，因为没有将其超时的机制，意味着如创建出一个循环，那个循环就会一直在那里，直到手动将其从网络中移除。

如正将一台工作站插入到网络时，某个广播帧到达该工作站，那么该广播数据帧将在那个点终结而不会是个网络问题。但是，如在交换机侧端口进行了不当配置，或两端都插入了交换机而未开启 STP ，这将导致二层域内的广播风暴。广播风暴的发生，是因为广播数据包被转发到了所有其它端口，因此广播数据包保持继续存在并进入到同一网线上的另一交换机，引起二层循环。广播风暴能够引起高的资源使用甚至网络宕机。

如在这样的配置不当的网络上开启 STP ，交换机将识别到循环的出现，并会阻塞确定端口以避免广播风暴。而所有交换机中的其它端口则继续正常运作，所以网络不受影响。如未有配置 STP ，那么唯一可做的就是拔掉引起问题的网线，或者在还能对交换机进行操作的时候，将其管理性关闭。

STP故障通常有以下三类（STP issues usually fall within the following three categories）。

- 不正确的根桥, incorrect Root Bridge
- 不正确的根端口, incorrect Root Port
- 不正确的指定端口，incorrect Designated Port

### 不正确的根桥

优先级和基础 MAC 地址决定根桥是否是正确的（priority and base MAC addresss decide whether the Root Bridge is incorrect）。可以执行`show spanning-tree vlan <vlan#>`命令查看 MAC 地址及交换机优先级。而运用`spanning-tree vlan <vlan#> priority <priority>`命令修复此问题。

### 不正确的根端口

根端口提供了自该交换机到根桥最快的路径，同时开销是跨越整个路径的累积（the Root Port provides the fastest path from the switch to the Root Bridge, and the cost is cumulative across the entire path）。如怀疑存在正确的根端口，就可执行`show spanning-tree vlan <vlan#>`命令。如根端口是不正确的，可执行`spanning-tree cost <cost>`命令对其进行修复。

### 不正确的指定端口

指定端口是将某个网络区段连接到网络其它部分最低开销的端口（the Designated Port is the lowest cost port connecting a network segment to the rest of the network）。如怀疑存在指定端口问题，就可以执行`show spanning-tree vlan <vlan#>`及`spanning-tree cost <cost>`命令。

而可对相关事件进行调试的一个有用的 STP 排错命令，就是`Switch#debug spanning-tree events`。

## 第 31 天问题

1. How often do switches send Bridge Protocol Data Units ( BPDUs)?
2. Name the STP port states in the correct order.
3. What is the default Cisco Bridge ID?
4. Which command will show you the Root Bridge and priority for a VLAN?
5. What is the STP port cost for a 100Mbps link?
6. When a port that is configured with the `_______` `_______` feature receives a BPDU, it immediately transitions to the errdisable state.
7. The `_______` `_______` feature effectively disables STP on the selected ports by preventing them from sending or receiving any BPDUs.
8. Which two commands will force the switch to become the Root Bridge for a VLAN?
9. Contrary to popular belief, the Port Fast feature does not disable Spanning Tree on the selected port. This is because even with the Port Fast feature, the port can still send and receive BPDUs. True or false?
10. The Backbone Fast feature provides fast failover when a direct link failure occurs. True or false?

## 第 31 天答案

1. Every two seconds.
2. Blocking, Listening, Learning, Forwarding, and Disabled.
3. 32768.
4. The `show spanning-tree vlan x` command.
5. 19.
6. BPDU Guard.
7. BPDU Filter.
8. The `spanning-tree vlan [number] priority [number]` and `spanning-tree vlan [number] root [primary|secondary]` commands.
9. True.
10. False.

## 第 31 天实验

### 生成树根选举实验

**实验拓扑**

![生成树根选举实验拓扑](../images/3119.png)

**实验目的**

学习如何对哪台交换机成为生成树根桥施加影响。

**实验步骤**

1. 设置各台交换机的主机名并将其用交叉线连接起来。此时可以检查它们之间的接口是否被设置到“ trunk ”中继。


    ```console
    Switch#show interface trunk
    ```

2. 在将一侧设置为中继链路之前，可能看不到中继链路变成活动的。


    ```console
    SwitchB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    SwitchB(config)#int FastEthernet0/1
    SwitchB(config-if)#switchport mode trunk
    SwitchB(config-if)#^Z
    SwitchB#sh int trunk
    Port    Mode        Encapsulation   Status      Native vlan
    Fa0/1   on          802.1q          trunking    1
    Port    Vlans allowed on trunk
    Fa0/1   1-1005
    Port    Vlans allowed and active in management domain
    Fa0/1   1
    ```

3. 将看到另一交换机是留作自动模式的。


    ```console
    SwitchA#show int trunk
    Port    Mode        Encapsulation   Status      Native vlan
    Fa0/1   auto        n-802.1q        trunking    1
    Port    Vlans allowed on trunk
    Fa0/1   1-1005
    Port    Vlans allowed and active in management domain
    Fa0/1   1
    ```

4. 在每台交换机上创建出两个 VLANs 。


    ```console
    SwitchA#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    SwitchA(config)#vlan 2
    SwitchA(config-vlan)#vlan 3
    SwitchA(config-vlan)#^Z
    SwitchA#
    %SYS-5-CONFIG_I: Configured from console by console
    SwitchA#show vlan brief
    VLAN Name                   Status      Ports
    ---- ------------------     -------     --------------------
    1    default                active      Fa0/2, Fa0/3, Fa0/4,
                                            Fa0/5, Fa0/6, Fa0/7,
                                            Fa0/8, Fa0/9, Fa0/10,
                                            Fa0/11, Fa0/12, Fa0/13,
                                            Fa0/14, Fa0/15, Fa0/16,
                                            Fa0/17, Fa0/18, Fa0/19,
                                            Fa0/20, Fa0/21, Fa0/22,
                                            Fa0/23, Fa0/24
    2    VLAN0002               active
    3    VLAN0003               active
    1002 fddi-default           active
    1003 token-ring-default     active
    ```

    同时也在交换机 B 上创建出 VLANs （拷贝上面的命令）。

5. 确定哪台交换机是VLANs 2和 3 的根桥。


    ```console
    SwitchB#show spanning-tree vlan 2
    VLAN0002
        Spanning tree enabled protocol ieee
        Root ID     Priority    32770
                    Address 0001.972A.7A23
                    This bridge is the root
                    Hello Time  2 sec
                    Max Age     20 sec  Forward Delay 15 sec
        Bridge ID   Priority    32770 (priority 32768 sys-id-ext 2)
                    Address     0001.972A.7A23
                    Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                    Aging Time  20
    Interface           Role  Sts  Cost      Prio.Nbr Type
    ---------           ----  ---  ----      -------- ----
    Fa0/1               Desg  FWD  19        128.1    P2p
    ```

    可以看到，Switch B是根。在交换机 A 上完成同样的命令，并对VLAN 3进行检查。优先级是 32768 加上 VLAN 编号，这里就是2.最低 MAC 地址将确定出根桥。

    ```console
    SwitchB#show spanning-tree vlan 3
    VLAN0003
        Spanning tree enabled protocol ieee
        Root ID     Priority    32771
                    Address 0001.972A.7A23
                    This bridge is the root
                    Hello Time  2 sec   Max Age 20 sec  Forward Delay 15 sec
        Bridge ID   Priority    32771 (priority 32768 sys-id-ext 3)
                    Address 0001.972A.7A23
                    Hello Time  2 sec   Max Age 20 sec  Forward Delay 15 sec
                    Aging Time  20
    Interface           Role  Sts  Cost       Prio.Nbr Type
    ----------          ----  ---  ----       -------- ----
    Fa0/1               Desg  FWD  19         128.1    P2p
    ```

    这里Switch A的 MAC 地址较高，这就是为何其不会成为根桥的原因：`0010： 1123 ：D245`

6. 将另一个交换机设置为VLANs 2和 3 的根桥。对VLAN 2使用命令`spanning-tree vlan 2 priority 4096`，以及对VLAN 3的`spanning-tree vlan 3 root primary`命令。


    ```console
    SwitchA(config)#spanning-tree vlan 2 priority 4096
    SwitchA(config)#spanning-tree vlan 3 root primary
    SwitchA#show spanning-tree vlan 2
    VLAN0002
        Spanning tree enabled protocol ieee
        Root ID     Priority     4098
                    Address         0010.1123.D245
                    This bridge is the root
                    Hello Time      2 sec   Max Age 20 sec  Forward Delay 15 sec
        Bridge ID   Priority        4098  (priority 4096 sys-id-ext 2)
                    Address         0010.1123.D245
                    Hello Time      2 sec   Max Age 20 sec  Forward Delay 15 sec
                    Aging Time      20
    Interface           Role  Sts      Cost       Prio.Nbr Type
    ---------           ----  ---      ----       -------- ----
    Fa0/1               Desg  FWD      19         128.1    P2p
    SwitchA#show spanning-tree vlan 3
    VLAN0003
        Spanning tree enabled protocol ieee
        Root ID    Priority    24579
                   Address     0010.1123.D245
                   This bridge is the root
                   Hello Time  2 sec    Max Age 20 sec  Forward Delay 15 sec
    Bridge ID      Priority    24579 (priority 24576 sys-id-ext 3)
                   Address     0010.1123.D245
                   Hello Time  2 sec    Max Age 20 sec  Forward Delay 15 sec
                   Aging Time  20
    Interface          Role  Sts  Cost        Prio.Nbr Type
    ---------          ----  ---  ----        -------- ----
    Fa0/1              Desg  FWD  19          128.1    P2p
    SwitchA#
    ```

    > **注意：** 尽管Switch B有较低的桥 ID ，Switch A还是被强制作为根桥。


（End）



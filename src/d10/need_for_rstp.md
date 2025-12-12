# RSTP 的必要性


随着技术的不断发展，以及同一物理平台上路由与交换能力的融合，交换网络的收敛，已明显落后于诸如 OSPF 和 EIGRP 等路由协议，他们能够在更短时间内提供备用路径。[802.1W 标准](https://en.wikipedia.org/wiki/Spanning_Tree_Protocol#Rapid_Spanning_Tree_Protocol) 就被设计来解决这一问题。

IEEE 802.1W 标准，或快速生成树协议（RSTP），大大缩短了链路失效时，STP 收敛所用的时间。在 RSTP 下，网络故障切换到备用路径或链路，可在亚秒的时间窗口发生。RSTP 是 [802.1D](https://en.wikipedia.org/wiki/IEEE_802.1D) 的一项扩展，完成类似与上行链路快速及主干快速的功能。在无额外配置下，RSTP 性能优于传统 STP。此外，RSTP 向后兼容最初的 IEEE 802.1D STP 标准。他通过使用修改后的 BPDU，实现这点，如下面的屏幕截图所示。

![修改的BPDU](../images/3201.png)

**图 10.20** -- **修改后的 BPDU**

RSTP 的端口状态，可按如下方式映射到 STP 的端口状态：

- 禁用 -- 丢弃
- 阻塞 -- 丢弃
- 监听 -- 丢弃
- 学习 -- 学习
- 转发 -- 转发

RSTP 端口角色包括以下这些：

- 根（转发状态）
- 指定（转发状态）
- 备用（阻塞状态）
- 备份（阻塞状态）


对于考试，重要的是咱们要理解上述要点，尤其是哪些端口状态会转发流量（一旦网络收敛后）。图 10.21 和 10.22 分别演示了 RSTP 的备用端口及 RSTP 的备份端口。


![RSTP 备用端口](../images/3202.png)

**图 10.21** -- **RSTP 的备用端口**

![RSTP备份端口](../images/3203.png)

**图 10.22** -- **RSTP 的备份端口**

## 带 PVST+ 的 RSTP

基于每个 VLAN 的生成树增强版（PVST+），实现了每个 VLAN 的一个单独 STP 实例。传统或普通 PVST + 模式，对链路失效时交换网络的收敛，仍依赖于较早 802.1D STP 的使用。

## RPVST+

快速的基于每个 VLAN 的生成树增强版本，实现了 PVST+ 下 802.1W 的运用。这实现了对每个 VLAN 的一个单独 RSTP 实例，同时提供比传统 802.1D STP 下所能达到的，快得多的收敛速度。默认情况下，在 RSTP 在思科交换机上启用时，R-PVST+ 在该交换机会启用。

这里有个咱们可以用来记住各种 IEEE STP 规范字母名称的记忆小窍门：

- 802.1D（“经典” 生成树）-- It's **d**og-gone slow；
- 802.1W（快速生成树）-- Imagine Elmer Fudd saying "rapid" as "wapid"；
- 802.1S（多重生成树）-- You add the letter "s" to nouns to make them plural(multiple), but this is a CCNP SWITCH subject.



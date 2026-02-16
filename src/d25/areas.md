# OSPF 的区域

除了这一教学模组前几个小节示例中，曾介绍并使用过的骨干区域（`Area 0`）与其他非骨干区域外，OSPF 规范还定义了数种 “特殊” 的区域类型。这些区域的配置，主要用于通过阻止一些不同 LSA 类型（主要是 `Type 5` 的 LSA）注入到一些区域，以减小位于这些区域内路由器上的链路状态数据库大小，这些区域包括以下这些：

- 次末梢区域，Not-so-stubby Areas, NSSAs
- 完全次末梢区域, Totally Not-so-stubby Areas, TNSSAs
- 末梢区域, Stub Areas, SAs
- 完全末梢区域, Totally Stubby Areas, TSAs

## 次末梢区域, NSSA

次末梢区域（NSSA），是一种 OSPF 末梢区域，允许 ASBR 使用 NSSA 外部 LSA（`Type 7`），实现外部路由信息的注入。正如上一小节中曾提到的，`Type 4`、`Type 5` 及 `Type 7` 的 LSA，均用于外部路由的计算。我们将不详细探讨 `Type 7` 的 LSA，或他们在 NSSA 中的使用方式。


## 完全次末梢区域, TNSSA

完全次末梢区域（TNSSA），属于次末梢区域（NSSA）的一项扩展。与 NSSA 一样，[`Type 5` 的 LSA](./LSAs_and_LSDB.md#as-外部-lsa-type-5) 不允许进入 TNSSA；不同于 NSSA，摘要 LSA 也不允许进入 TNSSA。此外，在某个 TNSSA 配置后，默认路由会作为 `Type 7` 的 LSA 注入该区域。TNSSA 有着以下特征：

- `Type 7` 的 LSA 会在 NSSA 的 ABR 处，转换为 [`Type 5` 的 LSA](./LSAs_and_LSDB.md#as-外部-lsa-type-5)
- 不允许 [网络摘要 LSA](./LSAs_and_LSDB.md#网络摘要-lsa-type-3)
- 不允许 [外部 LSA](./LSAs_and_LSDB.md#as-外部-lsa-type-5)
- 默认路由是作为 [摘要 LSA](./LSAs_and_LSDB.md#网络摘要-lsa-type-3) 被注入的


## 末梢区域, SA

末梢区域在某种程度上类似于 NSSA，主要的例外是外部路由（`Type 5` 或 `Type 7`）不允许进入末梢区域。重要的是要理解，OSPF 和 EIGRP 中的末梢功能完全不同。在 OSPF 中，某个区域作为末梢区域的这种配置，在无需任何进一步配置下，即可通过阻止外部 LSA 通告到此类区域，减少末梢区域内路由器的路由表与 OSPF 数据库的大小。末梢区域有着以下特征：

- 默认路由是由 ABR，作为 [`Type 3` 的 LSA](./LSAs_and_LSDB.md#网络摘要-lsa-type-3) 注入到末梢区域中
- 来自其他区域的 `Type 3` LSA，允许进入这些区域
- 外部路由的 LSA（即 [`Type 4`](./LSAs_and_LSDB.md#asbr-摘要-lsa-type-4) 及 [`Type 5` LSA](./LSAs_and_LSDB.md#as-外部-lsa-type-5)），则不被允许


## 完全末梢区域, TSA

完全末梢区域（TSA），属于末梢区域的扩展。但不同于末梢区域，TSA 除了通过限制外部 LSA 外，还通过限制 `Type 3` 的 LSA，进一步减小 TSA 中路由器上 LSDB 的大小。TSA 通常配置于那些仅有单个到网络的入口及出口点的路由器上，例如在传统的中心-分支网络中。这种区域的路由器会转发全部外部流量到 ABR。ABR 还是所有骨干流量，与区域间流量到这个 TSA 的出口点，TSA 有着以下特征：

- 默认路由是作为 [`Type 3` 网络摘要 LSA](./LSAs_and_LSDB.md#网络摘要-lsa-type-3)，注入末梢区域的
- 来自其他区域的 `Type 3`、[`Type 4`](./LSAs_and_LSDB.md#asbr-摘要-lsa-type-4) 与 [`Type 5`](./LSAs_and_LSDB.md#as-外部-lsa-type-5) LSA，均不允许注入这些区域




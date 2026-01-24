# OSPF 版本 3


OSPFv3 定义在 [RFC 2740](https://datatracker.ietf.org/doc/html/rfc2740)，是 OSPFv2 的对应版本，但其专门针对 IPv6 的路由协议设计。这个版本源自 OSPF 数据包中的 `Version` 字段，这个字段已更新为 3 的值。OSPFv3 规范主要基于 OSPFv2，但由于那些针对 IPv6 所增加的支持，而包含了一些额外增强。

OSPFv2 与 OSPFv3 可在同一路由器上同时运行。换言之，同一物理路由器可同时路由 IPv4 和 IPv6，因为两种地址族有着不同的 SPF 进程。这并非指 SPF 本身对 OSPFv2 和 OSPFv3 不同；这一表述仅意味着，同一 SPF 算法的两个单独实例，分别针对 OSPFv2 与 OSPFv3 运行着。OSPFv2 与 OSPFv3 的一些共性如下：

- OSPFv3 继续使用了同样被 OSPFv2 用到的一些相同数据包。这些数据包包括数据库描述（DBD）、链路状态请求（LSR）、链路状态更新（LSU）以及链路状态通告（LSA）；
- 动态的邻居发现机制及邻接关系形成过程（即 OSPF 从 `Init` 或 `Attempt` 状态，过渡至 `Full` 状态的不同邻居状态），在 OSPFv3 中保持与 OSPFv2 一样；
- OSPFv3 在不同技术上仍符合 RFC 规范。例如：当 OSPFv3 于某一 PPP 链路上启用时，那么网络类型仍被指定为点对点的；以类似方式，当 OSPFv3 在帧中继上启用时，那么默认网络类型仍指定为非广播的。此外，默认的网络类型，仍可通过使用 Cisco 10S 软件中的不同接口特定命令，手动予以修改；
- OSPFv2 与 OSPFv3 均使用同一 LSA 泛洪与老化机制；
- 与 OSPFv2 一样，OSPFv3 的路由器 ID（RID），仍需要使用 32 位的 IPv4 地址。当 OSPFv3 在某一运行双栈（即同时支持 IPv4 和 IPv6）路由器上启用时，由 OSPFv2 用到的同一 RID 选举过程，会被用于确定出要使用的路由器 ID。但是，当 OSPFv3 于某一没有运行 IPv4 接口的路由器上启用时，那么就会强制要求 OSPFv3 的路由器 ID，通过 `router-id` 这条路由器配置命令，予以手动配置。
- OSPFv3 的链路 ID，表明这些链路并非 IPv6 专属，而与 OSPFv2 下的情形一样，这些链路仍基于某个 32 位的 IP 地址。

尽管 OSPFv2 与 OSPFv3 之间存在相似之处，但重要的是要理解，两者之间存在咱们必须熟悉的一些显著差异，这些差异包括：

- 以与 EIGRP 类似的方式，OSPFv3 运行于某一链路上。这一方式消除了要有一条针对 OSPFv3 的语句的需要。取而代之的是，通过使用 `ipv6 router ospf [process ID] area [area ID]` 这条接口配置命令，这一链路会被配置为 OSPF 进程的一部分。但是，与 OSPFv2 一样，OSPF 的进程 ID，仍是在全局配置模式下，使用 `ipv6 router ospf [process ID]` 这条全局配置命令指定的；
- OSPFv3 使用了链路本地地址，标识邻接关系。与 EIGRPv6 一样，OSPFv3 的下一跳 IPv6 地址，将反映邻接或邻居路由器的链路本地地址；
- OSPFv3 引入了两种新的 OSPF LSA 类型。他们分别是定义为 LSA `Type 0x0008`（或 LSA `Type 8`） 的链路 LSA，Link LSA，及定义为 LSA `Type 0x2009`（或 LSA `Type 9`）的区域内前缀 LSA，Intra-Area-Prefix LSA。链路 LSA 提供了路由器的链路本地地址，与连接到这一链路上的所有 IPv6 前缀。每条链路上都有一种链路 LSA。而可能存在有着不同链路状态 ID 的多种区域内前缀 LSA。因此区域泛洪范围，就既可能是个引用了某一 `Network` LSA 的关联中转网络前缀，也可能是个引用了某一 `Router` LSA 的关联路由器或 `Stub`（末梢）前缀；
- 由 OSPFv2 与 OSPFv3 用到的传输方式不同，OSPFv3 的报文，是透过（封装在） IPv6 数据包发送的；
- OSPFv3 使用了两个标准的 IPv6 组播地址。组播地址 `FF02::5` 相当于 OSPFv2 下用到的 `AllSPFRouters` 组播地址 `224.0.0.5`，而组播地址 `FF02::6` 则属于 `AllDRRouters` 这个组播地址，相当于 OSPFv2 下用到的 `224.0.0.6` 这个组地址；
- OSPFv3 利用了内建的 IPSec 能力，并使用 `AH` 和 `ESP` 两个扩展头部作为认证机制，取代了可在 OSPFv2 下配置的众多认证机制。因此，OSPFv3 下的 `Authentication` 和 `AuType` 两个自断，均已从 OSPF 数据包头部移除；
- 终于，最后一项显著差异在于：OSPFv3 的 `Hello` 数据包现在完全不包含任何地址信息，但会包含某个接口 ID，其为发出 `Hello` 数据包的路由器已分配的，用于向该链路唯一标识其接口。若该路由器成为这条链路上的指定路由器，那么这个接口 ID 就会成为 `Network` LSA 的链路状态 ID。



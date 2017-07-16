#第38天

**EIGRP对IPv6的支持**

**EIGRP For IPv6**

##第38天任务

- 阅读今天的课文（以下内容）
- 复习EIGRP模块
- 复习EIGRP故障排除模块

尽管针对IPv6的EIGRP内容，并没有在新的CCNA考试大纲中特别列出，但因为以下原因，此方面的内容将在本模块中加以涵盖。首先，CCNA题目对有关EIGRP与IPv6技术有着较高的关注，所以就算看起来不怎么可能，EIGRPv6方面的题目仍可能出现在考试中。其次，此方面内容相对容易而简单，因此掌握起来也不会花很多时间，尤其在考虑讲解并不会深入的情况下。

除了那些开放的标准协议外，思科专有的EIGRP也已被修订到支持IPv6了。因为其支持IPv6, 所以有时这个修订版的EIGRP被成为是EIGRPv6，而并不是因为它是EIGRP路由协议的第6版。类似地，IPv4的EIGRP有时也被称为EIGRPv4, 以区别两个版本所支持的其所路由协议的不同（In addition to open standart protocols, the Cisco-proprietary EIGRP has also been modified to support IPv6. This modified version of EIGRP is sometimes referred to as EIGRPv6 because of its support for IPv6, not because it is revision 6 of the EIGRP routing protocol. Similarly, EIGRP for IPv4 is also sometimes referred to as EIGRPv4 to differentiate between the routing protocol versions supported by either version）。

今天将学习以下内容：

- IPv6下的思科EIGRP概览与基础知识，Cisco EIGRP for IPv6 overview and fundamentals
- IPv6下的EIGRP的配置基础

本课程对应了以下CCNA大纲要求：

- 配置并验证EIGRP（单一自治系统，Configure and verify EIGRP(Single AS)）

EIGRPv6保留了EIGRPv4中的大部分相同基础的核心功能（For the most part, EIGRPv6 retains the same basic core functions as EIGRPv4）。比如两个版本仍使用弥散更新算法来确保无环回的路径，同时两个版本都使用多播数据包来发送更新--尽管EIGRPv6使用的是IPv6的多播地址`FF02::A`，而EIGRPv4使用的是组地址`224.0.0.10`。在保留了一些相同核心基础的同时，版本之间有着一些不同之处。下表38.1列出了EIGRPv4与EIGRPv6之间，或简单且更通常地说是IPv4下的EIGRP与IPv6下的EIGRP之间的不同之处：

*表 38.1 -- EIGRPv4与EIGRPv6的差异*

| 协议特性（Protocol Characteristic） | IPv4下的EIGRP | IPv6下的EIGRP |
| ------ | ------ | ------ |
| 自动汇总特性 | 支持（Yes） | 不适用（Not Applicable） |
| 认证或安全特性 | MD5 | 内建于IPv6中（Built into IPv6） |
| 要求对等点处于同一子网（Common Subnet for Peers） | 要求（Yes） | 不要求（No） |
| 通告内容（Advertisement Contents）| 子网/掩码（Subnet/Mask） | 前缀/长度（Prefix/Length） |
| 数据包的封装（Packet Encapsulation） | IPv4封装（IPv4） | IPv6封装（IPv6） |

> **注意：** 因为EIGRPv6使用邻居的链路本地地址作为下一跳地址，因此在位于同一自治系统及同一网段的两台路由器建立邻居关系时，就不需要其全局的IPv6单播子网一致了。这一点是要求邻居在同一子网的EIGRPv4，与使用链路本地地址建立邻居关系而消除了此要求的EIGRPv6之间，最为显著的不同之一（Because EIGRPv6 uses the Link-Local address of the neighbour as the next-hop address, the global IPv6 Unicast subnets do not need to be the same for a neighbour relationship to be established between two routers that reside within the same autonomous system and are on a common network segment. This is one of the most significant differences between EIGRPv4, which requires neighbours to be on a common subnet, and EIGRPv6, which negates this need by using the Link-Local addresses for neighbour relationships instead）。

## 思科IOS软件在EIGRPv4与EIGRPv6配置上的差异

**Cisco IOS Software EIGRPv4 and EIGRPv6 Configuration Differences**

思科IOS软件中对EIGRPv4与EIGRPv4的配置上，有着一些显著的差异。那么第一个显著差异就在于开启受路由的协议方式的不同。对于EIGRPv4来说，需要使用全局配置命令`router eigrp [ASN]`来开启EIGRPv4的路由，并指定该EIGRPv4自治系统编号。而在配置EIGRPv6时，则是使用`ipv6 router eigrp [ASN]`来开启EIGRPv6并指定出**本地路由器ASN**了（There are some notable differences in the configuration of EIGRPv4 and EIGRPv6 in Cisco IOS software. The first notable difference is the way in which the routing protocol is enabled. For EIGRPv4, the `router eigrp [ASN]` global configuration command is required to enable EIGRPv4 routing and to specify the EIGRPv4 autonomous system number(ASN). When configuring EIGRPv6, the `ipv6 router eigrp [ASN]` global configuration command is used instead to enable EIGRPv6 and to specify **the local router ASN**）。

尽管EIGRPv4与EIGRPv6的开启有些类似，但在两个路由进程开启之后的协议状态中，是有着非常显著的不同的。默认在开启了EIGRPv4时，该协议就自动启动，并在其假定有桌正确配置的情况下，开始在所有指定的运作接口上发送Hello数据包。而当在思科IOS软件中启用EIGRPv6时，默认情况下在该协议被开启后，其将保持关闭状态。这就意味着就算在某些指定接口下得以开启，在执行路由器配置命令`no shutdown`之前，EIGRP进程仍不是运作中的（While enabling EIGRPv4 and EIGRPv6 is somewhat similar, there is a very notable and significant difference in the protocol states once the routing process has been enabled. By default, when EIGRPv4 is enabled, the protocol automatically starts and, assuming correct configuration, begins sending Hello packets on all specified interfaces. When enabling EIGRPv6 in Cisco IOS software, by default, after the protocol has been enabled, it remains in the shutdown state. This means that even if enabled under specified interfaces, the EIGRP process will not be operational until the `no shutdown` router configuration command is issued）。



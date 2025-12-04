# IPv6 协议和机制

虽然互联网协议版本 6 与版本 4 相似，但与后者相比，前者的运行中有一些显著的区别。以下 IPv6 的协议和机制会在这一小节中介绍：

- IPv6 的 ICMP
- IPv6 邻居发现协议 (NDP)
- IPv6 有状态自动配置
- IPv6 无状态自动配置

## 用于 IPv6 的 ICMP

ICMP 用于向源主机报告有关 IP 数据包向预定目的地的传送的错误及其他信息。定义在 [RFC 2463](https://datatracker.ietf.org/doc/html/rfc2463) 中作为第 58 号协议的 ICMPv6，支持 ICMPv4 的报文，并包括了一些 ICMPv6 的额外报文。ICMPv6 用在基本 IPv6 数据包头部的下一头部字段中。与 IPv4 不同，IPv6 会将 ICMPv6 视为一种诸如 TCP 的上层协议，这意味着 ICMPv6 是放在 IPv6 数据包中，所有可能的扩展头部后的。包含在 ICMPv6 数据包中的字段，如下图 3.11 中所示。

> *知识点*：
>
> the Next Header field of the basic IPv6 packet header

![ICMPv6数据包头部](../images/0711.png)

**图 3.11** -- **ICMPv6 数据包头部**


在 ICMPv6 数据包头部中，8 位的类型字段用于表明或识别 ICMPv6 报文的类型。这个字段同时用于提供错误与信息性报文。下表 3.9 列出并描述了这个字段中的一些常见值。


**表 3.9** -- **ICMPv6 报文类型**

| ICMPv6 类型 | 说明 |
| :-: | :-: |
| 1 | 目的地址不可达 |
| 2 | 数据包太大 |
| 3 | 发生了超时 |
| 128 | Echo 请求 |
| 129 | Echo 回应 |

**注意**：这些相同的报文类型，在 ICMPv4 下也被用到。

在类型字段后，8 位的代码字段提供了与所发送报文类型有关的详细信息。下表 3.10 说明了这个字段的一些常见值，他们也被 ICMPv4 共用。


**表3.10** -- **ICMPv6 的一些代码**

| ICMPv6 代码 | 说明 |
| :-: | :-: |
| 0 | Echo 回复 |
| 3 | 目的地址不可达 |
| 8 | Echo |
| 11 | 发生了超时 |

在代码字段后，16 位的校验和字段包含了个用于检测 ICMPv6 中数据损坏的计算值。最后，报文或数据字段，是个包含特定于由类型和代码字段所指明报文类型的特定数据的可选变长度字段。在被用到时，这个字段会提供信息给目的主机。ICMPv6 是 IPv6 的核心组件。在 IPv6 内，ICMPv6 被用于以下功能：

- 重复地址检测（DAD）
- 取代 ARP
- IPv6 无状态自动配置
- IPv6 前缀重编号
- 路径 MTU 发现 (PMTUD)

> **知识点**：
>
> - the Type field
>
> - the Code field
>
> - the 16-bit Checksum field
>
> - the Message or Data field

**注意**：在上述选项中，DAD 与无状态自动配置，将在这一小节稍后介绍。PMTUD 超出了当前 CCNA 考试要求范围，而将不在这个教学模组，或这本指南的其余部分详细介绍。

## IPv6 邻居发现协议（NDP）

IPv6 的 NDP 实现了 IPv6 的即插即用特性。他定义在 [RFC 2461](https://datatracker.ietf.org/doc/html/rfc2461) 中，是 IPv6 不可分割的一部分。NDP 运行于链路层，负责发现链路上的其他节点、确定其他节点的链路层地址、找到可用路由器，并维护有关到其他活动邻居节点路径的可达性信息。NDP 执行了 IPv6 的，与 IPv4 的 ARP（他取代的协议）及 ICMP 路由器发现与路由器重定向协议等方式类似的功能。不过，重要的是记住，NDP 提供的功能比 IPv4 下用到的那些机制，更强大的功能。在与 ICMPv6 结合使用时，NDP 实现了以下功能：

- 动态的邻居和路由器发现
- ARP 的替代
- IPv6 无状态自动配置
- 路由器重定向
- 主机参数发现
- IPv6 地址解析
- 下一跳路由器确定
- 邻居不可达检测 (NUD)
- 重复地址检测 (DAD)


**注意**：咱们无需深入了解上面列出的每种优点的具体细节。

邻居发现协议定义了五种类型的 ICMPv6 数据包，他们在下表 3.11 种列出并描述。

**表 3.11** - **ICMPv6 NDP 报文类型**

| ICMPv6 类型 | 说明 |
| :-: | :-: |
| 133 | 用于路由器询问报文 |
| 134 | 用于路由器通告报文 |
| 135 | 用于邻居询问报文 |
| 136 | 用于邻居通告报文 |
| 137 | 用于路由器重定向报文 |


路由器询问报文，由主机在接口开启 IPv6 时发送。这些报文用于请求本地网段上的路由器，立即生成 RA 报文，而不是在下一个预定的 RA 间隔生成。下图 3.12 展示了某条 RS 报文的线路捕获。


![IPv6路由器询问报文](../images/0712.png)

**图 3.12** -- **IPv6 路由询问报文**

收到 RS 报文后，路由器便会使用 RA 报文，通告他们的存在，RA 报文通常了包括本地链路的前缀信息，以及诸如建议的跳数限制等额外配置。RA 中包含的信息如下图 3.13 中所示。

![IPv6路由器通告报文](../images/0713.png)

**图 3.13** -- **IPv6 路由器通告报文**

重申一下，RS 和 RA 报文，是针对路由器到主机，或主机到路由器的交换，如下图所示。

![IPv6的 RS 和 RA 报文](../images/0714.png)


**图 3.14** -- **IPv6 RS 和 RA 报文**

IPv6 的 NS 报文，是由本地网段上的 IPv6 路由器组播的，用于确定某个邻居的数据链路地址，或验证某个邻居是否仍可到达（因此其取代了 ARP 的功能）。这些报文还用于重复地址检测。虽然深入研究 NS 报文，超出了 CCNA 考试要求的范围，下图 3.15 仍展示了某个 IPv6 邻居询问报文的一次线路捕获。


![IPv6邻居询问报文](../images/0715.png)

**图 3.15** -- **IPv6 邻居询问报文**

邻居广告报文通常是由本地网段上的路由器，响应收到的 NS 报文而发送。不过，当比如 IPv6 前缀变化时，随后路由器也会主动发出一些非询问的 NS 消息，告知本地网段上其他设备。与 NS 报文的情形一样，详细说明 NA 报文的格式或字段，超出了 CCNA 考试要求的范围。下图 3.16 和 3.17，展示了同样经由 IPv6 组播发送的邻居通告报文的线路捕获。


![IPv6邻居通告报文](../images/0716.png)

**图 3.16** -- **IPv6 邻居通告报文**

![IPv6邻居通告报文](../images/0717.png)

**图 3.17** -- **IPv6 邻居通告报文**

最后，路由器重定向用到 ICMPv6 重定向报文，其被定义为报文类型 137。路由器重定向用于通知网络主机，网络上存在一台有着到预定目的地址更好路径的路由器。其工作方式与 ICMPv4 相同，后者会重定向当前 IPv4 网络中的流量。


## IPv6 状态自动配置


正如这个教学模组前面指出的那样，有状态自动配置允许网络主机从某个网络服务器（如 DHCP），接收他们的分址信息。这种自动配置方式，同时受 IPv4 与 IPv6 支持。在 IPv6 网络中，DHCPv6 被用于为 IPv6 主机提供有状态（及无状态）的自动配置服务。在 IPv6 的实现下，当某个 IPV6 主机从本地网段上的路由器收到 RA 信息时，该主机会检查这些数据包，确定 DHCPv6 是否可被使用。RA 报文通过设置 M（已托管）或 O（其他）位为 `1`，提供这一信息。

在 DHCP 下，客户端被配置为从 DHCP 服务器获取信息。在 DHCPv6 下，客户端不知道信息来自何处，其可能来自 SLAAC（即将介绍）、有状态 DHCPv6，或两者的组合。

路由器广告信息中的 Mbit 是 "托管地址配置标志位"（Managed Address Configuration Flag bit）。当该位被设置（即值为 1）时，它指示 IPv6 主机获取由 DHCPv6 服务器提供的有状态地址。路由器广告信息中的 O 位是其他有状态配置标志位。当该位被设置（即值为 1）时，它指示 IPv6 主机使用 DHCPv6 获取更多配置设置，如 DNS 和 WINS 服务器等。如果主机尚未配置 IPv6 地址，它可以使用三种方法之一来获取 IPv6 地址以及 DNS 服务器地址等其他网络设置：SLAAC-Stateless Autoconfiguration M 和 O 位设置为 0 意味着没有 DHCPv6 信息。主机从 RA 接收所有必要信息。Stateful DHCPv6-M 标志设置为 1 表示主机使用 DHCPv6 获取所有地址和网络信息。无状态 DHCPv6-M 标志设置为 0，O 标志设置为 1，表示主机将使用 SLAAC 获取地址（从 RA 获取），但也会从 DNS 服务器获取其他信息。虽然 IPv6 的优势之一是无状态自动配置功能，但有状态自动配置仍具有以下优势：



尽管 SLAAC 能力是 IPv6 的一项优势，有状态自动配置仍然有着许多好处，包括以下这些。

- 相较 SLAAC 所提供的那些项目，有状态自动配置有着更大的控制权
- 在 SLAAC 网络上，同样可以使用有状态自动配置
- 在缺少路由器的情形下，仍然可以为网络主机提供分址
- 通过分配新的前缀给主机，而用来对网络重新编号
- 可用于将全部子网发布给用户侧设备（can be used to issue entire subnets to customer premise equipment，稍后会有说明）

### IPv6无状态自动配置

**IPv6 Stateless Address Autoconfiguration, SLAAC**

IPv6容许设备为自己配置一个 IP 地址，以便进行主机到主机的通信。有状态自动配置需要一台服务器来分配地址信息，对于 IPv6 来说，就要用到 DHCPv6 。有状态就是说，信息交换的细节在服务器（或路由器）上是有保存的，那么无状态就说的是没有服务器来保存这些细节了。 DHCPv6 既可以是有状态的，也可以是无状态的。

在 IPv6 中， SLAAC 允许主机依据本地网络网段上的路由器发出的前缀通告，自己配置其单播 IPv6 地址。所需的其它信息（比如 DNS 服务器地址等）则可从 DHCPv6 服务器获取。 IPv6 中 SLAAC 用到的三种机制，如下所示。

- 前缀通告，prefix advertisement
- 重复地址检测，DAD
- 前缀重编号，prefix renumbering

**前缀通告**

**prefix advertisement**

IPv6地址前缀通告用到了ICMPv6 RA报文，而ICMPv6 RA是发往链路上的所有主机（all-hosts-on-the-local-link）的，带有多播地址`FF02::1`的 ICMPv6 数据包。根据 IPv6 的设计，仅有路由器才被允许在本地链路上通告前缀。在采行 SLAAC 后，就务必要记住，所用到的前缀长度，必须是 64 位（比如`2001:1a2b::/64`）。

在前缀配置之后， SLAAC 用到的 RA 报文还包含了以下信息。

- IPv6前缀，the IPv6 prefix
- 生命期，the lifetime
- 默认路由器信息，default router information
- 标志和/或选项字段，Flags and/or Options fields

就像刚才指出的那样，**IPv6前缀必须是 64 位**。此外，**本地网段上还可以通告多个的 IPv6 前缀**。在该网络网段上的主机收到 IPv6 前缀后，就将它们的 MAC 地址以`EUI-64`格式，追加到前缀后面，从而自动地配置上他们的 IPv6 单播地址，这在本模块的先前部分已有说明。这样就为该网段上的每台主机，都提供了一个唯一的`128`位 IPv6 地址。

SLAAC RA报文也提供了每个通告前缀的生命期数值给这些节点，生命期字段可以是从`0`到无穷的值。节点在收到前缀后，就对该前缀的生命期值进行验证，从而在生命期数值到`0`时停用该前缀。此外，如收到生命期值为无穷的某个特定前缀，网络主机就绝不会停用那个前缀。每个通告前缀又带有两个生命期值：**有效生命期值**及**首选生命期值**（the valid and preferred lifetime value）。

有效生命期值用于确定出该主机地址将保持多长时间的有效期。在该值超时后（也就是说到值为`0`时），带有该前缀的主机地址就成为无效地址。而首选生命期值则用于确定经由 SLAAC 方式配置的某个地址将保持多长时间的有效期。此值必须小于或等于在有效生命期值，同时该值通常用于前缀的重编号。

SLAAC RA的默认路由器，提供了其本身 IPv6 地址的存在情况和生命期。默认情况下，用于默认路由器的那个地址是本地链路地址（`FE80::/10`）。这样做就可以在全球单播地址发生改变时，也不会像在 IPv4 中那样，在某个网络被重新编号时，导致网络服务中断。

最后，一些标志和选项字段可被用作指示网络主机采行 SLAAC 或有状态自动配置。这些字段在图7.13中的 RA 线路捕获中有包含。

**重复地址检测**

**Duplicated Address Detection, DAD**

重复地址检测（ DAD ）是一种用在 SLAAC 中，在某网段上主机启动时，用到的 NDP 机制。 DAD 要求某台网络主机启动期间，在永久地配置它自己的 IPv6 地址之前，先要确保没有别的网络主机已经使用了它打算使用的那个地址。

DAD通过使用邻居询问（`135`类型的 ICMPv6 ）及节点询问多播地址（Solicited-Node Multicast addresses），来完成这个验证。主机使用一个未指明 IPv6 地址（an unspecified IPv6 address, 也就是地址`::`）作为报文数据包的源地址，并将其打算使用的那个 IPv6 单播地址，作为目的地址，在本地网段上发送一个邻居询问 ICMPv6 报文数据包。如有其它主机使用着该地址，那么主机就不会自动将此地址配置为自己的地址；而如没有其他设备使用这个地址，则该主机就自动配置并开始使用这个 IPv6 地址了。

**前缀重编号**

**prefix renumbering**

最后，前缀重编号（prefix renumbering）机制允许 IPv6 网络从一个前缀变为另一个时，进行前缀透明重编号。与 IPv4 中同样的全球 IP 地址可由多个服务提供商进行通告不同， IPv6 地址空间的严格聚合阻止了服务提供商对不属于其组织的前缀进行通告（Unlike in IPv4, where the same global IP address can be advertised by multiple providers, the strict aggregation of the IPv6 address space prevents providers from advertising prefixes that do not belong to their organization）。

在网络发生从一家 IPv6 服务提供商迁移至另一家时， IPv6 前缀重编号机制，就提供了一种自一个前缀往另一前缀平滑和透明的过渡。前缀重编号使用与在前缀通告中同样的 ICMPv6 报文和多播地址。而前缀重编号可经由运用 RA 报文中包含的时间参数完成。

在思科 IOS 软件中，路由器可配置为通告带有被减少到接近 0 的有效和首选生命期当前前缀，这就令到这些前缀能够更快地成为无效前缀。此时再将这些路由器配置为在本地网段上通告新前缀。这样做将允许旧前缀和新前缀在同一网段上并存。

迁移期间，本地网段上的主机用着两个单播地址：一个来自旧的前缀，一个来自新的前缀。那些使用旧前缀的当前连接仍被处理着；但所有自主机发出的新连接，则都使用新前缀。在旧前缀超时后，就只使用新前缀了。

### 配置无状态DHCPv6

**Configuring Stateless DHCPv6**

为在某台路由器上配置无状态的DHCPv6, 需要完成一些简单的步骤。

- 创建地址池名称和其它参数, create the pool name and other parameters
- 在某个借口上开启它, enable it on an interface
- 修改 RA 设置，modify Router Advertisement settings

一个身份关联是分配给客户端的一些地址（an Identity Association is a collection of addresses assigned to the client）。使用到 DHCPv6 的每个借口都必须要有至少一个的身份关联（ IA ）。这里不会有 CCNA 考试的配置示例。

### 在思科 IOS 软件中开启 IPv6 路由

现在，你对 IPv6 基础知识有了扎实掌握，本模块剩下的部分将会专注于思科 IOS 软件中 IPv6 的配置了。默认下，思科 IOS 软件中的 IPv6 路由功能是关闭的。那么就必须通过使用__`ipv6 unicast-routing`这个全局配置命令__来开启 IPv6 路由功能。

在全局开启 IPv6 路由之后，接口配置命令`ipv6 address [ipv6-address/prefix-length | prefix-name sub-bits/prefix-length | anycast | autoconfig <default> | dhcp | eui-64 | link-local]`就可以用于配置接口的 IPv6 分址了。关键字`[ipv6-address/prefix-length]`用于指定分配给该接口的 IPv6 前缀和前缀长度。下面的配置演示了如何为一个路由器接口配置子网`3FFF:1234:ABCD:5678::/64`上的第一个地址。

```console
R1(config)#ipv6 unicast-routing
R1(config)#interface FastEthernet0/0
R1(config-if)#ipv6 address 3FFF:1234:ABCD:5678::/64
R1(config-if)#exit
```

按照此配置，`show ipv6 interface [name]`命令就可用于验证配置的 IPv6 地址子网（即`3FFF:1234:ABCD:5678::/64`）, 如下面的输出所示。

```console
R1#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80::20C:CEFF:FEA7:F3A0
	Global unicast address(es):
		3FFF:1234:ABCD:5678::1, subnet is 3FFF:1234:ABCD:5678::/64
	Joined group address(es):
		FF02::1
		FF02::2
		FF02::1:FF00:1
		FF02::1:FFA7:F3A0
...
[Truncated Output]
```

就如在本模块早先指出的那样， IPv6 允许在同一接口上配置多个前缀。而如过在同一借口上配置了多个前缀，`show ipv6 interface [name] prefix`命令，就可以用来查看所有分配的前缀，以及它们各自的有效和首选生命期数值。下面的输出显示了在一个配置了多个 IPv6 前缀的路由器接口上，该命令所打印出的信息。

```console
R1#show ipv6 interface FastEthernet0/0 prefix
IPv6 Prefix Advertisements FastEthernet0/0
Codes:	A - Address, P - Prefix-Advertisement, O - Pool
		U - Per-user prefix, D - Default
		N - Not advertised, C - Calendar
	default [LA] Valid lifetime 2592000, preferred lifetime 604800
AD	3FFF:1234:ABCD:3456::/64 [LA] Valid lifetime 2592000, preferred lifetime 604800
AD	3FFF:1234:ABCD:5678::/64 [LA] Valid lifetime 2592000, preferred lifetime 604800
AD	3FFF:1234:ABCD:7890::/64 [LA] Valid lifetime 2592000, preferred lifetime 604800
AD	3FFF:1234:ABCD:9012::/64 [LA] Valid lifetime 2592000, preferred lifetime 604800
```

**注意：** 和早前指出的一样，有效和首选生命期数值可自默认值进行修改，以实现在应用前缀重编号时的平滑过渡。但此配置是超出 CCNA 范围的，所以本教程不会对其进行演示。

跟着接口配置命令`ipv6 prefix`的使用之后，关键字`[prefix-name sub-bits/prefix-length]`用于配置一个通用前缀（a general prefix），通用前缀指定要配置到该接口上的子网的那些前导位。这个配置也是超出当前 CCNA 考试要求的，本模块不会对其进行演示。

关键字`[anycast]`用于配置一个 IPv6 任意播地址。和先前指出的那样，任意播分址允许将同一个**公共地址**（the same common address）分配到多个路由器接口。主机使用从路由协议度量值上看离它们最近的任意播地址。任意播配置超出 CCNA 考试要求范围，不会在本模块进行演示。

`[autoconfig <default>]`关键字开启 SLAAC 。如用到该关键字，路由器将动态学习链路上的前缀，之后将`EUI-64`地址加到所有学习到的前缀上。`[default]`关键字是一个允许安装一条默认路由的可选关键字（the `<default>` keyword is an optional keyword that allows a default route to be installed）。下面的配置样例，演示了如何在某个路由器接口上开启无状态自动配置，同时额外地允许安装上默认路由。

```console
R2(config)#ipv6 unicast-routing
R2(config)#interface FastEthernet0/0
R2(config-if)#ipv6 address autoconfig default
R2(config-if)#exit
```

按照这个配置，路由器`R2`将会监听`FastEthernet0/0`接口所在本地网段上的 RA 报文。该路由器将会对每个学习到的前缀，动态地配置一个`EUI-64`地址，并接着安装上指向该 RA 通告路由器本地链路地址的默认路由。使用`show ipv6 interface [name]`命令，即可对动态地址配置进行验证，如下面的输出所示。

```console
R2#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80::213:19FF:FE86:A20
	Global unicast address(es):
		3FFF:1234:ABCD:3456:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:3456::/64 [PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:5678:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:5678::/64 [PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:7890:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:7890::/64 [PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:9012:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:9012::/64 [PRE]
			valid lifetime 2591967 preferred lifetime 604767
		FEC0:1111:1111:E000:213:19FF:FE86:A20, subnet is FEC0:1111:1111:E000::/64 [PRE]
			valid lifetime 2591967 preferred lifetime 604767
	  Joined group address(es):
		FF02::1
		FF02::2
		FF02::1:FF86:A20
	  MTU is 1500 bytes
...
[Truncated Output]
```

在上面的输出中，注意到尽管接口上没有配置显式的 IPv6 地址，还是动态地为经由侦听 RA 报文所发现的子网，配置了一个`EUI-64`地址。每个这些前缀的计时器，都继承自通告 RA 报文的那台路由器。为了进一步验证无状态自动配置，可以使用`show ipv6 route`命令，来验证到首选通告路由器本地链路地址的默认路由，如下面所演示的那样。

```console
R2#show ipv6 route ::/0
IPv6 Routing Table - 13 entries
Codes:	C - Connected, L - Local, S - Static, R - RIP, B - BGP
		U - Per-user Static route
		I1 - ISIS L1, I2 - ISIS L2, IA - ISIS inter area, IS - ISIS summary
		O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
		ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
S	::/0 [1/0]
	via FE80::20C:CEFF:FEA7:F3A0, FastEthernet0/0
```

在命令`ipv6 address`之后，关键字`[dhcp]`用于配置该路由器接口使用有状态自动配置（也就是 DHPCv6 ），来请求该接口的分址配置。在此配置下，有着一个额外的关键字，`[rapid-commit]`, 同样可以追加到此命令之后，以开启地址分配及其它配置信息的二报文交换快速方式（the two-message exchange method）。

再回到讨论主题，在`ipv6 address`命令下，关键字`[eui-64]`用于为某个接口配置一个 IPv6 地址，并在地址的低`64`位使用一个`EUI-64`地址而在该接口上开启 IPv6 处理。默认情况下，**本地链路、站点本地以及IPv6 SLAAC**都用到`EUI-64`格式来构造其各自的 IPv6 地址。`EUI-64`分址**将`48`位 MAC 地址扩展到一个`64`位地址**。通过两步实现该扩展，这两步将在下一段进行说明。**该过程就叫作SLAAC**。

构造`EUI-64`地址的**第一步，将值`FFFE`插入到 MAC 地址中间**，就将`12`个十六进制字符的`48`位 MAC 地址扩展到`16`个十六进制字符的`64`位了。下图7.18演示了`48`位 MAC 地址到`64`位 EUI 地址的转换。

![创建`EUI-64`地址](../images/0718.png)

*图7.18 -- 创建`EUI-64`地址*

`EUI-64`分址的下一步，涉及`64`位的第`7`位设置。**此第`7`位用于区分该 MAC 地址是否是唯一的**。如该位设置为`1`, 就表明该 MAC 地址是一个全球受管理 MAC 地址（a globally managed MAC address）-- 也就是说该 MAC 地址是有某厂商分配的。如该位设置为`0`, 就表明该 MAC 地址是本地分配的--就意味着该 MAC 地址有可能是由管理员添加的。为更进一步搞清楚此声明， MAC 地址实例`02:1F:3C:59:D6:3B`就被认为是一个全球分配的 MAC 地址（a globally-assigned MAC address）, 而 MAC 地址`00:1F:3C:59:D6:3B`则被看作是一个本地地址。下图7.19有演示。

![确定本地及全球 MAC 地址](../images/0719.png)

*图7.19 -- 确定本地及全球 MAC 地址*

按照这样的配置，命令`show ipv6 interface`就可用于验证验证分配到接口`FastEthernet0/0`上的 IPv6 接口 ID ， 如下面的输出所示。

```console
R2#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80::213:19FF:FE86:A20
	Global unicast address(es):
	  	3FFF:1A2B:3C4D:5E6F:213:19FF:FE86:A20, subnet is 3FFF:1A2B:3C4D:5E6F::/64 [EUI]
	Joined group address(es):
		FF02::1
		FF02::2
	FF02::1:FF86:A20
	MTU is 1500 bytes
...
[Truncated Output]
```

要验证该`EUI-64`地址的构造过程，同样可以通过使用`show interface`命令，查看指定接口的 MAC 地址的方式，来检查该完整的 IPv6 地址。

```console
R2#show interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	Hardware is AmdFE, address is 0013.1986.0a20 (bia 0013.1986.0a20)
		Internet address is 10.0.1.1/30
```

从上面的输出可以看出，该`EUI-64`地址实际上是有效的，且是基于该接口的 MAC 地址。此外，该地址是全球地址，因为那个第七位是开启的（也就是改为包含的是一个非零值）。

最后的`[link-local]`关键字用于分配给接口一个本地链路地址。一定要记住在默认情况下，对于动态地创建出一个本地链路地址来说，接口上并不是非得要启用一个 IPv6 前缀。而是当在某个接口下执行了接口配置命令`ipv6 enable`时，就会以`EUI-64`分址方式，自动创建出那个接口的一个本地链路地址。

而如果要手动配置一个本地链路地址，就必须分配一个本地链路地址块`FE80::/10`中的地址。下面的配置实例，演示了如何在某接口上配置一个本地链路地址。

```console
R3(config)#interface FastEthernet0/0
R3(config-if)#ipv6 address fe80:1234:abcd:1::3 link-local
R3(config-if)#exit
```

按照该配置，就可用`show ipv6 interface [name]`命令验证这个手动配置的本地链路地址，如下面的输出所示。

```console
R3#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80:1234:ABCD:1::3
	Global unicast address(es):
		2001::1, subnet is 2001::/64
	Joined group address(es):
		FF02::1
		FF02::2
		FF02::1:FF00:1
		FF02::1:FF00:1111
	MTU is 1500 bytes
...
[Truncated Output]
```

**注意：** 在进行手动配置本地链路地址时，如思科 IOS 软件侦测到另一主机正在使用一个它的 IPv6 地址，控制台上就会打印出一条错误报文，同时该命令将被拒绝。所以在手动配置本地链路地址时，要小心仔细。

### IPv6子网划分

**Subnetting with IPv6**

如你已经学到的， IPv6 地址分配给机构的是一个前缀。而 IPv6 地址的主机部分总是`64`位的`EUI-64`, 同时**标准的**前缀通常又是`48`位或`/48`。那么剩下的`16`位，就可由网络管理员自主用于子网划分了。

在考虑网络分址时，因为同样的规则对 IPv4 和 IPv6 都是适用的，那就是**每个网段只能有一个网络**。不能分离地址而将一部分主机位用在这个网络，另一部分主机位用在其它网络。

如你看着下面图表中的分址，就能更清楚这个情况。

| 全球路由前缀 | 子网ID | 接口ID |
| `48`位或`/48` | `16`位（`65535`个可能的子网） | `64`位 |

绝不用担心会用完每个子网的主机位，因为每个子网有超过`2`的`64`次幂的主机。任何组织要用完这些子网都是不大可能的，而就算发生了这种情况，也可以轻易地从 ISP 那里要一个前缀。

比如我们说分得了全球路由前缀（the global routing prefix）`0:123:abc/48`。该地址占用了一个完整 IPv6 地址的三个区段，而每个区段或 4 位 16 进制字符（ quartet ）则是`16`位，那么到目前为止就用了`48`位。主机部分则需要`64`位，留下`16`位用于子网的分配。

可以简单的从零（子网零也是合法的）开始以十六进制数下去。对于主机来说，也可以这样做，除非比如说想要将头几个地址留给网段上的服务器。

用一个更简单的前缀来打比方吧 -- `2001:123:abc/48`。第一个子网就是全零，当然，每个子网上的第一台主机也可以是全零，这也是合法的（只要不保留 IPv6 中的全`0s`和全`1s`地址）。又会将全零主机表示为缩写形式的`::`。那么这里就有开头的几个子网及主机地址。

| 全球前缀 | 子网 | 第一个地址 |
| -- | -- | -- |
| `2001:123:abc` | `0000` | `::` |
| `2001:123:abc` | `0001` | `::` |
| `2001:123:abc` | `0002` | `::` |
| `2001:123:abc` | `0003` | `::` |
| `2001:123:abc` | `0004` | `::` |
| `2001:123:abc` | `0005` | `::` |
| `2001:123:abc` | `0006` | `::` |
| `2001:123:abc` | `0007` | `::` |
| `2001:123:abc` | `0008` | `::` |
| `2001:123:abc` | `0009` | `::` |
| `2001:123:abc` | `000A` | `::` |
| `2001:123:abc` | `000B` | `::` |
| `2001:123:abc` | `000C` | `::` |
| `2001:123:abc` | `000D` | `::` |
| `2001:123:abc` | `000E` | `::` |
| `2001:123:abc` | `000F` | `::` |
| `2001:123:abc` | `0010` | `::` |
| `2001:123:abc` | `0011` | `::` |
| `2001:123:abc` | `0012` | `::` |
| `2001:123:abc` | `0013` | `::` |
| `2001:123:abc` | `0014` | `::` |
| `2001:123:abc` | `0015` | `::` |
| `2001:123:abc` | `0016` | `::` |
| `2001:123:abc` | `0017` | `::` |

我肯定你已经注意到这与 IPv4 分址规则有所不同，不同之处就在与**可以使用全零子网，同时子网的第一个地址总是全零**。请看看下面这个简单的网络拓扑，可以照这种方式进行子网分配。

![IPv6子网分配](../images/0720.png)

*图7.20 -- IPv6子网分配*

就是那么容易吗？如回忆一下 IPv4 子网划分章节，要完成子网划分，以及算出有多少主机多少子网并记住要排除一些地址，简直就是一场噩梦。**IPv6子网划分就容易得多**。你分配到的不一定是一个`48`位前缀，可能是一个用于家庭网络的`/56`或更小的前缀，但原则是一样的。也可以自位界限以外进行子网划分，但这是很少见的，且如果思科要你用考试中的很段时间完成那么深的细节，也是不公平的（You can also subnet off the bit boundary, but this would be most unusual and unfair of Cisco to expect you to go into that amount of detail in the short amount of time you have in the exam）。还好的是，考试不是要你考不过，但谁又知道呢（Hopefully, the exam won't be a mean attempt to catch you out, but you never know）。为以防万一，这里给出一个有着`/56`前缀长度的地址示例。

`2001:123:abc:8bbc:1221:cc32:8bcc:4231/56`

该前缀是`56`位，转换一下就是`14`个十六进制数位（`14x4=56`）, 那么就知道了该前缀将带到一个`4`位字节（ quartet ）的中间。**这里有个坑**。在前缀终止前，必须要将该`4`位字节的第`3`和`4`位置为零。

`2001:123:abc:8b00:0000:0000:0000:0000/56`

上面对位界限分离的地方进行了加粗（I've made the quartet bold where the bit boundary is broken）。在匆忙中及考试中时间上的压力下，可能会完全忘记这重要的一步。请记住也要将下面这个地址（第一个子网上的第一台主机）写作这样。

`2001:123:abc:8b00::/56`

如他们硬要在考试中把你赶出去，就可能会试着让你把那两个零从位界限分离处之前的`4`位字节中去掉（If they do try to catch you out in the exam, it would probably be an attempt to have you remove the trailing zeros from the quartet before the bit boundary is broken）。

`2001:123:abc:8b::/56`

那么上面这个缩写就是非法的了。

也可以从主机部分借用位来用于子网划分，但绝没有理由这么做，同时这么做也会破坏采行发明 IPv6 而带来的可资利用的那些众多特性的能力，包括 SLAAC （You can steal bits from the host portion to use for subnets, but there should never be a reason to and it would break the ability to use many of the features IPv6 was invented to utilise, including stateless autoconfiguration）。

## IPv6和 IPv4 的比较

**IPv6 Compared to IPv4**

一名网络工程师应有一幅 IPv6 比起 IPv4 所带来众多优势的图景。看着 IPv6 的增强，可以总结出下面这些优势。

- IPv6有着一个扩展的地址空间，从`32`位扩展到了`128`位, IPv6 has an expanded address space, from 32 bits to 128bits
- IPv6使用十六进制表示法，而不是 IPv4 中的点分十进制表示法, IPv6 uses hexadecimal notation instead of dotted-decimal notation(as in IPv4)
- 因为采用了扩充的地址空间， IPv6 地址是全球唯一地址，从而消除了 NAT 的使用需求, IPv6 addresses are globally unique due to the extended address space, eliminating the need for NAT
- IPv6有着一个固定的头部长度（`40`字节），允许厂商在交换效率上进行提升, IPv6 has a fixed header length(40 bytes), allowing vendors to improve switching efficiency
- IPv6通过在 IPv6 头部和传输层之间放入扩展头部，而实现对一些增强选项（这可以提供新特性）的支持, IPv6 supports enhanced options(that offer new features)by placing extension headers between the IPv6 header and the Transport Layer header
- IPv6具备地址自动配置的能力，提供无需 DHCP 服务器的 IP 地址动态分配, IPv6 offers address autoconfiguration, providing for dynamic assignment of IP addresses even without a DHCP server
- IPv6具备对流量打标签的支持, IPv6 offers support for labeling traffic flows
- IPv6有着内建的安全功能，包括经由`IPSec`实现的认证和隐私保护功能等, IPv6 has security capabilities built in, including authentication and privacy via IPSec
- IPv6具备在往目的主机发送数据包之前的路径 MTU 发现功能，从而消除碎片的需求, IPv6 offers MTU path discovery before sending packets to a destination, eliminating the need for fragmentation
- IPv6支持站点多处分布，IPv6 supports site multi-homing
- IPv6使用 ND （邻居发现，Neighbor Discovery）协议取代 ARP ，IPv6 uses the ND protocol instead of ARP
- IPv6使用AAAA DNS记录，取代 IPv4 中的 A 记录, IPv6 uses AAAA DNS records instead of A records (as in IPv4)
- IPv6使用站点本地分址，取代 IPv4 中的`RFC 1918`， IPv6 uses Site-Local addressing instead of RFC 1918(as in IPv4)
- IPv4和 IPv6 使用不同的路由协议, IPv4 and IPv6 use different routing protocols
- IPv6提供了任意播分址, IPv6 provides for Anycast addressing

## 第七天的问题

1. IPv6 addresses must always be used with a subnet mask. True or false?
2. Name the three types of IPv6 addresses.
3. Which command enables IPv6 on your router?
4. The `0002` portion of an IPv6 address can be shortened to just 2. True or false?
5. How large is the IPv6 address space?
6. With IPv6, every host in the world can have a unique address. True or false?
7. IPv6 does not have natively integrated security features. True or false?
8. IPv6 implementations allow hosts to have multiple addresses assigned. True or false?
9. How can the broadcast functionality be simulated in an IPv6 environment?
10. How many times can the double colon (`::`) notation appear in an IPv6 address?

## 第七天问题答案

1. False.
2. Unicast, Multicast, and Anycast.
3. The `ipv6 unicast-routing`
4. True.
5. 128 bits.
6. True.
7. False.
8. True.
9. By using Anycast.
10. One time.

## 第七天实验

### IPv6概念实验

**IPv6 概念实验**

在一对直接连接的思科路由器上，对在本模块中提到的 IPv6 概念和命令，进行测试。

- 在两台路由器上都开启 IPv6 全球单播路由
+ 在每个连接的接口上手动配置一个 IPv6 地址，比如下面这样。
	- 在路由器 R1 的连接接口上配置`2001:100::1/64`
	- 在路由器 R2 的连接接口上配置`2001:100::2/64`
- 使用命令`show ipv6 interface`和`show ipv6 interface prefix`对配置进行验证
- 测试直接`ping`的连通性
- 使用 IPv6 无状态自动配置（`ipv6 address autoconfig default`）进行重新测试
- 使用`EUI-64`地址（ IPv6 地址`2001::/64` `EUI-64`）进行重新测试
- 硬编码一个借口本地链路地址: `ipv6 address fe80:1234:adcd:1::3 link-local`
- 查看 IPv6 路由表

### 十六进制转换及子网划分练习

**Hex Conversion and Subnetting Practice**

请把今天剩下的时间用于练习这些重要的题目上。

- 将十进制转换成十六进制（随机数字）
- 将十六进制转换成十进制（随机数字）
- IPv6子网划分（随机网络和场景）


（End）



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

<a name="f-3.13"></a>
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


## IPv6 有状态自动配置


正如这个教学模组前面指出的那样，有状态自动配置允许网络主机从某个网络服务器（如 DHCP），接收他们的分址信息。这种自动配置方式，同时受 IPv4 与 IPv6 支持。在 IPv6 网络中，DHCPv6 被用于为 IPv6 主机提供有状态（及无状态）的自动配置服务。在 IPv6 的实现下，当某个 IPV6 主机从本地网段上的路由器收到 RA 信息时，该主机会检查这些数据包，确定 DHCPv6 是否可被使用。RA 报文通过设置 M（已托管）或 O（其他）位为 `1`，提供这一信息。

在 DHCP 下，客户端被配置为从 DHCP 服务器获取信息。在 DHCPv6 下，客户端不知道信息来自何处，其可能来自 SLAAC（即将介绍）、有状态 DHCPv6，或两者的组合。

路由器通告报文中的 M 位，是 “托管的地址配置开关位”。当这个位被设置（即其包含 `1` 的值）时，那么他会指示 IPv6 主机，获取一个由 DHCPv6 服务器提供的有状态地址。路由器通告报文中的 O 位，是 “其他有状态配置开关位”。当这个位被设置（即其包含 `1` 的值）时，那么他会指示 IPv6 主机，使用 DHCPv6 获取更多配置设置，比如 DNS 与 WINS 服务器等。

当某个主机尚未配置某个 IPv6 地址时，他可使用三种方法之一，获取一个 IPv6 地址，以及诸如 DNS 服务器地址等其他网络设置：

- SLAAC -- 无状态的自动配置的 M 和 O 位均设置为 `0`，意味着没有 DHCPv6 信息。该主机会从 RA 接收所有必要信息；
- 有状态的 DHCPv6 -- M 开关设置为 `1`，告诉主机，使用 DHCPv6 获取所有地址及网络信息；
- 无状态的 DHCPv6 -- M 开头设置为 `0`，O 开关设置为 `1`，意味着主机将使用 SLAAC 获取地址（从 RA 获取），但也会从 DNS 服务器获取其他信息。

> *知识点*：
>
> - the Managed Address Configuration Flag bit
>
> - the Other Stateful Configuration bit


虽然 IPv6 的优势之一是无状态的自动配置能力，但有状态的自动配置，仍提供了如下诸多优势：


- 相比无状态自动配置所提供的，具有更大控制
- 可用于无状态自动配置可用的网络上
- 在路由器缺失情况下，给网络主机提供分址
- 通过将新的前缀分配给主机，而可用于网络重编号
- 可用于将整个的子网，发布给用户侧设备

> *知识点*：
>
> - customer premise equipment, CPE

## IPv6 无状态自动配置

IPv6 允许接口自行配置 IP 地址，以便进行主机间通信。有状态自动配置涉及到某台分配地址信息的服务器，并且对于 IPv6，DHCPv6 被用到。所谓有状态，某次信息交换的详情，会由服务器（或路由器）存储下来，而无状态则指的是他们未被存储。DHCPv6 既可以是有状态的，也可以是无状态的。

在 IPv6 下，无状态的自动配置，允许主机根据来自本地网段上路由器的前缀通告，自行配置其单播 IPv6 地址。其他网络信息则可获取自 DHCPv6 服务器（比如 DNS 服务器地址）。IPv6 下实现无状态自动配置的三种机制如下：


- 前缀通告
- 重复地址检测（DAD）
- 前缀重编号


> *知识点*：
>
> - ICMPv6 Router Advertisement message
>
> - the all-hosts-on-the-local-link IPv6 Multicast address, `FF02::1`

IPv6 的前缀通告，使用 ICMPv6 的路由器通告报文，其会被发送到本地链路上的所有主机的 IPv6 组播地址 `FF02::1`。根据设计，只有路由器被允许在本地链路上通告前缀。当无状态自动配置被采用时，迫切要记住，用到的前缀，必须是 64 位（如 `2001:1a2b::/64`）。

在前缀的配置之后，用于 IPv6 无状态自动配置的 RA 报文，包括了以下信息：

- IPv6 前缀
- 生命周期
- 默认路由器信息
- 开关和/或选项字段

正如前面所指出的，IPv6 前缀必须为 64 位。此外，多个 IPv6 前缀可能会在本地网段上通告。当网段上的主机收到 IPv6 前缀时，他们会将他们的 MAC 地址，以 EUI-64 格式追加到这个前缀，这已在这个教学模组模块早先介绍过，而自动配置好他们的 IPv6 单播地址。这便提供了一个唯一的 128 位 IPv6 地址，给网段上的每个主机。


每个通告前缀的生命周期值，也会提供给节点，同时可能包含一个范围从 0 到无限的值。当节点收到前缀时，他们会验证这个生命周期值，并在生命周期值到 0 时，停止使用该前缀。或者，当某个前缀的生命周期值为无限时，网络主机将永不停用该前缀。每个通告前缀又都包含两个生命周期值：有效的生命周期值，于首选的生命周期值。


有效生命周期值，被用于确定主机地址将保持有效多长时间。当这个值过期（即达到值 0）时，那么这个主机地址就会失效。首选生命周期值用于确定某个经由无状态自动配置所配置的地址，将保持有效多长时间。这个值必须小于或等于在有效生命周期中，所指定的值，并通常被用于前缀的重编号。

默认路由器提供了有关其 IPv6 地址的存在性与生命周期的信息。默认情况下，用于默认路由器的地址，是链路本地地址（`FE80::/10`）。这允许在不中断网络服务下，全局单播地址可被修改，就像 IPv4 下当某个网络被重编号时的情形。


最后，一些开关与选项字段可用于指示网络主机，使用无状态自动配置或有状态自动配置。这些字段包含在 [图 3.13](#f-3.13) 中所示的路由器通告线路捕获中。重复地址检测（Duplicate Address Detection）是一种 NDP 机制，用于网段上的主机启动时的无状态自动配置。

> *知识点*：
>
> - the Flags and Options fields

重复地址检测属于一种 NDP 机制，用于在网段上某个主机启动时的无状态自动配置。DAD 规定，网络主机在启动过程中，永久配置其自己的 IPv6 地址前，其检查另一网络主机未在使用他打算使用的 IPv6 地址。

通过使用邻居询问（ICMPv6 的类型 135）及节点询问组播地址，DAD 完成这种验证。主机会使用一个未指明 IPv6 地址（即 `::` 这个地址）作为其源地址，并使用其打算使用的 IPv6 单播地址的节点询问组播地址作为目标地址，在本地网段上发送邻居询问（报文）。当某个别的主机正使用这个相同地址时，该主机将不以这个地址自动配置自己；但当没有其他设备这个相同地址时，那么该主机就会自动配置自己，并开始使用这个 IPv6 地址。

> **译注**：原文这里有拼写错误。原文如下：
>
> Duplicate Address Detection performs this validation by using Neighbor Solicitation (ICMPv6 Type 135) and Solicited-Node Multicast addresses. The host sends a Neighbor Solicitation on the local network segment using an unspecified IPv6 address (i.e., the :: address) as its source address and the Solicited-Node Multicast address of the IPv6 Unicast address it wants to use as the destination address. <u>If no other host is using the same address, the host will not automatically configure itself with this address</u>; however, if no other device is using the same address, the host automatically configures itself and begins to use this IPv6 address.



最后，前缀重编号实现了在网络前缀从一个改变到另一个时的透明重编号。与其中同一个全局 IP 地址可被多个运营商通告的 IPv4 不同，IPv6 地址空间的严格聚合，防止了运营商通告不属于其组织的前缀。


在从一家 IPv6 互联网运营商，到另一家过渡的情形下，IPv6 前缀的重编号机制，提供了从一个前缀到另一前缀的平滑透明过渡。前缀重编号使用与前缀通告中同样的 ICMPv6 报文与组播地址。通过使用包含在路由器通告报文中的两种时间参数，前缀重编号得以可行。

在 Cisco IOS 软件中，路由器可被配置为通告带有降为接近零的值的有效期及首选生命周期值的当前前缀，这会使这些前缀更快失效。然后这些路由器就会被配置为在本地网段上通告新的前缀。这样做实现了新旧前缀在同一网段上并存。


在过渡期间，本地网段上的主机，会使用两个单播地址：一个来自旧前缀，一个来自新前缀。使用旧前缀的任何当前连接仍会被处理；但是，这些主机上的任何新连接，都会使用新前缀的构造。在旧前缀过期时，就只有新前缀会被用到了。

## 配置无状态 DHCPv6

要在某个路由器上配置无状态的 DHCPv6，有几个简单步骤：

1. 创建池名称及其他参数；
2. 在某个接口上启用 DHCPv6；
3. 修改路由器通告设置。

所谓身份关联，是分配给客户端的一个地址集合。对于使用 DHCPv6 的每个接口，都必须至少分配一个身份关联。我们将不深入 CCNA 考试的介绍配置示例。

## 启用 Cisco 10S 软件中的IPv6 路由

现在，咱们已对 IPv6 基本知识有了扎实掌握，这个教学模组的其余部分，将着重于在 Cisco IOS 软件中，IPv6 的配置。默认情况下，IPv6 路由功能在思科 IOS 软件中是关闭的。因此，IPv6 路由功能必须以 `ipv6 unicast-routing` 这个全局配置命令手动启用。


在全局启用 IPv6 路由后，`ipv6 address [ipv6-address/prefix-length | prefix-name sub-bits/prefix-length | anycast | autoconfig <default> | dhcp | eui-64 | link-local]` 这个接口配置命令，便可用来配置接口的 IPv6 分址。`[ipv6-address/prefix-length]` 这个关键字，用于指定分配给接口的 IPv6 前缀与前缀长度。下面的配置演示了如何以 `3FFF:1234:ABCD:5678::/64` 这个子网的首个地址，配置某个路由器接口。


```console
R1(config)#ipv6 unicast-routing
R1(config)#interface FastEthernet0/0
R1(config-if)#ipv6 address 3FFF:1234:ABCD:5678::1/64
R1(config-if)#exit
```


这一配置之后，`show ipv6 interface [name]` 命令便可用于验证这个已配置的 IPv6 地址子网，如下所示：


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

正如这个教学模组早先所指出的，IPv6 允许多个前缀配置在同一接口上。当多个前缀已配置在同一接口上时，那么 `show ipv6 interface [name] prefix` 命令便可被用于查看所有已分配的前缀，以及他们的有效与首选生命周期值。下面的输出显示了由这条命令，对某一配置了多个 IPv6 子网路由器接口，所打印的信息：

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


**注意**：有效与首选生命周期值可被调整默认值，实现前缀重编号时的平滑过渡。不过，这种配置超出了 CCNA 考试要求的范围，而将不在这节中说明。

继续 `ipv6 prefix` 这条接口配置命令的使用，`[prefix-name sub-bits/prefix-length]` 这个关键字，被用于配置指明要在接口上配置的子网前导位的一个通用前缀。这项配置超出了当前 CCNA 考试要求的范围，而将不在这个教学模组中说明。

> *知识点*：
>
> - the leading bits of the subnet

`[anycast]` 这个关键字，被用于配置某个 IPv6 Anycast 地址。正如早先所指出的，Anycast 分址只是允许将同一个共用地址，分配给多个路由器接口。主机会使用根据路由协议度量值，离其最近的那个 Anycast 地址。Anycast 的配置超出了 CCNA 考试要求的范围，而将不在这个教学模组中说明。

`[autoconfig <default>]` 这个关键字，会启用无状态自动配置 (SLAAC)。当这个关键字被使用后，路由器将动态学习链路上的前缀，然后对所有学到的前缀，添加 EUI-64 地址。其中的 `<default>` 关键字，属于一个允许默认路由得以安装的可选关键字。以下配置示例，演示了如何启用某个路由接口上的无状态自动配置，以及如何允许默认路由得以安装。

```console
R2(config)#ipv6 unicast-routing
R2(config)#interface FastEthernet0/0
R2(config-if)#ipv6 address autoconfig default
R2(config-if)#exit
```

在这一配置下，路由器 R2 将监听 `FastEthernet0/0` 接口所在的本地网段上的路由器通告报文。该路由器将对每个学习到的前缀，动态配置一个 EUI-64 地址，然后安装指向通告路由器链路本地地址的默认路由。使用 `show ipv6 interface [name]` 命令，这种动态的地址配置得以验证，如下所示。


```console
R2#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80::213:19FF:FE86:A20
	Global unicast address(es):
		3FFF:1234:ABCD:3456:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:3456::/64
[PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:5678:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:5678::/64
[PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:7890:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:7890::/64
[PRE]
			valid lifetime 2591967 preferred lifetime 604767
		3FFF:1234:ABCD:9012:213:19FF:FE86:A20, subnet is 3FFF:1234:ABCD:9012::/64
[PRE]
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


在上面的输出中，请留意虽然没有显式的 IPv6 地址配置于接口上，但一个 EUI-64 的地址，已被动态地针对该路由器经由监听路由器通告报文，发现的子网配置了。每个这些前缀的定时器，都派生自通告这些 RA 报文的路由器。除了验证无状态的自动配置外，`show ipv6 route` 这条命令还可用于验证到首选通告路由器链路本地地址的默认路由，如下所示。


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

继续 `ipv6 address` 这条命令，其中 `[dhcp]` 关键字被用将路由器接口，配置为使用有状态的自动配置（即 DHCPv6）获取接口的地址配置。在这种配置下，一个额外关键字 `[rapid-commit]` 还可追加到这条命令末尾，允许分配地址和其他配置信息的双报文交换。

> *知识点*：
>
> - the two-message exchange method for addresse assignment and other Configuration information


回到讨论主题，在 `ipv6 address` 命令下，`[eui-64]` 这个关键字用于给某个接口配置一个 IPv6 地址，并通过在该地址的低阶 64 位，使用 EUI-64 的接口 ID，在该接口上启用 IPv6 处理。默认情况下，链路本地、站点本地及 IPv6 的无状态自动配置，都会使用 EUI-64 格式构造 IPv6 地址。EUI-64 的分址，会将 48 位的 MAC 地址扩展为一个 64 位的地址。这是在两个步骤中完成的，这两个步骤会在接下来的小节中介绍。这个过程被称为无状态自动配置，或 SLAAC。


在创建 EUI-64 地址的第一步中，值 `FFFE` 被插入到 MAC 地址中间，从而将 MAC 地址从 48 位，即 12 个十六进制字符，扩展到 64 位，即 16 个十六进制字符。48 位 MAC 地址到 64 位 EUI 地址的转换，如下图 3.18 中所示。


![创建`EUI-64`地址](../images/0718.png)

**图 3.18** -- **创建 EUI-64 地址**


EUI-64 分址的第二步，是指这个 64 位地址第七位的设置。这第七位被用于标识这个 MAC 地址是否唯一。当这个位被设置为 `1` 时，表示这个 MAC 地址是个全局管理的 MAC 地址 -- 这意味着这个 MAC 地址是由某家厂商分配的。当该位被设置为 `0` 时，则表示这个 MAC 地址是本地分配的 -- 这意味着这个 MAC 地址是由管理员添加的。为了进一步搞清楚这一说法，举例来说，MAC 地址 `02:1F:3C:59:D6:3B` 将被视为全球分配的 MAC 地址，而 MAC 地址 `00:1F:3C:59:D6:3B` 将被视为一个本地地址。下图 3.19 中说明了这点。


![确定本地及全球 MAC 地址](../images/0719.png)

**图 3.19** -- **确定本地与全球 MAC 地址**

下面的配置示例，演示了如何将某个 IPv6 前缀分配给一个接口，以及将该路由器配置为自动使用 EUI-64 地址，创建出接口 ID：


```console
R2(config)#interface FastEthernet0/0
R2(config-if)#ipv6 address 3fff:1a2b:3c4d:5e6f::/64 eui-64
R2(config-if)#exit
```

在这一配置之后，`show ipv6 interface` 命令便可用于验证分配给 `FastEthernet0/0` 接口的 IPv6 接口 ID，如下所示：

```console
R2#show ipv6 interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	IPv6 is enabled, link-local address is FE80::213:19FF:FE86:A20
	Global unicast address(es):
	  	3FFF:1A2B:3C4D:5E6F:213:19FF:FE86:A20, subnet is 3FFF:1A2B:3C4D:5E6F::/64
[EUI]
	Joined group address(es):
		FF02::1
		FF02::2
	FF02::1:FF86:A20
	MTU is 1500 bytes
...
[Truncated Output]
```

要验证 EUI-64 地址的创建，咱们还可通过使用 `show interface` 命令，查看指定接口的 MAC 地址，验证完整的 IPv6 地址：

```console
R2#show interface FastEthernet0/0
FastEthernet0/0 is up, line protocol is up
	Hardware is AmdFE, address is 0013.1986.0a20 (bia 0013.1986.0a20)
		Internet address is 10.0.1.1/30
```


从上面的输出咱们可以看到，那个 EUI-64 地址确实有效，且是基于接口的 MAC 地址。此外，这个地址是个全球地址，因为第七位已启用（即包含着一个非零值）。


最后，`[link-local]` 这个关键字被用于将一个本地链路地址，分配给接口。默认情况下，重要的是记住，为了链路本地地址被动态地创建，咱们不必在接口上启用某个 IPv6 前缀。相反，当 `ipv6 enable` 这个接口配置命令在某个接口下被执行后，那么一个链路本地地址，就会针对该接口，使用 EUI-64 的分址而自动创建出来。


要手动配置某个链路本地地址，咱们必须分配某个 `FE80::/10` 的链路本地地址块内的地址。下面的配置示例，演示了如何配置接口上的链路本地地址：


```console
R3(config)#interface FastEthernet0/0
R3(config-if)#ipv6 address fe80:1234:abcd:1::3 link-local
R3(config-if)#exit
```


在这一配置之后，`show ipv6 interface [name]` 命令便可用于验证链路本地地址的手动配置，如下输出中所示：


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

**注意**： 在手动配置链路本地地址时，若 Cisco 10S 软件检测到另一主机在使用其 IPv6 地址之一，那么一条错误消息将打印在控制台上，且这条命令将被拒绝。在手动配置链接本地地址时，要非常小心。



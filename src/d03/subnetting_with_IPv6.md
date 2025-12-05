# IPv6子网划分

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



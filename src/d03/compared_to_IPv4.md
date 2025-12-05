# IPv6 与 IPv4 的比较

网络工程师应该非常清楚，相对于 IPv4，IPv6 所带来的优势。纵观 IPv6 的那些增强功能，我们可总结出下面这些：

- IPv6 有着扩展的地址空间，从 32 位扩展到 128 位；
- IPv6 使用十六进制记法，而不是点分十进制符号的记法（如 IPv4 下那样）；
- 由于扩展的地址空间，IPv6 地址具有全球唯一性，从而消除了 NAT 的需要；
- IPv6 有着固定的头部长度（40 字节），而允许运营商提高交换效率；
- 通过在 IPv6 头部和传输层头部间放置一些扩展的头部，IPv6 支持一些增强选项（提供新特性）；
- IPv6 提供了地址的自动配置，即使在没有 DHCP 服务器下，仍提供了能动态的 IP 地址分配；
- IPv6 提供了流量标记的支持；
- IPv6 有着内置的安全能力，包括经由 IPSec 的身份验证和隐私保护；
- IPv6 提供了发送数据包到目的地址前的 MTU 的路径发现，从而消除了（数据包）分片/分段的需要；
- IPv6 支持站点多重归属；
- IPv6 使用 ND（邻居发现）协议代替 ARP；
- IPv6 使用 AAAA 的 DNS 记录，而不是 A 记录（如 IPv4 下）；
- IPv6 使用站点本地寻址，而不是 RFC 1918（如 IPv4 下）；
- IPv4 和 IPv6 用到不同的路由协议；
- IPv6 提供任播分址。

## IPv6 分址的配置、验证和故障排除

我们已经介绍了在接口上配置 IPv6 分址的一些可用选项。咱们可手动添加咱们自己的地址，或者只依靠地址自动配置，应用一个地址。

正如咱们所知道的，直连的 IPv6 接口，并不需要位处同一子网才能通信，尽管他们很可能为符合咱们工作的所在地网络设计和寻址策略，而在同一子网。

### IPv6 分址的故障排除工具

网络中的 IPv6 故障排除会因路由协议和传输机制的不同而有很大差异，本节只专门讨论 IPv6 寻址的故障排除。除了检查接口是否有错别字（这是 IPv6 寻址问题的常见原因），你还应了解下表 3.12 中的下列命令，它们将帮助你排除 IPv6 地址部署方面的故障。请在完成任何 IPv6 实验时试用这些命令。
表 3.12-IPv6 命令和操作

As you know, IPv6 interfaces that are directly connected do not need to be in the same subnet in order to communicate, although they may well be in order to comply with whatever network design and addressing policy you have in place where you work.


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



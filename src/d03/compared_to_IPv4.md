# IPv6 与 IPv4 的比较

网络工程师应该非常清楚 IPv6 相对于 IPv4 的优势。纵观 IPv6 的增强功能，我们可以总结出以下几点：Pv6 的地址空间从 32 位扩展到 128 位。Pv6 使用十六进制符号，而不是点十进制符号（如 1Pv4）。由于扩展了地址空间，© IPv6 地址具有全球唯一性，因此无需使用 NAT。IPv6 有固定的报头长度（40 字节），允许供应商提高交换效率。


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



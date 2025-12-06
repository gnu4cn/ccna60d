# 第 3 天实验

## IPv6 Ping 实验

### 拓扑结构

![IPv6 Ping 实验拓扑结构](../images/IPv6_ping.png)

### 实验目的

学习如何配置 IPv6 地址，以及跨接口的 `ping`。

### 实验步骤


1. 在两侧同时启用 IPv6 路由。下面是如何 R1 上启用；

```console
R1(config)#ipv6 unicast-routing
```

2. 将以下 IPv6 地址添加到 R1 的 `FO/0`。对于 R2 要添加 `:2` 的地址。确保不关闭这两个接口；

```console
R1(config)#int f0/0
R1(config-if)#ipv6 address 2001:aaaa:bbbb:cccc::1/64
R1(config-if)#no shut
```

3. 从 R1 `ping` R2，或相反；

```console
R2#ping 2001:aaaa:bbbb:cccc::1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:AAAA:BBBB:CCCC::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/0 ms
```

4. 请尝试执行以下命令，并注意各种输出。要注意 MAC 地址被怎样用于创建链路本地地址。`show ipv6 interface brief` 命令将揭示 MAC 地址。

```console
R1#show ipv6 interface brief
R1#show ipv6 interface f0/0
R1#show ip interface brief
```


## IPv6 概念实验


请在一对直连的 Cisco 路由器上，测试这一教学模组中，详细介绍的那些 IPv6 概念和命令：

- 在两台路由器上同时开启 IPv6 的全球单播路由；
+ 在每个连接的接口上，手动配置一个 IPv6 地址。例如：
    - R1 上 `2001:100::1/64`
    - R2 上 `2001:100::2/64`
- 使用 `show ipv6 interface` 和 `show ipv6 interface prefix` 两个命令，验证配置；
- 测试直接 `ping` 的连通性；
- 使用 IPv6 的无状态自动配置（`ipv6 address autoconfig default`），重复该测试；
- 使用 EUI-64 的地址重复该测试（IPv6 地址 `2001::/64 EUI-64`）；
- 将某个接口的链接本地地址，硬编码为：IPv6 的链路本地地址 `fe80:1234:abcd:1::3`；
- 检查 IPv6 路由表。

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

## 十六进制转换及子网划分练习

**Hex Conversion and Subnetting Practice**

请把今天剩下的时间用于练习这些重要的题目上。

- 将十进制转换成十六进制（随机数字）
- 将十六进制转换成十进制（随机数字）
- IPv6子网划分（随机网络和场景）


（End）



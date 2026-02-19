# 思科 IOS 软件中 OSPFv3 的配置与验证


继续上一小节，其中重点介绍了 OSPFv2 与 OSPFv3 之间的配置差异，这一节介绍在 Cisco 10S 软件中，启用并验证 OSPFv3 功能及路由所需的步骤。要启用 Cisco IOS 中的 OSPFv3 路由，那么以下步骤应予采取：

1. 使用 `ipv6 unicast-routing` 这条全局配置命令，全局地启用 IPv6 的路由。默认情况下，IPv6 的路由在 Cisco 10S 软件中是禁用的；
2. 使用 `ipv6 router ospf [process ID]` 这条全局配置命令，配置一个或多个 OSPFv3 的进程；
3. 若路由器上未配置有着 IPv4 地址的运行接口，那么就要使用 `router-id [IPv4 address]` 这条路由器配置命令，手动配置 OSPFv3 的 RID；
4. 使用 `ipv6 address` 与 `ipv6 enable` 这两条接口配置命令，在所需接口上启用 IPv6；（译注：原文这里误将 "interface" 作为了配置命令，而写作了 “the `ipv6 address` and `ipv6 enable interface` configuration commands”。）
5. 使用 `ipv6 ospf [process ID] area [area ID]` 这条接口配置命令，在该接口下启用一个或多个 OSPFv3 的进程。


## 配置示例

这第一个基本的多区域 OSPFv3 配置示例，基于下图 25.4 中所示的拓扑结构：

![在思科 IOS 软件中配置基本多区域OSPFv3](../images/1301.png)

**图 25.4** —- **在 Cisco 10S 软件中配置基本的多区域 OSPFv3**

按照上一小节所述的配置步骤顺序，OSPFv3 将在路由器 `R1` 配置为如下：

```console
R1(config)#ipv6 unicast-routing
R1(config)#ipv6 router ospf 1
R1(config-rtr)#router-id 1.1.1.1
R1(config-rtr)#exit
R1(config)#interface FastEthernet0/0
R1(config-if)#ipv6 address 3fff:1234:abcd:1::1/64
R1(config-if)#ipv6 enable
R1(config-if)#ipv6 ospf 1 Area 0
R1(config-if)#exit
```

按照同一步骤顺序，OSPFv3 的路由在路由器 `R3` 上被配置为如下：


```console
R3(config)#ipv6 unicast-routing
R3(config)#ipv6 router ospf 3
R3(config-rtr)#router-id 3.3.3.3
R3(config-rtr)#exit
R3(config)#interface FastEthernet0/0
R3(config-if)#ipv6 address 3fff:1234:abcd:1::3/64
R3(config-if)#ipv6 enable
R3(config-if)#ipv6 ospf 3 Area 0
R3(config-if)#exit
R3(config)#interface Loopback0
R3(config-if)#ipv6 address 3fff:1234:abcd:2::3/128
R3(config-if)#ipv6 address 3fff:1234:abcd:3::3/128
R3(config-if)#ipv6 enable
R3(config-if)#ipv6 ospf 3 Area 1
R3(config-if)#exit
```

在两台路由器上的 OSPFv3 配置后，咱们便可使用 `show ipv3 ospf neighbors` 这条命令，验证 OSPFv3 邻接关系的状态，如下 `R1` 上的输出所示：


```console
R1#show ipv6 ospf neighbor
Neighbor	ID Pri	State 		Dead Time	Interface ID 	Interface
3.3.3.3		     1	FULL/BDR 	00:00:36 	4 				FastEthernet0/0
```

咱们还可通过追加 `[detail]` 关键词到这条命令末尾，查看详细的邻居信息：

```console
R1#show ipv6 ospf neighbor detail
Neighbor 3.3.3.3
	In the area 0 via interface FastEthernet0/0
	Neighbor: interface-id 4, link-local address FE80::213:19FF:FE86:A20
	Neighbor priority is 1, State is FULL, 6 state changes
	DR is 1.1.1.1 BDR is 3.3.3.3
	Options is 0x000013 in Hello (V6-Bit E-Bit R-bit )
	Options is 0x000013 in DBD (V6-Bit E-Bit R-bit )
	Dead timer due in 00:00:39
	Neighbor is up for 00:06:40
	Index 1/1/1, retransmission queue length 0, number of retransmission 0
	First 0x0(0)/0x0(0)/0x0(0) Next 0x0(0)/0x0(0)/0x0(0)
	Last retransmission scan length is 0, maximum is 0
	Last retransmission scan time is 0 msec, maximum is 0 msec
```

在上面的输出中，要注意到，实际的邻接接口地址，是链路本地地址，而非所配置的那个全局 IPv6 单播地址。


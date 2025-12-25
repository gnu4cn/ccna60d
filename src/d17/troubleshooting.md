# 路由故障排除

**Troubleshooting Routing Issues**

当在网络设备上配置路由时，必须按照设计小心仔细地配置**静态或动态路由**(static or dynamic routing)。如存有故障而无法通过网络发送/接收流量，这时多半有着某种配置问题。在初次设置某台路由器时，总会有一些类型的配置问题要你去排除。而如果某台路由器已经运行了一段时间，而突然完全没有了流量（没有通信），就要做一下情况分析，看看路由协议有没有如预期那样发挥功能。

有时某些路由会间歇性地从路由表中消失又出现、消失又出现，以致造成到特定目的网络的间歇性通或不通。这可能是由于某个确切网络区域存在某些通信故障，而沿着该路径上的路由器在那个区域每次变得可用时都会宣告新的路由信息造成的。该过程就叫作“路由抖动(route flapping)”， 而使用一种叫作“路由惩罚（route dampening）”的特性，可对这些特定抖动路由进行屏蔽（be blocked）, 以令到整个网络不受路由抖动的影响。

> **注意：** 在使用静态路由时，路由表一直不会变化，所以对发生在不同网络区域内的故障，也得不到任何信息。

在处理路由故障时，标准方法就是依据路由表来检查沿路径的每条路由（when troubleshooting routing issues the standard approach is to follow the routing table for every route along the path）。可能会要执行一下`traceroute`，来准确找出数据包去了哪里，并看看路径上的那些路由器。采用这种方法，就可以准确知道可能是哪台设备引起的该故障，同时可以开始调查某些特定路由器上的路由表了。

在进行这样一个排错过程时，一个常犯的错误就是仅在一个方向上调查该故障（比如只从源到目的方向）。正确的做法是应在去和回两个方向进行排错，因为可能会偶然遇到数据包在一个方向被阻止而从目的到源没有返回流量的情形。为保证一个最优的传输流，沿路径处于两点之间的设备上的路由表中应在两个方向上都有正确指向。

通常情况下都会用到第三方提供的连接，所以在想要对某个确切区域进行排错时，就要与服务提供商进行沟通，以共同解决问题。这就包括了分享路由表信息。

动态路由协议的采行，令到排错过程更为容易，因为可以检查由路由器发出和接收到的路由更新。而对路由更新的检查，可以通过抓包或内部的设备机制完成，同时将帮助我们看到路由表是在何时、如何生成的。有着一张拓扑图及其它列出了每个前缀在网络中所处位置的文档，将更好地帮助你对路由更新的理解，进而缩短排错的过程。在这样的一个排错过程中，一般的主张就是依网络的设计，决定某个特定数据包将会采取的路径，并调查一下到底这个数据包在该路径的何处，偏离了该路径。

要对网络设备进行监控，有着不同工具。而这些工具都用到同样的网络管理协议，那就是简单网络管理协议（Simple Network Management Protocol, SNMP）, 该协议设计从某台管理工作站对网络设备发起不同参数的查询（ ICND2 涵盖了 SNMP ）。除了检查标准的“健康度”参数（比如 CPU 、内存、磁盘空间等等）外， SNMP 还会查询路由器的下面这些参数。

- 接口上数据包计数
- 使用到的带宽及通过量
- 设备接口上的 CRC 及其他类型的错误
- 路由表信息

其它可以用到工具就是标准的用于验证端到端连通性的`ping`和`traceroute`了。它们亦能展示一些可能有助于确定出网络中发生故障的点位的相关输出。

下面是在对几乎所有路由故障进行排错时所涉及的步骤。

- 检查路由是否开启
- 检查路由表是否有效
- 检查当前的路径选择

### 检查路由是否开启

**Verifying that Routing is Enabled**

路由排错的第一步，就是检查路由协议是否开启及正确配置。这既可以通过检查当前运行配置（也就是`show run`命令），又可以使用结合了每种特定路由协议的`show`命令。这些路由协议的选项有下面这些。

```console
Router#show ip ospf ?
	<1-65535> 				Process ID number
	border-routers 			Border and boundary router information
	database 				Database summary
	flood-list				Link state flood list
	interface 				Interface information
	max-metric 				Max-metric origination information
	mpls 					MPLS related information
	neighbor 				Neighbor list
	request-list 			Link state request list
	retransmission-list 	Link state retransmission list
	rib 					Routing information base (RIB)
	sham-links 				Sham link information
	statistics 				Various OSPF Statistics
	summary-address 		Summary-address redistribution information
	timers 					OSPF timers information
	traffic					Traffic related statistics
	virtual-links 			Virtual link information
	|						Output modifiers
	<cr>

Router#show ip eigrp ?
	<1-65535> 	Autonomous System
	accounting 	IP-EIGRP accounting
	interfaces 	IP-EIGRP interfaces
	neighbors 	IP-EIGRP neighbors
	topology 	IP-EIGRP topology table
	traffic		IP-EIGRP traffic statistics
	vrf			Select a VPN routing/forwarding instance

Router#show ip bgp ?
	A.B.C.D 			Network in the BGP routing table to display
	A.B.C.D/nn 			IP prefix <network>/<length>, e.g., 35.0.0.0/8
	all 				All address families
	cidr-only 			Display only routes with non-natural netmasks
	community 			Display routes matching the communities
	community-list 		Display routes matching the community-list
	dampening 			Display detailed information about dampening
	extcommunity-list 	Display routes matching the extcommunity-list
	filter-list			Display routes conforming to the filter-listinconsistent-as Display only routes with inconsistent origin ASs
	injected-paths 		Display all injected paths
	ipv4 				Address family
	ipv6 				Address family
	labels 				Display labels for IPv4 NLRI specific information
	neighbors 			Detailed information on TCP and BGP neighbor connections
	nsap 				Address family
	oer-paths 			Display all oer controlled paths
	paths 				Path information
	peer-group 			Display information on peer-groups
	pending-prefixes 	Display prefixes pending deletion
	prefix-list 		Display routes matching the prefix-list
	quote-regexp 		Display routes matching the AS path “regular expression”
	regexp 				Display routes matching the AS path regular expression
	replication 		Display replication status of update-group(s)
	rib-failure 		Display bgp routes that failed to install in the routing table (RIB)
	route-map 			Display routes matching the route-map
	summary 			Summary of BGP neighbor status
	template 			Display peer-policy/peer-session templates
	update-group 		Display information on update-groups
	vpnv4 				Address family
	| 					Output modifiers
	<cr>
```

### 检查路由表是否正确

**Verifying That the Routing Table Is Valid**

在成功确定已开启路由进程后，下一步就要对各协议的路由表进行分析，看看那里列出的信息是否正确。一些需要着重注意的地方有下面这些。

- 验明经由正确的协议学习到正确的前缀
- 验明学到的前缀条数
- 验明这些路由的度量值及下一跳信息

依据路由协议的不同，还要对从设备向外通告的那些前缀的正确性进行检查。

### 检查路径选择的正确性

在检查了有关前缀在路由表中确有出现后，就应对这些前缀的属性值（译者注：其路由跳数及各条路由的度量值、下一跳等信息）及路径选择方式进行仔细分析。这些分析包括下面这些。

- 检查通告了该前缀的所有路由协议（还要包括静态路由）
- 对 AD 进行比较和修改，以令到优先选择某种指定的路由协议，而不是默认正确的
- 检查并调整这些协议的度量值

通过对网络中某台路由器的恰当配置，并在配置过程中对每一步都做好文档，以及对网络中两点自荐路径的持续监测，就能够对网络中流量是如何准确地流经那些设备，有扎实掌握。

## 第 10 天问题

1. What is a routing protocol?
2. `_____` is used to determine the reliability of one source of routing information from
another.
3. If a router learns a route from both EIGRP (internal) and OSPF, which one would it prefer?
4. What is the RIP AD?
5. What is the eBGP AD?
6. Name at least four routing metrics.
7. Once routes have been placed into the routing table, by default the most specific or
longest match prefix will always be preferred over less specific routes. True or false?
8. `_______` operates at the data plane and is a topology-driven proprietary switching
mechanism that creates a forwarding table that is tied to the routing table (i.e., the
control plane).
9. CEF uses a `_______` to make IP destination prefix-based switching decisions.
10. Link State routing protocols are those that use distance or hop count as its primary
metric for determining the best forwarding path. True or false?

## 第 10 天问题答案

1. A protocol that allows a router to learn dynamically how to reach other networks.
2. Administrative distance.
3. EIGRP.
4. 120.
5. 20.
6. Bandwidth, cost, delay, load, reliability, and hop count.
7. True.
8. CEF.
9. FIB.
10. False.

## 第 10 天的实验

### 路由概念实验

采用两台直连的路由器，并测试本模块中提到的那些基本命令。 RIP 已不在 CCNA 考试中了，但其对于一个简单的实验来说，是十分简单易用的。

- 给直连接口分配一个 IPv4 地址（10.10.10.1/24及10.10.10.2/24）
- 用`ping`测试直连的连通性
- 在两台路由器上都配置一个环回接口，并从两个不同范围为其分配上地址（11.11.11.1/32及12.12.12.2/32）
- 配置标准 RIP 并通告所有本地网络

```console
R1:
router rip
version 2
no auto
network 10.10.10.0
network 11.11.11.0

R2:
router rip
version 2
no auto
network 10.10.10.0
network 12.12.12.0
```

- 自 R1 向 R2 的环回接口进行`ping`操作，以测试连通性
- 执行一条`show ip route`命令，来检查经由 RIP 收到了那些路由
- 执行一条`show ip protocols`命令，来检查有配置了 RIP 且 RIP 在设备上是允许着的


（End）


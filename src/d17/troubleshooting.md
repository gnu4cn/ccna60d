# 路由故障排除

在咱们的网络设备上配置路由时，咱们必须根据设计，仔细配置静态或动态的路由。当咱们遇到某种问题，而无法在网络上发送/接收流量时，那么咱们就可能遇到了某种配置问题。在咱们最初设置某个路由器时，就很可能会有咱们将必须排除的某种类型配置问题。而若该路由器已运行一段时间，而咱们突然遇到流量完全中断（无通信），那么咱们应分析情况，找出路由协议如预期运行。


有时，某些路由可能会间歇性地从路由表中消失及出现，而导致到一些特定目的地的间歇性连通性问题。这可能是因为某个网络区域，有着某种通信故障，而每次该区域变得可访问时，路径上的路由器都会传播新的路由信息。这一过程被称为 “路由抖动”，而这些特定路由，可通过使用叫做 “路由抑制” 的特性阻止，从而使整个网络不受影响。

**注意**：在使用静态路由时，路由表就永远不会改变。因此，咱们将对不同网络区域中所发生的问题一无所知。


在排除路由问题时，标准方法是根据路由表，查找路径上的每条路由。咱们可执行一次 `traceroute`，找出数据包的确切去向，并查看路径上的那些路由器。以这种方式，咱们就会准确知道，哪个设备可能造成这个问题，进而咱们便可开始调查那些特定路由器的路由表。

在执行一次这样的故障排除过程时，一个常见的错误，便是只从单一方向（例如，源到目的地）调查问题。相反，咱们应该在两个方向上，进行故障排除，因为咱们可能遇到其中数据包在单个方向上受阻，而咱们却没有自目的地到源的返回流量。为了确保最佳流量，两点之间路径上设备的路由表，应在两个方向均有正确指向。

通常情况下，咱们将用到一些由第三方提供的连接，因此当咱们打算排除某一区域中的故障时，咱们应与提供商沟通，并同步故障的努力。包括共享路由表信息等。

使用动态路由协议，会让故障排除过程更轻松，因为咱们可在路由更新被路由器发送和接收时，对其加以检查。这可通过数据包捕获，或一些设备内部机制完成，并将帮助咱们了解路由表是怎样及于何时产生的。在有列出了每个前缀位于网络中何处的拓扑图于其他文档时，那么就会进一步帮助咱们对路由更新的了解，而会缩短故障排除过程。此类故障排除过程的总体思路，是根据网络设计，确定处某个特定数据包应采取哪条路径，并调查其于何处偏离了该路径。

一些不同工具可用于监控网络设备。这些工具所用到的一种常见网络管理协议，便是简单网络管理协议（SNMP），其被设计来从某个管理站，查询网络设备的不同参数（SNMP 会在后面介绍）。除了那些标准的 “健康” 参数（如 CPU、内存、磁盘空间等）会被检查外，SNMP 还可以查询路由器的以下信息：

- 接口的数据包计数器
- 使用的带宽及吞吐量
- 设备接口上的 CRC 或其他类型的报错
- 路由表的信息

为检查端到端的连接性，咱们可使用的一些其他类型工具，便是标准的 `ping` 及 `traceroute` 两个实用工具了。他们还可显示，可能帮助咱们确定网络中问题出现点位的相关输出。

排除几乎所有路由问题的一些步骤，包括以下这些：

- 检查路由是否已启用
- 验证路由表是否有效
- 检查路径选择是否正确

## 检查路由是否已启用

路由故障排除的第一步，是验证路由协议是否启用，以及是否被正确配置。这可以通过检查当前的运行配置（即 `show run` 命令），或使用与每种特定路由协议相关的 `show` 命令完成。其中一些选项列出在下面。

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

## 验证路由表是否有效

在成功确定路由进程已启用后，下一步就是分析路由表，看看该处列出的信息是否有效。咱们应重点关注的一些要点包括：

- 验证是否有一些正确的前缀，经由正确的路由协议学习到
- 检查已学习到的前缀数量
- 检查路由度量与下一跳信息


根据相应路由协议，咱们还应验证这些正确的前缀，是否正从咱们的设备向外通告。

## 验证正确的路径选择

在验证相关前缀确实出现在路由表后，咱们应仔细分析他们的属性，及每个前缀的路径选择方式。这一步可能包括：

- 检查通告该特定前缀的所有路由协议（包括静态路由）
- 比较并修改某种路由协议的管理距离，以便优选该路由协议，而不是正确的路由协议
- 检查并调整协议的度量值

通过正确配置咱们网络中的路由器、记录过程中的每个步骤，并持续监控网络中不同点位之间的路径，咱们将对流量应如何穿越网络中的所有设备，有确切的掌握。



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

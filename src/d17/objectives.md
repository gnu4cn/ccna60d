# 路由协议的目标

路由算法虽然性质不同，但都有相同的基本目标。虽然有些算法比其他算法更适合某些网络，但所有路由协议都有其优缺点。路由算法的设计宗旨和目标如下：
最佳路由
稳定性
易于使用
灵活性
快速收敛 最佳路由
# 路由协议的各种目标

**The Objectives of Routing Protocols**

这些路由算法尽管生来就有所不同，但都有着同样的基本目标。虽然一些算法好于其它一些，但所有路由协议都有其优势和不足。这些路由算法的设计，都有着下面这些目标和目的。

- 最优路由, optimal routing
- 稳定性, stability
- 易于使用, easy of use
- 灵活性, flexibility
- 快速收敛, rapid of convergence

### 最优路由

**Optimal Routing**

所有路由协议的主要目标之一，就是选择通过网络从源子网或主机到目的子网或主机的最优路径。最优路由依据就是这些路由协议所使用的度量值。一种协议所认为的最优路由，并不一定也是从另一协议角度看的最优路由。比如， RIP 可能认为一条仅有两跳长的路径是到某个目的网络的最优路径，尽管这些链路都是`64Kbps`，而诸如 OSPF 和 EIGRP 那样的先进协议则会到相同目的的最优路径是经过了`4`台路由器却有着`10Gbps`速率的链路。

### 稳定性

**Stability**

网络的稳定与否，是这些路由算法的另一个主要目标。路由算法应足够稳定，以容许无法遇见的网络事件（to accommodate unforeseen network events）, 比如硬件故障甚至错误实现等。尽管这是一个所有路由算法的典型特征，但由于它们对这些事件应对的方式和所用时间，令到一些算法相对其它算法做得更好，因此在现今网络中用到更多。

### 易于使用

**Ease of Use**

路由算法被设计得尽可能简单。除了要提供对复杂互联网络部署的支持能力，路由协议还应考虑运行其算法所需的计算资源问题。一些路由算法比起其它算法需要更多的硬件和软件资源（比如 CPU 和内存）来运行；但它们却能够提供比其它替代的简单算法更多的功能。

### 灵活性

**Flexibility**

除了提供路由功能外，路由算法还应富于特性，从而令到这些算法支持在不同网络中遇到的不同需求。但需注意此能力是以诸如下面即将说到的收敛等其它特性为代价的。

### 快速收敛

**Rapid Convergence**

快速收敛又是所有路由算法的另一主要目标。如早前指出的那样，当网络中的所有路由器都有着同样视图且对最优路由达成一致时，就出现了收敛。在需要长时间才能收敛时，远端网络之间就会出现间歇性的包丢失及失去连通性。除了这些问题外，慢速收敛还会导致路由环回和完全的网络中断。

### 路由故障避开机制

**Routing Problems Avoidance Mechanisms**

距离矢量路由协议因其过于简单的“依据传言的路由”方法，而容易造成大问题（it is a known fact that Distance Vector routing protocols are prone to major problems as a result of their simplistic "routing by rumor" approach）。距离矢量和链路中台协议采用不同方法来防止路由故障。有下面这些最为重要的机制。

- **无效计数器**，invalidation timers: 在很长时间内都没有收到一些路由的更新时，这些计数器被用于将这些路由标记为不可达。
- **跳数限制**, hop count limit: 当一些路由的跳数，比预先定义的跳数限制还多时，此参数就将这些路由标记为不可达。 RIP 的跳数限制是15, 而大型网络通常不会使用 RIP 。不可达路由不会作为最佳路由安装到路由表中。跳数限制防止网络中的环回更新，就想 IP 头部的 TTL 字段一样。
- **触发的更新**, triggered updates：此特性允许有重要更新时对更新计数器进行旁路、忽视。比如，在有一个重要的路由更新必须要在网络中宣传是，就可以忽略 RIP 的`30`秒计数器。
- **保持计数器**, hold-down timers: 如某条特定路由的度量值持续变差，那条路由的更新就会在一个延迟时期内不被接受了。
- **异步的更新**, asynchronous updates：异步更新代表另一种防止网络上的路由器，在同一时间其全部路由信息被冲掉的安全机制。在前面提到， OSPF 每 30 分钟执行一次异步更新。异步更新机制为每台设备生成一个小的延时，因此这些设备不会准确地在同一时间信息全被冲掉。这样做可以改进带宽的使用以及处理能力。
- **路由投毒**, route poisoning: 此特性防止路由器通过已为无效的路由发送数据。距离矢量协议使用这个特性表明某条路由不再可达。路由投毒是通过将该路由的度量值设置为最大值完成的。
- **水平分割**, split horizon：水平分割防止路由更新再从收到的接口上发送出去，因为在那个区域中的路由器应该已经知道了那条特定路由了。
- **反向投毒**, poison reverse: 该机制是因被投毒路由而造成的水平分割的一个例外。

## 基于拓扑的思科快速转发交换

**Topology-Based(CEF, Cisco Express Forwarding) Switching**

将某数据包预期的目的地址与 IP 路由表进行匹配，需要使用一些路由器的 CPU 运算周期。企业路由器可能有着数十万的路由条目，并能对同样数量的数据包与这些条目进行匹配。在尝试以尽可能高的效率来完成这个过程中，思科构建出了各种不同的交换方法（various switching methods）。第一种叫做进程交换（process switching）, 而它用到路由查找及已分级的最佳匹配方法（uses the route lookup and best match already outlined）。此方式又在快速交换（fast switching）之上进行了改进。路由器生成的最近转发数据包 IP 地址清单，连同 IP 地址匹配下的数据链路层地址会被复制下来。作为对快速转发的改进，思科快速转发（Cisco Express Forwarding, CEF）技术得以构建。当下思科路由器的所有型号，默认运行的都是 CEF 。

## 思科快速转发

**Cisco Express Forwarding(CEF)**

CEF运行于数据面（the data plane）, 是一种拓扑驱动的专有交换机制（a topology-driven proprietary switching mechanism）, 创建出捆绑到路由表（也就是控制面，the control plane）的转发表。开发 CEF 是为消除因基于数据流交换中用到的，进程交换的首个数据包查找方法出现的性能问题（CEF was developed to eliminate the performance penalty experencied due to the first-packet process-switched lookup method used by flow-based switching）。 CEF 通过允许为基于硬件的三层路由引擎用到的路由缓存，在接收到某个传输流的任何数据包之前，将所有三层交换所需的必要信息，包含到硬件当中。照惯例保存在路由缓存中的信息，现在是保存在 CEF 交换的两个数据结构中。这两个数据结构提供了高效率包转发的优化查找，它们分别成为 FIB （Forwarding Information Base, 转发信息库）和邻居表。

> **注意：** 重要的是记住就算有了 CEF ，在路由表发生变化时， CEF 转发表同样会更新。在新的 CEF 条目创建过程中，数据包会在一个较慢的交换路径中，使用比如进程交换的方式，进行交换。所有当前的思科路由器型号及当前的 IOS 都使用 CEF 。

### 转发信息库

**Forwarding Information Base(FIB)**

CEF使用一个 FIB 来做出基于 IP 目的地址前缀的交换决定（CEF uses a FIB to make IP destination prefix-based switching decisions）。 FIB 在概念上与路由表或信息库是相似的。 FIB 维护着包含在 IP 路由表中的转发信息的一个镜像。也就是说， FIB 包含了来自路由表中的所有 IP 前缀。

当网络中的路由或拓扑发生改变是， IP 路由表就会被更新，同时这些变化在 FIB 中也会反映出来。 FIB 维护着建立在 IP 路由表中信息上的下一跳地址信息。因为在 FIB 条目和路由表条目之间有着一一对应关系， FIB 就包含了所有已知路由，并消除了在诸如快速交换方式和最优交换（optimum switching）方式中于交换路径（switching paths）有关的路由缓存维护需求。

此外，因为 FIB 查找表中包含了所有存在于路由表中的已知路由， FIB 就消除了路由缓存维护，以及快速交换和进程交换的转发场景。这样做令到 CEF 比典型的demand-caching方案要更为高效地交换流量。

### 邻接表

**The Adjacency Table**

创建邻接关系表来包含所有直连的下一跳。邻接节点就是只有一跳的节点（也就是直接连接的）。在发现邻接关系后，就生成了该邻接关系表。一旦某个邻居成为邻接关系，将用于到达那个邻居的一个叫作 MAC 字串或 MAC 重写（a MAC string or a MAC rewrite）的数据链路层头部，就被创建出来并存入到邻接表中。在以太网段上，头部信息依次包含了目的 MAC 地址、源 MAC 地址以及以太网类型（ EtherType ）。

而一旦某条路由得到解析，就会指向到一个邻接的下一跳。如在邻接表中找到了某个邻接，那么一个指向该适当邻接的指针就在 FIB 条目中进行缓存（as soon as a route is resolved, it points to an adjacent next hop. If an adjacency is found in the adjacency table, a pointer to the appropriate adjacency is cached in the FIB element）。而如果存在到某个同样目的网络的多条路径，则指向每条邻接的所有指针就会被加入到load-sharing结构体中，这样做可以实现负载均衡。当多条前缀加入到 FIB 时，那些需要例外处理的前缀，会以特别邻接关系进行缓存。

### 加速的及分布式CEF

**Accelerated and Distributed CEF**

默认下，所有基于 CEF 技术的思科 Catalyst 交换机都使用**一个中心化三层交换引擎**(a central Layer 3 switching engine)，在那里由单独的处理器对交换机中所有端口上接收到的流量，做出全部的三层交换决定。尽管思科 Catalyst 交换机中用到的三层交换引擎提供了高性能，但在某些网络中，即便使用单独的三层交换引擎来完成所有三层交换，仍然不能提供足够的性能。为解决这个问题，思科`Catalyst 6500`系列交换机允许通过使用特别的转发硬件对 CEF 进行优化（to address this issue, Cisco Catalyst 6500 series switches allow for CEF optimisation through the use of specialised forwarding hardware）。 CEF 优化有两种实现方式，加速的 CEF 或分布式 CEF 。

加速的 CEF 允许让 FIB 的一个部分分布到`Catalyst 6500`交换机中的具备此功能的线路卡模块上去（Accelerated CEF allows a portion of the FIB to be distributed to capable line card modules in the Catalyst 6500 switch）。这样做令到转发决定在本地线路卡上使用本地存储的缩小的 CEF 表做出。假如有 FIB 条目在缓存中没有找到，就会向三层交换引擎发出需要更多 FIB 信息的请求。

分布式 CEF 指的是使用分布在安装于机架上的多块线路卡上的多个 CEF 表。在应用 dCEF 时，三层交换引擎（ MSFC ）维护着路由表并生成 FIB ， FIB 将被所有线路卡动态完整下载，令到多个三层数据面（multiple Layer 3 data plane）同时运行。

总体上说， dCEF 和 aCEF 都是用到多个三层交换引擎的技术，这样就实现了多个三层交换操作同时并行运作，从而提升整体系统性能。 CEF 技术提供以下好处。

- 性能改善，improved performance -- 比起快速交换路由缓存技术， CEF 是较少CPU-密集的（CEF is less CPU-intensive than fast-switching route caching）。那么就有更多的 CPU 处理能力用在譬如 QoS 和加密等的三层业务上。
- 伸缩性, scalability -- 当 dCEF 模式开启时， CEF 在诸如Catalyst 6500系列交换机等的高端平台的所有线路卡上，提供了全部的交换能力。
- 迅速恢复的能力, resilience -- CEF提供了大型动态网络中无例可循水平的数据交换一致性和稳定性。在动态网络中，快速交换缓存条目由于路由变化而频繁地过期和作废。这些变动能够引起流量经由使用路由表的进程交换而不是使用路由缓存的快速交换（CEF offers **an unprecedented level of switching consistency and stability** in large dynamic networks. In dynamic networks, fast-switching cache entries are frequently invalidated due to routing changes. These changes can cause traffic to be process-switched using the routing table rather than fast-switched using the route cache）。

### CEF的配置

**Configuring Cisco Express Forwarding**

开启 CEF 只需简单的一条命令，那就是全局配置命令`ip cef [distributed]`。关键字`[distributed]`仅适用于像是`Catalyst 6500`系列、支持`dCEF`的高端交换机。下面的输出展示了如何在一台诸如`Catalyst 3750`系列交换机的低端平台上配置 CEF 。

```console
VTP-Server-1(config)#ip cef
VTP-Server-1(config)#exit
```

下面的输出演示了在`Catalyst 6500`系列交换机上如何开启`dCEF`。

```console
VTP-Server-1(config)#ip cef distributed
VTP-Server-1(config)#exit
```

> **注意：** 并没有用于配置或开启 aCEF 的显式命令。

## 路由问题的故障排除

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



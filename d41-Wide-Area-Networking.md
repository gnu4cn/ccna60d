# 第41天 - 广域组网

**Wide Area Networking**

## 第41天任务

- 约定今天的课文（下面）
- 复习昨天的课文
- 完成自主选择的实验
- 阅读ICND2记诵指南
- 在[subnetting.org](http://www.subnetting.org)网站上花15分钟


思科将WAN有关的概念拆分到了ICND1与ICND2考试中，后者关注的是帧中继及PPP协议（Frame Relay and PPP protocols）。因此，本手册将看看基本的WAN概念、技术及协议。

今天，将学习以下知识：

- 关于WAN的组件（WAN components）
- 关于WAN的协议（WAN protocols）
- 基本的串行线路的配置
- WAN连接的故障排除

此课程模块对应了以下ICND2考试大纲的有关有求：

+ 认识不同的广域网技术
    - 城域以太网（Metro Ethernet）
    - 甚小孔径终端（Very Small Aperture Terminal，VSAT，参考[维基百科](https://en.wikipedia.org/wiki/Very-small-aperture_terminal)）
    - T1/E1（参考[维基百科T-carrier](https://en.wikipedia.org/wiki/T-carrier)，[维基百科E-carrier](https://en.wikipedia.org/wiki/E-carrier)）
    - T3/E3
    - 综合业务数字网（Integrated Services Digital Network，ISDN）
    - 数字用户线路（Digital Subscriber Line，缩写：DSL）
    - 同轴线组网
    - 第3代/第4代蜂窝网络（Celluar 3G/4G, 基站蜂窝网络）
    - 虛拟私人/专用网络（Virtual Private Network，VPN） 
    - 多协议标签交换（Multi-Protocol Label Switching，MPLS）

- 配置并验证一条基本的WAN串行连接
- 对PPPoE进行部署与故障排除

## 广域网概述（WAN Overview）

为了提供网络设施不同部分的连通性，广域网跨越极大的地理范围。与局域网环境不同，并非所有的WAN组件都是由其所服务的特定企业保有的。相反，WAN设备或连通性，可从服务提供商处进行短期或长期租用（rended, 短期、口头、临时的租用，leased, 长期、书面、固定期限的租用）。

大多数服务提供商都有良好培训，以确保它们可同时在极大的地理范围上，适当地支持传统数据流量，以及语音与视频业务（这些对延迟都更为敏感）。

有关WANs的另一个有趣的地方，即与LANs不同，这里通常有某种初期固定的投入，以及某种周期性的经常业务费用（Another interesting thing about WANs is that, unlike LANs, there is typically some initial fixed cost and some periodic recurring fees for the services）。在广域组网下，用户既不会拥有连接与某些设备，还将必须持续付费给服务提供商。这就是应避免高配（即购买仅需的带宽）的原因之一。这就带来对部署有效的服务质量机制（implementing effective Quality of Service mechanisms），以避免购买额外WAN带宽的需求。靠开销通常与带宽高配中出现的经常性开支有关（The high costs are usually associated with the recurring fees that might appear in the case of over-provisioning the bandwidth）。

有关WAN技术设计方面的要求，通常派生自以下这些方面：

- 应用的类型（Application type）
- 应用的可用性（Application availability）
- 应用的可靠性（Application reliability）
- 与某种特定WAN技术有关的成本情况（Costs associatedd with a particular WAN technology）
- 应用的使用级别（Usage levels for the application）

## 广域网的类别（WAN Categories）

WAN分类中的一个必要概念就是电路交换技术，该技术最为相关的实例，就是公众交换电话网络了（An essential concept in WAN categorisation is circuit-switched technology， the most relevant example of this technology being the Public Switched Telephone Network, PSTN）。而归入此类别的一种技术，就是综合业务数字网。电路交换WAN连接的工作方式，是在需要连接时变为连接建立状态，并在连接不需要时连接终止。反映这种电路交换行为的另一个实例，就是老式的拨号连接（仅有PSTN的拨号调制解调器的模拟信号访问）。

> **注意**：就在不久之前，拨号技术都还是访问互联网资源的唯一方式，这种方式提供到平均`40kbps`的可用带宽。如今这种技术几乎绝迹了。

电路交换选择的反面，就是长期租用线路技术了（leased-line technology）。这种技术是一条完全专属的连接，持续可用并由租户公司拥有。长租线路的实例，包括基于时分复用的长租线路（Time Division Multiplexing(TDM)-based leased lines）。这类接入方式通常都很昂贵，因为单个客户具有连接的整个使用权。

WAN技术的另一种流行分类，涉及包交换网络（packet-switched networks）。在包交换设施中，共享带宽利用了虚拟电路技术（in a packet-switched infrastruture, shared bandwidth utilises virtual circuits）。客户可通过服务提供商的设施云，创建出一条虚拟路径（与长租线路类似）。此虚拟电路有着专属的带宽，但技术上将虚拟电路并非一条真实的长租线路。帧中继就是此种技术类型的一个实例。

包括作为帧中继前身的`X.25`在内的一些古早WAN技术。这种技术在某些实现中仍有出现，但已经很罕见了（如今帧中继也很少见了）。

另一种可能听过的WAN类别，就是单元交换技术（cell-switched technology）了。这种WAN类型通常包含在包交换技术中，因为它们非常类似。一种单元交换技术的实例，就是异步传输模式（Asynchronous Transfer Mode, ATM，这种技术如今也相当罕见了）。ATM是以固定大小的数据单元运作的，而不是使用数据包（如同在帧中继网络中所用的）。单元交换技术构成一个共享带宽的环境，因此服务提供商可确保客户有着通过其设施的固定水平的带宽。

宽带（Broadband）接入是另一种正在增长中的WAN类别，这种WAN接入方式包含了诸如以下这些技术：

- 数字订户线路（Digital Subscriber Line, DSL）
- 同轴线网络（Cable）
- 无线接入（Wireless）

宽带接入有着此种能力：采用如老式传输电视信号的同轴线的某种连接，并解决如何充分使用该既有带宽的不同方面的能力。比如通过将一个额外的、可与原先的电视信号一同传输的数据信号进行复用。

![广域网的类别](images/4101.png)

*图 41.1 - 广域网的类别*

如同在上面的图41.1中详细展示的那样，在讨论广域网的类别时有许多选项，同时这里只是对它们的简单介绍。所有这些技术都可以支持运行在`20/80`设计原则下的现代网络，所谓`20/80`设计原则，指的是`80%`的网络流量使用了某种广域网技术，来访问远端资源。

## 非广播多路复用技术（NBMA Technologies）

出现在广域组网中的一种特殊技术，就是非广播多路复用了。所谓非广播多路复用技术，表示某些在传统广播组网中没有的挑战。当某个需要经由同一网络进行通信系统分组不支持原生的广播时，就出现了非广播多路访问的需求（The need for NBMA arises when there is no native Broadcast support for a group of systems that want to communicate over the same network）。在设备无法原生地发送以多路访问网段上的所有设备为目的的数据包时，问题也就出现了。帧中继、ATM与ISDN默认就是非广播多路访问技术的实例。

所有这些技术都不具备支持广播的任何能力。这一点阻止了它们在其运作中运行那些用到广播的路由协议。在非广播网络中，原生的多播支持也是没有的。在某种路由协议情景下，参与的所有节点都必须接收到多播更新（In the case of a routing protocol, all the nodes that participate must receive Multicast updates）。对于使用非广播多路访问网络的这个问题，一种办法就是作为重复的单播数据包，来发送多播或广播数据包。在这种方式下，广播/多播帧，是单独地发送到拓扑中的各节点的。此场景中的变通部分，就是设备必须想办法找到一种解决`Layer 3`到`Layer 2`解析的办法。特定数据包必须投送到需要接收到它们的特定机器上。

接着这个`Layer 3`到`Layer 2`的解析问题的方法必须存在才行。`Layer 3`的地址通常是IP地址，而`Layer 2`的地址有通常根据所使用的技术而有所不同。在帧中继的情况下，`Layer 2`地址将由数据链路连接标识符（Data Link Connection Identifier, DLCI）编号构成，那么就必须找到一种将DLCI解析到IP地址的方法。

在广播网络的情况下，`Layer 3`的解析，使用MAC地址作为`Layer 2`的地址，且MAC地址也必须被解析到IPv4地址。这是通过地址解析协议（Address Resolution Protocol, ARP）完成的。在基于广播的网络中，设备通过指定其想要与其进行通信的设备（通常经由DNS学习到），及询问特定于那些设备的MAC地址，而广播出解析请求。对地址解析请求的响应，是经由单播并包含了所请求的MAC地址（In a Broadcast-based network, the devices broadcast the requests by specifying the devices it wants to communicate with(typically learned via DNS) and asking for the MAC addresses specific to those devices. The reply is via Unicast and includes the requested MAC addresses）。

在非广播多路访问环境中，仍需要将`Layer 3`地址（IP地址）绑定到`Layer 2`地址（数据链路连接标识符）。这可通过使用反向ARP的一种自动化方式完成（This can be done in an automated fashion using Inverse ARP）。此操作用于将远端的`Layer 3`地址解析到`Layer 2`地址，并仅用于本地。反向ARP可用在帧中继环境中。反向ARP作为一种在非广播多路复用环境中`Layer 3`到`Layer 2`解析的方案，问题在于其受限于直接连接的设备。这就造成在部分网状网络（partial-mesh networks，其中并非所有设备都是直接连接的）中的问题。

非广播多路服务的接口有两种 -- 多点与点对点接口，如下图41.2所示。多点接口要求某种`Layer 3`到`Layer 2`的解析方法。顾名思义，多点接口可作为多个`Layer 2`电路的端节点（As its name implies, it can be the termination point of multiple Layer 2 circuits）。

![非广播多路访问接口类型](images/4102.png)

*图 41.2 - 非广播多路访问接口类型*

在设备的主要物理接口上配置了帧中继时，那个接口将默认成为多点的。而在某个帧中继物理接口上创建了一个子接口时，创建它的选项，就意味着多点存在了（If a subinterface is created on a Frame Relay physical interface, the option of creating it as Multipoint exists）。对于物理接口与子接口（逻辑接口？），都必须配置上`Layer 3`到`Layer 2`的解析。在帧中继中，有两个选项来完成此解析：

- 反向ARP（Inverse ARP）
- 静态映射（Statically map）

`Layer 3`到`Layer 2`的解析，并不总是NBMA接口上的问题，因为可创建出点对点广域网接口（Point-to-Point WAN interfaces）。点对点接口仅能端接单个的`Layer 2`电路，因此在接口仅与单个设备通信时，`Layer 3`到`Layer 2`的解析就无必要。在只有一条电路上，进行通信的就只有一个`Layer 2`地址。在比如运行一个帧中继的点对点子接口，或一个ATM的点对点子接口时，`Layer 3`到`Layer 2`的解析问题会消失。

## 广域网组件（WAN Components）

广域网需要一些物理组件，来建立连接（WAN requires a number of physical components to enable a connection）。依据所使用的连接类型（比如ISDN、ADSL、帧中继、长租线路等）与其它因素，诸如后备连接与传入网络数目等，这些组件会有所不同。

![基本的广域网组件](images/4103.png)

*图 41.3 - 基本的广域网组件*

上图41.3展示了一个基本的接到ISP的串行连接（Figure 41.3 above shows a basic serial connection going out to an ISP）。作为用户，要负责数据终端设备（Data Terminal Equipment, DTE），也就是接受传入链路的用户路由器接口。用户还将负责连接到用户的信道服务单元/数据业务单元（Channel Service Unit(CSU)/Data Service Unit(DSU)）的电线，CSU/DSU将用户数据转换成ISP可传输的格式。CSU/DSU通常已被内建到用户路由器的WAN接口卡（WAN interface card, WIC）中。上图中的CPE为客户驻地设备（Customer Premise Equipment, CPE），由用户负责。

从这一点开始，通常就是ISP或电信公司来负责连接了。它们铺设电缆并提供将数据在其网络上传输的交换站（From this point on, your ISP or Telco is usually responsible for the connection. They lay the cables and provide switching stations, which transport the data across their network）。ISP保有作为（连接）末端、提供时钟的数据通信设备（Data Communication Equipment, DCE），所谓时钟，指的是在线路上数据可以何种速率进行传递。

常见的广域网连接类型包含下面这些：

- 长租线路 - 7x24小时可用的专用连接（Leased-line - a dedicated connection available 24/7）
- 电路交换 - 在需要时建立连接（Circuit-switching - set up when required）
- 包交换 - 共享链路/虚拟电路（Packet-switching - shared link/virtual circuit）

用户所购买的连接类型，取决于其需求与预算。在可承担专线费用时，就将有着带宽的独占性使用，同时安全问题也较少。而共享连接则意味着高峰时段连接速度较慢（A shared connection can mean a slower connection during peak times）。

## 广域网的协议（WAN Protocols）

常见的广域网协议包括点对点协议（Point-to-Point Protocol, PPP）、高级别数据链路控制协议（High-level Data Link Control，HDLC）与帧中继协议（Frame Relay）。当然也有许多其它协议，只是这里需要重点关注CCNA大纲中所包含的这三个协议。

点对点协议（PPP）可用于思科设备连接到一台非思科设备时。PPP同样具备包含认证的优势。其可在多种连接类型，包括数字订户线路（DSL）连接、电路交换连接以及异步/同步连接等上使用。

思科的高级数据链路控制（High-level Data Link Control, HDLC）是思科对开放标准HDLC的实现。HDLC需要数据终端设备（DTE）与数据通信设备（DCE），并是思科路由器（串行接口）上默认的封装类型。为对链路状态进行检查，会从DCE发出保持活动报文（注：保持活动报文是由一台设备往另一台设备发送的，用于检查二者之间运作，或阻止链路破坏的报文）。

如同早前所讨论的，帧中继是一种近年来以日渐式微的包交换技术，因为数字订户链路接入已成为相较帧中继更为经济及更可行的WAN连接方式。帧中继工作在从`56Kbps`到`2Mbps`的速度上，并在每次连接需要时，建立起虚拟电路。没有将安全考量构建到帧中继中（不过请参阅下面Farai的补充内容）。后面将详细介绍到帧中继。

> Farai先生谈到 -- “虽然帧中继可以使用按需创建的交换虚拟电路（Switched Virtual Circuits, SVCs），但其一般使用总是存在的永久虚拟电路（Permanent Virtual Circuits, PVCs）。永久虚拟电路是虚拟专用网络的一种（a type of Virtual Private Network(VPN)）。不过有人在帧中继上运行PPP，从而实现帧中继连接的PPP安全性。”

## 城域以太网（Metro Ethernet）

城域以太网（Metro Ethernet）技术涉及在城域网上运营商以太网的运用（Metro Ethernet technologies involve the use of carrier Ethernet in Metropolitan Area Networks(MANs)）。城域以太网可将公司局域网或个人终端用户连接到广域网或互联网。公司通常使用城域以太网将其分支机构连接到内部网（Companies often use Metro Ethernet to connect branch offices to an intranet）。

典型的城域以太网部署，通常采用铜缆或光缆，使用以互联的网络节点的星形或网状拓扑（A typical Metro Ethernet deployment uses a star or a mesh topology with interconnected network nodes using copper or fibre optic cables）。在城域以太网部署中采用标准及广泛应用的以太网技术，与同步光网络（Synchronous Optical Networking, SONET）/同步数字体系（Synchronous Digital Hierarchy，SDH），或多协议标签交换（Multi-Protocol Label Switching, MPLS）相比，可提供到诸多优势：

- 较少的成本（Less expensive）
- 更容易部署（Easier to implement）
- 更易于管理（Easier to manage）
- 因为其使用了标准的以太网方法，故易于连接客户设备（Easy to connect customer equipment because it uses the standard Ethernet approach）

典型的城域网，可在接入/聚合/核心标准设计（一种思科的设计模式，the access/aggregation/core standard design,）下进行结构化，如下所示：

- 接入层 - 通常位于客户驻地处。这一层可能包含一台办公室路由器或家用网关（Access Layer -- usually at the customer's premises. This may include an office router or residential gateway）。
- 聚合层 - 通常由微波、数字订户线路（DSL）技术或点对点以太网链路等构成（Aggregation Layer -- usually comprises microwave, DSL technologies, or Point-to-Point Ethernet links）。
- 核心层 - 可能使用多协议标签交换技术来对不同城域网进行互联（Core Layer -- may use MPLS to interconnect different MANs）。

在城域网中，以使用实现数据包区分的以太网VLAN标签的方式，客户流量隔离通常得以确保（Customer traffic separation is usually ensured in a MAN by using Ethernet VLAN tags that allow the differentiation of packets）。

## 甚小口径终端（VSAT）

甚小口径终端（Very Small Aperture Terminal, VSAT）技术，是一种基于无线卫星技术的电讯系统。甚小口径终端是由小型卫星地球站与一个典型的天线构成，如下图41.4所示：

![卫星通信](images/4104.png)

*图 41.4 - 卫星通信*

典型的甚小口径终端，其组件包括下面这些：

- 主地球站（Master earth station）
- 远端地球站（Remote earth station）
- 卫星

主地球站是整个VSAT网络的网络控制中心。于主地球控制站于完成整个网络的配置、管理与监测。

远端地球站则是安装在客户驻地的硬件设备，包含以下这些：

- 室外单元（outdoor unit, ODU）
- 室内单元（indoor unite, IDU）
- 连接电缆（interfacility link, IFL）

VSAT卫星环绕全球，从地球站接收信号并将信号发送给地球站（The VSAT satellite orbits round the globe and receives and transmits signals from and to the earth stations）。

VSAT网络可以下面的拓扑之一进行配置：

- 星形拓扑（Star topology）
- 网状网络（Mesh topology）
- 星形网状拓扑（Star-mesh topology）

使用卫星技术来确保WAN的连通性，一般要比使用传统的地面网络连接要昂贵（Using satellite technology to ensure WAN connectivity is generally more expensive than using a traditional terrestrial network connection）。此类连接所提供到的速度可达`5Mbps`的下载与`1Mbps`的上传，对于远端站点这通常是足够的。

使用卫星连通性的一个显著不足，就是流量延迟的增加，延迟可达单向（天线到卫星或卫星到天线）`250ms`，这是由于在极远距离上无线电信号的使用造成的。在规划安装卫星广域网连接时，延迟就应予以仔细分析，因为延迟增加可能导致那些对延迟敏感的应用停摆，当然对其它应用并没有什么影响。

使用卫星连通性的另一挑战，就是卫星碟形天线必须要有到卫星的视线（Another challenge of using satellite connectivity is that the satellite has to have line of sight to the satellite）。这就意味着必须使用高频范围（`2GHz`），同时任何的干扰（如像是下雨或暴风云等自然现象），都将对连接的吞吐能力与可用性造成影响。

## `T1`/`E1`

`T1`与`E1`的广域组网标准已存在相当长时间了。`T1`代表T-载波级别1（T-carrier Level 1，`T1`），其为一条使用了基于时间的、与不同信道相关的数字信号的市分复用的线路（a line that uses Time Division Multiplexing with digital signals associated with different channels based on time）。`T1`使用`24`个分立信道、运行在`1.544Mbps`的线路传输速率，那么每个单独信道分配的就是`64Kbps`（`T1` operates using `24` separate channels at a `1.544Mbps` line rate, thus allocating `64Kbps` per individual channel）。这`24`个信道可以想怎么用就怎么用，设置可根据需要从服务提供商那里只购买其中的几个信道。笼而统之，可将一条`T1`连接，看作是一个有着`24`条分立线路的中继/捆绑（In general terms, consider a `T1` connection as a trunk/bundle carrying `24` separate lines）。在以下地区，`T1`作为一项经常使用的标准：

- 北美
- 日本
- 韩国

`E1`（E-载波级别1）是一种与`T1`类似的标准，不过仅在欧洲使用。`E1`与`T1`的主要区别在于，`E1`使用了`32`个信道，而不是`24`个，这些信道仍然运行在`64Kbps`，因此提供到共计`2.048Mbps`的线路速率。与`T1`一样，`E1`也是基于时分复用的，因此二者之间的所有其它功能都一样。

## `T3`/`E3`

`T3`/`E3`标准提供到相较它们的`T1`与`E1`前辈更高的带宽。`T3`表示T-载波级别3（T-carrier Level 3），且是一种通常基于同轴电缆与BNC连接器（英语：Bayonet Neill-Concelman，直译为“尼尔-康塞曼卡口”）的连接类型。这一点与通过双绞线介质进行提供的`T1`有所不同。

`T3`连接通常被称为`DS3`连接，而`DS3`连接则与在`T3`线路上所传递的数据有关。因为`T3`使用相当于`28`条的`T1`电路，也就是`672`个`T1`信道，从而提供到额外的吞吐量。这就提供了总共`44.736Mbps`的线路速率。

`E3`除了等价于`16`条的`E1`电路，也就是`512`个`E1`信道，及总计`33.368Mbps`的线路速率外，`E3`连接与那些`T3`类似。

因为`T3`/`E3`提供了在需要是增加吞吐总量的能力，因此`T3`/`E3`连接通常用在大型数据中心里。



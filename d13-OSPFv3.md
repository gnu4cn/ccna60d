#第13天

**OSPF版本3**

##第13天任务

- 阅读今天的理论课文
- 回顾昨天的理论课文

今天我们要着眼于OSPFv3, 这里将学习要下面的知识。

- OSPF基础

本模块对应了以下CCNA大纲要求。

- 配置OSPFv3
- 路由器ID
- 被动接口

##OSPF第3版

**OSPF Version 3**

`OSPFv3`定义在`RFC 2740`中，而其功能与`OSPFv2`相同，不过`OSPFv3`显式地是为IPv6路由协议设计（OSPFv3 is defined in RFC 2740 and is the counterpart of OSPFv2, but it is designed explicitly for the IPv6 routed protocol）。该版本号取自此种OSPF数据包中的版本字段，该字段已被更新到数字`3`. `OSPFv3`规格主要是基于`OSPFv2`, 但因为加入对IPv6的支持，而包含了一些额外功能增强。

`OSPFv2`和`OSPFv3`能在同一台路由器上运行。也就是说，同一台物理路由器可同时路由IPv4和IPv6流量，因为每个地址家族都有不同的SPF进程；这就是说，同样SPF算法对`OSPFv2`和`OSPFv3`分别有一个单独实例。`OSPFv2`和`OSPFv3`有以下共同点。

- `OSPFv3`继续使用着为`OSPFv2`所用到的那些数据包。包括数据库说明数据包（Database Description, DBD）, 链路状态请求数据包（Link State Requests, LSRs），链路状态更新数据包（Link State Updates, LSUs）, 以及链路状态通告数据包（Lins State Advertisements, LSAs）
- `OSPSv3`中的动态邻居发现机制及邻接关系形成过程（OSPF所经历的从初始、尝试建立邻接关系到邻接关系完整建立的过程），仍然和`OSPFv2`中一样
- 在不同通信技术方面，`OSPFv3`仍然保持对RFC的遵循（OSPFv3 still remains RFC-compliant on different technologies）。比如，若在某条PPP链路上开启`OSPFv3`, 那么组网类型仍然被指定为点对点（Point-to-Point）。同样，如在FR上开启`OSPFv3`, 默认组网类型仍然是非广播类型（Non-Broadcast）。此外，在思科IOS软件中，默认组网类型仍可通过使用不同的、特定于接口的命令，手动进行改变。
- `OSPFv2`和`OSPFv3`使用同样的LSA散布及老化机制（the same LSA flooding and aging mechanism）.
- 与`OSPFv2`类似，`OSPFv3`的路由器ID（rid）仍然需要使用一个`32`位的IPv4地址。当在某台运行着双栈（dual-stack, 也就是同时有IPv4和IPv6）的路由器上开启`OSPFv3`时， 那么与在`OSPFv2`中为思科IOS路由器所用到的同样RID选定过程，也用于确定OSPFv3中要用到的路由器ID。但是，在一台没有接口运行着IPv4的路由器上开启`OSPFv3`时，就**强制性要求使用路由器配置命令`router-id`来手动配置`OSPFv3`的路由器ID**。
- `OSPFv3`链路ID表明，这些链路并非IPv6专用，同时这些链路ID跟`OSPFv2`中一样，仍然基于一个`32`位IPv4地址。

在`OSPFv2`与`OSPFv3`有着这些相同点的同时，重要的是掌握那些你必须熟悉的存在的明显不同点。包括下面这些。

- 以与EIGRP类似的方式，`OSPFv3`是在链路上运行的（in a manner similar to EIGRP, OSPFv3 runs over a link）。这就打消了`OSPFv3`中执行网络声明语句的需求。取而代之的是，**通过使用接口配置命令`ipv6 router ospf [process id] area [area id]`，来将该链路配置为某个OSPF进程的组成部分**。但是，与`OSPFv2`类似，OSPF进程号仍然是通过在全局配置模式中，使用全局配置命令`ipv6 router ospf [process id]`进行指定。
- **`OSPFv3`使用本地链路地址（Link-local address）来区分`OSPFv3`邻接关系**。与EIGRPv6类似，`OSPFv3`路由的下一跳地址将反映邻接的或邻居路由器的本地链路地址。
- `OSPFv3`**引入了两种新的OSPF LSA类型**。分别是**链路LSA**（the Link LSA），被定义为LSA类型`0x0008`(LSA `Type 0x0008`，或LSA Type 8）, 以及**区域内前缀LSA**（the Intra-Area-Prefix LSA），被定义为LSA类型`0x0029`(LSA `Type 0x0029`, 或LSA Type 29）。**链路LSA提供了路由器的本地链路地址，及加诸路由器上的所有IPv6前缀**。每条链路都有一个链路LSA。可能有多个带有不同**链路状态IDs**的区域内前缀LSAs。因此，区域LSA散布范围就既可能是与应用自网络LSA的所经过网络的相关前缀网络，也可能是参考自路由器LSA的某台路由器或末梢区域相关前缀（There can be multiple Intra-Area-Prefix LSAs with different Link-State IDs. The Area flooding scope can therefore be an associated prefix with the transit network referencing a Network LSA or it can be an associated prefix with a router or Stub referencing a Router LSA）。
- `OSPFv2`与`OSPFv3`所用到的传输方式是不同的。`OSPFv3`报文是用（封装成）IPv6数据包发出的。
- `OSPFv3`使用两个标准IPv6多播地址。多播地址`FF02::5`与`OSPFv2`中用到的所有SPF路由器（AllSPFRouters）地址`224.0.0.5`等价，同时多播地址`FF02::6`就是所有DR路由器（AllDRRouters）地址，且与OSPFv2中用到的`224.0.0.6`组地址等价。（这将在ICND2部分讲到）。
- `OSPFv3`利用到IPv6内建的`IPSec`的能力，并将AH和ESP扩展头部用着一种的认证机制，而不是想在`OSPFv2`中可配置的为数众多的认证机制（OSPFv3 leverages the built-in capabilities of IPSec and uses the AH and ESP extension headers as an authentication mechanism instead of the numerous authentication mechanisms configurable in OSPFv2）。因此，在`OSPFv3`的OSPF数据包中，那些认证和AuType字段就被移除了。
- 最终的最后一个明显区别就是，`OSPFv3` `Hello`数据包现在不包含任何地址信息，而是包含了一个接口ID，该接口ID是发出`Hello`数据包路由器分配的，用于对链路做其接口的唯一区分。此接口ID成为网络LSA（the Network LSA）的链路状态ID（Link State ID）, 判断该路由器是否应成为该链路上的指定路由器（This interface ID becomes the Network LSA's Link State ID, should the router become the Designated Router on the link）。

##思科IOS软件的OSPFv2和OSPFv3配置差异
 
**Cisco IOS Software OSPFv2 and OSPFv3 Configuration Differences**

在思科IOS软件中，配置OSPFv2与OSPFv3时有着一些配置差异。但应注意到，这些区别与其它路由协议的IPv4和IPv6版本的差异相比，并不那么显著。

在思科IOS软件中，通过使用全局配置命令`ipv6 router ospf [process id]`，来开启OSPFv6。和OSPFv2中的情况一样，OSPF进程ID是对路由器本地有效的，并不要求其在邻接路由器上为建立邻接关系保持一致。

> **译者总结:** 邻居路由器要形成邻接关系，要求：1. 区域号一致；2. 认证一直；3. Hello包、死亡间隔时间直一致；不要求：进程号一致。Hello数据包用于动态邻居发现和形成邻接关系，因此Hello数据包包含上述要求的参数，不包含不要求的参数。只有形成了邻接关系，才能开始发送和接受LSAs。

与EIGRPv6（将在ICND2中涵盖）所要求的一样，OSPFv3的路由器ID也必须予以手动指定，或配置成一个带有IPv4地址的运行接口（比如一个环回接口）。与EIGRPv6类似，在启用OSPFv3时，是没有网络命令的（网络宣告，network statement）。取而代之的是，OSPF的启用，是基于各个接口的，且在同一接口上可开启多个OSPFv3实例（similar to EIGRPv6, there are no network commands used when enabling OSPFv3. Instead OSPFv3 is enabled on a per-interface basis and multiple instances may be enabled on the same interface）。

最后，当**在诸如FR及ATM这样的NBMA网络上配置OSPFv3时，是在指定接口下，使用接口配置命令`ipv6 ospf neighbor [link local address]`，来指定邻居声明语句（the neighbor statements）。而在OSPFv2中，这些语句会是在路由器配置模式中配置的**。

> **注意：** 当在NBMA传输技术上配置OSPFv3时，应该使用本地链路地址来创建出静态FR地图声明语句（static Frame Relay map statements）。这是因为正是使用本地链路地址，而不是全球单播地址，建立邻接关系。比如，为给一个FR部署创建一幅静态FR地图语句并指定一台OSPF邻居路由器，就要在该路由器上应用下面的配置（在ICND2部分将对FR进行讲解）。

```
R1(config)#ipv6 unicast-routing
R1(config)#ipv6 router ospf 1
R1(config-rtr)#router-id 1.1.1.1
R1(config-rtr)#exit
R1(config)#interface Serial0/0
R1(config-if)#frame-relay map ipv6 FE80::205:5EFF:FE6E:5C80 111 broadcast
R1(config-if)#ipv6 ospf neighbor FE80::205:5EFF:FE6E:5C80
R1(config-if)#exit
```

###思科IOS软件中OSPFv3的配置和验证

**Configuring and Verifying OSPFv3 in Cisco IOS Software**

接着上一部分，上部分强调了OSPFv2和OSPFv3之间配置差异，那么这部分就要过一遍那些在思科IOS软件中开启和验证OSPFv3功能及路由的步骤。在思科IOS软件中，需要依序采行下面这些步骤，来开启OSPFv3路由。

1. 使用全局配置命令`ipv6 unicast-routing`，来全局性地开启IPv6路由。在思科IOS软件中，IPv6路由默认是关闭的。
2. 使用全局配置命令`ipv6 router ospf [process ID]`, 配置一或多个的OSPFv3进程。
3. 如路由器上没有配置IPv4地址的运行接口，就要使用路由器配置命令（router configuration command）`router-id [IPv4 Address]`， 手动配置OSPFv3路由器ID（Router ID，RID）。
4. 在需要的接口上（on the desired interfaces），使用接口配置命令`ipv6 address`及`ipv6 enable`, 对这些接口开启IPv6。
5. 使用接口配置命令`ipv6 ospf [process ID] area [area ID]`，在接口下开启一或更多的OSPFv3进程。

第一个基础多区域OSPFv3配置示例，建立在下图13.1所演示的拓扑之上。

![在思科IOS软件中配置基本多区域OSPFv3](images/1301.png)

*图13.1 -- 在思科IOS软件中配置基本多区域OSPFv3*

依之间所讲到的顺序配置步骤，照下面这样，在路由器`R1`上就会配置上OSPFv3。

```
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

而按照同样顺序的步骤，像下面这样在路由器`R3`上配置好OSPFv3路由。

```
R3(config)#ipv6 unicast-routing
R3(config)#ipv6 router ospf 3
R3(config-rtr)#router-id 3.3.3.3
R3(config-rtr)#exit
R3(config)#interface FastEthernet0/0
R3(config-if)#ipv6 address 3fff:1234:abcd:1::3/64
R3(config-if)#ipv6 enableR3(config-if)#ipv6 ospf 3 Area 0
R3(config-if)#exit
R3(config)#interface Loopback0
R3(config-if)#ipv6 address 3fff:1234:abcd:2::3/128
R3(config-if)#ipv6 address 3fff:1234:abcd:3::3/128
R3(config-if)#ipv6 enable
R3(config-if)#ipv6 ospf 3 Area 1
R3(config-if)#exit
```

依据上述两台路由器上OSPFv3的配置，就可以使用命令`show ipv6 ospf neighbor`, 来检查OSPFv3的邻接状态，在`R1`上如下所示。

```
R1#show ipv6 ospf neighbor
Neighbor	ID Pri	State 		Dead Time	Interface ID 	Interface
3.3.3.3		     1	FULL/BDR 	00:00:36 	4 				FastEthernet0/0
```

通过将`[detail]`关键字追加到本命令的后面，还可以查看详细的邻居信息。

```
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

在上面的输出中，注意真实的邻居地址是本地链路地址，而不是所配置的全球IPv6单播地址。
 
##第13天问题

1. Both OSPFv2 and OSPFv3 can run on the same router. True or false?
2. OSPFv2 and OSPFv3 use different LSA flooding and aging mechanisms. True or false?
3. Which is the equivalent of `224.0.0.5` in the IPv6 world?
4. As is required for EIGRPv6, the router ID for OSPFv3 must be either specified manually or configured as an operational interface with an IPv4 address. True or false?
5. Which command would you use to enable the OSPFv3 routing protocol?
6. Which command would you use to specify an OSPFv3 neighbour over an NBMA interface?
7. Which command would you use to see the OSPFv3 LSDB?
8. A significant difference between OSPFv2 and OSPFv3 is that the OSPFv3 Hello packet now contains no address information at all but includes an interface ID, which the originating router has assigned to uniquely identify its interface to the link. True or false?
 
##第13天答案
 
1. True.
2. False.
3. `FF02::5`.
4. True.
5. The `ipv6 router ospf <id>`
6. The `ipv6 ospf neighbor`
7. The `show ipv6 ospf database`
8. True.

##第13天实验
 
###OSPFv3基础实验
 
重复第`12`天的实验场景（两台路由器直连，各自又有环回接口），但以配置IPv6地址并在设备间使用OSPFv3对这些地址进行通告，取代配置IPv4的OSPF。

- 给直连接口分配上IPv6地址（`2001:100::1/64`及`2001:100::2/64`）
- 用`ping`测试直接连通性
- 在两台路由器上分别配置一个环回接口，并从两个不同范围分配地址（`2002::1/128`及`2002::2/128`）
- 配置标准的OSPFv3 `1`号进程并将所有本地网络在`0`号区域进行通告。同时为各设备配置一个路由器ID。

**R1:**

```
ipv6 router ospf 1
router-id 1.1.1.1
int fa0/0(或特定接口编号)
ipv6 ospf 1 area 0
int lo0(或特定接口编号)
ipv6 ospf 1 area 0
```

**R2:**

```
ipv6 router ospf 1
router-id 2.2.2.2
int fa0/0(或特定接口编号)
ipv6 ospf 1 area 0
int lo0(或特定接口编号)
ipv6 ospf 1 area 0
```

- 自`R1`向`R2`的IPv6环回接口发出`ping`操作，以测试连通性
- 执行一个`show ipv6 route`命令，来验证有通过OSPFv3接收到路由
- 执行一个`show ipv6 protocols`命令，来验证有配置OSPFv3且在设备上是活动的
- 执行命令`show ipv6 ospf interface`及`show ipv6 ospf interface brief`，检查接口特定于OSPF的那些参数
- 在两台路由器上（直连接口）修改`Hello`包和死亡计时器: `ipv6 ospf hello`及`ipv6 ospf dead`
- 执行一下`show ipv6 ospf 1`命令，来查看路由进程参数

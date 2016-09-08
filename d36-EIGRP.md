#第36天

**增强的内部网关路由协议**

**Enhanced Interior Gateway Routing Protocol, EIGRP**

##第36天任务

- 阅读今天的课文
- 复习昨天的课文
- 完成今天的实验
- 阅读ICND2记诵指南

增强的内部网关路由协议是一种有思科开发的专有的内部网关协议（a proprietary Interior Gateway Protocol(IGP) that was developed by Cisco）。EIGRP包含了那些传统的距离矢量特性，比如水平拆分（split horizon），还包含了与那些被链路状态路由协议所用到的类似特性，比如增量更新（EIGRP includes traditional Distance Vector characteristics, such as split horizon, as well as characteristics that are similar to those used by Link State routing protocols, such as incremental updates）。

尽管有着链路状态路由协议的一些特性，EIGRP是被分到距离矢量路由协议类别中的，被指为**一种高级的距离矢量路由协议**。EIGRP**直接在IP上运行，使用协议编号88**。

今天将学习以下内容：

- 思科公司EIGRP概述与基础知识, Cisco EIGRP overview and fundamentals
- EIGRP配置基础, EIGRP configuration fundamentals
- EIGRP的各种报文, EIGRP messages
- EIGRP的邻居发现与邻居维护, EIGRP neighbour discovery and maintenance
- 各种度量值、弥散更新算法（DUAL）与拓扑表，Metrics, DUAL, and the topology table
- 相等与不相等开销下的负载均衡，equal cost and unequal cost load sharing
- 采用EIGRP作为默认路由，default routing using EIGRP
- EIGRP网络中的水平分割
- EIGRP的存根路由，EIGRP stub routing
- EIGRP的路由汇总，EIGRP route summarisation
- 掌握被动接口，understanding passive interfaces
- 掌握EIGRP路由器ID的用法，understanding the use of the EIGRP router ID
- EIGRP的日志与报表，EIGRP logging and reporting

本课程对应了以下CCNA大纲要求：

- 配置并验证EIGRP（单一自治系统），configure and verify EIGRP(single AS)
- 可行距离/可行的后续路由/报告的距离/通告的距离分别是什么，Feasible Distance/Feasible Successor routes/Reported Distance/Advertised Distance
- 可行性条件，Feasiblity condition
- 度量值综合，Metric composition
- 路由器ID，Router ID
- 自动汇总，Auto summary
- 路径选择，path selection
+ EIGRP的负载均衡，load balancing
    - 开销一样时
    - 开销不同时
- 什么是EIGRP的被动接口，passive interfaces

##思科EIGRP概述与基础知识

为解决其先前专有的距离矢量路由协议，内部网关路由协议（Interior Gateway Routing Protocol, IGRP）的某些缺陷，思科公司就开发了EIGRP。IGRP相比路由信息协议（Routing Information Protocol, RIP），确实有着一些改进，比如对更多跳数的支持；但IGRP仍有着那些传统距离矢量路由协议的局限，这些局限如下所示：

- 发送完整的周期性路由更新，sending full periodic routing updates
- 跳数限制，a hop limitation
- 缺少对变长子网掩码的支持，the lack of VLSM support
- 收敛速度慢，slow convergence
- 缺少防止环回形成的机制，the lack of loop prevention mechanisms

与往邻居发送包含了所有路由信息的周期性路由更新的传统距离矢量路由协议不同，EIGRP发送的是非周期性的增量式路由更新，以将路由信息在整个路由域中分发（unlike the traditional Distance Vector routing protocols, which send their neighbours periodic routing updates that contain all routing information, EIGRP sends non-periodic incremental routing updates to ditribute routing information throughout the routing domain）。只有在网络拓扑发生变化时，才会发送EIGRP的增量更新。

默认RIP（一种以前的CCNA考试项目）有着15的跳数限制，这就令到RIP只适合与较小的网络。EIGRP默认跳数限制为100; 但此数值可被管理员在配置EIGRP时，使用路由器配置命令`metric maximum-hops <1-255>`, 予以手动调整。这就令到EIGRP具备对有着多达数百台路由器的网络的支持能力，使其具备了更大的可伸缩性，从而对较大型网络也是适合的。

增强的IGRP采用了两个独特的类型/长度/数值三联体数据结构来表示和传输路由条目（Enhanced IGRP uses two unique Type/Length/Value(TLV) triplets to carry route entries）。这两个TLVs分别是内部EIGRP路由TLV与外部EIGRP路由TLV， 分别用于内部及外部的EIGRP路由。两种TLVs都包含了一个8位的前缀长度字段（an 8-bit Prefix Length field）, 用于指明用于目的网络子网掩码的位数。包含在此字段中的该信息，就令到EIGRP能够支持不同的子网划分了。

增强的IGRP比起传统的距离矢量路由协议收敛得快得多。除了仅仅依赖于计时器，EIGRP还使用其拓扑表中的信息，来找出那些替代路径。EIGRP亦能在未能于本地路由器的拓扑表中找出替代路径的情况下，想邻居路由器查询信息。本课程模块后面会讲到EIGRP的拓扑表。

而为了确保整个网络中没有环回路径，EIGRP使用了弥散更新算法（Diffusing Update Algorithm, DUAL），使用此算法来对邻居通告的所有路由进行追踪，并随后选出到目的网络最优的无环回路径。弥散更新算法是EIGRP的一个核心概念，将在本课程模块的稍后讲到。

##EIGRP配置基础

**EIGRP Configuration Fundamentals**

在思科IOS软件中，是通过使用全局配置命令`router eigrp [ASN]`，来开启增强的IGRP的。关键字`[ASN]`指定EIGRP的自治系统编号（autonomous system number, ASN），这是一个32位整数，大小介于1-65535之间。除了本章后面将涉及的其它因素之外，**运行EIGRP的那些路由器都必须位处同一自治系统中**，以成功形成邻居关系。在全局配置命令`router eigrp [ASN]`之后, 路由器就转变为EIGRP路由器配置模式（EIGRP Router Configuration mode）了，在这里就可以对那些跟EIGRP有关的参数进行配置了。所配置的ASN，可在命令`show ip protocols`的输出中进行验证，如下面所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
...


[Truncated Output]
```

而除了`show ip protocols`命令，命令`show ip eigrp neighbours`会打印出所有EIGRP邻居，以及这些邻居各自自治系统的信息。该命令及其可用选项，将在本课程模块的后面进行详细讲解。在那些运行了多个EIGRP实例的路由器上，可使用`show ip eigrp [ASN]`命令，来查看只与在此命令中所指定的自治系统有关的信息。下面的输出演示了这个命令的使用：

```
R1#show ip eigrp 150 ?
  interfaces  IP-EIGRP interfaces
  neighbors   IP-EIGRP neighbors
  topology    IP-EIGRP topology table
  traffic     IP-EIGRP traffic statistics
```

在上面的输出中，150就是自治系统编号（ASN）。如`show ip eigrp`命令没有指定自治系统，那么在思科IOS软件中该命令默认将打印出所有EIGRP实例的信息。

而一旦处于路由器配置模式（Router Configuration mode），就要使用`network`命令，来指明要在哪些网络（接口上）开启EIGRP路由了（once in Router Configuration mode, the `network` command is used to specify the network(s) (interfaces) for which EIGRP routing will be enabled）。在使用`network`命令并指明了一个大的有类网络后，该启用了EIGRP的路由器将完成以下动作：

- 位处该指明的有类网络范围的那些网络上的EIGRP被开启，EIGRP is enabled for networks that fall within the specified classful network range.
- 利用这些直连子网，生成一个拓扑表，the topology table is populated with these directly connected subnets.
- 从这些子网相关的接口，发出EIGRP Hello 数据包，EIGRP Hello packets are sent out of the interfaces associated with these subnets.
- EIGRP将这些网络，经由更新报文，通告给EIGRP邻居，EIGRP advertises the network(s) to EIGRP neighbours in Update messages.
- 在报文交换的基础上，EIGRP的那些路由，此时就被加入到IP路由表中，Based on the exchange of messages, EIGRP routes are then added to the IP routing table.

如EIGRP已开启使用，且将路由器配置命令`network`与大的有类`10.0.0.0/8`网络一道进行了使用，同时**所有4个环回接口**（all four Loopback interfaces）又都开启了EIGRP路由的话，那么下面就给出了此种情况下`show ip eigrp interfaces`的输出演示：

```
R1#show ip eigrp interfaces
IP-EIGRP interfaces for process 150
                     Xmit Queue   Mean    Pacing Time    Multicast      Pending
Interface      Peers Un/Reliable  SRTT    Un/Reliable    Flow Timer     Routes
Lo0            0         0/0         0        0/10            0             0
Lo1            0         0/0         0        0/10            0             0
Lo2            0         0/0         0        0/10            0             0
Lo3            0         0/0         0        0/10            0             0
```

可使用`show ip protocols`命令，来对大的有类`10.0.0.0/8`网络上EIGRP的启用情况，进行验证。此命令的输出如下所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
    Redistributing: eigrp 150
    EIGRP NSF-aware route hold timer is 240s
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.0
    Routing Information Sources:
        Gateway         Distance    Last Update
    Distance: internal 90 external 170
```

使用命令`show ip eigrp topology`，可查看到EIGRP的拓扑表。此命令的输出如下所示：

```
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status
P 10.3.3.0/24, 1 successors, FD is 128256
        via Connected, Loopback3
P 10.2.2.0/24, 1 successors, FD is 128256
        via Connected, Loopback2
P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
```

> **注意**：本课程模块稍后会对拓扑表、EIGRP的Hello数据包及更新数据包进行详细讲解。本小节仅着重于EIGRP的配置实施（EIGRP configuration implementation）。

使用`network`命令来指明一个大的有类网络（a major classful network），就令到位于该有类网络中的多个子网，得以在最小配置下同时被通告出去。但可能存在管理员不想对某个有类网络中的所有子网，都开启EIGRP路由的情形。比如，参考前一示例中R1上所配置的环回接口，假设只打算对`10.1.1.0/24`及`10.3.3.0/24`子网开启EIGRP路由，而不愿在`10.0.0.0/24`及`10.2.2.0/24`开启EIGRP路由。那么很明显这在使用`network`命令时，对这些网络（也就是`10.1.1.0`及`10.3.3.0`）予以指明就可以做到，思科IOS软件仍会将这些语句，转换成大的有类`10.0.0.0/8`网络，如下所示：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0
R1(config-router)#network 10.3.3.0
R1(config-router)#exit
```

尽管有着上面的配置，但`show ip protocols`命令给出的确实下面的输出：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
    Redistributing: eigrp 150
    EIGRP NSF-aware route hold timer is 240s
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.0
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

> **注意**：一个常见的误解就是，关闭EIGRP的自动汇总特性，就能解决此问题；但是，这与`auto-summary`命令一点关系都没有。比如，假设对在前一示例中的配置执行了`no auto-summary`命令，如下所示：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0
R1(config-router)#network 10.3.3.0
R1(config-router)#no auto-summary
R1(config-router)#exit
```

`show ip protocols`命令仍将显示对网络`10.0.0.0/8`开启了EIGRP，如下面的输出所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
    Redistributing: eigrp 150
    EIGRP NSF-aware route hold timer is 240s
    Automatic network summarization is not in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.0
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

为了提供到对那些开启EIGRP路由的网络进行更细粒度的控制，思科IOS软件支持在对EIGRP进行配置，将通配符掩码与`network`语句一起配合使用（in order to provide more granular control of the networks that are enabled for EIGRP routing, Cisco IOS software supports the use of wildcard masks in conjunction with the `network` statement when configuring EIGRP）。这里的通配符掩码，以与ACLs中用到的通配符掩码类似的方式运作，而与网络的子网掩码是不相干的。

作为一个示例，命令`network 10.1.1.0 0.0.0.255`将匹配到网络`10.1.1.0/24`、`10.1.1.0/26`及`10.1.1.0/30`网络。参考上一输出中所配置的那些环回借口（the Loopback interfaces），为将R1配置为对`10.1.1.0/24`及`10.3.3.0/24`子网开启EIGRP路由，且不对`10.0.0.0/24`子网或`10.2.2.0`子网开启，就应将其如下面那样进行配置：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0 0.0.0.255
R1(config-router)#network 10.3.3.0 0.0.0.255
R1(config-router)#exit
```

使用命令`show ip protocols`，就可对此配置进行验证，如下所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
    Redistributing: eigrp 150
    EIGRP NSF-aware route hold timer is 240s
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.1.1.0/24
        10.3.3.0/24
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

此外，还可以使用命令`show ip eigrp interfaces`，确认到仅已对`Loopback1`与`Loopback3`开启了EIGRP路由：

```
R1#show ip eigrp interfaces
IP-EIGRP interfaces for process 150
                     Xmit Queue   Mean    Pacing Time    Multicast      Pending
Interface      Peers Un/Reliable  SRTT    Un/Reliable    Flow Timer     Routes
Lo1            0         0/0         0        0/10            0             0
Lo3            0         0/0         0        0/10            0             0
```

如上面所示，因为这里的通配符掩码配置，而仅在`Loopback1`和`Loopback3`上启用了EIGRP路由。

这里重要的是记住除了使用通配符掩码，也可以使用子网掩码来配置`network`命令。在此情况下，思科IOS软件将翻转子网掩码，而使用通配符掩码来保存该命令。比如，参照路由器上同样的环回借口，路由器R1也可被如下这样进行配置：

```
R1(config-router)#router eigrp 150
R1(config-router)#network 10.1.1.0 255.255.255.0
R1(config-router)#network 10.3.3.0 255.255.255.0
R1(config-router)#exit
```

基于此种配置，就在运行配置中输入了下面的参数（这里使用了管道（pipe），取得运行配置中感兴趣的部分）：

```
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
network 10.3.3.0 0.0.0.255
auto-summary
```

通过上面的配置可以看出，可与那些`show`命令一道运用管道，来获得更细的粒度。这对于那些有着编程知识的人来说，是一种熟悉的概念。

如将某个网络上的特定地址与通配符一起使用，那么思科IOS软件将执行一次逻辑与运算（a logical AND operation）, 从而确定出那个要启用EIGRP的网络。比如，在执行了`network 10.1.1.15 0.0.0.255`命令时，思科IOS软件会执行以下动作：

- 将通配符掩码翻转为子网掩码值`255.255.255.0`
- 执行一次逻辑与操作
- 将命令`network 10.1.1.0 0.0.0.255`加入到配置中

本示例中所用到的`network`配置，如下面输出所示：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.15 0.0.0.255
R1(config-router)#exit
```

那么基于此配置，路由器上的运行配置，就会显示如下内容：

```
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
auto-summary
```

如上面的配置所示，不管是使用通配符子网掩码，还是子网掩码，都会在思科IOS软件中造成同样的操作，并得到同样的`network`语句配置。

> **真实世界的部署**

> 当在生产网络中对EIGRP进行配置时，**一般做法都是使用全0的通配符掩码或全1的子网掩码**。比如，`network 10.1.1.1 0.0.0.0`及`network 10.1.1.1 255.255.255.255`，两个命令都会执行同样的动作。全0的通配符掩码或全1的子网掩码的使用，就将思科IOS软件配置为与一个具体接口地址进行匹配，而不考虑在接口本身上所配置哦子网掩码了。这两个命令都会匹配到配置了比如`10.1.1.1/8`、`10.1.1.1/16`、`10.1.1.1/24`, 以及`10.1.1.1/30`等地址的接口。这些命令的用法如下面的输出所示：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.0.0.1 0.0.0.0
R1(config-router)#network 10.1.1.1 255.255.255.255
R1(config-router)#exit
```

`show ip protocols`命令将验证到路由器对于两个`network`语句，都是以相似的方式进行处理的，如下所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
    Outgoing update filter list for all interfaces is not set
    Incoming update filter list for all interfaces is not set
    Default networks flagged in outgoing updates
    Default networks accepted from incoming updates
    EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
    EIGRP maximum hopcount 100
    EIGRP maximum metric variance 1
    Redistributing: eigrp 150
    EIGRP NSF-aware route hold timer is 240s
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.1/32
        10.1.1.1/32
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

在使用了全1的子网掩码或全1的通配符掩码时，就会在所指定的（匹配的）接口上开启EIGRP，同时将通告那个接口所位处的网络。也就是说，EIGRP不会通告上面输出中的`/32`地址，而是通告基于配置在匹配接口上的子网掩码的具体网络。此配置的用法，是独立于配置在匹配的具体接口上的子网掩码的（when a subnet mask with all ones or a wildcard mask with all zeros is used, EIGRP is enabled for the specified(matched) interface and the network the interface resides on is advertised. In other words, EIGRP will not advertise the /32 address in the above but, instead, the actual network based on the subnet mask configured on the matched interface. The use of this configuration is independent of the subnet mask configuration on the actual interface matched）。


## EIGRP的各种报文

本小节将对EIGRP所用到的各种类型的报文进行说明。但是，在深入到各种不同报文类型前，首要的是对EIGRP数据包头部有扎实的掌握，这正是包含这些报文的地方。

###EIGRP数据包的头部

尽管对EIGRP数据包格式的具体了解，是超出CCNA考试要求的，但对EIGRP数据包头部的基本掌握，对于完整理解EIGRP这种路由协议的完整运作的，是很重要的。下图36.1对EIGRP数据包头部进行了演示：

![EIGRP数据包头部的各种字段](images/3601.png)
*图 36.1 -- EIGRP数据包头部的各种字段*

在EIGRP数据包头部，其中的4位版本字段（the 4-bit Version field）用于表面该协议的版本。当前的思科IOS镜像都支持EIGRP版本`1.x`。后面的4为OPcode字段（the 4-bit OPCode field），则指定了EIGRP数据包或报文的类型。不同EIGRP数据包类型都被分配了一个唯一的OPcode数值，以将其与其它数据包类型进行区分。本课程模块后面会对这些报文类型进行说明。

而那个24位的校验和字段（the 24-bit Checksum field）, 是用于对该EIGRP数据包做完整性检查的（a sanity check）。该字段是给予完整的EIGRP数据包的, 而不包括IP头部。32位的标志字段（the 32-bit Flags field），用于表明该EIGRP数据包或报文是一个新的EIGRP邻居的`INIT`, 还是EIGRP的可靠传输协议（Reliable Transport Protocol, RTP）的有条件接受（the Conditional Receive, CR）的`INIT`。这里的RTP及CR都将在本课程模块稍后讲到。

后面的32为顺序字段（the 32-bit Sequence field）指定了EIGRP可靠传输协议所用到的顺序编号（the sequence number），用以可靠数据包的顺序投送。而32位的确认字段（the 32-bit Acknowledgment field），则被用于EIGRP可靠数据包的接收确认。

后面的32位自治系统编号字段（the 32-bit Autonomous System Number field）, 指定了该EIGRP域（the EIGRP domain）的自治系统编号（ASN）。最后的32为类型/长度/值三联体字段（the 32-bit Type/Length/Value(TLV) triplet field），就被用于路由条目的加载及EIGRP弥散更新算法信息的提供了。EIGRP支持几种不同类型的TLVs，最常用的是下面几种：

- 参数TLV, 有着建立邻居关系的那些参数，the Parameters TLV, which has the parameters to establish neighbour relationships
- 顺号TLV，RTP使用的TLV，the Sequence TLV, which is used by RTP
- 下一次多播序号TLV，RTP使用的TLV

> **注意**：并不要求对EIGRP的各种TLVs有详细了解。

下图36.2演示了一个抓包到的EIGRP数据包的所呈现的不同字段：

![EIGRP数据包头部的抓包](images/3602.png)
*图 36.2 -- 对EIGRP数据包头部的抓包*

在该EIGRP数据包头部，4位的OPCode字段被用于指定该EIGRP数据包或报文的类型。EIGRP使用到不同的报文或数据包类型，包括Hello数据包、确认数据包（Acknowledgment packets）、更新数据包（Update packets）、查询数据包（Query packets）、应答数据包（Reply packets）以及请求数据包（Request packets）。将在随后的小节对这些类型的数据包进行说明。

###Hello数据包

在某台路由器上对某个特定网络开启了增强的IGRP后，其就会发送Hello数据包（Enhanced IGRP sends Hello packets once it has been enabled on a router for a particular network）。这些报文被用于邻居的识别，同时邻居一经识别，Hello报文就用于在邻居直接作为一种保持活动机制，发挥作用（these messages are used to identify neighbours and, once identified, serve or function as a keepalive mechanism between neighbours）。EIGRP的邻居发现与维护机制，将在本课程模块的后面进行说明。

EIGRP的Hello数据包，是发送到链路本地多播组地址（the Link Local Multicast group address）`224.0.0.10`上。由EIGRP发出的Hello数据包，是不需要发出确认数据包来确认其已收到的（Hello packets sent by EIGRP do not require an Acknowledgment to be sent confirming that they were received）。因为Hello数据包不需要显式的确认，所以它们被分类为不可靠的EIGRP数据包（Hello packets are classified as unreliable EIGRP packets）。EIGRP Hello数据包的OPCode为5。

###确认数据包

一个EIGRP确认数据包，简单地就是一个不包含数据的EIGRP Hello数据包。EIGRP使用确认数据包来对EIGRP数据包的可靠送达进行确认。这些确认数据包（the ACK packets）总是发送到一个单播地址（a Unicast address）, 该地址就是可靠数据包发送方的源地址（the source address of the sender of the reliable packet），而并不是EIGRP的多播组地址了。此外，确认数据包将总是会包含一个非零的确认编号（a non-zero acknowledgment number）。确认数据包使用了Hello数据包相同的OPCode, 因为其本来就是一个不包含任何信息的Hello数据包。其OPCode为5。

###更新数据包

增强IGRP的更新数据包被用于传送目标的可达性（used to convey reachability of destinations）。也就是说，更新数据包包含了EIGRP的路由更新。在发现了一个新的邻居是，就会通过单播发出更新数据包（往该新的邻居），如此新的邻居就能够建立起自己的EIGRP拓扑表了。在其它比如某条链路的开销改变时，就会经由多播发出更新数据包。重要的是记住更新数据包都是可靠地传输的，且总是要求显式的确认。**分配给更新数据包的OPCode是1**。下图36.3演示了一个EIGRP的更新数据包：

![EIGRP的更新数据包](images/3603.png)
*图 36.3 -- EIGRP的更新数据包*

> **注意**：并不要求对EIGRP各种数据包中的所包含的信息有深入了解。

###查询数据包

增强IGRP的查询数据包是多播的，并被用于请求可靠的路由信息。EIGRP的查询数据包是在某条路由不可用，但该路由器却需要为快速收敛而对该路由的状态进行应答时，发送给其邻居的数据包。如发出查询数据包的路由器未能从其所有邻居收到响应，其就会再度向那些未响应的邻居发出一次查询。如在16此尝试后都没有响应，那么EIGRP的邻居就被重置。本课程模块后面将对此概念进行更为深入的说明。**分配给EIGRP查询数据包的OPCode为3**。

###应答数据包

**Reply Packets**

增强IGRP的应答数据包是作为对查询数据包的响应发送的。应答数据包用于响应一个查询数据包。应答数据包是到查询发起方的单播数据包。**分配给EIGRP应答数据包的OPCode为4**。

###请求数据包

增强IGRP的请求数据包，是用于从一个或多个邻居处获取特定信息的，且是在一些路由服务器应用中用到的（used in roue server applications）。这些数据包既可通过单播、也可通过多播进行发送，但它们总是以不可靠方式传输的。也就是说，它们无需显式的确认。

> **注意**：尽管这里的Hello数据包和确认数据包是作为两种独立的数据包类型的，但重要的是记住在某些课本中，EIGRP的Hello数据包与确认数据包被认为是同一中类型的数据包。这是因为，正如在本小节中指出的那样，确认数据包就是不包含数据的Hello数据包。

命令`debug eigrp packets`可用于本小节中所讲到的各种不同EIGRP数据包的实时调试信息。要知道此命令还包括了一些这里并没有说到的其它数据包，因为这些其它类型的数据包是超出了当前CCNA考试要求的。下面的输出对此命令的用法进行了演示：

```
R1#debug eigrp packets ?
  SIAquery  EIGRP SIA-Query packets
  SIAreply  EIGRP SIA-Reply packets
  ack       EIGRP ack packets
  hello     EIGRP hello packets
  ipxsap    EIGRP ipxsap packets
  probe     EIGRP probe packets
  query     EIGRP query packets
  reply     EIGRP reply packets
  request   EIGRP request packets
  retry     EIGRP retransmissions
  stub      EIGRP stub packets
  terse     Display all EIGRP packets except Hellos
  update    EIGRP update packets
  verbose   Display all EIGRP packets
  <cr>
```

而`show ip eigrp traffic`命令，是用于对本地路由器所发送及接收到的EIGRP数据包的数量进行查看的命令。该命令同时还是一个强大的故障排除工具。比如，假设某路由器在发出Hello数据包，却并未收到任何回复，这就表明其尚未配置好预期的邻居，或者甚至有可能某个确认数据包阻塞了EIGRP数据包（For example, if the router is sending out Hello packets but is not receiving any back, this could indicate that the intended neighbour is not configured, or even that an ACK may be blocking EIGRP packets）。下面的输出对此命令进行了演示：

```
R2#show ip eigrp traffic
IP-EIGRP Traffic Statistics for AS 150
    Hellos sent/received: 21918/21922
    Updates sent/received: 10/6
    Queries sent/received: 1/0
    Replies sent/received: 0/1
    Acks sent/received: 6/10
    SIA-Queries sent/received: 0/0
    SIA-Replies sent/received: 0/0
    Hello Process ID: 178
    PDM Process ID: 154
    IP Socket queue: 0/2000/2/0 (current/max/highest/drops)
    Eigrp input queue: 0/2000/2/0 (current/max/highest/drops)
```

下表36.1对本小节中讲到的这些EIGRP的数据包进行了总结，以及各自是否以可靠或不可靠方式进行发送的：

*表 36.1 -- EIGRP数据包总结*

| 报文类型 | 说明 | 发送方式 |
| -- | -- | -- |
| Hello | 用于邻居发现、维护及保持存活 | 不可靠 |
| 确认数据包（Acknowledgment） | 用于对信息接收的确认 | 不可靠 |
| 更新数据包（Update） | 用于传达路由信息 | 可靠的 |
| 查询数据包（Query） | 用于请求指定的路由信息 | 可靠的 |
| 应答数据包（Reply） | 用于对查询数据包的响应 | 可靠的 |
| 请求数据包（Request） | 用于路由服务器应用中的信息请求 | 不可靠 |

##EIGRP的邻居发现与邻居维护

可将增强的IGRP配置为动态地发现相邻路由器（这是默认选项）（discover neighbouring routers dynamically），或者经由管理员手动配置来发现相邻路由器。下面的小节将对这两种方式，以及其它有关EIGRP邻居相关的话题，进行讨论。

###动态的邻居发现

动态的邻居发现，是通过往目的多播组地址（the destination Multicast group address）`224.0.0.10`, 发送EIGRP的Hello数据包完成的。动态邻居发现，又是紧跟着在路由器配置EIGRP时`network`命令的执行，而完成的。此外，如早先指出的那样，EIGRP数据包是直接透过IP、使用协议编号88发送的。下图36.4对此基本的EIGRP邻居发现与路由交换过程，进行了演示：

![EIGRP的邻居发现与路由交换](images/3604.png)
*图 36.4 -- EIGRP的邻居发现与路由交换，EIGRP Neighbour Discovery and Route Exchange*

参考图36.4, 在初始化时，这些EIGRP邻居便发出Hello数据包，以发现其它邻居（Referencing Figure 36.4, upon initialisation, the EIGRP neighbours send Hello packets to discover other neighbours）。随后这些邻居就通过完整更新，就其完整路由表进行交换。这些更新包含了所有已知路由的信息。因为更新包是可靠发送的，接收方就必须对其进行显式确认。

在这些邻居完成了它们的信息交换后，它们还将持续交换Hello数据包，以维护起邻居关系。除此之外，这些EIGRP邻居路由器此后就将仅发送增量更新了，通过增量更新来将其状态或路由变化，通告给它的邻居们。它们再也不会发送完整的更新给邻居们了。

明白仅简单地在两台或多台路由器上开启EIGRP，并不能确保邻居关系的建立，是重要的。而是还需一些参数要匹配，这样这些路由器才能成为邻居。在下面几种情况下，就不能建立EIGRP邻居关系：

- EIGRP认证参数不匹配（在有配置时），Mismatched EIGRP authentication parameters(if configured)
- EIGRP的那些K值不一致，Mismatched EIGRP K values
- EIGRP自治系统编号不一致，Mismatched EIGRP autonomous system number
- 在EIGRP邻居关系中，使用了接口的第二地址，Using secondary addresses for EIGRP neighbour relationships
- 邻居并不位于同一子网中，the neighbours are not on a common subnet

尽管`show ip eigrp neighbours`命令在动态与静态配置的邻居间没有区别，但**`show ip eigrp interfaces detail <name>` 命令却可以用于对路由器接口是否在发出多播数据包来发现和维护邻居关系，进行检查**。下面演示了在一台开启了动态邻居发现的路由器上该命令的输出：

```
R2#show ip eigrp interfaces detail FastEthernet0/0
IP-EIGRP interfaces for process 150
                      Xmit Queue   Mean   Pacing Time    Multicast      Pending
Interface      Peers  Un/Reliable  SRTT   Un/Reliable    Flow Timer     Routes
Fa0/0            1        0/0        1        0/1            50             0

  Hello interval is 5 sec
  Next xmit serial <none>
  Un/reliable mcasts: 0/2  Un/reliable ucasts: 2/2
  Mcast exceptions: 0  CR packets: 0  ACKs suppressed: 0
  Retransmissions sent: 1  Out-of-sequence rcvd: 0
  Authentication mode is not set
  Use multicast
```

> **注意**：`show ip eigrp neighbours`命令将在后面讲到。在查看`show ip eigrp interfaces detail <name>`命令的输出时，要注意因为EIGRP同时用到多播及单播数据包（both Multicast and Unicast packets），所以该命令的计数器将包含两种类型数据包的数值，如上面输出所示。

###静态的邻居发现

与动态EIGRP邻居发现过程不同，静态EIGRP邻居关系需要在路由器上对手动配置邻居。在配置好静态EIGRP邻居后，本地路由器就使用单播邻居地址，往所配置的那些路由器，发送数据包。

在EIGRP网络中，静态邻居关系的使用是十分罕见的。这主要是因为手动邻居配置在大型网络中无法适应其规模。但重要的是明白在思考IOS软件中为何还是有此选项，以及在什么情况下可以运用到此特性。使用静态邻居配置的一个主要实例，就是在那些没有广播或多播数据原生支持的传输介质，比如帧中继上，部署EIGRP的情况下（A prime example of when static neighbour configuration could be used would be in a situation where EIGRP is being deployed across media that does not natively support Broadcast or Multicast packets, such as Frame Relay）。

另一实例就是，为了在多路访问网络，比如以太网上，仅有少数几台开启了EIGRP的路由器时，为了防止发送不必要的EIGRP数据包的情形。在此情况下，除开基本的EIGRP配置，还必须在本地路由器上对所有静态EIGRP邻居配置`neighbour`命令。如果一台路由器被配置为使用单播（静态），而其它路由器又被配置为使用多播（动态），那么这些开启了EIGRP的路由器是不会建立邻接关系的（EIGRP-enabled routers will not establish an adjacency if one router is configured to use Unicast(static) while another uses Multicast(dynamic)）。

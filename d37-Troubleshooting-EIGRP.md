#第37天

**EIGRP故障排除**

**Troubleshooting EIGRP**

##第37天任务

- 阅读今天的课文
- 复习昨天的课文

增强的内部网关路由协议是一种思科专有的高级距离矢量路由协议。而作为一名思科网络工程师，掌握如何来支持EIGRP，就尤为重要，因为EIGRP是一种广泛使用的路由协议。在具备本教程前面讲到的那些技术下，为了对运行着EIGRP的网络进行鼓掌排除与支持，就必须对EIGRP协议本身内部工作原理，有扎实掌握。

尽管无法深入到所有潜在的EIGRP故障场景，本课程模块还是将对那些在把EIGRP选作内部网关协议进行部署时，一些最常见的故障场景进行讨论。

今天将学习以下内容：

- 邻居关系的故障排除
- 路由安装的故障排除，Troubleshooting route installation
- 路由通告的故障排除
- EIGRP路由故障的调试，Debugging EIGRP routing issues

本课程对应了以下CCNA大纲要求：

+ EIGRP故障排除，Troubleshoot and resolve EIGRP problems
    - 邻居关系的建立，Neighbour adjancies
    - 自治系统编号，AS number
    - 负载均衡，Load balancing
    - 水平分割，Split horizon

##邻居关系故障的排除

这里重要的是清楚仅在两台或更多路由器之间简单地开启EIGRP，并不保证能建立邻居关系。而是除了在那些参数匹配外，一些其它因素亦会造成EIGRP邻居关系建立的失败。以下任何问题，都将导致EIGRP邻居关系的无法建立：

- 这些邻居路由器不在同一个子网中
- 不匹配的主从子网，Mismatched primary and secondary subnets
- K值不匹配，Mismatched K values
- 不匹配的自治系统编号, Mismatched ASN
- 有访问控制列表，将EIGRP数据包过滤掉了，Access control lists are filtering EIGRP packets
- 存在物理层故障，Physical Layer issues
- 存在数据链路层故障，Data Link Layer issues
- 认证参数不匹配, Mismatched authentication parameters


子网不一致问题，是在尝试建立EIGRP邻居关系时，所遇到的最常见故障之一。而在因为子网不一致造成EIGRP无法建立邻居关系时，将有下面的消息在控制台上打印出来，或是被路由器、交换机所记录：

```
*Mar 2 22:12:46.589 CST: IP-EIGRP(Default-IP-Routing-Table:1): Neighbor 150.1.1.2 not on common subnet for FastEthernet0/0
*Mar 2 22:12:50.977 CST: IP-EIGRP(Default-IP-Routing-Table:1): Neighbor 150.1.1.2 not on common subnet for FastEthernet0/0
```

而造成邻居路由器位处不同子网的最常见原因，就是配置不当了。这可能是意外地将邻居路由器接口配置在了两个不同的子网上了。但假如两台邻居路由器是经由VLAN连接的，则有可能是因为多播数据包在VLANs之间泄露了，从而导致此种故障。对于这种故障，要排除之，首先就要对设备上的接口配置进行检查。而随后的其它排除步骤，则是诸如执行VLAN的故障排除（在适用的情况下），以对故障加以隔离与解决。

导致报出上面错误消息的另一常见原因，就是在尝试建立EIGRP邻居关系时，采用的是接口的从地址(secondary addresses)。解决此类故障的最简单方式，同样是对路由器或交换机的配置进行检查。比如，假定上面的错误消息是在本地路由器控制台上打印出来的，那么故障排除的第一步，就是检查配置在接口上的IP地址，如下所示：

```
R1#show running-config interface FastEthernet0/0
Building configuration...
Current configuration : 140 bytes
!
interface FastEthernet0/0
ip address 150.2.2.1 255.255.255.0
duplex auto
speed auto
end
```

接着，需要验证到有着IP地址`150.1.1.2`的设备上的配置是一致的，如下所示：

```
R2#show running-config interface FastEthernet0/0
Building configuration...
Current configuration : 140 bytes
!
interface FastEthernet0/0
ip address 150.2.2.2 255.255.255.0 secondary
ip address 150.1.1.2 255.255.255.0
duplex auto
speed auto
end
```

从上面的输出可以看到，路由器R1上的主要子网（the primary subnet），却是本地路由器（R2）上的第二子网（the secondary subnet）。在使用从地址时，EIGRP是无法建立邻居关系的。该故障的解决方法，就是简单地将路由器R2的`Fastethernet0/0`接口的IP分址配置（the IP addressing configuration）予以更正即可，如下所示：

```
R2#config terminal
Enter configuration commands, one per line.
End with CNTL/Z.
R2(config)#interface FastEthernet0/0
R2(config-if)#ip address 150.2.2.2 255.255.255.0
R2(config-if)#ip address 150.1.1.2 255.255.255.0 secondary
R2(config-if)#end
*Oct 20 03:10:27.185 CST: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 1: Neighbor 150.2.2.1 (FastEthernet0/0) is up: new adjacency
```

EIGRP的那些K值，是用于给路径的不同方面，比如带宽、延迟等可包含在EIGRP复合度量值中的参数，分配权重的。这里再度说明一下，默认的K值为：`K1=K3=1`及`K2=K4=K5=0`。如在某台路由器或交换机上对这些K值进行了修改，那么就必须对自治系统中所有其它路由器或交换机上的K值做同样修改。使用`show ip protocols`命令，就可查看到默认EIGRP的那些K值，如下所示：

```
R1#show ip protocols
Routing Protocol is “eigrp 150”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is 1
  Default networks flagged in outgoing updates
  Default networks accepted from incoming updates
  EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
  EIGRP maximum hopcount 100
  EIGRP maximum metric variance 1
  Redistributing: eigrp 150, ospf 1
  EIGRP NSF-aware route hold timer is 240s
  Automatic network summarization is not in effect
  Maximum path: 4
  Routing for Networks:
    10.1.0.0/24
    172.16.1.0/30
  Routing Information Sources:
    Gateway         Distance      Last Update
    (this router)         90      15:59:19
    172.16.0.2            90      12:51:56
    172.16.1.2            90      00:27:17
  Distance: internal 90 external 170
```

在某台路由器上的K值被重置后，那么该本地路由器的所有邻居关系都将被重置。而如果在重置后所有路由器上的这些K值出现不一致，那么控制台上将打印出下面的错误消息，同时EIGRP邻居关系将不会建立：

```
*Oct 20 03:19:14.140 CST: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 1: Neighbor 150.2.2.1 (FastEthernet0/0) is down: Interface Goodbye received
*Oct 20 03:19:18.732 CST: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 1: Neighbor 150.2.2.1 (FastEthernet0/0) is down: K-value mismatched
```

> **注意**：尽管可使用`metric-weights`命令对EIGRP的那些K值进行调整，但在没有老练网络工程师或思科技术支持中心的协助下，是不推荐的。

与OSPF使用到本地意义上的进程ID（a locally significant process ID）不同, 在与其它路由器建立邻居关系时，EIGRP要求同样的自治系统编号（除开其它变量之外）。对此方面故障的排除，是通过对设备配置进行比较，并确保那些将要建立邻居关系的路由器之间的自治系统编号（除开其它变量）一致即可。作为邻居处于不同自治系统的一个良好指标，就是即使路由器之间有着基本的IP连通性的情况下，仍然缺少双向Hello数据包。这一点可通过使用`show ip eigrp traffic`命令予以验证，该命令的输出在接下来的小节中有演示。

配置不当的访问控制清单（ACLs）与其它过滤器（filters）同样也是造成路由器建立EIGRP邻居关系失败的常见原因。这时对路由器配置和其它中间设备进行检查，以确保EIGRP或多播数据包未被过滤掉。要用到的一个非常有用的故障排除命令，就是`show ip eigrp traffic`了。此命令提供了有关所有EIGRP数据包的统计信息。比如这里假设已经对基本的连通性（能`ping`通）及两台设备之间的配置进行了验证，但EIGRP邻居关系仍然没有建立。那么在此情况下，就可以在本地设备上开启调试（enabling debugging on the local device）之前，使用该命令检查看看路由器是否有Hello数据包的交换，如下所示：

```
R2#show ip eigrp traffic
IP-EIGRP Traffic Statistics for AS 2
  Hellos sent/received: 144/0
  Updates sent/received: 0/0
  Queries sent/received: 0/0
  Replies sent/received: 0/0
  Acks sent/received: 0/0
  SIA-Queries sent/received: 0/0
  SIA-Replies sent/received: 0/0
  Hello Process ID: 149
  PDM Process ID: 120
  IP Socket queue:   0/2000/0/0 (current/max/highest/drops)
  Eigrp input queue: 0/2000/0/0 (current/max/highest/drops)
```

在上面的输出中，注意该本地路由器尚未收到任何的Hello数据包，虽然其已发出144个Hello数据包。假设已经验证了两台设备之间有着连通性，以及各自配置，那么就应对本地路由器与中间设备（在适用时）上的访问控制清单配置进行检查，以确保EIGRP或多播数据包未被过滤掉。比如，可能发现有着一条ACL配置为拒绝所有D类与E类流量，而放行所有其它流量，譬如下面的ACL：

```
R2#show ip access-lists
Extended IP access list 100
    10 deny ip 224.0.0.0 15.255.255.255 any
    20 deny ip any 224.0.0.0 15.255.255.255 (47 matches)
    30 permit ip any any (27 matches)
```

物理及数据链路层的故障，以及这些故障对路由协议及其它流量造成影响的方式，已在早先的课程模块中有所说明。对这些故障的排除，可以使用`show interfaces`、`show interfaces counters`、`show vlan`及`show spanning-tree`等命令，以及其它一些在前面课程模块（[物理及数据链路层故障排除](d15-Layer_1-and-Layer_2-Troubleshooting.html)）中讲到的命令。这里为了避免重复，就不再重申那些物理及数据链路层故障排除步骤了。

最后，常见的认证配置错误，包含了在配置密钥链时不同的密钥ID，以及指定了不同或不匹配的口令等（Finally, common authentication configuration mistakes include using different key IDs when configuring key chains and specifying different or mismatched password）。当在某个接口下开启了认证时，EIGRP邻居关系将被重置并被重新初始化。假如在部署认证之后，原先已建立的邻居关系未能再度建立，那么就要通过在路由器上观察运行配置，或使用`show key chain`及`show ip eigrp interfaces detail [name]`命令，来对各项认证参数进行检查。下面是由`show key chain`命令所打印出来的示例输出：

```
R2#show key chain
Key-chain EIGRP-1:
    key 1 -- text “eigrp-1”
      accept lifetime (always valid) - (always valid) [valid now]
      send lifetime (always valid) - (always valid) [valid now]
Key-chain EIGRP-2:
    key 1 -- text “eigrp-2”
      accept lifetime (00:00:01 UTC Nov 1 2010) - (infinite)
      send lifetime (00:00:01 UTC Nov 1 2010) - (infinite)
Key-chain EIGRP-3:
    key 1 -- text “eigrp-3”
      accept lifetime (00:00:01 UTC Dec 1 2010) - (00:00:01 UTC Dec 31 2010)
      send lifetime (00:00:01 UTC Dec 1 2010) - (00:00:01 UTC Dec 31 2010)
```

以下是由`show ip eigrp interfaces detail [name]`命令所打印出的示例信息输出：

```
R2#show ip eigrp interfaces detail Serial0/0
IP-EIGRP interfaces for process 1
                        Xmit Queue   Mean   Pacing Time    Multicast    Pending
Interface        Peers  Un/Reliable  SRTT   Un/Reliable    Flow Timer   Routes
Se0/0              0        0/0        0        0/1             0           0
  Hello interval is 5 sec
  Next xmit serial <none>
  Un/reliable mcasts: 0/0  Un/reliable ucasts: 0/0
  Mcast exceptions: 0  CR packets: 0  ACKs suppressed: 0
  Retransmissions sent: 0  Out-of-sequence rcvd: 0
  Authentication mode is md5,  key-chain is “EIGRP-1”
  Use unicast
```

通常在进行故障排除时，都是建议在思科IOS软件中使用`show`命令（`show` commands），而不是`debug`命令（`debug` commands）。虽然调试提供到实时信息，但调试是非常耗费处理器资源的，从而造成设备的高CPU使用率，同时在某些情况下，甚至造成设备设备崩溃。除了这些`show`命令之外，还应对软件所打印出的错误消息加以留意，因为这些消息提供了可用于故障排除及隔离出问题根源的有用信息。

##路由安装的故障排除

**Troubleshooting Route Installation**

在一些故障实例中，可能会注意到EIGRP未有将某些路由安装到路由表中。造成此类问题的主要原因，就是某些与协议失败相对的错误配置（For the most part, this is typically due to some misconfigurations versus a protocol failure）。路由安装失败的一些常见原因，有以下这些：

- 经由另一协议收到了有着更低管理距离的相同路由，The same route is received via another protocol with a lower administrative distance
- EIGRP汇总，EIGRP summarisation
- EIGRP域中出现了重复的路由器ID，Duplicate router IDs are present within the EIGRP domain
- 这些路由未能满足可行条件，The routes do not meet the Feasibility Condition

管理距离这一概念，被用于判定路由源的可靠性（The administrative distance(AD) concept is used to determine how reliable the route source is）。较低的管理距离，就意味着路由源更为可靠。假如从三种不同协议接收到同一条路由，那么有着最低管理距离的那条路由，将被安装到路由表中。在使用EIGRP时，要记住对于汇总、内部与外部路由（summary, internal, and external routes），EIGRP分别使用了不同的管理距离值。而假如同时运行着多种路由协议，这时就要确保对那些管理距离数值，以及它们对路由表的生成有何种影响有所掌握。这在进行多种路由协议之间路由重分发时，尤其要加以关注。

默认情况下，EIGRP在有类边界上进行自动汇总，并创建出一条指向`Null0`接口的汇总路由（By default, EIGRP automatically summarises at classful boundaries and creates a summary route pointing to the Null0 interface）。由于该汇总是以默认的管理距离数值5安装到路由表中的，那么所有其它类似的动态接收到的路由，都不会被安装到路由表中了。比如考虑下图37.1中所演示的拓扑：

![EIGRP的自动汇总](images/3701.png)
*图 37.1 -- EIGRP的自动汇总*

参考图37.1中所演示的图示，子网`150.1.1.0/30`将`10.1.1.0/24`与`10.2.2.0/24`分离开来。在开启了自动汇总时，路由器R1与R2都将相应地将`10.1.1.0/24`与`10.2.2.0/24`汇总到`10.0.0.0/8`。该汇总路由将以5的管理距离及下一跳接口`Null0`，安装到路由表中。此较低的管理距离值，将阻止两台路由器对来自其它路由器的该`10.0.0.0/8`汇总的接收与安装，如下面的输出所示：

```
R2#debug eigrp fsm
EIGRP FSM Events/Actions debugging is on
R2#
R2#
*Mar 13 03:24:31.983: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 1: Neighbor 150.1.1.1
(FastEthernet0/0) is up: new adjacency
*Mar 13 03:24:33.995: DUAL: dest(10.0.0.0/8) not active
*Mar 13 03:24:33.995: DUAL: rcvupdate: 10.0.0.0/8 via 150.1.1.1 metric 156160/128256
*Mar 13 03:24:33.995: DUAL: Find FS for dest 10.0.0.0/8. FD is 128256, RD is 128256
*Mar 13 03:24:33.995: DUAL: 0.0.0.0 metric 128256/0
*Mar 13 03:24:33.995: DUAL: 150.1.1.1 metric 156160/128256 found Dmin is 128256
*Mar 13 03:24:33.999: DUAL: RT installed 10.0.0.0/8 via 0.0.0.0
```

在上面的调试输出中，本地路由器从邻居`150.1.1.1`处接收到了有着路由度量值`156160/128256`的`10.0.0.0/8`路由。但由于汇总操作，弥散更新算法本地也有着该相同路由，且该本地路由有着`128256/0`的路由度量值。因此安装到路由表中的是本地路由，而不是接收到的，因为本地路由有着更好的度量值。此情形在路由器R1上同样适用，R1将会把它本地的`10.0.0.0/8`路由安装到RIB（Route Information Base, 路由信息库）中。结果就是两台路由器都无法`ping`到对方的`10.x.x.x`子网。为解决此问题，就应在两台路由器上都使用`no auto-summary`命令，关闭自动汇总，从而允许这些具体路由条目得以通告出去。

EIGRP路由器ID（RID）的主要用途，就是阻止路由环回的形成。RID用于识别外部路由的始发路由器（The RID is used to identify the originating router for external routes）。加入接收到一条有着与本地路由器相同RID的外部路由，该路由将被丢弃。不过重复的路由器ID，却并不会影响到任何内部EIGRP路由。设计此特性的目的，就是降低那些在多于一台的自治系统边界路由器（AS Boundary Router, ASBR）上进行着路由重分发的网络中，出现路由环回的可能性。在`show ip eigrp topology`命令的输出中，便可查看到始发路由器ID，如下所示：

```
R1#show ip eigrp topology 2.2.2.2 255.255.255.255
IP-EIGRP (AS 1): Topology entry for 2.2.2.2/32
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 156160
  Routing Descriptor Blocks:
  150.1.1.2 (FastEthernet0/0), from 150.1.1.2, Send flag is 0x0
      Composite metric is (156160/128256), Route is External
      Vector metric:
        Minimum bandwidth is 100000 Kbit
        Total delay is 5100 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
      External data:
        Originating router is 2.2.2.2
        AS number of route is 0
        External protocol is Connected, external metric is 0
        Administrator tag is 0 (0x00000000)
```

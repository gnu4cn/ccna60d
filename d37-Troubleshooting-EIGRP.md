#第37天

**EIGRP故障排除**

**Troubleshooting EIGRP**

##第37天任务

- 阅读今天的课文
- 复习昨天的课文

增强的内部网关路由协议是一种思科专有的高级距离矢量路由协议。因为EIGRP是一种广泛使用的路由协议，而作为一名思科网络工程师，掌握如何来支持EIGRP，就尤为重要。在具备了本教程前面讲到的那些技术下，为了对运行着EIGRP的网络进行鼓掌排除与支持，就必须对EIGRP协议本身内部工作原理有扎实掌握。

尽管无法深入到所有潜在的EIGRP故障场景，本课程模块还是将就那些在把EIGRP选作内部网关协议进行部署时，一些最常见的故障场景进行讨论。

今天将学习以下内容：

- 邻居关系的故障排除, Troubleshooting neighbour relationships
- 路由安装的故障排除，Troubleshooting route installation
- 路由通告的故障排除, Troubleshooting route advertisement
- EIGRP路由故障的调试，Debugging EIGRP routing issues

本课程对应了以下CCNA大纲要求：

+ EIGRP故障排除，Troubleshoot and resolve EIGRP problems
    - 邻居关系的建立，Neighbour adjancies
    - 自治系统编号，AS number
    - 负载均衡，Load balancing
    - 水平分割，Split horizon

##邻居关系故障的排除

**Troubleshooting Neighbour Relationships**

这里重要的是掌握到仅在两台或更多路由器之间简单地开启EIGRP，并不保证能建立邻居关系。而是除了在那些确切参数匹配外，一些其它因素亦会造成EIGRP邻居关系建立的失败。以下任何问题，都将导致EIGRP邻居关系的无法建立：

- 这些邻居路由器不在同一个子网中，The neighbour routers are not on a common subnet
- 不匹配的主从子网，Mismatched primary and secondary subnets
- K值不匹配，Mismatched K values
- 不匹配的自治系统编号, Mismatched ASN
- 有访问控制列表，将EIGRP数据包过滤掉了，Access control lists are filtering EIGRP packets
- 存在物理层故障，Physical Layer issues
- 存在数据链路层故障，Data Link Layer issues
- 认证参数不匹配, Mismatched authentication parameters


非同一子网问题，是在尝试建立EIGRP邻居关系时，所遇到的最常见故障之一。而在因为子网不一致造成EIGRP无法建立邻居关系时，将有下面的消息在控制台上打印出来，或是被路由器、交换机所记录（Uncommon subnet issues are one of the most common problems experienced when attempting to establish EIGRP neighbour relationships. When EIGRP cannot establish a neighbour relationship because of an uncommon subnet, the following error message will be printed on the console, or will be logged by the router or switch）：

```
*Mar 2 22:12:46.589 CST: IP-EIGRP(Default-IP-Routing-Table:1): Neighbor 150.1.1.2 not on common subnet for FastEthernet0/0
*Mar 2 22:12:50.977 CST: IP-EIGRP(Default-IP-Routing-Table:1): Neighbor 150.1.1.2 not on common subnet for FastEthernet0/0
```

而造成邻居路由器位处不同子网的最常见原因，就是配置不当了。这可能是**意外地将邻居路由器接口配置在了两个不同的子网上**了。而**假如两台邻居路由器是经由VLAN连接的，则有可能是因为多播数据包在VLANs之间泄露了**，从而导致此种故障。对于这种故障，要排除之，首先就要对设备上的接口配置进行检查。而随后的其它排除步骤，则是诸如执行VLAN的故障排除（在适用的情况下），以对隔离出故障并加以解决。

导致报出上面错误消息的另一常见原因，就是**在尝试建立EIGRP邻居关系时，采用的是接口的从地址**(secondary addresses)。解决此类故障的最简单方式，同样是对路由器或交换机的配置进行检查。比如，假定上面的错误消息是在本地路由器控制台上打印出来的，那么故障排除的第一步，就是检查配置在接口上的IP地址，如下所示：

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

接着，就要验证到有着IP地址`150.1.1.2`的设备上的配置是一致的，如下所示：

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

而EIGRP的那些K值，则是用于给路径的不同方面，比如带宽、延迟等可能包含在EIGRP复合度量值中的参数，进行权重分配的。这里再度说明一下，默认的K值为：`K1=K3=1`及`K2=K4=K5=0`。如在某台路由器或交换机上对这些K值进行了修改，那么就必须对自治系统中所有其它路由器或交换机上的K值做同样修改。使用`show ip protocols`命令，就可查看到默认EIGRP的那些K值，如下所示：

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

与OSPF使用到**本地意义上的进程ID**不同, 在与其它路由器建立邻居关系时，EIGRP要求同样的自治系统编号（除开其它变量之外）。对此方面故障的排除，是通过对设备配置进行比较，并确保那些将要建立邻居关系的路由器之间的自治系统编号（除开其它变量）一致即可。作为邻居处于不同自治系统的一个良好指标，就是即使路由器之间有着基本的IP连通性的情况下，仍然缺少双向Hello数据包。这一点可通过使用`show ip eigrp traffic`命令予以验证，该命令的输出在接下来的小节中有演示（unlike OSPF, which uses **a locally significant process ID**, EIGRP requires the same ASN(among other variables) when establishing neighbour relationships with other routers. Troubleshoot such issues by comparing configurations of devices and ensuring that the ASN(among other variables) is consistent between routers that should establish neighbour relationships. A good indicator that neighbours are in a different AS would be a lack of bidirectional Hellos, even in the presence of basic IP connectivity between the routers. This can be validated using the `show ip eigrp traffic` command, the output of which is illustrated in the section that follows）。

**配置不当的访问控制清单（ACLs）与其它过滤器（filters）同样也是造成路由器建立EIGRP邻居关系失败的常见原因**。这时就要对路由器配置和其它中间设备进行检查，以确保EIGRP或多播数据包未被过滤掉。要用到的一个非常有用的故障排除命令，就是`show ip eigrp traffic`了。此命令提供了所有EIGRP数据包的统计信息。比如假设这里已经对基本的连通性（能`ping`通）及两台设备之间的配置进行了验证，但EIGRP邻居关系仍然没有建立。那么在此情况下，就可以在本地设备上开启调试（enabling debugging on the local device）之前，使用该命令检查看看路由器是否有Hello数据包的交换，如下所示：

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

在上面的输出中，注意虽然该本地路由器已发出144个Hello数据包, 但其尚未收到任何的Hello数据包。假设已验证了两台设备之间有着连通性及各自配置，那么就应对本地路由器与中间设备（在适用时）上的访问控制清单配置进行检查，以确保EIGRP或多播数据包未被过滤掉。比如，可能发现有着一条ACL配置为拒绝所有D类与E类流量，而放行所有其它流量，譬如下面的ACL：

```
R2#show ip access-lists
Extended IP access list 100
    10 deny ip 224.0.0.0 15.255.255.255 any
    20 deny ip any 224.0.0.0 15.255.255.255 (47 matches)
    30 permit ip any any (27 matches)
```

物理及数据链路层的故障，以及这些故障对路由协议及其它流量造成影响的方式，已在早先的课程模块中有所说明。对这些故障的排除，可以使用`show interfaces`、`show interfaces counters`、`show vlan`及`show spanning-tree`等命令，以及其它一些在前面课程模块（[物理及数据链路层故障排除](d15-Layer_1-and-Layer_2-Troubleshooting.html)）中讲到的命令。这里为了避免重复，就不再重申那些物理及数据链路层故障排除步骤了。

最后，一些常见的认证配置错误，包括在配置密钥链时使用了不同密钥ID，以及指定了不同或不匹配的口令等（Finally, common authentication configuration mistakes include using different key IDs when configuring key chains and specifying different or mismatched password）。在某个接口下开启了认证时，EIGRP邻居关系将被重置并被重新初始化。如在部署认证之后，原本已建立的邻居关系未能再度建立，那么就要通过在路由器上观察运行配置，或使用`show key chain`及`show ip eigrp interfaces detail [name]`命令，来对各项认证参数进行检查。下面是由`show key chain`命令所打印出来的示例输出：

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

在一些故障实例中，可能会注意到EIGRP未有将某些路由安装到路由表中。造成此类问题的主要原因，就是某些与协议失败相对应的错误配置（For the most part, this is typically due to some misconfigurations versus a protocol failure）。路由安装失败的一些常见原因如下：

- 经由另一协议收到了有着更低管理距离的相同路由，The same route is received via another protocol with a lower administrative distance
- EIGRP汇总，EIGRP summarisation
- EIGRP域中出现了重复的路由器ID，Duplicate router IDs are present within the EIGRP domain
- 这些路由未能满足可行条件，The routes do not meet the Feasibility Condition

管理距离这一概念，被用于确定出路由源的可靠性（The administrative distance(AD) concept is used to determine how reliable the route source is）。较低的管理距离，就意味着路由源更为可靠。假如从三种不同协议接收到同一条路由，那么有着最低管理距离的那条路由，将被安装到路由表中。在使用EIGRP时，要记住对于汇总、内部及外部三种路由（summary, internal, and external routes），EIGRP分别使用了不同的管理距离值。而假如同时运行着多种路由协议，这时就要确保对各种路由协议的管理距离数值，以及它们对路由表的生成有何种影响有所掌握。这在进行多种路由协议之间路由重分发时，尤其要加以关注（If you are running multiple routing protocols, it is important to ensure that you understand AD values and how they impact routing table population. This is especially of concern when you are Redistributing routes between multiple routing protocols）。

默认情况下，EIGRP在有类边界上进行自动汇总，并创建出一条指向`Null0`接口的汇总路由。由于该汇总是以默认的管理距离数值`5`安装到路由表中的，因此所有其它类似的动态接收到的路由，就都不会被安装到路由表中了（By default, EIGRP automatically summarises at classful boundaries and creates a summary route pointing to the `Null0` interface. Because the summary is installed with a default AD value of `5`, any other similar dynamically received routes will not be installed into the routing table）。比如考虑下图37.1中所演示的拓扑：

![EIGRP的自动汇总](images/3701.png)
*图 37.1 -- EIGRP的自动汇总*

参考图37.1中所演示的图示，子网`150.1.1.0/30`将`10.1.1.0/24`与`10.2.2.0/24`分离开来。在开启了自动汇总时，路由器`R1`与`R2`都将相应地把`10.1.1.0/24`与`10.2.2.0/24`汇总到`10.0.0.0/8`。该汇总路由将以`5`的管理距离及下一跳接口`Null0`，被安装到路由表中。此较低的管理距离值，将阻止两台路由器对来自其它路由器的该`10.0.0.0/8`汇总的接收与安装，如下面的输出所示：

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

EIGRP路由器ID（RID）的主要用途，就是阻止路由环回的形成。RID用于识别外部路由的始发路由器（The RID is used to identify the originating router for external routes）。假如接收到一条有着与本地路由器相同RID的外部路由，该路由将被丢弃。不过重复的路由器ID，却并不会影响到任何内部EIGRP路由。设计此特性的目的，就是降低那些有着多台自治系统边界路由器（AS Boundary Router, ASBR）进行路由重分发的网络出现路由环回的可能性。在`show ip eigrp topology`命令的输出中，便可查看到始发路由器ID（The primary use of the EIGRP router ID(RID) is to prevent routing loops. The RID is used to identify the originating router for external routes. If an external route is received with the same RID as the local router, the route will be discarded. However, duplicate RIDs do not affect any internal EIGRP routes. This feature is designed to reduce the possibility of routing loops in networks where route redistribution is being performed on more than on ASBR. The originating RID can be viewed in the output of the `show ip eigrp topology` command），如下所示：

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

如怀疑存在潜在的RID重复故障，就可以对EIGRP事件日志中的事件进行检查，看看是否有任何路由因为RID重复而被拒绝。下面的示例演示了该EIGRP事件日志的输出样例，显示出一些因为从某台与本地路由器有着相同RID的路由器接收，而被弹回的路由（If you suspect a potential duplicate RID issue, you can check the events in the EIGRP event log to see if any routes have been rejected because of a duplicate RID. The following illustrates a sample output of the EIGRP event log, showing routes that have been rejected because they were received from a router with the same RID as the local router）:

```
R2#show ip eigrp events
Event information for AS 1:
...
[Truncated Output]
21   03:05:39.747 Ignored route, neighbor info: 10.0.0.1 Serial0/0
22   03:05:39.747 Ignored route, dup router: 150.1.1.254
23   03:05:06.659 Ignored route, metric: 192.168.2.0 284160
24   03:05:06.659 Ignored route, neighbor info: 10.0.0.1 Serial0/0
25   03:05:06.659 Ignored route, dup router: 150.1.1.254
26   03:04:33.311 Ignored route, metric: 192.168.1.0 284160
27   03:04:33.311 Ignored route, neighbor info: 10.0.0.1 Serial0/0
28   03:04:33.311 Ignored route, dup router: 150.1.1.254
...
[Truncated Output]
```

上述问题的可能解决办法，就是修改邻居路由器`10.0.0.1`上的RID，或本地路由器的RID，这取决于到底哪一个是不被正确配置的（The resolution for the solution above would be to change the RID on neighbour router `10.0.0.1` or on the local router, depending upon which one of the two has been incorrectly configured）。

最后，重要的是记住EIGRP不会将那些未能满足可行条件的路由，安装到路由表中。就算在本地路由器上配置了`variance`命令，这一点也是适用的。作为一个常见误解，就是执行`variance`命令，就会令到EIGRP在那些路由度量值为后继路由度量值`x`倍的路径上进行负载分配了（Finally, it is important to remember that EIGRP will not install routes into the routing table if they do not meet the Feasibility Condition. This is true even if the `variance` command has been configured on the local router. It is a common misconception that issuing the `variance` command will allow EIGRP to load share over any paths whose route metric is `x` times that of the successor metric）。比如请考虑下图37.2中所演示的拓扑:

![掌握可行条件](images/3702.png)
*图 37.2 -- 掌握可行条件*

图37.2展示了一个包含了多个从`R1`到子网`192.168.100.0/24`度量值的基本网络。参考图37.2, 下表37.1给出了在`R1`上看到的网络`192.168.100.0/24`的那些报告的距离与可行距离：

*表37.1 -- `R1` 的路径与距离*

| 网络路径（Network Path） | `R1`的邻居（`R1` Neighbour） | 邻居度量值（Neighbour Metric, RD） | `R1`的可行距离（`R1` Feasible Distance） |
| ------ | ------ | ------: | ------: |
| `R1`-`R2`-`R5` | `R2` | 30 | 35 |
| `R1`-`R3`-`R5` | `R3` | 10 | 30 |
| `R1`-`R4`-`R5` | `R4` | 15 | 25 |

`R1`已被配置为在所有路径上进行负载均衡，同时命令`variance 2`被加入到路由器配置。这就令到EIGRP在至多两倍于后继路由度量值的路径上进行负载均衡，给予默认的度量值计算，这将包含到所有三条的路径。但尽管有着此配置，仍只有两条路径将被安装及使用（`R1` has been configured to load share across all paths and the `variance 2` command is added to the router configuration. This allow EIGRP to load share across paths with up to twice the metric of the Successor route, which would include all three paths based on the default metric calculation. However, despite this configuration, only two paths will be installed and used）。

首先，基于经由`R4`的路径的可行距离，也就是`25`, `R1`将选择该路由作为后继路由。该路由将被放入到IP路由表以及EIGRP的拓扑表中。而邻居`R3`到`192.168.100.0/24`网络的度量值，也被称作报告的距离或通告的距离，是`10`。该度量值低于可行距离，因此该路由是满足可行条件的，而被放入到EIGRP的拓扑表。

但邻居`R2`到`192.168.100.0/24`网络的度量值却是`30`。该值要比可行距离`25`要高。那么该路由就不满足可行条件，而不被当作是一条可行后继。但该路由仍将被放入到EIGRP的拓扑表。不过就算该路径的度量值是处于由EIGRP路由器配置命令`variance 2`所指定的范围中，其也不会被用于负载分配。在这类情形中，可考虑使用**EIGRP的偏移清单**，来确保所有路由都被加以考虑（In such situations, consider using **EIGRP offset lists** to ensure that all routes are considered）。

##路由通告的故障排除

**Troubleshooting Route Advertisement**

总是会出现看起来EIGRP要么没有对其配置的那些进行通告的网络加以通告，要么通告出其未配置为进行通告的那些网络的情形。对于这些大部分情况来说，此类故障都是由于路由器或交换机的不当配置造成的。而至于EIGRP没有对其已配置为加以通告的某个网络进行通告的原因，有好几种。一些原因如下所示（There are times when it may seem that EIGRP is either not advertising the networks that is has been configured to advertise or is advertising networks that it has not been configured to advertise. For the most part, such issues are typically due to router and switch misconfigurations. Thare are several reasons why EIGRP might not advertise a network that it has been configured to advertise. Some of these reasons include the following）：

- 投送清单（Distribute lists, 这是超出CCNA大纲要求的）
- 水平分割（Split horizon）
- 汇总（Summarisation）

未正确配置的投送清单，是EIGRP没有对某个已被配置为加以通告的网络进行通告的一个原因。在配置同送清单时，要确保所有应被通告的网络，都是为所引用的**IP访问控制清单**或**IP前缀清单放行**的（Incorrectly configured distribute lists are one reason why EIGRP might not advertise a network that it has been configured to advertise. When configuring distribute lists, ensure that all networks that should be advertised are permitted by the referenced **IP ACL** or **IP Prefix List**）。

另一个采用EIGRP时与网络通告有关的常见故障，就是水平分割的默认行为了。水平分割是一项强制路由信息无法从其被接收到的接口，再发送出去的一项距离矢量协议特性。此特性阻止了路由信息再度通告到学习到该信息的来源，从而有效地阻止了路由环回（Another common issue pertaining to network advertisement when using EIGRP is the default behaviour of split horizon. Split horizon is a Distance Vector protocol feature that mandates that routing information cannot be sent back out of the same interface through which it was received. This prevents the re-advertising of information back to the source from which it was learned, effectively preventing routing loops）。此概念在下图37.3中进行了演示：

![EIGRP的水平分割](images/3703.png)
*图37.3 -- EIGRP的水平分割*

图37.3中的拓扑演示了**一个经典的中心与分支网络**，其中路由器`HQ`作为**中心路由器**，而路由器`S1`与`S2`作为两台**分支路由器**。在该帧中继的WAN上，每台分支路由器都有着**局部网状网络**中、单独的在各自自身与中心路由器之间所提供的DLCI。默认情况下，对于连接到**包交换网络**，比如这里的帧中继的WAN接口，EIGRP的水平分割是开启的。这就意味着该中心路由器将不会对接口`Serial0/0`上学习到的路由信息，再在该相同接口上通告出去（The topology in Figure 37.3 illustrates **a classic hub-and-spoke network**, with router `HQ` as **the hub router** and routers `S1` and `S2` as **the two spoke routers**. On the Frame Relay WAN, each spoke router has a single DLCI provisioned between itself and the `HQ` router in **a partial-mesh topology**. By default, EIGRP split horizon is enabled for WAN interfaces connected to **packet-switched networks**, such as Frame Relay. This means that the `HQ` router will not advertise routing information learned on `Serial0/0` out of the same interface）。

该默认行为的影响，就是中心路由器不会将自`S1`接收到的`10.1.1.0/24`前缀通告给`S2`, 因为该路由是通过`Serial0/0`接口接收到，而水平分割特性阻止了该路由器对在那个接口上所学习到的信息从该相同接口通告出去。同样的情形对于中心路由器从`S2`上所接收到的`10.2.2.0/24`前缀也是适用的。此问题的推荐解决办法，就是在中心路由器的该WAN接口上，使用接口配置命令`no ip split-horizon eigrp [asn]`关闭水平分割特性了。

而对于EIGRP来说，自动汇总则是在**有类边界**（the classful boundary）上默认是开启的。这一点可使用`show ip protocols`命令予以验证到。除开自动汇总，EIGRP还支持接口级别的手动汇总。不管采用何种方式，汇总都将阻止由汇总路由所涵盖到的那些更具体路由条目，被通告给邻居路由器（Regardless of the method implemented, summarisation prevents the more specific route entries that are encompassed by the summary from being advertised to neighbour routers）。如果汇总是被不当配置的，那就可能出现EIGRP没有通告出某些网络的情况。比如请考虑下图37.4中所演示的基本网络拓扑：

![EIGRP的汇总](images/3704.png)
*图37.4 -- EIGRP的汇总*

参考图37.4, 所有路由器都位于EIGRP自治系统`150`中。`R2`正经由EIGRP对`10.1.1.0/24`、`10.1.2.0/24`与`10.1.3.0/24`子网进行通告。而`R1`也有着一个分配给子网`10.1.0.0/24`的接口，其就应相应地将这些子网通告给`R3`（`R1`, which also has an interface assigned to the `10.1.0.0/24` subnet, should in turn advertise these subnets to `R3`）。路由器`R2`上的EIGRP配置已作如下部署：

```
R2(config)#router eigrp 150
R2(config-router)#network 10.1.1.0 0.0.0.255
R2(config-router)#network 10.1.2.0 0.0.0.255
R2(config-router)#network 10.1.3.0 0.0.0.255
R2(config-router)#network 172.16.1.0 0.0.0.3
R2(config-router)#no auto-summary
R2(config-router)#exit
```

而`R1`上的EIGRP则是部署如下：

```
R1(config)#router eigrp 150
R1(config-router)#network 10.1.0.0 0.0.0.255
R1(config-router)#network 172.16.0.0 0.0.0.3
R1(config-router)#network 172.16.1.0 0.0.0.3
R1(config-router)#exit
```

最后，`R3`上的EIGRP配置部署如下：

```
R3(config)#router eigrp 150
R3(config-router)#network 172.16.0.0 0.0.0.3
R3(config-router)#no auto-summary
R3(config-router)#exit
```

在此种配置之后，`R2`上的路由表显示出以下条目：

```
R2#show ip route eigrp
     172.16.0.0/30 is subnetted, 2 subnets
D       172.16.0.0 [90/2172416] via 172.16.1.1, 00:02:38, FastEthernet0/0
     10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
D       10.0.0.0/8 [90/156160] via 172.16.1.1, 00:00:36, FastEthernet0/0
```

`R1`上的路由表显示以下条目：

```
R1#show ip route eigrp
     172.16.0.0/16 is variably subnetted, 3 subnets, 2 masks
D       172.16.0.0/16 is a summary, 00:01:01, Null0
     10.0.0.0/8 is variably subnetted, 6 subnets, 2 masks
D       10.1.3.0/24 [90/156160] via 172.16.1.2, 00:21:01, FastEthernet0/0
D       10.3.0.0/24 [90/2297856] via 172.16.0.2, 00:00:39, Serial0/0
D       10.1.2.0/24 [90/156160] via 172.16.1.2, 00:21:01, FastEthernet0/0
D       10.1.1.0/24 [90/156160] via 172.16.1.2, 00:21:01, FastEthernet0/0
D       10.0.0.0/8 is a summary, 00:01:01, Null0
```

最后，`R3`上的路由表显示以下条目：

```
R3#show ip route eigrp
     172.16.0.0/30 is subnetted, 2 subnets
D       172.16.1.0 [90/2172416] via 172.16.0.1, 00:21:21, Serial0/0
     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
D       10.0.0.0/8 [90/2297856] via 172.16.0.1, 00:01:15, Serial0/0
```

因为在`R1`上汇总是开启的，就出现了EIGRP不再通告由**汇总路由**`10.0.0.0/8`所包含的那些具体子网的情况了（Because summarisation is enabled on `R1`, it appears that the EIGRP is no longer advertising the specific subnets encompassed by the `10.0.0.0/8` **summary**）。而要允许这些具体子网通过EIGRP得以通告，就应在`R1`上将汇总关闭，如下所示：

```
R1(config)#router eigrp 150
R1(config-router)#no auto-summary
R1(config-router)#exit
```

这么做之后，`R3`上的路由表将显示如下的路由条目：

```
R3#show ip route eigrp
     172.16.0.0/30 is subnetted, 2 subnets
D       172.16.1.0 [90/2172416] via 172.16.0.1, 00:00:09, Serial0/0
     10.0.0.0/24 is subnetted, 5 subnets
D       10.1.3.0 [90/2300416] via 172.16.0.1, 00:00:09, Serial0/0
D       10.1.2.0 [90/2300416] via 172.16.0.1, 00:00:09, Serial0/0
D       10.1.1.0 [90/2300416] via 172.16.0.1, 00:00:09, Serial0/0
D       10.1.0.0 [90/2297856] via 172.16.0.1, 00:00:09, Serial0/0
```

同样的情况对于`R2`也将适用，`R2`上的路由表现在将显示出子网`10.1.0.0/24`与`10.3.0.0/24`的具体条目，如下所示：

```
R2#show ip route eigrp
     172.16.0.0/30 is subnetted, 2 subnets
D       172.16.0.0 [90/2172416] via 172.16.1.1, 00:00:10, FastEthernet0/0
     10.0.0.0/24 is subnetted, 5 subnets
D       10.3.0.0 [90/2300416] via 172.16.1.1, 00:00:10, FastEthernet0/0
D       10.1.0.0 [90/156160] via 172.16.1.1, 00:00:10, FastEthernet0/0
```

##EIGRP路由故障的调试

**Debugging EIGRP Routing Issues**

在前面这些小节中我们把主要强调的方面放在那些`show`命令上的同时，此最后的小节将介绍一些还可以用于EIGRP故障排除的调试命令。不过还是要始终记住，调试是甚为处理器密集，而应作为随后手段加以应用的（也就是在应用并尝试了所有`show`命令及其它故障排除方法和工具之后。While primary emphasis has been placed on the use of `show` commands in the previous sections, this final section descibes some of the debugging commands that can also be used to troubleshoot EIGRP. Keep in mind, however, that debugging is very processor intensive and should be used only as a last resort(i.e., after all `show` commands and other troubleshooting methods and tools have been applied or attempted)）。

命令`debug ip routing [acl|static]`是一个强大的故障排除工具及命令（a powerful troubleshooting tool and command）。但需要注意到，尽管此命令并非特定于EIGRP，其提供到有关路由表的有用与详细信息。下面是由该命令所打印出的信息示例：

```
R1#debug ip routing
IP routing debugging is on
R1#
*Mar  3 23:03:35.673: %LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0,
changed state to down
*Mar  3 23:03:35.673: RT: is_up: FastEthernet0/0 0 state: 4 sub state: 1 line: 0
has_route: True
*Mar  3 23:03:35.677: RT: interface FastEthernet0/0 removed from routing table
*Mar  3 23:03:35.677: RT: del 172.16.1.0/30 via 0.0.0.0, connected metric [0/0]
*Mar  3 23:03:35.677: RT: delete subnet route to 172.16.1.0/30
*Mar  3 23:03:35.677: RT: NET-RED 172.16.1.0/30
*Mar  3 23:03:35.677: RT: Pruning routes for FastEthernet0/0 (3)
*Mar  3 23:03:35.689: RT: delete route to 10.1.3.0 via 172.16.1.2, FastEthernet0/0
*Mar  3 23:03:35.689: RT: no routes to 10.1.3.0, flushing
*Mar  3 23:03:35.689: RT: NET-RED 10.1.3.0/24
*Mar  3 23:03:35.689: RT: delete route to 10.1.2.0 via 172.16.1.2, FastEthernet0/0
*Mar  3 23:03:35.689: RT: no routes to 10.1.2.0, flushing
*Mar  3 23:03:35.689: RT: NET-RED 10.1.2.0/24
*Mar  3 23:03:35.689: RT: delete route to 10.1.1.0 via 172.16.1.2, FastEthernet0/0
*Mar  3 23:03:35.689: RT: no routes to 10.1.1.0, flushing
*Mar  3 23:03:35.693: RT: NET-RED 10.1.1.0/24
*Mar  3 23:03:35.693: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 172.16.1.2
(FastEthernet0/0) is down: interface down
*Mar  3 23:03:39.599: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 172.16.1.2
(FastEthernet0/0) is up: new adjacency
*Mar  3 23:03:40.601: %LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0,
changed state to up
*Mar  3 23:03:40.601: RT: is_up: FastEthernet0/0 1 state: 4 sub state: 1 line: 1
has_route: False
*Mar  3 23:03:40.605: RT: SET_LAST_RDB for 172.16.1.0/30
  NEW rdb: is directly connected
*Mar  3 23:03:40.605: RT: add 172.16.1.0/30 via 0.0.0.0, connected metric [0/0]
*Mar  3 23:03:40.605: RT: NET-RED 172.16.1.0/30
*Mar  3 23:03:40.605: RT: interface FastEthernet0/0 added to routing table
*Mar  3 23:03:49.119: RT: SET_LAST_RDB for 10.1.1.0/24
  NEW rdb: via 172.16.1.2
*Mar  3 23:03:49.119: RT: add 10.1.1.0/24 via 172.16.1.2, eigrp metric [90/156160]
```

可与某条访问控制清单结合使用此命令，来查看有关在那个访问控制清单中所引用到某条路由或某几条路由的信息。此外，同样的命令也可以用于本地设备上静态路由事件的调试。作为附注，在运行EIGRP时，作为使用此命令的替代，请考虑使用`show ip eigrp events`命令而不是此命令，因为`show ip eigrp events`提供到EIGRP内部事件的历史记录，且可用于对活动粘滞故障，以及路由抖动及其它事件进行排除（You can use this command in conjunction with an ACL to view information about the route or routes referenced in the ACL. Additionally, the same command can also be used for troubleshooting static route events on the local device. As a side note, instead of using this command, if you are running EIGRP, consider using the `show ip eigrp events` command instead, as it provides a history of EIGRP internal events and can be used to troubleshoot SIA issues, as well as route flaps and other events）。下面是`show ip eigrp events`命令所打印信息的一个示例：

```
R1#show ip eigrp events
Event information for AS 150:
1    23:03:49.135 Ignored route, metric: 192.168.3.0 28160
2    23:03:49.135 Ignored route, metric: 192.168.2.0 28160
3    23:03:49.135 Ignored route, metric: 192.168.1.0 28160
4    23:03:49.131 Rcv EOT update src/seq: 172.16.1.2 85
5    23:03:49.127 Change queue emptied, entries: 3
6    23:03:49.127 Ignored route, metric: 192.168.3.0 28160
7    23:03:49.127 Ignored route, metric: 192.168.2.0 28160
8    23:03:49.127 Ignored route, metric: 192.168.1.0 28160
9    23:03:49.127 Metric set: 10.1.3.0/24 156160
10   23:03:49.127 Update reason, delay: new if 4294967295
11   23:03:49.127 Update sent, RD: 10.1.3.0/24 4294967295
12   23:03:49.127 Update reason, delay: metric chg 4294967295
13   23:03:49.127 Update sent, RD: 10.1.3.0/24 4294967295
14   23:03:49.123 Route install: 10.1.3.0/24 172.16.1.2
15   23:03:49.123 Find FS: 10.1.3.0/24 4294967295
16   23:03:49.123 Rcv update met/succmet: 156160 128256
17   23:03:49.123 Rcv update dest/nh: 10.1.3.0/24 172.16.1.2
18   23:03:49.123 Metric set: 10.1.3.0/24 4294967295
19   23:03:49.123 Metric set: 10.1.2.0/24 156160
20   23:03:49.123 Update reason, delay: new if 4294967295
21   23:03:49.123 Update sent, RD: 10.1.2.0/24 4294967295
22   23:03:49.123 Update reason, delay: metric chg 4294967295
...
[Truncated Output]
```

除开`debug ip routing`命令，思科IOS软件里还有额外可用的两个EIGRP专用调试命令。命令`debug eigrp`可用于提供到有关弥散更新算法的有限状态机、EIGRP邻居关系、非停止转发事件、数据包及传输事件等的相关实时信息（In addition to the `debug ip routing` command, two additional EIGRP-specific debugging commands are also available in Cisco IOS software. The `debug eigrp` command can be used to provide real-time information on the DUAL Finite State Machine, EIGRP neighbour relationships, Non-Stop Forwarding events, packets, and transimission events）。下面演示了此命令可用的参数：

```
R1#debug eigrp ?
  fsm        EIGRP Dual Finite State Machine events/actions
  neighbors  EIGRP neighbors
  nsf        EIGRP Non-Stop Forwarding events/actions
  packets    EIGRP packets
  transmit   EIGRP transmission events
```

在`debug eigrp`命令之外，命令`debug ip eigrp`打印出有关EIGRP路由事件的详细信息，诸如EIGRP如何处理到来的更新等。下面演示了可与该命令结合使用的那些额外关键字：

```
R1#debug ip eigrp ?
  <1-65535>      Autonomous System
  neighbor       IP-EIGRP neighbor debugging
  notifications  IP-EIGRP event notifications
  summary        IP-EIGRP summary route processing
  vrf            Select a VPN Routing/Forwarding instance
  <cr>
```

最后，下面是命令`debug ip eigrp`的一个输出示例：

```
R1#debug ip eigrp
IP-EIGRP Route Events debugging is on
R1#
*Mar  3 23:49:47.028: %DUAL-5-NBRCHANGE: IP-EIGRP(0) 150: Neighbor 172.16.1.2
(FastEthernet0/0) is up: new adjacency
*Mar  3 23:49:47.044: IP-EIGRP(Default-IP-Routing-Table:150): 10.1.0.0/24 - do advertise
out FastEthernet0/0
*Mar  3 23:49:47.044: IP-EIGRP(Default-IP-Routing-Table:150): Int 10.1.0.0/24 metric
128256 - 256 128000
*Mar  3 23:49:48.030: %LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0,
changed state to up
*Mar  3 23:49:56.179: IP-EIGRP(Default-IP-Routing-Table:150): Processing incoming UPDATE
packet
*Mar  3 23:49:56.544: IP-EIGRP(Default-IP-Routing-Table:150): Processing incoming UPDATE
packet
*Mar  3 23:49:56.544: IP-EIGRP(Default-IP-Routing-Table:150): Int 10.1.1.0/24 M 156160 -
25600 130560 SM 128256 - 256 128000
*Mar  3 23:49:56.544: IP-EIGRP(Default-IP-Routing-Table:150): route installed for
10.1.1.0  ()
*Mar  3 23:49:56.544: IP-EIGRP(Default-IP-Routing-Table:150): Int 10.1.2.0/24 M 156160 -
25600 130560 SM 128256 - 256 128000
*Mar  3 23:49:56.548: IP-EIGRP(Default-IP-Routing-Table:150): route installed for
10.1.2.0  ()
*Mar  3 23:49:56.548: IP-EIGRP(Default-IP-Routing-Table:150): Int 10.1.3.0/24 M 156160 -
25600 130560 SM 128256 - 256 128000
...
[Truncated Output]
```

##第37天问题

**Day 37 Questions**

1. Name at least three reasons for EIGRP neighbour relationships not forming.
2. Which command can you use to verify EIGRP K values?
3. Which command can you use to verify EIGRP packets statistics?
4. Name at least two common reasons for EIGRP route installation failures.
5. The administrative distance concept is used to determine how reliable the route source is. True or false?
6. By default, EIGRP automatically summarises at classful boundaries and creates a summary route pointing to the Null0 interface. True or false?
7. Which command can you can use to debug FSM events?
8. Which command can you use to see the originating router ID of a specific prefix?
9. Which command can you use to show the EIGRP event log?
10. What is the best command to use when debugging various routing issues?


## 第37天答案

**Day 37 Answers**

1. The neighbour routers are not on a common subnet; mismatched primary and secondary subnets; mismatched K values; mismatched ASN; ACLs are filtering EIGRP packets; Physical Layer issues; Data Link Layer issues; and mismatched authentication parameters.
2. The `show ip protocols` command.
3. The `show ip eigrp traffic` command.
4. The same route is received via another protocol with a lower administrative distance;EIGRP summarisation; duplicate router IDs are present within the EIGRP domain; and the routes do not meet the Feasibility Condition.
5. True.
6. True.
7. The `debug eigrp fsm` command.
8. The `show ip eigrp topology x.x.x.x y.y.y.y` command.
9. The `show ip eigrp events` command.
10. The `debug ip routing` command.


## 第37天实验

**Day 37 Lab**

请重复前一天的EIGRP实验。此外，对本节课中给出的那些EIGRP故障排除命令进行测试：

- 使用`show ip protocol`命令，来查看那些EIGRP的参数（See the EIGRP parameters using the `show ip protocol` command）
- 对两台路由器上的K值进行修改，并再次执行该命令（Modify K values on both routers and issue the command again）
- 注意各异的所配置K值，导致了EIGRP邻居关系丢失（Notice that different configured K values lead to EIGRP neighbour relationships being lost）
- 通过执行`show ip eigrp traffic`命令，验证所传输的Hello数据包（Verify the Hello packets being transmitted by issuing the `show ip eigrp traffic` command）
- 对`debug eigrp fsm`命令进行测试
- 针对已通告的路由测试`show ip eigrp topology`命令，并留意起源RID；在远端路由器上修改RID，并再次执行该命令（Test the `show ip eigrp topology` command for the advertised route and notice the originating RID; change the RID on the remote router and issue the command again）
- 对`show ip eigrp events`命令加以验证（Verify the `show ip eigrp events` command）
- 在将网络通告进EIGRP之前，启动IP路由调试；留意所生成的调试更新消息（Start the debug IP routing before advertising the network into EIGRP; notice the generated debug updates）

请访问[www.in60days.com](http://www.in60days.com)网站，免费观看作者完成此实验。

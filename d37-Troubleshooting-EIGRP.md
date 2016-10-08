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



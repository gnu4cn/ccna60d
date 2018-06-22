#第11天

**静态路由**

**Static Routing**

##第11天任务

- 阅读今天的课文
- 复习昨天的课文
- 完成今天的实验
- 阅读ICND1记诵指南
- 在[subnetting.org](http://subnetting.org/)上用`15`分钟

选择作一名网络管理员，就是要在网络中用到动态路由协议或坚持使用静态路由，所谓静态路由，就是手动将网络的所有路由，加入到所有路由器上去。

经常会有人问我（原作者）哪个路由协议是”最好的“。是没有一种方式适合于每个网络的，因为就算某家特定机构的网络需求，也会随时间变化。配置静态路由需要时间和精力，但可以省下一些网络带宽和CPU运算周期。如要加入一条新路由，就必须在所有路由器上进行手动添加。此外，如有某台路由器宕掉，静态路由就没有办法处理这个事情，所以还会往宕掉的网络发送流量（有关可靠静态路由的部分，不再CCNA大纲的范围之内）。

今天要学到下面这些。

- 静态路由的配置
- 静态路由排错

本模块对应了以下CCNA大纲要求。

- 按照给出的特定路由要求，配置并验证一条静态或默认路由的路由配置
+ 区分不同路由方式及各种路由协议
	- 静态路由对动态路由
	- 下一跳

如回头看一下第`10`天中的管理距离表，就会发现手动配置的网络比起路由协议，是首选的路由。这么做的理由就是，作为网络管理员，期望着比任何协议都要对网络有更好的了解，并比任何协议都清楚要达到什么目的。那么现在，就应该明白，在需要达到某种目的时，可以结合动态路由来使用静态路由。

##静态路由配置

**Configuring Static Routes**

 配置一条静态路由（见下图11.1）需要以下这些命令。

- `network address/prefix mask`
- `address` **or** `exit interface`
- `distance` **(optional)**

这里是一个这些命令使用的实例。

`RouterA(config)#ip route network prefix mask {address | interface} [distance]`

![静态路由示例网络](images/1101.png)

*图11.1 -- 静态路由示例网络*

要加入上面网络的一条静态路由，就要在左边的路由器上写出下面这行配置。

```
Router(config)#ip route 192.168.1.0 255.255.255.0 172.16.1.2
```

对静态路由，需要指定在前往目的地址的路途上，路由器需要去往的下一跳IP地址，或者也可以指定一个出去的接口。通常不需要知道下一跳地址，因为那就是ISP，或者IP地址会随时变化（见下图11.2）。如果是这样，就要使用出去的接口。

![不总是知道下一跳地址的情形](images/1102.png)

*图11.2 -- 不总是知道下一跳地址的情形*

`Router(config)#ip route 192.168.1.0 255.255.255.0 s0/0`

上面的命令行告诉路由器将目的为`192.168.1.10`网络的流量，从串行接口发出。而下面的命令则是告诉路由器将所有网络的所有流量，都从串行接口发出。

```
Router(config)#ip route 0.0.0.0 0.0.0.0 s0/0
```

上面的路由实际上就是一条默认路由（a default route）。默认路由用于引导那些未在路由表中显式列出的目的网络的数据包。


###静态IPv6路由的配置

**Configuring Static IPv6 Routes**

静态IPv6路由的配置，与静态IPv4路由的配置遵循同样的逻辑。在思科IOS软件中，全局配置命令`ipv6 route [ipv6-prefix/prefix-length] [next-hop-address | interface] [distance <1-254> | multicast | tag | unicast]`用于配置静态IPv6路由。当中的一些关键字是熟悉的，因为它们也适用于IPv4静态路由，而`[multicast]`关键字则是IPv6所独有的，用于配置一条IPv6静态多播路由(an IPv6 static Multicast route)。如用到此关键字，该路由就不会进到单薄路由表（the Unicast routing table），同时也绝不会用于转发单播流量。为确保该路由绝不会安装到单播路由信息库（the Unicast RIB）, 思科IOS软件将该条路由**（静态多播路由）的管理距离设置为`255`**。

相反，`[unicast]`关键字则是用于配置一条IPv6静态单播路由。如用到此关键字，该条路由就绝不会进入到多播路由表（the Multicast routing table）, 并仅被用于转发单播流量。而**既没用到`[multicast]`关键字，也没用到`[unicast]`关键字时，默认情况下，该条路由机会用于单播数据包的转发，也会用于多播数据包的转发**。

以下的配置示例，演示了如何来配置`3`条静态IPv6路由。第一条路由，到子网`3FFF:1234:ABCD:0001::/64`, 会将流量从`FastEthernet0/0`转发出去。此路由仅用于单播流量的转发。第二条路由，到子网`3FFF:1234:ABCD:0002::/64`, 会将到那个子网的数据包从`Serial0/0`，使用下一跳路由器的数据链路层地址，作为IPv6的下一跳地址转发出去。本条路由仅会用于多播流量。最后，同样配置了一条指向`Serial0/1`作为出口接口的默认路由。此默认路由将会通过`Serial0/1`, 使用下一跳路由器的本地链路地址作为IPv6下一跳地址，转发那些到未知IPv6目的地址的数据包。这些路由如下面所示。

```
R1(config)#ipv6 route 3FFF:1234:ABCD:0001::/64 Fa0/0 unicast
R1(config)#ipv6 route 3FFF:1234:ABCD:0002::/64 Se0/0 FE80::2222 multicast
R1(config)#ipv6 route ::/0 Serial0/1 FE80::3333
```

依此配置，命令`show ipv6 route`可用于验证在本地路由器上应用的静态路由配置，如下所示。

```
R1#show ipv6 route static
IPv6 Routing Table - 13 entries
Codes: 	C - Connected, L - Local, S - Static, R - RIP, B - BGP
		U - Per-user static route
		I1 - ISIS L1, I2 - ISIS L2, IA - ISIS inter area, IS - ISIS summary
		O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
		ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
S	::/0 [1/0]
	 via FE80::3333, Serial0/1
S	3FFF:1234:ABCD:1::/64 [1/0]
	 via ::, FastEthernet0/0
S	3FFF:1234:ABCD:2::/64 [1/0]
	 via FE80::2222, Serial0/0
```

除了使用`show ipv6 route`命令外，命令`show ipv6 static [prefix] [detail]`也可一用来对所有或仅是某条特定静态路由的细节信息进行查看。下面输出演示了如何使用这个命令。

```
R1#show ipv6 static 3FFF:1234:ABCD:1::/64 detail
IPv6 static routes
Code: * - installed in RIB
* 3FFF:1234:ABCD:1::/64 via interface FastEthernet0/0, distance 1
```

##静态路由排错

**Troubleshooting Satic Routes**

排错总会涉及到某个配置问题（如果不是接口宕掉的话）。如流量没有到达目的地，就可以使用命令`traceroute`测试该路由。

> **注意** -- 今天内容很少，所以请前往第12天吧，因为那将是个非常充实的主题。

##第11天问题

1. Name the three parameters needed to configure a static route.
2. What is the command used to configure a static route?
3. What is the command used to configure a default static route?
4. What is the command used to configure an IPv6 static route?
5. What is the command used to view IPv6 static routes?

##第11天答案

1. Network address, subnet mask (prefix length), and next-hop address or exit interface.
2. The `ip route` command.
3. The `ip route 0.0.0.0 0.0.0.0` command.
4. The `ipv6 route` command.
5. The `show ipv6 route static` command.

##第11天实验

###静态路由实验

**Static Routes Lab**

**拓扑图**

![静态路由实验拓扑图](images/1103.png)

**实验目的**

学习如何以下一跳地址和出口接口方式，将静态路由指定给一台路由器。

**实验步骤**

1. 按照上面的拓扑图分配IP地址。`Router A`可以是`192.168.1.1/30`, `Router B`可以是`.2`。
2. 通过串行链路进行`ping`操作，以确保该链路是工作的。
3. 在`Router A`上指定一条静态路由，将到`10.1.1.0/10`网络的所有流量，从串行接口发送出去。当然要使用你自己的串行端口编号；不要只是拷贝我的配置，你的接口有不同编号！

```
RouterA(config)#ip route 10.0.0.0 255.192.0.0 Serial0/1/0
RouterA(config)#exit
RouterA#ping 10.1.1.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 18/28/32 ms
RouterA#
RouterA#show ip route
Codes: 	C - Connected, S - Static, I - IGRP, R - RIP, M - Mobile, B - BGP
		D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
		N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
		E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
		i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
		* - Candidate default, U - Per-user static route, o - ODR
		P - Periodic downloaded static route
Gateway of last resort is not set
	  10.0.0.0/10 is subnetted, 1 subnets
S		  10.0.0.0 is directly connected, Serial0/1/0
	  172.16.0.0/24 is subnetted, 1 subnets
C		  172.16.1.0 is directly connected, Loopback0
	  192.168.1.0/30 is subnetted, 1 subnets
C		  192.168.1.0 is directly connected, Serial0/1/0
RouterA#
RouterA#show ip route 10.1.1.1
Routing entry for 10.0.0.0/10
Known via “static”, distance 1, metric 0 (connected)
  Routing Descriptor Blocks:
  * directly connected, via Serial0/1/0
		Route metric is 0, traffic share count is 1
RouterA#
```

4. 在`Router B`上配置一条静态路由，将到`172.16.1.0/24`网络的所有流量，发到下一跳地址`192.168.1.1`。

```
RouterB(config)#ip route 172.16.1.0 255.255.255.0 192.168.1.1
RouterB(config)#exit
RouterB#ping 172.16.1.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 172.16.1.1, timeout is 2 seconds:
!!!!!
RouterB#show ip route 172.16.1.1
Routing entry for 172.16.1.0/24
Known via “static”, distance 1, metric 0
  Routing Descriptor Blocks:
  * 192.168.1.1
	  Route metric is 0, traffic share count is 1
RouterB#
```

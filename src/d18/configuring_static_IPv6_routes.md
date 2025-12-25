# 静态 IPv6 路由的配置

**Configuring Static IPv6 Routes**

静态 IPv6 路由的配置，与静态 IPv4 路由的配置遵循同样的逻辑。在思科 IOS 软件中，全局配置命令`ipv6 route [ipv6-prefix/prefix-length] [next-hop-address | interface] [distance <1-254> | multicast | tag | unicast]`用于配置静态 IPv6 路由。当中的一些关键字是熟悉的，因为它们也适用于 IPv4 静态路由，而`[multicast]`关键字则是 IPv6 所独有的，用于配置一条 IPv6 静态多播路由(an IPv6 static Multicast route)。如用到此关键字，该路由就不会进到单薄路由表（the Unicast routing table），同时也绝不会用于转发单播流量。为确保该路由绝不会安装到单播路由信息库（the Unicast RIB）, 思科 IOS 软件将该条路由**（静态多播路由）的管理距离设置为`255`**。

相反，`[unicast]`关键字则是用于配置一条 IPv6 静态单播路由。如用到此关键字，该条路由就绝不会进入到多播路由表（the Multicast routing table）, 并仅被用于转发单播流量。而**既没用到`[multicast]`关键字，也没用到`[unicast]`关键字时，默认情况下，该条路由机会用于单播数据包的转发，也会用于多播数据包的转发**。

以下的配置示例，演示了如何来配置`3`条静态 IPv6 路由。第一条路由，到子网`3FFF:1234:ABCD:0001::/64`, 会将流量从`FastEthernet0/0`转发出去。此路由仅用于单播流量的转发。第二条路由，到子网`3FFF:1234:ABCD:0002::/64`, 会将到那个子网的数据包从`Serial0/0`，使用下一跳路由器的数据链路层地址，作为 IPv6 的下一跳地址转发出去。本条路由仅会用于多播流量。最后，同样配置了一条指向`Serial0/1`作为出口接口的默认路由。此默认路由将会通过`Serial0/1`, 使用下一跳路由器的本地链路地址作为 IPv6 下一跳地址，转发那些到未知 IPv6 目的地址的数据包。这些路由如下面所示。

```console
R1(config)#ipv6 route 3FFF:1234:ABCD:0001::/64 Fa0/0 unicast
R1(config)#ipv6 route 3FFF:1234:ABCD:0002::/64 Se0/0 FE80::2222 multicast
R1(config)#ipv6 route ::/0 Serial0/1 FE80::3333
```

依此配置，命令`show ipv6 route`可用于验证在本地路由器上应用的静态路由配置，如下所示。

```console
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

```console
R1#show ipv6 static 3FFF:1234:ABCD:1::/64 detail
IPv6 static routes
Code: * - installed in RIB
* 3FFF:1234:ABCD:1::/64 via interface FastEthernet0/0, distance 1
```

## 静态路由排错

**Troubleshooting Satic Routes**

排错总会涉及到某个配置问题（如果不是接口宕掉的话）。如流量没有到达目的地，就可以使用命令`traceroute`测试该路由。

> **注意** -- 今天内容很少，所以请前往第 12 天吧，因为那将是个非常充实的主题。

## 第 11 天问题

1. Name the three parameters needed to configure a static route.
2. What is the command used to configure a static route?
3. What is the command used to configure a default static route?
4. What is the command used to configure an IPv6 static route?
5. What is the command used to view IPv6 static routes?

## 第 11 天答案

1. Network address, subnet mask (prefix length), and next-hop address or exit interface.
2. The `ip route` command.
3. The `ip route 0.0.0.0 0.0.0.0` command.
4. The `ipv6 route` command.
5. The `show ipv6 route static` command.

## 第 11 天实验

### 静态路由实验

**Static Routes Lab**

**拓扑图**

![静态路由实验拓扑图](../images/1103.png)

**实验目的**

学习如何以下一跳地址和出口接口方式，将静态路由指定给一台路由器。

**实验步骤**

1. 按照上面的拓扑图分配 IP 地址。`Router A`可以是`192.168.1.1/30`, `Router B`可以是`.2`。

2. 通过串行链路进行`ping`操作，以确保该链路是工作的。

3. 在`Router A`上指定一条静态路由，将到`10.1.1.0/10`网络的所有流量，从串行接口发送出去。当然要使用你自己的串行端口编号；不要只是拷贝我的配置，你的接口有不同编号！


    ```console
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
    Known via “ static ”, distance 1, metric 0 (connected)
      Routing Descriptor Blocks:
      * directly connected, via Serial0/1/0
            Route metric is 0, traffic share count is 1
    RouterA#
    ```

4. 在`Router B`上配置一条静态路由，将到`172.16.1.0/24`网络的所有流量，发到下一跳地址`192.168.1.1`。


    ```console
    RouterB(config)#ip route 172.16.1.0 255.255.255.0 192.168.1.1
    RouterB(config)#exit
    RouterB#ping 172.16.1.1
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 172.16.1.1, timeout is 2 seconds:
    !!!!!
    RouterB#show ip route 172.16.1.1
    Routing entry for 172.16.1.0/24
    Known via “ static ”, distance 1, metric 0
      Routing Descriptor Blocks:
      * 192.168.1.1
          Route metric is 0, traffic share count is 1
    RouterB#
    ```


（End）



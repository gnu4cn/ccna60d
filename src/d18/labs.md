# 第 11 天实验

## 静态路由实验

### 拓扑图

![静态路由实验拓扑图](../images/1103.png)


### 实验目的

学习如何以下一跳地址及出口接口，分配一些静态路由给某个路由器。


### 实验步骤


1. 根据上面的拓扑结构，分配所有的 IP 地址。`Router A` 可以是 `192.168.1.1/30`，`Router B` 可以是 `.2`；
2. 在串行链路上 `ping`，确保其是工作的；
3. 在 `Router A` 上分配一条静态路由，从串行接口发出所有 `10.1.1.0/10` 网络的流量。当然，要使用咱们自己串口编号；当咱们的串口有着不同编号时，请不要照搬我（作者）的串口编号！我没有添加接口配置，因为咱们已经知道怎么完成那些配置了；


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

4. 在 `Router B` 上配置一条静态路由，发送 `172.16.1.0/24` 网络的所有流量，到下一跳地址 `192.168.1.1`；


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


## IPv6 的静态路由实验

### 拓扑结构

![IPv6 静态路由实验拓扑结构](../images/IPv6_static_route_lab.png)

### 实验目的

学习如何配置 IPv6 的静态路由。

### 实验步骤

1. 添加 IPv6 地址到所有接口，然后在其中链路上 `ping`。`R1` 位于左侧。

    ```console
    R1(config)#ipv6 unicast-routing
    R1(config)#int lo0
    R1(config-if)#ipv6 add 2001:aaaa:bbbb:dddd::1/64
    R1(config-if)#int f0/0
    R1(config-if)#ipv6 add 2001:aaaa:bbbb:cccc::1/64
    R1(config-if)#no shut
    ```

    ```console
    R2(config)#ipv6 unicast-routing
    R2(config)#int f0/0
    R2(config-if)#ipv6 address 2001:aaaa:bbbb:cccc::2/64
    R2(config-if)#no shut
    R2(config-if)#int lo0
    R2(config-if)#ipv6 add 2001:aaaa:bbbb:eeee::1/64
    R2(config-if)#end
    R2#ping 2001:aaaa:bbbb:cccc::1

    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 2001:AAAA:BBBB:CCCC::1, timeout is 2 seconds:
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 12/22/36 ms
    ```


2. 执行一些常用的 IPv6 `show` 命令；


    ```console
    R1#show ipv6 interface brief
    R1#show ipv6 interface f0/0
    R1#show ipv6 neighbors
    ```


3. 在 `R2` 上配置一条静态路由，从而其可到达连接到 `R1` 上 `Loopback 0` 的网络。咱们将需要添加一个下一跳的链路本地地址，因为（在这个例中）我们使用的是个出口接口 (`f0/0`)；

    ```console
    R2(config)#ipv6 route 2001:AAAA:BBBB:DDDD::0/64 f0/0 FE80::C003:8FF:FE2F:0
    ```

4. 从 `R2` `ping` `R1` 上的那个远端网络；


    ```console
    R2#ping 2001:aaaa:bbbb:dddd::1

    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 2001:AAAA:BBBB:DDDD::1, timeout is 2 seconds:
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 8/16/24 ms
    ```

5. 在 `R1` 上添加一条静态默认路由，以发送任何网络/主机的任何流量。咱们可尝试一个下一跳地址，我（作者）将使用一个出口接口；


    ```console
    R1(config)#ipv6 route ::/0 f0/0 FE80::C004:8FF:FE2F:0
    ```


6. `ping` `R2` 上 `LO` 的 IP 地址；

    ```console
    R1#ping 2001:AAAA:BBBB:EEEE::1

    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 2001:AAAA:BBBB:EEEE::1, timeout is 2 seconds:
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 12/18/24 ms
    R1#
    ```

7. 检查这些 IPv6 的静态路由条目。


    ```console
    R1#show ipv6 route static
    IPv6 Routing Table - 6 entries
    Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
           U - Per-user Static route, M - MIPv6
           I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
           O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
           ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
           D - EIGRP, EX - EIGRP external
    S   ::/0 [1/0]
         via FE80::C004:8FF:FE2F:0, FastEthernet0/0
    ```

（End）



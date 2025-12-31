# 第 22 天实验

## EIGRP 实验

### 拓扑图

![EIGRP 实验拓扑图](../images/3622.png)

### 实验目的

学习如何配置基本的 EIGRP 。

### 实验步骤

1. 根据上面的拓扑，配置所有 IP 地址。确保咱们可在那条串行链路上 `ping`；
2. 在两台路由器上以 AS 30 配置 EIGRP；


    ```console
    RouterA(config)#router eigrp 30
    RouterA(config-router)#net 172.20.0.0
    RouterA(config-router)#net 10.0.0.0
    RouterA(config-router)#^Z
    RouterA#
    ```

    ```console
    RouterB#conf t
    Enter configuration commands, one per line.
    End with CNTL/Z.
    RouterB(config)#router eigrp 30
    RouterB(config-router)#net 10.0.0.0
    %DUAL-5-NBRCHANGE: IP-EIGRP 30: Neighbor 10.0.0.1 (Serial0/1/0) is up: new adjacency
    RouterB(config-router)#net 192.168.1.0
    ```

3. 检查两台路由器上的路由表；


    ```console
    RouterA#sh ip route
    Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP
           D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
           N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
           E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP
           i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area
           * - candidate default, U - per-user static route, o - ODR
           P - periodic downloaded static route

    Gateway of last resort is not set

         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:01:43, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
         172.20.0.0/16 is variably subnetted, 2 subnets, 2 masks
    D       172.20.0.0/16 is a summary, 00:01:43, Null0
    C       172.20.1.0/24 is directly connected, Loopback0
    D    192.168.1.0/24 [90/20640000] via 10.0.0.2, 00:00:49, Serial0/1/0
    RouterA#
    ```

    ```console
    RouterB#show ip route
    ...
    [Truncated Output]
    ...

         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:01:21, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
    D    172.20.0.0/16 [90/20640000] via 10.0.0.1, 00:01:27, Serial0/1/0
         192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
    D       192.168.1.0/24 is a summary, 00:01:21, Null0
    C       192.168.1.0/26 is directly connected, Loopback0
    RouterB#
    ```

4. 检查并确保两台路由器均在自动汇总各个网络。然后关闭路由器 B 上的自动摘要；


    ```console
    RouterB#show ip protocols

    Routing Protocol is “eigrp 30”
      Outgoing update filter list for all interfaces is not set
      Incoming update filter list for all interfaces is not set
      Default networks flagged in outgoing updates
      Default networks accepted from incoming updates
      EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
      EIGRP maximum hopcount 100
      EIGRP maximum metric variance 1
    Redistributing: eigrp 30
      Automatic network summarization is in effect
      Automatic address summarization:
        192.168.1.0/24 for Serial0/1/0
          Summarizing with metric 128256
        10.0.0.0/8 for Loopback0
          Summarizing with metric 20512000
      Maximum path: 4
      Routing for Networks:
         10.0.0.0
         192.168.1.0
      Routing Information Sources:
        Gateway         Distance      Last Update
        10.0.0.1        90            496078
      Distance: internal 90 external 170

    RouterB(config)#router eigrp 30
    RouterB(config-router)#no auto-summary
    ```

5. 检查路由器 A 上的路由表。


    ```console
    RouterA#show ip route
    ...
    [Truncated Output]
    ...

    Gateway of last resort is not set

         10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
    D       10.0.0.0/8 is a summary, 00:00:04, Null0
    C       10.0.0.0/30 is directly connected, Serial0/1/0
         172.20.0.0/16 is variably subnetted, 2 subnets, 2 masks
    D       172.20.0.0/16 is a summary, 00:00:04, Null0
    C       172.20.1.0/24 is directly connected, Loopback0
         192.168.1.0/26 is subnetted, 1 subnets
    D       192.168.1.0 [90/20640000] via 10.0.0.2, 00:00:04, Serial0/1/0
    RouterA#
    ```

## EIGRP 的故障排除实验


再次重复上面的 EIGRP 实验。此外，测试那些这一课中介绍过的 EIGRP 故障排除命令：

1. 通过使用 `show ip protocol` 命令查看 EIGRP 的那些参数；
2. 同时修改两个路由器上的那些 `K` 值，并再次执行 `show ip protocol` 命令；
3. 注意所配置的不同 K 值，会导致 EIGRP 邻居关系丢失；
4. 通过执行 `show ip eigrp traffic` 命令，检查那些正被传输的 `Hello` 数据包；
5. 测试 `debug eigrp fsm` 这条命令；
6. 为查看已通告路由，测试 `show ip eigrp topology` 这条命令，并注意其中的始发 RID；更改远端路由器上的 RID，并再次执行该命令；
7. 验证 `show ip eigrp events` 这条命令；
8. 将网络通告到 EIGRP 中前，启动 `debug ip routing`；注意所生成的那些调试更新（数据包）。


（End）




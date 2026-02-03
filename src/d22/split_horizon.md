# EIGRP 网络中的水平分割

早先（[1](../d17/routing_protocol_classes.md#split-horizon)、[2](../d17/avoidence_mechanisms.md#split-horizon)），咱们曾解到，水平分隔属于一项距离矢量协议特性，规定路由信息不能从经由其被接收的同一接口，再发送回去。这一特性防止了信息重新通告回其被学习的来源。虽然这一特性是种了不起的环路预防机制，但其也是种重大缺陷，尤其是在中心辐射状的网络中。要更好地理解这一特性的缺点，请参考下图 22.14 中的 EIGRP 中心辐射状网络。


![EIGRP 的水平分割](../images/3614.png)

<a name="f-22.14"></a>
**图 22.14** -- **EIGRP 的追平分隔**

图 22.14 中的拓扑结构，演示了一个经典的中心辐射状网络，其中路由器 `HQ` 作为中心路由器，路由器 `S1` 和 `S2` 作为两个分支路由器。在帧中继的 WAN 上，每个分支路由器都有个以部分网状拓扑，配置于其自身与总部路由器之间的 DLCI。这三个路由器上的帧中继配置被验证如下：


```console
HQ#show frame-relay map
Serial0/0 (up): ip 172.16.1.2 dlci 102(0x66,0x1860), static,
              broadcast,
              CISCO, status defined, active
Serial0/0 (up): ip 172.16.1.1 dlci 103(0x67,0x1870), static,
              broadcast,
              CISCO, status defined, active
```

```console
S1#show frame-relay map
Serial0/0 (up): ip 172.16.1.2 dlci 301(0x12D,0x48D0), static,
              broadcast,
              CISCO, status defined, active
Serial0/0 (up): ip 172.16.1.3 dlci 301(0x12D,0x48D0), static,
              broadcast,
              CISCO, status defined, active
```

```console
S2#show frame-relay map
Serial0/0 (up): ip 172.16.1.1 dlci 201(0xC9,0x3090), static,
              broadcast,
              CISCO, status defined, active
Serial0/0 (up): ip 172.16.1.3 dlci 201(0xC9,0x3090), static,
              broadcast,
              CISCO, status defined, active
```

稍后我们将在 [WAN 部分](../d37/FR_operations.md) 介绍帧中继。增强型 IGRP 已在全部三台路由器上，使用 `AS 150` 启用。以下输出演示了总部路由器与两台分支路由器之间的 EIGRP 邻居关系：

（帧中继已从 CCNA 教学大纲中删除。遗憾的是，它们导致的这个水平分隔问题却仍然存在。因此，我们将介绍这个问题，却不会介绍技术背后的理论。）

```console
HQ#show ip eigrp neighbors
IP-EIGRP neighbors for process 150
H   Address        Interface     Hold  Uptime    SRTT  RTO   Q   Seq
                                (sec)            (ms)        Cnt Num
1   172.16.1.1     Se0/0        165    00:01:07  24    200   0   2
0   172.16.1.2     Se0/0        153    00:01:25  124   744   0   2
```

以下输出演示了第一个分支路由器 `S1`，与总部路由器之间的 EIGRP 邻居关系：

```console
S1#show ip eigrp neighbors
IP-EIGRP neighbors for process 150
H   Address        Interface     Hold  Uptime    SRTT  RTO   Q   Seq
                                (sec)            (ms)        Cnt Num
0   172.16.1.3     Se0/0        128    00:00:53  911   5000  0   4
```


以下输出演示了第二个分支路由器 `S2`，与总部路由器之间的 EIGRP 邻居关系：

```console
S2#show ip eigrp neighbors
IP-EIGRP neighbors for process 150
H   Address        Interface     Hold  Uptime    SRTT  RTO   Q   Seq
                                (sec)            (ms)        Cnt Num
0   172.16.1.3     Se0/0        156    00:02:20  8     200   0   4
```

默认情况下，EIGRP 的水平分隔是启用的，这在部分网状的 NBMA 网络中是不可取的。这意味着 `HQ` 路由器不会把在 `Serial0/0` 上学习到的路由信息，再通告出该同一接口。这种默认行为的效果，便是 `HQ` 路由器不会把接收自 `S1` 的 `10.1.1.0/24` 前缀，通告给 `S2`，因为这条路由是经由 `Serial0/0` 接口接收到的，而水平分隔特性，会阻止该路由器将该接口上学习到的信息，再通告回该同一接口。同样的情况也适用于 `HQ` 路由器接收自 `S2` 的 `10.2.2.0/24` 前缀。

这种默认行为意味着，虽然 `HQ` 路由器知道这两个前缀，但两个分支路由器却只有着部分路由表。`HQ` 路由器上的路由表如下：


```console
HQ#show ip route eigrp
     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
D       10.1.1.0/24 [90/2195456] via 172.16.1.1, 00:12:04, Serial0/0
D       10.2.2.0/24 [90/2195456] via 172.16.1.2, 00:12:06, Serial0/0
```

分支 `S1` 上的路由表如下：

```console
S1#show ip route eigrp
     192.168.1.0/26 is subnetted, 1 subnets
D       192.168.1.0 [90/2195456] via 172.16.1.3, 00:10:53, Serial0/0
```

分支 `S2` 上的路由表如下：


```console
S2#show ip route eigrp
     192.168.1.0/26 is subnetted, 1 subnets
D       192.168.1.0 [90/2195456] via 172.16.1.3, 00:10:55, Serial0/0
```

这种默认行为的结果，便是虽然总部路由器能够到达两个分支路由器的那些网络，但两个分支路由器将都无法到达对方网络。此种情形可以数种方式加以解决，他们如下：

- 禁用 `HQ`（中心）路由器的水平分隔
- 通告一条 `HQ` 路由器上的默认路由，到分支路由器
- 在这些路由器上手动配置 EIGRP 邻居

禁用水平分隔，是在接口级别，通过在这个中心路由器上，使用 `no ip split-horizon eigrp [AS]` 这条接口配置命令完成的。`show ip split-horizon interface_name` 命令不会其针对 RIP 那样，显示 EIGRP 的水平分割状态。要查看其是否被禁用，咱们必须检查接口配置小节（即 `show run interface_name`）。参考上面 [图 22.14](#f-22.14) 中所示的网络拓扑，这一接口配置命令将应用到总部路由器上的 `Serial0/0` 接口。这会如下执行：


```console
HQ(config)#interface Serial0/0
HQ(config-if)#no ip split-horizon eigrp 150
```

在水平分隔禁用后，总部路由器便可通告信息回到其被接收的同一接口上。例如，分支 `S2` 上的路由表，现在会显示一条由分支 `S1` 通告给总部路由器的 `10.1.1.0/24` 前缀的路由条目：

```console
S2#show ip route eigrp
     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
D       10.1.1.0/24 [90/2707456] via 172.16.1.3, 00:00:47, Serial0/0
     192.168.1.0/26 is subnetted, 1 subnets
D       192.168.1.0 [90/2195456] via 172.16.1.3, 00:00:47, Serial0/0
```

从分支路由器 `S2` 到 `10.1.1.0/24` 子网的一次简单 `ping` 测试，可用于验证连通性，如下所示。

```console
S2#ping 10.1.1.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.1.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 24/27/32 ms
```

禁用水平分隔的第二种方法，是简单地通告一条总部路由器的默认路由，到分支路由器。在这种情形下，`ip summary-address eigrp 150 0.0.0.0 0.0.0` 这条接口配置命令，可应用到 `HQ` 路由器的 `Serial0/0` 接口。这一操作便将允许两台分支路由器，经由包含着完整路由表的 `HQ` 路由器到达对方，而无需禁用水平分隔。

> *译注*：原文这里表述前后矛盾，前面讲了 “禁用水平分隔的第二种方法”，后面有说到 “negating the need to disable split horizon”，译者认为这里应表述为：“解决 NBMA 传输介质下 EIGRP 水平分隔造成问题的第二种方法”。

禁用水平分隔的最后一种替代方法，是通过使用 `neighbor` 这条路由器配置命令，在全部路由器上手动配置一些 EIGRP 邻居语句。由于这种配置被用到时，邻居之间的更新属于单播（数据包），因此水平分隔的局限便被去掉了。这一选项在小型网络中工作良好；但随着网络增长及路由器数量增加，配置开销也会增加。

考虑到EIGRP 的默认路由与静态邻居的配置，已在这一教学模组前几个小节中详细介绍过了，出于简洁原因，这些特性的配置便省略了。


> *知识点*：
>
> + split horizon
>   - is a Distance Vector protocol feature
>   - mandating that routing information connot be sent back out of the same interface, through which it was received
>   - prevents the re-advertising of information back to the source from which it was learnt
>   - is a greate loop prevention mechanism
>   - also a significant drawback, especially in hub-and-spoke networks
>
> - by default, EIGRP split horizon is enabled, which is undesirable in partial-mesh NBMA networks
>
> - the result of this default split horizon enabled behavior, is that while the HQ router will be able to reach both spoke router networks, neither spoke router will be able to reach the networks of the other.
>
> + To address such a situation, three methods are available:
>   - disabling split horizon on the HQ(hub) router
>   - advertise a default route from the HQ router to the spoke routers
>   - manually configuring EIGRP neighbors on the routers

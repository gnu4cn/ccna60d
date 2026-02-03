# 等价与非等价的负载分担

针对所有的路由协议，Cisco 10S 软件都支持默认最多 4 条路径的等价负载分担。这在下面 `show ip protocols` 命令的输出中得以演示。（`Maximum path` 字段）


```console
R2#show ip protocols
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
    150.1.1.2/32
    150.2.2.2/32
  Routing Information Sources:
    Gateway         Distance      Last Update
    Gateway         Distance      Last Update
    150.2.2.1       90            00:00:52
    150.1.1.1       90            00:00:52
  Distance: internal 90 external 170
```

`maximum-paths <1-6>` 这条路由器配置命令，可用于将默认四条的最大路径数，修改为最多六条等价路径。在执行等价的负载均衡时，路由器会在所有路径间，平均分配负载。流量份额计数（`traffic share count` 字段），表明了各条路径上的出站数据包数量。在执行等价的负载均衡时，每单条路径上都会发送一个数据包，如以下输出中所示：


```console
R2#show ip route 172.16.100.0 255.255.255.0
Routing entry for 172.16.100.0/24
  Known via “eigrp 150”, distance 90, metric 2172416, type internal
  Redistributing via eigrp 150
  Last update from 150.2.2.1 on Serial0/1, 00:04:00 ago
  Routing Descriptor Blocks:
    150.2.2.1, from 150.2.2.1, 00:04:00 ago, via Serial0/1
      Route metric is 2172416, traffic share count is 1
      Total delay is 20100 microseconds, minimum bandwidth is 1544 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
  * 150.1.1.1, from 150.1.1.1, 00:04:00 ago, via Serial0/0
      Route metric is 2172416, traffic share count is 1
      Total delay is 20100 microseconds, minimum bandwidth is 1544 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
```


## 与非等价的负载分担

除了等价的负载均衡能力外，EIGRP 还能执行非等价的负载分担。这一独特功能，允许 EIGRP 根据加权的流量分担值，使用一些开销不相等的路径，发送出站数据包到目的网络。非等价的负载分担，是通过使用 `variance <multiplier>` 这条路由器配置命令启用的。


其中的 `<multiplier>` 关键字，是个介于 1 与 128 之间的整数。默认的倍数 1，意味着无非等价的负载分担执行。这一默认设置在下面的 `show ip protocols` 命令输出中得以演示。


```console
R2#show ip protocols
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
    150.1.1.2/32
    150.2.2.2/32
  Routing Information Sources:
    Gateway         Distance      Last Update
    150.2.2.1             90      00:00:52
    150.1.1.1             90      00:00:52
  Distance: internal 90 external 170
```

所谓倍数，是个可变整数，指示路由器在有着度量值低于最小度量值乘以倍数的路由上分担负载。例如，当指定了 5 的方差时，就会指示路由器，在那些度量值小于 5 倍最小度量值的路由上负载分担。默认的方差 1，就会告诉路由器，执行等价的负载均衡。在 `variance` 命令被用到，且某个除 1 以外的值被指定作为倍数时，那么路由器就将以每条单独路由的度量值，按比例在这些路由之间分配流量。换句话说，相比那些有着较高度量值的路径，路由器将使用那些有着较低度量值的路径发送更多流量。

下图 22.11 演示了个运行 EIGRP 的基本网络。其中 `R1` 和 `R2` 经由两条背对背串行链路相连。两台路由器之间的 `150.1.1.0/24` 链路，有着 1,024Kbps 的带宽。两台路由器之间的 `150.2.2.0/24` 链路，有着 768Kbps 的带宽。`R1` 正经由 EIGRP 将 `172.16.100.0/24` 这个前缀通告给 `R2`。


![掌握 EIGRP 的非等价负载均衡](../images/3611.png)

<a name="f-22.11"></a>
**图 22.11** -- **理解 EIGRP 的方差**

基于图 22.11 中所示的拓扑结构，`R2` 上路由表中的 `172.16.100.0/24` 前缀如下输出中所示：


```console
R2#show ip route 172.16.100.0 255.255.255.0
Routing entry for 172.16.100.0/24
  Known via “eigrp 150”, distance 90, metric 3014400, type internal
  Redistributing via eigrp 150
  Last update from 150.1.1.1 on Serial0/0, 00:00:11 ago
  Routing Descriptor Blocks:
  * 150.1.1.1, from 150.1.1.1, 00:00:11 ago, via Serial0/0
      Route metric is 3014400, traffic share count is 1
      Total delay is 20100 microseconds, minimum bandwidth is 1024 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
```

以下 EIGRP 的拓扑数据表，同时显示了接续者路由，以及可行接续者（FS）路由：

```console
R2#show ip eigrp topology 172.16.100.0 255.255.255.0
IP-EIGRP (AS 150): Topology entry for 172.16.100.0/24
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 3014400
  Routing Descriptor Blocks:
  150.1.1.1 (Serial0/0), from 150.1.1.1, Send flag is 0x0
      Composite metric is (3014400/28160), Route is Internal
      Vector metric:
        Minimum bandwidth is 1024 Kbit
        Total delay is 20100 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
  150.2.2.1 (Serial0/1), from 150.2.2.1, Send flag is 0x0
      Composite metric is (3847680/28160), Route is Internal
      Vector metric:
        Minimum bandwidth is 768 Kbit
        Total delay is 20100 microseconds
        Reliability is 255/255
        Load is 1/255
        Minimum MTU is 1500
        Hop count is 1
```

为确定出要配置与该路由器的方差，咱们可使用以下公式：

```console
方差 = 考虑中的那些路径的最高度量值/最佳路由的度量值
```

使用这个公式，咱们便可计算出要配置在 `R2` 上的方差值，如下所示：

```console
方差 = 考虑中的那些路径的最高度量值/最佳路由的度量值
方差 = 3847680/3014400
方差 = 1.28
````

然后这个值必须向上取到最接近的整数，在这一情形下其便是 2。鉴于此，`R2` 便可通过在路由器配置模式下，实施以下配置，配置为执行非等价的负载共享：

```console
R2(config)#router eigrp 150
R2(config-router)#variance 2
R2(config-router)#exit
```

这一配置之后，`172.16.100.0/24` 的路由数据表条目如下所示。

```console
R2#show ip route 172.16.100.0 255.255.255.0
Routing entry for 172.16.100.0/24
  Known via “eigrp 150”, distance 90, metric 3014400, type internal
  Redistributing via eigrp 150
  Last update from 150.2.2.1 on Serial0/1, 00:00:36 ago
  Routing Descriptor Blocks:
    150.2.2.1, from 150.2.2.1, 00:00:36 ago, via Serial0/1
      Route metric is 3847680, traffic share count is 47
      Total delay is 20100 microseconds, minimum bandwidth is 768 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
  * 150.1.1.1, from 150.1.1.1, 00:00:36 ago, via Serial0/0
      Route metric is 3014400, traffic share count is 60
      Total delay is 20100 microseconds, minimum bandwidth is 1024 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
```

其中的流量分担分隔（`traffic share count`）表明，对于每 60 个经由 `Serial0/0` 转发的数据包，路由器将经由 `Serial0/1` 转发 47 个数据包。这是在考虑两条路径的路由度量值下，按比例完成的。这是 `variance` 命令部署后的默认行为。这种智能的流量分担功能，是经由 `traffic-share balanced` 这条路由器配置命令启用的，而其无需显式配置。

**注意**：`traffic-share balanced` 这条命令默认是启用的，且即使手动配置了也不会出现在运行配置中。这点在下面得以演示。

```console
R2(config)#router eigrp 150
R2(config-router)#vari 2
R2(config-router)#traffic-share balanced
R2(config-router)#exit
R2(config)#do show run | begin router
router eigrp 150
variance 2
network 150.1.1.2 0.0.0.0
network 150.2.2.2 0.0.0.0
no auto-summary
```


## 加速 EIGRP 网络的收敛

正如这一小节前面所指出的，在 `variance` 命令被用到时，所有满足可行条件（FC），且度量值小于最小度量值乘以倍数的路径，都将被安装到路由表中。路由器随后将使用所有路径，并根据路由的度量值，按比例负载分担流量。

在一些情形下，咱们会打算允许一些诸如可行后续（FS）路由等替代路由被置于路由表中而不被使用，除非后续路由被移除。此类操作的执行，通常是在启用 EIGRP 的网络中缩短收敛时间。要理解这一概念，请回想一下，默认情况下路由器只会将后续路由置于 IP 路由表中。当该后续路由不再可用时，可行后续（FS）路由便会被被提升为后续路由。这条路由随后便会作为到目的网络的主要路径，被安装到路由表中。

`traffic-share min across-interfaces` 这条路由器配置命令，可与 `variance` 命令结合使用，将那些度量值小于最小度量值乘以倍数的所有路由，都安装到路由表中，而仅使用有着最小（最佳）度量值的路由转发数据包，直到该路由不可用为止。这种配置的主要目的，是在这条主路由丢失的情况下，替代路由已在路由表中，并可被立即使用。

以下配置示例，使用了上 [图 22.11](#f-22.11) 中所示的拓扑结构，演示如何将路由器配置为，把那些度量值小于两倍最小度量值的路由置于路由表中，而只使用有着最小度量值的那条路由，来实际转发数据包：

```console
R2(config)#router eigrp 150
R2(config-router)#vari 2
R2(config-router)#traffic-share min across-interfaces
R2(config-router)#exit
```

这一配置会得到路由表中 `172.16.100.0/24` 条目的以下输出：


```console
R2#show ip route 172.16.100.0 255.255.255.0
Routing entry for 172.16.100.0/24
  Known via “eigrp 150”, distance 90, metric 3014400, type internal
  Redistributing via eigrp 150
  Last update from 150.2.2.1 on Serial0/1, 00:09:01 ago
  Routing Descriptor Blocks:
    150.2.2.1, from 150.2.2.1, 00:09:01 ago, via Serial0/1
      Route metric is 3847680, traffic share count is 0
      Total delay is 20100 microseconds, minimum bandwidth is 768 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
  * 150.1.1.1, from 150.1.1.1, 00:09:01 ago, via Serial0/0
      Route metric is 3014400, traffic share count is 1
      Total delay is 20100 microseconds, minimum bandwidth is 1024 Kbit
      Reliability 255/255, minimum MTU 1500 bytes
      Loading 1/255, Hops 1
```

正如上面输出中所示，根据这一 `variance` 配置，两条不同度量值的路由，已被安装到路由表中。但是，请注意，经由 `Serial0/1` 的路由的流量分担份额为 0，而经由 `Serial0/0` 路由的流量分担份额为 1。这意味着即使经由 `Serial0/1` 的路由条目已安装到路由表中，路由器也将不经由 `Serial0/1` 发送任何数据包到 `172.16.100.0/24`，直到经由 `Serial0/0` 的路径不再可用。

**译注**：不论是非等价的 EIGRP 负载分担，还是通过使用 `traffic-share min across-interfaces` 路由器配置命令实现可行后续路由的安装到路由表，均是在本地路由器上配置的。


> *知识点*：
>
> + equal cost load sharing/banlance
>   - the default value of four maximum paths, can be changed to up to a maximum of six equal cost paths
>   - the router distributes the load evenly among all paths
>   - one packet is sent on each individual path
>
> + unequal cost load sharing
>   - allows EIGRP to use unequal cost paths, to send outgoing packets to the destination network, based on weighted traffic share values
>   - is enabled by using the `variance <multiplier>` router configuration command
>   - the `<multiplier>` keyword, is an integer between 1 and 128, tells the router to load share across routes that have a metric is less than the minimum metric multiplied by the multiplier
>   - a multiplier of 1, which is the default, implies that no unequal cost load sharing is being performed
>   - when the `variance` command is used, and a value other than 1 is specified as the multiplier, the router will distribute traffic among the routes proportionately, with respect to the metircs of each individual route, in other words, the router will send more traffic using those paths with lower metric values than those with higher metric values
>   - to determine the variance value to configure on the router, use this formula: `Variance = Highest metric for the paths being considered / Metric for the best route`
>   - that formula result value, must then be rounded up to the nearest whole integer
>
> - `traffic-share balanced` command is enabled by default, and even if manually configured, it still does not appear in the running configuration
>
> - when the `variance` command is used, all paths that meet the Feasible Condition, FC, and have a metric that is less than the minimum metric multiplied by the multiplier, will be installed into the routing table, the router will then use all paths and load share traffic proportionately based on the route metric
>
> + to allow alternate routes, such as the Feasible Successor(FS) route, to be placed in to the routing table, but not be used unless the Successor route is removed
>   - are typically performed to reduce convergence time in EIGRP-enabled networks
>   - by default, the router only places the Successor route into the IP routing table
>   - when the Successor route is no longer available, the Feasible Successor(FS) route is promoted to the Successor route, this route is then installed into the routing table, as the primary path to the destination network
>   - the `traffic-share min across-interfaces` router configuration command, can be used in conjunction with the `variance` command, to install all routes that have a metric less than the minimum metric multiplied by the multiplier, into the routing table, but use only the route with the minimum (best) metric to forward packets, until that route becomes unavailable
>   - this configuration is mainly for the event that the primary route is lost, the alternative route is already in the routing table, and can be used immediately

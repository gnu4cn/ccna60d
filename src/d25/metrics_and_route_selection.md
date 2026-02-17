# 路由度量值与最佳路由选择

在以下小节中，咱们将了解 OSPF 度量值及其计算方法。

## 计算 OSPF 度量值

OSPF 的度量值，通常称为开销。开销是使用公式 <code>10<sup>8</sup> / 带宽</code>（以 bps 为单位），从链路带宽推导出的。这意味着不同链路，会根据其带宽分配不同的开销值。使用这个公式，`10Mbps` 以太网接口的 OSPF 开销将计算如下：

<code>
<li>开销 = 10<sup>8</sup> / 带宽（ bps ）</li>
<li>开销 = 100,000,000 / 10,000,000</li>
<li>开销 = 10</li>
</code>

使用同一公式，某条 `T1` 链路的 OSPF 开销将被计算如下：

<code>
<li>开销 = 10<sup>8</sup> / 带宽（ bps ）</li>
<li>开销 = 100,000,000 / 1,544,000</li>
<li>开销 = 64.77</li>
</code>

**注意**：计算 OSPF 度量值时，浮点数不会用到。因此，任何此类值都会四舍五入到最接近整数。因此对于前面这个示例，`T1` 链路的实际开销，将向下舍入为 64。

正如早先曾演示过的，接口的 OSPF 开销可通过使用 `show ip ospf interface [name]` 命令查看。用于度量值计算中的默认参考带宽，可在 `show ip protocols` 命令的输出中查看，如下输出中所示：

```console
R4#show ip protocols
Routing Protocol is “ospf 4”
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Router ID 4.4.4.4
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Maximum path: 4
  Routing for Networks:
    0.0.0.0 255.255.255.255 Area 2
Reference bandwidth unit is 100 mbps
  Routing Information Sources:
    Gateway         Distance      Last Update
    3.3.3.3         110           00:00:03
  Distance: (default is 110)
```


用于 OSPF 开销计算的默认参考带宽，可通过使用 `auto-cost reference-bandwidth <1-4294967>` 这条路由器配置命令，并指定以 Mbps 为单位的参考带宽值调整。在那些有着超过 100Mbps 带宽值，例如 `GigabitEthernet` 链路的网络中，这一做法尤为重要。在此类网络中，指派给 `GigabitEthernet` 链路的默认值，将与 `FastEthernet` 的默认值相同。大多数情况下，这肯定是不可取的，尤其是当 OSPF 试图在两条链路上负载均衡时。

要防止这种开销值计算偏差，`auto-cost reference-bandwidth 1000` 这条路由器配置命令就应在路由器上执行。这会导致该路由器上，使用新参考带宽值的一次开销值重新计算。例如，这一配置之后，`T1` 链路的开销将重新计算如下：


<code>
<li>开销 = 10<sup>9</sup> / 带宽（ bps ）</li>
<li>开销 = 1,000,000,000 / 1,544,000</li>
<li>开销 = 647.66</li>
</code>

**注意**：同样，由于 OSPF 的度量值不支持浮点数，因此这会四舍五入为仅 647 的度量值，如以下输出中所示：

```console
R4#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
  Internet Address 10.0.2.4/24, Area 2
  Process ID 4, Router ID 4.4.4.4, Network Type POINT_TO_POINT, Cost: 647
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 60, Wait 60, Retransmit 5
    oob-resync timeout 60
    Hello due in 00:00:01
  Supports Link-local Signaling (LLS)
  Index 2/2, flood queue length 0
  Next 0x0(0)/0x0(0)
  Last flood scan length is 1, maximum is 1
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 0, Adjacent neighbor count is 0
  Suppress Hello for 0 neighbor(s)
```

当 `auto-cost reference-bandwidth 1000` 这条路由器配置命令被执行后，Cisco 10S 软件会打印以下信息，表明这同一个值应被应用到 OSPF 域内的所有路由器。这在以下输出中得以演示：


```console
R4(config)#router ospf 4
R4(config-router)#auto-cost reference-bandwidth 1000
% OSPF: Reference bandwidth is changed.
        Please ensure reference bandwidth is consistent across all routers.
```

虽然这看起来像是条重要告警，但请记住，这条命令的使用只会影响本地路由器。并不强制要求要在所有路由器上配置这条命令；但出于考试目的，要确保一致配置在所有路由器上得以部署。

## 影响 OSPF 的度量值计算


OSPF 度量值的计算，可通过执行以下操作而直接影响：

- 使用 `bandwidth` 命令调整接口带宽
- 使用 `ip ospf cost` 命令手动指定某个开销


`bandwidth` 命令的用法，曾在 [早先的一个教学模组](../d22/metrics_dual_and_topology_table.html#运用接口带宽影响-eigrp-的度量值计算) 中，我们讨论 `EIGRP` 的度量值计算时讨论过。正如前面曾指出的，默认的 OSPF 开销，是通过将链路带宽除以 10<sup>8</sup>， 或 100 Mbps 的参考带宽计算出的。增加或减少链路带宽，都会直接影响特定链路的 OSPF 开销。这种做法通常是用于确保一条路径优先于另一路径的一种路径控制机制。

然而，正如在 [早先的那个教学模组](../d22/metrics_dual_and_topology_table.html#运用接口带宽影响-eigrp-的度量值计算) 中介绍的，`bandwidth` 命令影响的不仅仅是路由协议。出于这一原因，第二种方法，即手动指定开销值，是影响 OSPF 度量值计算的推荐方法。


`ip ospf cost <1-65535>` 这条接口配置命令，用于手动指定链路的开销。这个值越低，那么这条链路优先于其他到同一目标网络，却有着更高开销值链路的可能性就越大。以下示例演示了针对一条串行 (`T1`) 链路，配置 5 的 OSPF 开销：

```console
R1(config)#interface Serial0/0
R1(config-if)#ip ospf cost 5
R1(config-if)#exit
```

这一配置可使用 `show ip ospf interface [name]` 命令加以验证，如下输出中所示：


```console
R1#show ip ospf interface Serial0/0
Serial0/0 is up, line protocol is up
  Internet Address 10.0.0.1/24, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type POINT_TO_POINT, Cost: 5
  Transmit Delay is 1 sec, State POINT_TO_POINT,
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    oob-resync timeout 40
    Hello due in 00:00:04
  Index 2/2, flood queue length 0
  Next 0x0(0)/0x0(0)
  Last flood scan length is 1, maximum is 4
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 1, Adjacent neighbor count is 1
    Adjacent with neighbor 2.2.2.2
  Suppress Hello for 0 neighbor(s)
```



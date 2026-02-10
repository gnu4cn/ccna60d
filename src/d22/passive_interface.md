# 理解被动接口

如这一教学模组 [前面](route_summarization.md#被动接口) 曾提到的，当针对某个网络启用 EIGRP 时，路由器将开始在所有属于这一指定网络范围的接口上发送 `Hello` 报文。这使得 EIGRP 能够动态发现邻居并建立网络关系。对于那些比如以太网及串行接口等实际连接到物理介质的接口而言，这种行为是理想的。然而，这种默认行为也会导致路由器资源在比如环回接口等逻辑接口上路由器资源的不必要浪费，这些接口永远不会连接其他设备，因此路由器也无法与其他设备建立 EIGRP 邻居关系。

Cisco IOS 软件允许管理员，使用 `passive-interface [name|default]` 这条路由器配置命令，指定命名接口为被动，或指定所有接口为被动。EIGRP 的数据包不会在被动接口上发出；因此，就不会有邻居关系在被动接口之间建立。以下输出演示了，如何在某个路由器上将两个 EIGRP 已启用的接口，配置为被动接口：

```console
R1(config)#interface Loopback0
R1(config-if)#ip address 10.0.0.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Loopback1
R1(config-if)#ip address 10.1.1.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Serial0/0
R1(config-if)#ip address 150.1.1.1 255.255.255.0
R1(config-if)#exit
R1(config)#router eigrp 150
R1(config-router)#no auto-summary
R1(config-router)#network 150.1.1.0 0.0.0.255
R1(config-router)#network 10.0.0.0 0.0.0.255
R1(config-router)#network 10.1.1.0 0.0.0.255
R1(config-router)#passive-interface Loopback0
R1(config-router)#passive-interface Loopback1
R1(config-router)#exit
```

基于这一配置，`Loopback0` 和 `Loopback1` 均已启用 EIGRP 路由，进而这两个直连网络就将被通告到 EIGRP 的邻居。但是，不会有 EIGRP 数据包，将由 `R1` 从这两个接口上发出。另一方面，`Serial0/0` 也配置了 EIGRP 路由，但 EIGRP 被允许在这个接口上发送数据包，因为他不是个被动接口。所有三个网络条目被安装在了 EIGRP 的拓扑数据表中，如下所示。

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
P 150.1.1.0/24, 1 successors, FD is 2169856
        via Connected, Serial0/0
```

但是，`show ip eigrp interfaces` 命令的输出显示，EIGRP 的路由只针对 `Serial0/0` 接口启用，如下所示。

```console
R1#show ip eigrp interfaces
IP-EIGRP interfaces for process 150

                      Xmit Queue   Mean    Pacing Time     Multicast     Pending
Interface      Peers  Un/Reliable  SRTT    Un/Reliable     Flow Timer    Routes
Se0/0            1        0/0        0        0/15             0            0
```

咱们还可在 `show ip protocols` 命令的输出中，查看那些配置为被动的接口，如下所示。

```console
R1#show ip protocols
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
    10.0.0.0/24
    10.1.1.0/24
    150.1.1.0/24
  Passive Interface(s):
    Loopback0
    Loopback1
  Routing Information Sources:
    Gateway         Distance      Last Update
  Distance: internal 90 external 170
```

`[default]` 关键字会使所有接口都成为被动接口。假设某个路由器配置了 50 个 `Loopback` 接口。当咱们打算使每个 `Loopback` 接口都成为被动接口时，那么咱们就需要添加 50 行代码。`passive-interface default` 这条命令，便可用于使所有接口都成为被动。而那些咱们确实想要其发送 EIGRP 数据包的接口，此时便可以 `no passive-interface [name]` 命令加以配置。以下输出演示了 `passive-interface default` 这条命令的用法：

```console
R1(config)#interface Loopback0
R1(config-if)#ip address 10.0.0.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Loopback1
R1(config-if)#ip address 10.1.1.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Loopback3
R1(config-if)#ip address 10.3.3.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Loopback2
R1(config-if)#ip address 10.2.2.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface Serial0/0
R1(config-if)#ip address 150.1.1.1 255.255.255.0
R1(config-if)#exit
R1(config-router)#network 10.0.0.1 255.255.255.0
R1(config-router)#network 10.1.1.1 255.255.255.0
R1(config-router)#network 10.3.3.1 255.255.255.0
R1(config-router)#network 10.2.2.1 255.255.255.0
R1(config-router)#network 150.1.1.1 255.255.255.0
R1(config-router)#passive-interface default
R1(config-router)#no passive-interface Serial0/0
R1(config-router)#exit
```

如下所示，`show ip protocols` 可用于查看 EIGRP 下哪些接口属于被动接口：

```console
R1#show ip protocols
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
    10.0.0.0/24
    10.1.1.0/24
    10.2.2.0/24
    10.3.3.0/24
    150.1.1.0/24
  Passive Interface(s):
    Loopback1
    Loopback2
    Loopback3
    Loopback4
  Routing Information Sources:
    Gateway         Distance       Last Update
    (this router)         90       00:02:52
  Distance: internal 90 external 170
```


通过使用 `passive-interface default` 这条命令，多个被动接口的配置得以简化与减少。在与 `no passive-interface Serialo/0` 命令结合使用时，ERGRP 数据包仍会在 `Serial0/0` 上发出，从而允许 EIGRP 的邻居关系在该接口上得以建立，如下所示。

```console
R1#show ip eigrp neighbors
IP-EIGRP neighbors for process 150
H   Address      Interface  Hold  Uptime    SRTT  RTO    Q      Seq
                            (sec)           (ms)         Cnt    Num
0   150.1.1.2    Se0/0      12    00:02:47  1     3000   0      69
```



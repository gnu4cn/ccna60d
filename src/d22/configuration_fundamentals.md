# EIGRP 配置基础


在 Cisco IOS 中，EIGRP 是通过使用 `router eigrp [ASN]` 这条全局配置命令启用的。其中 `[ASN]` 关键字指定 EIGRP 自治系统的编号 (ASN)。这是一个介于 1 到 65535 之间的 32 位整数。除这一课后面将介绍的其他因素外，运行 EIGRP 的路由器必须位于同一自治系统内，才能成功形成邻居关系。在 `router eigrp [ASN]` 这条全局配置命令的配置后，路由器就会切换到 EIGRP 路由器配置模式，在该模式下，咱们可配置那些与 EIGRP 相关的参数。已配置的 ASN，可在 `show ip protocols` 命令的输出中验证予以检查，如下所示：

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

[Truncated Output]
```


除 `show ip protocols` 命令外，`show ip eigrp neighbors` 命令也会打印出所有已知 EIGRP 邻居，及其相应自治系统的信息。这条命令及其可用选项，将在这一教学模组稍后详细介绍。在运行多个 EIGRP 实例的路由器上，`show ip eigrp [ASN]` 命令可用于查看，仅与该命令中指定自治系统相关的信息。这条命令的用法，在下面的输出得以演示：

```console
R1#show ip eigrp 150 ?
  interfaces  IP-EIGRP interfaces
  neighbors   IP-EIGRP neighbors
  topology    IP-EIGRP topology table
  traffic     IP-EIGRP traffic statistics
```

在上面的输出中，`150` 便是 ASN。当 `show ip eigrp` 命令下未指定某个自治系统时，那么在 Cisco IOS 下默认便会打印所有 EIGRP 实例的信息。

进入路由器配置模式后，`network` 命令即被用于指定 EIGRP 路由将针对哪个/哪些网络（接口）启用。在 `network` 命令被用到，且某个主有类网络被指定时，那么在这个启用 EIGRP 的路由器上，以下操作就会被执行：

- EGIRP 会针对那些位于这个指定有类网络范围内的网络启用；
- 拓扑数据表会根据这些直连子网产生出来；
- EIGRP `Hello` 数据包会从与这些子网关联的接口发送出去；
- EIGRP 会在 `Update` 报文中，将这些网络通告给 EIGRP 邻居；
- 基于报文交换，EIGRP 的路由随后便会添加到 IP 路由表中。


例如，假设路由器配置了以下的一些 `Loopback` 接口：

- `LoopbackO` -- IP 地址 `10.0.0.1/24`
- `Loopback1` -- IP 地址 `10.1.1.1/24`
- `Loopback2` -- IP 地址 `10.2.2.1/24`
- `Loopback3` -- IP 地址 `10.3.3.1/24`

那么当 EIGRP 被启用以供使用，且主有类的 `10.0.0.0/8` 网络与 `network` 这条路由器配置命令结合使用时，则全部四个 `Loopback` 接口都会启用 EIGRP 的路由。这在以下输出种得以演示：

```console
R1#show ip eigrp interfaces
IP-EIGRP interfaces for process 150

                     Xmit Queue   Mean    Pacing Time    Multicast      Pending
Interface      Peers Un/Reliable  SRTT    Un/Reliable    Flow Timer     Routes
Lo0            0         0/0         0        0/10            0             0
Lo1            0         0/0         0        0/10            0             0
Lo2            0         0/0         0        0/10            0             0
Lo3            0         0/0         0        0/10            0             0
```

咱们可使用 `show ip protocols` 这条命令，验证 EIGRP 是否已针对 `10.0.0.0/8` 这个主有类网络启用。这一命令的输出如下所示：

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
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.0
    Routing Information Sources:
        Gateway         Distance    Last Update
    Distance: internal 90 external 170
```

EIGRP 的拓扑数据表，可通过使用 `show ip eigrp topology` 命令查看。这一命令的输出如下所示：

```console
R1#show ip eigrp topology
IP-EIGRP Topology Table for AS(150)/ID(10.3.3.1)

Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.3.3.0/24, 1 successors, FD is 128256
        via Connected, Loopback3
P 10.2.2.0/24, 1 successors, FD is 128256
        via Connected, Loopback2
P 10.1.1.0/24, 1 successors, FD is 128256
        via Connected, Loopback1
P 10.0.0.0/24, 1 successors, FD is 128256
        via Connected, Loopback0
```

**注意**：拓扑数据表、EIGRP `Hello` 数据包及 `Update`报文，均会在这个教学模组稍后详细介绍。这一小节的重点，仅限于 EIGRP 的配置实施。


使用 `network` 命令指定某个主有类网络，以最少的配置，允许了位于该有类网络范围内的多个子网，在同一时间得以通告。不过，在某些情况下，管理员可能不希望某个有类网络种的全部子网，都被针对 EIGRP 路由启用。例如，参考前面示例中 `R1` 上配置那些的 `Loopback` 接口，假设咱们只打算对 `10.1.1.0/24` 和 `10.3.3.0/24` 两个子网启用 EIGRP 路由，而不希望针对 `10.0.0.0/24` 和 `10.2.2.0/24` 两个子网启用 EIGRP 路由。尽管当咱们在使用 `network` 命令时，指定出这两个网络（即 `10.1.1.0` 和 `10.3.3.0`），这似乎是可行的，但 Cisco IOS 软件仍会将这两条语句，转换为 `10.0.0.0/8` 的主有类网络，如下所示：

```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0
R1(config-router)#network 10.3.3.0
R1(config-router)#exit
```

尽管有上面的配置，`show ip protocols` 命令仍显示以下内容：


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
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.0.0.0
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

**注意**： 一种常见误解，就是关闭 EIGRP 的自动汇总特性，就能解决此问题；但是，这与 `auto-summary` 命令一点关系都没有。比如，假设在前一示例中的配置，执行 `no auto-summary` 命令，如下所示：

```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0
R1(config-router)#network 10.3.3.0
R1(config-router)#no auto-summary
R1(config-router)#exit
```

`show ip protocols` 命令仍会显示对网络 `10.0.0.0/8` 开启了 EIGRP，如下面的输出所示：

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
        10.0.0.0
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```


<a name="wildcard-mask"></a>
为了提供对那些启用了 EIGRP 路由网络的更细粒度控制，Cisco IOS 软件支持在配置 EIGRP 时，与 `network` 语句一起结合使用的通配符掩码。所谓通配符掩码，会以与 ACL 中用到的通配符掩码类似方式运行，并独立于网络的子网掩码。

例如，命令 `network 10.1.1.0 0.0.0.255` 将匹配 `10.1.1.0/24` 网络、`10.1.1.0/26` 网络及 `10.1.1.0/30` 网络。参考前面输出中配置的两个 `Loopback` 接口，`R1` 将被配置如下，以启用 `10.1.1.0/24` 和 `10.3.3.0/24` 两个子网的 EIGRP 路由，而不启用 `10.0.0.0/24` 子网或 `10.2.2.0/24` 子网的：


```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.0 0.0.0.255
R1(config-router)#network 10.3.3.0 0.0.0.255
R1(config-router)#exit
```

这种配置可使用 `show ip protocols` 命令予以验证，如下所示：

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
    Automatic network summarization is in effect
    Maximum path: 4
    Routing for Networks:
        10.1.1.0/24
        10.3.3.0/24
    Routing Information Sources:
        Gateway     Distance        Last Update
Distance: internal 90 external 170
```

此外，`show ip eigrp interfaces` 命令可用于验证 EIGRP 路由是否已只针对 `Loopback1` 与 `Loopback3` 启用。

```console
R1#show ip eigrp interfaces
IP-EIGRP interfaces for process 150

                     Xmit Queue   Mean    Pacing Time    Multicast      Pending
Interface      Peers Un/Reliable  SRTT    Un/Reliable    Flow Timer     Routes
Lo1            0         0/0         0        0/10            0             0
Lo3            0         0/0         0        0/10            0             0
```


如上面的输出种所示，由于这种通配符掩码，EIGRP 路由就只针对 `Loopback1` 和 `Loopback3` 启用。

请务必记住，`network` 命令可通过使用子网掩码，而不是通配符掩码配置。在这种情况下，Cisco IOS 软件会反转子网掩码，同时该命令会使用通配符掩码保存。例如，参考路由器上的同样两个 `Loopback` 接口，`R1` 也可被配置如下：

```console
R1(config-router)#router eigrp 150
R1(config-router)#network 10.1.1.0 255.255.255.0
R1(config-router)#network 10.3.3.0 255.255.255.0
R1(config-router)#exit
```

基于这一配置，以下内容便会输入到运行配置中（我（作者）已使用管道，向下深入到我感兴趣的配置部分）：

```console
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
network 10.3.3.0 0.0.0.255
auto-summary
```


从上面的配置咱们看出，咱们将管道与 `show` 命令一起使用，以获得更细的粒度。对于有编程知识的人来说，这个概念并不陌生。

当网络上的某个特定地址，与通配符掩码一起结合使用时，Cisco 10S 软件就会执行一次逻辑 `AND` 运算，以确定将针对其启用 EIGRP 的网络。例如，当 `network 10.1.1.15 0.0.0.255` 命令被执行时，Cisco I0S 就会执行以下操作：

- 将通配符掩码，反转为 `255.255.255.0` 的子网掩码值
- 执行一次逻辑 `AND` 运算
- 将 `network 10.1.1.0 0.0.0.255` 这条命令，添加到配置中


这个示例中使用的 `network` 配置，如下输出中所示：

```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.15 0.0.0.255
R1(config-router)#exit
```

那么基于此配置，路由器上的运行配置，就会显示如下内容：

```console
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
auto-summary
```

基于这一配置，那么路由器上的运行配置会显示以下内容：


```console
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
auto-summary
```

当网络上的特定地址，与子网掩码一起使用时，路由器会执行同样的逻辑 `AND` 运算，并使用通配符掩码格式，将这条 `network` 命令添加到运行配置中。这在下面的配置得以演示。

```console
R1(config)#router eigrp 150
R1(config-router)#network 10.1.1.15 255.255.255.0
R1(config-router)#exit
```

基于这一配置，以下内容会被添加到路由器上的当前配置中：


```console
R1#show running-config | begin router eigrp
router eigrp 150
network 10.1.1.0 0.0.0.255
auto-summary
```

如上面的配置中所示，在 Cisco 10S 软件中，不论使用通配符掩码还是子网掩码，都会得到同样的操作与 `network` 语句配置。

> **真实世界的部署**
>
> 当在生产网络中配置 EIGRP 时，通常的做法是使用全为 0 的通配符掩码，或全为 1 的子网掩码。例如，`network 10.1.1.1 0.0.0.0` 与 `network 10.1.1.1 255.255.255.255` 两条命令，会执行同一操作。在通配符掩码中使用全 0，或在子网掩码中使用全 1，均会将 Cisco IOS 软件，配置为匹配某个与准确接口地址，而不论该接口本身配置的子网掩码。例如，这两条命令中的任何一条，都将匹配以 `10.1.1.1/8`、`10.1.1.1/16`、`10.1.1.1/24` 及 `10.1.1.1/30` 地址配置的那些接口。这两条命令的用法，在以下输出中得以演示：
>
> ```console
> R1(config)#router eigrp 150
> R1(config-router)#network 10.0.0.1 0.0.0.0
> R1(config-router)#network 10.1.1.1 255.255.255.255
> R1(config-router)#exit
> ```
> 如下所示，`show ip protocols` 这条命令，验证了这两条 `network` 语句的配置，在路由器上是否以类似方式得以处理。
>
>
> ```console
> R1#show ip protocols
> Routing Protocol is “eigrp 150”
>     Outgoing update filter list for all interfaces is not set
>     Incoming update filter list for all interfaces is not set
>     Default networks flagged in outgoing updates
>     Default networks accepted from incoming updates
>     EIGRP metric weight K1=1, K2=0, K3=1, K4=0, K5=0
>     EIGRP maximum hopcount 100
>     EIGRP maximum metric variance 1
>     Redistributing: eigrp 150
>     EIGRP NSF-aware route hold timer is 240s
>     Automatic network summarization is in effect
>     Maximum path: 4
>     Routing for Networks:
>         10.0.0.1/32
>         10.1.1.1/32
>     Routing Information Sources:
>         Gateway     Distance        Last Update
> Distance: internal 90 external 170
> ```
>
> 当全为 1 的子网掩码，或全为 0 的通配符掩码被用到时，那么针对指定的（匹配的）接口，EIGRP 即被启用，同时该接口所在的网络即被通告。换句话说，EIGRP 将不通告上述输出中的 `/32` 地址，相反，他会根据配置在匹配接口上的子网掩码，通告具体的网络。这中配置的用法，与匹配的具体接口上配置的子网掩码无关。



> *知识点*：
>
> - In Cisco IOS, EIGRP is enabled by using the `router eigrp [ASN]` global configuration command
>
> + ASN
>   - the `[ASN]` keyword, designates the EIGRP autonomous system number, ASN
>   - is a 32-bit integer, between 1 and 65535
>   - routers running EIGRP, must reside within the same autonomous system, to successfully form a neighbor relationship
>   - the configured ASN, can be verified in the output of the `show ip protocols` command
>
> - The router transitions to EIGRP Router Configration mode, after the configuration of the `router eigrp [ASN]` global configuration command
> - in EIGRP Router Configration mode, we can configure parameters pertaining to EIGRP
> - also the `show ip eigrp neighbors` command, prints information about all known EIGRP neighbors and their respective autonomous systems
> - On routers running multiple instances of EIGRP, the `show ip eigrp [ASN]` command, can be used to view information pertianing only to the autonomous system that is specified in this command
>
> - when no autonomous system specified with the `show ip eigrp` command, it will print information on all EIGRP instances
>
> - in Router Configration mode, the `network` command is used to specify the network(s) (intefaces) for which EIGRP routing will be enabled
>
> + when the `network` command is used, and a major classful network is specified, the following actions are performed on the EIGRP-enabled router:
>   - EIGRP is enabled for networks that fall within the specified classful network range
>   - the topology tables is populated with these directly connected subnets
>   - EIGRP `Hello` packets are sent out of the interfaces associated with these subnets
>   - EIGRP advertises the network(s) to EIGRP neighbors in `Update` messages
>   - Based on the exchange of Messages, EIGRP routes are then added to the IP routing table
>
> - The topology table, can be viewed by using the `show ip eigrp topology` command
>
> - using the `network` command, to specify a major classful network, allows multiple subnets that fall within the classful network range to be advertised at the same time with minimal configuration
>
> - In order to provide more granular control of the networks that are enabled for EIGRP routing, Cisco IOS software supports the use of wildcard masks, in conjunction with the `network` statement, when configuring EIGRP
>
> - the wildcard mask, operates in a manner silimar to the wildcard mask used in ACLs, and is independent of the subnet mask for the network
>
> - the `network` command, can be configured by using the subnet mask, rather than the wildcard mask
>
> - when the `network` command is configured by using the subnet mask, Cisco IOS software inverts the subnet mask, and the command is saved by using the wildcard mask
>
> - we can use pipes with `show` commands, in order to get more granularity
>
> + if a specific address on the network, is used in conjunction with the wildcard mask, Cisco IOS software performs a logical `AND` operation to determine the network that will be enabled for EIGRP.
>   - Invert the wildcard maskt to the subnet mask
>   - Performs a logical `AND` operation
>   - Add the result to the configuration
>
> + If a specific address on the network is used in conjunction with the subnet mask, the router performs the same logical `AND` operation, and adds the `network` command to the running configuration, by using the wildcard mask format
>
> - the use of the wildcard mask, or the subnet mask, results in the same operation and `network` statement configuration
>
> - it's common pratice, to use a wildcard mask all zeros, or a subnet mask of all 1s
>
> - Both methods, configure Cisco IOS software, to match an exact inteface address, regardless of the subnet mask configured on the interface itself
>
> - When a subnet mask with all ones, or a wildcard mask with all zero is used, EIGRP is enabled for the specified(matched) interface, and the network on which the interface resides, is advertised.
> - In other words, EIGRP will not advertise the `/32` address in the output above, instead, it advertises the actual network based on the subnet mask configured on the matched interface
> - The use of this configuration, is independent of the subnet mask configured on the actual inteface matched

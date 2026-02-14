# OSPF 的配置

这一小节介绍 OSPF 的配置基础知识。

## 在 Cisco IOS 软件中启用 OSPF

OSFP 在 Cisco IOS 软件中，是通过执行 `router ospf [process id]` 这条全局配置命令启用的。其中 `[process id]` 关键字具有本地意义，且无需为了建立邻接关系，而在网络中的全体路由器上相同。这个本地有意义的进程 ID 的使用，允许咱们在同一路由器上，配置多个 OSPF 实例。

OSPF 的进程 ID，是个介于 1 和 65535 之间的整数。每个 OSPF 进程，都维护着其自己的单独链路状态数据库；不过所有的路由，都会被输入到同一 IP 路由表中。换句话说，路由器上并没有针对单个 OSPF 进程配置的唯一 IP 路由表。

在 Cisco IOS 软件的早期版本中，若路由器没有至少一个配置了有效 IP 地址，处于 `up/up` 状态的接口，那么 OSPF 就不会被启用。这一限制在 Cisco 10S 软件的当前版本中已被移除。在路由器没有配置了有效 IP 地址，且处于 `up/up` 状态接口的情形下，Cisco IOS 软件将创建出一个接近数据库，a Proximity Database, PDB，进而允许进程得以被创建出来。但是，重要的是要记住，在某个路由器 ID 被选出前，这个进程将处于非活动状态，而路由器 ID 的选举，可能以以下两种方式完成：

- 在某个接口上配置一个有效的 IP 地址，并拉起该接口
- 使用 `router-id` 命令手动配置路由器 ID（见下文）


举例来说，设想下面这个禁用了所有接口的路由器：


```console
R3#show ip interface brief
Interface       IP-Address	OK?	Method	Status					Protocol
FastEthernet0/0 unassigned	YES	manual	administratively down	down
Serial0/0		unassigned	YES	NVRAM	administratively down	down
Serial0/1		unassigned	YES	unset	administratively down	down
```

接下来，OSPF 在该路由器上通过使用 `router ospf [process id]` 这条全局配置命令启用，如下输出中所示：

```console
R3(config)#router ospf 1
R3(config-router)#exit
```

根据这一配置，Cisco IOS 软件就会分配给这个进程，一个 `0.0.0.0` 的默认路由器 ID，如下 `show ip protocols` 命令的输出中所示：


```console
R3#show ip protocols
Routing Protocol is “ospf 1”
	Outgoing update filter list for all interfaces is not set
	Incoming update filter list for all interfaces is not set
	Router ID 0.0.0.0
	Number of areas in this router is 0. 0 normal 0 stub 0 nssa
	Maximum path: 4
	Routing for Networks:
Reference bandwidth unit is 100 mbps
	Routing Information Sources:
	  Gateway	Distance	Last Update

	Distance: (default is 110)
```

但是，`show ip ospf [process id]` 这条命令，却揭示了这个进程实际上不是活动的，并指出需要配置一个路由器 ID，如下所示：


```console
R3#show ip ospf 1
%OSPF: Router process 1 is not running, please configure a router-id
```

## 针对接口或网络启用 OSPF 路由

在 OSPF 已启用后，便可执行如下两项操作，以针对路由器上的一个或多个网络或接口，启用 OSPF 的路由：

- 使用 `network [network] [wildcard] area [area id]` 这条路由器配置命令（译注：原文这里有误，漏条了 `network` 命令本身）
- 使用 `ip ospf [process id] area [area id]` 这条接口配置命令


与 EIGRP 不同，通配符的掩码在 OSPF 中是强制性的，而必须加以配置；但与 EIGRP 下的情况一样，他以匹配所指定范围内的接口方式，提供了同一功能。例如，语句 `network 10.0.0.0 0.255.255.255 area 0`，会针对有着 `10.0.0.1/30`、`10.5.5.1/24`，甚至 `10.10.10.1/25` 的 IP 地址和子网掩码组合的那些接口，启用 OSPF 路由。根据这一 OSPF 网络配置，这些接口将全都被指派到 OSPF 的 `Area 0`。

**注意**：OSPF 的通配符掩码，也可按照与传统子网掩码相同的格式输入，例如，`network 10.0.0.0 255.0.0.0 area 0`。在这种情形下，Cisco IOS 软件将翻转子网掩码，进而通配符的掩码便将输入到运行配置中。此外，重要的是要记住，OSPF 还支持针对某个特定接口，使用全 1 或全 0 的通配符掩码启用 OSPF 路由。这种配置会在某个特定接口上启用 OSPF，但路由器则会通告这个接口本身上配置的具体子网掩码。

> *译注*：有关对子网掩码的翻转的详细过程，请参见 [EIGRP 配置基础](../d22/configuration_fundamentals.md#wildcard-mask)。


在 `network [network] [wildcard] area [area id]` 命令已被执行后，路由器便会在匹配所指定网络及通配符掩码组合的接口上，发送 `Hello` 数据包，并尝试发现邻居。随后所连接子网便会在 OSPF 数据库交换过程中，被通告给一个或多个邻居路由器，进而到最后，这一信息随后就会被添加到 OSPF 路由器的 OSPF 链接状态数据库中。

在 `network [network] [wildcard] area [area id]` 命令被执行后，为了确定出接口将被指派到的区域，路由器会匹配最具体的条目。例如，请设想以下这些 OSPF 的 `network` 语句配置：

- 第一条配置语句：`network 10.0.0.0 0.255.255.255 Area 0`
- 第二条：`network 10.1.0.0 0.0.255.255 Area 1`
- 第三条：`network 10.1.1.0 0.0.0.255 Area 2`
- 第四条：`network 10.1.1.1 0.0.0.0 Area 3`
- 第五条：`network 0.0.0.0 255.255.255.255 Area 4`

在路由器上的这一配置后，下表 24.1 中所示的这些环回接口，随后又会被配置于这同一路由器上。

**表 24.1** -- **指派一些接口到 OSPF 的一些区域**

| 接口 | IP 地址/掩码 |
| :-- | --: |
| `Loopback 0` | `10.0.0.1/32` |
| `Loopback 1` | `10.0.1.1/32` |
| `Loopback 2` | `10.1.0.1/32` |
| `Loopback 3` | `10.1.1.1/32` |
| `Loopback 4` | `10.2.0.1/32` |

正如前面所指出的，在 `network [network] [wildcard] area [area id]` 命令被执行后，路由器为了确定出接口将被指派到的区域，便会匹配最具体的条目。对于路由器上配置的这些 `network` 语句配置与 `Loopback` 接口，`show ip ospf interface brief` 命令将显示被指派到以下 OSPF 区域的那些接口：

```console
R1#show ip ospf interface brief
Interface	PID	Area	IP Address/Mask	Cost	State	Nbrs F/C
Lo4			1	0		10.2.0.1/32		1		LOOP	0/0
Lo1			1	0		10.0.1.1/32		1		LOOP	0/0
Lo0			1	0 		10.0.0.1/32 	1 		LOOP	0/0
Lo2 		1 	1 		10.1.0.1/32 	1 		LOOP	0/0
Lo3 		1 	3 		10.1.1.1/32 	1 		LOOP	0/0
```


**注意**：无论这些网络语句被输入的顺序如何，在运行配置中，那些最具体的条目，都会列出在路由器上 `show running-config` 命令输出的开头。

`ip ospf [process id) area [area id]` 这条接口配置命令，消除了使用 `network [network] [wildcard] area [area id]` 这条路由器配置命令的需要。这条命令会针对指定接口启用 OSPF 的路由，并将该接口指派到指定 OSPF 区域。这两条命令执行了同一基本功能，而可互换使用。

另外，举例来说，当两台路由器背靠背相连，其中一台路由器使用 `ip ospf [process id) area [area id]` 这条接口配置命令配置，而邻居路由器则使用 `network [network] [wildcard] area [area id]` 这条路由器配置命令配置时，那么假设两个区域 ID 相同，则这两台路由器将成功建立 OSPF 的邻接关系。


## OSPF 的区域

OSPF 的区域 ID，既可以配置为一个 0 与 4294967295 之间的整数，也可以使用点分十进制表示法（即使用 IP 地址的格式）。不同于 OSPF 的进程 ID，为了邻接关系得以建立，OSPF 的区域 ID 必须匹配。OSPF 区域配置的最常见类型，便是使用整数指定 OSPF 区域。不过，要确保咱们熟悉这两种受支持的区域配置方式。


## OSPF 的路由器 ID

为了让 OSPF 在某一网络上运行，其中的每个路由器，都必须要有个唯一的标识编号，而在 OSPF 的语境下，路由器 ID 编号即被用到。

在确定 OSPF 的路由器 ID 时，Cisco IOS 软件会选取已配置 `Loopback` 接口中的最高 IP 地址。当没有回环接口被配置时，那么 Cisco 10S 软件就会使用所有已配置物理接口中的最高 IP 地址，作为 OSPF 的路由器 ID。Cisco IOS 软件同样允许管理员，使用 `router-id [address]` 这条路由器配置命令，手动指定路由器 ID。

环回接口非常有用，尤其是在测试期间，因为他们不需要硬件，并属于逻辑接口，因此永远不会宕机。

在下面的路由器上，我（作者）已为 `Loopback0` 配置了 IP 地址 `1.1.1.1/32`，并为 `F0/0` 配置了 IP 地址 `2.2.2.2/24`。随后我针对该路由器上的全部接口配置了 OSPF：

```console
Router(config-if)#router ospf 1
Router(config-router)#net 0.0.0.0 255.255.255.255 area 0
Router(config-router)#end
Router#
%SYS-5-CONFIG_I: Configured from console by console

Router#show ip protocols

Routing Protocol is “ospf 1”
	Outgoing update filter list for all interfaces is not set
	Incoming update filter list for all interfaces is not set
	Router ID 1.1.1.1
	Number of areas in this router is 1. 1 normal 0 stub 0 nssa
	Maximum path: 4
	Routing for Networks:
		0.0.0.0 255.255.255.255 area 0
	Routing Information Sources:
	Gateway 	Distance	Last Update
	1.1.1.1 	     110	00:00:14
	Distance: (default is 110)
```

我（作者）打算把路由器 ID 硬编码为 `10.10.10.1`。我原本可通过以这个 IP 地址，配置另一个 `Loopback` 接口，或者我可将这一 ID 添加为 OSPF 的路由器 ID（译注：原文这里误将 "as" 写作了 "at"）。为了让这一操作生效，我就必须重新加载该路由器，或清除该路由器上的这个 IP OSPF 进程。


```console
Router#conf t
Enter configuration commands, one per line.
End with CNTL/Z.
Router(config)#router ospf 1
Router(config-router)#router-id 10.10.10.1
Router(config-router)#Reload or use “clear ip ospf process” command, for this to take effect

Router(config-router)#end
Router#
%SYS-5-CONFIG_I: Configured from console by console

Router#clear ip ospf process
Reset ALL OSPF processes? [no]: yes

Router#show ip prot

Routing Protocol is “ospf 1”
	Outgoing update filter list for all interfaces is not set
	Incoming update filter list for all interfaces is not set
	Router ID 10.10.10.1
	Number of areas in this router is 1. 1 normal 0 stub 0 nssa
	Maximum path: 4
	Routing for Networks:
		0.0.0.0 255.255.255.255 area 0
	Routing Information Sources:
	Gateway 	Distance	Last Update
	1.1.1.1 	     110	00:03:15
Distance: (default is 110)
```

路由器 ID 在其到了选举 DR 及 BDR 时，尤为重要。

## OSPF 的被动接口

所谓被动接口，可描述为于其上没有路由更新发送的接口。在 Cisco 10S 软件中，某个接口可使用 `passive-interface [name]` 这条路由器配置命令，配置为被动接口。当路由器上有多个接口需要配置为被动时，那么 `passive-interface default` 这条路由器配置命令应被使用。这一命令会将路由器上，属于所配置网络范围内的所有接口都配置为被动接口。随后，那些于其上邻接关系或邻居关系应得以允许的接口，便可通过使用 `no passive-interface [name]` 这条路由器配置命令加以配置。

针对 OSPF 和 EIGRP，被动接口的配置工作方式相同，即当某个接口被标记为被动时，那么经由该接口的所有邻居关系都将被拆除，同时 `Hello` 数据包将不会经由该接口发送或接收。不过，根据路由器上的 `network` 语句配置，该接口将继续被通告。

```console
Router(config)#router ospf 10
Router(config-router)#passive-interface f0/0

Router#show ip ospf int f0/0
FastEthernet0/0 is up, line protocol is up
	Internet address is 192.168.1.1/24, Area 0
	Process ID 10,Router ID 172.16.1.1,Network Type BROADCAST, Cost: 1
	Transmit Delay is 1 sec, State WAITING, Priority 1
	No designated router on this network
	No backup designated router on this network
	Timer intervals configured,Hello 10, Dead 40, Wait 40,Retransmit 5
		No Hellos (Passive interface)
```



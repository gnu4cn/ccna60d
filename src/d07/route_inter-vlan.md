# VLAN 间路由，Inter-VLAN Routing

默认情况下，尽管 VLANs 能够跨越整个的二层交换网络，一个 VLAN 中的主机却是不能直接和其它 VLAN 中的主机直接通信的。为实现这个目的，必须对不同 VLANs 间的流量进行路由。这就叫做 VLAN 间路由。交换局域网（switched LANs） 中的 VLAN 间路由有三种实现方式，下面有分别列出，这三种方式及其各自的优势和劣势，接下来的部分会详细介绍。

- 采用物理的路由器接口的 VLAN 间路由, Inter-VLAN routing using physical router interfaces
- 采用路由器子接口的 VLAN 间路由, Inter-VLAN routing using router subinterfaces
- 采用交换机虚拟接口的 VLAN 间路由, Inter-VLAN routing using switched virtual interfaces


**采用物理的路由器接口的 VLAN 间路由**

为实现 VLAN 间路由通信的第一种方式，需要用到带有多个接口的路由器，来作为每个单独配置 VLAN 的网关。此时路由器就能够使用这些物理的 LAN 接口，将接收自一个 VLAN 的数据包，路由到其它 VLAN 上。此种方式如图 3.3 所示。

!["采用多个物理路由器接口的 VLAN 间路由"](../images/0303.png)

*图 3.3 -- 采用多个物理路由器接口的 VLAN 间路由*

图 3.3 演示了用到两个不同 VLANs 的单一 LAN，这两个 VLANs 都有分配给各自的 IP 子网。尽管图中画出的网络主机都是连接在同一物理交换机上，但因为它们处于不同的 VLANs 中， VLAN 10 中的主机与 VLAN 20 中的主机之间的数据包必须要经过路由才行，而在同样 VLAN 中的数据包只需要简单的交换即可。

这种方案的最主要优势在于，它是简单的，且易于部署。而最主要的劣势在于，它不具有可扩展性。比如说，，当交换机上配置了有 5 个、10 个，甚至 20 个额外的 VLANs 时，路由器上就要有相应数量的物理接口才行。在大多数情况下，这在技术上是不可行的。

在采用多物理路由器接口时，各需要的 VLAN 中到路由器的交换机链路，被配置为接入链路。然后路由器上的物理接口都配置上相应的 IP 地址，而 VLAN 上的网络主机，要么以静态方式配置上相应 VLAN 的 IP 地址，将该路由器物理接口作为默认网关，要么通过 DHCP 完成配置。图 3.3 中交换机的配置，在下面的输出中有演示。

```console
VTP-Server-1(config)#vlan 10
VTP-Server-1(config-vlan)#name Example-VLAN-10
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#vlan 20
VTP-Server-1(config-vlan)#name Example-VLAN-20
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#interface range FastEthernet0/1 – 2, 23
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport access vlan 10
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#exit
VTP-Server-1(config)#interface range FastEthernet0/3 – 4, 24
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport access vlan 20
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#exit
```

2960 交换机上无需 `switchport` 命令，因为其接口已经运行于二层模式。

下面的输出又演示了图 3.3 中的路由器的配置。

```console
R1(config)#interface FastEthernet0/0
R1(config-if)#ip add 10.10.10.1 255.255.255.0
R1(config-if)#exit
R1(config)#interface FastEthernet0/1
R1(config-if)#ip add 10.20.20.1 255.255.255.0
R1(config-if)#exit
```

**使用路由器子接口的 VLAN 间路由**

采用路由器子接口实现 VLAN 间路由的方法，解决了使用多路由器物理接口方法所可能存在的伸缩性问题。有了路由器子接口，就只需要路由器有一个物理接口就行，接下来的子接口是经由在那个物理接口上的配置获得。图 3.4 演示了这种方法。

!["采用路由器子接口的 VLAN 间路由"](../images/0304.png)

*图 3.4 -- 采用路由器子接口的 VLAN 间路由*

图 3.4 描绘了图 3.3 中同样的 LAN。但在图 3.4 中，仅使用了一个物理路由器接口。而为了实现一种 VLAN 间路由解决方案，使用 `interface [name].[subinterface number]` 全局配置命令，在该主要路由器接口上配置出了子接口。而通过命令 `encapsulation [isl|dot1q] [vlan]` 子接口配置命令，又将各子接口与某个特定 VLAN 关联了起来。最后一步就是给子接口配置上需要的 IP 地址。

在交换机上，那条连接路由器的单一链路，必须要配置为中继链路，这是因为**路由器不支持 DTP**。假如中继配置成 `802.1Q` 中继，那么在原生 VLAN 不是默认原生 VLAN 时，此中继的原生 VLAN 一定要定义。而该**原生 VLAN 也要在相应的路由器子接口上予以配置，配置命令为 `encapsulation dot1q [vlan] native` 子接口配置命令**。下面的输出演示了使用单一物理接口的 VLAN 间路由配置（又称作 “单臂路由，router-on-a-stick”）。图 3.4 中绘出的两个 VLANs 在下面的输出中也有显示，同时还有一个额外的 VLAN 用于管理用；该管理 VLAN 将被配置为原生 VLAN。

```console
VTP-Server-1(config)#vlan 10
VTP-Server-1(config-vlan)#name Example-VLAN-10
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#vlan 20
VTP-Server-1(config-vlan)#name Example-VLAN-20
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#vlan 30
VTP-Server-1(config-vlan)#name Management-VLAN
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#interface range FastEthernet0/1 – 2
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport access vlan 10
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#exit
VTP-Server-1(config)#interface range FastEthernet0/3 – 4
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport access vlan 20
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#exit
VTP-Server-1(config)#interface FastEthernet0/24
VTP-Server-1(config-if)#switchport
VTP-Server-1(config-if)#switchport trunk encapsulation dot1q
VTP-Server-1(config-if)#switchport mode trunk
VTP-Server-1(config-if)#switchport trunk native vlan 30
VTP-Server-1(config-if)#exit
VTP-Server-1(config)#interface vlan 30
VTP-Server-1(config-if)#description ‘This is the Management Subnet’
VTP-Server-1(config-if)#ip address 10.30.30.2 255.255.255.0
VTP-Server-1(config-if)#no shutdown
VTP-Server-1(config-if)#exit
VTP-Server-1(config)#ip default-gateway 10.30.30.1
```

图 3.4 中的路由器之配置如下面的输出所示。


```console
R1(config)#interface FastEthernet0/0
R1(config-if)#no ip address
R1(config-if)#no shut <- 这一步相当重要，否则子接口也会处于 down down 状态
R1(config-if)#exit
R1(config)#interface FastEthernet0/0.10
R1(config-subitf)#description ‘Subinterface For VLAN 10’
R1(config-subif)#encapsulation dot1Q 10
R1(config-subif)#ip add 10.10.10.1 255.255.255.0
R1(config-subif)#exit
R1(config)#interface FastEthernet0/0.20
R1(config-subitf)#description ‘Subinterface For VLAN 20’
R1(config-subif)#encapsulation dot1Q 20
R1(config-subif)#ip add 10.20.20.1 255.255.255.0
R1(config-subif)#exit
R1(config)#interface FastEthernet0/0.30
R1(config-subitf)#description ‘Subinterface For Management’
R1(config-subif)#encapsulation dot1Q 30 native
R1(config-subif)#ip add 10.30.30.1 255.255.255.0
R1(config-subif)#exit
```

此方案的主要优在于，路由器上仅需一个物理接口。主要的劣势在于，该物理端口的带宽，是为所配置的多个子接口所公用的。因此，如果存在很多 VLAN 间流量时，路由器就很快会成为网络的性能瓶颈。

**采用交换机虚拟接口的 VLAN 间路由**

**多层交换机支持在物理接口上配置 IP 地址**。但要先用**接口配置命令 `no switchport`** 对这些接口进行配置，以允许管理员在其上配置 IP 地址。除开使用物理接口外，多层交换机还支持交换机虚拟接口（Switch Virtual Interfaces, SVIs
）技术。

SVIs 是一系列代表了 VLAN 的逻辑接口。尽管某个交换机虚拟接口代表了一个 VLAN，它也不是在某个 VLAN 在交换机上配置出来时，就自动配置出来的；它必须要管理员通过执行 **`interface vlan [number]` 全局配置命令**，手动加以配置。而那些诸如 IP 分址等的三层配置参数，也要与在物理接口上一样，在交换机虚拟接口予以配置。

以下输出演示了在单一交换机上实现 VLAN 间路由，做出的交换机虚拟接口配置。此输出引用了本小节前面的配置输出所用到的 VLANs。

```console
VTP-Server-1(config)#vlan 10
VTP-Server-1(config-vlan)#name Example-VLAN-10
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#vlan 20
VTP-Server-1(config-vlan)#name Example-VLAN-20
VTP-Server-1(config-vlan)#exit
VTP-Server-1(config)#interface range FastEthernet0/1 – 2
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#switchport access vlan 10
VTP-Server-1(config-if-range)#exit
VTP-Server-1(config)#interface range FastEthernet0/3 – 4
VTP-Server-1(config-if-range)#switchport
VTP-Server-1(config-if-range)#switchport mode access
VTP-Server-1(config-if-range)#switchport access vlan 20
VTP-Server-1(config-if-range)#exit
VTP-Server-1(config)#interface vlan 10
VTP-Server-1(config-if)#description “SVI for VLAN 10”
VTP-Server-1(config-if)#ip address 10.10.10.1 255.255.255.0
VTP-Server-1(config-if)#no shutdown
VTP-Server-1(config-if)#exit
VTP-Server-1(config)#interface vlan 20
VTP-Server-1(config-if)#description ‘SVI for VLAN 10’
VTP-Server-1(config-if)#ip address 10.20.20.1 255.255.255.0
VTP-Server-1(config-if)#no shutdown
VTP-Server-1(config-if)#exit
```

**在用到多层交换机时，交换机虚拟端口是推荐的配置方法，和实现 VLAN 间路由的首选方案**。

你可通过使用 `show interface vlan x` 命令，来验证某个交换机虚拟接口是配置恰当的（IP 分址等）。下面的输出与 `show interface x` 命令等同。

```console
Switch#show interfaces vlan 100
Vlan100 is up, line protocol is down
    Hardware is EtherSVI, address is c200.06c8.0000 (bia c200.06c8.0000)
    Internet address is 10.10.10.1/24
    MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,
        reliability 255/255, txload 1/255, rxload 1/255
    Encapsulation ARPA, loopback not set
    ARP type: ARPA, ARP Timeout 04:00:00
```

如你希望使用一台 2960 交换机来路由 IP 数据包，那么就需要对配置进行修改，然后进行重启。这是因为 2960 和更新型号的一些交换机进行了性能调优，实现一种明确的交换机资源分配方式。该资源管理方式叫做交换机数据库管理（Switch Database Managent, SDM）模板。你可以在以下几种 SDM 模板中进行选择。

- 默认（default） -- 各项功能的平衡
- IPv4/IPv4 双协议支持（dual IPv4/IPv6） -- 用于双栈环境(dual-stack environments)
- Lanbase-routing -- 支持各种单播路由（Unicast routes）
- 服务质量（Quality of Service, QoS） -- 提供对各种服务质量特性的支持

下面是在我的 3750 交换机上的输出。这些输出与 2960 上的选项不完全一致，但你明白了这个意思。同时，请记住，**交换机型号及 IOS 对 SDM 配置选项有影响，因此，你要查看你的型号的配置手册**。

```console
Switch(config)#sdm prefer ?
    access                  Access bias
    default                 Default bias
    dual-ipv4-and-ipv6      Support both IPv4 and IPv6
    ipe                     IPe bias
    lanbase-routing         Unicast bias
    vlan                    VLAN bias
```

在你期望在 2960 交换机上配置 VLAN 间路由时，就需要开启 Lanbase-routing SDM 选项。同时在此变更生效前，需要重启交换机。下面是 `show sdm prefer` 命令的输出，该输出告诉你当前的 SDM 配置以及资源分配情况。

```console
Switch#show sdm prefer
The current template is “desktop default” template.
The selected template optimizes the resources in
the switch to support this level of features for
8 routed interfaces and 1024 VLANs.
    number of unicast mac addresses:                6K
    number of IPv4 IGMP groups + multicast routes:  1K
    number of IPv4 unicast routes:                  8K
        number of directly-connected IPv4 hosts:    6K
        number of indirect IPv4 routes:             2K
    number of IPv4 policy based routing aces:       0
    number of IPv4/MAC qos aces:                    0.5K
    number of IPv4/MAC security aces:               1K
Switch#
```





## VLAN 间路由故障排除， Troubleshooting Inter-VLAN Routing

VLAN 间路由故障可以多种形式出现，尤其是考虑在该过程中涉及多种设备（交换机、路由器等）。通过下面给出的适当故障排除方法论，你就能够将问题孤立在某台特定设备上，接着再其对应到一个错误配置的具体特性。

从连通性立足点上看，下面这些情事都应该检查一下。

- 检查一下终端主机连接了正确的交换机端口
- 检查一下正确的交换机端口连接了正确的路由器端口（如使用了一台路由器做 VLAN 间路由）
+ 检查一下在此过程中所涉及到的每个端口承载的是正确的 VLANs
    - 连接终端站的那些端口，通常是被分配到一个特定 VLAN 的接入端口
    - 而将交换机连接至路由器的那些端口，则通常是中继端口

在确认设备之间的连通性无误后，逻辑上下一步就是检查二层配置了，**以所配置的中继端口上的封装方式开始**, 这通常是作为首选的 `802.1Q` 封装方式。接着就要确保中继链路两端都是配置了同样的封装方式。

可用于查看封类型的一些命令有以下这些。

- `show interface trunk`
- `show interface <number> switchport`

这里有个输出示例。

```console
Cat-3550-1#show interfaces trunk
Port        Mode        Encapsulation       Status      Native vlan
Fa0/1       on          802.1q              trunking    1
Fa0/2       on          802.1q              trunking    1
Port        Vlans allowed on trunk
Fa0/1       1,10,20,30,40,50
Fa0/2       1-99,201-4094
```

命令 `show interface trunk` 提供的另一重要细节是中继状态。从中继状态可以看出中继是否形成，同时在链路两端都要检查中继状态。如果接口未处于“中继”模式，那么接口的运行模式（on, auto, 等）是最重要的检查项，以弄清接口能否允许与链路另一端形成中继态（a trunking state）。

中继端口上另外一个需要检查的重要元素便是原生 VLAN。原生 VLAN 错误配置可能带来功能缺失，抑或安全问题。中继链路的两端的原生 VLAN 需要匹配。

假如在完成二层检查任务后，VLAN 间路由问题仍然存在，你就可以继续进行三层配置检查了。依据用于实现 VLAN 间路由的三层设备，可能会在下列设备上进行配置及配置检查。

- 多层交换机，multilayer switch
- 路由器 -- 物理接口， router -- physical interfaces
- 路由器 -- 子接口，router -- subinterfaces


三层设备上应该检查一下其各接口（或者交换机虚拟接口，SVI）都有分配的正确的子网，同时如有必要，你还应检查一下路由协议。通常情况下，各个 VLAN 都有分配不同的子网，所以你应确保你未曾错误配置了接口。而为检查此项，你可以对特定物理接口、子接口或是 SVI，使用 `show interface` 命令。



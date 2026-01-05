# 配置并验证 NAT ，Configuring and Verifying NAT

在思科 IOS 上对网络地址转换的配置和验证是一个简单的事情。在配置 NAT 时，要执行下面这些操作。

- 使用接口配置命令`ip nat inside`将一个或多个的接口指定为内部接口。

- 使用接口配置命令`ip nat outside`将某个接口指定为外部接口。

- 配置一条访问控制清单（access control list,  ACL ）, 其将匹配所有需要转换的流量。此访问控制清单可以是标准、扩展的命名 ACL 或编号 ACL （a standard or an extended named or numbered  ACL ）。

- 作为可选项，使用全局配置命令`ip nat pool <name> <start-ip> <end-ip> [netmaske <mask> | prefix-length <length>]`, 配置一个全球地址池(a pool of global addresses)。这会定义出一个内部本地地址将会转换成的内部全球地址池。

- 使用全局配置命令`ip nat inside source list <ACL> [interface | pool] <name> [overload]`，全局性地配置上 NAT 。

> Farai 指出 -- “请看看命令`ip nat inside source static`, 可以在[www.howtonetwork.net/public/698.cfm](http://www.howtonetwork.net/public/698.cfm)免费查阅。”

下面的输出给出了一种思科 IOS 软件下配置 NAT （动态 NAT ）的方式。可以看出，该配置使用了可用的`description`和`remark`两种特性，来帮助管理员更容易地对网络进行管理和故障排除。

```console
R1(config)#interface FastEthernet0/0
R1(config-if)#description ‘Connected To The Internal  LAN ’
R1(config-if)#ip address 10.5.5.1 255.255.255.248
R1(config-if)#ip nat inside
R1(config-if)#exit
R1(config)#interface Serial0/0
R1(config-if)#description ‘Connected To The  ISP ’
R1(config-if)#ip address 150.1.1.1 255.255.255.248
R1(config-if)#ip nat outside
R1(config-if)#exit
R1(config)#access-list 100 remark ‘Translate Internal Addresses  Only ’
R1(config)#access-list 100 permit ip 10.5.5.0 0.0.0.7 any
R1(config)#ip nat pool INSIDE-POOL 150.1.1.3 150.1.1.6 prefix-length 24
R1(config)#ip nat inside source list 100 pool INSIDE-POOL
R1(config)#exit
```

按照这个配置，命令`show ip nat translations`就可以用来对路由器上具体进行的转换进行查看，如下面的输出所示。

```console
R1#show ip nat translations
Pro		Inside global	Inside local	Outside local	Outside global
icmp	150.1.1.4:4		10.5.5.1:4		200.1.1.1:4		200.1.1.1:4
icmp	150.1.1.3:1		10.5.5.2:1		200.1.1.1:1		200.1.1.1:1
tcp		150.1.1.5:159	10.5.5.3:159	200.1.1.1:23	200.1.1.1:23
```

在路由器上配置 NAT 时，通常有以下三个选择。

- 对一个内部地址，用一个外部地址进行替换（静态 NAT ，static  NAT ）
- 对多个内部地址，用两个以上的外部地址进行替换（动态 NAT ，dynamic  NAT ）
- 将多个内部地址，用多个外部端口进行转换（这就是**端口地址转换**，或者叫**单向NAT**, Port Address Translation or one-way  NAT ）

### 静态NAT

**Static NAT**

在网络内部一些有一台 web 服务器时，就要将某个特定内部地址，替换成另一个外部地址了。如此时仍然进行动态分址，就没有办法到达该特定目的地址，因为它总是变动的。

> Farai 指出，“对那些需要经由互联网可达的所有服务器，比如e- mail 或 FTP 服务器，都要使用静态 NAT （如下面的图6. 4 所示）”

![在用的静态NAT](../images/0604.png)

**图6.4 -- 在用的静态NAT**

| 内部地址 | 外部 NAT 地址 |
| -- | -- |
| `192.168.1.1` | `200.1.1.1` |
| `192.168.2.1` | `200.1.1.2` |

对上面的网络，配置应像下面这样。

```console
Router(config)#interface f0/0
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#ip nat inside
Router(config)#interface f0/1
Router(config-if)#ip address 192.168.2.1 255.255.255.0
Router(config-if)#ip nat inside
Router(config)#interface s0/0
Router(config-if)#ip nat outside
Router(config-if)#exit
Router(config)#ip nat inside source static 192.168.1.1 200.1.1.1
Router(config)#ip nat inside source static 192.168.2.1 200.1.1.2
```

命令`ip nat inside`和`ip nat outside`，告诉路由器哪些是内侧 NAT 接口，哪些是外侧的 NAT 接口。而命令`ip nat inside source`命令，就定义了那些静态转换，想要多少条就可以有多少条的该命令，那么就算你掏钱买的那些公网 IP 地址有多少个，就写上多少条吧。在思科公司，笔者曾解决有关此类问题的大量主要的配置错误，就是找不到`ip nat inside`及`ip nat outside`语句！考试中可能会碰到那些要求找出配置错误的问题。

强烈建议将上述命令敲入到某台路由器中去。本书中有很多的 NAT 实验，但是在阅读理论章节的同时，你敲入得越多，那么这些信息就能越好地进入你的大脑。

### 动态 NAT 或 NAT 地址池

通常会用到一组可路由地址，或是一个可路由地址池。一对一的 NAT 映射，有其局限性，首当其冲的就是成本高，其次路由器上有着多行的配置。动态 NAT 允许为内部主机配置一或多个的公网地址组。

路由器会维护一个内部地址到外部地址对应的清单，而最后该表格中的转换会超时(Your router will keep a list of the internal addresses to external addresses, and eventually the translation in the table will time out)。可以修改此超时值，但请找Cisco 技术支持工程师（a Cisco TAC  engineer ）的建议去修改。

![到一个 NAT 公网可路由地址池的内部私有地址](../images/0605.png)

*图6.5 -- 到一个 NAT 公网可路由地址池的内部私有地址*

当路由器上的内部主机发出到外部的连接时，如执行命令`show ip nat translations`, 就会看到下面的包含类似信息的图表。

| 内侧地址 | 外侧 NAT 地址 |
| -- | -- |
| `192.168.1.3` | `200.1.1.11` |
| `192.168.1.2` | `200.1.1.14` |

在上面的图6. 5 中，让内部地址使用的是一个从`200.1.1.1`到`200.1.1.16`的地址池。下面是要实现该目的的配置文件。这里就不再给出路由器接口地址了。

```console
Router(config)#interface f0/0
Router(config-if)#ip nat inside
Router(config)#interface s0/1
Router(config-if)#ip nat outside
Router(config)#ip nat pool poolname 200.1.1.1 200.1.1.16 netmask 255.255.255.0
Router(config)#ip nat inside source list 1 pool poolname
Router(config)#access-list 1 permit 192.168.1.0 0.0.0.255
```

该 ACL 用于告诉路由器哪些地址要转换，哪些地址不要转换。而该子网掩码实际上是反转的，叫做反掩码，在第九天会涉及。所有 NAT 地址池都需要一个名字，而在本例中，它简单地叫做“ poolname ”。源列表引用自那个 ACL （the source list refers to the  ACL ）, **经译者在 GNS3 上测试,动态 NAT 仍然是一对一的地址转换**。

### NAT Overload/端口地址转换/单向NAT

**NAT Overload/Port Address Translation/One-Way NAT**

 IP 地址处于紧缺之中，在有着成千上万的地址需要路由时，将花一大笔钱（**静态 NAT 、动态 NAT 都无法解决此问题**）。在此情况下，可以使用**NAT  overload 方案**（如图6. 6 ）, 该方案又被思科叫做**端口地址转换（Port Address Translation,  PAT ）**或**单向NAT**。 PAT 巧妙地允许将某端口号加到某个 IP 地址，作为与另一个使用该 IP 地址的转换区分开来的方式。每个 IP 地址有多达 `65000` 个可用端口号。

尽管**这是超出 CCNA 考试范围的，但了解 PAT 如何处理端口号，会是有用的**。在每个思科文档中，都将每个公网 IP 地址的可用端口号分为`3`个范围，分别是`0-511`、`512-1023`和`1024-65535`。 PAT 给每个 UDP 和 TCP 会话都分配一个独特的端口号。它会尝试给原始请求分配同样的端口值，但如果原始的源端口号已被使用，它就会开始从某个特别端口范围的开头进行扫描，找出第一个可用的端口号，分配给那个会话。

![NAT Overload](../images/0606.png)

*图6.6 -- NAT Overload*

此时，命令`show ip nat translations`给出的表格，将会显示下面这样的 IP 地址及端口号。

| 内侧地址 | 外侧 NAT 地址（带有端口号） |
| -- | -- |
| `192.168.1.1` | `200.1.1.1:30922` |
| `192.168.2.1` | `200.1.1.2:30975` |

而要配置 PAT ，需要进行如同动态 NAT 的那些同样配置，还要在地址池后面加上关键字 `overload`。

```console
Router(config)#interface f0/0
Router(config-if)#ip nat inside
Router(config)#interface s0/1
Router(config-if)#ip nat outside
Router(config)#ip nat pool poolname 200.1.1.1 200.1.1.1 netmask 255.255.255.0
Router(config)#ip nat inside source list 1 pool poolname overload
Router(config)#access-list 1 permit 192.168.1.0 0.0.0.255
```

这该很容易记住吧！

> Farai 指出 -- “以多于一个 IP 方式使用 PAT ，就是对地址空间的浪费，因为路由器会使用第一个 IP 地址，并为每个随后的连接仅增大端口号。这就是为何通常将 PAT 配置为该接口上的超载(overload)。”



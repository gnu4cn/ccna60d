# 简单网络管理协议

SNMP 属于一种应用层（七层）协议，通过使用 UDP 端口 161 及 162，促进网络设备间管理信息的交换。SNMP 管理的网络，由管理系统、代理程序及受管理设备构成。管理系统会执行一些监控应用，并控制那些受管理设备。其还会执行大部分管理进程，并提供用于网络管理的大量存储资源。某个网络可能会由一个或多个管理系统管理。

SNMP 代理位于各个受管理设备上，并将诸如于软件陷阱中捕获到的性能数据或事件，以及错误信息等本地管理信息数据，转换为某种管理系统可读的格式。SNMP 代理会会使用传输数据至网络管理软件的一些获取-请求（译注：[SNMP `get-requests` 指令](../pdfs/06-ch06.pdf)）。SNMP 代理会捕获来自管理信息库的数据，而所谓管理信息库，是一些设备参数于网络数据存储库，或来自报错抑或变更陷阱。

诸如路由器、交换机、计算机或防火墙等受管理元素，会经由 SNMP 代理加以访问。受管理设备会收集并存储管理信息，并通过 SNMP 协议使管理信息对别的，有着同样协议兼容性的管理系统可用。下图 34.1 演示了 SNMP 管理网络中，这三个主要核心组件的交互。


![SNMP 的网络组件交互](../images/4002.png)

*图 40.2 - SNMP网络组件的交互*

参考图40.2, `R1`就是 SNMP 管理的设备。逻辑上出于该设备上的，就是 SNMP 代理程序。 SNMP 代理程序，将存储在受管理设备的管理数据库中的本地管理信息数据，转化为这里称为网络管理站（Network Management Station, NMS）的管理系统可读取的形式。

在使用 SNMP 时，使用三种常见的 SNMP 命令：`read`、`write`与`trap`，使得受管理的设备得以被监视与控制。网络管理站所使用的`read`命令，用于监视受管理的设备。这是通过 NMS 对由受管理设备所维护的不同变量进行检查完成的。而`write`命令，则是由 NMS 用于对受管理设备进行控制的。 NMS 使用该命令可对存储在受管理设备上的变量的值，进行修改。最后， SNMP 的`trap`命令，是由受管理设备，用来将事件报告给 NMS 的。设备可配置为将 SNMP 陷阱或通知，发送给 NMS 。所发送的陷阱或通知，取决于设备上所运行的思科 IOS 软件版本，以及设备的平台。

SNMP陷阱简单地就是就网络上的某个状况，通知 SNMP 管理器的消息（SNMP traps are simply messages that alert the SNMP manager of a condition on the network）。一个 SNMP 陷阱的实例，可能包含了某个接口从`up`状态过渡到了`down`状态。 SNMP 的主要问题在于它们是无确认的。这就意味着发出设备无法确定该陷阱是否被 NMS 接收到。

而 SNMP 通知命令，则是包含了来自 SNMP 管理器的接收确认的 SNMP 陷阱。这些消息可用于表示诸如失败的认证尝试，或失去到邻居路由器的连接等消息。管理器在没有接收到通知请求的情况下，它就不发送响应。而发送者在从没有接收到响应的情况下，通知请求可被再度发送。因此， SNMP 的通知，更可能抵达其想要的目的（Thus, informs are more likely to reach their intended destination）。

尽管通知比陷阱更为可靠，但不利支出在于它们在路由器上与网络中与消耗了更多的资源。与发出后就丢弃的陷阱不同，在接收到一个响应或请求超时之前，通知请求（an inform request）必须要驻留在内存中。此外陷阱仅发送一次，而通知在没有接收到一个来自 SNMP 服务器的响应之前，必须多次发送。

下图40.3演示了 SNMP 管理器与 SNMP 代理程序之间，发送陷阱与通知的通信：

![由网络管理站与 SNMP 管理的元素所使用的 UDP 端口](../images/4003.png)

*图 40.3 - 由网络管理站与 SNMP 管理的元素所使用的 UDP 端口*

SNMP的三个版本分别是版本`1`、`2`与`3`。版本`1`，或`SNMPv1`，是 SNMP 协议的最初实现。`SNMPv1`运行在诸如用户数据报协议（ UDP ）、互联网协议（ IP ），以及开放系统互联的无连接网络服务（OSI Connectionless Network Service, CLNS）之上。

`SNMPv1`是广泛使用的，且是互联网社区中使用的事实上的网络管理协议。

`SNMPv2`对`SNMPv1`进行了修订，包含了在性能、安全性、保密性及管理器到管理器通信等方面的提升。`SNMPv2`还定义了两种新的操作（命令、 operations ）：`GetBulk`与`Inform`。`GetBulk`用于有效地获取大块的数据（large blocks of data）。`Inform`操作允许一个网络管理站发送陷阱信息到另一网络管理站，并于随后接收一个响应。在`SNMPv2`中，如某个对`GetBulk`操作进行响应的代理程序无法在一个清单中提供所有变量的值，那么它就提供部分结果。

`SNMPv3`提供了先前版本的 SNMP 所不具备的以下三项额外安全服务：消息完整性、认证及加密。`SNMPv3`使用消息完整性来确保数据包在传输过程中不被篡改。`SNMPv3`还使用了用于判断消息是否是来自有效的源。最后`SNMPv3`提供了用于打乱（ scramble ）数据包内容，以防止其被未授权的源看到的加密机制。

在思科 IOS 软件中，使用`snmp-server host [hostname | address]`命令，来指定本地设备将发送陷阱或通知的目的主机名或 IP 地址。为实现网络管理站对本地设备的轮询，`SNMPv1`与`SNMPv2`要求使用全局配置命令`snmp-server community <name> [ro | rw]`，为只读或读写访问，指定一个共有字符串（a community string）。

`SNMPv3`蜜柑有使用这种同样的基于共有的安全形式（the same community-based form of security），而是使用了用户与组的安全（user and group security）。下面的配置实例，演示了如何配置带有两个共有字符串的本地设备，其一用于只读访问，另一个用于读写访问。此外，该本地设备还配置了为思科 IOS 的 SLA （Service Level Agreement, 服务级别协议）操作/命令与`syslog`，而使用只读共有字符串，将 SNMP 陷阱发送到`1.1.1.1`：

```console
R2#config t
Enter configuration commands, one per line.
End with CNTL/Z.
R2(config)#snmp-server community unsafe RO
R2(config)#snmp-server community safe RW
R2(config)#snmp-server host 1.1.1.1 traps readonlypassword rtr syslog
```

下图40.4演示了一个基于 SNMP 轮询（SNMP polling）的、使用ManageEngine OpManager网络监控软件的，设备资源使用情况与可用性的示例报告：

![有关设备资源使用情况的示例 SNMP 报告](../images/4004.png)

*图 40.4 - 有关设备资源使用情况的示例 SNMP 报告*

## 思科 IOS 的 NetFlow （Cisco IOS NetFlow）

与 SNMP 一样，思科 IOS 的 NetFlow 是一个强大的维护与监控工具，可用于对网络性能进行基准测量及辅助故障排除。但其与 SNMP 之间有着一些显著的区别。第一个不同就是 SNMP 主要报告的是有关设备统计数据（比如资源使用情况等），而思科 IOS 的 NetFlow 则是就流量统计数据进行报告（比如数据包与字节）。

这两个工具之间的第二个不同，就是 SNMP 是一种基于轮询的协议（a poll-based protocol），意味着受管理设备被轮询信息。在那些 SNMP 设备发送陷阱（甚至报告，even report）到管理站的实例中，也可认为它是基于推送的（push-based）。而思科 IOS 的 NetFlow ，则是基于推送的技术，意味着配置了 NetFlow 的设备，是将其收集的信息发送出来，到某个中心存储库的。由于这个原因， NetFlow 与 SNMP 互为补充，可作为标准网络维护与监控工具套件（the standard network maintenance and monitoring toolkit）的组成部分。但它们并非各自的替代；这是一个常被误解的概念，重要的是记住这一点。

IP（数据）流基于五个，上至七个的一套 IP 数据包属性，它们可能包含下面这些：

- 目的 IP 地址
- 源 IP 地址
- 源端口
- 目的端口
- `Layer 3`的协议类型
- 服务类（Class of Service）
- 路由器或交换机的接口

除了这些 IP 属性外，（数据）流还包含了其它一些额外信息。这些额外信息包括对于计算每秒数据包与字节数有用的时间戳。时间戳还提供了有关某个数据流生命周期（持续时间）的信息。数据流还包括下一跳 IP 地址的信息，其包含了边界网关协议的路由器自治系统信息。除了 TCP 流量的标志外，数据流源与目的地址的子网掩码信息也有包含，而 TCP 流量的诸多标志，则可用于对 TCP 握手进行检查。

> **译者注**：总的来说，思科 IOS 的 NetFlow 中的数据流，包含了数据包属性（七种）、时间戳、包含 BGP 路由自治系统的下一跳 IP 地址信息、 TCP 流量的诸多标志，以及源与目的地址的子网掩码信息。

简要地讲，思科 IOS 的 NetFlow 特性，除了可用于提供有关网络用户与网络应用、峰值用量时间，与流量路由之外，还可用于有关的信息网络流量记账、基于用量的网络计费、网络规划、安全、拒绝服务攻击的监视能力，以及网络监控。所有的这些用途，令到其成为一个非常强大的维护、监控与故障排除工具。

思科 IOS 的 NetFlow 软件，对数据流数据进行收集，并将其存储在一个名为“ NetFlow 缓存”或简单地说就是“数据流缓存”的数据库中。数据流信息会留存到该数据流终止或停止、超时或缓存溢出为止。有两种方式来访问存储在数据流中的数据：使用命令行界面（也就是使用`show`命令），或导出该数据，并通过使用某种类型的报告工具对导出的数据进行查看。下图40.5演示了在思科 IOS 路由器上的 NetWork 操作，以及数据流缓存的生成方式：

![基本的 NetFlow 操作与数据流缓存的生成](../images/4005.png)

*图 40.5 - 基本的 NetFlow 操作与数据流缓存的生成*

参考图40.5，在本地路由器上入口流量被接收到。该流量被路由器加以探测，且 IP 属性信息被用于创建一个数据流。随后该数据流信息被存储在流缓存中。该信息可使用命令行界面进行查看，或被导出到某个称为 NetFlow 收集器的外部目的地，随后在 NetFlow 收集器出，该同样的信息可使用某种应用报告工具（an application reporting tool）进行查看。要实现将 NetFlow 数据报告给 NetFlow 收集器，需要使用以下步骤：

1. 在设备上要配置思科 IOS 的 NetFlow 特性，以将数据流捕获到 NetFlow 缓存。

2. 要配置好 NetFlow 导出功能，以将数据流发送到收集器。

3. 就那些已经有一段时间不活动的、以被终止的，或者仍活动但超出了活动计时器的数据流，对 NetFlow 进行搜索（The NetFlow cache is searched for flows that have been inactive for a certain period of time, have been terminated, or, for active flows, that last greater than the active timer）。

4. 将这些已标识出的数据流导出至 NetFlow 收集器服务器（Those identified flows are exported to the NetFlow Collector server）。

5. 将接近 30 到 50 个数据流打包在一起，并通常经由 UPD 进行传送。

6. NetFlow收集器软件从数据创建出实时或历史性的报告。

在配置思科 IOS 的 NetFlow 特性时，需要三个主要步骤，如下所示：

1. 在那些希望对信息进行捕获并在流缓存中存储的所有接口上，使用接口配置命令`ip flow ingress`，把接口配置为将数据流捕获进入 NetFlow 缓存。重要的是记住 NetFlow 仅在每个接口的基础上配置的（Configure the interface to capture flows into the NetFlow cache using the `ip flow ingress` interface configuration command on all interfaces for which you want information to be captured and stored in the flow cache. It is important to remember that NetFlow is configured on a per-interface basis only）。


    > **Dario先生的提醒**：命令`ip route-cache flow`可在物理接口及其下的所有子接口上，开启（ NetFlow ）数据流（the `ip route-cache flow` command will enable flows on the physical interface and all subinterfaces associated with it）。
    > 而`ip flow ingress`命令则将开同一接口上的单个子接口、而非所有子接口上，开启（ NetFlow ）数据流。这在对观看某个接口的子接口`X`、`Y`及`Z`上的数据流不感兴趣，而真正想要观看同一接口上的子接口`A`、`B`与`C`子接口上的数据流时，此命令就很好用。
    > 此外，在 NetFlow 版本 5 下，唯一选项是使用`ip flow ingress`命令来监视上传统计数据（with NetFlow v5, the only option was to monitor inbound statistics using the `ip flow ingress` command）。不过随着 NetFlow 版本 9 的发布，现在就了使用`ip flow egress`命令，来对离开各个接口的流量进行监控的选择了。


    > **注意：** 从思科 IOS 版本`12.4(2)T`及`12.2(18)SXD`起，已将命令`ip flow ingress`替换为`ip route-cache flow`命令。而从思科 IOS 版本`12.2(25)S`起，命令`show running configuration` 的输出已被修改，因此命令`ip route-cache flow`命令，以及`ip flow ingress`命令，将在二者之一被配置后，出现在`show running-configuration`的输出中。

    随后 NetFlow 信息就存储在本地路由器上，同时可在本地设备上，使用`show ip cache flow`查看到。

    在打算将数据导出到 NetFlow 收集器的情况下，将需要两个额外任务，如下：

2. 使用全局配置命令`ip flow-export version [1 | 5 | 9]`，配置思科IOS NetFlow的版本或格式。 NetFlow 版本`1`（`v1`）是在首个 NetFlow 发布中所支持的最初格式。在用于分析导出的 NetFlow 数据的应用仅支持该版本时，才应使用此版本。相比版本`1`，版本`5`导出更多的字段，同时也是应用最广泛的版本。而版本`9`则是最新的思科IOS NetFlow版本，也是一个新的 IETF 标准的基础。版本`9`是一个灵活的导出格式版本。

3. 使用全局配置命令`ip flow-export destination [hostname | address] <port> [udp]`，配置并指定 NetFlow 收集器的 IP 地址，并于随后指定 NetFlow 收集器用于接收来自思科设备的 UDP 输出的 UDP 端口。其中的`[udp]`关键字是可选的，且在使用该命令是不需要指定，因为在将数据发送到 NetFlow 收集器时，用户数据报协议是默认使用的传输协议。

以下实例演示了如何为某个指定的路由器接口开启 NetFlow ：

```console
R1#config t
Enter configuration commands, one per line.
End with CNTL/Z.
R1(config)#interface Serial0/0
R1(config-if)#ip flow ingress
R1(config-if)#end
```

根据此配置，可使用`show ip cache flow`命令来查看在数据流缓存中所收集的统计数据，如下面的输出所示：

```console
R1#show ip cache flow
IP packet size distribution (721 total packets):
   1-32   64   96  128  160  192  224  256  288  320  352  384  416  448  480
   .000 .980 .016 .000 .000 .000 .000 .000 .000 .000 .000 .000 .000 .000 .000
   512   544  576 1024 1536 2048 2560 3072 3584 4096 4608
  .002  .000 .000 .000 .000 .000 .000 .000 .000 .000 .000

IP Flow Switching Cache, 278544 bytes
  4 active, 4092 inactive, 56 added
  1195 ager polls, 0 flow alloc failures
  Active flows timeout in 30 minutes
  Inactive flows timeout in 15 seconds

IP Sub Flow Cache, 21640 bytes
  4 active, 1020 inactive, 56 added, 56 added to flow
  0 alloc failures, 0 force free
  1 chunk, 1 chunk added
  last clearing of statistics never

Protocol         Total    Flows   Packets Bytes  Packets Active(Sec)  Idle(Sec)
--------         Flows     /Sec     /Flow  /Pkt     /Sec     /Flow      /Flow
TCP-Telnet           2      0.0        34    40      0.0      10.5       15.7
TCP-WWW              2      0.0         9    93      0.0       0.1        1.5
UDP-NTP              1      0.0         1    76      0.0       0.0       15.4
UDP-other           42      0.0         5    59      0.0       0.0       15.7
ICMP                 5      0.0        10    64      0.0       0.0       15.1
Total:              52      0.0         7    58      0.0       0.4       15.1

SrcIf      SrcIPaddress   DstIf   DstIPaddress   Pr SrcP DstP  Pkts
Se0/0      150.1.1.254    Local   10.0.0.1       01 0000 0800   339
Se0/0      10.0.0.2       Local   1.1.1.1        06 C0B3 0017     7
Se0/0      10.0.0.2       Local   10.0.0.1       11 07AF D0F1     1
Se0/0      10.0.0.2       Local   10.0.0.1       11 8000 D0F1    10
Se0/0      150.1.1.254    Local   10.0.0.1       01 0000 0800   271
Se0/0      10.0.0.2       Local   1.1.1.1        06 C0B3 0017    59
```

下面的示例演示了如何配置并开启指定路由器接口的 NetFlow 数据收集，并于随后使用 NetFlow 版本`5`的数据格式，将数据导出到某台有着 IP 地址`150.1.1.254`的 NetFlow 收集器：

```console
R1(config)#interface Serial0/0
R1(config-if)#ip flow ingress
R1(config-if)#exit
R1(config)#interface FastEthernet0/0
R1(config-if)#ip flow ingress
R1(config-if)#exit
R1(config)#interface Serial0/1
R1(config-if)#exit
R1(config)#ip flow-export version 5
R1(config)#ip flow-export destination 150.1.1.254 5000
R1(config)#exit
```

根据此配置，就可在那台NetFlow Collector上，使用某种应用报告工具，查看到收集的信息。而尽管有数据的导出，仍然可以在本地设备上，使用`show ip cache flow`命令来查看统计数据，在对网络故障进行排除或报告问题时，此命令可作为一个有用的工具。

### 使用 NetFlow 的数据进行故障排除（Troubleshooting Utilising NetFlow Data）

典型的企业网络，有着成千上万的、仅在很短时间内就生成海量 NetFlow 数据的连接。 NetFlow 数据可转换为帮助管理员弄清楚网络中正在发生什么的，有用图形与表格。 NetFlow 数据可辅助于以下方面：

- 提升整体网络性能
- 对一些诸如网络电话（ VoIP ）的应用提供支持
- 更好地对峰值流量进行管理（Better manage traffic spikes）
- 加强网络规定的执行（Enforce network policies）
- 揭示出那些指向恶意行为的流量模式（Expose trffic patterns that point to malicious activities）

NetFlow信息还可帮助管理员掌握到任何时候，各种数据类型所消耗的网络资源百分比。一眼就可以发现由电邮、计费与 ERP 系统及其它应用等使用了多少带宽，以及工作日期间有多少用户在观看 YouTube 视频，或在打互联网电话。

NetFlow数据可以易于理解的形式进行呈现，这就使得管理员能够轻易地对更多细节信息进行研究。他们可以就用户、应用、部门、对话、接口与协议等所产生的流量进行检查。使用 NetFlow 数据可以解决的一些情况示例，包括：

- 网络容量问题（Capacity issues）： NetFlow 可清楚地显示什么应用使用了最多的带宽，及它们在何时使用了最多的带宽。此信息有助于改变应用流量模式，从而提升网络性能。通用的做法对用户进行应用。
- 安全问题（Security issues）： NetFlow 数据可对网络上的未授权流量模式进行探测，并可在对网络造成任何危害之前阻止威胁。
- 网络语言故障（比如低质量，VoIP problems(poor quality, for example)）：在使用 NetFlow 分析识别出原因后，这方面的问题可被矫正。 NetFlow 报告可给出对网络语音通话造成影响的带宽不足（insufficient bandwidth）、延迟或网络抖动等因素。

## 第 40 天问题

1. What underlying protocol does syslog use?
2. The syslog client sends syslog messages to the syslog sever using UDP as the Transport Layer protocol, specifying a destination port of `_______`.
3. The priority of a syslog message represents both the facility and the severity of the message. This number is an `________` -bit number.
4. Name the eight Cisco IOS syslog priority levels.
5. In Cisco IOS software, the `_______` `_______` `_______` global configuration command can be used to specify the syslog facility.
6. Which command do you use to globally enable logging on a router?
7. Name the command used to specify the syslog server destination.
8. Name the command used to set the clock on a Cisco IOS router.
9. On which ports does SNMP operate?
10. Name the command you can use to change the NetFlow version.

## 第 40 天答案

1. UDP.
2. `514`.
3. `8`.
4. Emergencies, alerts, critical, errors, warnings, notifications, informational, and debugging.
5. The `logging facility [facility]` command.
6. The `logging on` command.
7. The `logging [address]` or `logging host [address]` command.
8. The `clock set` command.
9. UDP `161` and `162`.
10. The `ip flow-export version x` global configuration command.

## 第 40 天实验

### 日志记录实验

在思科路由器上配置日志记录：

- 选择日志记录设施`local3`：`logging facility local2`
- 执行全局的`logging on`命令
- 选择日志记录的严重程度`informational`
- 在一台 PC 机上配置一个自由的`syslog`服务器并将其连接到路由器
- 执行`logging [address]`命令来指定该`syslog`服务器
- 指定`logging source-interface`命令
- 验证命令`show logging`
- 配置`service timestamp log datetime localtime msec show-timezone`命令
- 在 PC 机上检查`syslog`消息

### SNMP实验

在思科路由器上配置 SNMP ：

- 使用`snmp-server host`命令配置 SNMP 服务器
- 使用`snmp-server community`命令，配置 SNMP 的只读（ RO ）与读写（ RW ）共有字符串（Configure SNMP RO and RW communities using the `snmp-server community` command）


### NetFlow实验

在思科路由器上配置 NetFlow ：

- 在某个路由器接口上开启 IP 数据流的入口与出口（Enable IP flow ingress and egress on a router interface）
- 在有流量通过路由器后，对`show ip cache flow`命令进行检查
- 使用`ip flow-export`命令对 NetFlow 的版本进行配置
- 使用`ip flow-export`命令配置一台外部 NetFlow 服务器

请访问[www.in60days.com](http://www.in60days.com)网站，免费观看作者完成此实验。


（End）



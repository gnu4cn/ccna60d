# VLAN 中继协议

VLAN 中继协议（VTP）是一种管理同一 VTP 域中，交换机上 VLAN 添加、删除和重命名的，思科专有二层消息传递协议。VTP 允许 VLAN 信息在交换网络中传播，这减少了交换网络中的管理开销，同时使交换机能够交换和维护一致的 VLAN 信息。下图 7.3 举例说明了这一概念。



!["VTP 更新"](../images/0305.png)

**图 7.3** -- **VTP 更新**

使用 VTP 的一些好处如下：

- VLAN 的精确监控及报告
- 整个网络的 VLAN 一致性
- 轻松添加和删除 VLAN

## 配置 VTP

若要交换 VLAN 信息，那么所有交换机都必须以同一 VTP 域名配置，如下面的输出中所示。


```console
Switch(config)#vtp mode server  ← this is on by default
Switch(config)#vtp domain in60days
Changing VTP domain name from NULL to in60days

Switch#show vtp status
VTP Version :                       2
Configuration Revision :            0
Maximum VLANs Supported Locally :   255
Number of Existing VLANs :          5
VTP Operating Mode :                Server
VTP Domain Name :                   in60days
VTP Pruning Mode:                   Disabled
VTP V2 Mode:                        Disabled
VTP Traps Generation:               Disabled
MD5 digests:                        0x7D 0x5A 0xA6 0x0E 0x9A 0x72 0xA0 0x3A
```

当咱们打算安全加固咱们的 VTP 更新时，纳闷咱们可添加一个密码，但在 VTP 域中的每台交换机上其必须匹配。


```console
Switch(config)#vtp password Cisco321
Setting device VLAN database password to Cisco321
```

## VTP 版本

有三个版本的 VTP，即版本 1、2 及 3。在撰写本文时，由 Cisco Catalyst 交换机所使用的默认版本为 VTP 版本 1。如上所示，这可以从 `show vtp status` 命令的输出中验证。

其中 `VTP Version :` 行令人困惑，因为他显示 VTP 版本是 VTP 版本 2。然而，这行只是表示了该交换机具备版本 2 能力。要确定 VTP 版本 2 是否已启用，应参考 `VTP V2 Mode` 这一行。在上面打印的输出中，该行显示 `Disabled`，这意味着即使该交换机具备版本 2 的能力，如第一行中指出的那样，他仍运行着默认的版本 （1），而版本 2 是禁用的。

VTP 版本 2 在基本操作方面与版本 1 类似，但比版本 1 提供了额外能力与特性。VTP 版本 2 下第一个受支持的额外特性，是令牌环的支持。VTP 版本 2 支持令牌环的交换、令牌环的网桥中继功能（TrBRF），以及令牌环的集中器中继功能（TrCRF）。令牌环超出了 SWITCH 考试要求范围，而不会在本指南中详述。

VTP 版本 3 不同于 VTP 版本 1 和 2，其在 VTP 版本 1 和 VTP 版本 2 直接与 VLAN 进程交互情形下，会在管理域上分发一个不透明数据库 <sup>1</sup> 列表。通过提供数据库的可靠、高效传输机制，可用性便得以从仅服务于 VLAN 环境，扩展到更多领域。


> *知识点*：
>
> - version 2-capable
>
> - Token Ring switching
>
> - Token Ring Bridge Relay Function, TrBRF
>
> - Token Ring Concentrator Relay Function, TrCRF
>
> - a list of opaque database
>
> - an administrative domain
>
> **译注**：
>
> - <sup>1</sup>：译者认为，在思科 IOS 软件中，应使用到 Erlang/OTP 语言。在 Erlang 的 Mnesia 数据库中，术语 “不透明” 指的是 Mnesia 回调机制中使用的内部数据结构。这种数据结构的内部细节不向用户公开，完全由 Mnesia 管理。

## VTP 模式

VTP 在以下三种模式下运行：

- 服务器（默认）
- 客户端
- 透明

在上面的配置与输出中，咱们便可看到服务器模式。

### 服务器模式

在服务器模式下，交换机有权创建、修改及删除整个 VTP 域的 VLAN 信息。咱们对服务器所做的任何更改，都会传播到整个域。VLAN 配置被存储在闪存上的 VLAN 数据库文件 `vlan.dat` 中。

### 客户端模式

在客户端模式下，交换机将接收 VTP 信息并应用任何的更改，但其不允许在交换机上添加、删除或更改 VLAN 信息。客户端还将把其接收到的 VTP 数据包，在其中继端口上发出。请记住，咱们无法将 VTP 客户端交换机上的某个交换机端口，添加到 VTP 服务器上不存在的某个 VLAN。VLAN 配置存储在闪存上的 VLAN 数据库文件 `vlan.dat` 中。

### 透明模式

在透明模式下，交换机将转发从其中继端口接收到的 VTP 信息，但其不会应用更改。VTP 透明模式的交换机可以创建、修改和删除 VLAN，但这些更改不会传播到其他交换机。VTP 透明模式也需要域的配置信息。当某台交换机分隔了需要有着不同 VLAN 数据库的 VTP 服务器和客户端时，就需要一台 VTP 透明的交换机。要配置扩展的 VLAN 范围（1006 至 4096），就需要透明模式。



## VTP 修剪

咱们经常会遇到这样的情况，例如，咱们网络一侧有 20 到 50 个 VLAN，另一侧有 60 到 80 个 VLAN。让 VLAN 信息从一侧的交换机传递到另一侧的每台交换机，是不合理的。出于这一原因，交换机可修剪在交换机上的不必要 VLAN 信息，从而减少广播流量，如下图 7.4 中所示。


!["运行中的 VTP 修剪"](../images/0306.png)

**图 7.4** -- **运行中的 VTP 修剪**

以下配置行将把 VTP 修剪添加到咱们的交换机：


`Switch(config)#vtp prunning`

值得注意的是，当咱们在两个其他交换机之间有个设置为透明模式的交换机时，那么修剪将不起作用。


## 配置修订编号

所谓配置修订编号，是个表示 VTP 数据包的修订级别的 32 位编号（请参阅上面的 `show vtp status` 输出）。这一信息用于确定，接收到的信息是否比当前版本更新。每次咱们某台 VTP 服务器模式下的交换机上，做出一次 VLAN 更改时，配置修订都会递增一，同时更改将传播到 VTP 客户端（VTP 透明模式下的交换机将有个 0 的修订编号，而不会随着数据库的更改而递增）。要重置某台交换机的配置版本，就要更改 VTP 域名，然后将名字改回原来的名字。

**重要注意事项**：当某台配置为 VTP 服务器或 VTP 客户端的交换机，以匹配的域名和较高的版本号连接到网络时，其数据库将传播到所有其他交换机，并有可能取代他们现有的 VTP 数据库。这样做会导致整个 LAN 网络宕机，因此在将新的交换机连接到 LAN 网络时，要非常小心（始终要检查 VTP 状态）！



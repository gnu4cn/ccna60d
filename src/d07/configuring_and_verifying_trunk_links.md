# 配置并验中继链路

所谓中继，是一种可承载多种流量类型的交换机端口，每种流量都以一个唯一的 VLAN ID 打了标签。数据在中继端口或中继链路上交换时，会被出口的交换机中继端口打上标签（或着色），这允许接收交换机识别到数据属于某个特定 VLAN。在接收交换机的入口端口上，标签会被移除，二数据会被转发到预定的目的地。

在 Cisco IOS Catalyst 交换机中实现 VLAN 中继时，第一项配置任务，是把所需接口配置为二层交换机端口。这是通过执行 `switchport` 这条接口配置命令完成的。

**注意**：该条命令及下面的 `encapsulation` 命令，仅在三层交换机或多层交换机上才需要。其不适不适用于诸如 Catalyst 2960 系列等的仅二层的交换机。交换机需要支持 `ip routing` 命令，才能被视为三层交换机。


第二项配置任务，是要指定该中继链路应使用的封装协议。这是通过执行 `switchport trunk encapsulation [option]` 命令完成的。这一命令下的可用选项如下（在多层交换机上执行时）：


```console
Switch(config)#interface FastEthernet1/1
Switch (config-if)#switchport trunk encapsulation ?
dot1q - Interface uses only 802.1q trunking encapsulation when trunking
isl - Interface uses only ISL trunking encapsulation when trunking
negotiate - Device will negotiate trunking encapsulation with peer on interface
```

其中 `[dot1q]` 关键字会强制该交换机端口，使用 IEEE 802.1Q 的封装。`[isl]` 关键字会强制该交换端口，使用 Cisco ISL 的封装。`[negotiate]` 关键字用于指定，当动态交换机间链路协议 (DISL) 和动态中继协议 (DTP) 的协商均未能成功就封装格式达成一致时，ISL 即为选取的格式。DISL 简化了自两台互连的快速以太网设备创建 ISL 中继的过程。DISL 最大限度地减少了 VLAN 中继配置程序，因为只有链路的一端，需要被配置为中继。

DTP 是一种协商出两台交换机间的共同中继模式的，思科专有点对点协议。DTP 将在稍后将详细介绍。以下输出演示了如何将某个交换机端口，配置为在建立中继时使用 IEEE 802.1Q 的封装：

```console
Switch (config)#interface FastEthernet1/1
Switch (config-if)#switchport
Switch (config-if)#switchport trunk encapsulation dot1q
```

这一配置可通过 `show interfaces [name] switchport` 命令验证，如下输出中所示：


```console
Switch#show interfaces FastEthernet1/1 switchport
Name: Fa0/2
Switchport: Enabled
Administrative Mode: dynamic desirable
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
...
[Truncated Output]
```

第三个中继端口配置步骤，是执行配置，确保该端口被指定为中继端口。这一步可以两种方式之一完成：

- 手动（静态）的中继配置
- 动态中继协议 (DTP)


## 手动（静态）的中继配置

中继的手动配置，是通过在所需交换机端口上，执行 `switchport mode trunk` 这条接口配置命令完成的。这条命令会强制该端口进入永久（静态）的中继模式。以下配置输出显示了如何将某个端口，静态地配置为一个中继端口：


```console
VTP-Server(config)#interface FastEthernet0/1
VTP-Server(config-if)#switchport
VTP-Server(config-if)#switchport trunk encapsulation dot1q
VTP-Server(config-if)#switchport mode trunk
VTP-Server(config-if)#exit
VTP-Server(config)#
```

若咱们使用的是一台低端交换机（上面的输出来自一台 Cat6K 交换机），那么请忽略其中的 `switchport` 命令。如下输出中所示，这一配置可经由 `show interfaces [name] switchport` 命令验证：

```console
VTP-Server#show interfaces FastEthernet0/1 switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
...
[Truncated Output]
```

虽然中继链路的手动（静态）配置，会强制交换机建立一条中继链路，但动态 ISL 与动态中继协议 (DTP) 的数据包，仍将从该接口发出。这样做是为了某条静态配置的中继链路，依然能与某个使用着 DTP 的相邻交换机建立中继，正如接下来小节中将介绍的那样。这在下面 `show interfaces [name] switchport` 命令的输出中得以验证：

```console
VTP-Server#show interfaces FastEthernet0/1 switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunkAdministrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
...
[Truncated Output]
```


在上面的输出中，`Negotiation of Trunking: On` 表明，尽管该中继链路属于静态配置的，该端口仍在发送 DTP 和 DISL 数据包。在某些情况下，这被视为不可取的。因此，在某个静态配置为中继链路的端口上，通过执行 `switchport nonegotiate` 接口配置命令，关闭 DISL 和 DTP 数据包的发送，被视为一种好的做法，如以下输出所示：


```console
VTP-Server(config)#interface FastEthernet0/1
VTP-Server(config-if)#switchport
VTP-Server(config-if)#switchport trunk encapsulation dot1q
VTP-Server(config-if)#switchport mode trunk
VTP-Server(config-if)#switchport nonegotiate
VTP-Server(config-if)#exit
VTP-Server(config)#
```

同样，`show interfaces [name] switchport` 命令可用于验证配置，如下所示：

```console
VTP-Server#show interfaces FastEthernet0/1 switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
...
[Truncated Output]
```



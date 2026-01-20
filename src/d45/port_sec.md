# 交换机的端口安全

所谓端口安全特性，是通过限制在某一特定端口或接口上，可被学习到的 MAC 地址数量，保护交换机端口并最终保护 CAM 数据表的一项动态 Catalyst 交换机特性。在端口安全这一特性下，交换机会维护一个用于识别哪个 MAC 地址（或哪些）可访问哪个本地交换机端口的数据表。此外，交换机还可被配置为，仅允许在任何给定交换机端口上，学习某一特定数量的 MAC 地址。端口安全如下图 45.1 中所示。

![端口安全的运行](../images/port_sec.jpeg)

**图 45.1** -— **端口安全的运行**

图 45.1 展示了某一 Catalyst 交换机上，经由端口安全特性，被配置为放行单一 MAC 地址的四个端口。其中端口 1 至 3，被连接到其 MAC 地址与端口安全所放行地址匹配的三个主机。假设未部署其他过滤机制，那么这些主机便能够通过其各自交换机端口转发数据帧。然而，端口 4 已被配置为放行有着 `AAAA.0000.0004` MAC 地址的主机，然而有着 MAC 地址 `BBBB.0000.0001` 的一个主机已被连接到这个端口。由于该主机的 MAC 与放行的 MAC 不一样，因此端口安全便将如同管理员所定义的那样，在该端口上采取相应措施。有效的一些 [端口安全操作](#端口安全的操作)，将在后续小节中详细介绍。

端口安全这一特性，被设计以保护交换式 LAN 免于两种主要的攻击方式。这两种攻击方法，将在接下来的小节中描述：

- CAM 数据表溢出攻击
- MAC 地址欺骗攻击


## CAM 数据表溢出攻击

所谓交换机的 CAM 数据表，属于包含着一些物理端口上已知 MAC 地址的一些列表的存储场所。交换机 CMA 数据表，或 MAC 地址数据表中的那些动态学习到的内容，可通过执行 `show mac-address-table dynamic` 这条命令查看到，如下输出中所示：


```console
Switch-1#show mac-address-table dynamic
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   2    000c.cea7.f3a0    DYNAMIC     Fa0/1
   2    0013.1986.0a20    DYNAMIC     Fa0/2
   6    0004.c16f.8741    DYNAMIC     Fa0/3
   6    0030.803f.ea81    DYNAMIC     Fa0/4
   8    0004.c16f.8742    DYNAMIC     Fa0/5
   8    0030.803f.ea82    DYNAMIC     Fa0/6
Total Mac Addresses for this criterion: 6
```

与所有计算设备一样，交换机也只有有限的内存资源。这意味着 CAM 数据表有着固定的、所分配的内存空间。CAM 数据表溢出攻击，通过以大量随机生成的无效源 MAC 地址和目的 MAC 地址泛洪交换机，直至 CAM 数据表充满，进而该交换机不再具备接受一些新条目的能力，而将这种内存空间限制作为目标。在此类情形下，交换机会有效地转变为一个集线器，而直接开始广播全部新近接收到的数据帧，到该交换机上的所有端口（同一 VLAN 内），实质上将这一 VLAN 转变为一个大的广播域。

CAM 数据表攻击易于进行，因为诸如 MACOF、DSNIFF 等一些常见工具，均已可用于进行这些活动。虽然增加 VLAN 数量（这样做缩小了广播域规模）有助于减小 CAM 数据表攻击的影响，但推荐的安全解决方案，是要在交换机上配置端口安全。

## MAC 欺骗攻击

所谓 MAC 地址欺骗，用于伪造某个源 MAC 地址，以冒充网络中的其他主机或设备。欺骗，spoofing，就是一个表示伪装或冒充成并不是咱们的某人。MAC 欺骗的主要目的，是要迷惑交换机，使其相信同一主机被连接到两个端口，这就会导致该交换机，尝试同时转发以受信任主机为目标的数据帧到该名攻击者。下图 45.2 展示了某一连接到四个不同网络主机交换机的 CAM 数据表。

![建立交换机 CAM 数据表](../images/building_cam_table.png)

**图 45.2** -— **建立交换机 CAM 数据表**

在图 45.2 中，该交换机处于正常运行下，并根据那些 CAM 数据表条目，了解所有连接至其端口设备的 MAC 地址。根据当前的 CAM 数据表，当 `Host 4` 打算发送一个数据帧到 `Host 2` 时，该交换机将直接从其 `FastEthernet0/2` 接口，转发出该数据帧到 `Host 2`。

现在，假设 `Host 1` 已被某名意图接收所有以 `Host 2` 为目的地流量的攻击者入侵。通过运用 MAC 地址欺骗，该名攻击者便会伪造一个使用 `Host 2` 为源地址的以太网数据帧。在该交换机接收到这个数据帧后，他就会记下这个源 MAC 地址，并覆写 `Host 2` MAC 地址的那个 CAM 数据表条目，而将其指向端口 `FastEthernet0/1` 端口，而非真正的 `Host 2` 所连接的 `FastEthernet0/2` 端口。这一概念如下图 45.3 中所示。

![MAC 地址欺骗](../images/mac_addr_spoofing.png)

**图 45.3** -— **MAC 地址欺骗**

参考图 45.3，在 `Host 3` 或 `Host 4` 尝试发送数据帧到 `Host 2` 时，该交换机将从 `FastEthernet0/1` 转发他们到 `Host 1`，因为 CAM 数据表已被一次 MAC 欺骗攻击投毒。在 `Host 2` 发送另一数据帧时，该交换机便会从 `FastEthernet0/2` 重新学习到他的 MAC 地址，并再次重写那个 CAM 数据表条目以反映这一变化。结果便是一场 `Host 2` 与 `Host 1` 之间有关哪台主机拥有这一 MAC 地址的拉锯战。

此外，这种情况会使交换机陷入混乱，并导致 MAC 地址数据表条目的反复重写，从而造成对合法主机（即 `Host 2`）的一种拒绝服务（DoS）攻击。当用到的伪造 MAC 地址数量很高时，那么这种攻击便会对持续重写其 CAM 数据表的交换机，造成严重的性能后果。MAC 地址欺骗攻击，可通过实施端口安全得以缓解。

## 端口安全的安全地址

端口安全特性可用于指定允许访问某一交换机端口的特定 MAC 地址，以及限制可于某单个交换机端口上受支持的 MAC 地址数量。这一小节中描述的端口安全实现方法如下：

- 静态的安全 MAC 地址
- 动态的安全 MAC 地址
- 粘性安全 MAC 地址


所谓静态的安全 MAC 地址，属于一些由网络管理员静态配置，并存储于 MAC 地址数据表，及交换机配置中的一些 MAC 地址。在一些静态的安全 MAC 地址被支派到某一安全端口后，交换机就将不转发那些，没有与所配置静态安全地址匹配的源地址的数据帧。

所谓动态的安全 MAC 地址，属于由交换机动态学习道德，并存储于 MAC 地址数据表中的一些 MAC 地址。然而，不同于静态的安全 MAC 地址，在交换机重新加载或断电时，这些动态的安全 MAC 地址条目会被移除。这些地址随后在交换机再次启动时，必须由其重新学习。


所谓粘性的安全 MAC 地址，属于静态的安全 MAC 地址与动态的安全 MAC 地址的混合体。这些地址可被动态地学习到，或予以静态配置，并存储于 MAC 地址数据表以及交换机的运行配置中。这意味着在交换机关机或重启后，将不需要再次重新动态发现这些 MAC 地址，因为他们已存储在配置文件中（当咱们保存了运行配置时）。

## 端口安全的操作

一旦端口安全已被启用，那么管理员就可以定义一些在某种端口安全违例情形下，交换机将采取的操作。Cisco IOS 软件允许管理员，指定在某种违反发生时要采取的四种不同操作：

- 保护
- 关闭（默认）
- 限制
- 关闭 VLAN（超出 CCNA 考试范围）

保护这个选项，会强制该端口进入受保护端口模式，`Protected Port` mode。在这种模式下，交换机将直接丢弃所有有着不明源 MAC 地址的单播或多播数据帧。在交换机被配置为要保护某一端口后，那么该交换机将不会在运行于受保护端口模式期间发出通知，这就意味着管理员永远不会知晓，何时有流量已被某个运行于这一模式下的交换机端口阻止了。

关闭这个选项，会在某一端口安全事件发生时，将其置于 `err-disabled` 状态（会在稍后介绍）。在这种配置的模式在用时，交换机上对应的端口 LED 也会被关闭。在 `Shutdown` 模式下，交换机会发出一条 SNMP 陷阱及一条 `syslog` 消息，同时违规计数器将被递增。这是端口安全在某一接口上启用后，会采取的默认行为。

限制选项用于在安全 MAC 地址数量，达到管理员针对该端口定义的最大限制后，丢弃有着未知 MAC 地址的数据包。在这一模式下，交换机将持续阻止那些其他 MAC 地址发送数据帧，直至移除足够数量的安全 MAC 地址被移除，最大允许地址数量得以增加。与关闭选项下的情形一样，交换机会发出一条 SNMP 陷阱及一条 `syslog` 消息，同时违规计数器会被递增。


关闭 VLAN 这一选项类似于关闭选项；但是，这一选项会关闭某一 VLAN 而非整个交换机端口。这种配置可应用于那些被指派了多个 VLAN 的端口，比如语音 VLAN 与某个数据 VLAN，以及交换机上的中继链路。

## 配置端口安全

在配置端口安全前，建议将交换机端口静态地配置为二层的接入端口（端口安全只能在静态接入端口，或中继端口上配置，而不可配置于动态端口）。这一配置如下输出中所示：

```console
Switch-1(config)#interface FastEthernet0/1
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport mode access
```


**注意**：`switchport` 这条命令在仅二层的交换机上并不需要，比如 Catalyst 2950 及 Catalyst 2960 系列等。但是，在多层交换机上其务必要用到，比如 Catalyst 3750、Catalyst 4500 及 Catalyst 6500 系列等。

默认情况下，端口安全是关闭的；但是，这一特性可通过使用 `switchport port-security [mac-address {mac-address} | vlan {vlan-id | {access | voice}}] | mac-address {sticky} [mac-address | vlan {vlan-id | {access | voice}}] [maximum {value} [VLAN {vlan-list | {access | voice}}]]` 这条接口配置命令予以启用。这一命令下的可用选项，在下表 45.2 中得以描述。

**表 45.2** -— **端口安全的配置关键字**


| 关键字 | 描述 |
| :-- | :-- |
| `mac-address [mac-address]` |  这个关键字用于指定某一静态的安全 MAC 地址。咱们可添加一些额外的安全 MAC 地址，数量不超过所配置的最大值。 |
| `vlan {vlan id}`  | 这个关键字只应用于某一中继端口，指定 `VLAN ID` 及 MAC 地址。当没有指定 `VLAN ID` 时，那么原生 VLAN 即被使用。 |
| `vlan {access}`  | 这一关键字应仅用于某个接入端口，将该 VLAN 指定为一个接入 VLAN。 |
| `vlan {voice}`  | 这个关键字仅应用于某个接入端口，将该 VLAN 指定为一个语音 VLAN。这个选项只有在某一语音 VLAN 配置在该指定端口上才可用。 |
| `mac-address {sticky} [mac-address]`  | 这一关键字用于在指定接口上启用动态或粘滞的学习，或用于配置一个静态的安全 MAC 地址。 |
| `maximum {value}` | 这个关键字用于可在某一接口上学习到的安全地址最大数量，默认值为 1。 |


## 配置静态的安全 MAC 地址

以下输出演示了如何在某一接口上启用端口安全，以及如何在某个交换机的接入端口上，配置一个静态的安全 MAC 地址 `001f:3¢59:d63b`：

```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport mode access
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security mac-address 001f.3c59.d63b
```

以下输出演示了如何在某个接口上启用端口安全，以及在某一交换机的中继端口上，配置一个 `VLAN 5` 中的静态安全 MAC 地址 `001f:3¢59:d63b`：


```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport trunk encapsulation dot1q
Switch-1(config-if)#switchport mode trunk
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security mac-address 001f.3c59.d63b  vlan 5
```

以下输出演示了如何在某一接口上启用端口安全，以及在某个交换机的接入端口上，配置一个 `VLAN 5`（数据 VLAN）的静态安全 MAC 地址 `001f:3¢59:5555`，及配置一个 `VLAN 7`（语音 VLAN）的静态安全 MAC 地址 `001f:3c59:7777`：

```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport mode access
Switch-1(config-if)#switchport access vlan 5
Switch-1(config-if)#switchport voice vlan 7
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security maximum 2
Switch-1(config-if)#switchport port-security mac-address 001f.3c59.5555  vlan access
Switch-1(config-if)#switchport port-security mac-address 001f.3c59.7777 vlan voice
```

要务必记住，在于某一同时配置以一个和数据 VLAN 结合的语音 VLAN 的接口上，启用端口安全时，该端口上的最大允许安全地址数，应被设置为 2。这是经由 `switchport port-security maximum 2` 接口配置命令完成的，其包含于上面的输出中。


其中两个 MAC 地址之一由 IP 话机使用，而交换机会在那个语音 VLAN 上获悉这个地址。另一 MAC 地址则会被某一会被连接到这个 IP 话机的主机（比如某个 PC）使用。这个地址将由交换机在那个数据 VLAN 上学习到。

## 验证静态安全 MAC 地址的配置


全局的端口安全配置参数，可通过执行 `show port-security` 这条命令加以验证。下面显示了由这条命令，根据一些默认值打印的输出：

```console
Switch-1#show port-security
Secure Port MaxSecureAddr  CurrentAddr SecurityViolation  Security Action
           (Count)        (Count)      (Count)
-------------------------------------------------------
Gi0/2       1               1             0              Shutdown
------------------------------------------------------------------
Total Addresses in System : 1
Max Addresses limit in System : 1024
```

正如在上面的输出所看到的，默认情况下，每个端口仅允许一个的安全 MAC 地址。此外，在某一违规的情形下，默认的操作是关闭该端口。`Total Addresses in System : 1` 表明已知只有一个安全地址，即配置于那个接口上的静态地址。同样结果也可通过执行 `show port-security interface [name]` 这条命令予以确认，如下输出中所示：

```console
Switch-1#show port-security interface gi0/2
Port Security : Enabled
Port status : SecureUp
Violation mode : Shutdown
Maximum MAC Addresses : 1
Total MAC Addresses : 1
Configured MAC Addresses : 1
Sticky MAC Addresses : 0
Aging time : 0 mins
Aging type : Absolute
SecureStatic address aging : Disabled
Security Violation count : 0
```

**注意**：上面输出中一些其他默认参数的修改，将在我们继续这一小节时详细描述。

要查看端口上实际配置的静态安全 MAC 地址，就必须使用 `show port-security address` 或 `show running-config interface [name]` 两条命令。以下输出演示了 `show port-security address` 这条命令：

```console
Switch-1#show port-security address
          Secure Mac Address Table
------------------------------------------------------------------
Vlan    Mac Address       Type                Ports   Remaining Age
                                                         (mins)
----    -----------       ----                -----   -----------
   1    001f.3c59.d63b    SecureConfigured    Gi0/2       -
-------------------------------------------------------------------
Total Addresses in System : 1
Max Addresses limit in System : 1024
```

## 配置动态的安全 MAC 地址

默认情况下，在端口安全于某一端口上启用后，该端口将在无需管理员的任何进一步配置下，动态地学习并保护一个 MAC 地址。要允许端口学习并保护多个 MAC 地址，那么就必须使用 `switchport port-security maximum [number]` 这条命令。要记住，其中的 `[number]` 关键字取决于平台，而将在不同 Cisco Catalyst 交换机型号上有所不同。

**真实世界的部署**

在 Cisco Catalyst 3750 交换机下的生产网络中，先确定出交换机将用于何种目的始终是个好主意，随后再经由 `sdm prefer {access | default | dual-ipv4-and-ipv6 {default | routing | vlan} | routing | vlan} [desktop]` 这条全局配置命令，选择适当的交换机数据库管理（SDM）模板。

每种模板均会分配系统资源以最佳支持那些正使用的特性，或那些将用到的特性。默认情况下，交换机会尝试提供一种所有特性间的平衡。但是，这样做可能对其他可用特性及功能的可能最大值，施加某种限制。一个示例便是，在使用端口安全时，可学习或配置的安全 MAC 地址的最大可能数量。

以下输出演示了在接口 `GigabitEthernet0/2` 上，如何将某个交换机端口配置为动态学习并保护最多两个 MAC 地址：

```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport mode access
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security maximum 2
```

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

## 验证动态的安全 MAC 地址

动态的安全 MAC 地址配置，可通过与静态安全地址配置示例中所演示的同一命令加以验证，但 `show running-config` 命令除外。这是因为，不同于静态或粘滞的安全 MAC 地址，所有动态学习到的地址，均不会保存在交换机配置中，并会在端口关闭时被移除。这些同样地址在随后端口重新上线时，都必须被重新学习。以下输出演示了 `show port-security address` 这条命令，其显示了一个配置为动态安全 MAC 地址学习的接口：


```console
Switch-1#show port-security address
          Secure Mac Address Table
------------------------------------------------------------------
Vlan    Mac Address       Type                Ports   Remaining Age
                                                         (mins)
----    -----------       ----                -----   ------------
   1    001d.09d4.0238    SecureDynamic       Gi0/2      -
   1    001f.3c59.d63b    SecureDynamic       Gi0/2      -
------------------------------------------------------------------
Total Addresses in System : 2 Max Addresses limit in System : 1024
```

## 配置粘滞的安全 MAC 地址

以下输出演示了如何于端口上配置动态粘滞的学习，并限制该端口为动态学习数量最多 10 个的 MAC 地址：


```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport
Switch-1(config-if)#switchport mode access
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security mac-address sticky
Switch-1(config-if)#switchport port-security maximum 10
```

根据上面的配置，默认情况下，最多 10 个地址将于接口 `GigabitEthernet0/2` 上被动态地学习到，并被添加到当前的交换机配置。在粘滞的地址学习启用后，于每个端口上学习到的 MAC 地址，会被自动保存到当前的交换机配置，并被添加到地址数据表。以下输出显示了在接口 `GigabitEthernet0/2` 上动态学习到的 MAC 地址：


```console
Switch-1#show running-config interface GigabitEthernet0/2
Building configuration...
Current configuration : 550 bytes
!
interface GigabitEthernet0/2
switchport
switchport mode access
switchport port-security
switchport port-security maximum 10
switchport port-security mac-address sticky
switchport port-security mac-address sticky 0004.c16f.8741
switchport port-security mac-address sticky 000c.cea7.f3a0
switchport port-security mac-address sticky 0013.1986.0a20
switchport port-security mac-address sticky 001d.09d4.0238
switchport port-security mac-address sticky 0030.803f.ea81
```

上述输出中的 MAC 地址，均是动态学习到的并被添加到了当前的配置。无需手动的管理员配置，便会将这些地址添加到配置。默认情况下，粘滞的安全 MAC 地址不会被自动添加到启动配置（NVRAM）。要确保这一信息被保存到 NVRAM，这意味着在交换机重启后，这些地址不会加以重新学习，重要的是要记住，要执行 `copy running-config startup-config` 这条命令，或 `copy system:running-config nvram:startup-config` 命令，具体取决于这一特性实现所在交换机的 IOS 版本。以下输出演示了在某一配置了粘滞地址学习端口的 `show port-security address` 命令：


```console
Switch-1#show port-security address
          Secure Mac Address Table
------------------------------------------------------------------
Vlan    Mac Address       Type                Ports   Remaining Age
                                                         (min)
----    -----------       ----                -----   ------------
   1    0004.c16f.8741    SecureSticky        Gi0/2       -
   1    000c.cea7.f3a0    SecureSticky        Gi0/2       -
   1    0013.1986.0a20    SecureSticky        Gi0/2       -
   1    001d.09d4.0238    SecureSticky        Gi0/2       -
   1    0030.803f.ea81    SecureSticky        Gi0/2       -
-------------------------------------------------------------------
Total Addresses in System : 5 Max Addresses limit in System : 1024
```

咱们还可在交换机上设置老化时间及类型，但这超出 CCNA 级别的要求。（若咱们愿意，可自行尝试配置。）


## 配置端口安全违反的操作

正如早先所指出的，Cisco 10S 软件允许管理员在发生某一违反端口安全时间发生时，指定四种如下不同操作：

- 保护
- 关闭（默认）
- 限制
- 关闭 VLAN


这四个选项是通过使用 `switchport port-security [violation {protect | restrict | shutdown | shutdown vlan}]` 这条接口配置命令加以配置的。当某一端口因安全违规而关闭时，那么他将显示为 `errdisabled`，而要将其恢复，就要先应用 `shutdown` 命令，并随后应用 `no shutdown`。

```console
Switch#show interfaces FastEthernet0/1 status
Port    Name       Status       Vlan     Duplex  Speed  Type
Fa0/1              errdisabled  100      full    100    100BaseSX
```

思科确实希望咱们了解，哪些违规动作会触发一条发送给网络管理员的 SNMP 消息，以及一条日志记录消息，因此下面便是于下表 45.3 中，提供给咱们的这一信息。

<a name="table-45.3"></a>
**表 45.3** —— **端口安全违规的操作**


| 模式 | 端口动作 | 流量 | 系统日志 | 违规计数器 |
| :-- | :-- | :-- | :-- | :-- |
| 保护 | 受保护 | 未知 MAC 的流量会被丢弃 | 无 | 无 |
| 关闭 | `errdisabled` | 关闭 | 会记录系统日志，并发出一条 SNMP 的陷阱消息 | 递增 |
| 限制 | 开放 | 超出 MAC 数量的流量会被拒绝 | 会记录系统日志，并发出一条 SNMP 的陷阱消息 | 递增 |


出于考试目的，要确保咱们上面的表格！

以下输出演示了如何在某个端口上，启用最多 10 个 MAC 地址的粘滞学习。在某个未知 MAC 地址（例如第 11 个 MAC 地址），于某一端口上检测到的情形下，那么该端口就将被配置为丢弃接收到的数据帧。


```console
Switch-1(config)#interface GigabitEthernet0/2
Switch-1(config-if)#switchport port-security
Switch-1(config-if)#switchport port-security mac-address sticky
Switch-1(config-if)#switchport port-security maximum 10
Switch-1(config-if)#switchport port-security violation restrict
```


## 验证端口安全违规的操作

所配置的端口安全违规操作，是经由 `show port-security` 这条命令予以验证的，如下输出输出中所示：


```console
Switch-1#show port-security
Secure Port  MaxSecureAddr CurrentAddr SecurityViolation  Security Action
                (Count)        (Count)      (Count)
Gi0/2           10              5             0         Restrict
Total Addresses in System : 5
Max Addresses limit in System : 1024
```

当日志记录被启用，且于交换机上配置了 `Restrict` 模式或 `Shutdown Violation` 模式时，那么类似于以下输出中所示的一些消息，将打印在交换机控制台上、记录到本地缓冲区中，或发送到某一 `syslog` 服务器（根据上面的 [表 45.3](#table-45.3)）：


```console
Switch-1#show logging
[Truncated Output]
04:23:21: %PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0013.1986.0a20 on port Gi0/2.
04:23:31: %PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 000c.cea7.f3a0 on port Gi0/2.
04:23:46: %PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0004.c16f.8741 on port Gi0/2.
```


最后一点是，虽然交换机安全可在 Packet Tracer 上得以配置，但许多配置命令和 `show` 命令都不会工作。

## 端口安全的故障排除

在排查端口安全问题时，重要的是要首先通过使用 `show running-config interface <name>` 这条命令，检查已实施的配置。默认的一些端口安全配置参数，可能导致一些其他特性下的运行问题，比如我们前面已经介绍的 [第一跳冗余协议](../d32-FHRP.md)（即 HSRP、VRRP 及 GLBP），因为每个端口仅允许单个的 MAC 地址。这一点可经由 `show port-security interface <name>` 这条命令加以验证，如下所示：

> **译注**：原文这里仍沿用了较早版本的表述，“such as first hop redundancy protocols which we cover later (i.e., HSRP, VRRP, and GLBP)...”。

```console
Switch#show port-security interface FastEthernet0/2

Port Security              : Enabled
Port Status                : Secure-down
Violation Mode             : Shutdown
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 0
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 0
Last Source Address:Vlan   : 0000.0000.0000:0
Security Violation Count   : 0
```

查看这一命令的输出时，重要的是要理解由交换机打印出的这些信息。其中的 `Port Status` 字段，表明了这个端口的运行状态（即该端口是 `up` 还是 `down`）。在上面的示例中，端口为 `down`，这可能是由于一层的问题，或 `shutdown` 命令已在该端口下执行，或 `switchport port-security` 命令尚未在这个接口/端口下执行。

`Violation Mode` 字段表示交换机配置的违规模式。默认模式为关闭。`Aging Time` 与 `Aging Type` 两个字段，指定了老化时间及类型参数。默认情况下，安全 MAC 地址将不老化而失效，而将保留在交换机的 MAC 数据表中直至设备关机。但是，这一默认行为，可通过配置动态与静态安全 MAC 地址的老化值而得以调整。有效的老化时间范围为 0 至 1440 分钟。

`SecureStatic Address Aging` 字段，指明了安全地址的老化方式。这个字段既可是个绝对值，或者依据某一配置的不活动周期。绝对的老化机制，会导致端口上的受保护 MAC 地址在某一固定的指定时间后老化。所有的引用都会在这一指定时间后，在安全地址列表中清除，而这个地址随后必须在该交换机端口上重新学习到。一旦被重新学习到，那么计时器会再次开始计时，而这一过程会以已定义在所配置计时器值中的周期被重复。这便是安全 MAC 地址的默认老化类型。

所谓非活动时间，亦被称为空闲时间，会导致受保护的 MAC 地址，在指定时点段内，无接收自于该端口上学习到的安全地址的活动（即数据帧或数据）时，被老化。

`Maximum MAC Addresses` 字段，指明了每个端口所允许的安全 MAC 地址数量。默认值为 1，最大值取决于交换机平台。`Total MAC Addresses` 字段，表示于该端口上学习到的当前 MAC 地址总数。`Configured MAC Addresses` 字段，指明了于该端口上静态配置的安全地址数量。`Sticky MAC Addresses` 字段，指明了配置于该端口上的粘滞安全 MAC 地址数量。`Last Source Address:Vlan` 字段，指明了于该端口上学习到的最后那个安全 MAC 地址。这个字段仅在端口安全配置于某一中继链路上时适用。

最后，`Security Violation Count` 字段，指明了该端口上安全违规的次数。为了进一步强化这一小节中已讨论的内容，请考虑以下输出：

```console
Switch#show port-security interface FastEthernet0/2
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Restrict
Aging Time                 : 10 mins
Aging Type                 : Inactivity
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 10
Total MAC Addresses        : 6
Configured MAC Addresses   : 1
Sticky MAC Addresses       : 5
Last Source Address:Vlan   : 0000.0000.0000:0
Security Violation Count   : 0
```


从上面打印出的端口安全接口输出，我们可以确定以下几点：

- 这个接口为 `up` 状态，同时 `switchport port-security` 这条命令已于该接口下执行。这一点反应在 `Secure-up` 的端口状态里；
- `switchport port-security violation restrict` 这条命令已于该接口下执行（默认违规模式为关闭）；
- `switchport port-security aging time 10` 与 `switchport port-security aging type inactivity` 两条命令已于该接口下执行，因为老化时间默认值为 0 分钟，同时老化类型默认为绝对模式；
- `switchport port-security maximum 10` 这一命令已于该接口下执行，因为在端口安全启用后，默认只有一个 MAC 地址被允许。
- 参考其中总的 MAC 地址数，我们可以确定 `switchport port-security mac-address sticky` 这一命令已被执行，并指定了五个安全粘滞地址，同时 `switchport port-security mac-address` 这一命令也已被执行，并指定了一个安全地址，因为默认情况下这些地址并未被定义；
- 最后，我们可以确定尚未在该接口或端口上检测到安全违规，因其中的计数器值仍有个 0 的值。在流量到达这个接口后，最后的源 MAC 地址将被记录。


## 错误禁用的恢复


一系列事件都会导致思科交换机，将其端口置于一种名为 `err-disabled` 的特殊禁用模式。这种模式基本上意味着，某一特定端口已由于某种错误，而被禁用（关闭）。这一错误可能有着多种原因，而最常见的原因之一，便是对某一端口安全策略的违反。当某一未授权用户尝试连接某个交换机端口时，这便是一种正常行为，且其阻止了恶意设备访问网络。


某一 `err-disabled` 端口可能看起来如下面这样：

```console
Switch# show interface f0/1
FastEthernet0/1 is down, line protocol is down [err-disabled]
```

为了重新激活某一 `err-disabled` 的接口，那么经由在该接口上执行 `shutdown` 与 `no shutdown` 两条命令的人工干预是必要的（被网络工程师称为 “拍打端口”）。但是，一些情况则可能需要原始端口状态的自动恢复，而非等待某名管理员手动启用该端口。`err-disabled` 的恢复模式，通过配置交换机为根据生成这一失效的事件，在某一特定时间段后，自动重新启用某一 `err-disabled` 的端口而发挥作用。这种模式提供了在确定哪些事件可被 `err-disabled` 恢复功能监控方面更细的粒度。


执行这一操作的命令是 `errdisable recovery cause`，要在全局配置模式下输入：

```console
Switch(config)#errdisable recovery cause ?
  all        Enable timer to recover from all causes
  bpduguard  Enable timer to recover from bpdu-guard error disable state
  dtp-flap   Enable timer to recover from dtp-flap error disable state
  link-flap  Enable timer to recover from link-flap error disable state
  pagp-flap  Enable timer to recover from pagp-flap error disable state
  rootguard  Enable timer to recover from root-guard error disable state
  udld       Enable timer to recover from udld error disable state
```

`errdisable recovery cause` 命令会根据设备型号而有所不同，但最常见的一些参数为：

- `all`
- `arp-inspection`
- `bpduguard`
- `dhcp-rate-limit`
- `link-flap`
- `psecure-violation`
- `security-violation`
- `storm-control`
- `udld`


在大多数平台上，端口自动恢复的时间默认为 300 秒，但这一事件可以 `errdisable recovery interval` 这条全局配置命令手动予以配置：

```console
Switch(config)#errdisable recovery interval ?
  <30-86400>  timer-interval(sec)
```

`show errdisable recovery` 这条命令将提供有关受 `err-disabled` 恢复功能监控的那些活动特性，以及有关正被监控中的接口的信息，包括接口启用前所剩时间。

```console
Switch#show errdisable recovery
ErrDisable Reason            Timer Status
-----------------            --------------
arp-inspection               Disabled
bpduguard                    Disabled
channel-misconfig            Disabled
dhcp-rate-limit              Disabled
dtp-flap                     Disabled
gbic-invalid                 Disabled
inline-power                 Disabled
l2ptguard                    Disabled
link-flap                    Disabled
mac-limit                    Disabled
link-monitor-failure         Disabled
loopback                     Disabled
oam-remote-failure           Disabled
pagp-flap                    Disabled
port-mode-failure            Disabled
psecure-violation            Enabled
security-violation           Disabled
sfp-config-mismatch          Disabled
storm-control                Disabled
udld                         Disabled
unicast-flood                Disabled
vmps                         Disabled
Timer interval: 300 seconds
Interfaces that will be enabled at the next timeout:
Interface       Errdisable reason       Time left(sec)
---------       -----------------       --------------
Fa0/0           psecure-violation       193
```



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

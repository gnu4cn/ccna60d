# VLAN 与中继的故障排除


在第 6 和第 7 天时，我们曾介绍过这一主题，但值得再次讨论。我们将不会重复已经讲过的内容，相反，我们将介绍一些其他的故障排除方面。

早先，我们曾讨论了可用于物理层问题排除的三条 CLI 命令的用法。这一小节介绍一些识别及排除 VLAN 内，连接问题的一些常见方法。VLAN 内连接问题的一些常见原因，包括以下这些：

- 双工不匹配；
- 坏的 NIC 或线缆；
- 拥塞；
- 硬件故障；
- 软件问题；
- 资源过度预定，译注：请参考 [Cisco MDS交换机端口组速率模式介绍](../pdfs/EMC_Community_Network-ECN_Cisco_MDS交换机端口组速率模式介绍.pdf)；
- 配置问题。

双工的失配，会导致极度慢速的网络性能及连通性。虽然自动协商下的一些改进已经完成，且自动协商功能的使用，被认为是一项有效做法，但发生双工失配仍有可能。例如，当 NIC 被设置为 `100/Full` 而交换机端口为自动协商时，那么该 NIC 将保留其 `100/Full` 的设置，而交换机端口将被设置为 `100/Half`。另一个示例正好相反；那便是 NIC 被设置为自动协商，而交换机端口被设置为 `100/Full`。在这种情况下，NIC 将自动协商为 `100/Half`，而交换机会保留其静态的 `100/Full` 配置，从而导致双工失配。


因此，在可行情况下，手动指定 `10/100` 以太网连接的速率及双工设置，避免自动协商下的双工失配，便是好的做法。双工失配不仅会影响直连到交换机的用户，还会影响穿过有着不匹配双工设置的交换机间链路的网络流量。端口的接口速率与双工设置，可使用 `show interfaces` 命令查看。


**注意**：由于 Catalyst 交换机仅支持 1Gbps 链路的全双工，因此对于 `GigabitEthernet` 的连接，这通常不是个问题。


Cisco 10S 软件中的多个计数器，均可用于识别某种潜在的不良 NIC 或布线问题。通过检查不同 `show` 命令下一些特定计数器的值，NIC 或布线的问题便可识别到。例如，当这些交换机端口计数器，显示出一些带有不良 CRC 或 FCS 错误的数据帧在不断增加时，那么这很可能归因于工作站或机器上的不良 NIC，或劣质网线。


网络拥塞也会导致交换网络中的间歇性连接问题。当某个端口上的 Rx 或 Tx 缓冲区被超量占用时，这便是咱们 VLAN 过载的第一个迹象。此外，某个端口上的过多数据帧丢弃，也会是一种网络拥塞迹象。网络拥塞的一种常见原因，便是低估了那些骨干连接的总带宽需求。在此类情形下，拥塞问题可通过配置 EtherChannel，或通过添加一些额外端口到现有的 EtherChannel 解决。虽然网络拥塞属于连通性问题的一种常见原因，但同样重要的是，要清楚交换机本身也会遇到拥塞问题，其会对网络性能有着类似影响。


有限的交换机带宽，会导致拥塞问题，而这会严重影响网络性能。在 LAN 交换下，所谓带宽，指的是 [交换机内部线路](../pdfs/the_Definition_of_a_Switch_Fabric-EtherealMind.pdf) 的容量。因此，当交换机内部线路速率为 5Gbps，而咱们试图通过该交换机传输 7Gbps 水平的流量时，那么最终结果便是数据包丢失，以及差强人意的网络性能。这是那些所有端口总容量，可能超过背板总容量的超量订购平台中的一种常见问题。


硬件故障也会造成交换 LAN 中的连通性问题。此类问题的示例，包括不良端口或不良的交换机模组。在可行时，咱们可通过查看比如 LED 等物理指示灯，排除此类问题，但此类问题有时会难于排除与诊断。在大多数情况下，当咱们怀疑一些潜在的硬件故障问题时，咱们应寻求技术支持中心 (TAC) 的帮助。


软件 bug 就更难于识别，因为他们会导致偏差，而偏差是难于故障排除的。在咱们怀疑某个软件 bug 可能正导致连接问题情况下，那么咱们应就咱们的发现，联系技术援助中心（TAC）。此外，当一些错误消息打印在控制台上或出现在日志中时，咱们还可使用思科提供的一些在线工具，实施某种变通解决办法，或获取某种其中问题已得以解决并验证的软件版本建议。

与任何其他硬件设备一样，交换机也只有有限资源，比如物理内存等。当这些资源被过度占用时，这便会导致严重的性能问题。诸如高 CPU 利用率等问题，会对交换机及网络性能有显著影响。

最后，与任何别的技术一样，不正确的配置同样会直接或间接地导致连通性问题。例如，根网桥不佳布置，就会导致用户的慢速连接。直接集成或添加一台将配置不当的交换机到生产网络中，就会导致部分或全部用户的网络完全中断。以下几个小节介绍了一些常见的 VLAN 相关问题、其可能原因，以及可以采取的补救措施。

> *知识点*：
>
> - intra-VLAN connectivity issues
>
> - some other troubleshooting aspects
>
> - some common approaches to identifying and troubleshooting intra-VLAN connectivity issues
>
> - very slow network performance and connectivity
>
> - a valid practice
>
> - inter-switch links
>
> - NIC or cabling issues
>
> - network congestion
>
> - a common cause of network congetstion
>
> - aggregate bandwidth requirements for backbone connections
>
> - adding additional ports to existing EtherChannels
>
> - the switch fabric
>
> - oversubsribed platforms
>
> - the aggregate capacity of all ports
>
> - the switched LAN
>
> - physical indicators
>
> - Technical Assistance Center, TAC
>
> - faulty hardware
>
> - resources are oversubsribed
>
> - severe performance issues
>
> - high CPU utilization
>
> - slow connectivity
>
> - the actions that can be taken to remedy some common VLAN-related issues

## 动态 VLAN 通告故障排除

Cisco Catalyst 交换机使用 VLAN 中继协议 (VTP)， 在整个交换域中动态传播 VLAN 信息。VTP 属于一种 Cisco 专有的，管理同一 VTP 域内交换机 VLAN 的添加、删除及重命名等的二层消息协议。

交换机在添加到 VTP 域时，无法动态接收任何 VLAN 信息原因有数种。常见原因包括以下这些：

- 二层中继的错误配置
- VTP 配置不正确
- 配置修订编号的原因
- 物理层故障
- 软硬件故障或 bug
- 交换机的性能问题


为了让交换机使用 VTP 交换 VLAN 信息，一条中继必须在交换机之间建立起来。Cisco 10S 交换机同时支持 ISL 及 802.1Q 的中继机制。尽管一些交换机默认为思科专有中继机制 ISL，当前的 Cisco 10S Catalyst 交换机默认为 802.1Q。在开通交换机之间中继时，手动指定中继封装协议，被视为一种很好的做法。这是在将链路配置为中继端口时，使用 `switchport trunk encapsulation [isl|dot1q]` 接口配置命令实现的。

有数条咱们可使用于排除中继连通性故障的命令。咱们可使用 `show interfaces` 命令，检查基本的端口运行及管理状态。此外，咱们可追加 [`trunk]` 或 `[errors]` 关键字，执行一些额外故障排除及验证。`show interfaces [name] counters trunk` 命令可用于查看中继端口上传输和接收的数据帧数目。

这一命令的输出，还包括了可用于检查 802.1Q 及 ISL，及中继封装不匹配等的封装错误数，如下输出中所示：

```console
Cat-3550-1#show interfaces FastEthernet0/12 counters trunk
Port    TrunkFramesTx   TrunkFramesRx   WrongEncap
Fa0/12           1696           32257            0
```

参考上面的输出，咱们可以重复同一命令，确保 Tx 和 Rx 列都在递增，然后在此基础上执行其他的故障排除。例如，若交换机未在发送任何的数据帧，那么这个接口可能没有被配置为中继接口，或者其可能处于 `down` 或 `disabled` 状态。当 Rx 列未在递增时，则可能是远端交换机没有被正确配置。

另一条可用于排除一些可能的二层中继错误配置的命令，是 `show interfaces [name] trunk`。这一命令的输出，包含了中继的封装协议与模式、802.1Q 的原生 VLAN、允许穿越中继的那些 VLAN、活跃于该 VTP 域中的那些 VLAN，以及那些被修剪掉的 VLAN 等。VLAN 传播的一种常见问题，是上游交换机已被配置为使用 `switchport trunk allowed vlan` 这条接口配置命令，过滤掉中继链路上的某些 VLAN。`show interfaces [name] trunk` 命令的输出如下所示。


```console
Cat-3550-1#show interfaces trunk
Port    Mode        Encapsulation   Status      Native vlan
Fa0/12  desirable   n-802.1q        trunking    1
Fa0/13  desirable   n-802.1q        trunking    1
Fa0/14  desirable   n-isl           trunking    1
Fa0/15  desirable   n-isl           trunking    1

Port    Vlans allowed on trunk
Fa0/12  1-4094
Fa0/13  1-4094
Fa0/14  1-4094
Fa0/15  1-4094

Port    Vlans allowed and active in management domain
Fa0/12  1-4
Fa0/13  1-4
Fa0/14  1-4
Fa0/15  1-4

Port    Vlans in spanning tree forwarding state and not pruned
Fa0/12  1-4
Fa0/13  none
Fa0/14  none
Fa0/15  none
```

另一种常见中继错误配置问题，便是原生 VLAN 的不匹配。咱们在配置 802.1Q 的中继时，该中继链路两侧的原生 VLAN 必须匹配；否则，该链路将不工作。当原生 VLAN 不匹配时，那么 STP 就会把该端口置于端口 VLAN ID (PVID) 不一致状态，而将不在链路上转发。在此类情形下，类似于以下的错误消息，将打印在控制台或日志中：


```console
*Mar 1 03:16:43.935: %SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 1 on FastEthernet0/11 VLAN2.
*Mar 1 03:16:43.935: %SPANTREE-2-BLOCK_PVID_PEER: Blocking FastEthernet0/11 on VLAN0001. Inconsistent peer vlan.
*Mar 1 03:16:43.935: %SPANTREE-2-BLOCK_PVID_LOCAL: Blocking FastEthernet0/11 on VLAN0002. Inconsistent local vlan.
*Mar 1 03:16:43.935: %SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 1 on FastEthernet0/12 VLAN2.
*Mar 1 03:16:43.935: %SPANTREE-2-BLOCK_PVID_PEER: Blocking FastEthernet0/12 on VLAN0001. Inconsistent peer vlan.
*Mar 1 03:16:43.939: %SPANTREE-2-BLOCK_PVID_LOCAL: Blocking FastEthernet0/12 on VLAN0002. Inconsistent local vlan.
```

尽管 STP 的故障排除将在这本指南中稍后介绍，这种不一致状态仍可使用 `show spanning-tree` 命令验证，如下所示。


```console
Cat-3550-1#show spanning-tree interface FastEthernet0/11

Vlan                Role    Sts     Cost        Prio.Nbr    Type
------------------- ----    ---     --------    --------    ----------------
VLAN0001            Desg    BKN*    19          128.11      P2p *PVID_Inc
VLAN0002            Desg    BKN*    19          128.11      P2p *PVID_Inc
```


当咱们已查明并验证了两台交换机之间中继确实已正确配置并是运行的时，那么下一步便是要验证 VTP 的配置参数。这些参数包括该 VTP 域的名字、正确的 VTP 模式，以及若已为该 VTP 域配置过的 VTP 口令。要相应地使用 `show vtp status` 和 `show vtp password` 命令。`show vtp status` 命令的输出如下所示。


```console
Cat-3550-1#show vtp status
VTP Version                     : running VTP2
Configuration Revision          : 0
Maximum VLANs supported locally : 1005
Number of existing VLANs        : 8
VTP Operating Mode              : Server
VTP Domain Name                 : TSHOOT
VTP Pruning Mode                : Enabled
VTP V2 Mode                     : Enabled
VTP Traps Generation            : Disabled
MD5 digest                      : 0x26 0x99 0xB7 0x93 0xBE 0xDA 0x76 0x9C
...
[Truncated Output]
```

在使用 `show vtp status` 这条命令时，要确保交换机都运行着同一版本的 VTP。默认情况下，Catalyst 交换机会运行 VTP 版本 1。运行 VTP 版本 1 的某台交换机，无法加入某个 VTP 版本 2 的域。当交换机不兼容正运行的 VTP 版本 2 时，那么所有 VTP 版本 2 的交换机，均应通过使用 `vtp version`  这条全局配置命令，配置为运行版本 1。

**注意**：当咱们更改了服务器上的 VTP 版本时，随后这个更改将自动传播到该 VTP 域中的客户端交换机。

VTP 客户端/服务器，或服务器/服务器设备的 VTP 传播是开启的。当某台交换机上的 VTP 为禁用（即透明模式）时，那么该交换机将不会经由 VTP 动态地接收 VLAN 信息。但要注意在版本 2 下，透明模式交换机将在其中继端口上，转发接收到的 VTP 通告，而充当了个 VTP 中继。即使 VTP 版本不同，这种情况也会发生。VTP 域的名字，在其中交换机上也应一致。

`show vtp status` 命令的输出，还包括用于认证目的的 MD5 哈希值。这个散列值源于 VTP 域的名字和口令，应在该域中所有交换机上一致。当交换机上的 VTP 口令或域名字不同时，那么计算出的 MD5 也将不同。当域的名字或口令不同时，`show vtp status` 命令将表明一次 MD5 摘要校验和的不匹配，如下输出中所示：


```console
Cat-3550-1#show vtp status
VTP Version                     : running VTP2
Configuration Revision          : 0
Maximum VLANs supported locally : 1005
Number of existing VLANs        : 8
VTP Operating Mode              : Server
VTP Domain Name                 : TSHOOT
VTP Pruning Mode                : Enabled
VTP V2 Mode                     : Enabled
VTP Traps Generation            : Disabled
MD5 Digest                      : 0x26 0x99 0xB7 0x93 0xBE 0xDA 0x76 0x9C
*** MD5 digest checksum mismatch on trunk: Fa0/11 ***
*** MD5 digest checksum mismatch on trunk: Fa0/12 ***
...
[Truncated Output]
```

最后，配置修订编号会造成使用 VTP 时的严重破坏。交换机使用配置修订编号，跟踪 VTP 域中的最新信息。域中的每台交换机，都会存储其上次从 VTP 通告中，听到的配置修订编号，而每次有新的信息受到时，这个编号都会递增。当该 VTP 域中的任何交换机，收到一条有着高于自身的配置修订号通告报文时，那么他将覆盖任何存储的 VLAN 信息，并以通告报文中收到的信息，同步其自身存储的 VLAN 信息。

因此，当咱们想要明白为何咱们集成到 VTP 域的交换机，未在接收到任何 VLAN 信息时，那么其可能是这同一台交换机，有着较高的配置修订号，而导致所有别的交换机都要覆写他们本地的 VLAN 信息，而以接收自这台新交换机通告报文中的信息替换。要避免此类情形，就始终要确保在将某台新交换机集成到域前，其配置修订编号要被设置为 0。这可通过修改 VTP 模式，或修改该交换机上的 VTP 域名字完成。配置修订编号包含在 `show vtp status` 命令的输出中。

> *知识点*：
>
> - propagate VLAN information dynamically throughtout the swithed domain
>
> - a Cisco proprietary Layer 2 messaging protocol
>
> - the addition, deletion, and renaming of VLANs for switches in the same VTP domain
>
> - configuration revision number
>
> - a Cisco proprietary trunking mechanism
>
> - provisioning trunking between switches
>
> - the trunking encapsulation protocol
>
> - basic port operational and administrative status
>
> - the number of frames transmitted and received on trunk ports
>
> - the trunking encapsulation protocol and mode
>
> - the VTP domain
>
> - VLAN propagation
>
> - the upstream switch
>
> - a port VLAN ID(PVID) inconsistent state
>
> - VTP configuration parameters
>
> - the VTP domain name
>
> - the VTP mode
>
> - the VTP password
>
> - the same version of VTP
>
> - VTP propagation
>
> - VTP transparent mode
>
> - VTP relay
>
> - the MD5 hash used for authentication purposes
>
> - the configuration revision number can wreak havoc when using VTP
>
> - to keep track of the most recent information in the VTP domain
>
> - a VTP advertisement
>
> - an advertisement message
>
> - stored VLAN information


## VLAN 内端到端连通性丢失故障排除

有数种可能的 VLAN 内端到端连通性丢失原因。最常见的原因包括以下这些：

- 物理层的问题
- VTP 修剪
- VLAN 中继的过滤
- 新的交换机
- 交换机性能问题
- 网络拥塞
- 软件或硬件故障或 bug

**注意**：为简洁起见，只有其中的中继、VTP 修剪、中继过滤及将新交换机集成到 VTP 域，将在这一小节中介绍。软件或硬件故障或 bug，以及交换机性能问题，在这本指南中均有描述。而物理层的故障排除，则已在这一教学模组早先已有描述。

当没有本地端口属于某个 VLAN 时，VTP 修剪就会从本地交换机的 VLAN 数据库移除该 VLAN。VTP 修剪通过消除网络上不必要的广播、组播及未知流量，提升中继的效率。


虽然 VTP 修剪是一项要实施的理想功能，但不正确的配置或实施，会导致端到端的 VLAN 连通性丢失。VTP 修剪应只在那些客户端/服务器环境中启用。在某个包含着一些透明模式交换机的网络中实施修剪，就可能导致连通性丢失。当网络中的一台或多台交换机处于 VTP 透明模式时，咱们就应对整个 VTP 域全局禁用修剪，或要通过在适用接口下，使用 `switchport trunk pruning vlan` 接口配置命令，确保到上游的透明模式交换机的中继链路上的所有 VLAN，都不符合修剪条件（即他们不会被修剪）。

### 验证允许的 VLAN 与中继状态

除了 VTP 修剪外，交换机中继链路上的不当 VLAN 过滤，也会导致端到端 VLAN 连通性丢失。默认情况下，所有 VLAN 都允许穿过所有中继链路；但是，Cisco 10S 软件允许管理员使用 `switchport trunk allowed vlan` 接口配置命令，选择性地移除特定中继链路上的 VLAN，或选择性地将 VLAN 添加到特定中继链路。咱们可使用 `show interfaces [name] trunk` 与 `show interfaces [name] switchport` 命令，查看中继链路上被修剪与受限制的 VLAN。作为验证中继上允许 VLAN 最简单方法，`show interfaces [name] trunk` 命令的输出如下所示。


```console
Cat-3550-1#show interfaces trunk

Port    Mode    Encapsulation   Status      Native vlan
Fa0/1   on      802.1q          trunking    1
Fa0/2   on      802.1q          trunking    1

Port    Vlans allowed on trunk
Fa0/1   1,10,20,30,40,50
Fa0/2   1-99,201-4094

Port    Vlans allowed and active in management domain
Fa0/1   1,10,20,30,40,50
Fa0/2   1,10,20,30,40,50,60,70,80,90,254

Port    Vlans in spanning tree forwarding state and not pruned
Fa0/1   1,10,20,30,40,50
Fa0/2   1,40,50,60,70,80,90,254
```

咱们还应该检查一些正确的 VLAN 在咱们中继链路上通告。一些不当 VLAN 在链路上放行，会导致功能缺失或安全问题。同样，咱们还要确保同样的一些 VLAN，在中继链路两端被放行。

**注意**：在添加一些应在某条中继链路上放行的别的 VLAN 时，咱们应添加应非常小心不要忘掉 `[add]` 关键字。例如，当咱们已配置了 `switchport trunk allowed vlan 10,20`，并打算还要放行 `VLAN 30` 时，那么咱们就需要敲入 `switchport trunk allowed vlan add 30` 命令。当咱们只是配置了 `switchport trunk allowed vlan 30` 时，那么之前放行的 `VLAN 10` 和 `VLAN 20`，就会从该中继中移除，这将导致 `VLAN 10` 和 `VLAN 20` 的通信中断。

`show interface trunk` 命令所提供的另一个重要信息，是中继的状态。这一信息确认了该中继是否已形成，并务必要在链路两端加以检查。当接口未处于 “中继” 模式下时，那么必须检查的最重要信息之一，便是运行模式（`on`、`auto` 等），以查看该接口是否允许与链路的另一端形成中继状态。

### 验证封装类型


解决中继问题的另一重要步骤，是验证在中继链路两端，正确封装方式是否得以配置。大多数思科交换机都同时允许 ISL 和 dot1Q 的封装方式。虽然大多数的现代网络设计都使用 dot1Q，但在某些情况下，ISL 则是首选方式。封装类型是以 `switchport trunk encapsulation <type>` 命令配置的。一些可用于检查封装类型的命令如下：

- `show interfaces trunk`
- `show interfaces <number> switchport`

在某个已被静态配置为 802.1Q 中继链路的端口上，`show interfaces [name] switchport` 命令的输出如下所示。

```console
Cat-3550-2#show interfaces FastEthernet0/7 switchport
Name: Fa0/7
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Administrative Native VLAN tagging: enabled

Voice VLAN: none

Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk native VLAN tagging: enabled
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk associations: none
Administrative private-vlan trunk mappings: none
Operational private-vlan: none
Trunking VLANs Enabled: 3,5,7
Pruning VLANs Enabled: 2-8
Capture Mode Disabled
Capture VLANs Allowed: ALL

Protected: false
Unknown unicast blocked: disabled
Unknown multicast blocked: disabled
Appliance trust: none
```

如前一小节所述，集成一台新交换机到网络，会导致该管理域中的 VLAN 信息丢失。而这种 VLAN 信息的丢失，又会导致该同一 VLAN 内的设备之间连通性的丢失。要确保在集成某台新交换机到局域网前，重置配置修订编号。


> *知识点*：
>
> - end-to-end connectivity
>
> - VTP pruning
>
> - VLAN trunk filtering
>
> - the VLAN database of the local switch
>
> - VTP pruning increased the efficiency of trunks by eliminating unnecessary Broadcast, Multicast, and unknow traffic from being flooded across the network
>
> - a desirable feature to implement
>
> - client/server environments
>
> - transparent mode switches
>
> - globally disable pruning for the entire domain
>
> - the applicable interfaces
>
> - by default, all VLANs are allowed to traverse all trunk links
>
> - pruned and restricted VLANs on trunk links
>
> - the trunk status
>
> - an 802.1Q trunk link
>
> - the configuration revision number

## 使用 `show vlan` 命令

除了前面小节中介绍的命令外，还有其他一些对验证 VLAN 配置，及 VLAN 配置故障排除都非常有用的 Cisco IOS 软件命令。最常用的 VLAN 验证和故障排除命令之一，便是 `show vlan` 命令。这条命令会显示管理域内所有 VLAN 的参数，如以下输出中所示：

```console
Cat-3550-1#show vlan
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/11, Fa0/12,
                                                Fa0/13, Fa0/14,
                                                Fa0/20, Fa0/21,
                                                Fa0/22, Fa0/23,
                                                Fa0/24
150  VLAN_150                         active    Fa0/2, Fa0/3, Fa0/4,
                                                Fa0/5, Fa0/6, Fa0/7,
                                                Fa0/8, Fa0/9, Fa0/10
160  VLAN_160                         active    Fa0/15, Fa0/16,
                                                Fa0/17, Fa0/18,
                                                Fa0/19
170  VLAN_170                         active    Gi0/1, Gi0/2
1002 fddi-default                     active
1003 token-ring-default               active
1004 fddinet-default                  active
1005 trnet-default                    active

VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode
---- ----- ---------- ----- ------ ------ -------- ---- --------
1    enet  100001     1500  -      -      -        -    -
150  enet  100150     1500  -      -      -        -    -
160  enet  100160     1500  -      -      -        -    -
170  enet  100170     1500  -      -      -        -    -
1002 fddi  101002     1500  -      -      -        -    -
1003 tr    101003     1500  -      -      -        -    -
1004 fdnet 101004     1500  -      -      -        ieee -
1005 trnet 101005     1500  -      -      -        ibm  -

Trans1 Trans2
------ ------
0      0
0      0
0      0
0      0
0      0
0      0
0      0
0      0

Remote SPAN VLANs
-------------------------------------------------------------------

Primary Secondary Type              Ports
------- --------- ----------------- -------------------------------
```

这条命令会打印所有可用的 VLAN，以及分配给每个单独 VLAN 的端口。只有那些接入端口，无论他们是 `up` 还是 `down`，都将包含在这一命令的输出中。那些中继链路将不包括，因为这些链路属于全体 VLAN。`show vlan` 命令还提供该交换机上有关 RSPAN VLAN，以及私有 VLAN (PVLAN) 配置的信息（这属于 CCNP 主题）。`show vlan` 命令可与一些附加关键字一起使用，提供更具体的信息。以下输出显示了可与这条命令一起使用的附加关键字：


```console
Cat-3550-1#show vlan ?
brief           VTP all VLAN status in brief
id              VTP VLAN status by VLAN id
ifindex         SNMP ifIndex
name            VTP VLAN status by VLAN name
private-vlan    Private VLAN information
remote-span     Remote SPAN VLANs
summary         VLAN summary information
|               Output modifiers<cr>
```

其中 `brief` 字段会打印所有活动 VLAN 的简要状态。有这个命令打印的输出与上面的输出相同，唯一的区别是最后两个小节将被省略。`id` 字段会提供与 `show vlan` 命令相同的信息，但只针对特定 VLAN，如下输出中所示：

```console
Switch-1#show vlan id 150
VLAN Name                             Status    Ports
---- -------------------------------- --------- --------------------
150  VLAN_150                         active    Fa0/1, Fa0/2, Fa0/3,
                                                Fa0/4, Fa0/5, Fa0/6,
                                                Fa0/7, Fa0/8, Fa0/9,
                                                Fa0/10

VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode
---- ----- ---------- ----- ------ ------ -------- ---- --------
150  enet  100150     1500  -      -      -        -    -

Trans1 Trans2
------ ------
0      0
0      0

Remote SPAN VLAN
----------------
Disabled

Primary Secondary Type              Ports
------- --------- ----------------- --------------------------------
```

同样，VLAN 名字会包含在输出中，以及属于这个 VLAN 的所有接入端口。中继端口不会包括在此输出中，因为他们属于全部 VLAN。一些额外信息还包括了 VLAN 的 MTU、RSPAN 配置（当适用时）及 PVLAN 配置参数（当适用时）。


`name` 字段允许指定 VLAN 名字而不是 ID。这一命令会打印与 `show vlan id <number>` 命令同样的信息。`ifindex` 字段会显示该 VLAN 的 SNMP `IfIndex`（在适用时），而 `private-vlan` 和 `remote-span` 字段，则会分别打印 PVLAN 与 RSPAN 的配置信息。最后，`summary` 字段会打印该管理域中活动 VLAN 的数量摘要。这会包括标准 VLAN 及扩展的 VLAN。

无论是否带参数，`show vlan` 命令在故障排除过程的以下方面，都属于最有用的命令：

- 找出那些配置在设备上的 VLAN
- 检查端口的成员身份


另一条有用的 VLAN 故障排除命令，便是 `show vtp counters`。这一命令会打印有关 VTP 数据包统计数据的信息。在某台配置为 VTP 服务器（默认）的交换机上，`show vtp counters` 命令的输出如下所示。


```console
Cat-3550-1#show vtp counters
VTP statistics:
Summary advertisements received     : 15
Subset advertisements received      : 10
Request advertisements received     : 2
Summary advertisements transmitted  : 19
Subset advertisements transmitted   : 12
Request advertisements transmitted  : 0
Number of config revision errors    : 0
Number of config digest errors      : 0
Number of V1 summary errors         : 0

VTP pruning statistics:

Trunk   Join Transmitted    Join Received   Summary advts received
                                            from non-pruning-
                                            capable device
-----   ----------------    --------------  -----------------------
Fa0/11                0                  1                        0
Fa0/12                0                  1                        0
```

`show vtp counters` 命令打印的输出前六行，提供了三种类型 VTP 数据包的统计信息：通告请求、摘要通告及子集通告。这些不同消息，将在接下来的小节中介绍。

所谓 VTP 通告请求，是对配置信息的请求。这些报文由 VTP 客户端发送到 VTP 服务器，请求他们可能缺少的一些 VLAN 及 VTP 信息。在交换机重置、VTP 域名更改，或交换机已收到某个带有高于其自己配置修订编号的 VTP 摘要通告数帧时，VTP 通告请求即会被发出。VTP 服务器应该只会显示接收计数器递增，而任何 VTP 客户端，均应只显示传输计数器递增。

默认情况下，VTP 摘要通告会由服务器每五分钟发出。这些类型的报文，用于通知某个邻接交换机当前的 VTP 域名、配置修订编号，与 VLAN 配置状态以及包括时间戳、MD5 哈希值即后续子集通告数量等其他 VTP 信息。当这些计数器在服务器上递增时，那么域中就有不止一台交换机充当或被配置为服务器。

在某项 VLAN 配置改变时，比如某个 VLAN 被添加、暂停、更改、删除，或其他特定于 VLAN 参数（如 VLAN MTU）等已改变时，VTP 的子集通告便会由 VTP 服务器发出。在 VTP 摘要通告之后，一个或多个子集通告将被发送。子集通告会包含一个 VLAN 信息列表。当有数个 VLAN 时，那么为了通告全部这些 VLAN，就可能需要一个以上的子集通告。

`Number of config revision errors` 字段显示了由于交换机接收到带有同一配置修订编号，但 MD5 哈希值不同的数据包，而其无法接受的通告数量。这种情况常见于在对同一域中的两个或多个服务器交换机作出了一些变更，而某台中间交换机在同一时刻接收到这些通告时。这一概念在下图 13.3 中得以演示，该图演示了一个基本的交换网络。


![配置修订号错误的排错](../images/1503.png)

**图 13.3** -- **配置版本编号错误的故障排除**

图 13.3 演示了个包含冗余及负载分担的基本网络。应假设 `Sw1` 和 `Sw2` 被配置为了服务器，而 `Sw3` 被配置为客户端。`Sw1` 是 `VLAN 10` 及 `VLAN 30` 的根桥，而 `Sw2` 是 `VLAN 20` 和 `VLAN 40` 的根桥。假设一项同时变更在 `Sw1` 和 `Sw2` 上实施，即将 `VLAN 50` 添加到 `Sw1`，将 `VLAN 60` 添加到 `Sw2`。那么这两台交换机在这种对数据库的变更后，均会发出一条通告。

这项变更会被传播到整个域，覆写接收到该信息的其他交换机的先前数据库。假设 `Sw5` 于同一时刻，从两个邻居处接收到同一信息，并且两条通告包含着同一配置修订编号。在此类情形下，该交换机就将无法接受任一通告，因为他们有着同一配置修订编号，但 MD5 哈希值却不同。

当这种情况出现时，交换机便会递增 `Number of config revision errors counter` 字段，且不会更新其数据库。这种情况会导致一或多个 VLAN 内连通性的丢失，因为 VLAN 信息未在该交换机上更新。要解决这个问题并确保交换机上的本地数据库得以更新，就要在服务器交换机之一上，配置一个空壳 VLAN，这样做会导致另一次配置修订编号递增的更新。这将覆写所有交换机的本地数据库，当然也允许 `Sw5` 更新其数据库。请记住，这种情况并不常见；但这是可能的，因此才有了这个计数器。


只要交换机收到一条，带有与该交换机计算得到 MD5 哈希值不同的通告，那么 `Number of config digest errors counter` 就会递增。这是不同 VTP 口令配置在这些交换机上的结果。咱们可使用 `show vtp password` 命令，检查所配置的 VTP 口令是否正确。同样重要的是要记住，这些口令可能相同，但硬件或软件问题或 bug，可能会导致 VTP 数据包的数据损坏，而造成这些错误。


最后，`VTP pruning statistics` 这个字段，只有在该 VTP 域的修剪被启用时，才会包含非零的值。修剪会于服务器上启用，同时这一配置会传播到整个 VTP 域。当 VTP 域的修剪已被启用时，服务器将收到自客户端的连接。


> **译注**：
>
> - [VTP pruning, InformIT](../pdfs/VTP-Pruning_InformIT.pdf)
>
>
> ![VTP Join报文及 VTP 修剪](../images/03fig15.gif)
>
> *VTP 的 `Join` 报文与 VTP 修剪*



> *知识点*：
>
> - RSPAN VLANs
>
> - Private VLAN, PVLAN
>
> - the VLAN MTU
>
> - the management domain
>
> - information on VTP packet statistics
>
> - three types of VTP packets: advertisement requests, summary advertisements, and subset advertisements
>
> - a VTP advertisement request
>
> - a VTP summary advertisement frame with a higher configuration revision number than its own
>
> - the received counters
>
> - the transmitted counters
>
> - an adjacent switch
>
> - the time stamp
>
> - the MD5 hash
>
> - the number of subset advertisements to follow
>
> - a subset advertisement
>
> - an intermediate switch
>
> - a basic network that incorporates redundancy and load sharing
>
> - a simultaneous change
>
> - a dummy VLAN
>
> - data corruption of VTP packets
>
> - servers will receive joins from clients when pruning has been enabled fro the VTP domain

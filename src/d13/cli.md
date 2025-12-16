# 使用 CLI 排除链路问题

Cisco IOS Catalyst 交换机上的数条命令行接口 (CLI) 命令，可被用于排除一层故障。一些常用命令包括 `show interfaces`、`show controllers` 及 `show interface [name] counters errors` 等。除了了解这些命令外，咱们还需要能够准确解释这些命令所提供的输出或信息。

`show interfaces` 命令是一项提供了大量信息的强大故障排除工具，这些信息包括以下内容：

- 某个交换端口的管理状态；
- 端口的运行状态；
- 介质类型（对于特定交换机与端口）；
- 端口的输入与输出数据包；
- 端口缓冲区故障及端口报错；
- 端口的输入及输出报错；
- 端口的输入和输出队列丢弃。


某个 `GigabitEthernet` 交换机端口的 `show interfaces` 命令输出，如下所示。

```console
Catalyst-3750-1#show interfaces GigabitEthernet3/0/1
GigabitEthernet0/1 is up, line protocol is down (notconnect)
Hardware is GigabitEthernet, address is 000f.2303.2db1 (bia 000f.2303.2db1)
MTU 1500 bytes, BW 10000 Kbit, DLY 1000 usec,
    reliability 255/255, txload 1/255, rxload 1/255
Encapsulation ARPA, Loopback not set
Keepalive not set
Auto-duplex, Auto-speed, link type is auto, media type is unknown
input flow-control is off, output flow-control is desired
ARP type: ARPA, ARP Timeout 04:00:00
Last input never, output never, output hang never
Last clearing of “show interface” counters never
Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
Queueing strategy: fifo
Output queue: 0/40 (size/max)
5 minute input rate 0 bits/sec, 0 packets/sec
5 minute output rate 0 bits/sec, 0 packets/sec
    0 packets input, 0 bytes, 0 no buffer
    Received 0 broadcasts (0 multicasts)
    0 runts, 0 giants, 0 throttles
    0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
    0 watchdog, 0 multicast, 0 pause input
    0 input packets with dribble condition detected
    0 packets output, 0 bytes, 0 underruns
    0 output errors, 0 collisions, 1 interface resets
    0 babbles, 0 late collision, 0 deferred
    0 lost carrier, 0 no carrier, 0 PAUSE output
    0 output buffer failures, 0 output buffers swapped out
```

如同由这条命令打印出的输出第一行所示，大多数 Cisco Catalyst 交换机端口默认都为 `notconnect` 状态。但是，当线缆从某个端口上移除，或未被正确连接时，该端口也会过渡到此状态。在连接的线缆是错误的，或电缆的另一端未连接到某个活动端口或设备（例如，连接到这个交换机端口的工作站关机了）时，这种状态也会被反映。

**注意**： 在排除 `GigabitEthernet` 端口故障时，这种端口状态也可能是两端之间使用的不正确千兆接口转换器 （GBIC）的结果。

由这条命令打印出的第一行输出中的第一部分（即 `[interface] is up`），指的是这个特定接口的物理层状态。该输出的第二部分（即 `line protocol is down`）表明这个接口的数据链路层状态。当这部分给出的是 `up` 时，则表示该接口可发送及接收保活数据包。要记住，在一些像是当这个端口是个 SPAN 目标端口（用于流量嗅探），或当这个本地端口连接到一台其端口已禁用下的 CatOS（旧版交换机操作系统）交换机时，这个交换机端口显示物理层 `up`，而数据链路层 `down` 是可行的。

上面输出中的输入队列字段，表示因超出最大队列大小而丢弃的数据帧具体数量。其中的刷新列，计算了 Catalyst 6000 系列交换机上的选择性丢弃数据包 (SPD) 数目。当 CPU 过载时，SPD 会丢弃一些低优先级的数据包，以便为那些高优先级数据包，节省一些处理能力。`show interfaces` 命令输出中的刷新计数器，会作为 SPD 的一部分而递增，该部分对路由器的 IP 进程队列，实现了一种实施选择性数据包丢弃策略。因此，其只适用于进程交换的流量。

上面输出中的总输出丢包数字段，表示因输出队列已满而丢弃的数据包数量。这通常会在来自多条入站高带宽链路（如一些 `GigabitEthernet` 链路）的流量，正被交换到单条出站低带宽链路（如某条 `FastEthernet` 链路）时看到。由于入站带宽和出站带宽之间速率的不匹配，接口被超出的流量压得喘不过气来，因此输出丢包数增量。

从 `show interfaces` 输出中，一些其他特定于接口的术语可被分析到，在一二层故障排除过程中，这些术语非常有用：

- **数据帧数量**：这个字段描述了接收到的那些有着不正确 CRC 错误及非整数八位组的数据包数量。这通常是由于异常以太网设备（硬件故障）的冲突结果；
- **CRC**：这个字段表示由发送设备生成的 CRC（循环冗余校验和），与接收设备处计算出的校验和不匹配。这通常表示 LAN 上的传输问题、冲突或系统传输着不良数据；
- **侏儒数据帧**：这个字段表示由于数据包小于最小数据包大小，而丢弃的数据包数量。在以太网网段上，小于 64 字节的数据包被视为侏儒数据帧；
- **巨人数据帧**：这个字段表示由于数据包大小大于最大值，而被丢弃的数据包数量。在以太网网段上，大于 1518 字节的数据包被视为巨人数据包；
- **晚发冲突**：晚冲突通常发生在以太网线过长，或网络中的中继器过多，或全双工/半双工不匹配时。冲突次数表示由于以太网冲突，而重传的报文数量。这通常是由局域网过度扩展造成。所谓晚冲突，被定义为在已传输的数据帧前 512 位（或第 64 个字节）后，发生的任何冲突；
- **输入错误**：这个字段提供了侏儒数据帧、巨人数据帧、CRC、超限及忽略的数据包等的总数；
- **输出错误**：这个字段提供了阻止数据报从该接口最终传出的全部错误总数。

除 `show interfaces` 命令外，`show interfaces [name] counters errors` 命令也可用于查看接口错误，而促进排除一层故障。由 `show interfaces [name] counters errors` 命令打印出的输出如下：



```console
Catalyst-3750-1#show interfaces GigabitEthernet3/0/1 counters errors
Port        Align-Err   FCS-Err   Xmit-Err    Rcv-Err UnderSize
Gi3/0/1         0         0          0          0         0
Port     Single-Col Multi-Col Late-Col Excess-Col Carri-Sen Runts
Gi3/0/1       0          0       0          0         0      0
Port        Giants
Gi3/0/1       0
```

以下小节介绍 `show interfaces [name] counters errors` 命令输出中所包含的一些错误字段，以及由这些字段下的非零值所表示的问题。

其中 `Align-Err` 这个字段反映了接收到不以偶数个八位组结尾，而有个不良 CRC 的数据帧数目。这些错误通常是双工不匹配，或物理故障，如布线、坏端口或化的网络接口控制器 (NIC) 等的结果。当网线首次连接到这个端口时，其中一些错误便会出现。此外，当有个集线器连接到该端口时，集线器上其他设备之间的冲突，也会导致这些错误。

`Fcs-Err` 这个字段反映了有着帧校验序列 (FCS) 错误，却没有组帧错误的一些大小有效的数据帧数量。这通常术语物理故障，比如布线、坏端口或坏 NIC 等。此外，该字段下的非零值，还可能表示双工不匹配。

`Xmit-Err` 这个字段中的非零值，是内部发送 (Tx) 缓冲区已满的表征。例如，这通常在多条入站高带宽链路（如一些 `GigabitEthernet` 链路）的流量，正被交换到单条出站低带宽链路（如某条 `FastEthernet` 链路）时会看到。

`Rev-Err` 这个字段表示全部接收到的错误总数。当该接口收到比如侏儒数据帧、巨人数据帧，或 FCS 等错误时，此计数器便会递增。

当交换机接收到长度小于 64 字节的数据帧时，`UndersSize` 字段会递增。这通常是由错误的发送设备造成。

各种 `collision` 字段，表示该接口上的冲突。对于半双工以太网，这很常见，而其在现代网络中几乎不存在了。但对于全双工链路，这些计数器就不应递增。当这些计数器下有非零值出现时，这通常表明某种双工不匹配故障。当某种双工不匹配检测到时，交换机会在控制台或日志中，打印出类似以下的消息：


```console
%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/1 (not full duplex), with R2 FastEthernet0/0 (full duplex)
```

正如有关生成树协议 (STP) 的小节中所述，当某个端口连接到另一交换机时，双工不匹配会导致交换网络中的 STP 环路。这些不匹配可以通过手动配置两个交换机端口的速率和双工解决。

每次某个以太网控制器打算在一条半双工连接上发送数据时，`Carri-Sen`（载波检测）计数器便会递增。控制器会检测线路，确保传输前线路不繁忙。这一字段下的非零值，表明该接口正以半双工模式运行。对于半双工，这属于正常现象。

由于双工不匹配，或因比如所连接设备上的坏线缆、坏端口或不良网卡等其他物理层问题，一些非零值同样也会在 `Runts` 字段下看到。所谓侏儒数据帧，是指接收到的带有不良 CRC，小于 IEEE 802.3 最小数据帧大小，对于以太网其为 64 字节，的一些数据帧。

最后，当接收到一些大小超过 IEEE 802.3 最大帧大小，对于非巨型以太网其为 1518 字节，且有着不良 FCS 的数据帧时，那么 `Giants` 计数器便会递增。对于连接到工作站的端口或接口，这一字段下的非零值，通常是由所连接设备上的不良 NIC 造成。但是，对于连接到另一交换机（比如通过中继链路）的端口或接口，当 802.1Q 的封装用到时，那么该字段将包含一个非零值。在 802.1Q 下，其中的打标签机制就意味着数据帧的修改，因为中继设备会插入一个 4 字节的标记，然后会重新计算 FCS。

将一个 4 字节的标签，插入某个已有着最大以太网大小的数据帧，就会创建出一个会被接收设备视为巨人数据帧的 1522 字节帧。因此，虽然交换机仍将处理此类数据帧，但这个计数器将递增，而包含一个非零值。要解决这一问题，802.3 委员会创建了一个名为 [802.3ac](https://en.wikipedia.org/wiki/IEEE_802.1Q) 的子组，将最大以太网大小扩展到 1522 字节；不过，在使用 802.1Q 的中继时，见到这一字段下的非零值并不少见。

`show controllers ethernet-controller <interface>` 命令，也可用于显示类似于 `show interfaces` 和 `show interfaces <name> counters errors` 命令打印信息的流量计数器与错误计数器信息。`show controllers ethernet-controller <interface>` 命令的输出如下所示。

```console
Catalyst-3750-1#show controllers ethernet-controller GigabitEthernet3/0/1
Transmit GigabitEthernet3/0/1   Receive
4069327795 Bytes                3301740741 Bytes
  559424024 Unicast frames        376047608 Unicast frames
   27784795 Multicast frames       1141946 Multicast frames
    7281524 Broadcast frames       1281591 Broadcast frames
          0 Too old frames       429934641 Unicast bytes
          0 Deferred frames      226764843 Multicast bytes
          0 MTU exceeded frames  137921433 Broadcast bytes
          0 1 collision frames           0 Alignment errors
          0 2 collision frames           0 FCS errors
          0 3 collision frames           0 Oversize frames
          0 4 collision frames           0 Undersize frames
          0 5 collision frames           0 Collision fragments
          0 6 collision frames
          0 7 collision frames     257477 Minimum size frames
          0 8 collision frames  259422986 65 to 127 byte frames
          0 9 collision frames   51377167 128 to 255 byte frames
          0 10 collision frames  41117556 256 to 511 byte frames
          0 11 collision frames   2342527 512 to 1023 byte frames
          0 12 collision frames   5843545 1024 to 1518 byte frames
          0 13 collision frames         0 Overrun frames
          0 14 collision frames         0 Pause frames
          0 15 collision frames
          0 Excessive collisions        0 Symbol error frames
          0 Late collisions             0 Invalid frames, too large
          0 VLAN discard frames  18109887 Valid frames, too large
          0 Excess defer frames         0 Invalid frames, too small
     264522 64 byte frames              0 Valid frames, too small
   99898057 127 byte frames
   76457337 255 byte frames             0 Too old frames
    4927192 511 byte frames             0 Valid oversize frames
   21176897 1023 byte frames            0 System FCS error frames
  127643707 1518 byte frames            0 RxPortFifoFull drop frames
  264122631 Too large frames
          0 Good (1 coll) frames
          0 Good (>1 coll) frames
```

**注意**： 上面的输出将根据于其上执行这条命令的交换机平台，而略微不同。例如，Catalyst 3550 系列交换机还包含一个显示因资源不足，而放弃传输尝试的数据帧总数的丢弃数据帧字段。这一字段中的大数目，通常表示某种网络拥塞问题。在上面的输出中，咱们要查看表示某个接口上，接收到的因入口队列已满，而被丢弃数据帧总数的  `RxPortFifoFull` 丢弃数据帧字段。

> *知识点*：
>
> - Command Line Interface, CLI
>
> - Layer 1 issues on Cisco IOS Catalyst switches
>
> - a plethora information
>
> - a GigabitEthernet switch port
>
> - the `notconnect` state
>
> - Gigabit Interface Converter, GBIC
>
> - the Physical Layer status of the particular interface
>
> - the Data Link Layer status of the interface
>
> - SPAN, Switched Port Analyser
>
> - a SPAN destination port, for sniffer traffice
>
> - the Input queue field
>
> - the maximum queue size
>
> - the flushes column
>
> - Selective Packet Discard(SPD) drops
>
> - low-priority packets
>
> - the flushes counter
>
> - a selective packe drop policy
>
> - the IP process queue of the router
>
> - process-switched traffic
>
> - the total output drops field
>
> - the output queue
>
> - multiple inbound high-bandwith links
>
> - a signle outbound lower-bandwith link
>
> - the speed mismatch between the inbound and outbound bandwiths
>
> - interface-specific terms
>
> - `Frame number`, this field describes the number of packets received incorrectly having a CRC error and a non-integer number of octets
>
> - a malfunctioning Ethernet device, hardware fault
>
> - cyclic redundancy checksum, CRC
>
> - the checksum calculated at the receiving device
>
> - `Runts`, this field indicates the number of packets that are discarded due to being smaller than the minimum packets size
>
> - `Giants`, this field indicates the number of packets that are discarded due to being larger than the maximum packet size
>
> - an Ethernet collision
>
> - `Input errros`, the total sum of runts, giants, CRC, overruns, and ignored packets
>
> - `Output errors`, the total sum of all errors that prevented the final transimission of datagrams out of the interface
>
> - non-zero values under these fields
>
> - a duplex mismatch
>
> - a physical problem
>
> - network interface controller, NIC
>
> - valid-sizeed frames with Frame Check Sequence(FCS) errors
>
> - framing errors
>
> - the `Xmit-Err` field
>
> - the internal send(Tx) buffer
>
> - the `Rcv-Err` field
>
> - the `UnderSize` field
>
> - a faulty sending device
>
> - the `Carri-Sen` (carrier sense) counter
>
> - the `Runts` field
>
> - the minimum IEEE 802.3 frame size, which is 64 bytes for Ethernet
>
> - the `Giants` counter
>
> - the IEEE 802.3 maximum frame size, which is 1518 bytes for non-jumbo Ethernet
>
> - a bady giant frame
>
> - the 802.3 committee
>
> - a subgroup called 802.3ac
>
> - a Discarded frames field
>
> - a network congestion issue
>
> - the `RxPortFifoFull` drop frame field
>
> - the ingress queue

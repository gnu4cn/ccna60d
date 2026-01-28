# 基本的交换故障排除


从理论上讲，一旦设备被配置并正常运行，那么他就应保持这种状态，但是，咱们将经常会在某个不是咱们配置的网络上工作，或者咱们将在某种支持许多陌生网络的轮班模式下工作，而这些网络上的更改，会导致公司一个或多个问题。我（作者）建议咱们，在完成本指南中的几个实验后，随时间推移再重温这一小节。

## 常见交换机问题

### 无法远程登录交换机

第一个问题是：Telnet 曾经有效吗？若 Telnet 以前可以，而现在却不行了，那么可能是有人对交换机进行了更改，重新加载后丢失了配置，或者是网络上的某个地方的一台设备阻止了 Telnet 流量。


```console
Switch#telnet 192.168.1.1
Trying 192.168.1.1 ...Open

[Connection to 192.168.1.1 closed by foreign host]
```

首先要检查的是交换机上是否真的启用了 Telnet（见下面的输出）。网络上大约 80% 的错误，都是由于愚蠢的错误或疏忽造成的，因此千万不要妄下定论，要亲自检查一切，而不要依赖他人的意见。

一条简单的 `show run` 命令，便将揭示出交换机配置。在 `vty` 线路下，咱们将看到 Telnet 是否已被启用。请注意，咱们将需要 `vty` 线路下的 `login` 或 `login local`（或配置的 AAA）命令，以及 `password` 命令，如下所示。


```console
line vty 0 4
password cisco
login

line vty 5 15
password cisco
login
```

如下面的输出所示，`login local` 命令告诉交换机或路由器，查找其上配置的用户名和口令：

```console
Switch1#sh run
Building configuration...
Current configuration : 1091 bytes!
version 12.1
hostname Switch1
username david privilege 1 password 0 football

line vty 0 4
password cisco
login local

line vty 5 15
password cisco
login local

...
[Truncated Output]
```

### 无法 `ping` 交换机

首先要找出对方想要 `ping` 交换机的原因。当咱们确实想要 `ping` 某台交换机时，那么就需要交换机上配置有 IP 地址；此外，交换机还需要知道如何将流量传回（默认网关）。

### 无法通过交换机 `ping`


当通过交换机的某次 `ping` 不成功时，那么就要检查确保终端设备是在同一 VLAN 中。每个 VLAN 都被视为一个网络，而出于这一原因，因此其就必须有着与其他任何 VLAN 不同的地址范围。为了让一个 VLAN 到达另一 VLAN，那么就必须要有一台路由器路由流量。

### 接口问题

默认情况下，所有路由器接口都是对流量关闭的，而交换机接口都是开放的。当咱们发现咱们的交换机已将其接口管理性关闭时，那么就要打开他，该接口必须以 `no shut` 这条接口级命令加以设置。


```console
Switch1(config)#int FastEthernet0/3
Switch1(config-if)#no shut
```

二层接口可被设置为三种模式：中继、接入或动态。中继模式允许交换机连接到另一交换机或服务器；接入模式则针对终端设备，比如 PC 或笔记本电脑；动态模式会让交换机检测要选取的设置。

在诸如 3550 型号交换机等平台上，默认模式通常是动态的 `desirable`，但请在 Cisco.com 上查看咱们型号的设置与发布说明。对于 CCNA 考试，咱们将被要求配置 2960 型交换机。他将动态地选择模式，除非咱们将其硬性设置为中继或接入模式。


```console
Switch1#show interfaces switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: dynamic auto
```

这个默认模式很容易更改，如下面的输出中所示：


```console
Switch1#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch1(config)#int FastEthernet0/1
Switch1(config-if)#switchport mode ?

  access      Set trunking mode to ACCESS unconditionally
  dynamic     Set trunking mode to dynamically negotiate access or trunk mode
  trunk       Set trunking mode to TRUNK unconditionally


Switch1(config-if)#switchport mode trunk
%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to down


Switch1(config-if)#^Z
Switch1#
%SYS-5-CONFIG_I: Configured from console by console
Switch1#show interfaces switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
```

### 更多接口故障

交换机端口的默认设置，为自动检测的双工及自动检测的速率。当咱们将某一 10Mbps 设备，插入某个运行于半双工的交换机（若咱们还能找到这样的设备）时，那么该端口应检测到这一并正常工作。但情况并非总是如此，因此一般建议是要硬性设置交换机端口的速率和双工，如下输出中所示。


```console
Switch1#show interfaces switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: dynamic auto

Switch1#show interface FastEthernet0/2
FastEthernet0/2 is up, line protocol is up (connected)
  Hardware is Lance, address is 0030.f252.3402 (bia 0030.f252.3402)
BW 100000 Kbit, DLY 1000 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Full-duplex, 100Mb/s

Switch1(config)#int fast 0/2
Switch1(config-if)#duplex ?
    auto    Enable AUTO duplex configuration
    full    Force full-duplex operation
    half    Force half-duplex operation

Switch1(config-if)#speed ?
  10      Force 10Mbps operation
  100     Force 100Mbps operation
  auto    Enable AUTO speed configuration
```

双工不匹配的一些迹象（除错误消息外），包括接口上的输入与 CRC 报错，如下输出中所示。另请参阅 [一层和二层故障排除部分](../d13_troubleshooting_layer_1_and_2.md)。

```console
Switch#show interface f0/1
FastEthernet0/1 is down, line protocol is down (disabled)
  Hardware is Lance, address is 0030.a388.8401 (bia 0030.a388.8401)
BW 100000 Kbit, DLY 1000 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Half-duplex, 100Mb/s
  input flow-control is off, output flow-control is off
  ARP type: ARPA, ARP Timeout 04:00:00
  Last input 00:00:08, output 00:00:05, output hang never
  Last clearing of “show interface” counters never
  Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
  Queueing strategy: fifo
  Output queue :0/40 (size/max)
  5 minute input rate 0 bits/sec, 0 packets/sec
  5 minute output rate 0 bits/sec, 0 packets/sec
      956 packets input, 193351 bytes, 0 no buffer
      Received 956 broadcasts, 0 runts, 0 giants, 0 throttles
      755 input errors, 739 CRC, 0 frame, 0 overrun, 0 ignored, 0 abort
      0 watchdog, 0 multicast, 0 pause input
      0 input packets with dribble condition detected
      2357 packets output, 263570 bytes, 0 underruns
      0 output errors, 0 collisions, 10 interface resets
      0 babbles, 0 late collision, 0 deferred
      0 lost carrier, 0 no carrier
      0 output buffer failures, 0 output buffers swapped out
```

### 硬件问题

与任何电气设备一样，交换机上的端口也会失效，或仅在部分时间内工作，这就会更难故障排除。工程师经常会通过将某一已知工作设备，插入交换机上的另一端口来测试该接口。咱们也可重启端口，即先应用 `shut` 命令，然后再应用 `no shut` 命令。更换网线也是一种常见的故障排除步骤。其他常见的交换机故障与解决方案，如下图 6.20 中所示。

请查看咱们交换机的文档，因为除系统与端口的 LED 指示灯外，每个端口还会显示闪烁或常亮的红色、琥珀色及绿色，分别表示功能正常或端口/系统问题。

!["常见交换机故障及解决方法"](../images/0220.png)

**图 6.20** -- **常见的交换机故障与解决方案**




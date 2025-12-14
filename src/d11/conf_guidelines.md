# 以太通道配置指南

下一节列出并描述了配置第 2 层 PAgP 以太通道所需的步骤。不过，在深入了解这些配置步骤之前，请务必熟悉配置第 2 层 EtherChannels 时的以下注意事项：每个 EtherChannel 最多可以有八个兼容配置的以太网接口。LACP 允许您在一个 EtherChannel 组中拥有八个以上的端口。这些额外的端口是热备端口。EtherChannel 中的所有接口必须以相同的速度和双工模式运行。但请记住，与 PAgP 不同，LACP 不支持半双工端口。确保启用了 EtherChannel 中的所有接口。在某些情况下，如果接口未启用，逻辑端口通道接口将不会自动创建。首次配置 EtherChannel 组时，请务必记住端口要遵循为第一个添加的组端口设置的参数。如果为 EtherChannel 中的成员端口配置了交换机端口分析器 (SPAN)，则该端口将从 EtherChannel 组中移除。



- 将以太网通道中的所有端口都指派到同一个 VLAN ，或将它们配置成中继端口，是必要的。而如果这些参数不同，该通道就不会形成。
- 记住有着不同 STP 路径开销（由某位管理员所修改的）的那些类似接口，仍可用于组成一个以太网通道。
- 在开始通道配置之前，建议首先关闭所有成员接口（it is recommended to shut down all member interfaces prior to beginning channelling configuration）。

### 配置并验证二层以太网通道

**Configuring and Verifying Layer 2 EtherChannels**

该部分内容通过无条件地强制所选接口建立一个以太网通道，对二层以太网通道的配置进行了说明（this section describes the configuration of Layer 2 EtherChannels by unconditionally forcing the selected interfaces to establish an EtherChannel）。

1. 第一个配置步骤是通过全局配置命令`interface [name]`或`interface range [range]`，进入那些所需要的以太网通道接口的接口配置模式；
2. 配置的第二步是通过接口配置命令`switchport`，将这些接口配置为二层交换机接口；
3. 第三个配置步骤是通过接口配置命令`switchport mode [access|trunk]`，将这些交换机端口配置为中继或接入链路；
4. 作为可选步骤，如该接口或这些接口已被配置为接入端口，就要使用命令`switchport access vlan [number]`，将其指派到同样的 VLAN 中。而如该接口或这些接口已被配置为中继端口，就要通过执行接口配置命令`switchport trunk allowed vlan [range]`，选择允许通过该中继的那些 VLANs ；而如VLAN 1将不作为原生 VLAN （802.1Q的），就要通过执行接口配置命令`switchport trunk native vlan [number]`, 输入原生 VLAN 。此项配置在所有端口通道成员接口上必须一致。
5. 下一配置步骤就是通过接口配置命令`channel-group [number] mode on`, 将这些接口配置为无条件中继(the next configuration step is to configure the interfaces to unconditionally trunk via the `channel-group [number] mode on` interface configration command)。

用到上述步骤的无条件以太网通道配置，将基于下图33.5中所演示的网络拓扑。

![以太网通道配置输出示例的网络拓扑](../images/3305.png)

*图 33.5 -- 以太网通道配置输出示例的网络拓扑*

下面的输出演示了如何在Switch 1及Switch 2上，基于图33.5中所描述的网络拓扑，配置无条件通道操作。该以太网通道将配置成一个使用默认参数的二层802.1Q中继。

```console
Switch-1#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-1(config)#interface range fa0/1 – 3
Switch-1(config-if-range)#no shutdown
Switch-1(config-if-range)#switchport
Switch-1(config-if-range)#switchport trunk encapsulation dot1q
Switch-1(config-if-range)#switchport mode trunk
Switch-1(config-if-range)#channel-group 1 mode on
Creating a port-channel interface Port-channel 1
Switch-1(config-if-range)#exit
Switch-1(config)#exit
```

> **注意：** 注意到该交换机自动默认创建出`interface port-channel 1`（根据下面的输出）。**没有要配置该接口的显式用户配置**（notice that the switch automatically creates `interface port-channel 1` by default(refer to the output below). No explicit user configurtion is required to configure this interface）。

```console
Switch-2#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-2(config)#interface range fa0/1 - 3
Switch-2(config-if-range)#switchport
Switch-2(config-if-range)#switchport trunk encapsulation dot1q
Switch-2(config-if-range)#switchport mode trunk
Switch-2(config-if-range)#channel-group 1 mode on
Creating a port-channel interface Port-channel 1
Switch-2(config-if-range)#exit
Switch-2(config)#exit
```

命令`show EtherChannel [options]`此时即可用于验证该以太网通道的配置。下面的输出中打印了可用选项（依据不同平台会有不同）。

```console
Switch-2#show EtherChannel ?
    <1-6>           Channel group number
    detail          Detail information
    load-balance    Load-balance/frame-distribution scheme among ports in port-channel
    port            Port information
    port-channel    Port-channel information
    protocol        protocol enabled
    summary         One-line summary per channel-group
    |               Output modifiers
    <cr>
```

下面的输出对命令`show EtherChannel summary`进行了演示。

```console
Switch-2#show EtherChannel summary
Flags:  D - down
        I - stand-alone
        H - Hot-standby (LACP only)
        R - Layer3
        u - unsuitable for bundling
        U - in use
        d - default port
        P - in port-channel
        s - suspended
        S - Layer2
        f - failed to allocate aggregator
Number of channel-groups in use: 1
Number of aggregators: 1
Group  Port-channel  Protocol    Ports
------+-------------+-----------+--------------------------------
1      Po1(SU)          -        Fa0/1(Pd)  Fa0/2(P)    Fa0/3(P)
```

在上面的输出中，可以看到在通道组 1 （Channel Group 1）中有三条链路。接口FastEthernet0/1是默认端口；**该端口将用于发送比如的 STP 数据包**。如果该端口失效，FastEthernet0/2就将被指定为默认端口，如此延续（this port will be used to send STP pakcets, for example. If this port fails, FastEthernet0/2 will be designated as the default port, and so forth）。同时通过看看`Po1`后面的`SU`标志，还可以看到该端口组是一个活动的二层以太网通道。下面的输出现实了由`show EtherChannel detail`命令所打印出的信息。

```console
Switch-2#show EtherChannel detail
                Channel-group listing:
                ----------------------
Group: 1
----------
Group state = L2
Ports: 3    Maxports = 8
Port-channels: 1 Max Port-channels = 1
Protocol:    -
                Ports in the group:
                -------------------
Port: Fa0/1
------------
Port state      = Up Mstr In-Bndl
Channel group   = 1           Mode  = On/FEC           Gcchange = -
Port-channel    = Po1         GC    = -     Pseudo port-channel = Pol
Port index      = 0           Load  = 0x00             Protocol = -
Age of the port in the current state: 0d:00h:20m:20s
Port: Fa0/2
------------
Port state      = Up Mstr In-Bndl
Channel group   = 1           Mode  = On/FEC           Gcchange = -
Port-channel    = Po1         GC    = -     Pseudo port-channel = Pol
Port index      = 0           Load  = 0x00             Protocol = -
Age of the port in the current state: 0d:00h:21m:20s
Port: Fa0/3
------------
Port state      = Up Mstr In-Bndl
Channel group   = 1           Mode  = On/FEC           Gcchange = -
Port-channel    = Po1         GC    = -     Pseudo port-channel = Pol
Port index      = 0           Load  = 0x00             Protocol = -
Age of the port in the current state: 0d:00h:21m:20s
                Port-channels in the group:
                ---------------------------
Port-channel: Po1
------------
Age of the Port-channel     = 0d:00h:26m:23s
Logical slot/port   = 1/0               Number of ports = 3
GC                  = 0x00000000        HotStandBy port = null
Port state          = Port-channel Ag-Inuse
Protocol            = -
Ports in the Port-channel:
Index   Load   Port     EC state        No of bits
------+------+------+------------------+-----------
0       00     Fa0/1    On/FEC          0
0       00     Fa0/2    On/FEC          0
0       00     Fa0/3    On/FEC          0
Time since last port bundled:   0d:00h:21m:20s     Fa0/3
```

在上面的输出中，可以看出这是一个带有通道组中最多 8 个可能端口中的三个的二层以太网通道。还可以看出，以太网通道模式是`on`, 这是基于由一条短横线所表示的协议字段看出的。此外，同样可以看出这是一个FastEtherChannel(FEC)（in the output above, you can see that this is a Layer 2 EtherChannel with three out of a maximum of eight possible ports in the channel group. You can also see that the EtherChannel mode is on, based on the protocol being denoted by a hash(-). In addition, you can also see that this is a FastEtherChannel(FEC)）。

最后，还可以通过执行命令`show interface port-channel [number] switchport`，对该逻辑的port-channel接口的二层运行状态进行检查。这在下面的输出中进行了演示。
在上面的输出中，可以看到这是一个带有通道组中最多 8 个中的 3 个端口的二层以太网通道。还可以从由短横所表示的协议，看出以太网通道模式是`on`。此外，还可以看到这是一个FastEtherChannel(FEC)。

最后，还可通过执行命令`show interfaces port-channel [number] switchport`, 对该逻辑的端口通道接口（the logical port-channel interface）的二层运作状态进行查看。这在下面的输出中有所演示。

```console
Switch-2#show interfaces port-channel 1 switchport
Name: Po1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
Administrative private-vlan host-association: none
Administrative private-vlan mapping: none
Administrative private-vlan trunk native VLAN: none
Administrative private-vlan trunk encapsulation: dot1q
Administrative private-vlan trunk normal VLANs: none
Administrative private-vlan trunk private VLANs: none
Operational private-vlan: none
Trunking VLANs Enabled: ALL
Pruning VLANs Enabled: 2-1001
Protected: false
Appliance trust: none
```

### 配置并验证 PAgP 以太网通道

**Configuring and Verifying PAgP EtherChannels**

此部分对 PAgP 二层以太网通道的配置进行了说明。为配置并建立一个 PAgP 以太网通道，需要执行以下步骤。

1. 第一个配置步骤是通过全局配置命令`interface [name]`或`interface range [range]`，进入到所需的这些以太网接口的接口配置模式；
2. 配置的第二步，是通过接口配置命令`switchport`, 将这些接口配置为二层交换端口；
3. 第三个配置步骤，是通过接口配置命令`switchport mode [access|trunk]`，将这些交换端口，配置为中继或接入链路；
4. 作为可选步骤，如果已将这些端口配置为接入端口，那么就要使用命令`switchport access vlan [number]`, 将其指派到同一个 VLAN 中；而如果这些接口已被配置为中继端口，那么就要通过执行接口配置命令`switchport trunk allowed vlan [range]`，来选择所允许通过该中继的那些 VLANs ；如未打算将VLAN 1用作原生 VLAN （对于802.1Q），就要通过执行接口配置命令`switchport trunk native vlan [number]`，输入原生 VLAN 。此项配置在所有端口通道的成员接口上一致。
5. 作为可选项，通过执行接口配置命令`channel-protocol pagp`，将 PAgP 配置作为以太网通道协议（the EtherChannel protocol）。因为以太网通道默认是 PAgP 的，所以此命令被认为是可选的而无需输入。但执行该命令被看作是良好实践，因为可以令到配置绝对确定（it is considered good practice to issue this command just to be absolutely sure of your configuration）。
6. 下一步就是通过接口配置命令`channel-group [number] mode`，将这些接口配置为无条件中继。

下面的输出演示了如何在基于上面的图33.5中所给出的网络拓扑的Switch 1和Switch 2上，配置 PAgP 的通道（PAgP channelling）。该以太网通道将被配置为使用默认参数的二层802.1Q中继。

```console
Switch-1#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-1(config)#interface range fa0/1 - 3
Switch-1(config-if-range)#switchport
Switch-1(config-if-range)#switchport trunk encap dot1q
Switch-1(config-if-range)#switchport mode trunk
Switch-1(config-if-range)#channel-group 1 mode desirable
Creating a port-channel interface Port-channel 1
Switch-1(config-if-range)#exit
```

> **注意：** 在上面的输出中，选择了端口通道的`desirable`模式。可以在此命令（`channel-group 1 mode desirable`）之后加上一个额外关键字`[non-silent]`。这是因为，默认情况下， PAgP 的`auto`模式默认是安静模式。当交换机被连接到一台不兼容 PAgP 的设备时，就用到安静模式，且绝不会传送数据包(an additional keyword, `[non-silent]`, may also be appended to the end of this command. This is because, by default, PAgP auto and desirable modes default to a silent mode. The silent mode is used when the switch is connected to a device that is not PAgP-capable and that seldom, if ever transmits packets)。一台安静相邻设备的例子（an example of a silent partner），就是一台文件服务器或未有生成流量的数据包分析器。而如果一台设备不会发出 PAgP 数据包（比如处于`auto`模式），也用到安静模式。

在此示例中，在一个连接到一台安静相邻设备的物理端口上运行 PAgP 阻止了那个交换机端口成为运作端口；但是，该安静设置允许 PAgP 运行，从而将该接口加入到一个通道组，同时利用该接口进行传输。在本例中，因为Switch 2将被配置为`auto`模式（被动模式）, 该端口采用默认的安静模式运作，就是首先的了（In this case, running PAgP on a physical port connected to a silent partner prevents that switch port from ever becoming operational; however, the silent setting allows PAgP to operate, to attatch the interface to a channel group, and to use the interface for transmission. In this example, because Switch 2 will be configured for auto mode(passive mode), it is preferred that the port uses the default silent mode operation）。这在下面的 PAgP 以太网通道配置中进行了演示。

```console
Switch-1#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-1(config)#interface range fa0/1 - 3
Switch-1(config-if-range)#switchport
Switch-1(config-if-range)#switchport trunk encap dot1q
Switch-1(config-if-range)#switchport mode trunk
Switch-1(config-if-range)#channel-group 1 mode desirable ?
    non-silent  Start negotiation only after data packets received
    <cr>
Switch-1(config-if-range)#channel-group 1 mode desirable non-silent
Creating a port-channel interface Port-channel 1
Switch-1(config-if-range)#exit
```

继续进行 PAgP 以太网通道的配置，则Switch 2被配置为以下这样。

```console
Switch-2#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-2(config)#int range fa0/1 - 3
Switch-2(config-if-range)#switchport
Switch-2(config-if-range)#switchport trunk encapsulation dot1q
Switch-2(config-if-range)#switchport mode trunk
Switch-2(config-if-range)#channel-group 1 mode auto
Creating a port-channel interface Port-channel 1
Switch-2(config-if-range)#exit
```

以下输出演示了怎样通过在Switch 1及Switch 2上使用命令`show EtherChannel summary`，验证该 PAgP 以太网通道的配置。

```console
Switch-1#show EtherChannel summary
Flags:  D - down
        I - stand-alone
        H - Hot-standby (LACP only)
        R - Layer3
        u - unsuitable for bundling
        U - in use
        d - default port
        P - in port-channel
        s - suspended
        S - Layer2f - failed to allocate aggregator
Number of channel-groups in use:    1
Number of aggregators:              1
Group  Port-channel  Protocol    Ports
------+-------------+-----------+--------------------------------
1      Po1(SU)         PAgP      Fa0/1(Pd)  Fa0/2(P)    Fa0/3(P)
```

还可以通过执行命令`show pagp [options]`, 查看到 PAgP 以太网通道的配置及统计数据。下面的输出，演示了此命令下可用的选项。

```console
Switch-1#show pagp ?
  <1-6>     Channel group number
  counters  Traffic information
  internal  Internal information
  neighbor  Neighbor information
```

> **注意：** 对需要的端口通道编号的进入，提供上面所打印出的后三个选项。这在下面的输出中进行了演示。

```console
Switch-1#show pagp 1 ?
  counters  Traffic information
  internal  Internal information
  neighbor  Neighbor information
```

关键字`[counters]`提供了有关 PAgP 发出及接收到的数据包的信息。关键字`[internal]`提供了诸如端口状态、 Hello 间隔时间、 PAgP 端口优先级以及端口学习方式等的信息。下面的输出对命令`show pagp internal`的使用进行了演示。

```console
Switch-1#show pagp 1 internal
Flags:  S - Device is sending Slow hello.   C - Device is in Consistent state.
        A - Device is in Auto mode.         d - PAgP is down.
Timers: H - Hello timer is running.         Q - Quit timer is running.
        S - Switching timer is running.     I - Interface timer is running.
Channel group 1
                                Hello       Partner PAgP     Learning   Group
Port    Flags   State   Timers  Interval    Count   Priority Method     Ifindex
Fa0/1   SC      U6/S7   H       30s         1       128      Any        29
Fa0/2   SC      U6/S7   H       30s         1       128      Any        29
Fa0/3   SC      U6/S7   H       30s         1       128      Any        29
```

关键字`[neighbor]`打印出邻居名称、 PAgP 邻居的 ID 、邻居设备 ID （ MAC ）以及邻居端口。同时在比如邻居是一台物理学习设备时（a physical learner）,这些标志同样表明了邻居运行的模式。下面的输出对命令`show pagp neighbor`的使用，进行了演示。

```console
Switch-1#show pagp 1 neighbor
Flags:  S - Device is sending Slow hello.   C - Device is in Consistent state.
        A - Device is in Auto mode.         P - Device learns on physical port.
Channel group 1 neighbors
        Partner     Partner         Partner     Partner Group
Port    Name        Device ID       Port    Age Flags   Cap.
Fa0/1   Switch-2    0014.a9e5.d640  Fa0/1   19s SAC     10001
Fa0/2   Switch-2    0014.a9e5.d640  Fa0/2   24s SAC     10001
Fa0/3   Switch-2    0014.a9e5.d640  Fa0/3   18s SAC     10001
```

### 配置并验证 LACP 以太网通道

**Configuring and Verifying LACP EtherChannels**

此部分对 LACP 的二层以太网通道的配置进行了讲述。为配置并建立一个 LACP 以太网通道，需要执行下面这些步骤。

1. 第一个配置步骤是通过全局配置命令`interface [name]`或`interface range [range]`, 进入到所需要的以太网通道接口的接口配置模式；
2. 第二个配置步骤时通过接口配置命令`switchport`，将这些接口配置为二层交换端口；
3. 第三个配置步骤，时通过接口配置命令`switchport mode [access|trunk]`，将这些交换端口配置为中继或接入链路；
4. 作为可选步骤，如该接口或这些接口已被配置为接入端口，就要使用命令`switchport access vlan [number]`将其指派到同样的 VLAN 中。而如该接口或这些接口已被配置为中继端口，就要通过执行接口配置命令`switchport trunk allowed vlan [range]`, 选择允许通过该中继的VLANs; 而如将不使用VLAN 1作为原生 VLAN （802.1Q的），就要通过执行接口配置命令`switchport trunk native vlan [number]`，输入该原生 VLAN 。此项配置在所有的端口通道成员接口上一致；
5. 通过执行接口配置命令`channel-protocol lacp`, 将 LACP 配置作为以太网通道协议。因为以太网通道协议默认时 PAgP ，该命令被认为时 LACP 所强制的，同时也是所要求输入的（because EtherChannels default to PAgP, this command is considered mandatory for LACP and is required）；
6. 下一配置步骤时通过接口配置命令`channel-group [number] mode`，将这些接口配置为无条件中继（the next configuration step is to configure the interfaces to unconditionally trunk via the `channel-group [number] mode` interface configuration command）。

下面的输出对在Switch 1和Switch 2上如何配置基于图33.5中所给出的网络拓扑的 LACP 通道，进行了演示，该以太网通道将被配置为一个使用默认参数的二层802.1Q中继，如下面的输出所示。

```console
Switch-1#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-1(config)#int range FastEthernet0/1 - 3
Switch-1(config-if-range)#switchport
Switch-1(config-if-range)#switchport trunk encapsulation dot1q
Switch-1(config-if-range)#switchport mode trunk
Switch-1(config-if-range)#channel-protocol lacp
Switch-1(config-if-range)#channel-group 1 mode active
Creating a port-channel interface Port-channel 1
Switch-1(config-if-range)#exit
Switch-2#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch-2(config)#interface range FastEthernet0/1 - 3
Switch-2(config-if-range)#switchport
Switch-2(config-if-range)#switchport trunk encapsulation dot1q
Switch-2(config-if-range)#switchport mode trunk
Switch-2(config-if-range)#channel-protocol lacp
Switch-2(config-if-range)#channel-group 1 mode passive
Creating a port-channel interface Port-channel 1
Switch-2(config-if-range)#exit
```

下面的输出演示了如何通过在Switch 1及Switch 2上执行`show EtherChannel summary`命令，来对该 LACP 以太网通道配置进行验证。

```console
Switch-1#show EtherChannel summary
Flags:  D - down
        I - stand-alone
        H - Hot-standby (LACP only)
        R - Layer3
        u - unsuitable for bundling
        U - in use
        d - default port
        P - in port-channel
        s - suspended
        S - Layer2
        f - failed to allocate aggregator
Number of channel-groups in use: 1
Number of aggregators: 1
Group  Port-channel  Protocol    Ports
------+-------------+-----------+--------------------------------
1      Po1(SU)       LACP        Fa0/1(Pd)  Fa0/2(P)    Fa0/3(P)
```

默认 LACP 允许最多 16 个端口进入到一个端口通道组中（by default, LACP allows up to 16 ports to be entered into a port channel group）。前 8 个运作接口将为 LACP 所使用，而剩下的 8 个接口将被置为热备份状态。命令`show EtherChannel detail`显示出一个 LACP 以太网通道中所支持的链路最大数量，如下面的输出所示。

```console
Switch-1#show EtherChannel 1 detail
Group state = L2
Ports: 3   Maxports = 16
Port-channels: 1 Max Port-channels = 16
Protocol:   LACP
                Ports in the group:
                -------------------
Port: Fa0/1
------------
Port state    = Up Mstr In-Bndl
Channel group = 1           Mode = Active       Gcchange = -
Port-channel  = Po1         GC   = -        Pseudo port-channel = Po1
Port index    = 0           Load = 0x00         Protocol = LACP
Flags:  S - Device is sending Slow LACPDUs.   F - Device is sending fast
                                                  LACPDUs.
        A - Device is in active mode.         P - Device is in passive mode.
Local information:
                     LACP port     Admin      Oper    Port     Port
Port   Flags  State  Priority      Key        Key     Number   State
Fa0/1  SA     bndl   32768         0x1        0x1     0x0      0x3D
Partner’s information
          Partner                 Partner                    Partner
Port      System ID               Port Number    Age         Flags
Fa0/1     00001,0014.a9e5.d640    0x1            4s          SP
          LACP Partner           Partner        Partner
          Port Priority          Oper Key       Port State
          32768                  0x1            0x3C
Age of the port in the current state: 00d:00h:00m:35s
Port: Fa0/2
------------
Port state      = Up Mstr In-Bndl
Channel group   = 1           Mode  = Active       Gcchange = -
Port-channel    = Po1         GC    = -        Pseudo port-channel = Po1
Port index      = 0           Load  = 0x00         Protocol = LACP
Flags:  S - Device is sending Slow LACPDUs.      F - Device is sending fast
                                                 LACPDUs.
        A - Device is in active mode.            P - Device is in passive mode.
Local information:
                      LACP port   Admin         Oper    Port     Port
Port    Flags  State  Priority    Key           Key     Number   State
Fa0/2   SA     bndl   32768       0x1           0x1     0x1      0x3D
Partner’s information
          Partner               Partner                         Partner
Port      System ID             Port Number         Age         Flags
Fa0/2     00001,0014.a9e5.d640  0x2                 28s         SP
          LACP Partner         Partner             Partner
          Port Priority        Oper Key            Port State
          32768                0x1                 0x3C
Age of the port in the current state: 00d:00h:00m:33s
Port: Fa0/3
------------
Port state      = Up Mstr In-Bndl
Channel group   = 1           Mode  = Active        Gcchange = -
Port-channel    = Po1         GC    = -         Pseudo port-channel = Po1
Port index      = 0           Load  = 0x00          Protocol = -
Flags:  S - Device is sending Slow LACPDUs.       F - Device is sending fast
                                                  LACPDUs.
        A - Device is in active mode.             P - Device is in passive mode.
Local information:
                     LACP port     Admin          Oper    Port     Port
Port   Flags  State  Priority      Key            Key     Number   State
Fa0/3  SA     bndl   32768         0x1            0x1     0x2      0x3D
Partner’s information:
          Partner               Partner                          Partner
Port      System ID             Port Number          Age         Flags
Fa0/3     00001,0014.a9e5.d640  0x3                  5s          SP
          LACP Partner         Partner              Partner
          Port Priority        Oper Key             Port State
          32768                0x1                  0x3C
Age of the port in the current state: 00d:00h:00m:29s
                Port-channels in the group:
                ----------------------
Port-channel: Po1    (Primary Aggregator)
------------
Age of the Port-channel = 00d:00h:13m:50s
Logical slot/port   = 1/0          Number of ports = 3
HotStandBy port = null
Port state          = Port-channel Ag-Inuse
Protocol            = LACP
Ports in the Port-channel:
Index   Load   Port    EC state
------+------+------+------------
0       00     Fa0/1   Active
0       00     Fa0/2   Active
0       00     Fa0/3   Active
Time since last port bundled:    00d:00h:00m:32s    Fa0/3
Time since last port Un-bundled: 00d:00h:00m:49s    Fa0/1
```

LACP的配置及统计数据也可以通过执行`show lacp [options]`命令进行查看。此命令可用的选项在下面的输出中进行了演示。

```console
Switch-1#show lacp ?
  <1-6>     Channel group number
  counters  Traffic information
  internal  Internal information
  neighbor  Neighbor information
  sys-id    LACP System ID
```

`[counters]`关键字提供了有关 LACP 发出和接收到的数据包的信息。该命令的打印输出如下面所示。

```console
Switch-1#show lacp counters
          LACPDUs        Marker     Marker Response     LACPDUs
Port    Sent   Recv    Sent   Recv    Sent   Recv       Pkts Err
---------------------------------------------------------------------
Channel group: 1
Fa0/1   14     12      0      0       0      0          0
Fa0/2   21     18      0      0       0      0          0
Fa0/3   21     18      0      0       0      0          0
```

而`[internal]`关键字提供了诸如端口状态、管理密钥（adminitrative key）、 LACP 端口优先级，以及端口编号等信息。下面的输出对此进行了演示。

```console
Switch-1#show lacp internal
Flags:  S - Device is sending Slow LACPDUs. F - Device is sending Fast
                                            LACPDUs.
        A - Device is in Active mode.       P - Device is in Passive mode.
Channel group 1
                        LACP port    Admin    Oper   Port    Port
Port      Flags  State  Priority     Key      Key    Number  State
Fa0/1     SA     bndl   32768        0x1      0x1    0x0     0x3D
Fa0/2     SA     bndl   32768        0x1      0x1    0x1     0x3D
Fa0/3     SA     bndl   32768        0x1      0x1    0x2     0x3D
```

关键字`[neighbor]`打印出邻居名称、 LACP 邻居的 ID 、邻居的设备 ID （ MAC ），以及邻居端口等信息。这些标志还表明邻居运行所处状态，以及其是否时一个物理学习设备（the flags also indicate the mode the neighbor is operating in, as well as whether it is a physical learner, for example）。下面的输出对此进行了演示。

```console
Switch-1#show lacp neighbor
Flags:  S - Device is sending Slow LACPDUs. F - Device is sending Fast
                                            LACPDUs.
        A - Device is in Active mode.       P - Device is in Passive mode.
Channel group 1 neighbors
Partner’s information
          Partner               Partner                     Partner
Port      System ID             Port Number     Age         Flags
Fa0/1     00001,0014.a9e5.d640  0x1             11s         SP
          LACP Partner         Partner         Partner
          Port Priority        Oper Key        Port State
          32768                0x1             0x3C
Partner’s information:
          Partner               Partner                     Partner
Port      System ID             Port Number     Age         Flags
Fa0/2     00001,0014.a9e5.d640  0x2             19s         SP
          LACP Partner         Partner         Partner
          Port Priority        Oper Key        Port State
          32768                0x1             0x3C
Partner’s information:
          Partner               Partner                     Partner
Port      System ID             Port Number     Age         Flags
Fa0/3     00001,0014.a9e5.d640  0x3             24s         SP
          LACP Partner         Partner         Partner
          Port Priority        Oper Key        Port State
          32768                0x1             0x3C
```

最后，关键字`[sys-id]`提供了本地交换机的系统 ID （finally, the `[sys-id]` keyword provides the system ID of the local switch）。这是一个该交换机 MAC 地址和 LACP 优先级的结合体，如下面的输出所示。

```console
Switch-1#show lacp sys-id
1    ,000d.bd06.4100
```

## 第 33 天问题

1. What type of ports does a FastEtherChannel contain?
2. How many ports can a standard EtherChannel contain?
3. What are the two protocol options you have when configuring EtherChannels on a Cisco switch?
4. Which of the protocols mentioned above is Cisco proprietary?
5. PagP packets are sent to the destination Multicast MAC address `01-00-0C-CC-CC-CC`. True
or false?
6. What are the two port modes supported by PagP?
7. What are the two port modes supported by LACP?
8. If more than eight links are assigned to an EtherChannel bundle running LACP, the protocol uses the port priority to determine which ports are placed into a standby mode. True or false?
9. LACP automatically configures an administrative key value on each port configured to use LACP. The administrative key defines the ability of a port to aggregate with other ports. Only ports that have the same administrative key are allowed to be aggregated into the same port channel group. True or false?
10. What is the command used to assign a port to a channel group?

## 第 33 天答案

1. 100 Mbps ports.
2. Up to eight ports.
3. PagP and LACP.
4. PagP.
5. True.
6. Auto and desirable.
7. Active and passive.
8. True.
9. True.
10. The `channel-group [number] mode` command in Interface Configuration mode.

## 第 33 天实验

### 以太网通道实验

**EtherChannel Lab**

在一个包含了两台直接相连的交换机（它们至今至少有两条链路）上，对本课程模块中出现的配置命令进行测试。通过Fa1/1及Fa2/2将它们连接起来（Fa1/1到Fa1/1及Fa2/2到Fa2/2）。

+ 在两条链路上以`auto-desirable`模式配置PAgP
+ 将该以太网通道配置为一条中继并允许一些 VLANs 通过它
+ 执行一条`show etherchannel summary`命令，并验证该端口通道是运行的
+ 执行一条`show mac-address-table`命令，并看看在两台交换机上所学习到的 MAC 地址
+ 执行一条`show pagp neighbor`命令，并检查结果
+ 采用 LACP 的`passive-active`模式，重复上述步骤
+ 使用命令`show EtherChannel detail`及`show lacp neighbor`命令，对配置进行验证
+ 使用`show interface port-channel [number] switchport`命令，对配置进行验证
+ 通过端口通道发出一些流量（ ping ）, 并使用`show lacp counters`命令对计数器进行检查
+ 配置一个不同的`lacp system-priority`输出，并使用`show lacp sys-id`命令予以验证
+ 配置一个不同的`lacp port-priority`输出，并使用命令`show lacp internal`予以验证
+ 使用命令`port-channel load-balance`，对 LACP 的负载均衡进行配置，并使用`show etherchannel load-balance`命令对此进行验证


（End）



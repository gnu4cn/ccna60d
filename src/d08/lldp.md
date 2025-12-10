# 链路发现协议

思科创建了 CDP 来解决一个任何开放标准协议，都无法解决的问题。最终，一项由 [IEEE 标准 802.1AB](https://en.wikipedia.org/wiki/Link_Layer_Discovery_Protocol) 定义的标准协议发布了，而他被称为链路层发现协议（LLDP）。LLDP 提供了许多与 CDP 相同功能，但相似之处还不止于此，因为 LLDP 共用了与 CDP 相同的许多配置和显示命令。

请注意，若咱们打算使用 LLDP，那么咱们的 10S 版本和平台（即路由器或交换机型号），都必须支持 LLDP。我（作者）只是提醒你们中使用家庭实验室的。LLDP 在 Packet Tracer 中受支持，但命令有限。当咱们有一些运行旧版 10S 的过时路由器时，那么 LLDP 可能不受支持。


下面是一些常见的 LLDP 命令的示例：

```console
R1#show lldp neighbors
Capability codes:  (R) Router, (B) Bridge, (T) Telephone,
                   (C) DOCSIS Cable Device  (W) WLAN Access Point,
                   (P) Repeater, (S) Station, (O) Other

Device ID  Local Intf   Hold-time Capability   Port
IDSW1      Gi0/2        105       B            Gi0/1
R2         Fa0/13       91        R            Gi0/1
Total entries displayed: 2
```


```console
SW2#show lldp entry R2
Capability codes: (R) Router, (B) Bridge, (T) Telephone,
                  (C) DOCSIS Cable Device (W) WLAN Access Point,
                  (P) Repeater, (S) Station, (O) Other
Chassis id: 0200.2222.2222
Port id: Gi0/1
Port Description: GigabitEthernet0/1
System Name: R2
System Description:Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.4(3)M3, RELEASE SOFTWARE (fc2)
Technical Support: http://www.cisco.com/techsupport
Copyright (c) 1986-2015 by Cisco Systems, Inc.
Compiled Fri 05-Jun-15 13:24 by prod_rel_team

Time remaining: 100 seconds
System Capabilities: B,R
Enabled Capabilities: R
Management Addresses:  IP: 10.1.1.9
Auto Negotiation - not supported
Physical media capabilities - not advertised
Media Attachment Unit type - not advertised
Vlan ID: - not advertised
Total entries displayed: 1
```

根据咱们对 CDP 的了解，LLDP 的输出应看起来非常熟悉。最重要的是，两种协议间的接口信息，比如本地即远端端口信息，是相同的，在分析或网络排除故障时，就非常有用。咱们可全局地或按接口启用 LLDP。


## 启用和禁用 LLDP

与 CDP 不同，LLDP 在所有支持接口上，都是全局禁用的，这（当然）意味着，要允许设备发送 LLDP 数据包，咱们必须全局启用 LLDP。不过，在接口级别不需要做任何更改。下面的示例展示了如何全局地启用 LLDP：


```console
Switch#configure terminal
Switch(config)#lldp run
Switch(config)#end
```

使用 `no lldp transmit` 和 `no lldp receive` 命令，咱们可将接口配置为选择性地不发送与接收 LLDP 数据包。

以下示例演示了如何启用接口上的 LLDP：


```console
Switch#configure terminal
Switch(config)#interface GigabitEthernet1/1
Switch(config-if)#lldp transmit
Switch(config-if)#lldp receive
Switch(config-if)#end
```

与 CDP 一样，在任何边缘网络设备上，让 LLDP 保持打开，都表示某种安全风险。我们将在安全课文（及随后实验）中，介绍这点。



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

# `ping`、`traceroute` 及其扩展选项

IOS 中使用频率最高的工具莫过于 ping 和 traceroute 命令。每个网络管理员和工程师都使用过这些命令，但令人惊讶的是，很少有人知道它们的所有功能。本节将深入探讨 ping 和 traceroute 命令，这不仅是为了让你在考试中取得好成绩，更重要的是，让你可以利用这些信息来支持你所负责的网络。

最后，字段`VTP pruning statistics`将只在 VTP 域的 VLAN 修剪开启时，才会包含非零值。**修剪是在服务器上开启的，同时该配置在该 VTP 域中得以传播。**在某 VTP 域的修剪开启时，服务器将接收来自客户端的 Join 报文（the VTP Join messages）（pruning is enabled on servers and this configuration is propagated throughtout the VTP domain. Servers will receive joins from clients when pruning has been enabled for the VTP domain, [VTP pruning, InformIT](pdfs/VTP-Pruning_InformIT.pdf)）。

![VTP Join报文及 VTP 修剪](../images/03fig15.gif)

*VTP Join报文及 VTP 修剪*

>
> - RSPAN VLANs
>
> - Private VLAN, PVLAN
>
> -


## 第 15 天问题

1. What is the colour of the system LED under normal system operations?
2. What is the colour of the RPS LED during a fault condition?
3. You can cycle through modes by pressing the Mode button until you reach the mode setting you require. This changes the status of the port LED colours. True or false?
4. What port speed is represented by a blinking green LED?
5. If you want to be sure that you are not dealing with a cabling issue, one of the simplest things to do is to `_______` the cable and run the same tests again.
6. Which command is generally used to troubleshoot Layer 1 issues (besides show interfaces )?
7. The `_______` status is reflected when the connected cable is faulty or when the other end of the cable is not connected to an active port or device (e.g., if a workstation connected to the switch port is powered off).
8. What are runts?
9. The `_______` command can also be used to view interface errors and facilitate Layer 1 troubleshooting.
10. Which command prints a brief status of all active VLANs?


## 第 15 天答案

1. Green.
2. Amber.
3. True.
4. 1000Mbps.
5. Replace.
6. The `show controllers` command.
7. `notconnect`.
8. Packets that are smaller than the minimum packet size (less than 64 bytes on Ethernet).
9. `show interfaces [name] counters errors`.
10. The `show vlan brief`command.

## 第 15 天实验

### 一层排错实验

在真实设备上对本模块中提到的一层排错相关命令进行测试。

    - 如同模块中所讲解的那样，检查不同场景下交换机系统及端口 LED 状态
    - 执行一下`show interface`命令，并对本模块中所说明的有关信息进行查证
    - 对`show controllers`及`show interface counters errors`进行同样的执行

### 二层排错使用

在真实设备上对本模块中提到的二层排错相关命令进行测试。

    - 在交换机之间配置 VTP ，并将一些 VLANs 从 VTP 服务器通告到 VTP 客户端（查看第三天的 VTP 实验）
    - 在两台交换机之间配置一条中继链路，并生成一些流量（ ping 操作）
    - 测试`show vlan`命令
    - 测试`show interface counters trunk`命令
    - 测试`show interface switchport`命令
    - 测试`show interface trunk`命令
    - 测试`show VTP status`命令
    - 测试`show VTP counter`命令


（End）



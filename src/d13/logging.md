# 记录事件

有许多不同的方法可以监控网络设备的状态，但更有用的方法之一是利用 108 中的日志功能。具体来说，您可以使用日志命令跟踪所关注领域的重要更新。与您所做选择相关的事件将被记录到思科路由器的日志中，供您立即或稍后查看。以下是供您选择的多个选项：
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



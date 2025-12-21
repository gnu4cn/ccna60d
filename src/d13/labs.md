# 第 13 天实验


## 一层故障排除实验

在真实设备上测试这一教学模组中，展示的那些有关一层故障排除的命令：

1. 根据这个教学模组中介绍的，检查不同场景下交换机的系统及端口 LED 状态；
2. 根据这一教学模组中的描述，执行 `show interface` 命令并检查所有相关信息；
3. 对 `show controllers` 与 `show interface counters errors` 命令完成同样操作。


## 二层故障排除实验

在真实设备上测试这一教学模组中，展示的那些二层故障排除相关命令：

1. 配置两台交换机之间的 VTP，并将 VTP 服务器上的一些 VLAN，通告到 VTP 客户端（请参阅 [第 7 天的 VTP 实验](../d07/labs.html#vtp-实验)）；
2. 配置两台交换机之间的中继，并生成一些流量（`ping`）；
3. 测试 `show vlan` 命令；
4. 测试 `show interface counters trunk` 命令；
5. 测试 `show interface switchport` 命令；
6. 测试 `show interface trunk` 命令；
7. 测试 `show VTP status` 命令；
8. 测试 `show VTP counter` 命令。


（End）



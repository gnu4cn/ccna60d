# 第 11 天实验

## EtherChannel 实验

请在一个包含两台直连交换机（他们之间至少有两条链路）的简单拓扑结构上，测试这一教学模组中出现的那些配置命令。通过 `Fal/1` 和 `Fa2/2`（`Fal/1` 到 `Fal/1`，`Fa2/2` 到 `Fa2/2`）或 `Fa0/1` 等咱们设备上可用的端口连接他们。

1. 以 `auto-desirable` 模式，在这两条链路上配置 PagP；
2. 将这条 EtherChannel 链路配置为一条中继链路，并允许几个 VLAN 通过他；
3. 执行 `show etherchannel summary` 命令，并验证这个端口通道是否起来；
4. 执行 `show mac-address-table` 命令，查看两台交换机上学习到的 MAC 地址；
5. 执行 `show papg neighbor` 命令并检查结果；
6. 使用 LACP 的 `passive-active` 模式，重复以上步骤；
7. 使用 `show EtherChannel detail` 和 `show lacp neighbor` 命令验证配置；
8. 使用 `show interface port-channel [number] switchport` 命令验证配置；
9. 在这条端口通道上发送一些流量（`ping`），并使用 `show lacp counters` 命令检查各种计数器；
10. 配置一个不同的 `lacp system-priority` 输出，并使用 `show lacp sys-id` 命令检查之；
11. 配置一个不同的 `lacp port-priority` 输出，并使用 `show lacp internal` 命令检查之；
12. 使用 `port-channel load-balance` 命令配置 LACP 的负载均衡，并使用 `show etherchannel load-balance` 命令验证这点。

（End）



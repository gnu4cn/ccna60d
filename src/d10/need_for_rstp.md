# RSTP 的必要性

## 第 31 天问题

1. How often do switches send Bridge Protocol Data Units ( BPDUs)?
2. Name the STP port states in the correct order.
3. What is the default Cisco Bridge ID?
4. Which command will show you the Root Bridge and priority for a VLAN?
5. What is the STP port cost for a 100Mbps link?
6. When a port that is configured with the `_______` `_______` feature receives a BPDU, it immediately transitions to the errdisable state.
7. The `_______` `_______` feature effectively disables STP on the selected ports by preventing them from sending or receiving any BPDUs.
8. Which two commands will force the switch to become the Root Bridge for a VLAN?
9. Contrary to popular belief, the Port Fast feature does not disable Spanning Tree on the selected port. This is because even with the Port Fast feature, the port can still send and receive BPDUs. True or false?
10. The Backbone Fast feature provides fast failover when a direct link failure occurs. True or false?

## 第 31 天答案

1. Every two seconds.
2. Blocking, Listening, Learning, Forwarding, and Disabled.
3. 32768.
4. The `show spanning-tree vlan x` command.
5. 19.
6. BPDU Guard.
7. BPDU Filter.
8. The `spanning-tree vlan [number] priority [number]` and `spanning-tree vlan [number] root [primary|secondary]` commands.
9. True.
10. False.

## 第 31 天实验

### 生成树根选举实验

**实验拓扑**

![生成树根选举实验拓扑](../images/3119.png)

**实验目的**

学习如何对哪台交换机成为生成树根桥施加影响。

**实验步骤**

1. 设置各台交换机的主机名并将其用交叉线连接起来。此时可以检查它们之间的接口是否被设置到“ trunk ”中继。


    ```console
    Switch#show interface trunk
    ```

2. 在将一侧设置为中继链路之前，可能看不到中继链路变成活动的。


    ```console
    SwitchB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    SwitchB(config)#int FastEthernet0/1
    SwitchB(config-if)#switchport mode trunk
    SwitchB(config-if)#^Z
    SwitchB#sh int trunk
    Port    Mode        Encapsulation   Status      Native vlan
    Fa0/1   on          802.1q          trunking    1
    Port    Vlans allowed on trunk
    Fa0/1   1-1005
    Port    Vlans allowed and active in management domain
    Fa0/1   1
    ```

3. 将看到另一交换机是留作自动模式的。


    ```console
    SwitchA#show int trunk
    Port    Mode        Encapsulation   Status      Native vlan
    Fa0/1   auto        n-802.1q        trunking    1
    Port    Vlans allowed on trunk
    Fa0/1   1-1005
    Port    Vlans allowed and active in management domain
    Fa0/1   1
    ```

4. 在每台交换机上创建出两个 VLANs 。


    ```console
    SwitchA#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    SwitchA(config)#vlan 2
    SwitchA(config-vlan)#vlan 3
    SwitchA(config-vlan)#^Z
    SwitchA#
    %SYS-5-CONFIG_I: Configured from console by console
    SwitchA#show vlan brief
    VLAN Name                   Status      Ports
    ---- ------------------     -------     --------------------
    1    default                active      Fa0/2, Fa0/3, Fa0/4,
                                            Fa0/5, Fa0/6, Fa0/7,
                                            Fa0/8, Fa0/9, Fa0/10,
                                            Fa0/11, Fa0/12, Fa0/13,
                                            Fa0/14, Fa0/15, Fa0/16,
                                            Fa0/17, Fa0/18, Fa0/19,
                                            Fa0/20, Fa0/21, Fa0/22,
                                            Fa0/23, Fa0/24
    2    VLAN0002               active
    3    VLAN0003               active
    1002 fddi-default           active
    1003 token-ring-default     active
    ```

    同时也在交换机 B 上创建出 VLANs （拷贝上面的命令）。

5. 确定哪台交换机是VLANs 2和 3 的根桥。


    ```console
    SwitchB#show spanning-tree vlan 2
    VLAN0002
        Spanning tree enabled protocol ieee
        Root ID     Priority    32770
                    Address 0001.972A.7A23
                    This bridge is the root
                    Hello Time  2 sec
                    Max Age     20 sec  Forward Delay 15 sec
        Bridge ID   Priority    32770 (priority 32768 sys-id-ext 2)
                    Address     0001.972A.7A23
                    Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                    Aging Time  20
    Interface           Role  Sts  Cost      Prio.Nbr Type
    ---------           ----  ---  ----      -------- ----
    Fa0/1               Desg  FWD  19        128.1    P2p
    ```

    可以看到，Switch B是根。在交换机 A 上完成同样的命令，并对VLAN 3进行检查。优先级是 32768 加上 VLAN 编号，这里就是2.最低 MAC 地址将确定出根桥。

    ```console
    SwitchB#show spanning-tree vlan 3
    VLAN0003
        Spanning tree enabled protocol ieee
        Root ID     Priority    32771
                    Address 0001.972A.7A23
                    This bridge is the root
                    Hello Time  2 sec   Max Age 20 sec  Forward Delay 15 sec
        Bridge ID   Priority    32771 (priority 32768 sys-id-ext 3)
                    Address 0001.972A.7A23
                    Hello Time  2 sec   Max Age 20 sec  Forward Delay 15 sec
                    Aging Time  20
    Interface           Role  Sts  Cost       Prio.Nbr Type
    ----------          ----  ---  ----       -------- ----
    Fa0/1               Desg  FWD  19         128.1    P2p
    ```

    这里Switch A的 MAC 地址较高，这就是为何其不会成为根桥的原因：`0010： 1123 ：D245`

6. 将另一个交换机设置为VLANs 2和 3 的根桥。对VLAN 2使用命令`spanning-tree vlan 2 priority 4096`，以及对VLAN 3的`spanning-tree vlan 3 root primary`命令。


    ```console
    SwitchA(config)#spanning-tree vlan 2 priority 4096
    SwitchA(config)#spanning-tree vlan 3 root primary
    SwitchA#show spanning-tree vlan 2
    VLAN0002
        Spanning tree enabled protocol ieee
        Root ID     Priority     4098
                    Address         0010.1123.D245
                    This bridge is the root
                    Hello Time      2 sec   Max Age 20 sec  Forward Delay 15 sec
        Bridge ID   Priority        4098  (priority 4096 sys-id-ext 2)
                    Address         0010.1123.D245
                    Hello Time      2 sec   Max Age 20 sec  Forward Delay 15 sec
                    Aging Time      20
    Interface           Role  Sts      Cost       Prio.Nbr Type
    ---------           ----  ---      ----       -------- ----
    Fa0/1               Desg  FWD      19         128.1    P2p
    SwitchA#show spanning-tree vlan 3
    VLAN0003
        Spanning tree enabled protocol ieee
        Root ID    Priority    24579
                   Address     0010.1123.D245
                   This bridge is the root
                   Hello Time  2 sec    Max Age 20 sec  Forward Delay 15 sec
    Bridge ID      Priority    24579 (priority 24576 sys-id-ext 3)
                   Address     0010.1123.D245
                   Hello Time  2 sec    Max Age 20 sec  Forward Delay 15 sec
                   Aging Time  20
    Interface          Role  Sts  Cost        Prio.Nbr Type
    ---------          ----  ---  ----        -------- ----
    Fa0/1              Desg  FWD  19          128.1    P2p
    SwitchA#
    ```

    > **注意：** 尽管Switch B有较低的桥 ID ，Switch A还是被强制作为根桥。


（End）



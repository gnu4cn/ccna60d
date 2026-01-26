# 第 10 天实验

## 生成树根桥选举

### 拓扑结构

![生成树根桥选举实验拓扑结构](../images/d10_lab_01.png)

### 实验目的

了解如何影响哪个交换机会成为生成树的根桥。

### 实验步骤

1. 设置每个交换机的主机名，并用交叉线连接他们。然后咱们可检查他们之间的接口，是否被设置为 “中继模式”；

    ```console
    Switch#show interface trunk
    ```

2. 在将一侧设置为中继链路前，咱们可能不会看到，该中继链路称为活动状态；


    ```console
    SwitchB#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    SwitchB(config)#int FastEthernet0/1
    SwitchB(config-if)#switchport mode trunk
    SwitchB(config-if)#^Z
    SwitchB#sh int trunk

    Port        Mode         Encapsulation  Status        Native vlan
    Fa0/1       on           802.1q         trunking      1

    Port        Vlans allowed on trunk
    Fa0/1       1-1005

    Port        Vlans allowed and active in management domain
    Fa0/1       1
    ```

3. 咱们将看到，另一交换机处于自动模式；

    ```console
    SwitchA#show int trunk
    Port        Mode         Encapsulation  Status        Native vlan
    Fa0/1       auto         n-802.1q       trunking      1

    Port        Vlans allowed on trunk
    Fa0/1       1-1005

    Port        Vlans allowed and active in management domain
    Fa0/1       1
    ```

4. 在两台交换机上创建两个 VLAN。

    ```console
    SwitchA#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    SwitchA(config)#vlan 2
    SwitchA(config-vlan)#vlan 3
    SwitchA(config-vlan)#^Z
    SwitchA#
    %SYS-5-CONFIG_I: Configured from console by console

    SwitchA#show vlan brief
    VLAN Name                     Status    Ports
    ---- ----------------         -------   ------------------
    1    default                  active   Fa0/2, Fa0/3, Fa0/4,
                                           Fa0/5, Fa0/6, Fa0/7,
                                           Fa0/8, Fa0/9, Fa0/10,
                                           Fa0/11, Fa0/12, Fa0/13,
                                           Fa0/14, Fa0/15, Fa0/16,
                                           Fa0/17, Fa0/18, Fa0/19,
                                           Fa0/20, Fa0/21, Fa0/22,
                                           Fa0/23, Fa0/24

    2    VLAN0002                       active
    3    VLAN0003                       active
    1002 fddi-default                   active
    1003 token-ring-default             active
    ```

    在 `Switch B` 上也创建这些 VLAN（复制上面的命令）。

5. 确定哪台交换机分别是 `VLAN 2` 和 `VLAN 3` 的根桥；

    ```console
    SwitchB#show spanning-tree vlan 2
    VLAN0002
      Spanning tree enabled protocol ieee
      Root ID    Priority    32770
                 Address     0001.972A.7A23
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

      Bridge ID  Priority    32770  (priority 32768 sys-id-ext 2)
                 Address     0001.972A.7A23
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20

    Interface        Role  Sts  Cost      Prio.Nbr Type
    ---------        ----  ---  ----      -------- ----
    Fa0/1            Desg  FWD  19        128.1    P2p
    ```

    咱们可以看到，`Switch B` 是根节点。在 `Switch A` 上执行这同一命令，并检查 `VLAN 3`。其中优先级是 32768 加上 VLAN 编号，在这种情况下为 2。随后，最低的 MAC 地址将确定出根桥。

    ```console
    SwitchB#show spanning-tree vlan 3
    VLAN0003
      Spanning tree enabled protocol ieee
      Root ID    Priority    32771
                 Address     0001.972A.7A23
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

      Bridge ID  Priority    32771  (priority 32768 sys-id-ext 3)
                 Address     0001.972A.7A23
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20

    Interface        Role  Sts  Cost      Prio.Nbr Type
    ----------       ----  ---  ----      -------- ----
    Fa0/1            Desg  FWD  19        128.1    P2p
    ```

    我（作者）的 `Switch A` MAC 地址较高，这就是他为什么没有成为根网桥的原因。

    `0010.1123.D245`

6.将另一交换机设置为 `VLAN 2` 和 `VLAN 3` 的根桥。对 `VLAN 2` 使用 `spanning-tree vlan 2 priority 4096` 命令，对 `VLAN 3` 使用 `spanning-tree vlan 3 root primary` 命令。

    ```console
    SwitchA(config)#spanning-tree vlan 2 priority 4096
    SwitchA(config)#spanning-tree vlan 3 root primary

    SwitchA#show spanning-tree vlan 2
    VLAN0002
      Spanning tree enabled protocol ieee
      Root ID    Priority    4098
                 Address     0010.1123.D245
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

      Bridge ID  Priority    4098  (priority 4096 sys-id-ext 2)
                 Address     0010.1123.D245
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20

    Interface        Role  Sts  Cost      Prio.Nbr Type
    ---------        ----  ---  ----      -------- ----
    Fa0/1            Desg  FWD  19        128.1    P2p

    SwitchA#show spanning-tree vlan 3
    VLAN0003
      Spanning tree enabled protocol ieee
      Root ID    Priority    24579
                 Address     0010.1123.D245
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

      Bridge ID  Priority    24579  (priority 24576 sys-id-ext 3)
                 Address     0010.1123.D245
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20

    Interface        Role  Sts  Cost      Prio.Nbr Type
    ---------        ----  ---  ----      -------- ----
    Fa0/1            Desg  FWD  19        128.1    P2p

    SwitchA#
    ```

**注意**： 尽管 `Switch B` 有着较低的网桥 ID，但交换机 A 被强制成为了根网桥。

## RSTP实验

### 拓扑结构

![RSTP实验拓扑图](../images/3204.png)

### 实验目的

学习 RSTP 的配置命令。

### 实验步骤

1. 检查咱们交换机上的生成树模式；


    ```console
    SwitchA#show spanning-tree summary
    Switch is in pvst mode
    Root bridge for: VLAN0002 VLAN0003
    ```

2. 将模式改为 RSTP 并再次检查；


    ```console
    SwitchA(config)#spanning-tree mode rapid-pvst
    SwitchA#show spanning-tree summary
    Switch is in rapid-pvst mode
    Root bridge for: VLAN0002 VLAN0003
    ```

3. 咱们可以预先预测出那些端口将是根/指定/阻塞端口吗？



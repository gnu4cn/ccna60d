# 第三天的实验

## VLAN 和中继实验

**拓扑图，Topology**

![](../images/0300.png)

**实验目的，Purpose**

学习如何配置 VLANs 以及中继链路。

**实验步骤，Walkthrough**

1. 你需要在每台 PC 上添加 IP 地址。可自由选择，只要求它们在同一子网上。

2. 在交换机 A 上设置主机名（hostname）, 创建 VLAN 2, 并将连接 PC 的那个接口放到 VLAN 2 中。如你愿意，你也可以赋予 VLAN 2 一个名称。


    ```console
    Switch>en
    Switch#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Switch(config)#hostname SwitchA
    SwitchA(config)#vlan 2
    SwitchA(config-vlan)#name 60days
    SwitchA(config-vlan)#interface FastEthernet0/1
    SwitchA(config-if)#switchport mode access
    SwitchA(config-if)#switchport access vlan 2
    SwitchA(config-if)#^Z
    SwitchA#show vlan brief
    VLAN    Name                Status      Ports
    ----    ---------   -------------------------------
    1       default             active      Fa0/2, Fa0/3, Fa0/4, Fa0/5,
                                            Fa0/6, Fa0/7, Fa0/8, Fa0/9,
                                            Fa0/10, Fa0/11, Fa0/12, Fa0/13,
                                            Fa0/14, Fa0/15, Fa0/16, Fa0/17,
                                            Fa0/18, Fa0/19, Fa0/20, Fa0/21,
                                            Fa0/22, Fa0/23, Fa0/24
    2       60days              active      Fa0/1
    1002    fddi-default        active
    1003    token-ring-default  active
    1004    fddinet-default     active
    1005    trnet-default       active
    SwitchA#
    ```

3. 将中继链路设置为中继模式。


    ```console
    SwitchA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    SwitchA(config)#int FastEthernet0/2
    SwitchA(config-if)#switchport mode trunk
    SwitchA#show interface trunk
    Port    Mode        Encapsulation   Status      Native vlan
    Fa0/2   on          802.1q          trunking    1
    Port    Vlans allowed on trunk
    Fa0/2   1-1005
    ```

4. 如你愿意，设置在该中继链路上仅允许 VLAN 2。


    ```console
    SwitchA(config)#int FastEthernet0/2
    SwitchA(config-if)#switchport trunk allowed vlan 2
    SwitchA(config-if)#^Z
    SwitchA#
    %SYS-5-CONFIG_I: Configured from console by console
    SwitchA#show int trunk
    Port    Mode    Encapsulation   Status      Native vlan
    Fa0/2   on      802.1q          trunking    1
    Port    Vlans allowed on trunk
    Fa0/2   2
    ```

5. 此时，如你自其中一台 PC ping 往另一台，将会失败。这是因为一边是在 VLAN 1 中，另一边在 VLAN 2 中。


    ```console
    PC>ping 192.168.1.1
    Pinging 192.168.1.1 with 32 bytes of data:
    Request timed out.
    Ping statistics for 192.168.1.1:
        Packets: Sent = 2, Received = 0, Lost = 2 (100% loss)
    ```

6. 此时在交换机 B 上配置同样的那些命令。创建 VLAN、将交换机 PC 端口放入 VLAN 2，并将该接口设置为接入模式，还要将中继链路设置为 “中继”。

7. 现在你就可以从一台 PC 实现跨越中继链路 ping 通另一 PC 了。


    ```console
    PC>ping 192.168.1.1
    Pinging 192.168.1.1 with 32 bytes of data:
    Reply from 192.168.1.1: bytes=32 time=188ms TTL=128
    Reply from 192.168.1.1: bytes=32 time=78ms TTL=128
    Reply from 192.168.1.1: bytes=32 time=94ms TTL=128
    Reply from 192.168.1.1: bytes=32 time=79ms TTL=128
    Ping statistics for 192.168.1.1:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 78ms, Maximum = 188ms, Average = 109ms
    ```


### VTP 实验

在一个又两台交换机组成的拓扑中，实验今天所提到的那些 VTP 配置命令。

- 将其中一台交换机配置为 VTP 服务器
- 将另一台交换机配置为 VTP 客户端
- 在两台交换机上配置同样的 VTP 域及口令（the same VTP domain and password）
- 在服务器交换机上创建一系列的 VLANs，然后观察它们是如何彼此之间是如何通告的
- 在两台交换机上都配置 VTP 修剪（VTP pruning）
- 在两台交换机上检查（展示） VTP 配置
- 在两台交换机上配置不同的 VTP 域及口令，并重复上述过程；观察结果的不同


（End）



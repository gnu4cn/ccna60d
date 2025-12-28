# 第 21 天 实验

## VLAN 间路由器的子接口实验

### 实验拓扑图

![VLAN 间路由器的子接口实验拓扑结构](../images/d21_lab_topology_01.png)


### 实验目的


学习如何使用路由器子接口，配置 VLAN 间路由。

我（作者）已将 Packet Tracer 用于这个实验，但当咱们有着对全部可用设备的访问时，咱们也可以使用咱们自己的家庭实验室。要在每台电脑上设置下面显示的 IP 地址，并将顶部那台 PC 的默认网关，设置为 `10.10.10.254`，底部 PC 的默认网关设置为 `10.20.20.254`。下面是顶部 PC 的配置：


![VLAN 间路由器子接口实验的顶部 PC 配置](../images/d21_lab_01_01.png)


### 实验步骤

1. 在其中交换机上创建 `VLAN 10` 及 `VLAN 20`，并为正确 VLAN 设置正确端口；

    ```console
    Switch#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    Switch(config)#vlan 10
    Switch(config-vlan)#vlan 20
    Switch(config-vlan)#int f0/2
    Switch(config-if)#switchport mode access
    Switch(config-if)#switchport access vlan 10
    Switch(config-if)#no shut
    Switch(config-if)#int f0/1
    Switch(config-if)#switchport mode access
    Switch(config-if)#switchport access vlan 20
    ```

2. 将面向路由器的接口，设置为中继；

    ```console
    Switch(config-if)#int g0/1
    Switch(config-if)#switchport mode trunk
    ```


3. 在路由器上配置子接口，每个 VLAN 配置一个；


    ```console
    Router(config)#int g0/1
    Router(config-if)#no ip address
    Router(config-if)#int g0/1.10
    Router(config-subif)#encap dot1Q 10
    Router(config-subif)#ip add 10.10.10.254 255.255.255.0
    Router(config-subif)#
    Router(config-subif)#int g0/1.20
    Router(config-subif)#encap dot
    Router(config-subif)#encap dot1Q 20
    Router(config-subif)#ip add 10.20.20.254 255.255.255.0
    Router(config-subif)#int g0/1
    Router(config-if)#no shut
    ```


4. 在 `10.10.10.1` 设备上打开一个命令提示符并 `ping` 默认网关。然后 `ping` `VLAN 20` 中的 PC，证明这一子接口配置有效。

    ```console
    Packet Tracer PC Command Line 1.0
    C:\>ping 10.10.10.254

    Pinging 10.10.10.254 with 32 bytes of data:

    Reply from 10.10.10.254: bytes=32 time=1ms TTL=255
    Reply from 10.10.10.254: bytes=32 time=1ms TTL=255
    Reply from 10.10.10.254: bytes=32 time<1ms TTL=255
    Reply from 10.10.10.254: bytes=32 time<1ms TTL=255

    Ping statistics for 10.10.10.254:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms

    C:\>ping 10.20.20.1

    Pinging 10.20.20.1 with 32 bytes of data:

    Request timed out.
    Reply from 10.20.20.1: bytes=32 time<1ms TTL=127
    Reply from 10.20.20.1: bytes=32 time<1ms TTL=127
    Reply from 10.20.20.1: bytes=32 time<1ms TTL=127

    Ping statistics for 10.20.20.1:
        Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 0ms, Average = 0ms
    ```


## VLAN 间的 SVI

### 拓扑

![VLAN 间的 SVI 实验拓扑结构](../images/d21_lab_topology_02.png)

### 实验目的

学习如何使用 SVI 配置 VLAN 间路由。

我已将 Packet Tracer 用于这个实验，以及内置的三层交换机，但当咱们有着对全部可用设备的访问时，咱们可使用咱们自己的家庭实验室。要在每台 PC 上设置下面显示的 IP 地址，并按图中标记设置默认网关。


### 实验步骤

1. 在交换机上创建 `VLAN 10` 与 `VLAN 20`，并针对正确 VLAN 设置正确端口；


    ```console
    Switch#conf t
    Enter configuration commands, one per line.  End with CNTL/Z.
    Switch(config)#vlan 10
    Switch(config-vlan)#vlan 20
    Switch(config-vlan)#int f0/2
    Switch(config-if)#switchport
    Switch(config-if)#switchport mode access
    Switch(config-if)#switchport access vlan 10
    Switch(config-if)#no shut
    Switch(config-if)#int f0/1
    Switch(config-if)#switchport
    Switch(config-if)#switchport mode access
    Switch(config-if)#switchport access vlan 20
    ```


2. 因为我（作者）使用的是个三层交换机，所以我们必须以 `switchport` 命令，将接口设置为二层接口，即咱们在上面看到的。接下来，我们需要为 VLAN 添加一个 IP 地址，因为我们未连接到某个路由器；


    ```console
    Switch(config)#interface vlan 10
    %LINK-5-CHANGED: Interface Vlan10, changed state to up
    %LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan10, changed state to up
    Switch(config-if)#ip add 10.10.10.1 255.255.255.0
    Switch(config-if)#no shut
    Switch(config-if)#int vlan 20
    %LINK-5-CHANGED: Interface Vlan20, changed state to up
    %LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan20, changed state to up
    Switch(config-if)#ip add 10.20.20.1 255.255.255.0
    Switch(config-if)#no shut
    Switch(config-if)#exit
    Switch#show vlan brief
    VLAN Name Status                   Ports
    ---- -------------- --------- -------------------------------
    1 default active               Fa0/3, Fa0/4, Fa0/5, Fa0/6
                                   Fa0/7, Fa0/8, Fa0/9, Fa0/10
                                   Fa0/11, Fa0/12, Fa0/13, Fa0/14
                                   Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                   Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                   Fa0/23, Fa0/24, Gig0/1, Gig0/2
                                    Gig0/1, Gig0/2
    10   VLAN0010                         active    Fa0/2
    20   VLAN0020                         active    Fa0/1
    1002 fddi-default                     active
    1003 token-ring-default               active
    1004 fddinet-default                  active   
    1005 trnet-default                    active
    ```

3. 由于我们没有使用路由器，所以我们启用该交换机上的 IP 路由，以便器可在两个子网间路由；


    ```console
    Switch(config)#ip routing
    ```


4. 检查 VLAN 接口是否起来；

    ```console
    Switch#show ip interface brief
    GigabitEthernet0/1 unassigned  YES unset  down                  down
    GigabitEthernet0/2 unassigned  YES unset  down                  down
    Vlan1            unassigned    YES unset  administratively down down
    Vlan10            10.10.10.1   YES manual up                    up
    Vlan20           10.20.20.1    YES manual up                    up
    [Output Truncated]
    ```

5. `ping` 默认网关，然后 `ping` 另一个 VLAN 上的 PC，检查 VLAN 间路由是否正常。


    ```console
    C:\>ping 10.10.10.1

    Pinging 10.10.10.1 with 32 bytes of data:

    Reply from 10.10.10.1: bytes=32 time<1ms TTL=255
    Reply from 10.10.10.1: bytes=32 time<1ms TTL=255
    Reply from 10.10.10.1: bytes=32 time<1ms TTL=255
    Reply from 10.10.10.1: bytes=32 time<1ms TTL=255

    Ping statistics for 10.10.10.1:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 0ms, Average = 0ms

    C:\>ping 10.20.20.20

    Pinging 10.20.20.20 with 32 bytes of data:

    Request timed out.
    Reply from 10.20.20.20: bytes=32 time<1ms TTL=127
    Reply from 10.20.20.20: bytes=32 time<1ms TTL=127
    Reply from 10.20.20.20: bytes=32 time<1ms TTL=127

    Ping statistics for 10.20.20.20:
        Packets: Sent = 4, Received = 3, Lost = 1 (25% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 0ms, Average = 0ms

    C:\>
    ```




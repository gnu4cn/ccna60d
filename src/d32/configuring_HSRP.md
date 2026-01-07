# 配置 HSRP

## 在网关上配置 HSRP


要在网关上配置 HSRP，需要以下步骤：

1. 使用 `ip address [address] [mask] [secondary]` 这条接口配置命令，配置网关接口的正确 IP 地址及掩码；
2. 在网关接口上创建一个 HSRP 分组，并经由 `standby [number] ip [virtual address][secondary]` 这条接口配置命令，给这个组指派虚拟 IP 地址；其中 `[secondary]` 关键字会将这个 IP 地址，指定为这个指定组的辅助网关 IP 地址；
3. 作为可选项，可通过使用 `standby [number] name [name]` 这条接口配置命令，给该 HSRP 分组指派一个名字；
4. 作为可选项，当咱们打算控制活动网关的选举时，就要经由 `standby [number] priority [value]` 这条接口配置命令，配置分组优先级。

这一小节中的以下 HSRP 配置输出，将基于下图 32.17 中的网络。

![HSRP 示例配置的拓扑](../images/3417.png)

**图 32.17** -- **HSRP 配置示例的拓扑结构**

**注意**：其中已假设 `Switch-1` 与 `Switch-2` 之间的 VLAN 与中继配置已存在，并且两台交换机能够成功通过 `VLAN172` 互相 `ping` 通。出于简洁原因，这些配置输出将于配置示例中省略。

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#ip address 172.16.31.1 255.255.255.0
VTP-Server-1(config-if)#standby 1 ip 172.16.31.254
VTP-Server-1(config-if)#standby 1 priority 105
VTP-Server-1(config-if)#exit
VTP-Server-2(config)#interface vlan172
VTP-Server-2(config-if)#ip address 172.16.31.2 255.255.255.0
VTP-Server-2(config-if)#standby 1 ip 172.16.31.254
VTP-Server-2(config-if)#exit
```

**注意**：这里未手动指派应用到 `Switch-2` 的 HSRP 配置的优先级值。默认情况下，HSRP 将使用一个 100 的优先级值，从而允许有着 105 的优先级值的 `Switch-1` 赢得选举，并被选为这个 HSRP 分组的主网关。


一旦部署后，HSRP 的配置就可通过使用 `show standby [interface brief]` 这条命令加以验证。`show standby brief` 这条命令，显示于以下输出中：

```console
VTP-Server-1#show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp      Pri P State   Active  Standby         Virtual IP
Vl172       1        105   Active  local   172.16.31.2     172.16.31.254

VTP-Server-2#show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp      Pri P State   Active  Standby         Virtual IP
Vl172       1        100   Standby local   172.16.31.1     172.16.31.254
```

根据这一配置，只有当 `Switch-1` 失效时，`Switch-2` 才会成为这个分组的活动网关。此外，由于抢占未被配置，当 `Switch-1` 重新上线时，即使他有着该 HSRP 分组相比正用在 `Switch-2` 上的更高优先级，也将无法强行接管活动网关的角色。


## 配置 HSRP 的抢占

所谓抢占，允许某个在其有着相比当前活动网关更高优先级时，强行接管活动网关的角色。HSRP 的抢占，时通过使用 `standby [number] preempt` 命令配置的。这一配置在 `Switch-1` 上的以下配置中得以演示：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 preempt
```

`show standby [interface [name]|brief]` 这条命令，还用于验证抢占是否已于某个网关配置。这点通过下面 `show standby brief `命令输出中显示的 `'P'` 得以演示。

```console
VTP-Server-1#show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp Pri  P State   Active  Standby         Virtual IP
Vl172       1   105  P Active  local   172.16.31.2     172.16.31.254
```


根据这一修改，当 `Switch-1` 确实失效时，那么 `Switch-2` 便接管了 `VLAN 172` 的活动网关角色，`Switch-1` 在重新初始化后，便可强制重新承担该角色。在配置抢占时，Cisco 10S 软件允许咱们指定出，交换机在其抢占并强制重新接管活动网关角色前，必须等待的时间。

默认情况下，这一动作会立即发生。但其可通过使用 `standby [number] preempt delay [minimum|reload|sync]` 这条接口配置命令加以调整。其中 `[minimum]` 关键字，用于指定抢占前要等待的最短时间（秒）。以下输出显示了，如何将网关配置未在抢占前等待 30 秒：


```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 preempt delay minimum 30
```

这一配置可通过使用 `show standby [interface]` 命令加以验证。这在以下输出中得以演示：

```console
VTP-Server-1#show standby vlan172
Vlan172 - Group 1
    State is Active
        5 state changes, last state change 00:00:32
Virtual IP address is 172.16.31.254
Active virtual MAC address is 0000.0c07.ac01
    Local virtual MAC address is 0000.0c07.ac01 (v1 default)
Hello time 3 sec, hold time 10 sec
    Next hello sent in 0.636 secs
Preemption enabled, delay min 30 secs
Active router is local
Standby router is 172.16.31.2, priority 100 (expires in 8.629 sec)
Priority 105 (configured 105)
IP redundancy name is “hsrp-Vl172-1” (default)
```


其中 `[reload]` 关键字，用于指定网关在重载后的初始化后，应等待的时间。`[sync]` 关键字会与 IP 的冗余客户端结合使用。这一配置超出了 CCNA 考试要求的范围，但在生产环境中非常有用，因为他防止了在正跟踪的某个抖动接口情形下，不必要的角色变化。


## 配置 HSRP 的接口跟踪


HSRP 的接口跟踪，允许管理员为了跟踪接口状态，并根据默认值（10）或预先配置值降低当前优先级值，从而允许另一网关接管指定 HSRP 分组主网关角色，而配置 HSRP。


在以下输出中，`Switch-1` 被配置为跟踪连接到某个假想 WAN 路由器的接口 `GigabitEthernet5/1` 状态。在该接口状态转变为 `down` 的情形下，该网关便会将其优先级值降低 10（其为默认值）：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 track GigabitEthernet5/1
```

这一配置可通过使用 `show standby [interface]` 这条命令加以验证。这在以下输出中得以演示：


```console
VTP-Server-1#show standby vlan172
Vlan172 - Group 1
    State is Active
        5 state changes, last state change 00:33:22
    Virtual IP address is 172.16.31.254
    Active virtual MAC address is 0000.0c07.ac01
        Local virtual MAC address is 0000.0c07.ac01 (v1 default)
    Hello time 3 sec, hold time 10 sec
        Next hello sent in 1.085 secs
    Preemption enabled
    Active router is local
    Standby router is 172.16.31.2, priority 100 (expires in 7.616 sec)
    Priority 105 (configured 105)
    IP redundancy name is “hsrp-Vl172-1” (default)
    Priority tracking 1 interfaces or objects, 1 up:
    Interface or object          Decrement  State
    GigabitEthernet5/1           10         Up
```

要配置网关为将其优先级值降低 50，比如，那么 `standby [name] track [interface] [decrement value]` 这条命令便可被执行，如下输出中所示：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 track GigabitEthernet5/1 50
```

这一配置可通过使用 `show standby [interface]` 这条命令加以验证。这在以下输出中得以演示：

```console
VTP-Server-1#show standby vlan172
Vlan172 - Group 1
    State is Active
        5 state changes, last state change 00:33:22
    Virtual IP address is 172.16.31.254
    Active virtual MAC address is 0000.0c07.ac01
    Local virtual MAC address is 0000.0c07.ac01 (v1 default)
    Hello time 3 sec, hold time 10 sec
        Next hello sent in 1.085 secs
    Preemption enabled
    Active router is local
    Standby router is 172.16.31.2, priority 100 (expires in 7.616 sec)
    Priority 105 (configured 105)
    IP redundancy name is “hsrp-Vl172-1” (default)
    Priority tracking 1 interfaces or objects, 1 up:
    Interface or object          Decrement  State
    GigabitEthernet5/1           50         Up
```

## 配置 HSRP 版本

正如这一教学模组前面所指出的，默认情况下当 HSRP 启用时，版本 1 会被启用。而 HSRP 的版本 2，则可通过使用 `standby version [1/2]` 这条接口配置命令手动启用。HSRP 版本 2 的配置，在以下输出中得以演示：


```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby version 2
```

这一配置可通过使用 `show standby [interface]` 这条命令加以验证。这在以下输出中得以演示：


```console
VTP-Server-1#show standby vlan172
Vlan172 - Group 1 (version 2)
    State is Active
        5 state changes, last state change 00:43:42
    Virtual IP address is 172.16.31.254
    Active virtual MAC address is 0000.0c9f.f001
        Local virtual MAC address is 0000.0c9f.f001 (v2 default)
    Hello time 3 sec, hold time 10 sec
        Next hello sent in 2.419 secs
    Preemption enabled
    Active router is local
    Standby router is 172.16.31.2, priority 100 (expires in 4.402 sec)
    Priority 105 (configured 105)
    IP redundancy name is “hsrp-Vl172-1” (default)
```

启用 HSRP 版本 2，会自动把 HSRP 用到的 MAC 地址范围，从 `0000.0C07.ACxx` 这个范围内的某个地址，更改为 `0000.0C9F.FO00` 至 `0000.0C9F.FFFF` 范围内的一个地址。因此，重要的时要理解，这可能会在生产网络中导致一些数据包丢失，因为设备必须学习网关的新 MAC 地址。此类变更应时中建议在某个维护窗口，或计划中断窗口期间。




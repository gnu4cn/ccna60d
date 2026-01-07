# 配置 HSRP
在网关上配置 HSRP
在网关上配置 HSRP 需要以下步骤： 1. 使用 ip address [address] [mask] [secondary] interface 配置命令为网关接口配置正确的 IP 地址和掩码。2.2. 在网关接口上创建 HSRP 组，并通过 standby [number] ip [virtual address][secondary] 接口配置命令为该组分配虚拟 IP 地址。secondary] 关键字指定 IP 地址为指定组的辅助网关 IP 地址。3.可选择使用 standby [number] name [name] 接口配置命令为 HSRP 组指定名称。4.4. 如果要控制活动网关的选举，可使用 standby [number] priority [value] 接口配置命令配置组优先级。
本节下面的 HSRP 配置输出将基于下图 32.17 中的网络。



# 配置 HSRP


### 网关上 HSRP 的配置

在网关上配置 HSRP ，需要完成以下步骤：

1. 使用接口配置命令`ip address [address] [mask] [secondary]`配置网关接口的 IP 地址及掩码。

2. 通过接口配置命令`standby [number] ip [virtual address] [secondary]`, 在网关接口上建立一个 HSRP 组，以及给该 HSRP 组指派虚拟 IP 地址。关键词（ keyword ）`[secondary]`将该 IP 地址指定为指定组的次网关 IP 地址。

3. 这里作为可选项，使用接口配置命令`standby [number] name [name]`, 为 HSRP 组指派一个名称。

4. 作为可选项，如打算对活动网关的选举施加影响，就要经由接口配置命令`standby [number] priority [value]`，对组优先级进行配置。

本章中的后续 HSRP 配置输出，将建立在下图34.17中的网络：

![HSRP示例配置的拓扑](../images/3417.png)

*图 34.17 -- HSRP示例配置的拓扑*

> **注意：** 这里假定在`VTP-Server-1`与`VTP-Server-2`之间的 VLAN 与中继已有配置妥当，同时交换机之间可以经由VLAN172 `ping`通。为简短起见，这些配置已在配置示例中省略。

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

> **注意：** 这里应用到`VTP-Server-2`的 HSRP 配置并没有手动指派优先级数值。默认情况下， HSRP 将使用一个 `100` 的优先级值，以允许带有优先级值 `105` 的`VTP-Server-1`，在选举中胜选，从而被选举为该 HSRP 组的主网关。

在配置应用后，就可使用`show standby [interface brief]`命令，对 HSRP 的配置进行验证。下面的输出对`show standby brief`命令进行了展示：

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

基于此种配置，只有在`VTP-Server-1`失效时，`VTP-Server-2`才会成为活动网关。此外，因为没有配置抢占（ preemption ），那么即使在`VTP-Server-1`重新上线时，就算在该 HSRP 组中，其比起`VTP-Server-2`有着更高的优先级，它仍然无法强制性地接过活动网关角色。

### HSRP抢占的配置

**Configuring HSRP Preemption**

抢占特性令到某台网关在本身比当前活动网关有着更高优先级时，强制性地接过活动网关的角色。使用命令`standby [number] preempt`命令，来配置 HSRP 抢占特性。下面的输出，演示了在`VTP-Server-1`上的此项配置：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 preempt
```

这里同样使用命令`show standby [interface [name] |brief]`, 来验证在某个网关上已有配置抢占特性。是通过下面的`show standby brief`命令输出中的“ P ”字样演示的：

```console
VTP-Server-1#show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp Pri  P State   Active  Standby         Virtual IP
Vl172       1   105  P Active  local   172.16.31.2     172.16.31.254
```

有了这个修改，在因`VTP-Server-1`失效而导致`VTP-Server-2`接过 VLAN172 的活动网关角色时，一旦`VTP-Server-1`再度上线，其就将强制性再度接手那个角色。在配置抢占特性时，思科 IOS 软件允许指定在交换机抢占及强制重新获得活动网关角色之前的时间间隔。

默认下抢占是立即发生的。但可使用接口配置命令`standby [number] preempt delay [minimum|reload|sync]`对此时间间隔进行修改。关键字`[minimum]`用于指定在抢占前等待的最短时间（秒）。下面的输出展示了如何配置在抢占前等待 30 秒钟：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 preempt delay minimum 30
```

此配置可使用命令`show standby [interface]`进行验证。下面的输出对此进行了演示：

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

而关键字`[reload]`用于指定网关在其重启后需要等待的时间（the `[reload]` keyword is used to specify the amount of time the gateway should wait after it initiates following a reload）。关键字`[sync]`是与 IP 冗余客户端配合使用的。此配置超出了 CCNA 考试要求，但在生产环境中是十分有用的，因为在出现某个正在被跟踪的抖动接口，或类似情况下，此配置可以阻止不必要的角色切换（this configuration is beyond the scope of the CCNA exam requirements but is very useful in production environments because it prevents an unnecessary change of roles in the case of a flapping interface that is being tracked, or similar activity）。

### 配置 HSRP 接口跟踪

HSRP接口跟踪特性，令到管理员可以将 HSRP 配置为追踪接口状态，从而将当前优先级降低一个默认数值（ 10 ）或指定数值，以允许另一网关接过指定 HSRP 组的主网关角色。

在下面的输出中，`VTP-Server-1`被配置为对连接到假想 WAN 路由器的接口`Gigabitethernet5/1`的状态，进行跟踪。在那个接口状态转变为`down`时，该网关就将其优先级值降低 10 （默认的）:

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

而要将该网关降低值配置为比如50, 就可以执行命令`standby [name] track [interface] [decrement value]`, 如下面的输出所示：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby 1 track GigabitEthernet5/1 50
```

此项配置可使用命令`show standby [interface]`进行验证。下面对此进行了演示：

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

### 配置 HSRP 的版本

如同在本课程模块先前指出的那样，默认当 HSRP 开启时，是启用的版本 1 。但可通过接口配置命令`standby version [1|2]`来手动开启 HSRP 版本 2 。下面的输出演示了 HSRP 版本 2 的配置：

```console
VTP-Server-1(config)#interface vlan172
VTP-Server-1(config-if)#standby version 2
```

使用命令`show standby [interface]`，可对此配置进行验证。下面的输出对此进行了演示：

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

而 HSRP 的开启，就自动将 HSRP 所使用的 MAC 地址范围，从`0000.0C07.ACxx`，改变为`0000.0C9F。F000`到`0000.0C9F.FFFF`。因此务必要记住这将导致生产网络中的一些数据包丢失，因为网络中的设备必须要掌握到网关的新 MAC 地址。这类导致包丢失的变动，都推荐在维护窗口或几乎的断网窗口来进行。



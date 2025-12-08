# 交换机初始配置

咱们将经由控制台端口连接到一台新交换机，与连接任何新路由器一样，因为要通过 Telnet 或 SSH（稍后会对这两种方式有更多内容）连接，咱们将需要在交换机上有一两行的配置。交换机的许多初始配置命令，与路由器的初始配置命令相同。

在咱们首次连接的任何设备上，都值得执行一次 `show version` 命令（见下面的输出）。在考试中，咱们还要知道哪条 `show` 命令会提供到哪些信息。

`show version` 命令提供了许多有用的信息，包括：

- 交换机开机时间
- 型号
- 操作系统版本
- 上次重新加载原因
- 接口及类型
- 已安装内存
- 背板 MAC 地址

```console
Switch>en
Switch#show version
Cisco IOS Software, C2960 Software (C2960-LANBASE-M), Version 12.2(25)FX, RELEASE
SOFTWARE (fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 12-Oct-05 22:05 by pt_team

ROM: C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)

System returned to ROM by power-on

Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.
24 FastEthernet/IEEE 802.3 interface(s)
2 GigabitEthernet/IEEE 802.3 interface(s)

63488K bytes of flash-simulated non-volatile configuration memory.
Base Ethernet MAC Address___________: 0090.2148.1456
Motherboard assembly number         : 73-9832-06
Power supply part number            : 341-0097-02
Motherboard serial number           : FOC103248MJ
Power supply serial number          : DCA102133JA
Model revision number               : B0
Motherboard revision number         : C0
Model number                        : WS-C2960-24TT
System serial number                : FOC1033Z1EY
Top Assembly Part Number            : 800-26671-02
Top Assembly Revision Number        : B0
Version ID                          : V02
CLEI Code Number                    : COM3K00BRA
Hardware Board Revision Number      : 0x01

Switch  Ports   Model           SW Version  SW Image
------  -----   -----           ----------  ---------------
*   1   26      WS-C2960-24TT   12.2        C2960-LANBASE-M

Configuration register is 0xF
```

我（作者）知道我们还尚未涉及到 VLAN，但现在请将 VLAN 视为一个逻辑上的局域网，其中设备物理上可位于网络上的任何位置，但就他们而言，他们都被直连到同一个交换机。在下面的配置中，默认情况下，交换机上的所有端口都位于 `VLAN 1` 中。

```console
Switch#show vlan
VLAN    Name        Status      Ports
----    -------     ------      ------------------------------
1       default     active      Fa0/1, Fa0/2, Fa0/3, Fa0/4,
                                Fa0/5, Fa0/6, Fa0/7, Fa0/8,
                                Fa0/9, Fa0/10, Fa0/11, Fa0/12,
                                Fa0/13, Fa0/14, Fa0/15, Fa0/16,
                                Fa0/17, Fa0/18, Fa0/19, Fa0/20,
                                Fa0/21, Fa0/22, Fa0/23, Fa0/24,
```

当咱们打算将某个 IP 地址添加到交换机，以便透过网络连接到他时（称为管理地址），咱们只要将一个 IP 地址添加到 VLAN；在这个实例下，其将是 `VLAN 1`。

```console
Switch#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch(config)#interface vlan1
Switch(config-if)#ip add 192.168.1.3 255.255.255.0
Switch(config-if)#  ← hold down Ctrl+Z keys now
Switch#show interface vlan1
Vlan1 is administratively down, line protocol is down
  Hardware is CPU Interface, address is 0010.1127.2388 (bia 0010.1127.2388)
  Internet address is 192.168.1.3/24
```

`Vlan1` 默认是关闭的，因此咱们必须执行 `no shut` 命令打开他。由于二层交换机不具备路由表的能力，因此咱们还应该告诉交换机，将所有 IP 流量发往何处；这在下面的输出得以演示。

```console
Switch#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Switch(config)#ip default-gateway 192.168.1.1
Switch(config)#
```

当咱们在咱们网络上有多台交换机时，咱们将希望更改咱们交换机的默认主机名，从而在其被远程连接时，可被更容易识别（见下面的配置行）。设想在尝试在一个远端 Telnet 连接中，对五台主机名都是 `"Switch"` 的交换机故障排除。

```console
Switch(config)#hostname Switch1
```

当咱们想要通过网络 Telnet（或 SSH）到某台交换机时，咱们还将需要启用这一协议。到交换机的远程访问默认是禁用的。

```console
Switch1#conf t
Enter configuration commands, one per line.
Switch1(config)#line vty 0 15
Switch1(config-line)#password cisco
Switch1(config-line)#login
```
请将上面的命令添加到交换机，然后从另一台设备（同一子网上的）连接到交换机，测试咱们的配置。这是个基本的 CCNA 主题。

所谓 VTY，是路由器或交换机上用于 Telnet 或安全 Telnet (SSH) 访问的一些虚拟端口。在咱们为 VTY 线路配置某种身份验证方法（最简单方法是为将一个口令及 `login` 命令添加到他们）前，他们是关闭的。咱们通常会看到端口 0 至 4（包括 0 和 4），或 0 到 15。了解咱们有多少个可用端口的一种方法，是在数字 0 后面输入问号，或使用 `show line` 命令，如下输出中所示。

```console
Router(config)#line vty 0 ?
  <1-15>  Last Line number
Router#show line
    Tty Typ Tx/Rx       A Modem Roty    AccO    AccI    Uses    Noise   Overruns    Int
*   0   CTY             -   -   -       -       -       0       0       0/0
    1   AUX 9600/9600   -   -   -       -       -       0       0       0/0         *
    2   VTY             -   -   -       -       -       2       0       0/0
    3   VTY             -   -   -       -       -       0       0       0/0
    4   VTY             -   -   -       -       -       0       0       0/0
    5   VTY             -   -   -       -       -       0       0       0/0
    6   VTY             -   -   -       -       -       0       0       0/0
```

CTY 便是控制台线路。VTY 的线路用于 Telnet 连接，而 AUX 为辅助端口。

要获得更安全的访问方法，咱们可只允许 SSH 连入交换机，SSH 意味着流量将被加密。如下输出所示，为使 SSH 工作，咱们将需要交换机上的安全镜像。

```console
Switch1(config-line)#transport input ssh
```


现在，Telnet 流量将不被允许连入 `vty` 端口。

请在交换机上配置全部这些命令。仅仅阅读这些命令，将不会帮助咱们在考试日回忆起他们！




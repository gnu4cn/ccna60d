# 连接到路由器

第一次连接路由器或交换机时，您可能会觉得有点困难。我们在上文介绍了控制台连接，因此连接电缆后，你需要在个人电脑或笔记本电脑上使用终端仿真程序。这样你就可以看到路由器的输出，并键入配置命令。

The first time you connect to a router or a switch, it can seem a little daunting. We have covered console connections above, so once you connect the cable, you will need to use a terminal emulation program on your PC or laptop. This will allow you to see router output and type in the configuration commands.

这是你头一次连接到一台路由器或交换机，看起来有些艰巨吧。前面的内容已经讲到了控制台连接了，所以在连上串行线后，你的 PC 或笔电就需要一个终端模拟程序了。有了这些，你就可以查看路由器的输出并敲入那些配置命令了。

超级终端（HyperTerminal）作为默认程序已经用了很多年了，在完成灾难备份时，你可能仍需要这个程序；但是你可以选择 PuTTY 这个广泛使用的程序。从 [www.putty.org](http://www.putty.org/) 可以下载到他。老式的 PC 上的 COM 端口连接总是会用到标为 COM1 或 COM2 的逻辑端口。PuTTY 中有一个有关逻辑端口的设置，我们实际上叫这个是一条串行连接（a serial connection）。如图 1.37 所示。

!["PuTTY 使用 COM 端口得到串行访问"](../images/47.png)

*图 1.37 -- PuTTY 使用 COM 端口得到串行访问*

如你使用的是 USB 到翻转线（USB-to-rollover）转换器，那么你会收到一张包含其驱动程序的安装光盘，在安装好驱动程序后，你将得到一个可以使用的 COM 端口。如你使用的是 Windows 系统，在设备管理器中你会发现这个端口。如图 1.38 所示。

!["驱动程序将 COM4 作为控制台连接的端口"](../images/48.png)

*图 1.38 -- 驱动程序将 COM4 作为控制台连接的端口*

在使用超级终端时，你还要选择一些连接参数，比如波特率等。你需要做如下选择，如图 1.39 所示。

- 每秒位数，Bits per second: 9600
- 数据位数，Data bits：默认值 8
- 校验，Parity: 无/None
- 停止位，Stop bits: 默认值 1
- 流控, Flow control: 必须是 无/None

!["超级终端连接参数设置"](../images/49.png)

*图 1.39 -- 超级终端连接参数设置*

在开启路由器时，如你已经选择了正确的 COM 端口，并将翻转线插入到路由器的控制台端口，你将看到路由器的启动文字（见图 1.40）。如你不能看到任何文本，那么敲几下回车键并在此检查一下你的设置。

如路由器没有在他的 NVRAM 中找到启动配置文件（a startup configuration file）时, 或者路由器的配置寄存器（the configuration register）被设置为  0x2142 而忽略启动配置文件时，路由器会询问你是否要进入**初始设置模式(Initial Configuration mode)**。请输入 “n” 或 “no”， 输入 “yes” 会进入配置模式（setup mode）, 你是不会想要进入到这个模式的。

```
Would you like to enter the initial configuration dialog?
[yes/no]:
% Please answer ‘yes’ or ‘no’.
Would you like to enter the initial configuration dialog?
[yes/no]: no
Press RETURN to get started!
Router>
```

在另一个型号的路由器上，你会看到下面的输出：

```
Technical Support: www.cisco.com/techsupport
Copyright (c) 1986-2007 by Cisco Systems, Inc.
Compiled Wed 18-Jul-07 04:52 by pt_team
        --- System Configuration Dialog ---
Continue with configuration dialog? [yes/no]: no
Press RETURN to get started!
Router>
```

### 路由器的各种模式，Routers Modes

为通过 CCNA 考试，你需要理解在完成各种操作时，需要进入的不同路由器模式提示符。而不管你要执行何种功能，首先你要是在正确的模式下（有不同的提示符来区分）。新手在配置路由器的过程中遇到找不到正确命令来使用的问题时，他们犯的最大错误往往就在这里。请一定要确定你在正确的模式下！

**用户模式，User Mode**

在路由器启动后，第一个展现在你面前的叫用户模式（User Mode）或者用户执行模式（User Exec Mode）。用户模式下只有很小的一套命令可供使用，但在查找基本的路由器元素上是有用的。路由器默认名称是“Router”, 后面你会看到该名称可以修改。

`Router>`

**特权模式，Privileged Mode**

在用户模式下输入 `enable` 命令，就带你进入了下一模式，叫做特权模式或特权执行模式（Priviledged Exec mode）。输入 `disable` 命令退回到用户模式。而要退出整个会话，输入 `logout` 或者 `exit`。

```console
Router>enable
Router#
Router#disable
Router>
```

在查看路由器的整个配置、路由器的运行统计数据，以致路由器插入了哪些模组时，特权模式是有用的。在此提示符下，你会输入 `show` 命令，和用于调试的 `debug` 命令。

**全局配置模式，Global Configuration Mode**

为了真正配置路由器，你需要进入全局配置模式。在特权运行模式下，输入 `configure terminal` 命令， 或其简短版本 `config t` 来进入此模式。此外，仅输入 `config` 时，路由器会询问你要进入何种模式。terminal 是模式的（默认选项会被中括号括起来）。如你按下了回车键，就会接受中括号里的命令。

```console
Router#config
Configuring from terminal, memory, or network[terminal]? ← press Enter
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#
```

**接口配置模式，Interface Configuration Mode**

接口模式下，可以输入路由器接口，如快速以太网、串行接口等，的命令。在一台全新的路由器上，默认所有接口都是关闭的，没有任何配置。

```console
Router>enable
Router#config t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#interface Serial0
Router(config-if)#
```

> show ip interface brief 命令可以查看到路由器有哪些接口。你的串行接口可能不是 Serial0。

**线路配置模式，Line Configuration Mode**

线路配置模式用来对控制台、Telnet 或者辅助端口（auxiliary ports）进行改变。你可以控制哪些人可以通过这些端口访问到路由器，以及在这些端口上部署口令或者**“访问控制列表（access control lists）”这种安全特性**。

```console
Router#config t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#line console 0
Router(config-line)#
```

你还可以在此模式下设置波特率、执行级别（exec levels）等参数。

**路由器配置模式，Router Configuration Mode**

为了给路由器配置一种路由协议，以便他能够建立起网络图（build a picture of the network）, 你需要用到路由器配置模式。

```console
Router#config t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#router rip
Router(config-router)#
```

**虚拟局域网配置模式，VLAN Configuration Mode**

此种模式实际上是属于交换机的，但既然我们在此讨论不同模式，所以也有必要提一下。本书的交换机实验中，你会用到很多这种模式。

```console
Switch#conf t
Enter configuration commands, one per line.
Switch(config)#vlan 10
Switch(config-vlan)#
```

在具备以太网交换机卡的路由器上，会使用虚拟局域网数据库配置模式（VLAN Database Configuration mode，该模式在交换机上已被废除），其与 VLAN 配置模式是相似的。

```console
Router#vlan database
Router(vlan)#vlan 10
VLAN 10 added:
    Name: VLAN0010
Router(vlan)#exit
APPLY completed.
Exiting....
Router#
```

### 配置一台路由器，Configuring a Router

路由器是没有菜单的，你也不能用鼠标在不同模式之间切换，这些都是经由命令行界面(command line interface, CLI)完成的。有些上下文敏感（context-sensitive）的帮助信息以 [?] 关键字形式给出。在路由器提示符处输入问号，所有可用的命令都将显示出来。

```console
Router#?
Exec commands:
access-enable           Create a temporary Access-List entry
access-profile          Apply user-profile to interface
access-template         Create a temporary Access-List entry
alps                    ALPS exec commands
archive                 manage archive files
bfe                     For manual emergency modes setting
cd                      Change current directory
clear                   Reset functions
clock                   Manage the system clock
cns                     CNS subsystem
configure               Enter configuration mode
connect                 Open a terminal connection
copy                    Copy from one file to another
debug                   Debugging functions (see also ‘undebug’)
delete                  Delete a file
dir                     List files on a directory
disable                 Turn off privileged commands
disconnect connection   Disconnect an existing network
enable                  Turn on privileged commands
erase                   Erase a file
exit                    Exit from the EXEC mode
help                    Description of the interactive help system
-- More –
```

如果有多于屏幕能显示的信息，你将看到 `--More--` 栏。按空格键来查看下一页。按 `Ctrl+Z`或者`Q`回到提示符。

此外，如你已经开始输入一个命令，却忘记了该命令的剩下部分，输入`?`系统就会给出一个可用的命令清单。`?`在 CCNA 考试中是可用的，但如你用了问号，说明你就没有认真完成本书的那些实验:)

```console
Router#cl?
clear clock
```

按 `Tab` 键有命令补全功能。

```console
Router#copy ru
← press the Tab key here
Router#copy running-config
```

路由器有好几个可供选择的模式。这是为了避免对不打算修改的路由器配置部分造成不必要改变而设置的。看一下提示符就知道你当前所处哪个模式。比如你打算对某个快速以太网接口做一些改变，你需要在接口配置模式下来完成。

首先，进入全局配置模式：

```console
Router#config t
Router(config)#
```

接着，告诉路由器你要配置哪个接口：

```console
Router(config)#interface FastEthernet0
Router(config-if)#exit
Router(config)#
```

如你不确定采用何种方式输入接口编号，就使用 [?] 关键字。无需担心你所看到的所有选项。大多数人都只会用到快速以太网、串行接口及环回接口（Loopback interfaces）。

```console
Router(config)#interface ?
Async               Async interface
BRI                 ISDN Basic Rate Interface
BVI                 Bridge-Group Virtual Interface
CTunnel             CTunnel interface
Dialer              Dialer interface
FastEthernet        IEEE 802.3u
Group-Async         Async Group interface
Lex                 Lex interface
Loopback            Loopback interface
Multilink           Multilink-group interface
Null                Null interface
Serial              Serial interface
Tunnel              Tunnel interface
Vif                 PGM Multicast Host interface
Virtual-Template    Virtual Template interface
Virtual-TokenRing   Virtual TokenRing interface
range               interface range command

Router(config)#interface FastEthernet?
<0-0> FastEthernet interface number
Router(config)#interface FastEthernet0
```

最终，路由器进入到了接口配置模式。

```console
Router(config-if)#
```

在这里，你可以为接口配置上 IP 地址，设置其带宽，部署一条访问控制清单，以及完成很多其他事项。你的路由器或交换机可能会与我（作者）的有不同的接口编号，所以请使用 `?` 或 `show ip interface brief` 命令去查看你的选项。

输入 `exit` 命令从某个配置模式中退出。这会将你带回到其第二高的级别(the next-highest level)。而要从任何的配置模式中退出，按下 `Ctrl+Z` 或输入 `end` 命令就可以了。

```console
Router(config-if)#exit
Router(config)#
```

或是 `Ctrl+Z` 的办法。

```console
Router(config-if)#^z
Router#
```

**环回接口，Loopback Interfaces**

CCNA 大纲通常不会涉及环回接口的知识点，但不管在工作中，还是在操作实验中，都是有用的。环回接口是你配置得来的虚拟或逻辑接口（a virtual or logical interface）, 而不是物理存在的（所以你不会在路由器的面板上见到环回接口）。你可以往这类接口上执行 ping 操作，而无需在实验用有设备连接到路由器的快速以太网接口上。

使用环回接口的一大好处在于随路由器的运行，他们总是保持开启的，因为他们是逻辑的，意味着他们绝不会宕下去（go down）。而又由于他们是虚拟的，所以你不可以将网线插到他们上面。

```console
Router#config t
Router#(config)#interface Loopback0
Router#(config-if)#ip address 192.168.20.1 255.255.255.0
Router#(config-if)#^z ← press Ctrl+Z
Router#
Router#show ip interface brief
Interface   IP-Address      OK?     Method  Status  Protocol
Loopback0   192.168.20.1    YES     manual  up      up
```

此命令的输出将显示出你的路由器的所有可用接口的信息。

> 真实世界：可以在接口配置模式下输入 shutdown 命令来关掉一个环回接口。

务必要给环回接口一个有效的 IP 地址。可以**用于那些路由协议** 或者**测试路由器是否允许某些流量通过**。本课程中会大量使用到环回接口。

**编辑命令，Editting Commands**

与其将已输入的整行命令全部删除，你可以对其进行编辑。下面这些键盘输入可以将光标移至该行命令的任意位置。


| **键盘输入，Keystroke** | **用途，Meaning** |
| -- | -- |
| `Ctrl+A` | 将光标移至命令行开头 |
| `Ctrl+E` | 将光标移至命令行末尾 |
| `Ctrl+B` | 将光标移往后移动一个字符 |
| `Ctrl+F` | 将光标移往前移动一个字符 |
| `Esc+B` | 将光标往前移动一个词 |
| `Esc+F` | 将光标往后移动一个词 |
| `Ctrl+P` 或向上箭头 | 翻出上一条命令 |
| `Ctrl+N` 或向下箭头 | 翻出下一条命令 |
| `Ctrl+U` | 删除这条命令 |
| `Ctrl+W` | 删除一个词 |
| `Tab` | 补全命令 |
| `show history` | 默认情况下，显示前 10 条命令 |
| 退格按键，`Backspace` | 删除一个字符 |

**考试中出一道有关这些编辑命令的题目是很常见的。**

**配置一个路由器接口，Configuring a Router Interface**

基于其以下两个因素，路由器接口可以分为几种。

- 所采用的技术（比如，以太网）
- 接口之带宽

在现代企业网络中使用到的常见路由器及交换机接口带宽有：

- `100Mbps`（通常叫做快速以太网，`FastEthernet`）
- `1Gbps` (通常叫做千兆以太网，`GigabitEthernet`)
- `10Gbps` (通常叫做万兆以太网，`TenGigabitEthernet`)

为定位到（address）一个指定的路由器接口并进入到接口配置模式以设置其特定参数，你必须知道接口命名法。在不同路由器生产商之间，其接口命名法会有不同，但接口命名法通常由两部分组成：

- 接口类型（`Ethernet`, `FastEthernet` 等）
- 接口插槽/模组以及端口号

比如，常见的接口命名法有以下这些：

- `Ethernet1/0` (第 `1` 号插槽，第 `0` 号端口)
- `FastEthernet0/3` ( 第 `0` 号插槽，第 `3` 号端口)
- `GigabitEthernet0/1/1` (第 `0` 号模组， 第 `1` 号插槽， 第 `1` 好端口)

> **注意**: 第 `0` 号插槽通常表示那些内建的端口，而其他插槽则表示那些可以随时添加上去的拓展插槽。插槽和端口的编号通常是从 `0` 开始的。

在进行配置时，**为令到路由器具有基本的那些功能，你务必要配置以下参数**：

- 速率，Speed
- 双工，Duplex
- IP 地址，IP address

你可以将这三个参数作为一台路由器的典型配置，因为他们常用在现代企业网络中。要查看所有可用的接口及其当前状态，你可以执行以下命令。

```console
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status                  Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
```

从以上输出可以看出，该路由器在插槽 `0` 上有两个快速以太网接口（`FastEthernet`, `100Mbps`），都没有配置过（也就是，没有 IP 地址）且是管理性关闭的（也就是，状态为：`adminitrively down`）。

在开始配置接口参数前，你必须要在思科设备上使用命令 `configure terminal` 进入路由器的配置模式, 在使用命令 `interface <interface name>` 进入到接口配置模式。接口配置过程的第一步是开启该接口。比如，使用 `no shutdown` 命令可以开启接口 `FastEthernet0/0` :

```console
Router#configure terminal
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#interface FastEthernet0/0
Router(config-if)#no shutdown
Router(config-if)#no shutdown
Router(config-if)#
*Mar 1 00:32:05.199: %LINK-3-UPDOWN: Interface FastEthernet0/0, changed state to up
*Mar 1 00:32:06.199: %LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0, changed state to up
```

接着的配置步骤涉及到配置速率以及双工设置，前面我们已经看到了。

**给接口配置一个 IP 地址，Configuring an IP Address on an Interface**

> 为让路由器与其他设备实现通信，他需要在连接的接口上有一个 IP 地址。配置一个 IP 地址是相当直接的，你还是要记住，在此之前需要进入接口配置模式。

先不要担心到哪里去找到 IP 地址，我们后面会解决这个问题。

```console
Router>enable   ← takes you from User mode to Privileged mode
Router#config t ← from Privileged mode to Configuration mode
Router(config)#interface Serial0    ← and then into Interface Configuration mode
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#no shutdown   ← the interface is opened for traffic
Router(config-if)#exit    ← you could also hold down the Ctrl+Z keys together to exit
Router(config)#exit
Router#
```

如下面的输出那样，可以为该接口加入一些描述信息。

```console
RouterA(config)#interface Serial0
RouterA(config-if)#description To_Headquarters
RouterA(config-if)#^Z   ← press Ctrl+Z to exit
```

在完成路由器的接口配置后，于思科路由器上，你可以使用以下命令，通过检查完整的接配置参数来验证其设置：

```console
RouterA#show interface Serial0
Serial0 is up, line protocol is up
Hardware is HD64570
Description: To_Headquarters
Internet address is 12.0.0.2/24
MTU 1500 bytes, BW 1544 Kbit, DLY 20000 usec,
reliability 255/255, txload 1/255, rxload 1/255
Encapsulation HDLC, loopback not set
Keepalive set (10 sec)
Last input 00:00:02, output 00:00:03, output hang never
[Output restricted...]
```

**`show` 命令，Show commands**

通过在特权模式（`priviledged mode`）下使用 `show x` 命令, 你可以十分简单地茶看到路由器的绝大部分设置项，其中的 `x` 是下一条命令，`x`的选择有以下这些：

```console
Router#show ?
access-expression   List access expression
access-lists        List access lists
accounting          Accounting data for active sessions
adjacency           Adjacent nodes
aliases             Display alias commands
alps                Alps information
apollo              Apollo network information
appletalk           AppleTalk information
arap                Show AppleTalk Remote Access statistics
arp                 ARP table
async               Information on terminal lines used as router interfaces
backup              Backup status
bridge              Bridge Forwarding/Filtering Database [verbose]
bsc                 BSC interface information
bstun               BSTUN interface information
buffers             Buffer pool statistics
cca                 CCA information
cdapi               CDAPI informationcdp CDP information
cef                 Cisco Express Forwarding
class-map           Show QoS Class Map
clns                CLNS network information
--More--
```

下面列出了一些常用的 `show` 命令及其意义，连同两个实例。

| Show 命令 | 结果 |
| -- | -- |
| `show running-configuration` | 显示 DRAM 中的配置 |
| `show startup-configuration` | 显示 NVRAM 中的配置 |
| `show flash` | 显示闪存中的 IOS |
| `show ip interface brief` | 显示所有接口的简要信息 |
| `show interface Serial0` | 显示串行接口的统计信息 |
| `show history` | 显示输入的前 10 条命令 |

```console
Router#show ip interface brief
Interface   Address     OK? Method  Status                  Protocol
Ethernet0   10.0.0.1    YES manual  up                      up
Ethernet1   unassigned  YES unset   administratively down   down
Loopback0   172.16.1.1  YES manual  up                      up
Serial0     192.168.1.1 YES manual  down                    down
Serial1     unassigned  YES unset   administratively down   down
```

其中的 `method` 标签表明地址指定的方式。可以是 `unset`，`manual`, `NVRAM`, `IPCP` 或者 `DHCP`。

路由器能够检索（`recall`）出先前于路由器提示符处输入的一些命令 -- 默认 `10` 条，方法是使用向上箭头。使用这个特性能够让你无再次输入长命令行，从而节省大量时间和精力。`show history` 命令显示前 `10` 条命令的缓冲区。

```console
Router#show history
show ip interface brief
show history
show version
show flash:
conf t
show access-lists
show process cpu
show buffers
show logging
show memory
```

通过命令 `terminal history size` 命令来增大历史命令缓冲区（the history buffer）:

```console
Router#terminal history ?
size Set history buffer size
<cr>
Router#terminal history size ?
<0-256> Size of history buffer
Router#terminal history size 20
```

**验证基础路由器配置及网络连通性，Verifying Basic Router Configuration and Network Connectivity**

下面的内容解释了一些最为有用的验证基础路由器配置的命令。

**版本查看，Show Version**

`show version` 命令提供了那些可以说是验证大多数路由器操作的起点的有用信息。包括：

- 路由器的种类（`show inventory` 是另一个列出路由器硬件信息的有用命令）
- IOS 的版本
- 内存容量
- 内存使用情况
- CPU 类型
- 闪存容量
- 其他硬件参数
- 上次重启原因

这里有一个 `show version` 命令的缩短了的输出。请自己动手输入这个命令。

```console
Router#show version
Cisco 1841 (revision 5.0) with 114688K/16384K bytes of memory.
Processor board ID FTX0947Z18E
M860 processor: part number 0, mask 49
2 FastEthernet/IEEE 802.3 interface(s)
2 Low-speed Serial(sync/async) network interface(s)
191K bytes of NVRAM.
63488K bytes of ATA CompactFlash (Read/Write)

Configuration register is 0x2102
```

**Show Running-config**

`show running-config` 命令提供了路由器的完整配置，用于验证设备已被配置了恰当特性。因为其输出太过宽泛，这里就不给出来了。

**Show IP Interface Brief**

在前一部分提到的 `show ip interface brief` 命令，列出了路由器的接口以及他们的状态，包括以下项目：

- 接口的名称及编号
- IP 地址
- 链路状态
- 协议状态

```console
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status              Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
Serial0/0/0     unassigned  YES unset   administratively down   down
Serial0/1/0     unassigned  YES unset   administratively down   down
Vlan1           unassigned  YES unset   administratively down   down
Router#
```

**Show IP Route**

`show ip route` 命令提供了有关设备路由能力的更深层次信息。他列出路由器所能到达的所有网络及到达这些网络的路径的信息，包括这些项目：

- 网络
- 路由协议
- 下一跳
- 外出接口

```console
R1#show ip route
Codes:  C - connected, S - static, R - RIP, M - mobile, B - BGP
        D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter
        area, N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external
        type 2, E1 - OSPF external type 1, E2 - OSPF external type 2,
        i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS
        inter area, * - candidate default, U - per-user static route,
        o – ODR, P - periodic downloaded static route
Gateway of last resort is not set
R       80.1.1.0/24 [120/1] via 10.1.1.2, 00:00:04, Ethernet0/0.1
D       80.0.0.0/8 [90/281600] via 10.1.1.2, 00:02:02, Ethernet0/0.1
O E2    80.1.0.0/16 [110/20] via 10.1.1.2, 00:00:14, Ethernet0/0.1
```

除了上面的这些 `show` 命令外，还有一些用于验证路由器连通性的命令，比如 `ping` 和 `traceroute` 命令。

**Ping 命令**

`ping` 命令提供了一种到特定目标的基本连特性测试。这种方式用以测试路由器能否到达一个网络。Ping 使用 ICMP, 通过往一台机器发送 echo 请求方式来验证这台机器是否在运行。如果那台机器是在运行，他就会发出一个 ICMP 的 echo 回应消息给源机器，以确认他的可用性。一个 `ping` 的样例如下所示。

```console
Router#ping 10.10.10.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.10.10.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 20/40/76 ms
```

标准的 `ping` 命令发出 `5` 个到目标的 ICMP 数据包。而 `ping` 输出中，点（`.`）表示失败，叹号（`!`）表示成功收到数据包。`ping` 命令的输出还给出了到目标网络的往返时间（the round-trip time）, 有最小时间、平均时间以及最大时间。

如你需要调整 `ping` 相关的参数，你可在思科路由器上执行扩展的 `ping` 命令。通过在控制台处输入 `ping` 并按下回车键来执行。路由器就会通过一个交互式菜单进行提示，你就可以指定包含以下的这些参数了。

- ICMP 数据包的个数
- 包的大小
- 超时量
- 源接口
- 服务类型


```console
Router#ping
Protocol [ip]:
Target IP address: 10.10.10.2
Repeat count [5]:
Datagram size [100]:
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: FastEthernet0/0
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]:
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.10.10.2, timeout is 2 seconds:
Packet sent with a source address of 10.10.10.1
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 20/36/72 ms
```

**Traceroute 命令**

`traceroute` 命令是另一个用于查看数据包在到达其目的地前所经过的跳数。下面的输出表示数据包在到达其目标前必须经过一跳。

```console
R2#traceroute 192.168.1.1
Type escape sequence to abort.
Tracing the route to 192.168.1.1
    1 10.10.10.1 60 msec *  64 msec
```

跟 `ping` 一样，思科路由器也允许你执行扩展的 `traceroute` 命令，搭配一些相关参数，而这些参数大多与 `ping` 相关的参数一样。

```console
Router#traceroute
Protocol [ip]:
Target IP address: 192.168.1.1
Source address: 10.10.10.2
Numeric display [n]:
Timeout in seconds [3]:
Probe count [3]:
Minimum Time to Live [1]:
Maximum Time to Live [30]:
Port Number [33434]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Type escape sequence to abort.
Tracing the route to 192.168.1.1
    1 10.10.10.1 76 msec *  56 msec
```

## 第一天的问题

### OSI/TCP 模型的问题 OSI/TCP Model Questions

1. Name each layer of the OSI model, from Layer 7 down to Layer 1.
2. The role of the Session Layer is to `_______`, `_______`, and `_______` sessions or dialogues between devices.
3. What are the three methods used to control data flow at Layer 4?
4. The Transport Layer includes several protocols, and the most widely known are `_______` and `_______`.
5. Why is UDP used at all if TCP/IP offers guaranteed delivery?
6. What is data referred to at each OSI layer?
7. In order to interface with the upper and lower levels, the Data Link Layer is further subdivided into which two Sublayers?
8. What are the five TCP/IP layers from the top down?
9. How does the TCP/IP model map to the OSI model?
10. Layer 2 addresses are also referred to as `_______` addresses.
11. Using a switch will allow you to divide your network into smaller, more manageable sections known as `_______` `_______`.

### 线缆的问题 Cable Questions

1. The current standard Ethernet cable still uses eight wires twisted into pairs to prevent `_______` `_______` and `_______`.
2. `_______` is when a signal from one Ethernet wire spills over into a neighbouring cable.
3. Which command would set the FastEthernet router interface speed to 10Mbps?
4. On a crossover cable, the wire on pin 1 on one end needs to connect to pin `_______` on the other end and pin 2 needs to connect to pin `_______`.
5. Which cable would you use to connect a router Ethernet interface to a PC?
6. You can see a summary of which interfaces you have on your router with the show `_______` `_______` `_______` command.
7. Line Configuration mode lets you configure which ports?
8. A Loopback interface is a `_______` or `_______` interface that you configure.
9. The keyboard shortcut Ctrl+A does what?
10. The `_______` keyboard shortcut moves the cursor back one word.
11. By default, the `_______` `_______` command shows the last 10 commands entered.

## 第一天的答案

### OSI/TCP 模型答案
1. Application, Presentation, Session, Transport, Network, Data Link, and Physical.
2. Set up, manage, and terminate.
3. Flow control, windowing, and acknowledgements.
4. TCP and UDP.
5. TCP uses a lot of bandwidth on the network and there is a lot of traffic sent back and forth to set up the connection, even before the data is sent. This all takes up valuable time and network resources. UDP packets are a lot smaller than TCP packets and they are very useful if a really reliable connection is not that necessary. Protocols that use UDP include DNS and TFTP.
6. Bits (Layer 1), Frames (Layer 2), Packets (Layer 3), Segments (Layer 4) and Data (Layers 5-7).
7. LLC and MAC.
8. Application, Transport, Network, Data Link, and Network.

9.

![](../images/q-0.png)

10. MAC.
11. Collision domains.

### 线缆答案 Cable Answers

1. Electromagnetic interference (EMI) and crosstalk.
2. Crosstalk.
3. The `speed 10` command.
4. 3 and 6.
5. A crossover cable.
6. `ip interface brief` .
7. The console, Telnet, and auxiliary ports.
8. Virtual or logical.
9. Moves the cursor to the beginning of the command line.
10. Esc+B.
11. `show history` .


## 第一天的实验 Day 1 Lab

### IOS 命令导航实验 IOS Command Navigation Lab

**拓扑，Topology**

![](../images/l-0.png)

**实验目的，Purpose**

学习如何通过控制台接口连接到一台路由器，以及尝试一些命令。

**步骤，Walkthrough**

1. 使用一条控制台线缆，和 PuTTY 程序（可免费在线获取，请搜索“PuTTY”）, 连接到一台路由器的控制台端口。
2. 在 `Router>` 提示符处，输入下面的这些命令，探寻不同的路由器模式和命令。如你遇到询问进入配置模式，输入 `no` 并按下回车键。

```
Cisco IOS Software, 1841 Software (C1841-ADVIPSERVICESK9-M), Version 12.4(15)T1, RELEASE
SOFTWARE (fc2)
Technical Support: www.cisco.com/techsupport
Copyright (c) 1986-2007 by Cisco Systems, Inc.
Compiled Wed 18-Jul-07 04:52 by pt_team
        --- System Configuration Dialog ---
Continue with configuration dialog? [yes/no]:no
Press RETURN to get started!
Router>enable
Router#show version
Cisco 1841 (revision 5.0) with 114688K/16384K bytes of memory.
Processor board ID FTX0947Z18E
M860 processor: part number 0, mask 49
2 FastEthernet/IEEE 802.3 interface(s)
2 Low-speed Serial(sync/async) network interface(s)
191K bytes of NVRAM.
63488K bytes of ATA CompactFlash (Read/Write)
Configuration register is 0x2102
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status              Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
Serial0/0/0     unassigned  YES unset   administratively down   down
Serial0/1/0     unassigned  YES unset   administratively down   down
Vlan1           unassigned  YES unset   administratively down   down
Router#
Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#interface Serial0/1/0  ← put your serial # here
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#interface Loopback0
Router(config-if)#ip address 10.1.1.1 255.0.0.0
Router(config-if)#^Z ← press Ctrl+Z keys together
Router#
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status              Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
Serial0/0/0     unassigned  YES unset   administratively down   down
Serial0/1/0     192.168.1.1 YES manual  administratively down   down
Loopback0       10.1.1.1    YES manual  up                      up
Vlan1           unassigned  YES unset   administratively down   down
Router#show history
Router(config)#hostname My_Router
My_Router(config)#line vty 0 ?
    <1-15>  Last Line number
    <cr>
My_Router(config)#line vty 0 15 ← enter 0 ? to find out how many lines you have
My_Router(config-line)#
My_Router(config-line)#exit
My_Router(config)#router rip
My_Router(config-router)#network 10.0.0.0
My_Router(config-router)#
```


（End）

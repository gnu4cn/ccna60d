# 加固交换机

## 阻止 Telnet 访问

Telnet 流量会以明文形式发送密码，这意味着当有网络嗅探器连接到咱们的网络时，那么读取配置就会相当容易。

默认情况下，Telnet 上是禁用的（即，咱们需要设置一个口令，并可选地设置一个用户名才能让他工作）。但是，当咱们仍希望要有对管理端口的远端访问时，那么咱们可以 `transport input ssh` 这条命令，启用到交换机的 SSH 流量，这曾在早先讨论过。

**FARAI 有言**：“`transport input all` 这条命令默认已对全部 VTY 线路启用，而 `transport input none` 这条命令则默认对其他线路启用。”

## 启用 SSH

在可行时，咱们应始终使用 SSH 而不是 Telnet 与 SNMP 访问咱们的交换机。SSH 代表安全外壳，secure shell，实现了网络上两个设备间信息的安全交换。SSH 使用公钥加密技术，验证连接的两台设备身份。Telnet 与 SNMP 版本 1 和 2 均未加密，而易遭数据包嗅探（SNMP 版本 3 提供了机密性 —— 防止被某一未授权来源窥探的数据包加密）。另一方面，SSH 属于加密的。

要启用 SSH，咱们必须要有某一支持加密的 10S 版本。发现这点的一种快速方式，便是 `show version` 这条命令。要在文件名及/或 Cisco 系统公司的安全声明中，查找 `K9`。


```console
Switch#sh version
Cisco IOS Software, C3560 Software (C3560-ADVIPSERVICES K9-M), Version
12.2(35)SE1, RELEASE SOFTWARE (fc1)
Copyright (c) 1986-2006 by Cisco Systems, Inc.
Compiled Tue 19-Dec-06 10:54 by antonio
Image text-base: 0x00003000, data-base: 0x01362CA0
ROM: Bootstrap program is C3560 boot loader
BOOTLDR: C3560 Boot Loader (C3560-HBOOT-M) Version 12.2(25r)SEC, RELEASE
SOFTWARE (fc4)
Switch uptime is 1 hour, 8 minutes
System returned to ROM by power-on
System image file is “flash:/c3560-advipservicesk9-mz.122-35.SE1.bin”
This product contains cryptographic features and is subject to United States and local country laws governing import, export, transfer and use. Delivery of Cisco cryptographic products
does not imply third-party authority to import, export, distribute or use encryption.

[Output Truncated]
```

**注意**：若咱们没有某一安全版本的 IOS，那么咱们必须为其购买许可证。


为了加密的连接，咱们将需要在交换机上，创建一个私钥/公钥（见下文）。在咱们连接时，要使用公钥加密数据，而交换机将使用其私钥解密数据。对于认证，要使用咱们选择的用户名/口令组合。接下来，要需设置交换机的主机名和域名，因为私钥/公钥将通过使用 `hostname.domainname` 这种命名法（FQDN）得以创建。显然，密钥要以某种代表该系统的东西，命名才有意义。

首先，要确保咱们有个不同于默认 `Switch` 的主机名。接着，要添加咱们的域名（这通常与 Windows Active Directory 中咱们的 FQDN 一致）。随后，要创建出将用于加密的加密密钥。其中的模数，将是咱们打算使用的密钥长度，范围为 360 至 2048，后者安全性最高；1024 及以上长度，均被视为安全。至此，SSH 便已于该交换机上启用。

咱们还应输入少数几个维护命令。

- `ip ssh time-out 60` 这条命令，将使任何闲置 60 秒的 SSH 连接超时；
- 当认证失败两次时，`ip ssh authentication-retries 2` 这一命令重置该初始 SSH 连接。这样做将不会阻止用户建立一个新连接并重试认证。


这一过程如以下输出中所示。

```console
Switch(config)#hostname SwitchOne
SwitchOne(config)#ip domain-name mydomain.com
SwitchOne(config)#crypto key generate rsa
Enter modulus: 1024
SwitchOne(config)#ip ssh time-out 60
SwitchOne(config)#ip ssh authentication-retries 2
```


咱们可以 `ip ssh version 2` 这条命令，选择性地启用 SSH 版本 2。咱们来看看两个密钥中的一个。在这一示例中，该密钥是为 HTTPS 生成。由于这个密钥是在启用 HTTPS 时自动生成的，因此名字也将是自动生成。


```console
firewall#show crypto key mypubkey rsa
Key name: HTTPS_SS_CERT_KEYPAIR.server
Temporary key
Usage: Encryption Key
Key is not exportable.
Key Data:
306C300D 06092A86 4886F70D 01010105 00035B00 30580251 00C41B63 8EF294A1
DC0F7378 7EF410F6 6254750F 475DAD71 4E1CD15E 1D9086A8 BD175433 1302F403
2FD22F82 C311769F 9C75B7D2 1E50D315 EFA0E940 DF44AD5A F717BF17 A3CEDBE1
A6A2D601 45F313B6 6B020301 0001
```

要检查 SSH 是否已于该交换机启用，就要输入以下命令：


```console
Switch#show ip ssh
SSH Enabled - version 1.99
Authentication timeout: 120 secs; Authentication retries: 2
Switch#
```

当咱们已启用 SSH 时，那么咱们应已禁用了 Telnet 与 HTTP。在咱们输入 `transport input` 这条命令后，那么任何于其后输入的协议均将被允许。任何未输入的协议则都不会被允许。在以下输出中，咱们可以看到只有 SSH 被允许：


```console
line vty 0 15
transport input ssh
```

以下输出显示，SSH 和 Telnet 均被允许：

```console
line vty 0 15
transport input ssh telnet
```

咱们可以一条简单命令，禁用 HTTP 的访问：

```console
Switch(config)#no ip http server
```

通过使用以下命令，查看该交换机上 HTTP 服务器的状态：


```console
Switch#show ip http server status
HTTP server status: Disabled
HTTP server port: 80
HTTP server authentication method: enable
HTTP server access class: 0
HTTP server base path: flash:html
Maximum number of concurrent server connections allowed: 16
Server idle time-out: 180 seconds
Server life time-out: 180 seconds
Maximum number of requests allowed on a connection: 25
HTTP server active session modules: ALL
HTTP secure server capability: Present
HTTP secure server status: Enabled
HTTP secure server port: 443
HTTP secure server ciphersuite: 3des-ede-cbc-sha des-cbc-sha rc4-128-md5 rc4-12
HTTP secure server client authentication: Disabled
HTTP secure server trustpoint:
HTTP secure server active session modules: ALL
```

咱们还可应用一个访问控制列表到那些 VTY 线路而仅允许 SSH。我们已在 [第 29 天 IPv4 的访问列表](../d29-IPv4_access_lists.md) 介绍过访问控制列表（译注：原文此处仍使用了早先版本的表述）。

## 设置 `enable` 的秘密口令

全局配置模式，`Global Configuration` mode，将允许用户配置交换机或路由器与擦除配置，以及重置密码。咱们必须通过设置一个口令或秘密口令，保护这一模式（这样做实际上阻止了用户通过用户模式，`User` mode）。这一秘密口令，将显示于路由器的运行配置中，其中 `enable secret password` 将被加密。

我（作者）已提到过，咱们在咱们的路由器与交换机上，实际上可以同时有个口令，以及一个 `enable` 的秘密口令，但这样做可能造成混淆。因此要只设置 `enable` 秘密口令。下面的配置文件，演示了如何通过在命令前敲入 `do` 指令，在无需退回到特权模式，`Privileged` mode 下执行某一命令：

```console
Switch1(config)#enable password cisco
Switch1(config)#do show run
Building configuration...
Current configuration: 1144 bytes
hostname Switch1
enable password ciscos
```

**FARAI 有言**：“咱们可以 `service password-encryption` 这条命令，加密 `enable` 的秘密口令。”


咱们可以命令前的 `no`，擦除配置中的大多数行。还值得注意的是，正如 Farai 所说，咱们可以执行一条 `service password-encryption` 命令，但这一命令仅提供弱加密（`level 7`），而下面的秘密口令则有着强加密（MD5）。


```console
Switch1(config)#no enable password
Switch1(config)#enable secret cisco
Switch1(config)#do show run
Building configuration...
Current configuration: 1169 bytes
hostname Switch1
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0 ← [strong level 5 password]
```

## 服务

咱们应始终禁用那些咱们不打算使用的服务。思科通过默认不启用那些不安全，或很少用到的服务/协议，而已做了不错的工作；但是，咱们可能只是为了确保安全，而打算禁用他们。某些服务也很有帮助。大多数服务会在全局配置模式下的 `service` 命令中发现。


```console
Switch(config)#service ?

compress-config    Compress the configuration file
config      TFTP load config files
counters      Control aging of interface counters
dhcp      Enable DHCP server and relay agent
disable-ip-fast-frag  Disable IP particle-based fast fragmentation
exec-callback    Enable exec callback
exec-wait      Delay EXEC startup on noisy lines
finger      Allow responses to finger requests
hide-telnet-addresses  Hide destination addresses in telnet command
linenumber      Enable line number banner for each exec
nagle      Enable Nagle’s congestion control algorithm
old-slip-prompts    Allow old scripts to operate with slip/ppp
pad        Enable PAD commands
password-encryption  Encrypt system passwords
password-recovery    Disable password recovery
prompt      Enable mode specific prompt
pt-vty-logging    Log significant VTY-Async events
sequence-numbers    Stamp logger messages with a sequence number
slave-log       Enable log capability of slave IPs
tcp-keepalives-in   Generate keepalives on idle incoming network             connections
tcp-keepalives-out   Generate keepalives on idle outgoing network             connections
tcp-small-servers   Enable small TCP servers (e.g., ECHO)
telnet-zeroidle    Set TCP window 0 when connection is idle
timestamps     Timestamp debug/log messages
udp-small-servers    Enable small UDP servers (e.g., ECHO)
```


一般而言，那些要 `enable`/`disable` 的最常见服务及其说明，如下表 45.1 中所示。

**表 45.1** -— **要 `enable`/`disable` 的一些最常用到的服务**

| 服务 | 描述 |
| :-- | :-- |
| `no service pad` | 数据包的组装器/拆解器，用于异步组网；极少用到 |
| `no service config` | 阻止交换机从网络获取配置文件 |
| `no service finger` | 禁用指纹服务器，the finger server； 极少用到 |
| `no ip icmp redirect`  | 阻止 ICMP 的重定向，其可被用于路由器投毒 |
| `no ip finger` | 禁用指纹服务的另一方式 |
| `no ip gratuitous-arps` | 禁用以防止中间人攻击 |
| `no ip source-route` | 禁用用户提供的到目的地的逐跳路由 |
| `service sequence-numbers` | 在每个日志条目中，给予其一个编号并依序递增 |
| `service tep-keepalives-in` | 阻止路由器保持一些挂起的管理会话开启 |
| `service tep-keepalives-out` | 与 `service tcp-keepalives-in` 相同 |
| `service udp-small-servers` | 禁用 `echo`、`chargen`、`discard`、`daytime`；极少用到 |
| `service tcp-small-servers` | 禁用 `echo`、`chargen`、`discard`； 极少用到 |
| `service timestamps debug datetime localtime show-timezone` | 给每个日志记录的数据包，使用本地时间，打上有着日期与事件，并显示时区的时间戳（在调试模式下） |
| `service timestamps log datetime localtime show-timezone` | 给每个日志记录的数据包，使用本地时间，打上有着日期与事件，并显示时区的时间戳（不在调试模式下），这对观察日志文件非常有用（特别是在时钟设置正确的情况下） |


## 修改原生 VLAN

我们已经知道，原生 VLAN 会被交换机用于承载一些特定协议的流量，例如

- 思科发现协议（CDP）
- VLAN 中继协议（VTP）
- 端口聚合协议（PAgP）
- 及动态中继协议（DTP）

等的信息。默认的原生 VLAN 始终为 `VLAN 1`；但是，原生 VLAN 可手动修改为任何有效的 VLAN 编号（0 与 4096 除外，因为这两个编号属于 VLAN 的保留范围）。

咱们可以以下输出中所示的命令（需按接口执行），检查原生 VLAN。

```console
Switch#show interfaces FastEthernet0/1 switchport
Name: Fa0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
Voice VLAN: none
```

让端口处于 `VLAN 1`中，被视为允许黑客获得对网络资源访问的一种安全漏洞。要缓解这个问题，建议避免将任何主机置于 `VLAN 1` 中。咱们也可以下面这条命令，将所有中继端口上的原生 VLAN 修改为某一未使用的 VLAN：

```console
Switch(config-if)#switchport trunk native vlan 888
```

**注意**：这是 CCNA 考试大纲中关键目标之一，因此要务必牢记。

咱们还可以下面这条命令，阻止原生 VLAN 的数据在中继链路上传输。

```console
Switch(config-if)#switchport trunk allowed vlan remove 888
```


## 修改管理 VLAN

咱们还可添加一个 IP 地址到交换机，允许咱们处于管理目的 Telnet 到该交换机。这种做法称为一个交换机的虚拟接口（SVI）。正如以下输出中所示，让这一管理访问处于某个非 `VLAN 1` 之外的其他 VLAN 中，属于一种明智的预防措施。

```console
Switch(config)#vlan 3
Switch(config-vlan)#interface vlan3
%LINK-5-CHANGED: Interface Vlan3, changed state to up
Switch(config-if)#ip address 192.168.1.1 255.255.255.0
```


## 关闭 CDP

思科发现协议（CDP）[早先](../d08/cdp.md) 已介绍过。其默认在多数路由器及交换机上，都已全局地并于每个接口上启用，而其功能为发现那些已连接的思科设备。咱们可能不希望其他思科设备看到有关咱们网络设备的信息，因此咱们可以关闭这一协议，至少要在那些位于咱们网络边缘，连接其他公司或 ISP 的的设备上关闭这一协议。

**FARAI 有言**：“CDP 并非在所有平台上都是默认启用的，例如 ASR 的路由器。”

在下面的输出中，咱们可以看到，在我（作者）执行 `show cdp neighbor detail` 命令后，一个连接到我的交换机的路由器，如何能够看到一些基本信息。

```console
Router#show cdp neighbor detail

Device ID: Switch1
Entry address(es):
Platform: Cisco 2960, Capabilities: Switch
Interface: FastEthernet0/0, Port ID (outgoing port): FastEthernet0/2
Holdtime: 176
Version :

Cisco Internetwork Operating System Software
IOS (tm) C2960 Software (C2960-I6Q4L2-M), Version 12.1(22)EA4, RELEASE SOFTWARE(fc1)
Copyright (c) 1986-2005 by Cisco Systems, Inc.
Compiled Wed 18-May-05 22:31 by jharirba
advertisement version: 2
Duplex: full

Router#
```

若该设备有个 IP 地址，那么其将会显示出来。


要关闭整个设备的 CDP，就要执行下面这条命令。

```console
Switch1(config)#no cdp run
```

要关闭某一特定接口的 CDP，就要执行下面这条命令：

```console
Switch1(config)#int FastEthernet0/2
Switch1(config-if)#no cdp enable
```


## 添加横幅信息

所谓横幅消息，将于某名用户登入咱们的路由器或交换机时显示。其将不会提供任何实际的安全，但他将显示咱们所选的一条警告消息。在下面的配置中，我（作者）选择了字母 Y 作为分隔字符，其会告诉路由器，我已结束输入我的消息：

```console
Switch1(config)#banner motd Y
Enter TEXT message.  End with the character ‘Y’.
KEEP OUT OR YOU WILL REGRET IT Y
Switch1(config)#
```

在我（作者）从我的路由器 Telnet 到这个交换机时，我就会看到这条横幅消息。错误在于选择了 Y 作为分隔字符，因为他会截断我的消息，如下所示：

```console
Router#telnet 192.168.1.3
Trying 192.168.1.3 ...Open
KEEP OUT OR
```

横幅消息可以是：

- MOTD（message of the day，每日消息）—— 显示于用户看到登录提示符前
- 登入 —— 显示于用户看到登录提示符前
- `Exec` —— 在登录提示符之后显示给用户（在咱们打算向未授权用户隐藏信息时用到）


我（作者）建议，咱们要学会配置全部这三种消息类型，并通过登录路由器测试他们。根据咱们的平台与 IOS 版本，咱们将有着不同选择。

```console
Router(config)#banner ?
  LINE            c banner-text c, where ‘c’ is a delimiting character
  exec            Set EXEC process creation banner
  incoming        Set incoming terminal line banner
  login           Set login banner
  motd            Set Message of the Day banner
  prompt-timeout  Set Message for login authentication timeout
  slip-ppp        Set Message for SLIP/PPP
```


## 设置 VTP 口令

[VTP](../d07/vtp.md) 确保了准确的 VLAN 信息，于咱们网络中交换机之间得以传递。为了保护这些更新，咱们应在咱们的交换机上，添加 VTP 口令（其应在 VTP 域中所有交换机上匹配），如下面的输出中所示：

```console
Switch1(config)#vtp domain 60days
Changing VTP domain name from NULL to 60days
Switch1(config)#vtp password cisco
Setting device VLAN database password to cisco
Switch1(config)#
```

## 限制 VLAN 信息


默认情况下，交换机会在中继链路上放行所有 VLAN。咱们可通过指定哪些 VLAN 可以通过，修改这一默认行为，如以下输出中所示。

```console
Switch1(config)#int FastEthernet0/4
Switch1(config-if)#switchport mode trunk
Switch1(config-if)#switchport trunk allowed vlan ?
  WORD    VLAN IDs of the allowed VLANs when this port is in trunking mode
  add     add VLANs to the current list
  all     all VLANs
  except  all VLANs except the following
  none    no VLANs
  remove  remove VLANs from the current list
Switch1(config-if)#switchport trunk allowed vlan 7-12
Switch1#show interface trunk
Port        Mode         Encapsulation  Status        Native vlan
Fa0/4       on           802.1q         trunking      1

Port        Vlans allowed on trunk
Fa0/4       7-12
```

## 关闭未使用的端口

任何网络设备中的未使用或 “空” 端口，都会带来某种安全风险，因为有人可能将某种线缆插入他们，而将某一未授权设备连接到网络。这一情况便会导致数种问题，包括：

- 网络功能异常
- 网络信息暴露于外部人员


这正是咱们应关闭路由器、交换机及其他网络设备上，所有未被用到端口的原因。根据不同设备，端口关闭状态可能是默认的，但咱们应始终检查这点。

关闭某个端口，是以接口配置模式下的 `shutdown` 命令完成的。

```console
Switch#conf t
Switch(config)#int fa0/0
Switch(config-if)#shutdown
```

咱们可以多种方式，检查某个端口是否处于关闭状态，这其中的一种，便是是使用 `show ip interface brief` 这条命令。


```console
Router(config-if)#do show ip interface brief

Interface     IP-Address   OK? Method Status                Protocol
FastEthernet0/0 unassigned   YES unset  administratively down down
FastEthernet0/1 unassigned   YES unset  administratively down down
```

要注意，所谓管理性关闭状态，表示该端口已手动关闭。

检查关闭状态的另一种方法，是通过使用 `show interface x` 这一命令。


```console
Router#show interface fa0/0
FastEthernet0/0 is administratively down, line protocol is down
  Hardware is Gt96k FE, address is c200.27c8.0000 (bia c200.27c8.0000)
  MTU 1500 bytes, BW 10000 Kbit/sec, DLY 1000 usec,
```

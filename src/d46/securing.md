# 加固路由器

## 保护物理访问

奇怪的是，在咱们考虑失去对某家公司网络访问的灾难性后果时，咱们常会发现，他们的路由器就放在某人的办公桌底下！

网络设备应存放在带密码键盘访问，或至少带锁及钥匙访问的某一安全房间内。思科路由器可是价值不菲的设备，而属于对窃贼有吸引力的目标。网络越大，那么该设备价值越高，同时保护数据与路由器配置文件的需求就越高。

## 控制台访问

控制台端口设计用于提供对路由器的物理访问，以允许初始配置及灾难恢复。任何有着控制台访问的人，都可以彻底清除或重新配置文件，因此，出于这一原因，控制台端口就应通过添加一个口令，或一个本地用户与口令，以一个口令加以保护，如下所示：
添加密码：

添加一个口令：

```console
Router(config)#line console 0
Router(config-line)#password cisco
Router(config-line)#login
```

或添加一个本地用户名与口令：

```console
Router(config)#username paul password cisco
Router(config)#line console 0
Router(config-line)#login local
```

咱们还可对控制台（及 VTY）线路创建一个超时，从而其会在一段时间后断开连接。默认为 5 分钟。

```console
Router(config)#line console 0
Router(config-line)#exec-timeout ?
    <0-35791>   Timeout in minutes
Router(config-line)#exec-timeout 2 ?
    <0-2147483> Timeout in seconds
    <cr>
Router(config-line)#exec-timeout 2 30
Router(config-line)#
```

## Telnet 访问

除非有人添加一个口令到 Telnet（`vty`）线路，否则咱们实际上无法 Telnet 进入某一路由器。如同上面那样，咱们可添加一个口令到 VTY 线路，或指示路由器查找某一本地用户名与口令（于配置文件中，或存储在 RADIUS/TACACS 服务器上的用户名与口令），如下所示：


```console
Router(config-line)#line vty 0 15
Router(config-line)#password cisco
Router(config-line)#login   ← or login local
```

下面的输出是个自一台路由器到另一路由器的 Telnet 会话。在咱们获得 Telnet 访问后，咱们便可看到主机名的变化。当咱们输入口令时，口令将不显示出来。

```console
Router1#telnet 192.168.1.2
Trying 192.168.1.2 ...Open
User Access Verification
Username: paul
Password:
Router2>
```

当咱们有着某一安全 10S 镜像时，那么咱们可将路由器配置为仅允许 SSH 的访问而非 Telnet。这一做法的优势在于，所有数据都会被加密。当咱们在 SSH 已启用后再尝试 Telnet 时，那么这种连接就将被终止。


```console
Router1(config)#line vty 0 15
Router1(config-line)#transport input ssh
Router2#telnet 192.168.1.2
Trying 192.168.1.2 ...Open
[Connection to 192.168.1.2 closed by foreign host]
```


## 保护 `enable` 模式


`enable` 模式提供了对路由器的配置访问，因此咱们还会打算这种模式。咱们可配置一个 `enable` 的秘密口令，或一个 `enable` 的口令。实际上，咱们可同时有着这两种口令，但这是个糟糕的主意。

`enable` 口令是未加密的，因此其可于路由器配置中看到。而 `enable` 的秘密口令，提供了5 级（MD5）的加密，这种加密难以破解。更新的 10S 版本（从 15.0(1)S 开始）还可使用 4 级（SHA256）的加密，这种加密优于 MD5 加密（这一 5 级加密最终将被弃用）。虽然咱们可将 `service password encryption` 这一命令添加到咱们的 `enable` 口令，但因为其为 7 级加密（即低安全性；思科称之为 “偷窥安全性”，因其只需某人在背后偷看，记住一个稍微难一点的密码短语，随后便可通过使用 Internet 上的一些 7 级解密工具破解）而易于破解。咱们可再以下输出中，看到 7 级与 5 级的加密。

```console
Router(config)#enable password cisco
Router(config)#exit
Router#show run
enable password cisco
Router(config)#enable password cisco
Router(config)#service password-encryption
Router#show run
enable password 7 0822455D0A16
Router(config)#enable secret cisco
Router(config)#exit
Router#show run
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
```

要记住，当咱们忘记了 `enable` 口令时，咱们将必须在路由器或交换机上，执行一次口令恢复。要谷歌检索针对咱们正使用特定型号的关键词，因过程会有所不同。对于路由器，口令恢复涉及：

- 重启设备
- 按住咱们键盘上指定的中断键
- 设置配置寄存器为跳过启动配置文件（通常为 `0x2142`）
- 然后随后一条 `copy start run` 命令，从而咱们便可创建一个新的口令。


对于交换机，口令恢复过程就要更复杂一点（同样，要谷歌检索针对咱们正使用具体型号的关键字），但其还可通过使用一个小技巧完成 -- 在加电开机的同时，按住 MODE 键 8 秒。交换机将以空白配置启动，而上一次启动配置将以一个名为 `config.text.renamed` 的文件保存于闪存中，因此其可被拷贝回运行配置，并以另一个口令加以修改。

## 保护用户访问


Cisco IOS 提供了给予用户单独口令与用户名，以及对受限命令列表访问的能力。当咱们多层级的网络支持时，那么这一特性将很有用。这方面的一个示例，如以下输出中所示：


```console
RouterA#config term
Enter configuration commands, one per line. End with CNTL/Z.
RouterA(config)#username paul password cisco
RouterA(config)#username stuart password hello
RouterA(config)#username davie password football
RouterA(config)#line vty 0 4
RouterA(config-line)#login local
RouterA(config-line)#exit
RouterA(config)#exit
```

咱们可针对路由器上的用户账户，指定访问级别。例如，咱们可能希望初级网络团队的成员，只能够使用一些基本的故障排除命令。还值得记住的是，思科路由器有着两种口令安全模式：用户模式（`exec`）和特权模式（`enable`）。

思科路由器有着 16 种配置可用的不同权限级别（0 至 15），其中 15 为完全访问权限，如下所示。

```console
RouterA#conf t
Enter configuration commands, one per line. End with CNTL/Z.
RouterA(config)#username support privilege 4 password soccer
    LINE Initial keywords of the command to modify
RouterA(config)#privilege exec level 4 ping
RouterA(config)#privilege exec level 4 traceroute
RouterA(config)#privilege exec level 4 show ip interface brief
RouterA(config)#line console 0
RouterA(config-line)#password basketball
RouterA(config-line)#login local ←  password is needed
RouterA(config-line)#^z
```

支持人员会登入路由器，并尝试进入配置模式，但这条命令及其他一些不可用命令，均无效并无法看到：

```console
RouterA con0 is now available
Press RETURN to get started.
User Access Verification
Username: support
Password:
RouterA#config t ←  not allowed to use this
            ^
% Invalid input detected at ‘^’ marker.
```

咱们可以在路由器提示符处，看到默认的权限级别。

```console
Router>show privilege
Current privilege level is 1
Router>en
Router#show priv
Router#show privilege
Current privilege level is 15
Router#
```

## 更新 IOS

诚然，更新 IOS 固件有时会引入一些新的 bug 或问题到咱们的网络，因此当咱们有个 TAC 支持合同时，那么按照思科的建议执行这一操作，是为最佳实践。但总体而言，保持咱们的 10S 更新属于强烈建议的。

更新咱们的 IOS：

- 会修复一些已知漏洞
- 消除安全漏洞
- 提供一些增强特性与 IOS 能力


## 路由器日志记录

路由器提供了记录事件的能力。他们可按咱们的意愿，发送日志信息到咱们的屏幕或某一服务器。咱们应记录路由器的消息，而有八个可用的日志严重性级别（出于考试目的，咱们需要了解他们），如下输出种所示：


```console
logging buffered ?
<0-7>Logging severity level
alerts-—Immediate action needed (severity=1)
critical-—Critical conditions (severity=2)
debugging-—Debugging messages (severity=7)
emergencies-—System is unusable (severity=0)
errors—-Error conditions (severity=3)
informational-—Informational messages (severity=6)
notifications—-Normal but significant conditions (severity=5)
warnings—-Warning conditions (severity=4)
```

咱们可发送日志消息到数个地方：

```console
Router(config)#logging ?
    A.B.C.D     IP address of the logging host
    buffered    Set buffered logging parameters
    console     Set console logging parameters
    host        Set syslog server IP address and parameters
    on          Enable logging to all enabled destinations
    trap        Set syslog server logging level
    userinfo    Enable logging of user info on privileged mode enabling
```

在咱们是通过控制台登入到路由器时，那么日志消息将通常显示于屏幕上。当咱们正在输入一些配置命令，这种显示便显得有些烦人。例如，当我（作者）正在输入某条命令时，其便被一条控制台日志消息打断了：

```console
Router(config)#int f0/1
Router(config-if)#no shut
Router(config-if)#end
Router#
*Jun 27 02:06:59.951: %SYS-5-CONFIG_I: Configured from console by console ___show ver___
*Jun 27 02:07:01.151: %LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to up
```


咱们既可以 `no logging console` 这条命令关闭日志消息，或咱们可以 `logging synchronous` 这条命令，将日志消息设置为在咱们输入时不打断，这条命令会重新输入在其被日志消息打断前，咱们正输入的行（在 VTY 线路上也可用）。


```console
Router(config)#line con 0
Router(config-line)#logging synchronous
Router(config-line)#
Router(config-line)#exit
Router(config)#int f0/1
Router(config-if)#shut
Router(config-if)#exit
Router(config)#
*Jun 27 02:12:46.143: %LINK-5-CHANGED: Interface FastEthernet0/1, changed state to
administratively down
Router(config)#exit
```

这里值得一提的是，在通过 Telnet（或 SSH）登入路由器后，咱们将看不到控制台输出。当咱们希望在 Telnet 登入后看到日志信息，那么就要执行 `terminal monitor` 这条命令。


## 简单网络管理协议（SNMP）

SNMP 属于一种咱们可用于远程管理咱们网络的服务。他由一个运行 SNMP 管理软件，由某名管理员维护的中心站，以及位于包括路由器、交换机及服务器等，咱们的网络设备上的一些小文件（代理）组成。

数家厂商都已设计了 SNMP 软件，包括惠普、思科、IBM 和 SolarWinds 等。还有一些可用的开源版本。这种软件允许咱们监控设备上的带宽与活动，比如登录记录与端口状态等。

咱们可使用 SNMP 远程配置或关闭端口及设备。咱们还可将其配置为在特定条件满足时，比如高带宽占用或端口下线时发送警报。我们 [早先](../d34/SNMP.md) 已详细介绍过 SNMP。

## 外部认证方法

与其将用户名及口令存储在本地，咱们可使用某一通常运行了 AAA 或 TACACS+ 的服务器。这种方法的优势在于，不必手动在每个单独路由器和交换机上输入用户名及口令。相反，他们均存储于服务器的数据库中。

TACACS+ 代表，Terminal Access Controller Access Control System Plus，终端访问控制器访问控制系统增强版。他是一种使用 TCP 端口 49 的思科专有协议。TACACS+ 经由一个或多个中心化服务器，提供了网络设备的访问控制。

RADIUS 代表，Remote Authentication Dial-In User Service，远程认证拨入用户服务。他属于一种使用 UDP 的，以及一种客户端/服务器的，保护对网络的远程访问的分布式网络安全系统。

当咱们有着 TACACS+ 或 RADIUS 时，那么咱们就会希望启用认证、授权与计费（AAA）。AAA 安装于某一服务器上，并监控着一个网络用户账户的数据库。用户的访问、协议、连接与断开原因，以及许多其他特性，都可加以监控。

路由器和交换机可配置为在某一用户尝试登入时，查询该服务器。该服务器随后会验证该名用户。我们 [早先](../d43-aaa.md) 已详细介绍过这个方面。

### 双因素认证（2FA）

此时值得提到 2FA，由于他缓解了许多与登录凭据泄露有关的风险，其也已称为一项不可获取的 web 安全工具。当某一口令被破解、被猜中，或甚至被钓鱼攻击到时，2FA 便会阻止某名攻击者，在没有另一（第二种）因素批准下获取访问权限。

一次典型 2FA 事务过程将如下：

- 用户以其用户名及口令，登入某项服务或网站；
- 口令会由某一认证服务器验证，并在口令正确时，该名用户便会被带到第二因素；
- 认证服务器会发送一段唯一代码，到该名用户的第二因素验证方式（比如某一手机应用）；
- 用户通过提供其第二验证方式的额外认证，确认其身份。


## 路由器的时钟与 NTP


交换机的时间通常会被忽视；但其重要性不容小觑。当咱们遇到安全违规日志、SNMP 陷阱或事件日志记录时，那么时间戳就会被用到。当咱们交换机上的时间不准确时，那么找出事件发生于何时就将十分昆山。我们已详细介绍过这点。


请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

# Syslog、SNMP与Netflow

## 第40天任务

- 阅读今天的课文（下面）
- 复习昨天的课文
- 完成今天的实验
- 阅读ICND2补充指南
- 在[subnetting.org](http://www.subnetting.org)网站上花15分钟


将（系统）消息或事件在本地或某台syslog服务器上进行记录，是一项核心的维护任务。Syslog是一种允许主机将事件通知消息，经由IP网络发送到事件消息收集器（event message collectors），也叫做syslog服务器或syslog守候程序（daemon），的协议。也就是说，某台主机或设备可被配置为，生成一条syslog消息，并将该消息转发到某个特定的syslog守候程序（服务器）的方式。

简单网络管理协议，则是一种广泛使用的管理协议，其定义了一套用于连接到IP网络设备通信的标准。SNMP提供了一种用于对网络设备进行监视与控制的方法。与思科IOS的IP SLA操作（IP Service Level Agreement, IP 网络服务等级协议，该特性通过使用活动流量监视来测量网络性能，而允许客户对IP服务等级进行分析）一样，SNMP可用于收集统计数据、监测设备性能，以及提供到网络的一个基线（a baseline of the network），且SNMP是使用最为广泛的网络维护与监测工具之一。

尽管SNMP可以提供流量统计，但其无法区分各种数据流（While SNMP can provide traffic statistics, SNMP cannot differentiate between individual flows）。不过思科IOS的Netflow就可以做到。数据流（A flow）简单地就是一系列的、有着同样源与目的地址、源与目的端口、协议接口，以及同样的服务参数类（Class of Service parameters）的数据包。

今天将学到有关以下方面的知识：

- Syslog
- SNMP
- Netflow


此课程对应了以下CCNA大纲要求：

+ 配置并验证Syslog
    - `syslog`输出的使用
- 对SNMP版本2与版本3进行描述
- `netflow`数据的使用

## 日志记录（Logging）

所谓某个`syslog`守候程序或某台`syslog`服务器，就是一个对发送给它的`syslog`消息进行监听的实体。将某个`syslog`守候程序配置为请求某台特定设备向其发送`syslog`报文，是不可行的。也就是说，在某台特定设备无法生成`syslog`报文的情况下，那么`syslog`守候程序就什么也不能做。真实世界中，集团公司通常采用`SolarWinds`（或类似）软件来做`syslog`的捕获。此外，诸如`Kiwi Syslog daemon`这类自由软件，也可用于`syslog`的捕获。

`Syslog`使用用户数据报协议（User Datagram Protocol, UDP），作为所采用的传输机制，因此数据包没有被排序与确认。因为UDP没有包含在TCP中的额外开销（the overhead included in TCP），这意味着在某些重度使用的网络中，一些数据包可能被丢弃，而因此导致记录的信息丢失。不过思科IOS软件允许管理员出于冗余目的，配置多台`syslog`服务器。`syslog`方案由两个主要元素构成：`syslog`服务器与`syslog`客户端。

`syslog`客户端将`syslog`报文，使用UDP作为传输层协议，指定一个`513`目的端口，发送给`syslog`服务器。这些报文的大小不能超过`1024`字节；不过没有最小长度的限制。所有`syslog`报文，都包含三个不同的部分：优先级、头部与报文。

`syslog`报文的优先级，同时表示了设施，与报文的严重程度（The priority of a syslog message represents both the facility and the severity of the message）。此数字是一个8位的数字。前3个最低有效位（The first 3 least significant bits），表示报文的严重程度（在3位的情况下，可表示8中不同的严重程度），其它5位表示了某项设施。可使用这些值，来对`syslog`守候程序中的事件进行过滤。

> **注意**：请注意这些值是由那些生成事件的应用产生的，而不是由`syslog`服务器本身产生的。

下表40.1中列出并介绍了思科IOS设备所设置的值（请记住这些严查程度级别与它们的名称）：

*表 40.1 - 思科IOS软件`syslog`的优先级分级与定义*

| 严重程度级别 | 严查程度级别名称 | `syslog`的定义 | 介绍 |
| :---: | :---: | :---: | :--- |
| `0` | 紧急（Emergencies） | `LOG_EMERG` | 此级别用于那些将导致系统不可用的最严重的错误情景。 |
| `1` | 告警（Alerts） | `LOG_ALERT` | 此级别用于表示那些需要管理员立即注意的情况。 |
| `2` | 严重（Critical） | `LOG_CRIT` | 此级别用于表明那些严重性低于告警，但仍需管理员介入的严重情况。 |
| `3` | 错误（Errors） | `LOG_ERR` | 此级别用于表明系统中有错误发生，但这些错误并不会导致系统不可用。 |
| `4` | 警告（Warnings） | `LOG_WARNING` | 此级别用于表示有关系统操作未能成功完成的警告情况。 |
| `5` | 通知（Notifications） | `LOG_NOTICE` | 此级别用于表示系统中的状态改变（比如路由协议临接关系过渡到`down`状态）。 |
| `6` | 消息（Informational） | `LOG_INFO` | 此级别用于表示有关系统正常运行的消息。 |
| `7` | 调试（Debugging） | `LOG_DEBUG` | 此级别用于表示通常用于故障排除目的的实时的（调试的）信息。 |

在`syslog`中，设施（the facility）用于表示生成消息的源。源可以是某个本地设备上的进程、应用，或者甚至操作系统本身。设施是以数字（整数）表示的。在思科IOS软件中，有八个本地使用设施可由进程及应用（以及设备本身）用于发送`syslog`消息。默认思科IOS设备使用设施`local7`来发送`syslog`报文。但要注意大多数思科设备提供了改变默认设施级别的选项。在思科IOS软件中，可使用全局配置命令`loggin facility [facility]`来指定`syslog`的设施。该命令可用的选项如下所示：

```sh
R1(config)#logging facility ?
  auth    Authorization system
  cron    Cron/at facility
  daemon  System daemons
  kern    Kernel
  local0  Local use
  local1  Local use
  local2  Local use
  local3  Local use
  local4  Local use
  local5  Local use
  local6  Local use
  local7  Local use
  lpr     Line printer system
  mail    Mail system
  news    USENET news
  sys10   System use
  sys11   System use
  sys12   System use
  sys13   System use
  sys14   System use
  sys9    System use
  syslog  Syslog itself
  user    User process
  uucp    Unix-to-Unix copy system
```

要通过`syslog`来发送消息，就必须在设备上执行以下顺序的步骤：

1. 使用`logging on`配置命令在路由器或交换机上全局性开启日志记录功能。默认在思科IOS软件中，日志记录是开启的；但仅开启了将消息发送到控制台。对于要将消息发到除控制台外的其它任何目的地，`logging on`命令都是强制要求的。

2. 使用全局配置命令`logging trap [severity]`，指定出要发送到`syslog`服务器的消息的严重程度。可使用数字或使用等价的严重性名称，来指定发送消息的严重程度。

3. 使用全局配置命令`logging [address]`或`logging host [address]`，指定一个或多个的`syslog`服务器目的地址。

4. 作为可选项，使用`logging source-interface [name]`指定在`syslog`报文中的源IP地址。在有着配置的多个接口的设备上，这是普遍的做法。乳未指定此命令，则`syslog`报文将包含路由器或交换机用于抵达服务器的接口的IP地址。而在出于冗余目的有着多个接口时，该地址就会在主要路径（接口）宕掉时发生改变。因此，通常将其设置为某个环回接口。

下面的配置实例，演示了如何将所有信息（informational(level6)）及以下的报文，发送到一台有着IP地址`192.168.1.254`的`syslog`服务器：

```sh
R2(config)#logging on
R2(config)#logging trap informational
R2(config)#logging 192.168.1.254
```

此配置可使用`show syslog`命令进行验证，如下所示：

```sh
R2#show logging
Syslog logging: enabled (11 messages dropped, 1 messages rate-limited, 0 flushes, 0 overruns, xml disabled, filtering disabled)
    Console logging: disabled
    Monitor logging: level debugging, 0 messages logged, xml disabled,filtering disabled
    Buffer logging: disabled, xml disabled, filtering disabled
    Logging Exception size (4096 bytes)
    Count and timestamp logging messages: disabled
No active filter modules.
    Trap logging: level informational, 33 message lines logged
        Logging to 192.168.1.254(global) (udp port 514, audit disabled, link up), 2 message lines logged, xml disabled, filtering disabled
```

一般在配置日志记录时，重要的是要确保路由器或交换机的时钟反映的是真实的当前时间，这可实现与错误数据的关联。日志消息上的不准确或不正确时间戳，会令到使用过滤或关联流程，来做错误与问题隔离十分困难，并十分耗时。在思科IOS软件中，系统时钟可手动配置，或者将设备配置为自动将其时钟与网络时间协议服务器进行同步。在后面的小节将对这两种方法进行讨论。在网络中仅有少数互联网络设备时，手动的时钟或时间配置没有问题。在思科IOS软件中，系统时间是通过使用`clock set hh:mm:ss [day & month | month & day] [year]`特权`EXEC`命令进行配置的。其不是在全局配置模式下配置或指定的。下面的配置示例，演示了如何将系统时钟设置为 2010 年 10 月 20 日上午12:15：

```sh
R2#clock set 12:15:00 20 october 2010
```



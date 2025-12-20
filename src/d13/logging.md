# 事件日志记录

有许多咱们可监控咱们网络设备状态的不同方式，而更有用的方法之一，便是利用 IOS 中的日志记录功能。具体来说，咱们可使用 `logging` 这条命令，跟踪所关注领域的那些重要更新。与咱们所选取的相关事件，将被进入思科路由器的日志中，供咱们立即或稍后查看。以下是供咱们选择的众多选项：


```console
Router1(config)#logging ?
  Hostname or A.B.C.D  IP address of the logging host
  alarm                Configure syslog for alarms
  buffered             Set buffered logging parameters
  buginf               Enable buginf logging for debugging
  cns-events           Set CNS Event logging level
  console              Set console logging parameters
  count                every log message and timestamp last occurrence
  delimiter            Append delimiter to syslog messages
  discriminator        Create or modify a message discriminator
  esm                  Set ESM filter restrictions
  event                Global interface events
  exception            Limit size of exception flush output
  facility             Facility parameter for syslog messages
  filter               Specify logging filter
  history              Configure syslog history table
  host                 Set syslog server IP address and parameters
  ip                   IP configuration
  listen               MWAM remote console and logging listen enabler
  message-counter      Configure log message to include certain
  monitor              Set terminal line (monitor) logging parameters
  on                   Enable logging to all enabled destinations
  origin-id            Add origin ID to syslog messages
  persistent           Set persistent logging parameters  
  queue-limit          Set logger message queue size  
  rate-limit           Set messages per second limit  
  reload               Set reload logging level  
  source-interface     Specify interface for source address in logging
                                                 transactions  
  system               enable/disable System Event Log
  trap                 Set syslog server logging level  
  userinfo             Enable logging of user info on privileged mode                          
                                                 enabling
```


比方说，咱们打算记录咱们最近遇到问题的某条中继状态。那么要启用中继状态的消息发送，就要在接口配置模式下，使用 `logging event trunk-status` 命令。而要禁用中继状态的消息发送，就要使用这一命令的 `no` 形式。


```console
Router(config)#logging event trunk-status
Router(config)#end
Router#show logging event trunk-status
```


经由 `show log` 命令（或当咱们启用了 `terminal monitor` 命令时的终端会话中），以下内容就将出现在日志中：


```console
*Aug 4 17:27:01.404 UTC: %DTP-SPSTBY-5-NONTRUNKPORTON: Port Gi3/3 has become non-trunk
*Aug 4 17:27:00.773 UTC: %DTP-SP-5-NONTRUNKPORTON: Port Gi3/3 has become non-trunk
```

咱们便可深入挖掘，并执行一次 `logging event link-status` 命令，跟踪故障接口的状态。下面是个如何实现这种类型跟踪的一个示例：


```console
Router1#config t
Enter configuration commands, one per line. End with CTRL/Z.
Router1(config)#logging event ?
  link-status  Globally enable/disable link UPDOWN message

Router1(config)#logging event link-status ?
  boot     Suppress/Allow link UPDOWN messages during boot
  default  Link UPDOWN messages for all interfaces

Router1(config)#logging event link-status default
```


请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。


> *知识点*：
>
> - the logging function within the IOS
>
> - use the `logging` command to track important updates on areas of concern
>
> - the log of the Cisco router
>
> - trunk status messaging
>
> - the `no` form of this command


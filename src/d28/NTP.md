# 网络时间协议

NTP 是一种设计用于机器网络时间同步的协议。NTP 记录在 [RFC 1305](https://datatracker.ietf.org/doc/html/rfc1305) 中，运行在 UDP 上。

NTP 网络通常会从诸如无线电时钟，或连接到时间服务器的原子钟等权威时间来源获取时间。NTP 最后会在网络上分发这个时间。NTP 是相当高效的；要将两台机器的时间同步到毫秒以内，每分钟仅需不到一个数据包。

NTP 使用 “层” 这一概念，描述某台机器距离权威时间来源的 NTP 跳数。请记住，这不是路由或交换的跳数，而是 NTP 跳数，这是个完全不同的概念。某个 1 层的时间服务器，通常有着直接连接的无线电或原子钟，而某个 2 层的时间服务器，则会经由 NTP 从某个 1 层时间服务器接收他的时间，以此类推。当某个设备配置了多个 NTP 参考服务器时，他会自动选择配置为要经由 NTP 通信的，有着最低层数的机器，作为其时间源。

在 Cisco IOS 软件中，设备是通过使用 `ntp server [address]` 这条全局配置命令，配置一个或多个 NTP 服务器的 IP 地址。正如前面所指出的，通过重复使用这条同样命令，多个 NTP 参考地址便可得以指定。此外，这条命令还可用于配置服务器和客户端之间的安全及其他特性。下面的配置示例，演示了如何将某个设备，配置为将其时间，与有着 IP 地址 `10.0.0.1` 的某个 NTP 服务器同步：

```console
R2(config)#ntp server 10.0.0.1
```

这一配置之后，`show ntp associations` 这条命令便可用于验证这两个 NTP 设备之间的通信，如下输出中所示：

```console
R2#show ntp associations

address     ref clock    st  when  poll reach  delay  offset  disp
*~10.0.0.1  127.127.7.1  5   44    64   377    3.2    2.39    1.2
* master (synced), # master (unsynced), + selected, - candidate, ~ configured
```


其中 `address` 字段，表明了 NTP 服务器的 IP 地址，正如由这一字段下所指定的值 `10.0.0.1` 确认的那样。`ref clock` 这个字段，表明由这个 NTP 服务器使用的参考时钟。在这种情形下，IP 地址 `127.127.7.1` 表明，这个设备正使用某个内部时钟（`127.0.0.0/8` 子网）作为其参考时间源。当这个字段包含着别的值，比如 `192.168.1.254` 时，那么这将是正用作其时间参考的服务器 IP 地址。

接下来，`st` 字段表明这个参考（服务器）的层。从上面打印的输出中，咱们可以看出，`10.0.0.1` 这个 NTP 设备，有着一个 5 的层级。如下所示，本地设备的层级，将被递增 1 至 6，因为他从一个层级值 5 的服务器接收其时间源。当另一设备与这个本地路由器同步时，那么他就会反映一个 7 的层级，以此类推。用于验证 NTP 配置的第二条命令，是 `show ntp status` 这条命令，其输出如下所示。

```console
R2#show ntp status
Clock is synchronized, stratum 6, reference is 10.0.0.1
nominal freq is 249.5901 Hz, actual freq is 249.5900 Hz, precision is 2**18
reference time is C02C38D2.950DA968 (05:53:22.582 UTC Sun Mar 3 2002)
clock offset is 4.6267 msec, root delay is 3.16 msec
root dispersion is 4.88 msec, peer dispersion is 0.23 msec
```

`show ntp status` 命令的输出表明，时钟是与所配置的 NTP 服务器 (`10.0.0.1`) 同步。这个服务器的层数为 5，因此这个本地设备就反映了 6 的层数。NTP 被配置后，一项有趣的观察，便是本地时间仍默认为 GMT，正如上面输出中所看到的。要确保设备显示正确的时区，咱们必须在设备上执行 `clock timezone` 这条命令。

当咱们打算要将某个路由器设置为 NTP 服务器时，那么咱们就要添加下面的命令，以及和（可选）一个层级。

```console
R1(config)#ntp master ?
<1-15>  Stratum number
```

请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

# `ping`、`traceroute` 及其扩展选项

IOS 中使用频率最高的工具莫过于 `ping` 和 `traceroute` 两条命令。每名网络管理员和工程师，都曾用过这两条命令，但令人惊讶的是，很少有人知道他们下可用的全部能力。这一小节将深入探讨 `ping` 和 `traceroute` 两条命令，这不仅是为了让咱们在考试中取得好成绩，更重要的是，咱们可利用这些信息，支持咱们所负责的网络。


## `ping` 命令

`ping` （Packet InterNet Groper）命令通常用于排除两台设备间的访问故障。`ping` 利用 ICMP 判断某台远端设备是否可访问。当可访问时，ICMP 将测量其接收来自目的地的回传回复所用的时间量。

只有当一次 `ECHO_REQUEST` 到达目的地，且目的地能在预定时间（最大值）间隔内，向 `ping` 源回传回一个 `ECHO_REPLY` 时，`ping` 才算成功。这在下面图 13.4 中得以演示。

![执行中的 `ping` 命令](../images/ping_echo_request.png)

**图 13.4** -- **执行中的 `ping` 命令**


在下面的输出中，咱们可以看到，最大间隔被设置为 36 毫秒。


```console
R1#ping 192.168.1.2

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 20/26/36 ms
```

## 扩展的 `ping` 命令


当一个 `ping` 命令在某台路由器发出时，这条 `ping` 的默认源地址，是数据包用以离开路由器的接口 IP 地址。这可能并不理想，正如咱们将在接下来的示例中看到的那样，当咱们在中途有台会拒绝来自默认接口 `192.168.10.1` 的源 `ping` 时。咱们需要通过使用内部接口 `E1`，将源地址改为放行的地址，比如 `192.168.20.1`。在扩展的 `ping` 命令下，咱们可将源地址，更改为由路由器持有的任何 IP 地址。


下图 13.5 演示了个被阻止的 `ping` 数据包，和一个源自不同接口的放行数据包：

![使用源接口的扩展 `ping`](../images/extended_ping.png)

**图 13.5** -- **使用源接口的扩展 `ping`**

## `ping` 命令的字段说明

在深入了解扩展的 `ping` 选项前，我们首先登录到某台路由器，从高的层级看看这些选项。

```console
Router1#ping
Protocol [ip]:
Target IP address: 192.168.2.1
Repeat count [5]: 50
Datagram size [100]: 1400
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: 172.16.1.1
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]:
Type escape sequence to abort.
Sending 50, 1400-byte ICMP Echos to 192.168.2.1, timeout is 2 seconds:
Packet sent with a source address of 172.16.1.1
```

现在，咱们已经了解了所提供的全部选项，那么让我们深入了解每个选项。


**表 13.5** -- **`ping` 的选项**


| 字段 | 描述 |
| :-- | :-- |
| `Protocol [ip]`: | 提示输入某种支持的协议。要输入 `appletalk`、`clns`、`ip`、`novell`、`apollo`、`vines`、`decnet` 或 `xns`。默认为 `ip` |
| `Target IP address:` | 提示输入咱们计划 `ping` 的目的节点的地址或主机名 |
| `Repeat count [5]:` | 发送到目的地址 `ping` 数据包的个数；默认为 5 |
| `Datagram size [100]:` | `ping` 数据包的大小（字节数）；默认为 100 字节 |
| `Timeout in seconds [2]:` | 超时间隔。默认为 2 （秒）。只有 `ECHO_REPLY` 数据包在这一时间间隔前收到时， `ping` 才会宣告成功 |
| `Extended commands [n]:` | 指定是否一系列额外命令将出现。默认设置为 `no`，而当选择了 `no` 时，`ping` 操作将以没有进一步提示开始。当选择 `yes` 时，咱们将被提示以下输入： |
| `Source address or interface:` | 用作这些 `ping` 探测源地址的路由器接口或 IP 地址。路由器通常会选取出站接口使用 |
| `Type of service [0]:` | 指定出服务类型 (ToS)。所请求的 ToS 会被置于每次 `ping` 探测中。默认为 0 |
| `Set DF bit in IP header? [no]:` | 指定 `ping` 数据包中的不分片（DF）位是否要设置。当 `yes` 指定了时，那么不分片这个选项将不允许该数据包被分片 |
| `Validate reply data? [no]:` | 指定是否要验证回复数据；默认为 `no` |
| `Data pattern [0xABCD]` | 指定在串行线路（端口）上，排除成帧错误及时钟问题的数据（二进制）模式；默认为 `[0xABCD]` |
| `Loose, Strict, Record, Timestamp, Verbose[none]:` | 一些 IP 数据包头部选项。这一提示符提供了多个供选择的选项：
<ul>
<li>
在选择其他选项时，`Verbose`（详细）会被自动选取
</li>
<li>`Record` 会显示（中间）跳数的那些地址
</li>
<li>`Loose`（松散）指定咱们希望数据包要经过的那些跳数地址
</li>
<li>`Strict` （严格）指定咱们希望数据包要经过的跳数，而所有其他跳数都不允许访问
</li>
<li>`Timestamp` （时间戳）用于测量到主机的往返时间
</li>
</ul> |
| `Sweep range of size [n]:` | 允许咱们改变所发送回传数据包的大小；默认为 `no` |


当咱们发出一次 `ping` 时，咱们将收到立即的成功或失败通知。`!` （叹号）表示一次成功的响应，而 `.` （句点）表示无响应。下面是一次成功 `ping` 尝试的输出示例：

```console
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Success rate is 100 percent, round-trip min/avg/max = 1/2/4 ms
```

正如咱们所见，其中没有丢失数据包，甚至其中还有关于往返时间的信息。最快的往返时间（RTT）为 1 毫秒，平均 RTT 为 2 毫秒，最长 RTT 为 4 毫秒。所谓往返时间，是指 `ping` 信号/脉冲/数据包到达目的地并返回所用时间。

丢失一个数据包并不一定意味着什么地方出错了。例如，在进行测试时，咱们将经常会看到这种结果：


```console
.!!!!
Success rate is 80 percent, round-trip min/avg/max = 1/2/4 msconsole
```

在上面的输出中，第一个数据包因没有 ARP 条目失败了，但一旦 MAC 地址映射到了 IP 地址，那么其余数据包就到达了其目的地并得以响应。对这一端点的所有其他测试就都是成功的了。


咱们可能还会看到像是这样的结果：


```console
.!!!....!!!..!!.!.....!!!
```

这表明某种可能由生成树问题，或 MAC 抖动，或某种物理层故障，引起的间歇性连接问题，所有这些可能原因都必须进一步调查。我们将在几个咱们出于测试目的实验中，使用扩展的 `ping` 选项。


> *知识点*：
>
> - the network you are entrusted with
>
> - Packet InterNet Groper, `ping`
>
> - typically used to troubleshoot accessibility between two devices
>
> - ICMP will measure the amount of time it takes to receive the echo reply from the destination
>
> - `ECHO_REQUEST`
>
> - `ECHO_REPLY`
>
> - a prefined time (maximum) interval
>
> - the max interval
>
> - the default source address of the `ping`
>
> - the extended `ping` options
>
> - a high level
>
> - a supported protocol
>
> - the desination node
>
> - timeout interval
>
> - a source address for the probes
>
> - the outbound interface
>
> - the Types of Service, ToS
>
> - the Don't Fragment(DF) bit
>
> - the Don't Fragment option
>
> - the data pattern to troubleshoot framing errors and clocking problems
>
> - the address(es) of the hops
>
> - an immediate notification of success of failure
>
> - a successful reponse
>
> - a successful `ping` attempt
>
> - round-trip time, RTT
>
> - how long the `ping` signal/pulse/packet takes to get there and back
>
> - a intermittent connectivity issue
>
> - MAC flapping


## `traceroute` 命令


虽然 `ping` 可用于检查两台设备之间的连通性，但他并未提供有关两台间路径的信息。例如，当咱们无法从咱们的分支机构，`ping` 到某台数据中心服务器时，咱们就将想要了解这次 `ping` 失败的原因。他是在防火墙处、边缘路由器处、核心路由器处，还是在数据中心交换机处失败的？除非使用 `traceroute` 命令，咱们就将不知道答案。


例如，当咱们打算飞往纽约，咱们可打电话给旅行社说：“请帮我订一张到纽约的机票”。大多数人会想知道，去纽约他们必须中途停留几次，而当他们问到这个问题时，他们很可能会被告知，在亚特兰大将有一次中途停留，然后再抵达纽约。这就是 `ping` 命令与 `traceroute` 命令的区别。`ping` 命令只是告诉咱们目的地状态，而 `traceroute` 命令则会告诉咱们，到达目的地咱们将经过的路径。`traceroute` 命令的目的，是 “追踪” 数据包到达目的地所经过的路径。

我们继续并运行 `traceroute` 这条命令，检查到 `4.2.2.1` 的路径：

```console
Router1#traceroute 4.2.2.1
Type escape sequence to abort.
Tracing the route to a.resolvers.level3.net (4.2.2.1)
1 te0-1-0-6.rcr21.ord07.atlas.ispco.com (38.122.188.17) 0 msec 12 msec 4 msec
2 be2110.router42.ord01.atlas.ispco.com (114.14.1.37) 0 msec 4 msec
3 be2761.router41.ord03.atlas.ispco.com (114.14.41.18) 4 msec
4 proispinc.ord03.atlas.ispco.com (114.14.12.82) 2132 msec 432 msec
5 a.resolvers.level3.net (4.2.2.1) 0 msec 4 msec 0 msec
Router1#
```

正如咱们所见，在这个网络设备与 `4.2.2.1` 之间，共有五 “跳”。每跳都是个将数据包转发到下一路由器的路由器。咱们还可看到，数据包在各跳间的穿越所用的时间。例如，咱们可以看到，一旦咱们到达第 4 跳，咱们就可能遇到个需要与 ispco.com 处的 `proispinc.ord03` 所有者一起看看的网络问题。


那么，我们是如何获取到这些信息的呢？

1. 三个数据报被发出，每个都带有 设置为 1 的 TTL 字段，这会造成数据报一旦到达路径上的第一个路由器，就会 “超时”。然后，这个路由器就会响应一个 ICMP 的 “超时” 报文；
2. 再有三条 UDP 报文被发出，每条都带有设置为 2 的 TTL 值。这会造成到目的地路径上的第二个路由器，返回 ICMP 的 “超时” 报文；
3. 这一过程会持续，直到数据包到达目的地，并直到发起该 `traceroute` 的系统，收到自通往目的地路径上的每个路由器的 ICMP “超时” 报文为止。


## 扩展的 `traceroute` 命令

扩展的 `traceroute` 命令提供了一些额外的故障排除工具：


```console
Router#traceroute
Protocol [ip]:
Target IP address: 4.2.2.1
Source address: 31.111.118.29
Numeric display [n]:
Timeout in seconds [3]:
Probe count [3]:
Minimum Time to Live [1]:
Maximum Time to Live [30]:
Port Number [33434]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Type escape sequence to abort.
Tracing the route to a.resolvers.level3.net (4.2.2.1)
```

下表 13.6 列出了这些 `traceroute` 命令字段说明：

**表 13.6** -- **`traceroute` 选项**

| 字段 | 描述 |
| :-- | :-- |
| `Protocol [ip]:` | 提示输入某种支持的协议；默认为 `ip` |
| `Target IP address` | 咱们必须输入某个主机名或 IP 地址。无默认值 |
| `Source address:` | 要用作 `traceroute` 探测源地址的该路由器接口或 IP 地址 |
| `Numeric display [n]:` | 默认为会同时显示符号及数字；但咱们可取消符号显示 |
| `Timeout in seconds [3]:` | 等待某个探测数据包响应的秒数；默认为 3 秒 |
| `Probe count [3]:` | 在每个 TTL 级别要发送的探测次数；默认值为 3 |
| `Minimum Time to Live [1]:` | 最初那些探测的 TTL 值；默认为 1 |
| `Maximum Time to Live [30]:` | 可使用的最大 TTL 值。默认值为 30。当目的地到达，或该值到达时，`traceroute` 命令便会终止 |
| `Port Number [33434]:` | UDP 探测报文所使用的目的端口；默认为 33434 |
| `Loose, Strict, Record, Timestamp, Verbose [none]:` | 一些 IP （数据包）头部选项。咱们可指定任意组合。`traceroute` 命令会会提示输入一些必需字段 |


当计时器在响应到达前超时，那么 `traceroute` 会打印一个星号 (`*`)，正如咱们在下面所看到的。


```console
Router1#traceroute 9.1.2.3
Type escape sequence to abort.
Tracing the route to 9.1.2.3
1 * * *
2 * * *
3 * * *
4 * *
Router1#
```

> *知识点*：
>
> - to "trace" the path the packet took to reach the desination
>
> - each hop is a router forwarding the packet to the next router
>
> - the amount of time it took for the packet to traverse between each hop
>
> - an ICMP "time exceeded" message
>
> - a source address for the probes
>
> - both a symbolic and numeric display
>
> - a probe packet
>
> - the number of probes to be sent at each TTL level
>
> - the destination port used by the UDP probe messages
>
> - IP header options




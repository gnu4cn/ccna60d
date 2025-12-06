# IPv6 与 IPv4 的比较

网络工程师应该非常清楚，相对于 IPv4，IPv6 所带来的优势。纵观 IPv6 的那些增强功能，我们可总结出下面这些：

- IPv6 有着扩展的地址空间，从 32 位扩展到 128 位；
- IPv6 使用十六进制记法，而不是点分十进制符号的记法（如 IPv4 下那样）；
- 由于扩展的地址空间，IPv6 地址具有全球唯一性，从而消除了 NAT 的需要；
- IPv6 有着固定的头部长度（40 字节），而允许运营商提高交换效率；
- 通过在 IPv6 头部和传输层头部间放置一些扩展的头部，IPv6 支持一些增强选项（提供新特性）；
- IPv6 提供了地址的自动配置，即使在没有 DHCP 服务器下，仍提供了能动态的 IP 地址分配；
- IPv6 提供了流量标记的支持；
- IPv6 有着内置的安全能力，包括经由 IPSec 的身份验证和隐私保护；
- IPv6 提供了发送数据包到目的地址前的 MTU 的路径发现，从而消除了（数据包）分片/分段的需要；
- IPv6 支持站点多重归属；
- IPv6 使用 ND（邻居发现）协议代替 ARP；
- IPv6 使用 AAAA 的 DNS 记录，而不是 A 记录（如 IPv4 下）；
- IPv6 使用站点本地寻址，而不是 RFC 1918（如 IPv4 下）；
- IPv4 和 IPv6 用到不同的路由协议；
- IPv6 提供任播分址。

## IPv6 分址的配置、验证和故障排除

我们已经介绍了在接口上配置 IPv6 分址的一些可用选项。咱们可手动添加咱们自己的地址，或者只依靠地址自动配置，应用一个地址。

正如咱们所知道的，直连的 IPv6 接口，并不需要位处同一子网才能通信，尽管他们很可能为符合咱们工作的所在地网络设计和寻址策略，而在同一子网。

### IPv6 分址的故障排除工具

排除网络中 IPv6 故障，会因使用的路由协议和传输机制，而有很大差异，这一小节只专门讨论 IPv6 分址的故障排除。除检查接口是否有拼写错误（IPv6 分址问题的常见原因），咱们还应了解下表 3.12 中，将帮助咱们排除 IPv6 地址部署问题的那些命令。请在任何咱们完成的 IPv6 实验中一定要试试。

**表 3.12** -- **IPv6 命令和操作**

| 关键字 | 描述 |
| :-: | :-: |
| `Router#clear ipv6 route *` | 删除路由表中的所有 IPv6 路由。 |
| `Router#clear ipv6 route 2001:ab8:c1:1::/64` | 删除路由表中某条指定 IPv6 路由。 |
| `Router#clear ipv6 traffic` | 重置 IPv6 流量计数器。 |
| `Router#debug ipv6 packet` | 显示 IPv6 数据包调试消息。 |
| `Router#debug ipv6 routing` | 显示有关 IPv6 路由表更新及路由缓存更新的调试消息。 |
| `Router#show ipv6 interface` | 显示 IPv6 接口的 IPv6 状态。 |
| `Router#show ipv6 interface brief` | 显示 IPv6 接口的汇总信息。 |
| `Router#show ipv6 neighbors` | 显示 IPv6 邻居信息。 |
| `Router#show ipv6 route` | 显示 IPv6 的路由表。 |
| `Router#show ipv6 route summary` | 显示 IPv6 路由表的汇总信息。 |
| `Router#show ipv6 static` | 显示路由表中的静态 IPv6 路由。 |
| `Router#show ipv6 static 2001:ab8:1:0/16` | 显示特定静态路由信息。 |
| `Router#show ipv6 static interface serial0/0` | 显示该特定接口作为出口接口下的静态路由信息。 |
| `Router#show ipv6 static detail` | 显示 IPv6 静态路由的详细条目。 |
| `Router#show ipv6 traffic` | 显示 IPv6 流量的统计数据。 |

上面的大多数命令都不言自明，但他们中有些对咱们来说可能很陌生。重要的是在咱们进行 IPv6 实验时，要尝试使用这些命令并记录输出结果。在做过几次本书中的实验后，也请咱们自己做实验。这是了解这种技术与可用输出的唯一方法。同样重要的是，一些调试命令以及清除路由的命令，可能会导致流量或 CPU 激增，因此在执行此类命令前，咱们可能需要寻求一次计划中断的许可。

我们来深入了解其中两条可帮助咱们解决 IPv6 问题的命令。


### `debug ipv6 packet`

当咱们无法亲临现场，并使用专门软件完成流量的数据包捕获时，咱们会受益于 `debug ipvs packet` 这条命令。这条命令将显示设备接收到的、生成的及转发的所有数据包。不用说，数据量会让人应接不暇，因此强烈建议咱们在该命令末尾指定某条 ACL，这样咱们就只会看到咱们要查看的数据包，而不是所有 IPv6 数据包。当咱们未能指定 ACL 时，咱们很可能就将导致系统性能问题，而且咱们会有太多数据需要分析。


以下示例给出了 `debug ipv6 packet` 命令的输出。有关各个字段与输出的详细信息，咱们可阅读 [Cisco IOS IPv6 命令参考](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/command/ipv6-cr-book/ipv6-i1.html)。

```console
*Mar  1 00:03:11.535: IPV6: source :: (FastEthernet0/0)
*Mar  1 00:03:11.535:       dest FF02::1:FFED:0
*Mar  1 00:03:11.535:       traffic class 224, flow 0x0, len 64+14, prot 58, hops 255, forward to ulp
*Mar  1 00:03:12.483: IPV6: source FE80::C001:6FF:FEED:0 (FastEthernet0/0)
*Mar  1 00:03:12.483:       dest FF02::1
*Mar  1 00:03:12.483:       traffic class 224, flow 0x0, len 72+14, prot 58, hops 255, forward to ulp
*Mar  1 00:03:12.507: IPV6: source FE80::C001:6FF:FEED:0 (FastEthernet0/0)
*Mar  1 00:03:12.507:       dest FF02::1
*Mar  1 00:03:12.507:       traffic class 224, flow 0x0, len 72+14, prot 58, hops 255, forward to ulp
```

### `show ipv6 traffic`


`show ipvé traffic` 命令将显示有关 IPv6 的，有助于故障排除的重要统计数据。例如，咱们正经历到咱们路由器上特定接口，及源自咱们路由器接口的连通性问题。咱们运行 `show ipv6 traffic` 命令，并看到如下显示。那么有什么突出的现象，可能是该问题的根本原因呢？


```console
hostname#show ipv6 traffic
IPv6 statistics:
Rcvd: 545 total, 545 local destination
    0 source-routed, 0 truncated
    0 format errors, 0 hop count exceeded
    0 bad header, 0 unknown option, 0 bad source     
    0 unknown protocol, 0 not a router     
    218 fragments, 109 total reassembled     
    0 reassembly timeouts, 0 reassembly failures
Sent: 255 generated, 0 forwarded     
    1 fragmented into 2 fragments, 0 failed     
    0 encapsulation failed, 200 no route, 0 too big
Mcast: 168 received, 70 sent
ICMP statistics:
Rcvd: 116 input, 0 checksum errors, 0 too short    
    0 unknown info type, 0 unknown error type    
    unreach: 0 routing, 0 admin, 0 neighbor, 0 address, 0 port    
    parameter: 0 error, 0 header, 0 option    
    0 hopcount expired, 0 reassembly timeout,0 too big    
    0 echo request, 0 echo reply    
    0 group query, 0 group report, 0 group reduce    
    0 router solicit, 60 router advert, 0 redirects    
    31 neighbor solicit, 25 neighbor advert
Sent: 85 output, 0 rate-limited    
    unreach: 0 routing, 0 admin, 0 neighbor, 0 address, 0 port    
    parameter: 0 error, 0 header, 0 option    
    0 hopcount expired, 0 reassembly timeout,0 too big    
    0 echo request, 0 echo reply    
    0 group query, 0 group report, 0 group reduce    
    0 router solicit, 18 router advert, 0 redirects    
    33 neighbor solicit, 34 neighbor advert
UDP statistics:
Rcvd: 109 input, 0 checksum errors, 0 length errors    
    0 no port, 0 dropped
Sent: 37 output
TCP statistics:
Rcvd: 85 input, 0 checksum errors
Sent: 103 output, 0 retransmitted
```

请注意，在 IPv6 发送的统计信息下，有 255 个数据包已生成，而其中 200 个列出了 “无路由”。该命令很好地总结了将有助于咱们排除网络故障的 IPv6 特定信息。

请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处第 3 天的考试。



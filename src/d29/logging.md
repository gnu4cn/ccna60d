# ACL 的日志记录

默认情况下，与流经路由器接口数据包匹配的 ACL 条目，会创建一些递增的计数器，这些计数器可通过使用 `show ip access-lists` 这条命令加以分析，正如下面的示例中可以看到的。

```console
Router#show ip access-lists
Extended IP access list test
	10 deny tcp any any eq 80 (10 matches)
	20 permit ip any any (56 matches)
```

当咱们需要有关 ACL 条目匹配流量的更详细信息时，咱们可针对相关 ACL 条目，配置 `log` 或 `log-input` 参数。


```console
Router(config)#ip access-list extended test
Router(config)#no 10
Router(config)#10 deny tcp any any eq 80 log
Router#show ip access-lists
Extended IP access list test
	10 deny tcp any any eq 80 log
	20 permit ip any any (83 matches)
```

在上面的配置示例中，测试 ACL 条目 10 的 ACL 日志记录就已配置。当某个数据包命中该 ACL 条目时，这个 ACL 的计数器将持续递增，而路由器也会生成一条，包含了有关这次特定 ACL 命中详细信息的日志消息：


```console
%SEC-6-IPACCESSLOGP: list test denied tcp 10.10.10.2(24667) -> 10.10.10.1(80), 1 packet
```

当咱们需要有关这一事务的更多细节时，咱们可以 `log-input` 参数，替换 `log` 参数，正如咱们可在下面的示例中看到的。


```console
Router(config)#ip access-list extended test
Router(config)#no 10
Router(config)#10 deny tcp any any eq 80 log-input
Router#show ip access-lists
Extended IP access list test
	10 deny tcp any any eq 80 log-input
	20 permit ip any any (125 matches)
```

当这一特定 ACL 条目被命中时，一条包含了传入接口及源 MAC 地址的更加详细日志消息，将由该路由器生成。

```console
%SEC-6-IPACCESSLOGP: list test denied tcp 10.10.10.2(14013) (FastEthernet0/0 00aa.aabb.ccdd) -> 10.10.10.1(80), 1 packet
```

对于查看到底那些数据包被丢弃/放行的故障排除，ACL 的日志记录会非常有用，但对于一些真实世界的情形，有一点则要必须注意（这超出了 CCNA 考试的范围）：包含 `[log]` 或 `[log-input]` 关键字的 ACL 条目，会由路由器进程交换（而不是现代路由器上默认的 [CEF 交换](../d17/cef.md)）。这样做就需要更多的路由器 CPU 周期，当有大量流量名中日志记录的 ACL 条目是，其就会造成问题。




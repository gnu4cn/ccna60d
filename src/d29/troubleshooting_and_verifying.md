# ACL 的故障排除与验证


我（作者）相信只要掌握了这些配置命令及规则，咱们就应对访问控制列表没什么问题。当咱们的 ACL 不工作时，首先要通过 `ping` 检查是否有基本的 IP 连通性问题。然后要检查咱们是否已应用了咱们的 ACL，是否有拼写错误，以及咱们是否需要放行任何 IP 流量通过（要记住那条隐式的 `"deny all"`）。ACL 故障排除过程中的一些最重要的验证步骤，包括：

- 检查 ACL 的统计信息
- 检查放行的网络
- 检查 ACL 的接口及方向


## 检查 ACL 的统计数据

在咱们已成功配置了某个 ACL 并将其应用到某个接口后，有那么一种咱们可用以验证这个 ACL 行为正确性，尤其是某个 ACL 条目被用到（命中）次数的方法，就非常重要。根据命中次数，咱们可调整咱们的过滤策略，或咱们可增强咱们的 ACL，以提高整体安全性。根据咱们的各种需要，咱们可在全局级别，或对每个接口（从 10S 12.4 开始），检查 ACL 的统计数据。

### 全局的 ACL 统计数据

全局的 ACL 统计数据，可通过使用 `show ip access-list` 或 `show access-list` 两条命令检查，他们还可指向某个编号的或命名的 ACL：


```console
Router#show ip access-lists
Extended IP access list test
	10 deny tcp any any eq 80 (10 matches)
	20 permit ip any any (56 matches)
```

在那些咱们于不同接口上应用同一个 ACL 的情况下，这种方法不会提供非常具体的信息，因为他提供了总体的统计数据。


### 每个接口的 ACL 统计


在咱们打算检查每个接口的 ACL 入站或出站命中次数情形下，咱们可使用 `show ip access-list interface <interface number> [in|out]` 这条命令，如下所示：


```console
Router#show ip access-list interface FastEthernet0/1 in
Extended IP access list 100 in
	10 permit ip host 10.10.10.1 any (5 matches)
	30 permit ip host 10.10.10.2 any (31 matches)
```

当未指定方向，那么应用到特定接口的任何输入或输出 ACL，都将得以显示。这一特性又被称为 “ACL 的可管理性”，并从 10S 12.4 开始提供。

## 检查放行的网络

有时，特别是在一些咱们必须配置许多个 ACL 的大型环境中，在配置这些 ACL 条目时咱们可能犯下拼写错误，而这就会导致错误流量于不同接口上被阻止。为了验证正确的 ACL 条目（一些放行及拒绝语句），咱们可使用 `show run| section access-list` 或 `show ip access-list` 命令，如同前面那些小节所述。

隐式的 `deny all` 还将阻止所有的路由协议流量，因此要确保在必要时，咱们要予以放行。

要放行 RIP，就要指定以下内容：

```console
access-list 101 permit udp any any eq rip
```

要放行 OSPF，就要指定以下内容：

```console
access-list 101 permit ospf any any
```

要放行 EIGRP，就要指定以下内容：

```console
access-list 101 permit eigrp any any
```


## 检查 ACL 的接口及方向

在将某个 ACL 应用到某个接口时，一种常见错误，便是将其应用在了错误方向，即入站而不是出站，或出站而不是入站。从功能与安全两个角度看，这种错误都会造成很多问题。在 ACL 故障排除过程中，咱们应采取的初始步骤之一，便是要检查 ACL 是否应用到正确的接口与正确方向。

有多条命令可以验证这一点，包括 `show run` 及 `show ip access-list interface <interface> [in|out]` 两条命令。


请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

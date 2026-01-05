# ACL 规则

这是要掌握的最难部分之一。我（作者）从未在一本思科手册中，看到过一个完整的规则列表。有的手册笼统地提到他们，或解释了其中一些规则，但随后便完全忽略了其他规则。困难在于，这些规则总是在那里应用着，但（直到现在）咱们只能通过试误法找到他们。以下是咱们需要直到的一些规则：


## ACL 规则 1 -- 每个接口每个方向上，只使用一个 ACL


这很合理。咱们不会打算在同一接口上，有多个完成不同事情的 ACL。只需配置一个，完成咱们需要他完成的所有事情的 ACL，而不是将过滤器，分散到两个或更多列表中。我（作者）本可以将 “每种协议” 添加到上面的规则，因为咱们本可以有个 IPX 的访问控制列表，但 IP 确实是现代网络用途下，仅有的协议。


![接口上的一个方向仅做一条ACL](../images/0901.png)

**图 29.1** -- **每个接口每个方向上一个 ACL**

## 规则 2 -- ACL 的行会自上而下处理

一些工程师会在他们的 ACL 未按预期执行时，感到困惑。路由器将查看 ACL 的顶部行，当其发现一次匹配时，他将止步于此并将不检查其他行。出于这一原因，咱们就需要把那些最具体的条目，放在 ACL 的顶部。例如，以阻止主机 `172.16.1.1` 的 ACL 为例：

| ACL 命令（语句）      |       | 结果|
| :--                   | :-:   | :-- |
| `Permit 10.0.0.0`     |       | 无匹配 |
| `Permit 192.168.1.1`  |       | 无匹配 |
| `Permit 172.16.0.0`   | 4     | 匹配 -- 放行 |
| `Permit 172.16.1.0`   |       | 未被处理 |
| `Deny 172.16.1.1`     |       | 未被处理 |


在上面的示例中，咱们应该把 `Deny 172.16.1.1` 这行放在顶部，或至少要在 `Permit 172.16.0.0` 这条语句上面。

## ACL 规则 3 -- 在每个 ACL 的底部都有条隐式的 `deny all`


这一规则会让许多工程师望而却步。在每个 ACL 的底部，都有一条隐形命令。这条命令被设置为拒绝仍未匹配到的全部流量。阻止这条命令生效的唯一方法，是在底部手动配置一条 `permit all`。例如，以一个来自 IP 地址 `172.20.1.1` 的传入数据包为例：

| ACL 命令（语句）      | 结果 |
| :--                   | :-- |
| `Permit 10.0.0.0`     | 无匹配 |
| `Permit 192.168.1.1`  | 无匹配 |
| `Permit 172.16.0.0`   | 无匹配 |
| `Permit 172.16.1.0`   | 无匹配 |
| `[Deny all]`          | 匹配 -- 丢弃数据包 |


咱们实际上希望这个数据包被该路由器放行，但相反该路由器拒绝他。原因就在于作为一种安全手段的那条隐式 `deny all`。

## ACL 规则 4 -- 路由器无法过滤自身生成的流量

在于某个真实网络上部署咱们的 ACL 前进行测试时，这条规则会造成混乱。路由器不会过滤他自己生成的流量。这点在下图 29.2 种得以演示。

![对自身流量的 ACL 测试](../images/0902.png)

**图 29.2** -- **对自身产生流量的 ACL 测试**

## ACL 规则 5 -- 咱们无法编辑某条线上 ACL

事实上，在 10S 12.4 前，咱们原本可以编辑某条命名的 ACL，而不能编辑标准或扩展的 ACL。这曾是 ACL 架构的一种局限。在 10S 12.4 前，当咱们打算编辑某条标准或扩展的 ACL 时，咱们就必须遵循以下步骤（我（作者）以 99 号列表为例）：

1. 以 `no ip access-group 99 in` 这条命令，停止接口上的 ACL 流量；
2. 拷贝并粘贴该 ACL 到记事本中，并于该处编辑他；
3. 进入 ACL 模式并粘入这条新的 ACL；
4. 再次应用这个 ACL 到接口。


以下是在某台真实路由器上的操作步骤：

ACL 已被创建并应用到接口：

```console
Router>en
Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#access-list 1 permit 172.16.1.1
Router(config)#access-list 1 permit 172.16.2.1
Router(config)#interface FastEthernet0/0
Router(config-if)#ip access-group 1 in
```

从活动接口上撤下：

```console
Router(config)#int FastEthernet0/0
Router(config-if)#no ip access-group 1 in
Router(config-if)#^Z
```

显示出这些 ACL。拷贝并粘贴到记事本中，并进行更改：

```console
Router#show run ← or show ip access lists
access-list 1 permit host 172.16.1.1
access-list 1 permit host 172.16.2.1
```

咱们实际上还需要在各行配置之间添加一个感叹号（当咱们是将其粘贴进去时），告诉路由器执行一次回车：

> *译注*：[wikipedia: 回车符](http://zh.wikipedia.org/wiki/%E5%9B%9E%E8%BD%A6%E7%AC%A6)。


```console
access-list 1 permit host 172.16.1.1
!
access-list 1 permit host 172.16.2.2
```

粘贴到路由器配置中的行，如下所示。要删除以前 ACL，然后粘贴新的版本进去：

```console
Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#no access-list 1
Router(config)#access-list 1 permit host 172.16.1.1
Router(config)#!
Router(config)#access-list 1 permit host 172.16.2.2
Router(config)#exit

%SYS-5-CONFIG_I: Configured from console by console
Router#show ip access
Router#show ip access-lists
Standard IP access list 1
	permit host 172.16.1.1
	permit host 172.16.2.2
Router#
Router(config)#int FastEthernet0/0
Router(config-if)#ip access-group 1 in ← reapply to the interface
```


当咱们使用的是 Packet Tracer 时，那么上面的命令可能就不工作。此外，请在路由器上尝试这些命令，因为他们属于考试主题。请记住，为了避免奇怪或不可预测行为，在咱们编辑 ACL 前，应先在接口上禁用这个 ACL（从而其不再是线上的）。很快我（作者）就将向咱们展示，如何在 10S 12.4 及以后版本上编辑线上的 ACL。

## ACL 规则 6 -- 禁用接口上的 ACL

许多工程师在他们测试或短时停用 ACL 时，实际上会将其完全删除。这样做是没有必要的。当咱们想要 ACL 停止工作时，咱们只需将他从其被应用到的活动接口上移除。

```console
Router(config)#int FastEthernet0/0
Router(config-if)#no ip access-group 1 in
Router(config-if)#^Z
```


## ACL 规则 7 -- 咱们可重用同一个 ACL

我（作者）曾在一些真实网络中，经常看到这种情况。咱们通常将在咱们的整个网络上，使用同一个 ACL 策略。与其配置数个 ACL，不如简单地引用同一 ACL，并将其应用到咱们所需的许多接口。下图 29.3 演示了这一概念。


![ACL 的重用](../images/0903.png)


**图 29.3** -- **咱们可重用 ACL**


## ACL 规则 8 -- 保持简短！

ACL 下的基本规则，就是要保持简短且重点突出。许多新手 Cisco 工程师，都会将他们的 ACL 扩展到许多行，其实只要稍加思考，其便可被收紧到仅几行的配置。我（作者）前面曾提到，咱们会希望咱们的那些最具体配置行，位于顶部。这是种很好的做法，节省了路由器的 CPU 周期。

良好的 ACL 配置技能，来自知识与实践。

## ACL 规则 9 -- 尽可能将咱们的 ACL 放在靠近源处

思科的文档建议我们，将 **扩展的 ACL** 放在尽可能靠近 **源** 处，而将 **标准的 ACL** 放在尽可能靠近 **目的** 处，因为这样做将避免不必要开销，而仍将放行任何的 “合法” 流量。

![将 ACL 尽量放在离源近的地方](../images/0904.png)

**图 29.4** -- **将咱们的 ACL 放在靠近源处**

**FARAI 有言**：“思科的官方建议是，**扩展的 ACL** 要尽可能靠近 **源**，而 **标准的 ACL** 尽可能靠近 **目的**。"




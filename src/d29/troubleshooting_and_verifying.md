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

有时，特别是在一些咱们必须配置许多 ACL 的大型环境中，在配置 ACL 条目时可能会出现错字，这可能会导致在不同接口上阻止错误的流量。为了验证 ACL 条目（许可和拒绝语句）是否正确，可以使用 show run| section access-list 或 show ip access-list 命令，如前几节所述。
隐式 deny all 也会阻止所有路由协议流量，因此请确保在必要时允许它。
要允许 RIP，请指定以下内容：

如未有指定方向，则应用到该特定接口上的任何进或出方向的 ACL 都将显示出来。此特性也叫做“ ACL 可管理能力（ACL Manageability）”，自`IOS 12.4`开始可用。

### 检查那些放行的网络

**Verifying the Permitted Networks**

有的时候，特别实在那些必须配置很多 ACLs 的大型网络中，在配置 ACL 条目是就会犯下一些书写错误，而这就会导致不同接口上有错误的流量被阻止。为了检查那些正确的 ACL 条目（也就是 permit 及 deny 语句），可以照前面章节中讲到的那样，使用`show run | section access-list`或者`show ip access-list`命令。

### 检查 ACL 的接口和方向

**Verifying the ACL Interface and Direction**

在将某条 ACL 应用到某个接口上时，一个常见的错误就是将其应用到了错误的方向，也就是本应在进方向的，却应用到了出方向，或者本应在出方向的，却应用到了进方向。这会导致功能上和安全方面的很多问题。于是在 ACL 故障排除上的最先几步之一，就是检查 ACL 应用到正确的接口及正确的方向。

为此，可以使用多种命令，包括`show run`及`show ip access-list interface <interface> | [in|out]`命令。

## 第九天的问题

1. You can have a named, extended, and standard ACL on one incoming interface. True or false?
2. You want to test why your ping is blocked on your Serial interface. You ping out from the router but it is permitted. What went wrong? (Hint: See ACL Rule 4.)
3. Write a wildcard mask to match subnet mask `255.255.224.0`.
4. What do you type to apply an IP access control list to the Telnet lines on a router?
5. How can you verify ACL statistics per interface (name the command)?
6. How do you apply an ACL to an interface?

## 第九天问题的答案

1. False. You can only configure a single ACL on an interface per direction.
2. A router won’t filter traffic it generated itself.
3. `0.0.31.255`.
4. access-class .
5. Issue the show ip access-list interface command.
6. Issue the `ip access-group <ACL_name> [in|out]` command.

## 第九天的实验

### 标准 ACL 实验

**Standard ACL Lab**

**拓扑图**

![标准 ACL 实验拓扑图](../images/0909.png)

标准 ACL 实验拓扑图

**实验目的**

学习如何配置一条标准 ACL 。

**实验步骤**

1. 配置上面的网络。在两台路由器上加入一条静态路由，领导到任何网络的任何流量都从串行接口发出。这么做的原因是，尽管这不是一个路由实验，仍然需要路由的流量。把`.1`地址加到路由器`A`的串行接口，`.2`地址加到路由器`B`的串行接口。


    ```console
    RouterA(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 在路由器 A 上配置一条标准 ACL ，放行`192.168.1.0/10`网络。默认情况下，其它所有网络都将被阻止。


    ```console
    RouterA(config)#access-list 1 permit 192.168.1.0 0.0.0.63
    RouterA(config)#int Serial0/1/0
    RouterA(config-if)#ip access-group 1 in
    RouterA(config-if)#exit
    RouterA(config)#exit
    RouterA#
    ```

3. 从路由器`B`上测试该条 ACL ，默认将使用`10.0.0.1`地址。


    ```console
    RouterB#ping 10.0.0.1
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 10.0.0.1, timeout is 2 seconds:
    UUUUU
    Success rate is 0 percent (0/5)
    ```

4. 以源地址`192.168.1.1`来做另一个 ping 测试，这将没有问题。


    ```console
    RouterB#ping
    Protocol [ip]:
    Target IP address: 10.0.0.1
    Repeat count [5]:Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 192.168.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 10.0.0.1, timeout is 2 seconds:
    Packet sent with a source address of 192.168.1.1
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms
    ```

### 扩展 ACL 实验

**拓扑图**

![扩展 ACL 实验的拓扑图](../images/0910.png)

扩展 ACl 实验的拓扑图

**实验目的**

学习如何配置一条扩展 ACL 。

**实验步骤**

1. 配置上述网络。在路由器`B`上加入一条静态路由，令到前往所有网络的所有流量都从串行接口上发出。这么做是因为，尽管这不是一个路由实验，仍然需要路由流量。


    ```console
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 在路由器`A`上配置一条扩展 ACL 。仅允许往环回接口上发起 Telnet 流量。


    ```console
    RouterA(config)#access-list 100 permit tcp any host 172.20.1.1 eq 23
    RouterA(config)#int s0/1/0
    RouterA(config-if)#ip access-group 100 in
    RouterA(config-if)#line vty 0 15
    RouterA(config-line)#password cisco
    RouterA(config-line)#login
    RouterA(config-line)#^Z
    RouterA#
    ```

    上面的那条 ACL 编号为`100`, 这就告诉路由器，它是一条扩展 ACL 。所要允许的是 TCP 。该条 ACL 允许来自任何网络的，目的地址为`172.20.1.1`的 Telnet 端口，端口号为`23`。在执行`show run`命令时，就会看到，路由器实际上会将端口号替换为其对应的名称，就像下面演示的这样。

    ```console
    access-list 100 permit tcp any host 172.20.1.1 eq telnet
    ```

3. 现在，从路由器 B 上做一个 Telnet 测试。首先往路由器`A`的串行接口上 Telnet ，将会被阻止。接着测试环回接口。


    ```console
    RouterB#telnet 10.0.0.1
    Trying 10.0.0.1 ...
    % Connection timed out; remote host not responding
    RouterB#telnet 172.20.1.1
    Trying 172.20.1.1 ...Open
    User Access Verification ←password won’t show when you type it
    Password:
    RouterA> ←Hit Control+Shift+6 together and then let go and press the X key to quit.
    ```

> **注意：** 我们会在其它实验中涉及 ACLs ，但你真的需要完全地掌握这些内容。为此，要尝试其它的 TCP 端口，比如`80`、`25`等等。另外，要试试那些 UDP 端口，比如`53`。如没有将一台 PC 接上路由器，则是无法对这些其它端口进行测试的。

## 命名 ACL 实验

**拓扑图**

![命名 ACL 实验拓扑图](../images/0911.png)

命名 ACL 实验拓扑图

**实验目的**

学习如何配置一条命名 ACL 。

**实验步骤**

1. 配置上面的网络。在两台路由器上加入一条静态路由，领导到任何网络的任何流量都从串行接口发出。这么做的原因是，尽管这不是一个路由实验，仍然需要路由的流量。


    ```console
    RouterA(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 在路由器`B`上加入一条扩展的命名 ACL 。只放行主机`172.20.1.1`，阻止其它任何主机或网络。


    ```console
    RouterB(config)#ip access-list extended blockping
    RouterB(config-ext-nacl)#permit icmp host 172.20.1.1 any
    RouterB(config-ext-nacl)#exit
    RouterB(config)#int s0/1/0
    RouterB(config-if)#ip access-group blockping in
    RouterB(config-if)#
    ```

3. 现在分别从路由器`A`的串行接口和换回接口发出`ping`来测试该条 ACL 。


    ```console
    RouterA#ping 192.168.1.1
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
    UUUUU
    Success rate is 0 percent (0/5)
    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.1
    Repeat count [5]:
    Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 172.20.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
    Packet sent with a source address of 172.20.1.1
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/34/47 ms
    ```

    > **注意：** 你需要搞清楚各种服务，以及各种服务所用到的端口。否则，要配置 ACL 就会非常棘手。本条 ACL 相当简单，因此可以仅用一行完成。在有着路由协议运行时，需要放行它们。

    要放行 RIP ，就要像这样指定。

    ```console
    access-list 101 permit udp any any eq rip
    ```

    要放行 OSPF ，要像这样指定。

    ```console
    access-list 101 permit ospf any any
    ```

    要放行 EIGRP ，要像这样指定。

    ```console
    access-list 101 permit eigrp any any
    ```


（End）



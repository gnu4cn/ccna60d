# 第 29 天实验

## 标准 ACL 实验

### 拓扑结构

![标准 ACL 实验拓扑图](../images/0909.png)

### 实验目的

学习如何配置标准 ACL。

### 实验步骤

1. 配置上面的网络。在两个路由器上添加静态路由，使任何网络的任何流量，都会离开串行接口。咱们这样做的原因是，虽然不是个路由实验，但咱们仍需要流量来路由。添加 `.1` 到 `Router A` 的串行接口，并添加 `.2` 到 `Router B` 的串行接口；

    ```console
    RouterA(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

    ```console
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 在 `Router A` 上配置一个标准 ACL，放行 `192.168.1.0/26` 这个网络。默认情况下，所有其他网络都将被阻止；

    ```console
    RouterA(config)#access-list 1 permit 192.168.1.0 0.0.0.63
    RouterA(config)#int Serial0/1/0
    RouterA(config-if)#ip access-group 1 in
    RouterA(config-if)#exit
    RouterA(config)#exit
    RouterA#
    ```

3. 通过在 `Router B` 上运行 `ping` 测试这个 ACL，默认情况下其将使用 `10.0.0.1` 这个地址；


    ```console
    RouterB#ping 10.0.0.1
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 10.0.0.1, timeout is 2 seconds:
    UUUUU
    Success rate is 0 percent (0/5)
    ```

4. 测试另一个 `ping` 操作，但其要从 `192.168.1.1` 发起，而这次测试应工作；


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

## 扩展的 ACL 实验

### 拓扑结构

![扩展 ACL 实验的拓扑图](../images/0910.png)

### 实验目的

学习如何配置扩展 ACL。

### 实验步骤

1. 配置上面的网络。在 `Router B` 上添加静态路由，已便任何网络的任何流量，都会离开串行接口。咱们这样做的原因是，虽然这不是个路由实验，但咱们仍需要流量来路由；

    ```console
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 添加一个扩展 ACL 到 `Router A`。只放行到咱们环回接口的 Telnet 流量。记住还要放行 Telnet；


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

    上面的 ACL 行编号为 100，这告诉路由器他属于扩展的 ACL。咱们打算放行的服务（`telnet`）使用 TCP。他正放行来自任何网络，目的为主机 `172.20.1.1` 的 Telnet 23 端口的 TCP。当咱们执行一条 `show run` 命令时，路由器实际上会以（协议）名称，替换这个端口号，如下所示：

    ```console
    access-list 100 permit tcp any host 172.20.1.1 eq telnet
    ```

3. 现在在 `Router B` 上测试 Telnet。首先，Telnet 到 `Router A` 上的串行接口，这应被阻止了。然后测试环回接口。


    ```console
    RouterB#telnet 10.0.0.1
    Trying 10.0.0.1 ...
    % Connection timed out; remote host not responding

    RouterB#telnet 172.20.1.1
    Trying 172.20.1.1 ...Open

    User Access Verification ← password won’t show when you type it
    Password:
    RouterA> ← Hit Control+Shift+6 together and then let go and press the X key to quit.
    ```

**注意**：我们将在一些别的实验中涉及 ACL，但咱们确实需要了解这些冷知识。出于这一原因，要尝试别的一些 TCP 端口，比如 80、25 等。此外，还要尝试一些 UDP 端口，如 53 等。若没有连接到 `Router B` 的一台 PC，咱们将无法轻松测试这些端口。

再进一步，要混合这些 IP 地址，放行 Telnet（在这个示例下）为串行接口，而不是环回接口。然后在 `Router B` 上设置一个 ACL 代之。我（作者）怎么强调这一点都不为过。当咱们需要清除这个 ACL 时，咱们只需键入以下命令：


```console
RouterA(config)#no access-list 100
```

## 命名的 ACL 实验

### 拓扑结构

![命名 ACL 实验拓扑图](../images/0911.png)

### 实验目的

学习如何配置命名的 ACL。

### 实验步骤

1. 配置上面的网络。在两台路由器上均添加一条静态路由，以便任何网络的任何流量都会离开串行接口。咱们这样做的原因是，虽然这个不是个路由实验，但咱们仍需要流量来路由；

    ```console
    RouterA(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

    ```console
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 s0/1/0
    ```

2. 在 `Router B` 上添加一个扩展的命名 ACL。放行来自主机 `172.20.1.1` 的 `ping`，但不放行来自其他主机或网络的 `ping`；

    ```console
    RouterB(config)#ip access-list extended blockping
    RouterB(config-ext-nacl)#permit icmp host 172.20.1.1 any
    RouterB(config-ext-nacl)#exit
    RouterB(config)#int s0/1/0
    RouterB(config-if)#ip access-group blockping in
    RouterB(config-if)#
    ```

3. 现在从 `Router A` 上的串行接口及环回接口的 `ping`（应工作），测试这个 ACL；

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


**注意**：咱们需要掌握，各种服务分别是什么，及各种服务用到端口号。否则，咱们将很难配置 ACL。这个 ACL 非常简单，只需一行即可实现。当咱们有着多种运行的路由协议时，那么他们就需要被放行。





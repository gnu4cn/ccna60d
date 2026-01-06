# 第 30 天实验

## 静态 NAT 实验

### 拓扑图

![静态 NAT 实验拓扑图](../images/0607.png)


### 实验目的

学习如何配置静态 NAT。

### 实验步骤

1. 添加 IP 地址 `192.168.1.1 255.255.255.0` 到 `Router A`，并将主机名更改为 `Router A`。添加 IP 地址 `192.168.1.2 255.255.255.0` 到 `Router B`。添加时钟速率到正确的一侧，然后从 `Router A` `ping` 向 `Router B` 或从 `Router B` `ping` 向 `Router A`；
2. 咱们需要添加一个 IP 地址到 `Router A`，模拟 LAN 中的某个主机。咱们可以一个环回接口，实现这一目的：

    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#interface Loopback0
    RouterA(config-if)#ip add 10.1.1.1 255.0.0.0
    RouterA(config-if)#
    ```

3. 出于测试目的，咱们需要告诉 `Router B`，发送到任何网络的任何流量，回到 `Router A`。咱们将以一条静态路由，完成这点：

    ```console
    RouterB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 Serial0/1/0
    RouterB(config)#
    ```

4. 通过从 `Router A` 上的环回接口，`ping` 往 `Router B`，测试这条静态路由是否工作：


    ```console
    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.2
    Repeat count [5]:
    Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 10.1.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
    Packet sent with a source address of 10.1.1.1
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms
    RouterA#
    ```

5. 在 `Router A` 上配置一个静态的 NAT 条目。当 `10.1.1.1` 这个地址离开该路由器时，使用 NAT 将其转换为 `172.16.1.1`。咱们还需要告诉该路由器，哪个是 NAT 内部接口，哪个是 NAT 外部接口：


    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#int Loopback0
    RouterA(config-if)#ip nat inside
    RouterA(config-if)#int Serial0/1/0
    RouterA(config-if)#ip nat outside
    RouterA(config-if)#
    RouterA(config-if)#ip nat inside source static 10.1.1.1 172.16.1.1
    RouterA(config)#
    ```

6. 打开 NAT 调试，以便咱们可看到转换正在进行。然后执行另一次扩展的 `ping`（从 `LO`），并检查 NAT 数据表。咱们的输出会因 10S 的变化，而不同于我（作者）的输出；


    ```console
    RouterA#debug ip nat

    IP NAT debugging is on
    RouterA#
    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.2
    Repeat count [5]:
    Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 10.1.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
    Packet sent with a source address of 10.1.1.1

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [11]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [11]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [12]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [12]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [13]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [13]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [14]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [14]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [15]
    !
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/46/110 ms

    RouterA#
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [15]
    RouterA#show ip nat translations
    Pro		Inside global	Inside local	Outside local	Outside global
    icmp 	172.16.1.1:10 	10.1.1.1:10 	192.168.1.2:10 	192.168.1.2:10
    icmp 	172.16.1.1:6 	10.1.1.1:6 		192.168.1.2:6 	192.168.1.2:6
    icmp 	172.16.1.1:7 	10.1.1.1:7 		192.168.1.2:7 	192.168.1.2:7
    icmp 	172.16.1.1:8 	10.1.1.1:8 		192.168.1.2:8 	192.168.1.2:8
    icmp 	172.16.1.1:9 	10.1.1.1:9 		192.168.1.2:9 	192.168.1.2:9
    ---		172.16.1.1		10.1.1.1 			--- 			---

    RouterA#
    ```
7. 要注意，路由器将很快清除这次 NAT 转换，以便清理 NAT 地址供其他 IP 地址使用：

    ```console
    NAT: expiring 172.16.1.1 (10.1.1.1) icmp 6 (6)
    NAT: expiring 172.16.1.1 (10.1.1.1) icmp 7 (7)
    ```

> **译注**: 通过这个实验，要注意三个问题：
>
>  - 一是 **可路由地址可以是外部接口同一网段的地址，也可以不是**；
>  - 二是 **NAT 超时问题，该参数可以设置**；
>  - 三是 **环回接口的使用, 常用来模拟 LAN 中的计算机**。

##  NAT 池的实验

### 拓扑结构

![ NAT 池实验拓扑图](../images/0608.png)

### 实验目的

学习如何配置 NAT 池（动态 NAT）。

### 实验步骤


1. 添加 IP 地址 `192.168.1.1 255.255.255.0` 到 `Router A`，并将主机名更改为 `Router A`。添加 IP 地址 `192.168.1.2 255.255.255.0` 到 `Router B`，添加时钟速率到正确的一侧，并从 `Router A` `ping` 向 `Router B`，或从 `Router B` `ping` 向 `Router A`；
2. 咱们需要添加两个 IP 地址到 `Router A`，模拟 LAN 上的主机。咱们可以两个环回接口，实现这一目的。他们将在不同子网中，但都以某个 `10` 的地址开头：

    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#interface Loopback0
    RouterA(config-if)#ip add 10.1.1.1 255.255.255.0
    RouterA(config-if)#int l1 ← short for Loopback1

    RouterA(config-if)#ip address 10.2.2.2 255.255.255.0
    RouterA(config-if)#
    ```

3. 出于测试目的，咱们需要告诉 `Router B`，发送到任何网络的任何流量回 `Router A`。咱们将以一条静态路由完成这点：

    ```console
    RouterB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 Serial0/1/0
    RouterB(config)#
    ```

4. 通过从 `Router A` 上的环回接口 `ping` 向 `Router B`，测试看看这条静态路由是否工作：

    ```console
    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.2
    Repeat count [5]:
    Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 10.1.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
    Packet sent with a source address of 10.1.1.1
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms

    RouterA#
    ```
5. 在 `Router A` 上配置一个 NAT 池。对于这一实验，要使用 `172.16.1.1` 至 `172.16.1.10`。任何以 `10` 开头的地址，都将是个 NAT 地址。请记住，咱们 **必须** 指定内部及外部的 NAT 接口，否则 NAT 将不工作：

    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#int l0
    RouterA(config-if)#ip nat inside
    RouterA(config)#int l1
    RouterA(config-if)#ip nat inside
    RouterA(config-if)#int Serial0/1/0
    RouterA(config-if)#ip nat outside
    RouterA(config-if)#exit
    RouterA(config)#ip nat pool 60days 172.16.1.1 172.16.1.10 netmask 255.255.255.0
    RouterA(config)#ip nat inside source list 1 pool 60days
    RouterA(config)#access-list 1 permit 10.1.1.0 0.0.0.255
    RouterA(config)#access-list 1 permit 10.2.1.0 0.0.0.255
    RouterA(config)#
    ```

    `ip nat pool` 这条命令，会创建出地址池。咱们需要给这个地址池，起一个咱们自己选择的名字。`netmask` 这个命令，告诉该路由器要应用到这个地址池的网络掩码。

    `source list` 这条命令，告诉该路由器要查看哪个 ACL。这个 ACL 会告诉路由器，哪些网络将与该 NAT 地址池匹配。

6. 打开 NAT 调试，这样咱们便会看到正在进行的转换。然后执行一些扩展的 `ping`（从 `LO` 向 `L1`），并检查 NAT 数据表。咱们的输出会因 10S 的变化，而不同于我（作者）的。咱们应能看到 NAT 池中的两个地址正被使用；

    ```console
    RouterA#debug ip nat

    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.2
    Repeat count [5]:Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 10.1.1.1
    Type of service [0]:
    Set DF bit in IP header? [no]:
    Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
    Packet sent with a source address of 10.1.1.1

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [26]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [16]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [27]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [17]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [28]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [18]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [29]
    !
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [19]

    NAT: s=10.1.1.1->172.16.1.1, d=192.168.1.2 [30]
    !
    Success rate is 100 percent (5/5), round-trip min/avg/max = 17/28/32 ms

    RouterA#
    NAT*: s=192.168.1.2, d=172.16.1.1->10.1.1.1 [20]

    RouterA#ping
    Protocol [ip]:
    Target IP address: 192.168.1.2
    Repeat count [5]:
    Datagram size [100]:
    Timeout in seconds [2]:
    Extended commands [n]: y
    Source address or interface: 10.2.2.2
    Type of service [0]:
    Set DF bit in IP header? [no]:Validate reply data? [no]:
    Data pattern [0xABCD]:
    Loose, Strict, Record, Timestamp, Verbose[none]:
    Sweep range of sizes [n]:
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.2, timeout is 2 seconds:
    Packet sent with a source address of 10.2.2.2

    NAT: s=10.2.2.2->172.16.1.2, d=192.168.1.2 [31]
    !
    NAT*: s=192.168.1.2, d=172.16.1.2->10.2.2.2 [21]

    NAT: s=10.2.2.2->172.16.1.2, d=192.168.1.2 [32]
    !
    NAT*: s=192.168.1.2, d=172.16.1.2->10.2.2.2 [22]

    NAT: s=10.2.2.2->172.16.1.2, d=192.168.1.2 [33]
    !
    NAT*: s=192.168.1.2, d=172.16.1.2->10.2.2.2 [23]

    NAT: s=10.2.2.2->172.16.1.2, d=192.168.1.2 [34]
    !
    NAT*: s=192.168.1.2, d=172.16.1.2->10.2.2.2 [24]

    NAT: s=10.2.2.2->172.16.1.2, d=192.168.1.2 [35]
    !
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms

    RouterA#
    NAT*: s=192.168.1.2, d=172.16.1.2->10.2.2.2 [25]

    RouterA#show ip nat trans
    Pro		Inside global	Inside local	Outside local	Outside global
    icmp	172.16.1.1:16 	10.1.1.1:16 	192.168.1.2:16 	192.168.1.2:16
    icmp	172.16.1.1:17 	10.1.1.1:17 	192.168.1.2:17 	192.168.1.2:17
    icmp	172.16.1.1:18 	10.1.1.1:18 	192.168.1.2:18 	192.168.1.2:18
    icmp	172.16.1.1:19 	10.1.1.1:19 	192.168.1.2:19 	192.168.1.2:19
    icmp	172.16.1.1:20 	10.1.1.1:20 	192.168.1.2:20 	192.168.1.2:20
    icmp	172.16.1.2:21 	10.2.2.2:21 	192.168.1.2:21 	192.168.1.2:21
    icmp	172.16.1.2:22 	10.2.2.2:22 	192.168.1.2:22 	192.168.1.2:22
    icmp	172.16.1.2:23 	10.2.2.2:23 	192.168.1.2:23 	192.168.1.2:23
    icmp 	172.16.1.2:24 	10.2.2.2:24 	192.168.1.2:24 	192.168.1.2:24
    icmp 	172.16.1.2:25 	10.2.2.2:25 	192.168.1.2:25 	192.168.1.2:25
    ```

## NAT 过载实验

请重复前一实验。这次，在引用池时，要添加 `overload` 命令到配置行末尾。这会指示该路由器使用 PAT。要关闭 `Loopback1`。请注意，正如 Farai 所说，在现实世界中，咱们的池将通常只有一个地址，否则咱们就会过载咱们的外部接口。

```console
RouterA(config)#ip nat inside source list 1 pool 60days overload
```

出于方便目的，我（作者）已使用 Cisco Packet Tracer，完成了一些以前的实验，所以咱们将经常看到，不同于与我的输出。下面是 PAT 实验的示例输出。咱们将看到，路由器正将某个端口号，添加到每次转换。不幸的是，咱们在 NAT 池实验的最后，会看到一个类似数字，这是 PAT 的一个恼人之处。

```console
RouterA#show ip nat tran
Inside global	Inside local		Outside local		Outside global
10.0.0.1:8759 	172.16.1.129:8759 	192.168.1.2:8759 	192.168.1.2:8759
```


若咱们真的想要掌握这个困难主题，那么要花时间创建咱们自己的一些 NAT 实验。



# 第 30 天实验

## 静态 NAT 实验

**Static NAT Lab**

**拓扑图**

![静态 NAT 实验拓扑图](../images/0607.png)

**静态 NAT 实验拓扑图**

**实验目的**

学习如何配置静态 NAT 。

**实验步骤**

1. 将 IP 地址`192.168.1.1 255.255.255.0`加入到路由器`A`，并修改`hostname`为`Router A`。把 IP 地址`192.168.1.2 255.255.255.0`加入到路由器`B`。在正确的一侧加上时钟速度(`clock rate`)，然后分别自`A`往`B`和自`B`往`A`进行`ping`测试。如需提示，请回顾先前的那些实验。

2. 在路由器`A`上需要加入一个 IP 地址，以模拟 LAN 上的一台主机。**通过一个环回接口，可以实现这个目的**。


    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#interface Loopback0
    RouterA(config-if)#ip add 10.1.1.1 255.0.0.0
    RouterA(config-if)#
    ```

3. 为进行测试，需要告诉`Router B`将发往任何网络的任何流量，都发往`Router A`。通过一条静态路由完成这个。


    ```console
    RouterB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 Serial0/1/0
    RouterB(config)#
    ```

4. 要测试该条静态路由是否工作，通过从`Router A`上的环回接口对`Router B`进行`ping`操作。


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

5. 在`Router A`上配置一个静态 NAT 条目。使用 NAT ，将地址`10.1.1.1`, 在其离开该路由器时，转换成`172.16.1.1`。同样需要告诉路由器哪个是 NAT 的内部接口，哪个是外部接口。


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

6. 打开 NAT 调试，如此就可以看到转换的进行。此时再执行另一个扩展`ping`操作（自`L0`接口的），并查看 NAT 表。因为 IOS 的不同，你的输出可能与我的不一样。


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

7. 记住，路由器随后很快就会清除该 NAT 转换，为其它 IP 地址使用这个/这些 NAT 地址而对其进行清理。


    ```console
    NAT: expiring 172.16.1.1 (10.1.1.1) icmp 6 (6)
    NAT: expiring 172.16.1.1 (10.1.1.1) icmp 7 (7)
    ```

>译者注: 通过本实验，要注意三个问题：一是**可路由地址可以是外部接口同一网段的地址，也可以不是**；二是** NAT 超时问题，该参数可以设置**；三是**环回接口的使用, 常用来模拟 LAN 中的计算机**。

###  NAT 地址池/动态 NAT 实验

**NAT Pool Lab**

**拓扑图**

![ NAT 地址池/动态 NAT 实验拓扑图](../images/0608.png)

** NAT 地址池/动态 NAT 实验拓扑图**

**实验目的**

学习如何配置一个 NAT 地址池（动态 NAT ）。

**实验步骤**

1. 将 IP 地址`192.168.1.1 255.255.255.0`加入到路由器`A`，并修改`hostname`为`Router A`。把 IP 地址`192.168.1.2 255.255.255.0`加入到路由器`B`。在正确的一侧加上时钟速度(`clock rate`)，然后分别自`A`往`B`和自`B`往`A`进行`ping`测试。如需提示，请回顾先前的那些实验。

2. 需要给`RouterA`添加两个 IP 地址来模拟 LAN 上的主机。通过两个环回接口，可以达到这个目的。这两个 IP 地址将位处不同子网，但都以`10`地址开头。


    ```console
    RouterA#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterA(config)#interface Loopback0
    RouterA(config-if)#ip add 10.1.1.1 255.255.255.0
    RouterA(config-if)#int l1 ← short for Loopback1
    RouterA(config-if)#ip address 10.2.2.2 255.255.255.0
    RouterA(config-if)#
    ```

3. 为了进行测试，需要告诉`RouterB`将到任何网络的任何流量，都发往`RouterA`。用一条静态路由完成这点。


    ```console
    RouterB#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    RouterB(config)#ip route 0.0.0.0 0.0.0.0 Serial0/1/0
    RouterB(config)#
    ```

4. 在`RouterA`上，从环回接口向`RouterB`发出`ping`操作，以此来测试该静态路由是否工作。


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

5. 在`RouterA`上配置一个 NAT 地址池。在本实验中，使用地址池`172.16.1.1`到`172.16.1.10`。任何以`10`开头的地址，都将成为一个 NAT 。记住你**必须**指定 NAT 的内部和外部接口，否则 NAT 就不会工作。


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

    **命令`ip nat pool`创建出地址池。需要给地址池一个自己选择的名称。而命令`netmask`告诉路由器应用到地址池上的网络掩码**。

    **命令`source list`告诉路由器查看的 ACL 。该条 ACL 告诉路由器哪些网络将与 NAT 地址池进行匹配和转换**。

6. 打开 NAT 调试，如此才可以看到转换的发生。接着执行扩展`ping`（自`L0`和`L1`发出的），并查看 NAT 表。因为 IOS 平台的不同，你的输出可能和下面的不一样。将会看到 NAT 地址池中的两个地址正在用到。


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
    RouterA#
    ```

### NAT  Overload 实验

**NAT Overload Lab**

重复先前的实验。这次，在引用地址池时，将`overload`命令加到该配置行的后面。这会指示路由器使用 PAT 。去掉`Loopback1`。**请注意，正如 Farai 指出的那样，在真实世界中，地址池通常只会有一个地址，否则在外部接口上会超载**（Please note that as Farai says, in the real world, your pool will usually have only one address or you will overload your outside  interface ）。

```console
RouterA(config)#ip nat inside source list 1 pool 60days overload
```

我已经为方便而使用思科Packet  Tracer ，完成了上面的实验，所以你通常会碰到与我的输出所不一致的输出。下面是一个 PAT 实验的示例输出。从中可以看出，路由器给每个转换都加上了一个端口号。不幸的是，在 NAT 地址池实验中，会看到相似的编号，这是一个 PAT 的混淆之处。

```console
RouterA#show ip nat tran
Inside global	Inside local		Outside local		Outside global
10.0.0.1:8759 	172.16.1.129:8759 	192.168.1.2:8759 	192.168.1.2:8759
```


（End）



# 变长子网掩码

### 变长子网掩码的使用，Using VLSM

先看看下面这个网络。

- `192.168.1.0/24` = 这是一个有`254`台主机的网络

当然这会很好地工作，那么如果你的网络需要多于一个的子网呢？或者你的那些子网无需`254`台这么多的主机呢？此两种情形，都需要做出一些改变。如你取而代之的是用一个`/26`的掩码，就可以得到这样的结果。

- `192.168.1.0/26` = `4`个有`62`台主机的子网

如这样不适当，那么来个`/28`的掩码如何？

- `192.168.1.0/28` = `16`个有`14`台主机的子网

对子网划分秘笈的设计部门的再度引用，可帮你计算出如何来在网络中应用变长子网掩码，或是有助于解答考试问题。在使用`/26`掩码时，你可以发现将会得到多少个子网及每个子网有多少台主机。

| 二进制位数 | `128` | `64` | `32` | `16` | `8` | `4` | `2` | `1` |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| 子网号 | 〇 | 〇 |  |  |  |  |  |  |
| `128` | 〇 |  |  |  |  |  |  |  |
| `192` | 〇 |  |  |  |  |  |  |  |
| `224` |  |  |  |  |  |  |  |  |
| `240` |  |  |  |  |  |  |  |  |
| `248` |  |  |  |  |  |  |  |  |
| `252` |  |  |  |  |  |  |  |  |
| `254` |  |  |  |  |  |  |  |  |
| `255` |  |  |  |  |  |  |  |  |
|  | 子网数 | 主机数-`2` |  |  |  |  |  |  |
| `2` | 〇 | 〇 |  |  |  |  |  |  |
| `4` | 〇 | 〇 |  |  |  |  |  |  |
| `8` |  | 〇 |  |  |  |  |  |  |
| `16` |  | 〇 |  |  |  |  |  |  |
| `32` |  | 〇 |  |  |  |  |  |  |
| `64` |  | 〇 |  |  |  |  |  |  |

因为必须从主机位借用两位，所以得到`4`个子网，每个子网有`62`台主机。

### 网络切分，Slicing Down Networks

变长子网掩码的关键在于取得网络块并令到这些网络块满足特定的网络需求（take your network block and make it work for your particular network needs）。拿典型的网络地址`192.168.1.0/24`来说，在使用 VLSM 时，你可以使用掩码`/26`, 实现这样的划分。

| `192.168.1.0/26` | 子网 | 主机数 |
| -- | -- | -- |
| `192.168.1.0` | `1` | `62` |
| `192.168.1.64` -- 使用中 | `2` | `62` |
| `192.168.1.128` -- 使用中 | `3` | `62` |
| `192.168.1.192` -- 使用中 | `4` | `62` |

在发现基础设施中有着两个仅需`30`台主机的较小网络之前，这么做是没有问题的。那么在已经使用了`3`个较小子网（标为“使用中”），而仅剩下一个（也就是`192.168.1.0`）时呢？变长子网掩码就可以让你用上任何已划分出的子网，对其再进行划分。**唯一的规则就是 IP 地址仅能使用一次，而与其掩码无关**。

如你使用子网划分秘笈图表，那么就可以看到哪个掩码带来`30`台主机的子网。

|  | 子网数 | 主机数-`2` |  |  |  |  |  |  |
| -- | -- | -- | -- | -- | -- | -- | -- | -- |
| `2` | 〇 | 〇 |  |  |  |  |  |  |
| `4` | 〇 | 〇 |  |  |  |  |  |  |
| `8` |  | 〇 |  |  |  |  |  |  |
| `16` |  | 〇 |  |  |  |  |  |  |
| `32` |  | 〇 |  |  |  |  |  |  |
| `64` |  |  |  |  |  |  |  |  |

该图表的上面部分（这里没有显示）告诉我们在左边列勾选了`3`个位置，这就给出掩码`224`或者是`/27`(借用了`3`位）。

| `192.168.1.0/27` | 子网 | 主机数 |
| -- | -- | -- |
| `192.168.1.0` | `1` | `30` |
| `192.168.1.32` | `2` | `30` |
| `192.168.1.64` | 不能使用 | 不能使用 |

是不可以使用`.64`子网的，因为该子网已被使用了。现在就可以使用其余两个子网了。如你只需使用一个，那么就还可以将剩下的那个进行进一步划分，得到更多的子网，只是每个子网中的主机数更少而已。

## IP分址故障排除，Troubleshooting IP Addresses Issues

### 子网掩码及网关故障的排除

在出现 IP 分址、子网掩码或网关问题时，你会看到多种现象。一些问题会如同下面这样。

- 网络设备可在其本地子网通信，却无法与本地网络之外的设备通信。这通常表明有着与网关配置或运行相关类型的问题。
- 没有任何类型的 IP 通信，不管是内部的还是远程的。这通常表明存在大问题，可能涉及相应设备上功能的缺失。
- 还有这种能与某些 IP 地址通信，却无法与存在的全部 IP 地址通信的情形。这通常是最难解决的故障，因为其可能有很多原因。

在处理这些问题的过程中，**首先要做的就是对设备上所配置的 IP 地址、子网掩码及默认网关进行反复检查**。同时**还要查看设备文档，来验证相应信息**。**大量的故障都是由错误配置造成的**。

如你正在首次安装一些网络设备，多半要手动输入一些 IP 地址、子网掩码和默认网关等信息。建议在进行提交前进行检查，因为这方面人所犯的错误是难免的。**许多企业都有关于将新设备引入网络的手册, 包括网关测试及到 SNMP 服务器的可达能力**。

如需在故障排除过程中收集信息，可能需要**做一下包捕获，以此来观察设备间发送了哪些数据包**。**如果看到有来自其它网络上主机的包，就可能存在某种 VLAN 错误配置问题**。**如怀疑子网掩码不正确，就要检查网络上其它设备的参数**。如果其它机器工作良好，就要在该设备上使用如预期一样无法工作的同一子网掩码，并再行测试。

在使用了动态主机分址（ DHCP ）来为网络上的设备分配包括子网掩码和网关的地址信息时，就要**检查 DHCP 服务器配置**，因为此时问题可能发生在另一方面了。 DHCP 服务器错误配置或者 DHCP 服务已阻塞，都是可能的，所以在故障排除时包含这一步是必要的。务必还要记住从 DHCP 地址池中排除一些保留地址，因为这些地址通常会分配给服务器及路由器接口。

另一些有助于找出网络故障发生所在之处的故障排除工具有 traceroute 和 ping 。在本书及本书实验中会有涉及。

## 第五天的问题，Day 5 Questions

1. Convert `192.160.210.177` into binary (without using a calculator).
2. Convert `10010011` into decimal.
3. What is the private range of IP addresses?
4. Write out the subnet mask from CIDR `/20`.
5. Write out the subnet mask from CIDR `/13`.
6. `192.168.1.128/26` gives you how many available addresses?
7. What is the last host of the `172.16.96.0/19` network?
8. Starting with `192.168.1.0/24`, with VLSM, you can use a /26 mask and generate which subnets?
9. In order to use route summarisation on your network, you need to use what?
10. Write down the subnets `172.16.8.0` to `172.16.15.0`, and work out the common bits and what subnet mask you should use as a summary. Don’t look in the book before working this out.

## 第五天问题的答案

1. `11000000.10100000.11010010.10110001`.
2. `147`.
3. `10.x.x.x` – any address starting with a `10`. `172.16.x.x` to `172.31.x.x` – any address starting with `172.16` to `172.31`, inclusive. `192.168.x.x` – any address starting with `192.168`.
4. `255.255.240.0`.
5. `255.248.0.0`.
6. `62`.
7. `172.16.127.254`.
8. `192.168.1.0.0/26`, `192.168.1.0.64/26`, `192.168.1.0.128/26`, and `192.168.1.0.192/26`.
9. A classless protocol.
10. `172.16.8.0/21` (mask: `255.255.248.0`).

## 课文中进制转换的答案

1. Convert 1111 to hex and decimal


    ```console
        Hex = F
        Decimal = 15
    ```

2. Convert 11010 to hex and decimal


    ```console
        Hex = 1A
        Decimal = 26
    ```

3. Convert 10000 to hex and decimal


    ```console
        Hex = 10
        Decimal = 16
    ```

4. Convert 20 to binary and hex


    ```console
        Binary = 10100
        Hex = 14
    ```

5. Convert 32 to binary and hex


    ```console
        Binary = 100000
        Hex = 20
    ```

6. Convert 101 to binary and hex


    ```console
        Binary = 1100101
        Hex = 65
    ```

7. Convert A6 from hex to binary and decimal


    ```console
        Binary = 10100110
        Decimal = 166
    ```

8. Convert 15 from hex to binary and decimal


    ```console
        Binary = 10101
        Decimal = 21
    ```

9. Convert B5 from hex to binary and decimal


    ```console
        Binary = 10110101
        Decimal = 181
    ```

## 第五天的实验

### 路由器上的 IP 分址实验

**拓扑图，Topology**

![路由器上的 IP 分址实验拓扑图](../images/0505.png)

*路由器上的 IP 分址实验拓扑图*

**实验目的, Purpose**

学习如何熟练地在路由器上配置 IP 地址，并经由某个串行接口执行 ping 操作。

**实验步骤，Walkthrough**

1. 先是明确路由器上的串行借口编号，你的路由器与上面拓扑图中的可能有所不同。同时，还要明确串行链路的哪一端连接的是 DCE 线，因为在该端是需要`clock rate`命令的。


    ```console
    Router>en
    Router#sh ip interface brief
    Interface		IP-Address	OK?	Method	Status					Protocol
    FastEthernet0/0	unassigned	YES	unset	administratively down	down
    FastEthernet0/1	unassigned	YES	unset	administratively down	down
    Serial0/1/0		unassigned	YES	unset	administratively down	down
    Vlan1			unassigned	YES	unset	administratively down	down
    Router#
    Router#show controllers Serial0/1/0
    M1T-E3 pa: show controller:
    PAS unit 0, subunit 0, f/w version 2-55, rev ID 0x2800001, version 2
    idb = 0x6080D54C, ds = 0x6080F304, ssb=0x6080F4F4
    Clock mux=0x30, ucmd_ctrl=0x0, port_status=0x1
    line state: down
    DCE cable, no clock rate
    ```

2. 在一侧为路由器加上主机名及 IP 地址，如该侧是 DCE ，就为其加上时钟速率（the clock rate）。


    ```console
    Router#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Router(config)#hostname RouterA
    RouterA(config)#interface s0/1/0
    RouterA(config-if)#ip add 192.168.1.1 255.255.255.0
    RouterA(config-if)#clock rate 64000
    RouterA(config-if)#no shut
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to downRouterA(config-if)#
    ```

3. 为另一侧加上主机名和 IP 地址。同时使用`no shut`命令将该接口开启。


    ```console
    Router>en
    Router#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Router(config)#hostname RouterB
    RouterB(config)#int s0/1/0
    RouterB(config-if)#ip address 192.168.1.2 255.255.255.0
    RouterB(config-if)#no shut
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to down
    RouterB(config-if)#^Z
    RouterB#
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to up
    ```

4. 用`ping`命令测试连接。


    ```console
    RouterB#ping 192.168.1.1
    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms
    ```

>**注意：** 如 ping 不工作，就要反复检查，确保在正确的路由器上加上了`clock rate`命令。还要确保正确插入了线缆，并使用命令 `show controllers serial x/x/x`, 这里的接口编号是你的路由器上的。

### 二进制转换及子网划分练习， Binary Conversion and Subnetting Practice

请将今天所剩下的时间，用来做下面这些重要的练习。

- 十进制到二进制的转换（随机数字）
- 二进制到十进制的转换（随机数字）
- IPv4 子网划分（随机网络和场景）


（End）



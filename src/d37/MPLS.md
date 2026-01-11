# MPLS

多协议标签交换（MPLS），通过追加一个标签到任意数据类型发挥作用。数据包随后会基于这一标签值，而非任何三层信息，通过网络基础设施转发。数据包的标签化，提供了极为高效的转发，并允许 MPLS 与很大范围底层技术一起工作。通过简单地在数据包头部添加一个标签，MPLS 即可用于许多的物理层与数据链路层 WAN 实现中。

MPLS 的标签被放在二层头部与三层头部之间。通过使用 MPLS，开销仅在数据包进入业务提供商云时增加。在进入 MPLS 网络后，数据包的交换会以远超传统三层网络的速度完成，因为其只是基于交换 MPLS 标签，而不是剥离整个三层的头部。


MPLS 有两种不同风格：

- 数据帧模式的 MPLS
- 单元模式的 MPLS

数据帧模式的 MPLS，是最主流的 MPLS 类型，在这种情景下，标签被置于二层头部与三层头部之间（出于这一原因，MPLS 常被视为一种 2.5 层技术）。单元模式的 MPLS，用于 ATM 网络，并会使用 ATM 头部中用作标签的一些字段。

具备 MPLS 能力的路由器，也称为标签交换路由器（LSR），这些路由器有两种类型：

- 边缘LSR (PE 路由器)
- LSR (P 路由器)


所谓 PE 路由器，属于负责标签分发的业务提供商边缘设备；他们会依据标签转发数据包，同时他们承担标签插入与移除。所谓 P 路由器，属于业务提供商路由器，而他们职责由标签转发及基于标签的高效数据包转发构成。

---


> **注**：请参考[这里](http://blog.51cto.com/sirstma/1860720)。

## 基本的串行线路配置（Basic Serial Line Configuration）

在不打算改变默认的`HDLC`（High-level Data Link Control，高级数据链路控制，思科专有）封装时，那么为建立 WAN 连接，仅需完成下面的步骤：

1. 给接口添加一个 IP 地址
2. 开启接口（以`no shutdown`命令）
3. 确保在数据通信设备侧有一个时钟速率（Ensure there is a clock rate on the DCE side）

在连接了数据通信设备电缆时的配置如下：

```console
Router#config t
Router(config)#interface Serial0
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#clock rate 64000
Router(config-if)#no shutdown
Router(config-if)#^Z
Router#
```

## 以太网上的点对点协议（Point-to-Point over Ethernet, PPPoE）

以太网上的点对点协议，是一个用于在以太网帧内部，封装点对点协议帧的网络协议（Point-to-Point Protocol over Ethernet(PPPoE) is a network protocol used to encapsulate PPP frames inside Ethernet frames）。

要实现客户部署非对称数字订户线路，他们就必须支持在极大安装基数的老旧桥接的客户处设备上的点对点样式的认证与授权。`PPPoE`技术提供了将主机网络经由简单的桥接访问设备，连接到远端访问集中器，或聚合集中器的能力（As customers deploy ADSL, they must support PPP-style authentication and authorisation over a large installed base of legacy bridging customer premises equipment(CPE). PPPoE provides the ability to connect a network of hosts over a simple bridging access device to a remote access concentrator or aggregation concentrator）。在此模型下，每台主机都使用其自身的点对点协议栈，因此呈现给用户的是一个熟悉的用户界面。访问控制、计费与服务类型（type of service），可基于每名用户，而不是基于每个地点完成。

如同在[RFC 2516](http://man.chinaunix.net/develop/rfc/RFC2516.txt)中所指明的那样， PPPoE 有两个不同阶段：发现阶段与会话阶段（As specified in RFC 2516, PPPoE has two distinct stages: a discovery stage and a session stage）。在主机发起一个 PPPoE 会话时，其必须首先进行发现，以找到可满足客户端请求的服务器，并找到对等点的以太网 MAC 地址而建立一个 PPPoE 会话 ID 。在 PPP 定义一个对等点到对等点的关系时，发现本质上就是一个客户端服务器的关系（While PPP defines a peer-to-peer relationship, discovery is inherently a client-server relationship）。

### PPPoE的配置

下面的小节涵盖了服务器（互联网服务提供商处）与客户端 PPPoE 的配置。之所以包含此内容，是因为现在 CCNA 大纲强制要求考生知道如何配置 PPPoE 。

#### 服务器的配置

创建 PPPoE 服务器配置的第一步，是定义一个将对传入连接进行管理的宽带聚合组（broadband aggregation group, BBA group）。该宽带聚合组必须关联到某个虚拟模板：

```console
Router(config)#bba-group pppoe GROUP
Router(config-bba-group)#virtual-template 1
```

下一步为面向客户端的接口，创建出一个虚拟模板。在虚拟模板上，需要配置一个 IP 地址以及一个可从中为客户端分配到协商地址的地址池（The next step is to create a virtual template for the customer-facing interface. On the virtual template you need to configure an IP address and a pool of address from which clients are assigned a negotiated address）：

```console
Router(config)#interface virtual-template 1
Router(config-if)#ip address 10.10.10.1 255.255.255.0
Router(config-if)#peer default ip address pool POOL
```

该 IP 地址池是在全局配置模式中定义的。这与 DHCP 地址池的配置类似：

```console
Router(config)#ip local pool POOL 10.10.10.2 10.10.10.254
```

最后一步就是在面向客户端的接口上开启该 PPPoE 分组：

```console
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe enable group GROUP
Router(config-if)#no shutdown
```

#### 客户端的配置（Client Configuration）

在客户端侧上，必须创建出一个拨号器接口（On the client side a dialer interface has to be created）。拨号器接口将对 PPPoE 连接进行管理。可将手动 IP 地址分配给拨号器接口，或将其设置为从服务器请求一个 IP 地址（使用`ip address negotiated`命令）：

```console
Router(config)#interface dialer1
Router(config-if)#dialer pool 1
Router(config-if)#encapsulation ppp
Router(config-if)#ip address negotiated
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe-client dial-pool-number 1
Router(config-if)#no shutdown
```

### 关于认证（ Authentication ）

为了令到 PPPoE 连接安全，可使用两种方法：

- 口令认证协议（Password Authentication Protocol, PAP） - 不安全的、以明文方式发送凭据（包含用户名与口令）
- 询问握手协议（Challenge Handshake Authentication Protocol, CHAP） - 安全的（明文的用户名与经`MD5`散列化的口令），是首选方式

可如下配置`PAP`：

_服务器侧_：

```console
Server(config)#username Client password Password
Server(config)#interface virtual-template 1
Server(config-if)#ppp authentication pap
Server(config-if)#ppp pap sent-username Server password Password
```

_客户端_：

```console
Client(config)#username Server password Password
Client(config)#interface dialer 1
Client(config-if)#ppp authentication pap
Client(config-if)#ppp pap sent-username Client password Password
```

`CHAP`可如下进行配置：

_服务器侧_：

```console
Server(config)#username Client password Password
Server(config)#interface virtual-template 1
Server(config-if)#ppp authentication chap
```

_客户端_：

```console
Client(config)#username Server password Password
Client(config)#interface dialer 1
Client(config-if)#ppp authentication chap
```

### PPPoE的验证与故障排除（PPPoE Verification and Troubleshooting）

在 PPPoE 会话成功形成后，客户端控制台上将出现下面的消息：

```console
%DIALER-6-BIND: Interface Vi1 bound to profile Di1
%LINK-3-UPDOWN: Interface Virtual-Access1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface Virtual-Access1, changed state to up
```

在客户端路由器上使用下面的命令，可对拨号器接口，以及从 PPPoE 服务器处获取到的（协商到的） IP 地址进行检查：

```console
Router#show ip interface brief
Interface                  IP-Address       OK? Method Status               Protocol
Virtual-Access1            unassigned       YES unset  up/up
Dialer1                    10.10.10.2       YES IPCP   up/up
```

在客户端路由器上可使用下面的命令，显示出 PPPoE 会话的状态：

```console
Router#show pppoe session
1 client session
Uniq ID  PPPoE  RemMAC      Port        Source   VA         State
       SID  LocMAC                               VA-st
N/A     16  ca00.4843.0008  Fa0/0       Di1      Vi1        UP
            ca01.4843.0008                                  UP
```

一些对于 PPPoE 连接进行故障排除有用的命令如下：

```console
Router#debug ppp ?
  authentication  CHAP and PAP authentication
  bap             BAP protocol transactions
  cbcp            Callback Control Protocol negotiation
  elog            PPP ELOGs
  error           Protocol errors and error statistics
  forwarding      PPP layer 2 forwarding
  mppe            MPPE Events
  multilink       Multilink activity
  negotiation     Protocol parameter negotiation
  packet          Low-level PPP packet dump
```

## WAN连接的故障排除（Troubleshooting WAN Connections）

在试图启动一条广域网连接（现在先不管 PPP 与帧中继连接）时，可运用开放系统互联模型：

`Layer 1` -- 对线缆进行检查，以确保其连接正确。其外还要检查一下有没有执行`no shutdown`命令，以及在数据通信设备侧有没有应用一个时钟速率。

```console
RouterA#show controllers serial 0
HD unit 0, idb = 0x1AE828, driver structure at 0x1B4BA0
buffer size 1524 HD unit 0, V.35 DTE cable

RouterA#show ip interface brief
Interface     IP-Address     OK? Method Status              Protocol
Serial0       11.0.0.1       YES unset  administratively down down
Ethernet0     10.0.0.1       YES unset  up                    up
```

`Layer 2` -- 检查以确保对接口应用了正确的封装。确保链路的另一侧有着同样的封装类型。

```console
RouterB#show interface Serial0
Serial1 is down, line protocol is down
Hardware is HD64570
Internet address is 12.0.0.1/24
MTU 1500 bytes, BW 1544 Kbit, DLY 1000 usec, rely 255/255, load 1/255
Encapsulation HDLC, loopback not set, keepalive set (10 sec)
```

`Layer 3` -- IP地址与子网掩码对不对，子网掩码与另一侧是不是匹配。

```console
RouterB#show interface Serial0
Serial1 is down, line protocol is down
Hardware is HD64570
Internet address is 12.0.0.1/24
MTU 1500 bytes, BW 1544 Kbit, DLY 1000 usec, rely 255/255, load 1/255
Encapsulation HDLC, loopback not set, keepalive set (10 sec)
```

## 第 41 天问题

1. Name at least three WAN categories.
2. The need for NBMA appears when there is no native `_______` support for a group of systems that want to communicate over the same network.
3. In NBMA environments you still need to bind the Layer 3 address (IP address) to the Layer 2 address (DLCI). This can be done in an automated fashion, using a technology called Inverse ARP. True or false?
4. Name 2 NBMA interface types.
5. `_______` requires DTE and DCE and is the default encapsulation type on Cisco routers.
6. `_______` technologies involve the use of carrier Ethernet in Metropolitan Area Networks (MANs).
7. T1 is a standard often used in what geographical regions?
8. What are the two flavours of ISDN?
9. `_______` is the most common form of DSL connection that functions over standard telephone lines. It offers unequal download and upload throughput, with the download rate being higher than the upload rate.
10. `_______` functions by appending a label to any type of packet.


## 第 41 天答案

1. Circuit-switched, cell-switched, broadband, leased-line, and packet-switched.
2. Broadcast.
3. True.
4. Multipoint and Point-to-Point.
5. HDLC.
6. Metro Ethernet.
7. North America, Japan, and South Korea.
8. BRI and PRI.
9. ADSL.
10. MPLS.


## 第 41 天实验

### PPPoE实验

在两台路由器之间，以本课程模块中所给出的信息，配置带有 CHAP 的 PPPoE ：

__服务器配置__：

```console
Router(config)#bba-group pppoe GROUP
Router(config-bba-group)#virtual-template 1
Router(config)#interface virtual-template 1
Router(config-if)#ip address 10.10.10.1 255.255.255.0
Router(config-if)#peer default ip address pool POOL
Router(config)#ip local pool POOL 10.10.10.2 10.10.10.254
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe enable group GROUP
Router(config-if)#no shutdown
```

__客户端配置__:

```console
Router(config)#interface dialer1
Router(config-if)#dialer pool 1
Router(config-if)#encapsulation ppp
Router(config-if)#ip address negotiated
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe-client dial-pool-number 1
Router(config-if)#no shutdown
```

__询问握手认证协议（ CHAP ）配置__:

```console
Server(config)#username Client password Password
Server(config)#interface virtual-template 1
Server(config-if)#ppp authentication chap
Client(config)#username Server password Password
Client(config)#interface dialer 1
Client(config-if)#ppp authentication chap
```

__对配置进行验证__：

```console
Router#show pppoe session
1 client session
Uniq ID  PPPoE  RemMAC      Port        Source   VA         State
       SID  LocMAC                               VA-st
N/A     16  ca00.4843.0008  Fa0/0       Di1      Vi1        UP
            ca01.4843.0008                                  UP
```

请访问[www.in60days.com](http://www.in60days.com)并自由观看作者完成该实验。


（End）



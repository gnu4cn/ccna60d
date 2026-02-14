# OSPF 数据包类型


由 OSPF 路由器发送的不同数据包类型，都包含在共同的 24 字节 OSPF 头部中。虽然深入研究 OSPF 头部的具体细节，超出了 CCNA 考试要求的范围，但对包含在这个头部中的字段及其用途，有个基本了解仍然很重要。下图 24.7 展示了这个共同的 24 个八位组 OSPF 头部。


![OSPF协议数据包头部](../images/3906.png)

**图 24.7** -- **OSPF 数据包的头部**

> *译注*：EIGRP 的共用数据头部：[EIGRP 数据包头部的字段](../d22/messages.md#eigrp-packet_header)，以兹对比参考。



其中 8 位的 `Version` 字段指定了 OSPF 的版本。这一字段的默认值为 2，但在 OSPFv3 启用时，那么这个字段也会被设置为 3。

8 位的 `Type` 字段，用于指定 OSPF 数据包的类型。其中这一教学模组稍后将详细的五种主要 OSPF 数据包类型如下：

- `Type 1` = `Hello` 数据包
- `Type 2` = 数据库描述数据包
- `Type 3` = 链接状态请求数据包
- `Type 4` = 链路状态更新数据包
- `Type 5` = 链接状态确认数据包


16 位的数据包长度字段，用于指定该协议数据包的长度。这一长度包括了这个标准的 OSPF 头部。

32 位的路由器 ID 字段，用于指定该数据包源自的路由器 IP 地址。在 Cisco IOS 设备上，这一字段将包含运行着 OSPF 设备上，所配置的所有物理接口的最高 IP 地址。当一些环回接口于该设备上配置了时，那么这个字段将包含所有配置的环回接口的最高 IP 地址。另外，当一个手动配置的路由器 ID，已由管理员显式配置或指定时，那么这一字段也可包含手动配置的路由器 ID。

**注意**：在路由器 ID 已选出后，那么除非该路由器被重新加载、推导出路由器 ID 的 IP 地址的接口关闭或被移除，或 OSPF 进程被使用路由器上的 `clear ip ospf process` 特权 `EXEC` 命令重置，否则这个路由器 ID 将永远不更改。

32 位的 `Area ID` 字段，用于标识该数据包的 OSPF 区域。某个数据包只能属于某一单一 OSPF 区域。当数据包是经由某条虚拟链路接收的时，那么`Area ID` 将是 OSPF 主干骨干区域，或 `Area 0`。虚拟链路会在这一教学模组稍后详细介绍。

校验和字段为 16 位长，表示该数据包从 OSPF 数据包头部开始，但不包括 64 位的认证数据字段的全部内容的标准 IP 校验和。当该数据包的长度，整数个 16 位字时，则该数据包就会在校验和前，填充一个 `0` 的字节。

16 位的认证 (`Auth`) 类型字段，用于标识所使用的认证类型。这一字段仅对 OSPFv2 有效，并可包含以下三种代码之一：

- `Code 0` -- 表示无认证；这是默认设置
- `Code 1` -- 表示认证类型为纯文本
- `Code 2` -- 表示认证类型为消息摘要算法 (`MD5`)

最后，64 位的 `Authentication Data` 字段，用于当认证已启用时，具体认证信息或数据。重要的是要记住，这一字段仅对 OSPFv2 有效。当纯文本的认证正被用到时，那么这一字段就包含了认证密钥。但是，当 MD5 的认证正被用到时，那么这一字段就会被重新定义到若干别的几个字段中，这超出了 CCNA 考试要求的范围。下图 24.8 显示了当其出现在一次 OSPF 数据包线路捕获中时的这些不同字段：

![OSPF数据包头部的线上捕获](../images/3907.png)

**图 24.8** -- **OSPF 数据包头部的线路捕获**


在 OSPF 数据包头部中，8 位的 `Type` 字段，用于指定 OSPF 数据包的类型。同样，五种 OSPF 数据包类型如下：

- `Type 1` = `Hello` 数据包
- `Type 2` = 数据库描述数据包
- `Type 3` = 链路状态请求数据包
- `Type 4` = 链路状态更新数据包
- `Type 5` = 链路状态确认数据包


## OSPF 的 `Hello` 数据包

`Hello` 数据包用于发现别的直连 OSPF 路由器，以及建立 OSPF 路由器之间的 OSPF 邻接关系。针对广播于点对点网络类型，OSPF 使用组播发送 `Hello` 数据包。这些数据包会被投送到 `AllSPFRouters` 的组播组地址 `224.0.0.5`。对于非广播的链路（如帧中继），OSPF 会使用单播，直接发送 `Hello` 数据包到一些静态配置的邻居。

**注意**：默认情况下，所有 OSPF 数据包（即组播与单播），都会以 1 的 IP TTL 发送。 这样做就就将这些数据包，限制于本地链路。换句话说，z咱们无法与远于一条的另一路由器建立 OSPF 的邻接关系。这同样适用于 EIGRP。

在广播链路上，OSPF 的 `Hello` 数据包还用于选举 DR 和 BDR。DR 会专门监听组播地址 `224.0.0.6` (`AllDRRouters`)。DR 和 BDR 在这一教学模组中早先已有详细介绍。下图 24.9 展示了包含于 OSPF `Hello` 数据包中的那些字段：

![OSPF的`Hello`数据包](../images/3908.png)

**图 24.9** -- **OSPF 的 `Hello` 数据包**


其中 4 字节的 `Network Mask` 字段，包含着通告的 OSPF 接口子网掩码。网络掩码只会在广播介质上才会检查。未编号的点对点接口及虚拟链路，二者均将在这一教学模组稍后介绍，会将这个值设为 `0.0.0.0`。

2 个字节的 `Hello Interval` 字段，显示 `Hello` 间隔时间值，即通告路由器所要求的，两个 `Hello` 数据包之间的秒数。可能的取值范围为 1 至 255。默认情况下，在广播与点对点介质上的 `Hello` 间隔时间为 10 秒，所有其他介质上为 30 秒。（译注：原文这里漏掉了 "Interval"，而写作了 "The 2-byte Hello field"。）

1 字节的 `Options` 字段，由本地路由器用于通告一些可选能力。`Options` 字段中的每一位，都代表了某种不同功能。研究他们超出了 CCNA 考试要求的范围。

1 字节的 `Router Priority` 字段，包含着本地路由器的优先级。默认情况下，这一字段有着一个 1 的值。这个值用于 DR 与 BDR 的选举。可能的取值范围为 0 至 255。优先级越高，那么这个本地路由器将成为 DR 的可能性就越大。0 的优先级值意味着本地路由器将不参与 DR 或 BDR 选举。


4 字节的 `Router Dead Interval` 字段，显示死亡间隔时间值。所谓死亡间隔，是某个邻居路由器被宣布死亡前的时间（秒）。这个值为广告路由器所需。死亡间隔的默认值，是四倍于 `Hello` 间隔时间，在广播与点对点接口上将默认为 40 秒，在所有其他类型介质上将默认为 120 秒。


4 字节的 `Disignated Router` 路由器字段，列出了 DR 的 IP 地址。`0.0.0.0` 的一个值，用于无 DR 选出时，例如在某条点到点链路上，或某个路由器已被显式配置为不参与选举时。


4 字节的 `Backup Disignated Router` 字段，标识了 BDR 并会列出当前 BDR 的接口地址。一个 `0.0.0.0` 的值会在没有 BDR 选出时被用到。

最后，`(Active) Neighbor` 字段是个显示网段上已收到 `Hello` 数据包的，所有 OSPF 路由器的路由器 ID 的可变字段字段。


## 数据库描述 DBD 数据包

数据库描述字段，会在每个 OSPF 通告其本地数据库信息时的数据库交换期间用到。这些数据包通常被称为 DBD 数据包，或 DD 数据包。第一个 DBD 数据包用于数据库交换的主从选举。DBD 数据包还包含着由主站选取的初始序列编号。有着最高路由器 ID 的路由器，会成为主路由器并启动数据库同步。这是唯一可递增序列编号的路由器。主路由器开始交换数据库，并会轮询从路由器的信息。主路由器和从路由器的选举，是以每个邻居为基础举行的。

重要的是要明白，主从路由器的选举过程，与 DR 及 BDR 的选举过程并不相同。这通常会被错误的假设。主从路由器的选举过程，只是根据有着最高 IP 地址的路由器；但 DR/BDR 的选举过程，则既可使用 IP 地址，也可使用优先级值决定。

例如，假设两个名为 `R1` 和 `R2` 的路由器，正开始邻接关系建立过程。`R1` 有着 `1.1.1.1` 的 RID，而 R2 有着 `2.2.2.2` 的 RID。网络管理员已配置了 `R1` 一个 255 的 OSPF 优先级值，确保这个路由器将被选为 DR。在确定主从路由器的确定过程中，`R2` 将凭借较高的 RID 当选主路由器。但是，配置于 `R1` 上的优先级值，会导致 R1 当选为 DR。本质上，DR（`R1`）在主从路由器选举过程中会是从路由器。

主从路由器选出后，DBD 数据包便会通过发送一些 LSA 头部到远端路由器，汇总本地数据库。远端路由器会分析这些头部，确定其自己的 LSDB 副本中，是否缺少任何信息。OSPF 数据库描述数据包如下图 24.10 中所示。

![OSPF的数据库描述数据包](../images/3909.png)

**图 24.10** -- **OSPF 的数据库描述数据包**

在 DBD 数据包中，2 字节的 `Interface MTU` 字段包含着传出接口的以 8 位组计算的 MTU 值。换句话说，这个字段包含了可通过相关接口发送的最大数据大小（以字节计算）。当接口是用在某条虚拟链路上时，那么这个字段会被设置为 `0x0000`。为了 OSPF 的邻接关系成功建立，所有路由器上的 MTU 必须相同。当咱们在一台路由器上修改了这个值时，纳闷咱们就必须在同一子网的所有其他路由器上，配置同一个值（或使用 `ip ospf mtu-ignore` 命令）。

**注意**：为了 EIGRP 的邻居关系成功建立，EIGRP 的接口 MTU 值不必相同。

1 字节的 `Options` 字段，包含着包含于 OSPF `Hello` 数据中的那些相同选项。为简洁起见，这些选项将不会再次介绍。

`Database Description` 或 `Flags` 字段，是个 1 字节的字段，提供 OSPF 路由器在邻接关系形成期间，与某个邻居交换多个 DBD 数据包的能力。

4 字节的 `DBD Sequence Number` 字段，用于通过使用序列编号，保证在同步过程中所有 DBD 数据包都得以接收及处理。主路由器会在第一个 DBD 数据包中，初始化这个字段为某个唯一值，随着每个后续数据包，其都会递增 1。这个序列编号，只会由主路由器递增。

最后，可变长度的 `LSA Header` 字段，承载着描述本地路由器数据库信息的那些 LSA 头部。每个头部为 20 个八位组长，并唯一标识了数据库中的每条 LSA。每个 DBD 数据包，可包含多个 LSA 头部。

> *译注*：通过这里用到的术语 “octets”，可以推测 Cisco 的 OSPF 实现，可能同样是以 Erlang 语言完成的，因为 Erlang 语言中也经常用到这一术语。


## 链路状态请求 LSR 数据包

链路状态请求 (LSR) 数据包，是由 OSPF 路由器发送，请求缺失或过时的数据库信息。这些数据包包含着一些唯一描述所请求链路状态通告的标识符。某单个 LSR 数据包，可能包含单个的标识符集，也可能包含请求多条 LSA 的多个标识符集。LSR 数据包还可在数据库交换后，请求那些在数据库交换期间，所注意到的本地路由器没有的 LSA。下图 24.11 演示了 OSPF 的 LSR 数据包格式。


![OSPF链路状态请求数据包](../images/3910.png)

**图 24.11** -- **OSPF 的链路状态请求数据包**

<a name="lsa-types"></a>
4 个字节的 `Link State Advertisement Type` 字段，包含正被请求的 LSA 类型。其可能包含以下字段之一：

- `Type 1` = 路由器链路状态通告
- `Type 2` = 网络链路状态通告
- `Type 3` = 网络摘要链路状态通告
- `Type 4` = ASBR 的摘要链路状态通告
- `Type 5` = AS 外部链路状态通告
- `Type 6` = 组播的链路状态通告
- `Type 7` = NSSA 外部链路状态通告
- `Type 8` = 外部属性的链路状态通告
- `Type 9` = 不透明链接状态通告 -- 链路本地
- `Type 10` = 不透明链路状态通告 -- 区域
- `Type 11` = 不透明链路状态通告 -- 自治系统

**注意**：上面列出的一些 LSA，会将在接下来的小节中详细介绍。

4 字节的 `Link State ID` 字段，编码了特定于该 LSA 的信息。包含于这一字段中的信息，取决于 LSA 的类型。

最后，4 个字节的 `Advertising Router` 字段，包含着率先首次这条 LSA 的路由器 RID。


## 链路状态更新 LSU 数据包

链路状态更新（LSU）数据包，会被路由器用于通告 LSA。LSU 数据包可是到某个 OSPF 邻居的单播数据包，作为对某个接收自该邻居 LSR 的响应。但最常见的是，他们会在整个网络中，可靠地泛洪到 `AlISPFRouters` 的组播组地址 `224.0.0.5`，直到每个路由器都有了一份副本。这些泛洪更新数据包，随后会以 LSA 的确认数据包得以确认。当某条 LSA 数据包未得以确认时，默认其会被每五秒重传一次。下图 24.12 显示了一个作为对某个 LSR 数据包的响应，发送到某个邻居的 LSU。


![单播的 LSU 数据包](../images/3911.png)


**图 24.12** -- **单播的 LSU 数据包**

下面的图 24.13，演示了个被可靠泛洪到组播组地址 `224.0.0.5` 的 LSU。

![多播 LSU 数据包](../images/3912.png)

**图 24.13** -- **组播的 LSU 数据包**

LSU 由两部分组成。第一部分是 4 字节的 LSA 数量字段。这个字段显示了承载与该 LSU 数据包中的 LSA 数量。第二部分是一条或多条链路状态通告。这个可变长度字段，包含了完整的 LSA。每种类型的 LSA，都有着共同头部格式，以及描述其信息的一些具体数据字段。LSU 数据包可能包含一条 LSA 或多条 LSA。



## 链路状态确认 LSAck 数据包

链路状态确认（`LSAck`）数据包，用于确认每条 LSA，并以对 LSU 数据包的响应而发送。通过以 LSAck 显式确认数据包，由 OSPF 用到的泛洪机制，被认为是可靠的。

`LSAck` 包含了共同的 OSPF 头部，后跟一个 LSA 头部的列表。这个可变长度的字段，允许本地路由器使用单个数据包，确认多条 LSA。`LSAck` 使用组播发送。在多路访问网络上，当发送 `LSAck` 的路由器是个 DR 或 BDR 时，那么 `LSAck` 就会被发送到组播组地址 `224.0.0.5`（`AllSPFRouters`）。但是，当发送 `LSAck` 的路由器不是一个 DR 或 BDR 设备时，那么 `LSAck` 数据包将被发送到组播组地址 `224.0.0.6`（`AllDRRouters`）。下图 24.14 演示了 `LSAck` 的格式。


![链路状态确认数据包](../images/3913.png)

**图 24.14** -- **链路状态确认数据包**


总之，重要的是要记住这些不同 OSPF 数据包类型，及他们所包含的信息。这不仅会将让咱们在考试中获益，还有助于咱们将其作为一种协议，掌握 OSPF 的整体运行。


在 Cisco IOS 软件中，咱们可使用 `show ip ospf traffic` 命令，查看 OSPF 数据包的统计信息。这条命令会显示发送及接收的 OSPF 数据包总计数，并随后将这一数目进一步细分到单个的 OSPF 进程，并最后细分到该进程下启用了 OSPF 路由的那些接口。这条命令还可用于 OSPF 邻接关系建立的故障排除，并不会不像调试那样处理器密集。由这条命令打印的信息，如以下输出中所示：


```console
R4#show ip ospf traffic

OSPF statistics:
  Rcvd: 702 total, 0 checksum errors
        682 hello, 3 database desc, 0 link state req
        12 link state updates, 5 link state acks

  Sent: 1378 total
        1364 hello, 2 database desc, 1 link state req
        5 link state updates, 6 link state acks

            OSPF Router with ID (4.4.4.4) (Process ID 4)

OSPF queue statistics for process ID 4:

                   InputQ     UpdateQ    OutputQ
  Limit            0          200        0
  Drops            0          0          0
  Max delay [msec] 4          0          0
  Max size         2          2          2
    Invalid        0          0          0
    Hello          0          0          1
    DB des         2          2          1
    LS req         0          0          0
    LS upd         0          0          0
    LS ack         0          0          0
  Current size     0          0          0
    Invalid        0          0          0
    Hello          0          0          0
    DB des         0          0          0
    LS req         0          0          0
    LS upd         0          0          0
    LS ack         0          0          0

Interface statistics:

    Interface Serial0/0

OSPF packets received/sent
    Invalid  Hellos   DB-des    LS-req  LS-upd   LS-ack   Total
Rx: 0        683      3         0       12       5        703
Tx: 0        684      2         1       5        6        698

OSPF header errors
  Length 0, Auth Type 0, Checksum 0, Version 0,
  Bad Source 0, No Virtual Link 0, Area Mismatch 0,
  No Sham Link 0, Self Originated 0, Duplicate ID 0,
  Hello 0, MTU Mismatch 0, Nbr Ignored 0,
  LLS 0, Unknown Neighbor 0, Authentication 0,
  TTL Check Fail 0,

OSPF LSA errors
  Type 0, Length 0, Data 0, Checksum 0,

  Interface FastEthernet0/0

OSPF packets received/sent
    Invalid  Hellos   DB-des    LS-req  LS-upd   LS-ack   Total
Rx: 0        0        0         0       0        0        0
Tx: 0        682      0         0       0        0        682

OSPF header errors
  Length 0, Auth Type 0, Checksum 0, Version 0,
  Bad Source 0, No Virtual Link 0, Area Mismatch 0,
  No Sham Link 0, Self Originated 0, Duplicate ID 0,
  Hello 0, MTU Mismatch 0, Nbr Ignored 0,
  LLS 0, Unknown Neighbor 0, Authentication 0,
  TTL Check Fail 0,

OSPF LSA errors
  Type 0, Length 0, Data 0, Checksum 0,

Summary traffic statistics for process ID 4:

  Rcvd: 703 total, 0 errors
        683 hello, 3 database desc, 0 link state req
        12 link state upds, 5 link state acks, 0 invalid
  Sent: 1380 total
        1366 hello, 2 database desc, 1 link state req
        5 link state upds, 6 link state acks, 0 invalid
```

## 建立邻接关系

运行 OSPF 的路由器，在建立邻接关系前，会经历经过数种状态。在这些状态中，路由器会交换不同的数据包类型。这种报文交换，允许邻接关系的所有路由器，都有着网络的一致视图。对当前网络的其他更改，都只会作为增量更新发出。这些不同状态分别是 `Down`、`Attempt`、`Init`、`2-Way`、`Exstart`、`Exchange`、`Loading` 及 `Full`，如下所述：

- `Down` 状态是全部 OSPF 路由器的起始状态。但是，当在指定的路由器死亡间隔时间内，没有该接口的 `Hello` 数据包收到时，那么本地路由器也可能一个处于此状态下的邻居；
- `Attempt` 状态仅对 NBMA 网络上的 OSPF 邻居有效。在这种状态下，一个 `Hello` 数据包已发送，但在死亡间隔时间内，尚无信息自该静态配置的邻居收到；不过，正在努力与这个邻居建立邻接关系；
- `Init` 状态会于 OSPF 路由器接收到一个来自某个邻居的 `Hello` 数据包，但本地 RID 未在所接收的 `Neighbor` 字段中列出时到达。当一些 OSPF 的 `Hello` 参数，如定时器值等不匹配时，那么 OSPF 路由器将永远不会超越此状态；
- `2-Way` 状态表示与 OSPF 邻居的双向通信（每个路由器都已看到对方的 `Hello` 数据包）。在这种状态下，本地路由器已收到一个 `Neighbor` 字段中有着自己的 RID 的 `Hello` 数据包，同时两个路由器上的 `Hello` 数据包参数一致。处于这种状态时，路由器会决定是否与这个邻居邻接。在多路访问网络中，DR 和 BDR 会在此期间得以选出；
- `Exstart` 状态用于数据库同步过程的初始化。其正是本地路由器及其邻居，确立哪个路由器负责数据库同步进程的阶段。主从路由器会在这一状态下被选出，同时 DBD 交换的第一个序列号，会由主路由器决定出来；
- `Exchang` 状态是两个路由器使用 DBD 数据包，描述他们数据库内容之处。每个 DBD 序列都会被显式确认，同时于同一时刻只有一个未完成 DBD 被允许。在这一阶段期间，一些 LSR 数据包也会被发送，以请求 LSA 的某个新实例。在这一阶段期间，数据包的 `M`（更多）位会用于请求缺失信息。在两个路由器均已交换他们的完整数据库后，他们都将把 `M` 位设置为 `0`；
- 在 `Loading` 状态下，OSPF 路由器会构建一个 LSR 数据包，与一个链路状态重传列表。一些 LSR 数据包会被发送，以请求某条交换过程中未收到  LSA 的最新实例。于这一阶段期间发送的一些更新数据包，会被置于链路状态重发列表上，直到本地路由器收到确认。当本地路由器在此阶段还收到了某个 LSR 数据包时，那么他将以一个包含所请求信息的链路状态更新数据包加以响应。
- `Full` 状态表示 OSPF 邻居已交换他们的整个数据库，且双方达成一致（即对网络有着同一视图）。处于这种状态的两个相邻路由器，都会将这一邻接关系添加到他们的本地数据库中，并以一个链路状态更新数据包通告这种关系。在这一时刻，路由表会被计算出来，并当这一邻接关系被重置时被重新计算。`Full` 是 OSPF 路由器的正常状态。当某个路由器卡在别的状态时，那么这便是形成邻接关系时有些问题的表现。这点的唯一例外，便是 `2-Way` 状态，这种状态在广播及非广播的多路访问网络中是正常的，其中只通过他们的 DR 和 BDR 才会到达 `Full` 状态。别的邻居路由器，总是会将对方视为 `2-Way` 状态。

为了 OSPF 邻接关系得以成功建立，两个路由器上的一些参数必须匹配。这些参数包括以下的：

- 接口的 MTU 值（可被配置为忽略）
- `Hello` 及 `Dead` 定时器
- 区域 ID
- 认证类型及口令
- 末梢区域开关，the `Stub Area` flag
- 相容的网络类型


这些参数将在我们进一步学习这一教学模组时得以介绍。当这些参数不匹配时，OSPF 的邻接关系就将永远无法完全建立。

**注意**：除了不匹配的参数外，重要的是要记住，在多访问网络上，当两个路由器均被配置了 0 的优先级值时，那么邻接关系也将不会建立。DR 必须在此类网络类型上存在。



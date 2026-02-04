# FR 的运行

帧中继属于一种基于称为 X.25 的较旧协议的二层 WAN 协议，因其全面的错误检查能力，X.25 仍为 ATM 技术使用。帧中继由一条于其上许多逻辑电路可形成的物理电路构成。连接是按需建立的。帧中继网络的一个示例，如下所示：

![一个帧中继网络](../images/4201.png)

**图 37.7** -- **一个 FR 网络**


## 常用 FR 术语

### LMI

本地管理接口（Local Management Interface, LMI），是运行在帧中继交换机上的保活信号。这种交换机归属咱们的业务提供商，并位于他们的处所。咱们将需要指定咱们路由器上的 LMI 类型，除非使用默认的 `CISCO`。三种可用的 LMI 类型如下：

- `CISCO`
- `ANSI`
- `Q933a`


这三种 LMI 如下图 37.8 中所示：

![本地管理接口的类型](../images/4202.png)

**图 37.8** -- **本地管理接口的类型**

当咱们遇到咱们帧中继连接的故障时，那么调试 LMI 消息就会是咱们的故障排除步骤之一，如下输出中所示：

```console
RouterA#debug frame-relay lmi

00:46:58: Serial0(in): Status, myseq 55
00:46:58: RT IE 1, length 1, type 0
00:46:58: KA IE 3, length 2, yourseq 55, myseq 55
00:46:58: PVC IE 0x7 , length 0x6 , dlci 100, status 0x2 , bw 0
```

LMI 会每 10 秒发送，每六条消息便是一次完整的状态更新。如上所示，咱们希望他报告 `status 0x2`，即一条活动链路。


### PVC

所谓永久虚电路（Permanent Virtual Circuit，PVC），是形成于咱们帧中继网络的一端，到另一端的一条的端到端逻辑连接，如下图 37.9 中所示。两个端点都会被赋予一个 DLCI 编号（见下一小节），用于识别二者。

![永久虚拟电路](../images/4203.png)

**图 37.9** -- **一条永久虚电路**


### DLCI

所谓数据链路的连接标识符（Data Link Connection Identifier, DLCI），是个本地有效的编号，用于标识咱们到帧中继交换机的连接，如下图 37.10 中所示。这一编号可以是 10 到 1007 中的任意数字（含 10 和 1007）。

![数据链路连接标识符将用户路由器标识给电信公司](../images/4204.png)

**图 37.10** -- **DLCI 向电信公司标识咱们的路由器**


通常，在排查帧中继链路故障时，问题都在于客户或服务提供商，在他们的配置中使用了错误 DLCI 编号。

当咱们的 DLCI 为活动的时，一条端到端连接便会按以下顺序形成：

1. 活动 DLCI 发送反向 ARP 请求
2. DLCI 等待网络地址回复
3. 远端路由器的映射得以创建
4. `Active`/`Inactive`/`Deleted` 的 DLCI 状态

### NNI

网络到网络接口（Network-to-Network Interface, NNI），即帧中继交换机之间的连接。


> **译注**：参考 [wikipedia: NNI](https://en.wikipedia.org/wiki/Network-to-network_interface)。

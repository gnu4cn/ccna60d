# 第 42 天 帧中继与点对点协议

__Frame Relay and PPP__

___

Gitbook：[ccna60d.xfoss.com](https://ccna60d.xfoss.com/)


你可以在 https://github.com/gnu4cn/ccna60d 上 fork 本项目，并提交你的修正。


本书结合了学习技巧，包括阅读、复习、背书、测试以及 hands-on 实验。

> 本书译者用其业余时间完成本书的翻译工作，并将其公布到网上，以方便你对网络技术的学习掌握，为使译者更有动力改进翻译及完成剩下章节，你可以 [捐赠译者](https://github.com/gnu4cn/buy-me-a-coffee)。

___

## 第 42 天任务

- 阅读今天的课文（下面）
- 复习昨天的课文
- 完成今天的实验
- 阅读 ICND2 的记诵指南
- 在[subnetting.org](https://subnetting.org/)网站上花 15 分钟

多年来，帧中继都是 CCNA 甚至 CCIE 大纲的重要部分；但由于公司数字订户线路的广泛可用与长租专线的价格越来越亲民，从而导致帧中继技术的流行度近来日渐式微。这里之所以要涉及，是因为其包含在 CCNA 大纲中。点对点协议仍有广泛使用。

今天将学到以下内容：

- 帧中继的运作（Frame Relay operations）
- 帧中继的配置
- 帧中继的故障排除
- 点对点协议的运作
- 点对点协议的配置
- 点对点协议的故障排除

本课程对应了以下 CCNA 大纲要求：

+ 识别不同的广域网技术
    - 帧中继技术
+ 配置并验证思科路由器之间的点对点协议


## 点对点协议的运作

由于下面这些因素，点对点协议（Point-to-Poinit Protocol， PPP ）被认为是一种互联网友好的协议：

- 其支持数据压缩
- 内建了认证（`PAP`及`CHAP`）
- 网络层的地址协商（Network Layer address negotiation）
- 错误侦测能力

在包括下面这些多种连接类型上都可以使用点对点协议：

- `DSL`
- `ISDN`
- 各种同步与异步链路
- `HSSI`

点对点协议可拆分为以下的二层子层（Layer 2 sublayers）:

- `NCP` -- 建立网络层协议（为网络层服务， establishes Network Layer protocols(serves the Network Layer)）
- `LCP` -- 链路建立、链路认证以及对链路质量进行测试（服务物理层，estalishes, authenticates, and tests link quality）
- `HDLC` -- 对链路上的数据报进行封装

掌握上面这些知识，将在 CCNA 考试中大有裨益！

## 点对点协议的配置

如同下图 42.7及下面的输出那样，点对点协议是非常容易配置的。稍后还将演示如何为点对点协议加上认证。

![一个点对点协议连接](images/4207.png)

*图 42.7 -- 一个点对点协议的连接*

```console
R1#conf t
R1(config)#interface s0
R1(config-if)#ip add 192.168.1.1 255.255.255.0
R1(config-if)#clock rate 64000
R1(config-if)#encapsulation ppp
R1(config-if)#no shut
R2#conf t
R2(config)#interface s0
R2(config-if)#ip add 192.168.1.2 255.255.255.0
R2(config-if)#encapsulation ppp
R2(config-if)#no shut
```

## 点对点协议的认证

点对点协议有着内建的口令认证协议（PAP, Password Authentication Protocol）或询问握手认证协议（CHAP, Challenge Handshake Authentication Protocol）形式的认证。口令认证协议将口令以明文形式在链路上发送，这有着安全风险，而询问握手认证协议则是发送使用了 MD5 加密的散列值。下面是询问握手认证协议的配置：

![带有询问握手认证协议的点对点协议](images/4208.png)

*图 42.8 -- 带有询问握手认证协议的点对点协议*

```console
R1#conf t
R1(config)#username R2 password Cisco
R1(config)#interface s0
R1(config-if)#ip add 192.168.1.1 255.255.255.0
R1(config-if)#clock rate 64000
R1(config-if)#encapsulation ppp
R1(config-if)#ppp authentication chap
R1(config-if)#no shut


R2#conf t
R2(config)#username R1 password Cisco
R2(config)#interface s0
R2(config-if)#ip add 192.168.1.2 255.255.255.0
R2(config-if)#encapsulation ppp
R2(config-if)#ppp authentication chap
R2(config-if)#no shut
```

若要配置口令认证协议，可将上面配置中的`[chap]`关键字，替换为`[pap]`关键字。还可将点对点协议配置为尝试使用询问握手认证协议，在使用询问握手认证协议失败时，再尝试口令认证协议。这就是所谓的点对点协议回退特性（PPP fallback），下面就是配置此特性的命令：

```console
R2(config-if)#ppp authentication chap ppp
```

## PPP的故障排除

执行一下`show interface serial 0/0`命令，或以其他相应的接口编号，以将 IP 地址、接口状态及封装类型等参数显示出来，如下面的输出所示：

```console
RouterA#show interface Serial0/0

Serial0 is up, line protocol is up
  Hardware is HD64570
  Internet address is 192.168.1.1/30
  MTU 1500 bytes, BW 1544 Kbit, DLY 20000 usec,
    reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation PPP, loopback not set
  Keepalive set (10 sec)
```

在使用了询问握手认证协议时，就要检查用户名是否与所呼叫的路由器是否匹配，同时记住这里的主机名是区分大小写的。使用`debug ppp authentication`与`debug ppp negotiation`两个命令来对点对点协议会话的建立进行故障排除。

## 第 42 天问题

1. Frame Relay is based on which older protocol?
2. What are the three types of LMIs available?
3. An LMI is sent every `_______` seconds, and every `_______` message is a full status update.
4. The DLCI number is only locally significant, so you could have a different one for the other end of your Frame Relay connection. True or false?
5. Explain the difference between BECNs and FECNs.
6. PPP does not include data compression or error detection. True or false?
7. Name the PPP sublayers.
8. Write out the command to configure CHAP with PPP.
9. Which command will show you the encapsulation type on your Serial interface?
10. `_______` sends the passwords over the link in clear text, which poses a security risk, whereas `_______` sends a hashed value using MD5 security.

## 第 42 天答案

1. The X.25 protocol.
2. CISCO, ANSI, and Q933a.
3. 10, sixth.
4. True.
5. Backward Explicit Congestion Notification (BECN): Frames in the direction opposite of the frame transmission experienced congestion; Forward Explicit Congestion Notification(FECN): Congestion was experienced in the direction of the frame transmission.
6. False.
7. NCP, LCP, and HDLC.
8. `ppp authentication chap`.
9. The show `interface serial [number]` command.
10. PAP, CHAP.


（End）



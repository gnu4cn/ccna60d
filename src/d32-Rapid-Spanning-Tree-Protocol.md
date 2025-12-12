# 第 32 天 快速生成树协议

**Rapid Spanning Tree Protocol**

___

Gitbook：[ccna60d.xfoss.com](https://ccna60d.xfoss.com/)


你可以在 https://github.com/gnu4cn/ccna60d 上 fork 本项目，并提交你的修正。


本书结合了学习技巧，包括阅读、复习、背书、测试以及 hands-on 实验。

> 本书译者用其业余时间完成本书的翻译工作，并将其公布到网上，以方便你对网络技术的学习掌握，为使译者更有动力改进翻译及完成剩下章节，你可以 [捐赠译者](https://github.com/gnu4cn/buy-me-a-coffee)。

___

#第 32 天任务

- 阅读今天的课文
- 复习昨天的课文
- 完成今天的实验
- 阅读 ICND2 记诵指南
- 在网站 [subnetting.org/](http://subnetting.org/) 花 15 分钟

IEEE 802.1D标准是在连通性从失去到恢复需要一分钟左右，就被认为性能已经可观的时期设计出来的。在IEEE 802.1D STP下，恢复大约需要 50 秒，这其中包括 20 秒的最大老化计时器（the Max Age timer）超时，以及额外的给端口从阻塞状态过渡到转发状态的 30 秒。

随着计算机技术的进化，网络变得更为重要，更为快速的网络收敛显然是人们所需要的。思科通过开发一些包括骨干快速（Backbone Fast）及上行快速（Uplink Fast）等专有的 STP 增强，来满足此需求。

今天你将学到以下知识。

- RSTP的需求, the need for RSTP
- 配置 RSTP ，RSTP configuration

本课对应了以下 CCNA 大纲要求。

+ 认识增强的交换技术，identify enhanced switching technologies
    - RSTP
    - PVSTP

## RSTP的需求

**the Need for RSTP**

随着技术的持续演化，以及在同一物理平台上路由及交换的融合，在诸如 OSPF 及 EIGRP 这样的可以在更短时间内提供出替代路径的路由协议面前，交换网络的延迟就变得明显起来。802.1W标准就被设计出来解决此问题。

IEEE 802.1W标准，或者是快速生成树协议（Rapid Spanning Tree Protocol, RSTP）, 显著地缩短了在某条链路失效时， STP 用于收敛的时间。在 RSTP 下，网络从故障切换到一条替代路径或链路可在亚秒级别完成（with RSTP, network failover to an alternate path or link can occur in a subsecond timeframe）。 RSTP 是802.1D的一个扩展，执行与上行快速及骨干快速类似的功能。**RSTP比传统的 STP 执行得更好，且无需额外配置。此外， RSTP 向后兼容最初的IEEE 802.1D STP标准。**其通过使用一种如下面的截屏中所示的修改的 BPDU ，实现的向后兼容。



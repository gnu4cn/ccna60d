# 第 10 天 生成树协议

- 阅读今天的课文（如下）；
- 完成今天的实验；
- 参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试；
- 阅读 CCNA 补习指南；
- 在 subnetting.org 上花 10 分钟回答问题。

生成树协议（STP）的作用，是在允许冗余交换网络拓扑结构下物理链接的同时，通过创建无环路的逻辑拓扑结构，防止环路出现在咱们的网络中。随着网络中交换机使用的大量增加，以及传播 VLAN 信息这一主要目标下，开始数据帧在网络上无休止循环的问题开始发生了。

以前的 CCNA 考试，只要求对 STP 的基本了解。而当前的考试版本，则要求咱们对这一主题有扎实的掌握。

[IEEE 802.1D](https://en.wikipedia.org/wiki/IEEE_802.1D) 设计于当时连接中断后的恢复时间，在一分钟左右即被认为性能足够的时代。在 IEEE 802.1D 的 STP 下，恢复需要约为 50 秒，其中包括了 20 秒的最大老化计时器，和端口从阻塞状态到转发状态过渡的额外 30 秒。

随着计算机技术的进步，网络变得越来越重要，显然更快速的网络收敛是必要的。思科通过开发一些包括 “背板快速” 与 “上行快速” 的对 STP 的专有增强功能，满足这一要求。

> *知识点*：
>
> - the IEEE 802.1D standard
>
> - the MAX Age timer
>
> - the Blocking state
>
> - the Forwarding state
>
> - Backbone Fast
>
> - Uplink Fast


今天，咱们将学习以下内容：


- STP 的必要性
- IEEE 802.1D 的配置 BPDUs
- 生成树的端口状态
- 生成树的网桥 ID
- 生成树的根网桥选举
- 生成树的开销与优先级
- 生成树的根端口与指定端口
- 思科的生成树增强功能
- STP 的故障排除
- RSTP 的必要性
- 配置 RSTP
- 扩展 VLANs




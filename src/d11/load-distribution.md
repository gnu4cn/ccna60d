# 以太通道负载分配方法

对于 PAgP 和 LACP 两种 EtherChannel，Catalyst 交换机均会利用一种利用数据包头部的一些关键字段，生成一个哈希值，然后其与 EtherChannel 组中某条物理链路匹配的多态算法。换句话说，交换机通过自数据帧中地址形成的二进制模式，化简为一个会选取 EtherChannel 中一条链路的数字值，而把流量负载分配到该 EtherChannel 中的链路。<sup>1</sup>

> **译注**：
>
> <sup>1</sup> 参考 [二进制值与位语法](https://erl.xfoss.com/part-ii/Ch07-binaries_and_the_bit_syntax.html)，译者相信 Cisco 在实现这种多态算法时，应是用到 Erlang/OTP 语言。

这一操作可在 MAC 地址或 IP 地址上完成，并可仅基于源地址或目的地址，甚至同时基于源地址和目的地址。虽然详细研究 EtherChannel 负载分配中用到的哈希值具体计算，超出了 CCNA 考试要求的范围，但重要的是要知道，管理员可以定义头部中的哪些字段，可用作用于确定数据包物理链路传输算法的输入。

负载分配方式经由 `port-channel load-balance [method]` 这条全局配置命令配置。任何时候都只能有一种方式被使用。下表 11.3 列出并描述了在配置 EtherChannel 负载分配时，Cisco IOS Catalyst 交换机中可用的不同方式：


**表 11.3** -- **EtherChannel 的负载分配（负载均衡）选项**


| 方式 | 描述 |
| :-- | :-- |
| `dst-ip` | 基于目的 IP 地址执行负载分配。 |
| `dst-mac` | 基于目的 MAC 地址执行负载分配。 |
| `dst-port` | 基于目的地四层端口，执行负载分配。 |
| `src-dst-ip` | 基于源与目的 IP 地址，执行负载分配。 |
| `src-dst-mac` | 基于源与目的 MAC 地址，执行负载分配。 |
| `src-dst-port` | 基于源与目的地的四层端口，执行负载分配。 |
| `src-ip` | 基于源 IP 地址执行负载分配。 |
| `src-mac` | 基于源 MAC 地址执行负载分配。 |
| `src-port` | 基于源的四层端口，执行负载分配。 |


> *知识点*：
>
> - a polymorphic algorithm that utilizes key fields from the header of the packet to generate a hash, which is then matched to a physical link in the EtherChannel group.
>
> - by reducing part of the binary pattern, which is formed from the addresses in the frame, to a numerical value that selects one of the links in the EtherChannel
>
> - a hash used in EtherChannel load distribution
>
> - the physical link transport to the packet

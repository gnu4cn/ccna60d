# 有类协议与无类协议

有类协议不能使用 VLSM（即 RIPv1 与 IGRP，他们已不在 CCNA 考试大纲中）。这是因为他们的开发先于 VLSM，因此除了默认网络掩码外，他们识别不了其他网络掩码。

```console
Router#debug ip rip
RIP protocol debugging is on
01:26:59: RIP: sending v1 update to 255.255.255.255 via Loopback0
192.168.1.1
```

无类协议使用了 VLSM（即 RIPv2 与 EIGRP）。

```console
Router#debug ip rip
RIP protocol debugging is on
01:29:15: RIP: received v2 update from 172.16.1.2 on Serial0
01:29:15:192.168.2.0/24 via 0.0.0.0
```


> *知识点*：
>
> - classful protocols(routing)
>
> - classless protocols(routing)
>
> - Variable Length Subnet Mask, VLSM
>
> - the default network masks

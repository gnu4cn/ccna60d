# WAN 连接故障排除


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




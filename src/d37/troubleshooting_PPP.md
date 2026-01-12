# PPP 的故障排除

执行一次 `show interface serial 0/0` 命令，或相关接口的编号，显示 IP 地址、接口状态与封装类型等，如下输出中所示：


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


当咱们正使用 CHAP 认证时，那么就要排查确保用户名与咱们正呼叫路由器上的用户名匹配，并要记住主机名是区分大小写的。咱们可以 `debug ppp authentication` 及 `debug ppp negotiation` 两条命令，排查 PPP 会话的建立。



# DNS 的运行

DNS 会映射主机名到 IP 地址（而不是相反）。这允许咱们可在咱们的 web 浏览器中，浏览某个 web 地址，而不是服务器的 IP 地址。

当某个主机或某个路由器想要解析某个域名为 IP 地址时（反之亦然），DNS 会使用 UDP 的端口 53。当两个 DNS 服务器想要同步或共用他们的数据库（区传送），或在响应大小超过 512 字节时，那么 TCP 的端口 53 就会被用到。


## 配置 DNS

当咱们打算允许咱们的路由器，查找 web 上的某个 DNS 服务器时，那么就要使用 `ip name-server [ip address]` 这条命令。


咱们也可设置某个主机名到咱们路由器上的 IP 地址表中，以节省时间，或使记住要 `ping` 的或要连接的设备更容易，如下输出中所示。


```console
Router(config)#ip host R2 192.168.1.2
Router(config)#ip host R3 192.168.1.3
Router(config)#exit
Router#ping R2
Router#pinging 192.168.1.2
!!!!!
```



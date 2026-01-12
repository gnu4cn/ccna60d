# 基本串行线路配置

当咱们不打算更改默认的 HDLC 封装方式时，那么为了建立咱们的 WAN 连接，咱们只需执行以下擦作：

1. 添加一个 IP 地址到咱们的接口；
2. 启用该接口（以 `no shut`命令）;
3. 确保 DCE 侧有个时钟速率。

当咱们已连接 DCE 线缆时，那么下面便是这一配置：

```console
Router#config t
Router(config)#interface Serial0
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#clock rate 64000
Router(config-if)#no shutdown
Router(config-if)#^Z
Router#
```



# 配置帧中继

不幸的是，要配置帧中继可能有些棘手，这是因为不同网络类型需要不同的命令。其原因在于，要解决 WAN 上网络地址如何解析，以及路由协议如何运行两大问题。要配置帧中继的步骤如下：

1. 设置封装方式
2. 设置 LMI 类型（可选）
3. 配置静态/动态的地址映射
4. 解决特定于协议的那些问题


在 CCNA 考试中，咱们不会被要求掌握如何配置电信公司帧中继交换机。咱们只会在某一家庭或远程实验中，建立咱们自己的帧中继连接时，才会打算了解如何完成这一配置。

![帧中继网络](../images/4206.png)

**图 37.12** -- **帧中继的网络***

针对上面的网络拓扑，咱们会在位于中间的帧中继交换机上，配置以下内容。请仅将这一信息作为参考，因为对于考试咱们将不需要他：


```console
Router#conf t
Router(config)#frame-relay switching
Router(config)#int s0
Router(config-if)#clock rate 64000
Router(config-if)#encapsulation frame-relay
Router(config-if)#frame-relay intf-type dce
Router(config-if)#frame-relay route 121 interface s1 112
Router(config-if)#frame-relay route 121 interface s2 111
Router(config-if)#no shut
Router(config-if)#int s1
Router(config-if)#clock rate 64000
Router(config-if)#encapsulation frame-relay
Router(config-if)#frame-relay intf-type dce
Router(config-if)#frame-relay route 112 interface s0 121
Router(config-if)#frame-relay route 112 interface s2 111
Router(config-if)#int s2
Router(config-if)#clock rate 64000
Router(config-if)#encapsulation frame-relay
Router(config-if)#frame-relay intf-type dce
Router(config-if)#frame-relay route 111 interface s0 121
Router(config-if)#frame-relay route 111 interface s1 112
Router(config-if)#no shut
Router#show frame-relay route
```



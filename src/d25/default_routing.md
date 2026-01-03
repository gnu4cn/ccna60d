# OSPF 的默认路由

与支持数种生成与通告默认路由方式的 EIGRP，OSPF 只会使用 `default-information originate [always] [metric <value>] [metric-type <1|2>] [route-map <name>]` 这条路由器配置命令，动态地通告默认路由。

只有当某条默认路由已存在与路由表中时，`default-information originate` 这条命令本身，才会将路由器配置为通告默认路由。不过，`[always]` 这个关键字，可被追加到这条命令，强制该路由器生成一条默认路由，即使路由表中不存在一条默认路由。这个关键字应谨慎使用，因为他可能会导致 OSPF 域内的流量黑洞，或转发所有未知目的地的数据包，到这个已配置的路由器。

其中 `[metric <value>]` 关键字用于指定所生成默认路由的路由度量值。`[metric-type <1/2>]` 关键字，可用于更改默认路由的度量值类型。最后，`[route-map <name>]` 这个关键字，会将该路由器配置为，仅在于那个命名的路由地图中指定的条件满足，才生成默认路由。

以下配置示例，演示了如何将某个启用 OSPF 的路由器，配置为当一条默认路由已存在于路由表中时，生成并通告一条默认路由。当多种路由协议已配置于该路由器上时，那么现有的默认路由，就可能是条静态路由，甚至可能是条来自其他路由协议的默认路由。下面的输出演示了基于一条已配置静态默认路由的这种配置：

```console
R4(config)#ip route 0.0.0.0 0.0.0.0 FastEthernet0/0 172.16.4.254
R4(config)#router ospf 4
R4(config-router)#network 172.16.4.0 0.0.0.255 Area 2
R4(config-router)#default-information originate
R4(config-router)#exit
```

默认情况下，默认路由是作为一条 `Type 5` 的 LSA 通告的。




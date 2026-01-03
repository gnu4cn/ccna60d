# 配置 OSPF

基本的 OSPF，可在路由器上以一行配置启用，并添加添加 `network` 语句，指定咱们打算在哪些接口上运行 OSPF，而不一定是咱们希望通告的那些网络：


1. `router ospf 9` 这是个本地有效的数字
2. `network 10.0.0.0 0.255.255.255 are 0`

在至少一个接口为 `up/up` 前，OSPF 将不会称为活动状态，同时要记住，至少要有一个区域必须为 `Area 0`。一个示例 OSPF 如下图 25.2 中所示。


![一个示例 OSPF 网络](../images/3914.png)

**图 25.2** -- **一个示例 OSPF 网络**

`Router A` 的配置：

```console
router ospf 20
network 4.4.4.4 0.0.0.0 area 0
network 192.168.1.0 0.0.0.255 area 0
router-id 4.4.4.4
```

`Router B` 的配置：

```console
router ospf 22
network 172.16.1.0 0.0.0.255 area 0
network 192.168.1.0 0.0.0.255 area 0
router-id 192.168.1.2
```

`Router C` 的配置：

```console
router ospf 44
network 1.1.1.1 0.0.0.0 area 1
network 172.16.1.0 0.0.0.255 area 0
router-id 1.1.1.1

RouterC#show ip route
Gateway of last resort is not set
     1.0.0.0/32 is subnetted, 1 subnets
C       1.1.1.1 is directly connected, Loopback0
     4.0.0.0/32 is subnetted, 1 subnets
O       4.4.4.4 [110/129] via 172.16.1.1, 00:10:39, Serial0/0/0
     172.16.0.0/24 is subnetted, 1 subnets
C       172.16.1.0 is directly connected, Serial0/0/0
O     192.168.1.0/24 [110/128] via 172.16.1.1, 00:10:39, Serial0/0/0
```



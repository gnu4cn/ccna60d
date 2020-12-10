# 端口镜像操作（华为）

端口镜像可以是：本地端口镜像、远程端口镜像。

## 本地端口镜像

1. 设置观察端口： 

```console
SwitchA> sys
SwitchA] observe-port 1 interface Ethernet 0/0/47 cr
```

上面的命令，将`Ethernet 0/0/47` 设置为观察端口，其中的`1`是指观察索引号，只能设置`4`个的观察端口（`Huawei Versatile Routing Platform Software(VRP) Version 5.70`）。

2. 设置镜像端口


```console
SwitchA> sys
SwitchA] interface Ethernet 0/0/36
SwitchA-Ethernet0/0/36] port-mirroring to observe-port 1 inbound/outbound/both cr
```

需要先进入接口模式，然后执行以上的`port-mirroring`命令，其中的`1`是第一步设置的观察索引号，`inbound/outbound/both`是指：上传流量、下载流量与全部流量。

> 需要注意的是：在上面两个接口中，`Ethernet 0/0/47`是接入监测设备的端口，而`Ethernet 0/0/36`是被监测的端口；检测设备网卡要打开混杂模式（`$sudo ifconfig enp2s0 promisc`, 关闭混杂模式： `$sudo ifconfig enp2s0 -promisc`）；

## 远程的端口镜像

远程的端口镜像，是在本地端口镜像操作基础上，将观察端口（也就是上述本地端口镜像中的`Ethernet 0/0/47`）放到一个特别的镜像用`Vlan`中，并在本地交换机、核心交换机及观察端口所在交换机的中继端口上允许该`Vlan`通过，并将远端交换机上的观察端口，置为`access`模式，放在镜像用`Vlan`上即可。

# 思科 IOS 软件 OSPFv2 与 OSPFv3 的配置差异

在思科 10S 软件中配置 OSPFv2 与 OSPFv3 时存在一些配置差异。然而，应指出的是，这些差异并不像其他路由协议的 IPv4 版本，与他们的 IPv6 对应版本之间差异那么显著。

在 Cisco 10S 软件中，OSPFv3 的路由，是通过使用 `ipv6 router ospf [process 1D]` 这条全局配置命令启用的。正如 OSPFv2 下的情形一样，OSPF 的进程 ID 仅对本地路由器具有意义，且为了邻接关系建立，而无需在邻接路由器上一样。

正如 EIGRPv6 所要求的，OSPFv3 的路由器 ID 必须予以手动指定，或被配置为某个有着 IPv4 地址的运行接口（比如某个环回接口）。类似于 EIGRPv6，在启用 OSPFv3 时并未用到网络命令。取而代之的是，OSPFv3 是按接口启用的，且多个实例可于同一接口上启用。

最后，在于诸如帧中继及 ATM 等一些非广播单播网络（NBMA）上配置 OSPFv3 时，邻居的声明，是在特定接口下，使用 `ipv6 ospf neighbor [link local address]` 这条接口配置命令予以指定的。而在 OSPFv2 下，这些邻居声明则将在路由器配置模式下予以配置。


> **译注**： 邻居路由器要形成邻接关系，要求：
>
> 1. 区域号一致；
>
> 2. 认证一直；
>
> 3. `Hello` 包、死亡间隔时间值一致；
>
> 不要求：进程号一致。
>
> `Hello` 数据包用于动态邻居发现和形成邻接关系，因此 `Hello` 数据包包含上述要求的参数，不包含不要求的参数。只有形成了邻接关系，才能开始发送和接受 LSAs 。

**注意**：在一些 NBMA 技术上配置 OSPFv3 时，咱们应使用链路本地地址，创建出一些静态的帧中继映射语句。这是因为链路本地地址会被用于建立邻接关系，而非全局单播地址。例如，要创建一条静态帧中继映射语句，并指定某一帧中继部署的 OSPF 邻居，就要在路由器上部署以下配置：

```console
R1(config)#ipv6 unicast-routing
R1(config)#ipv6 router ospf 1
R1(config-rtr)#router-id 1.1.1.1
R1(config-rtr)#exit
R1(config)#interface Serial0/0
R1(config-if)#frame-relay map ipv6 FE80::205:5EFF:FE6E:5C80 111 broadcast
R1(config-if)#ipv6 ospf neighbor FE80::205:5EFF:FE6E:5C80
R1(config-if)#exit
```



# 第 15 天实验

## OSPFv3 基础实验

重复第`12`天的实验场景（两台路由器直连，各自又有环回接口），但以配置 IPv6 地址并在设备间使用 OSPFv3 对这些地址进行通告，取代配置 IPv4 的 OSPF 。

- 给直连接口分配上 IPv6 地址（`2001:100::1/64`及`2001:100::2/64`）
- 用`ping`测试直接连通性
- 在两台路由器上分别配置一个环回接口，并从两个不同范围分配地址（`2002::1/128`及`2002::2/128`）
- 配置标准的OSPFv3 `1`号进程并将所有本地网络在`0`号区域进行通告。同时为各设备配置一个路由器 ID 。

**R1:**

```console
ipv6 router ospf 1
router-id 1.1.1.1
int fa0/0(或特定接口编号)
ipv6 ospf 1 area 0
int lo0(或特定接口编号)
ipv6 ospf 1 area 0
```

**R2:**

```console
ipv6 router ospf 1
router-id 2.2.2.2
int fa0/0(或特定接口编号)
ipv6 ospf 1 area 0
int lo0(或特定接口编号)
ipv6 ospf 1 area 0
```

- 自`R1`向`R2`的 IPv6 环回接口发出`ping`操作，以测试连通性
- 执行一个`show ipv6 route`命令，来验证有通过 OSPFv3 接收到路由
- 执行一个`show ipv6 protocols`命令，来验证有配置 OSPFv3 且在设备上是活动的
- 执行命令`show ipv6 ospf interface`及`show ipv6 ospf interface brief`，检查接口特定于 OSPF 的那些参数
- 在两台路由器上（直连接口）修改`Hello`包和死亡计时器: `ipv6 ospf hello`及`ipv6 ospf dead`
- 执行一下`show ipv6 ospf 1`命令，来查看路由进程参数


（End）



# 第 17 天实验

## 路由概念实验

使用两台直连路由器，测试这一教学模组中描述过的那些基本命令。RIP 很快就会介绍，所以现在只要复制我（作者）的命令即可。

1. 分别分配一个 IPv4 地址给直连的接口（`10.10.10.1/24` 和 `10.10.10.2/24`）；
2. 使用 `ping` 测试直接连通性；
3. 在两台路由器上都配置一个 `Loopback` 接口，并分别分配两个不同范围的地址（`R1` 的 `11.11.11.1/24`，`R2` 的 `12.12.12.2/24`）；
4. 配置 RIP 并通告所有本地网络；


**`R1`**:

```console
router rip
version 2
no auto
network 10.10.10.0
network 11.11.11.0
```


**`R2`**:

```console
router rip
version 2
no auto
network 10.10.10.0
network 12.12.12.0
```


5. 自 `R1` `ping` `R2` 的 `Loopback`，测试连通性；
6. 执行 `show ip route` 命令，验证路由是否正经由 RIP 接收；
7. 执行 `show ip protocols` 命令，验证 RIP 是否已在设备上配置及活动。检查管理距离。



（End）


# 第 25 天实验

## OSPFv3 基础实验

重复第 24 天的场景（两台路由器直相，两台上的环回接口），但这次不是配置 IPv4 的 OSPF，而要配置一些 IPv6 地址，并在两台设备之间通过使用 OSPFv3 通告他们：

- 分别分配一个 IPv6 地址到直连的两个接口（`2001:100::1/64` 及 `2001:100::2/64`）；
- 使用 `ping` 测试直连连通通性；
- 在两台路由器上分别配置一个环回接口，并分配两个不同地址段（`2002::1/128` 和 `2002::2/128`）中的地址；
- 配置标准的 OSPFv3 进程 1，并通告 `Area 0` 中的所有本地网络。同时，为每台设备配置一个路由器 ID；

    **R1**：

    ```console
    ipv6 router ospf 1
    router-id 1.1.1.1
    int fa0/0 (or the specific interface number)
    ipv6 ospf 1 area 0
    int lo0 (or the specific interface number)
    ipv6 ospf 1 area 0
    ```

    **R2**：

    ```console
    ipv6 router ospf 1
    router-id 2.2.2.2
    int fa0/0 (or the specific interface number)
    ipv6 ospf 1 area 0
    int lo0 (or the specific interface number)
    ipv6 ospf 1 area 0
    ```

- 从 `R1` `ping` 向 `R2` 的 IPv6 环回地址，测试连通性；
- 执行一次 `show ipv6 route` 命令，验证路由是否正经由 OSPFv3 被接收到；
- 执行一次 `show ipv6 protocols` 命令，验证设备 OSPFv3 是否已在两台设备上得以配置并启用；
- 验证接口的那些 OSPF 专属参数：`show ipv6 ospf interface` 与 `show ipv6 ospf interface brief`；
- 修改两台路由器上（直连接口）的 OSPF `Hello` 及 `Dead` 定时器：`ipv6 ospf hello` 与 `ipv6 ospf dead`；
- 执行一次 `show ipv6 ospf 1` 命令，看看路由进程的那些参数。



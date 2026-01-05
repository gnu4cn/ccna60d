# 使用 ACL 限制 Telnet 与 SSH 访问


除了过滤接口级别的流量外，ACL 还可与许多其他设备特性关联，包括过滤 VTY 线路上的流量。在前面的一个教学模组中，咱们曾学习了如何使用 `line vty` 命令，配置到设备（如路由器或交换机）的 Telnet 或 SSH 访问。

有时，咱们或许不打算接受与设备之间的所有 Telnet/SSH 连接。为了操纵这点，咱们就必须定义一个定义了在 VTY 线路上，放行或拒绝流量类型的 ACL。这个 ACL 可以是编号的或命名的。咱们可使用 `access-class <acl> [in|out]` 这条命令，将这个 ACL 关联到 VTY 线路。

下面的示例定义了个放行来自主机 `10.10.10.1` 的 Telnet 流量 ACL，其随后将应用到 VTY 线路的入站（方向）：


```console
Router(config)#ip access-list extended VTY_ACCESS
Router(config-ext-nacl)#permit tcp host 10.10.10.1 any eq telnet
Router(config-ext-nacl)#deny tcp any any
Router(config-ext-nacl)#exit
Router(config)#
Router(config)#line vty 0 4
Router(config-line)# access-class VTY_ACCESS in
Router(config-line)#
```

咱们可使用以下命令，验证这一配置：

```console
Router#show run | sect line vty
line vty 0 4
access-class VTY_ACCESS in
```



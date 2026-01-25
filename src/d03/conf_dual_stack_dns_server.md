# 在思科 IOS 软件中配置 IPv4 及 IPv6 的 DNS 服务器

在思科 10S 软件中，IPv4 和 IPv6 的 DNS 服务器配置，仍会使用 `ip name-server [address]` 这条全局配置命令。这同一条命令现已修改为允许 DNS 服务器的 IP 地址，被指定为 IPv4 或 IPv6 的地址。以下示例演示了如何配置某一路由器为同时使用一个 IPv4 及 IPv6 的 DNS 服务器：


```console
R1(config)#ip name-server ?
    A.B.C.D Domain server IP address (maximum of 6)
    X:X:X:X::X Domain server IP address (maximum of 6)
R1(config)#ip name-server 3FFF:1234:ABCD:1::2
R1(config)#ip name-server 192.168.1.2
```

**注意**：正如前面曾提到的，当 IPv6 与 IPv4 的 DNS 服务器于同一台路由器上配置了时，那么路由器将首先查找 AAAA 记录（即 IPv6 记录）。但是，当 AAAA 记录未找到时，那么该主机就会查找 A 记录，以与这一主机名通信。




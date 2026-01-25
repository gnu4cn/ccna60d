# 在思科 IOS 软件中配置静态的 IPv4 及 IPv6 主机地址

Cisco 10S 软件分别使用 `ip host [name] [v4-address]` 及 `ipv6 host [name] [v6-address]` 这两条全局配置命令，同时支持静态 IPv4 及 IPv6 主机地址的配置。以下示例演示了在 Cisco 10S 软件中，如何配置静态的 IPv4 和 IPv6 主机名与地址：

```console
R1(config)#ip host TEST-HOST 10.0.0.3
R1(config)#ipv6 host TEST-HOST 3FFF:1234:ABCD:1::3
```

这一 IPv4 与 IPv6 的主机配置，可使用 `show hosts` 这条命令予以验证，其输出打印于下：


```console
R1#show hosts
...
[Truncated Output]
...
Host        Port  Flags      Age Type   Address(es)
TEST-HOST   None  (perm, OK)  0  IP     10.0.0.3
TEST-HOST   None  (perm, OK)  0  IPv6   3FFF:1234:ABCD:1::3
```


当同一主机被同时配置以一个静态 IPv4 与 IPv6 的地址时，那么 Cisco 10S 软件将使用那个 IPv6 地址。当 DNS 被用到时，那么双栈的主机会在同时配置了 IPv6 与 IPv4 的 DNS 服务器时，将首先检索 AAAA（IPv6）的记录，并会在随后回退至 A 记录（IPv4）。这一默认行为可通过执行一次简单的 `ping` 向先前配置的静态主机 “TEST-HOST”，而加以验证：


```console
R1#ping test-host repeat 10
Type escape sequence to abort.
Sending 10, 100-byte ICMP Echos to 3FFF:1234:ABCD:1::3, timeout is 2 seconds:
!!!!!!!!!!
Success rate is 100 percent (10/10), round-trip min/avg/max = 0/1/4 ms
```



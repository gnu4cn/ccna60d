# 在思科 IOS 路由器中部署双栈支持

虽然深入探讨不同厂商的不同主机类型中，可支持的双栈部署不同方式超出了 CCNA 考试要求范围，但作为一名未来的网络工程师，掌握在 Cisco 10S 软件中如何部署双栈解决方案至关重要。在 Cisco 的 10S 路由器中，双栈的运行，是通过简单地在路由器接口上，同时配置 IPv4 地址和 IPv6 地址启用的。

多个的 IPv4 地址，可通过追加 `[secondary]` 关键字到 `ip address [address] [mask]` 这一接口配置命令末尾而予以指定。但是，对于 IPv6，`[secondary]` 这个关键字就不再需要了，因为多个的前缀可使用 `ipv6 address` 这条接口配置命令，在单个接口上予以配置，这曾在 [前面的小节](IPv6_protocols_and_mechanisms.html#启用-cisco-10s-软件中的-ipv6-路由) 中详细介绍过。以下配置示例演示了如何在某单个路由器接口上，配置多个 IPv4 和 IPv6 的地址及前缀：

```console
R3(config)#ipv6 unicast-routing
R3(config)#interface FastEthernet0/0
R3(config-if)#ip address 10.0.0.3 255.255.255.0
R3(config-if)#ip address 10.0.1.3 255.255.255.0 secondary
R3(config-if)#ip address 10.0.2.3 255.255.255.0 secondary
R3(config-if)#ipv6 address 3fff:1234:abcd:1::3/64
R3(config-if)#ipv6 address 3fff:1234:abcd:2::3/64
R3(config-if)#ipv6 address 3fff:1234:abcd:3::3/64
R3(config-if)#ipv6 enable
R3(config-if)#exit
```

**注意**：虽然在思科 10S 软件中 IPv4 的路由默认是启用的，但默认情况下 IPv6 的路由则是禁用的，而必须显式地加以启用。

在这些 IPv4 和 IPv6 地址的配置之后，咱们便可简单地查看路由器的配置，以验证咱们的配置，如下输出中所示：

```console
R3#show running-config interface FastEthernet0/0
Building configuration...
Current configuration : 395 bytes
!
interface FastEthernet0/0
ip address 10.0.1.3 255.255.255.0 secondary
ip address 10.0.2.3 255.255.255.0 secondary
ip address 10.0.0.3 255.255.255.0
ipv6 address 3FFF:1234:ABCD:1::3/64
ipv6 address 3FFF:1234:ABCD:2::3/64
ipv6 address 3FFF:1234:ABCD:3::3/64
ipv6 enable
end
```

要查看一些特定 IPv4 与 IPv6 的接口参数，只需使用 Cisco 10S 软件的 `show ip interface [name]` 或 `show ipv6 interface [name]` 两条命令。以下是针对 `FastEthernet0/0` 接口的 `show ip interface` 命令输出：


```console
R3#show ip interface FastEthernet0/0 | section address
    Internet address is 10.0.0.3/24
    Broadcast address is 255.255.255.255
    Helper address is not set
    Secondary address 10.0.1.3/24
    Secondary address 10.0.2.3/24
    Network address translation is disabled
```

以下输出演示了针对前一实例中用到的同一 `FastEthernet0/0` 接口，由 `show ipv6 interface` 命令所打印的信息：


```console
R3#show ipv6 interface FastEthernet0/0 | section address
    IPv6 is enabled, link-local address is FE80::213:19FF:FE86:A20
    Global unicast address(es):
        3FFF:1234:ABCD:1::3, subnet is 3FFF:1234:ABCD:1::/64
        3FFF:1234:ABCD:2::3, subnet is 3FFF:1234:ABCD:2::/64
        3FFF:1234:ABCD:3::3, subnet is 3FFF:1234:ABCD:3::/64
    Joined group address(es):
        FF02::1
        FF02::2
        FF02::5
        FF02::6
        FF02::9
        FF02::1:FF00:3
    Hosts use stateless autoconfig for addresses.
```



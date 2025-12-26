# 配置静态的 IPv6 路由

静态 IPv6 路由的配置，遵循了静态 IPv4 路由类似的逻辑。在 Cisco IOS 中，`ipv6 route [ipv6-prefix/prefix-length] [next- hop-address | interface] [distance <1-254> | multicast | tag | unicast]` 这条全局配置命令，用于配置静态 IPv6 路由。

虽然其他一些关键字很熟悉，因为他们同样适用于 IPv4 的静态路由，但 `[multicast]` 这个关键字是 IPv6 独有的，用于配置某条 IPv6 的静态路由。当这一关键字用到时，那么该路由就将不会被输入到单播路由表中，而将绝不会用于转发单播流量。要确保该路由绝不安装到单播的 RIB 中，Cisco 10S 软件会将该路由的管理距离值，设为 255。

相反，`[unicast]` 这个关键字则用于配置某条 IPv6 的静态单播路由。当这一关键字用到时，那么该路由将不会被输入到组播的路由表中，而将仅用于转发单播流量。当 `[multicast]` 及 `[unicast]` 两个关键字均未用到时，那么默认情况下，这条路由将同时用于单播与组播数据包。

以下配置示例，演示了如何配置三条静态的 IPv6 路由。第一条路由，是到子网 `3FFF:1234:ABCD:0001::/64`，将从 `FastEthernet0/0` 接口转发流量出去。这条路由将仅用于单播流量。第二条路由，是到子网 `3FFF:1234:ABCD:0002::/64`，将使用下一跳路由器的链接本地地址作为 IPv6 的下一跳地址，从 `Serial0/0` 转发数据包到该子网。这条路由将仅用于组播流量。最后，一条指向接口 `Serial0/1` 的默认路由亦得以配置。这条默认路由将经由 `Serial0/1`，使用下一跳路由器的链路本地地址作为 IPv6 的下一跳地址，转发那些到未知 IPv6 地址的数据包。这三条路由如下所示。


```console
R1(config)#ipv6 route 3FFF:1234:ABCD:0001::/64 Fa0/0 unicast
R1(config)#ipv6 route 3FFF:1234:ABCD:0002::/64 Se0/0 FE80::2222 multicast
R1(config)#ipv6 route ::/0 Serial0/1 FE80::3333
```

完成此配置后，`show ipv6 route` 命令便可用于验证该本地路由器上，实施的静态路由配置，如下所示。


```console
R1#show ipv6 route static
IPv6 Routing Table - 13 entries
Codes: 	C - Connected, L - Local, S - Static, R - RIP, B - BGP
		U - Per-user static route
		I1 - ISIS L1, I2 - ISIS L2, IA - ISIS inter area, IS - ISIS summary
		O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
		ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
S	::/0 [1/0]
	 via FE80::3333, Serial0/1
S	3FFF:1234:ABCD:1::/64 [1/0]
	 via ::, FastEthernet0/0
S	3FFF:1234:ABCD:2::/64 [1/0]
	 via FE80::2222, Serial0/0
```


除了使用 `show ipv6 route` 这条命令外，咱们还可使用 `show ipv6 static [prefix] [detail]` 命令，查看有关所有或指定静态路由的详细信息。以下输出演示了如何使用这条命令。


```console
R1#show ipv6 static 3FFF:1234:ABCD:1::/64 detail
IPv6 static routes
Code: * - installed in RIB
* 3FFF:1234:ABCD:1::/64 via interface FastEthernet0/0, distance 1
```

> *知识点*：
>
> - static IPv6 routes
>
> + an IPv6 static Multicast route
>   - will not be entered into the Unicast routing table
>   - never be used to forward Unicast traffic
>   - the administrative distance value for the route is set to 255, to ensure it is never installed into the Unicast RIB
>
> + an IPv6 static Unicast route
>   - will not be entered into the Multicast routing table
>   - be used only to forward Unicast traffic
>
> - if neither the `[multicast]` nor the `[unicast]` keyword is used, by default, the route will be used for both Unicast and Multicast packets
>
> - the default route will forward packets to unknown IPv6 destination

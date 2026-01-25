# 第 3 天问题

1. IPv6 addresses must always be used with a subnet mask. True or false?
2. Name the three types of IPv6 addresses.
3. Which command enables IPv6 on your router?
4. The `0002` portion of an IPv6 address can be shortened to just 2. True or false?
5. How large is the IPv6 address space?
6. With IPv6, every host in the world can have a unique address. True or false?
7. IPv6 does not have natively integrated security features. True or false?
8. IPv6 implementations allow hosts to have multiple addresses assigned. True or false?
9. How can the broadcast functionality be simulated in an IPv6 environment?
10. How many times can the double colon (`::`) notation appear in an IPv6 address?
11. Name three IPv4 to IPv6 transition mechanism classes.
12. `_______` implementation is required when internetwork devices and hosts use both protocol stacks (i.e., IPv4 and IPv6) at the same time.
13. With dual-stack implementation, name two methods that help hosts decide when to use the IPv6 protocol stack instead of the IPv4 protocol stack.
14. While IPv4 routing is enabled by default in Cisco IOS software, IPv6 routing is disabled by default and must be explicitly enabled. True or false?
15. Name a command that will provide IPv6 interface parameters.
16. The static IPv4 and IPv6 host configuration can be validated using the `_______` command.
17. Which command is used to configure an IPv6 DNS server?
18. `_______` entails encapsulating the IPv6 packets or datagrams and sending them over IPv4 networks.


## 第 3 天问题答案

1. False.
2. Unicast, Multicast, and Anycast.
3. The `ipv6 unicast-routing`
4. True.
5. 128 bits.
6. True.
7. False.
8. True.
9. By using Anycast.
10. One time.
11. Dual-stack implementation, tunnelling, and protocol translation.
12. Dual-stack.
13. Manual configuration and naming service.
14. True.
15. The `show ipv6 interface` command.
16. `show hosts`.
17. The `ip name-server` command.
18. Tunnelling.


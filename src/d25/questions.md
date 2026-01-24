# 第 25 天问题

1. OSPF operates over IP number `_______`.
2. OSPF does NOT support VLSM. True or false?
3. Any router which connects to Area 0 and another area is referred to as an `_______` `_______` `_______` or `_______`.
4. If you have a DR, you must always have a BDR. True or false?
5. The DR/BDR election is based on which two factors?
6. By default, all routers have a default priority value of `_______`. This value can be adjusted using the `_______` `_______` `_______` `<0-255>` interface configuration command.
7. When determining the OSPF router ID, Cisco IOS selects the highest IP address of configured Loopback interfaces. True or false?
8. What roles do the DR and the BDR carry out?
9. Which command would put network `10.0.0.0/8` into `Area 0` on a router?
10. Which command would set the router ID to `1.1.1.1`?
11. Name the common troubleshooting issues for OSPF.
12. Both OSPFv2 and OSPFv3 can run on the same router. True or false?
13. OSPFv2 and OSPFv3 use different LSA flooding and aging mechanisms. True or false?
14. Which is the equivalent of `224.0.0.5` in the IPv6 world?
15. As is required for EIGRPv6, the router ID for OSPFv3 must be either specified manually or configured as an operational interface with an IPv4 address. True or false?
16. Which command would you use to enable the OSPFv3 routing protocol?
17. Which command would you use to specify an OSPFv3 neighbour over an NBMA interface?
18. Which command would you use to see the OSPFv3 LSDB?
19. A significant difference between OSPFv2 and OSPFv3 is that the OSPFv3 Hello packet now contains no address information at all but includes an interface ID, which the originating router has assigned to uniquely identify its interface to the link. True or false?


## 第 25 天答案

1. `89`.
2. False.
3. Area Border Router or ABR.
4. False.
5. The highest router priority and the highest router ID.
6. 1, `ip ospf priority` .
7. True.
8. To reduce the number of adjacencies required on the segment; to advertise the routers on the Multi-Access segment; and to ensure that updates are sent to all routers on the segment.
9. The `network 10.0.0.0 0.255.255.255 area 0` command.
10. The `router-id 1.1.1.1` command.
11. Neighbour relationships and route advertisement.
12. True.
13. False.
14. `FF02::5`.
15. True.
16. The `ipv6 router ospf <id>`
17. The `ipv6 ospf neighbor`
18. The `show ipv6 ospf database`
19. True.

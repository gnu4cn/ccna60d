# 第 24 天问题

1. What protocol does OSPF use?
2. How does OSPF determine whether other Link State routers are operating on the interfaces as well?
3. When a `_______` routing protocol is enabled for a particular link, information associated with that network is added to the local Link State Database (LSDB).
4. OSPF utilises IP Multicast when sending and receiving updates on Multi-Access networks, such as Ethernet. True or false?
5. OSPF is a hierarchical routing protocol that logically divides the network into subdomains referred to as `_______`.
6. Name at least 4 OSPF network types.
7. Name the command used to enter OSPF configuration mode.
8. When determining the OSPF router ID, Cisco IOS selects the lowest IP address of the configured Loopback interfaces. True or false?
9. What command can you use to assign an interface to OSPF Area 2 (interface level command)?
10. `_______` can be described as interfaces over which no routing updates are sent.
11. OSPF operates over IP number `_______`.
12. OSPF does NOT support VLSM. True or false?
13. Any router which connects to Area 0 and another area is referred to as an `_______` `_______` `_______` or `_______`.
14. If you have a DR, you must always have a BDR. True or false?
15. The DR/BDR election is based on which two factors?
16. By default, all routers have a default priority value of `_______`. This value can be adjusted using the `_______` `_______` `_______` `<0-255>` interface configuration command.
17. When determining the OSPF router ID, Cisco IOS selects the highest IP address of configured Loopback interfaces. True or false?
18. What roles do the DR and the BDR carry out?
19. Which command would put network `10.0.0.0/8` into `Area 0` on a router?
20. Which command would set the router ID to `1.1.1.1`?
21. Name the common troubleshooting issues for OSPF.


##第 24 天答案

1. IP number 89.
2. By sending Hello packets.
3. Link State.
4. True.
5. Areas.
6. Non-Broadcast, Point-to-Point, Broadcast, Point-to-Multipoint, Point-to-Multipoint Non-Broadcast, and Loopback.
7. The `router ospf <id>` command.
8. False.
9. The `ip ospf <id> area 2`
10. Passive.
11. `89`.
12. False.
13. Area Border Router or ABR.
14. False.
15. The highest router priority and the highest router ID.
16. 1, `ip ospf priority` .
17. True.
18. To reduce the number of adjacencies required on the segment; to advertise the routers on the Multi-Access segment; and to ensure that updates are sent to all routers on the segment.
19. The `network 10.0.0.0 0.255.255.255 area 0` command.
20. The `router-id 1.1.1.1` command.
21. Neighbour relationships and route advertisement.


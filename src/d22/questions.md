# 第 36 天问题

1. You can see the ASN with the `show ip _______` command.
2. Every router you want to communicate with in your routing domain must have a different ASN. True or false?
3. What is the purpose of the EIGRP topology table?
4. By default, EIGRP uses the `_______` bandwidth on the path to a destination network and the total `_______` to compute routing metrics.
5. Dynamic neighbour discovery is performed by sending EIGRP Hello packets to the destination Multicast group address `_______`.
6. EIGRP packets are sent directly over IP using protocol number `_______`.
7. To populate the topology table, EIGRP runs the `_______` algorithm.
8. The `_______` `_______` includes both the metric of a network as advertised by the connected neighbour, plus the cost of reaching that particular neighbour.
9. Cisco IOS software supports equal cost load sharing for a default of up to four paths for all routing protocols. True or false?
10. What EIGRP command can be used to enable unequal cost load sharing?

## 第 36 天问题答案

1. `protocols`.
2. False.
3. The topology table allows all EIGRP routers to have a consistent view of the entire network. All known destination networks and subnets that are advertised by neighbouring EIGRP routers are stored there.
4. Minimum, delay.
5. `224.0.0.10`.
6. 88.
7. DUAL.
8. Feasible Distance.
9. True.
10. The `variance` command.



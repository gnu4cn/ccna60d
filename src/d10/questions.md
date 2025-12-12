# 第 10 天问题

1. How often do switches send Bridge Protocol Data Units ( BPDUs)?
2. Name the STP port states in the correct order.
3. What is the default Cisco Bridge ID?
4. Which command will show you the Root Bridge and priority for a VLAN?
5. What is the STP port cost for a 100Mbps link?
6. When a port that is configured with the `_______` `_______` feature receives a BPDU, it immediately transitions to the errdisable state.
7. The `_______` `_______` feature effectively disables STP on the selected ports by preventing them from sending or receiving any BPDUs.
8. Which two commands will force the switch to become the Root Bridge for a VLAN?
9. Contrary to popular belief, the Port Fast feature does not disable Spanning Tree on the selected port. This is because even with the Port Fast feature, the port can still send and receive BPDUs. True or false?
10. The Backbone Fast feature provides fast failover when a direct link failure occurs. True or false?
11. RSTP is not backward compatible with the original IEEE 802.1D STP standard. True or false?
12. What are the RSTP port states?
13. What are the four RSTP port roles?
14. Which command enables RSTP?
15. By default, when RSTP is enabled on a Cisco switch, R-PVST+ is enabled on the switch. True or false?

## 第 10 天问题答案

1. Every two seconds.
2. Blocking, Listening, Learning, Forwarding, and Disabled.
3. 32768.
4. The `show spanning-tree vlan x` command.
5. 19.
6. BPDU Guard.
7. BPDU Filter.
8. The `spanning-tree vlan [number] priority [number]` and `spanning-tree vlan [number] root [primary|secondary]` commands.
9. True.
10. False.
11. False.
12. Discarding, Learning, and Forwarding.
13. Root, Designated, Alernate, and Backup.
14. The `spanning-tree mode rapid-pvst` command.
15. True.



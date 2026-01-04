# 第 28 天问题

1. DHCP simplifies network administrative tasks by automatically assigning `_______` to hosts on a network.
2. DHCP uses UDP ports `_______` and `_______`.
3. What are the six DHCP states for clients?
4. Which command will prevent IP addresses `192.168.1.1` to `192.168.1.10` from being used in the pool?
5. Which command will set a DHCP lease of 7 days, 7 hours, and 7 minutes?
6. Which command will enable the router to forward a DHCP Broadcast as a Unicast?
7. DNS uses UDP port `_______`.
8. Which command will set a DNS server address of `192.168.1.1` on your router?
9. If the `_______` `_______`-`_______` command has been disabled on your router, then DNS won’t work.
10. Which command will debug DNS packets on your router?

## 第 28 天问题答案

1. IP information (IP addresses).
2. 67 and 68.
3. Initialising, Selecting, Requesting, Bound, Renewing, and Rebinding.
4. The `ip dhcp excluded-address 192.168.1.1 192.168.1.10`
5. The `lease 7 7 7` command under DHCP Pool Configuration mode.
6. The `ip helper-address` command.
7. 53.
8. The `ip name-server 192.168.1.1` command.
9. `ip domain-lookup`.
10. The `debug domain` command.


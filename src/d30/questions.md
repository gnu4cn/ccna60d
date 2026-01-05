# 第 30 天问题

1. NAT converts the `_______` headers for incoming and outgoing traffic and keeps track of each session.
2. The `_______` address is the IP address of an outside, or external, host as it appears to inside hosts.
3. How do you designate inside and outside NAT interfaces?
4. Which show command displays a list of your NAT table?
5. When would you want to use static NAT?
6. Write the configuration command for NAT `192.168.1.1` to `200.1.1.1`.
7. Which command do you add to a NAT pool to enable PAT?
8. NAT most often fails to work because the `_______` command is missing.
9. Which `debug` command shows live NAT translations occurring?

## 第 30 天答案

1. Packet.
2. Outside local.
3. With the `ip nat inside` and `ip nat outside` commands.
4. The `show ip nat translations` command.
5. When you have a web server (for example) on the inside of your network.
6. `ip nat inside source static 192.168.1.1 200.1.1.1`.
7. The `overload` command.
8. The `ip nat inside` or `ip nat outside` command.
9. The `debug ip nat [detailed]` command.


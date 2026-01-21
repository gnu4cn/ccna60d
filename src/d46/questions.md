# 第 46 天问题

1. Write out the two ways of configuring console passwords. Write the actual commands.
2. Which command will permit only SSH traffic into the VTY lines?
3. Which command will encrypt a password with level 7 encryption?
4. Name the eight levels of logging available on the router.
5. Why would you choose SSH access over Telnet?
6. Your three options upon violation of your port security are protect,`_______`, and `______`.
7. How would you hard set a port to accept only MAC 0001.c74a.0a01?
8. Which command turns off CDP for a particular interface?
9. Which command turns off CDP for the entire router or switch?
10. Which command adds a password to your VTP domain?
11. Which command would permit only VLANs 10 to 20 over your interface?

## 第 46 天 答案

1. The `password xxx` and `login local` commands (username and password previously configured).
2. The `transport input ssh` command.
3. The `service password-encryption` command.
4. Alerts, critical, debugging, emergencies, errors, informational, notifications, and warnings.
5. SSH offers secure, encrypted traffic.
6. Shutdown and restrict.
7. Issue the `switchport port-security mac-address x.x.x.x` command.
8. The `no cdp enable` command.
9. The `no cdp run` command.
10. The `vtp password xxx` command.
11. The `switchport trunk allowed vlan 10-20` command.



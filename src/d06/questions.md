# 第 6 天问题

1. Switches contain a memory chip known as an `_______`, which builds a table listing which device is plugged into which port.
2. The `_______` `_______`-`_______`-`_______` command displays a list of which MAC addresses are connected to which ports.
3. Which two commands add an IP address to the VLAN?
4. Which commands will enable Telnet and add a password to the switch Telnet lines?
5. How do you permit only SSH traffic into your Telnet lines?
6. What is the most likely cause of Telnet to another switch not working?
7. Switches remember all VLAN info, even when reloaded. True or False?
8. A switch interface can be in which of three modes?
9. How do you set a switch to be in a specific mode?
10. Which commands will change the switch duplex mode and speed?


## 第 6 天答案

1. ASIC.
2. `show mac-address-table`
3. The `interface vlan x` command and the `ip address x.x.x.x`command.
4.
```console
Switch1(config)#line vty 0 15
Switch1(config-line)#password cisco
Switch1(config-line)#login
```
5. Use the `Switch1(config-line)#transport input ssh` command.
6. The authentication method is not defined on another switch.
7. True.
8. Trunk, access, or dynamic mode.
9. Apply the `switchport mode <mode>` command in Interface Configuration mode.
10. The `duplex` and `speed` commands.




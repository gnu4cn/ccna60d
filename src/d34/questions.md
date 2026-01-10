# 第 34 天问题

1. Which files would you usually find in DRAM?
2. Where is the compressed IOS held?
3. You want to boot the router and skip the startup configuration. Which command do you use to modify the configuration register?
4. Which command puts the running configuration into NVRAM?
5. Which command will copy your startup configuration onto a network server?
6. You want to boot your router from a network server holding the IOS. Which command will achieve this?
7. The universal image includes all the feature sets you require, but in order to gain access to the advanced features you need to buy the appropriate license and verify it on the actual device. True or false?
8. The ROM monitor has a very small code called bootstrap or boothelper in it to check for attached memory and interfaces. True or false?
9. Which command do you use to view the files stored on the flash memory on a Cisco router?
10. What is the purpose of the POST?
11. What underlying protocol does syslog use?
12. The syslog client sends syslog messages to the syslog sever using UDP as the Transport Layer protocol, specifying a destination port of `_______`.
13. The priority of a syslog message represents both the facility and the severity of the message. This number is an `________` -bit number.
14. Name the eight Cisco IOS syslog priority levels.
15. In Cisco IOS software, the `_______` `_______` `_______` global configuration command can be used to specify the syslog facility.
16. Which command do you use to globally enable logging on a router?
17. Name the command used to specify the syslog server destination.
18. Name the command used to set the clock on a Cisco IOS router.
19. On which ports does SNMP operate?
20. Name the command you can use to change the NetFlow version.



## 第 34 天答案

1. Uncompressed IOS, running configuration, and routing tables.
2. On the flash memory.
3. The `config-register [version]` command in Global Configuration mode.
4. The `copy run start` command.
5. The `copy start tftp:` command.
6. The `boot system [option]` command.
7. True.
8. True.
9. The `show flash/dir` command.
10. The POST tests the hardware in order to verify that all the components are present and healthy (interfaces, memory, CPU, ASICs, etc.).
11. UDP.
12. `514`.
13. `8`.
14. Emergencies, alerts, critical, errors, warnings, notifications, informational, and debugging.
15. The `logging facility [facility]` command.
16. The `logging on` command.
17. The `logging [address]` or `logging host [address]` command.
18. The `clock set` command.
19. UDP `161` and `162`.
20. The `ip flow-export version x` global configuration command.


# 第一天的实验 Day 1 Lab

## IOS 命令导航实验


### 拓扑


![](../images/l-0.png)

### 实验目的

学习如何通过控制台接口连接到一台路由器，以及尝试一些命令。

### 实验步骤

1. 使用一条控制台线缆，和 PuTTY 程序（可免费在线获取，请搜索“PuTTY”）, 连接到一台路由器的控制台端口。
2. 在 `Router>` 提示符处，输入下面的这些命令，探寻不同的路由器模式和命令。如你遇到询问进入配置模式，输入 `no` 并按下回车键。

<code>
Cisco IOS Software, 1841 Software (C1841-ADVIPSERVICESK9-M), Version 12.4(15)T1, RELEASE
SOFTWARE (fc2)
Technical Support: www.cisco.com/techsupport
Copyright (c) 1986-2007 by Cisco Systems, Inc.
Compiled Wed 18-Jul-07 04:52 by pt_team

        --- System Configuration Dialog ---

Continue with configuration dialog? [yes/no]:no
Press RETURN to get started!
Router>enable
Router#show version
Cisco 1841 (revision 5.0) with 114688K/16384K bytes of memory.
Processor board ID FTX0947Z18E
M860 processor: part number 0, mask 49
2 FastEthernet/IEEE 802.3 interface(s)
2 Low-speed Serial(sync/async) network interface(s)
191K bytes of NVRAM.
63488K bytes of ATA CompactFlash (Read/Write)

Configuration register is 0x2102

Router#show ip interface brief
Interface       IP-Address  OK? Method  Status              Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
Serial0/0/0     unassigned  YES unset   administratively down   down
Serial0/1/0     unassigned  YES unset   administratively down   down
Vlan1           unassigned  YES unset   administratively down   down
Router#

Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#interface Serial0/1/0  ← <b>put your serial # here</b>
Router(config-if)#ip address 192.168.1.1 255.255.255.0
Router(config-if)#interface Loopback0

Router(config-if)#ip address 10.1.1.1 255.0.0.0
Router(config-if)#^Z ← <b>press Ctrl+Z keys together</b>
Router#
Router#show ip interface brief
Interface       IP-Address  OK? Method  Status              Protocol
FastEthernet0/0 unassigned  YES unset   administratively down   down
FastEthernet0/1 unassigned  YES unset   administratively down   down
Serial0/0/0     unassigned  YES unset   administratively down   down
Serial0/1/0     192.168.1.1 YES manual  administratively down   down
Loopback0       10.1.1.1    YES manual  up                      up
Vlan1           unassigned  YES unset   administratively down   down
Router#show history
Router(config)#hostname My_Router
My_Router(config)#line vty 0 ?
    <1-15>  Last Line number
    <cr>
My_Router(config)#line vty 0 15 ← <b>enter 0? to find out how many lines you have</b>
My_Router(config-line)#
My_Router(config-line)#exit
My_Router(config)#router rip
My_Router(config-router)#network 10.0.0.0
My_Router(config-router)#
</code>

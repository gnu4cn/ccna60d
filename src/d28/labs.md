# 第 28 天实验

## 带有认证的 NTP 实验

### 拓扑结构

![带有认证的 NTP 实验拓扑结构](../images/NTP_lab.png)


### 实验目的

学习如何配置简单的 NTP，其中 `RouterB` 作为 NTP 主站。这是 [第 2 天 IP 分址实验](../d02/labs.md#路由器上的-IP-分址实验) 的一次重复，但有一些其他步骤。

### 实验步骤

1. 以确认咱们的串行接口编号开始，因为他们可能不同于上图中我（作者）的。另外，请确认哪一侧连接了 DCE 电缆，因为这一侧将需要 `clock rate` 这条命令；

```console
Router>en
Router#sh ip interface brief
Interface       IP-Address  OK? Method Status               Protocol
FastEthernet0/0 unassigned  YES unset  administratively down down
FastEthernet0/1 unassigned  YES unset  administratively down down
Serial0/1/0     unassigned  YES unset  administratively down down
Vlan1           unassigned  YES unset  administratively down down
Router#
Router#show controllers Serial0/1/0
M1T-E3 pa: show controller:
PAS unit 0, subunit 0, f/w version 2-55, rev ID 0x2800001, version 2
idb = 0x6080D54C, ds = 0x6080F304, ssb=0x6080F4F4
Clock mux=0x30, ucmd_ctrl=0x0, port_status=0x1
line state: down
DCE cable, no clock rate
```

2. 添加主机名与 IP 地址到一侧。当这一侧是 DCE 时，则要添加时钟速率；

```console
Router#conf t

Enter configuration commands, one per line.  End with CNTL/Z.
Router(config)#hostname RouterA
RouterA(config)#interface s0/1/0
RouterA(config-if)#ip add 192.168.1.1 255.255.255.0
RouterA(config-if)#clock rate 64000
RouterA(config-if)#no shut
%LINK-5-CHANGED: Interface Serial0/1/0, changed state to down
RouterA(config-if)#
```

3. 添加 IP 地址与主机名到另一路由器。同时，要以 `no shut` 命令启动接口；

```console
Router>en
Router#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
Router(config)#hostname RouterB
RouterB(config)#int s0/1/0
RouterB(config-if)#ip address 192.168.1.2 255.255.255.0
RouterB(config-if)#no shut
%LINK-5-CHANGED: Interface Serial0/1/0, changed state to down
RouterB(config-if)#^Z
RouterB#
%LINK-5-CHANGED: Interface Serial0/1/0, changed state to up
```

4. 以一次 `ping` 操作测试该连接；

```console
RouterB#ping 192.168.1.1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms
```

5. 将 `RouterB` 配置为 NTP 主站，将 `RouterA` 配置为客户端；

```console
RouterA(config)#ntp server 192.168.1.2
```

```console
RouterB(config)#ntp master
```

```console
RouterA#show ntp associations

address         ref clock       st   when     poll    reach  delay          offset            disp
~192.168.1.2   127.127.1.1     1    6        16      1      1.00           -2624.00          0.00
* sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured
```

6. 先配置 `RouterB` 上的 NTP 认证，然后确认 `RouterA` 无法再获取到 `RouterB` 上的时间；


```console
RouterB(config)#ntp authentication-key 1 md5 cisco
RouterB(config)#ntp trusted-key 1
RouterB(config)#ntp authenticate
```


```console
RouterA#show ntp associations
address         ref clock       st   when     poll    reach  delay          offset            disp
*~192.168.1.2   127.127.1.1     8    18       64      377    0.00           0.00              0.47
* sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured
RouterA#
```

7. 在 `RouterA` 上配置同样的认证设置，然后确认这个 NTP 关联；

```console
RouterA#show ntp status
Clock is synchronized, stratum 9, reference is 192.168.1.2
nominal freq is 250.0000 Hz, actual freq is 249.9990 Hz, precision is 2**24
reference time is AF1ED334.000001EE (0:15:48.494 UTC Mon Mar 1 1993)
clock offset is 0.00 msec, root delay is 0.00  msec
root dispersion is 10.08 msec, peer dispersion is 0.47 msec.
loopfilter state is ‘CTRL’ (Normal Controlled Loop), drift is - 0.000001193 s/s system poll interval is 6, last update was 21 sec ago.

RouterA#show ntp associations

address         ref clock       st   when     poll    reach  delay          offset            disp
*~192.168.1.2   127.127.1.1     8    30       64      377    0.00           0.00              0.47
* sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured
RouterA#
```

## 路由器上的 DHCP 实验

### 拓扑结构

![路由器上的 DHCP 实验拓扑图](../images/1409.png)

### 实验目的

了解路由器可怎样用作 DHCP 服务器。

### 实验步骤

1. 当咱们正使用咱们的家用 PC 或笔记本电脑时，就要设置网络适配器为自动获取 IP 地址。咱们也可在 Packet Tracer 中设置这项。要以一条交叉网线，连接其中的 PC 到咱们的路由器以太网端口；

![网络适配器设置](../images/1410.png)

2. 添加 IP 地址 `172.16.1.1 255.255.0.0` 到咱们的路由器接口。当咱们未能记住怎样完成这一步时，请参阅以前的那些实验。要确保咱们 `no shut` 他；

3. 要配置咱们的 DHCP 池。然后，要配置 3 天 3 小时 5 分钟的租期。最后，要从分配给主机中，排出从 1 到 10 的所有地址。假设这些地址已被用于其他服务器或接口；

    ```console
    Router#conf t
    Router(config)#ip dhcp pool 60days
    Router(dhcp-config)#network 172.16.0.0 255.255.0.0
    Router1(dhcp-config)#lease 3 3 5    ← command won’t work on Packet Trer
    Router1(dhcp-config)#exit
    Router(config)#ip dhcp excluded-address 172.16.1.1 172.16.1.10
    Router(config)#
    ```

4. 执行一次 `ipconfig /all` 命令，检查某个 IP 地址是否已分配到咱们的 PC。当旧的 IP 地址仍在使用时，那么咱们可能需要执行一次 `ipconfig /renew` 命令；


    ```console
    PC>ipconfig /all
    Physical Address................: 0001.C7DD.CB19
    IP Address......................: 172.16.0.1
    Subnet Mask.....................: 255.255.0.0
    Default Gateway.................: 0.0.0.0
    DNS Servers.....................: 0.0.0.0
    ```

5. 若咱们愿意，咱们还可返回到那个 DHCP 池，添加一个默认网关及一个 DNS 服务器的地址，这些选项也将设置到那台主机 PC。

    ```console
    Router(config)#ip dhcp pool 60days
    Router(dhcp-config)#default-router 172.16.1.2
    Router(dhcp-config)#dns-server 172.16.1.3
    ```

    ```console
    PC>ipconfig /renew

    IP Address......................: 172.16.0.1
    Subnet Mask.....................: 255.255.0.0
    Default Gateway.................: 172.16.1.2
    DNS Server......................: 172.16.1.3
    ```

## 路由器上的 DNS 实验

在某个路由器上配置一个名字服务器。配置下面这个 IP 地址为名字服务器（Google 的 DNS 服务器）：

`ip name-server 8.8.8.8`


除非咱们在该路由器上有着互联网接入，否则咱们将无法测试这一设置。当咱们有着对工作场所路由器的访问时，请勿使用真实设备。

接着尝试解析一些公网网站名字，比如通过`ping www.cisco.com`。

请访问[www.in60days.com](http://www.in60days.com), 观看我是怎么完成这个实验的。


（End）



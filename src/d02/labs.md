# 第 2 天的实验

## 路由器上的 IP 分址实验

### 拓扑结构

![路由器上的 IP 分址实验拓扑图](../images/0505.png)


### 实验目的

学习如何在路由器上配置 IP 地址，并经由某个串行接口执行 `ping` 操作。

### 实验步骤

1. 首先确定咱们的串行接口的编号，因为他们可能与上面图表中我（作者）的编号不同。此外，请确定哪一侧连接了 DCE 电缆，因为这一侧将需要 `clock rate` 命令；


    <code>
    Router>en
    Router#sh ip interface brief
    Interface		IP-Address	OK?	Method	Status					Protocol
    FastEthernet0/0	unassigned	YES	unset	administratively down	down
    FastEthernet0/1	unassigned	YES	unset	administratively down	down
    <b>Serial0/1/0</b>		unassigned	YES	unset	administratively down	down
    Vlan1			unassigned	YES	unset	administratively down	down
    Router#
    Router#show controllers Serial0/1/0

    M1T-E3 pa: show controller:
    PAS unit 0, subunit 0, f/w version 2-55, rev ID 0x2800001, version 2
    idb = 0x6080D54C, ds = 0x6080F304, ssb=0x6080F4F4
    Clock mux=0x30, ucmd_ctrl=0x0, port_status=0x1
    line state: down
    <b>DCE cable</b>, no clock rate
    </code>


2. 给一侧添加主机名与 IP 地址。当这一侧属于 DCE 时，则要添加时钟速率；

    ```console
    Router#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Router(config)#hostname RouterA
    RouterA(config)#interface s0/1/0
    RouterA(config-if)#ip add 192.168.1.1 255.255.255.0
    RouterA(config-if)#clock rate 64000
    RouterA(config-if)#no shut
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to downRouterA(config-if)#
    ```

3. 给另一台路由器添加 IP 地址和主机名。同时，使用 `no shut` 命令启用接口；


    ```console
    Router>en
    Router#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Router(config)#hostname RouterB
    RouterB(config)#int s0/1/0
    RouterB(config-if)#ip address 192.168.1.2 255.255.255.0
    RouterB(config-if)#no shut
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to down
    RouterB(config-if)#^Z
    RouterB#
    %LINK-5-CHANGED: Interface Serial0/1/0, changed state to up
    ```

4. 用 `ping` 命令测试连接。


    ```console
    RouterB#ping 192.168.1.1

    Type escape sequence to abort.
    Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
    !!!!!
    Success rate is 100 percent (5/5), round-trip min/avg/max = 31/31/32 ms
    ```


**注意**： 当 `ping` 不成功，就要仔细检查，确保咱们已将 `clock rate` 命令，添加到正确的路由器。要确保电缆被正确插入，并使用 `show controllers serial x/x/x` 命令，输入咱们自己的接口编号。

## 二进制转换和子网划分练习

请利用今天课程的剩余时间，练习这些关键主题：

- 从十进制转换为二进制（随机数）
- 从二进制转换为十进制（随机数）
- IPv4 的子网划分（随机的网络和场景）

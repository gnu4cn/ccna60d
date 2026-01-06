# 第 32 天实验

### HSRP实验

在包含了两台直连路由器的场景中（也就是`Fa0/0`连接到`Fa0/0`），对本课程模块中有解释的那些命令进行测试。这两天应都经由比如端口`Fa0/1`，连接到一台交换机。便在交换机上连接一台工作站（ workstation ）。

- 在两台路由器上配置某种一致的 IP 分址方案（configure a consistent IP addressing scheme on the two routers），比如`192.168.0.1/24`与`192.168.0.2/24`

- 使用地址`192.168.0.10`，在面向 LAN 的接口上配置HSRP 10（configure HSRP 10 on LAN-facing interfaces）

- 将该 HSRP 组命名为`CCNA`

- 使用命令`standby 10 priority 110`, 来对主 HSRP 网关的选举进行控制

- 使用命令`show standby [brief]`，对 HSRP 配置进行验证

- 在两台路由器都配置上 HSRP 抢占

- 关闭`Router 1`，观察`Router 2`如何成为主路由器

- 重启`Router 1`，并观察其如何因为开启了抢占，而再度成为主路由器

- 将工作站的 IP 地址配置为`192.168.0.100/24`, 网关地址为`192.168.0.10`; 并从该工作站对网关进行`ping`操作

- 配置接口跟踪：使用命令`standby 10 track [int number]`对路由器上的一个未使用接口进行跟踪; 将该接口循环置于不同根状态，进而对基于该接口状态，而发生的相应路由器优先级变化进行观察。

- 使用命令`standby version 2`，配置上 HSRP 版本2

- 通过命令`standby 10 timers x y`，在两台路由器上对不同 HSRP 计时器进行修改

- 在两台路由器之间配置 MD5 的 HSRP 验证

- 在一台路由器的主网关状态变化时，使用命令`debug standby`对 HSRP 进行调试，从而观察另一台是如何被选举为主网关的


### VRRP实验

重复上一实验，但这次在适用的命令改变下，用 VRRP 代替 HSRP （repeat the previous lab but this time using VRRP instead of HSRP, with the applicable command changes）。

### GLBP实验

重复第一个实验，在适用的命令改变下，用 GLBP 代替 HSRP 。在两台路由器上使用`glbp 10 load-balancing round-robin`命令，配置 GLBP 的负载共担，并观察 LAN 中流量是如何同时到达两台路由器的。

访问[www.in60days.com](http://www.in60days.com/), 看看作者是怎样完成此实验的。


（End）



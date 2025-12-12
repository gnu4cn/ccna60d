# 扩展 VLAN

我们将在介绍 VTP 透明模式时，讨论扩展 VLAN，因此这个小节将比较简短。扩展 VLAN 被编号为从 1006 到 4094，包括边界。如下所示，当咱们执行 `show vlan brief` 命令时，咱们实际上不会看到他们被列出。


```console
ALS1#show vlan brief
                                                                                         
VLAN Name                    Status    Ports
---- ----------------------- --------- -----------------------------
1    default                 active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                       Fa0/5, Fa0/6, Fa0/13, Fa0/14
                                       Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                       Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                       Fa0/23, Fa0/24, Gi0/1, Gi0/2
2    VLAN0002                active
1002 fddi-default            act/unsup
1003 token-ring-default      act/unsup
1004 fddinet-default         act/unsup
1005 trnet-default           act/unsup
```

扩展 VLANS 未存储在 `vlan.dat` 文件（即 VLAN 数据库）中，也不会经由 VTP 通告。当咱们打算配置他们时，咱们必须将交换机置于 VTP 透明模式（或完全禁用 VTP）。在撰写这一内容时，咱们无法在 Packet Tracer 中配置扩展 VLAN。若咱们打算这样做，咱们就需要取得对远端真实机架或咱们自己交换机的访问。

从下面的输出咱们可以看到，当我们尝试创建某个扩展 VLAN (1006) 时，命令被接受，但直到我们将该交换机从 VTP 服务器模式，更改为 VTP 透明模式后，这条命令才会成功执行。


```console
ALS1#show vtp status
VTP Version                     : running VTP1
(VTP2 capable) Configuration Revision          : 1
Maximum VLANs supported locally : 1005
Number of existing VLANs        : 6
VTP Operating Mode              : Server
VTP Domain Name                 :
VTP Pruning Mode                : Disabled
VTP V2 Mode                     : Disabled
VTP Traps Generation            : Disabled
MD5 digest                      : 0xAD 0x80 0xCE 0x6D 0x7F 0x3A 0xA9 0x21
Configuration last modified by 0.0.0.0 at 3-1-93 21:42:31
Local updater ID is 0.0.0.0 (no valid interface found)

ALS1#conf t
Enter configuration commands, one per line.  End with CTRL/Z.
ALS1(config)#vlan 1006
ALS1(config-vlan)#end
% Failed to create VLANs 1006
Extended VLAN(s) not allowed in current VTP mode.
%Failed to commit extended VLAN(s) changes.

ALS1#conf t
ALS1(config)#vtp mode transparent
Setting device to VTP TRANSPARENT mode.
ALS1(config)#end
ALS1#show vtp status
VTP Version                     : running VTP1 (VTP2 capable)
Configuration Revision          : 0
Maximum VLANs supported locally : 1005
Number of existing VLANs        : 6
VTP Operating Mode              : Transparent
VTP Domain Name                 :
VTP Pruning Mode                : Disabled
VTP V2 Mode                     : Disabled
VTP Traps Generation            : Disabled
MD5 digest                      : 0xAD 0x80 0xCE 0x6D 0x7F 0x3A 0xA9 0x21
Configuration last modified by 0.0.0.0 at 3-1-93 21:42:31
ALS1#conf t                                                                                                                             
ALS1(config)#vlan 1006
ALS1(config-vlan)#end
ALS1#show vlan brief

VLAN Name                    Status    Ports
---- ----------------------- --------- -------------------------------
1    default                 active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                       Fa0/5, Fa0/6, Fa0/13, Fa0/14
                                       Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                       Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                       Fa0/23, Fa0/24, Gi0/1, Gi0/2
2    VLAN0002                active
1002 fddi-default            act/unsup
1003 token-ring-default      act/unsup
1004 fddinet-default         act/unsup
1005 trnet-default           act/unsup
1006 VLAN1006                active
```

排除扩展 VLAN 的故障，涉及到与标准 VLAN 相同的过程。请记住，要配置扩展 VLAN，咱们交换机将需要处于透明模式。



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处的考试。



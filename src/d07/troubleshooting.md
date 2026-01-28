# 中继和 VTP 的故障排除

以下是一些问题与可行解决方案的示例：

中继中断？

- 接口必须是 `up/up` 的；
- 两侧的封装方式必须匹配。

    ```console
    SwitchA#show interface fa1/1 switchport
    Name: Fa1/1
    Switchport: Enabled
    Administrative Mode: trunk
    Operational Mode: trunk
    Administrative Trunking Encapsulation: dot1q
    Operational Trunking Encapsulation: dot1q
    Negotiation of Trunking: Disabled
    Access Mode VLAN: 0 ((Inactive))
    ```

VLAN 信息未在传输？

- 该 VLAN 在中继链路上被阻止了吗？

    ```console
    Switch#show interface trunk
    ```


VTP 信息未到达客户端？

- 域和 VTP 口令是否正确？

    ```console
    show vtp status / show vtp password
    ```

增加一台新交换机后，所有 VTP 信息都更改了？

- 要始终在客户端模式下添加新交换机（但请检查上面有关配置修订编号的课文）
- 服务器模式将传播新信息

VTP 修剪不起作用？

- 中间是否有台透明交换机？
- 该 VLAN 在中继上是否被放行？


请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处第 7 天的考试。

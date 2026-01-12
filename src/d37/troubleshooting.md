# WAN 连接故障排除

在尝试建立某一 WAN 连接时（暂且忘掉 PPP 与帧中继），咱们可使用 OSI 模型。

- 一层 —— 检查电缆确保其正确连接。`no shut` 这条命令是否已应用？某一时钟频率是否已在 DCE 侧应用？

    ```console
    RouterA#show controllers serial 0
    HD unit 0, idb = 0x1AE828, driver structure at 0x1B4BA0
    buffer size 1524 HD unit 0, V.35 DTE cable

    RouterA#show ip interface brief
    Interface     IP-Address     OK? Method Status              Protocol
    Serial0       11.0.0.1       YES unset  administratively down down
    Ethernet0     10.0.0.1       YES unset  up                    up
    ```

- 二层 —— 检查以确保正确的封装方式已应用到接口。确保链路的另一侧有着同样的封装方式；

    ```console
    RouterB#show interface Serial0
    Serial1 is down, line protocol is down
    Hardware is HD64570
    Internet address is 12.0.0.1/24
    MTU 1500 bytes, BW 1544 Kbit, DLY 1000 usec, rely 255/255, load 1/255
    Encapsulation HDLC, loopback not set, keepalive set (10 sec)
    ```

- 三层 —— IP 地址与子网掩码是否正确？子网掩码是否与另一侧匹配？

    ```console
    RouterB#show interface Serial0
    Serial1 is down, line protocol is down
    Hardware is HD64570
    Internet address is 12.0.0.1/24
    MTU 1500 bytes, BW 1544 Kbit, DLY 1000 usec, rely 255/255, load 1/255
    Encapsulation HDLC, loopback not set, keepalive set (10 sec)
    ```



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。

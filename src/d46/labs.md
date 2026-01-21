# 第 46 天 实验

## 基本的路由器安全实验

### 拓扑结构

!["拓扑图"](../images/0405.png)

### 实验目的

学习一些锁定咱们路由器的基本步骤。

## 实验步骤

1. 以一个 `enable` 秘密口令，通过使用 `Protect Enable` 模式登入路由器。通过登出特权模式然后再登入回去，测试这一设置；

    ```console
    Router#conf t
    Enter configuration commands, one per line. End with CNTL/Z.
    Router(config)#enable secret cisco
    Router(config)#exit
    Router#
    %SYS-5-CONFIG_I: Configured from console by console
    Router#exi
    Router con0 is now available
    Press RETURN to get started.
    Router>en
    Password:
    Router#
    ```

2. 设置一个 `enable` 口令，然后添加 `service password encryption` 。这一操作很少在真实路由器上完成，因为其不安全；

    ```console
    Router(config)#no enable secret
    Router(config)#enable password cisco
    Router(config)#service pass
    Router(config)#service password-encryption
    Router(config)#exit
    Router#
    %SYS-5-CONFIG_I: Configured from console by console
    Router#show run
    Building configuration...
    Current configuration: 480 bytes
    !version 12.4
    no service timestamps log datetime msec
    no service timestamps debug datetime msec
    service password-encryption
    !
    hostname Router
    !
    enable password 7 0822455D0A16
    ```

3. 保护 Telnet 线路。设置一个本地用户名及口令，并在用户连接到路由器时，让他们输入这一用户名与口令；


    ```console
    Router(config)#line vty 0 ?
    <1-15>
    Last Line number
    <cr>
    Router(config)#line vty 0 15
    Router(config-line)#login local
    Router(config-line)#exit
    Router(config)#username in60days password cisco
    Router(config)#
    ```

4. 咱们之前已测试过 Telnet，但可自由添加一台 PC 并通过 Telnet 登入该路由器，从而咱们会被提示输入用户名及口令；

5. 以一个口令保护控制台端口。要直接在控制台端口上设置一个口令；


    ```console
    Router(config)#line console 0
    Router(config-line)#password cisco
    ```

    咱们可以通过拔掉咱们的控制台线并再次插入到路由器，测试这一设置。若咱们有个路由器上的辅助端口（用于调制解调器访问），那么咱们也可保护这一辅助端口。

    ```console
    Router(config)#line aux 0
    Router(config-line)#password cisco
    ```

6. 通过仅允许入站 SSH 流量，保护 Telnet 线路。咱们也可仅允许出站 SSH 流量。为了这条命令工作，咱们将需要某个安全镜像；


    ```console
    Router(config)#line vty 0 15
    Router(config-line)#transport input ssh
    Router(config-line)#transport output ssh
    ```

7. 添加每日横幅消息（MOTD）。设置告知路由器咱们已结束了咱们消息的字符为 `X`（分隔字符）；


    ```console
    Router(config)#banner motd X
    Enter TEXT message.
    End with the character ‘X’.
    Do not use this router without authorization. X
    Router(config)#
    Router(config)#exit
    Router#
    %SYS-5-CONFIG_I: Configured from console by console
    Exit
    Router con0 is now available
    Press RETURN to get started.
    Do not use this router without authorization.
    Router>
    ```

8. 关闭整个路由器上的 CDP。咱们可以 `no cdp enable` 这条接口命令，只在某一个接口上关闭他；


    ```console
    Router(config)#no cdp run
    ```

    咱们可通过在咱们关闭 CDP 前，连接一个交换机或路由器到咱们的路由器，并执行 `show cdp neighbor (detail)` 这条命令，测试这一配置是否工作。

9. 设置路由器为发送日志记录消息到网络上的某一主机。

    ```console
    Router#conf t
    Enter configuration commands, one per line.
    End with CNTL/Z.
    Router(config)#logging ?
        A.B.C.D		IP address of the logging host
        buffered	Set buffered logging parameters
        console		Set console logging parameters
        host		Set syslog server IP address and parameters
        on			Enable logging to all enabled destinations
        trap		Set syslog server logging level
        userinfo	Enable logging of user info on privileged mode enabling
    Router(config)#logging 10.1.1.1
    ```



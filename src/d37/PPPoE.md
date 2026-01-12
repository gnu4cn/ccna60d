# PPPoE

以太网上的点对点协议（PPPoE），属于一种用于将 PPP 数据帧，封装在以太网数据帧内的网络协议。

当客户部署 ADSL 时，他们就必须在已大量安装的老式桥接客户端设备（CPE）上，支持 PPP 样式的认证及授权。PPPoE 提供了通过简单桥接接入设备，连接某一主机网络到远端接入集中器，或汇聚集中器的能力。在这一模型下，每台主机都会使用其自己的 PPP 协议栈，从而呈现给用户以一种熟悉的用户界面。访问控制、计费及业务类型，可按每用户而非每站点完成。

如同 [RFC 2516](https://datatracker.ietf.org/doc/html/rfc2516) 中所指定的，PPPoE 有着两个不同阶段：发现阶段与会话阶段。当某一主机发起一个 PPPoE 会话时，他必须首先执行发现，以识别出哪台服务器可满足这一客户端的请求，随后识别出该对等体的以太网 MAC 地址并建立一个 PPPoE 会话 ID。虽然 PPP 定义了一种等对体关系，但发现过程本质上属于一种客户端-服务器的关系。

## PPPoE 的配置

以下小节介绍服务器（ISP 处）与客户端的 PPPo E配置。因为 CCNA 考试大纲现在要求咱们掌握如何配置 PPPoE，我（作者）已包括进来！

### 服务器的配置

创建 PPPoE 服务器配置的第一步，是要定义一个管理传入连接的 BBA（宽带聚合）分组。这个 BBA 分组必须关联到某个虚拟模板：


```console
Router(config)#bba-group pppoe GROUP
Router(config-bba-group)#virtual-template 1
```

下一步是要创建一个面向客户接口的虚拟模板。在这一虚拟模板上，咱们需要配置一个 IP 地址，以及一个客户将从中得以指派协商地址的地址池：

```console
Router(config)#interface virtual-template 1
Router(config-if)#ip address 10.10.10.1 255.255.255.0
Router(config-if)#peer default ip address pool POOL
```

这个 IP 池是于全局配置模式下定义的。这个池类似于 DHCP 池的配置：

```console
Router(config)#ip local pool POOL 10.10.10.2 10.10.10.254
```

最后一步是要在那个面向客户接口上，启用 PPPoE 分组：

```console
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe enable group GROUP
Router(config-if)#no shutdown
```

### 客户端的配置

在客户侧，一个拨号接口务必要加以配置。这个接口将管理 PPPoE 连接。拨号接口可分配一个手动 IP 地址，也可通过使用 `ip address negotiated` 这条命令，指示其从服务器请求一个 IP 地址：


```console
Router(config)#interface dialer1
Router(config-if)#dialer pool 1
Router(config-if)#encapsulation ppp
Router(config-if)#ip address negotiated
Router(config)#interface FastEthernet0/0
Router(config-if)#no ip address
Router(config-if)#pppoe-client dial-pool-number 1
Router(config-if)#no shutdown
```

### 认证的配置

为保护 PPPoE 连接安全，咱们可使用两种方法：

- PAP（密码认证协议）—— 不安全，会以明文发送凭据（用户名及口令皆如此）
- CHAP（挑战握手认证协议）—— 安全（明文的用户名与 MD5 的哈希化密码），此为推荐方法


PAP 可配置如下：

```console
Server(config)#username Client password Password
Server(config)#interface virtual-template 1
Server(config-if)#ppp authentication pap
Server(config-if)#ppp pap sent-username Server password Password
```

```console
Client(config)#username Server password Password
Client(config)#interface dialer 1
Client(config-if)#ppp authentication pap
Client(config-if)#ppp pap sent-username Client password Password
```

CHAP 可配置如下：

```console
Server(config)#username Client password Password
Server(config)#interface virtual-template 1
Server(config-if)#ppp authentication chap
```

```console
Client(config)#username Server password Password
Client(config)#interface dialer 1
Client(config-if)#ppp authentication chap
```

## PPPoE 的验证与故障排除

以下消息会于 PPPoE 会话成功形成后，出现在客户端控制台上：

```console
%DIALER-6-BIND: Interface Vi1 bound to profile Di1
%LINK-3-UPDOWN: Interface Virtual-Access1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface Virtual-Access1, changed state to up
```

以下命令可用于客户端路由器，检查从 PPPoE 服务器获取到的（协商道德）的拨号接口及 IP 地址：

```console
Router#show ip interface brief
Interface                  IP-Address       OK? Method Status               Protocol
Virtual-Access1            unassigned       YES unset  up/up
Dialer1                    10.10.10.2       YES IPCP   up/up
```


以下命令可用于客户端路由器上，显示 PPPoE 会话的状态：

```console
Router#show pppoe session
1 client session
Uniq ID  PPPoE  RemMAC      Port        Source   VA         State
       SID  LocMAC                               VA-st
N/A     16  ca00.4843.0008  Fa0/0       Di1      Vi1        UP
            ca01.4843.0008                                  UP
```

一些用于 PPPoE 连接故障排除的有用命令如下：

```console
Router#debug ppp ?
  authentication  CHAP and PAP authentication
  bap             BAP protocol transactions
  cbcp            Callback Control Protocol negotiation
  elog            PPP ELOGs
  error           Protocol errors and error statistics
  forwarding      PPP layer 2 forwarding
  mppe            MPPE Events
  multilink       Multilink activity
  negotiation     Protocol parameter negotiation
  packet          Low-level PPP packet dump
```



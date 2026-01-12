# PPP 的运行

由于以下因素，PPP 被视为一种 Internet 友好的协议：

- 其支持数据压缩
- 认证得以内置（PAP 与 CHAP）
- 网络层地址的协商
- 错误检测


咱们可在数种连接类型上使用 PPP，包括以下这些：

- DSL
- ISDN
- 同步与异步链路
- HSSI


PPP 可分解为以下的三个二层的子层：

- NCP —— 建立网络层协议 (服务网络层)
- LCP —— 建立、认证及测试链路质量（服务物理层）
- HDLC —— 封装链路上的数据报


了解上述内容，可能会在 CCNA 考试期间派上用场！

## 配置 PPP

如下面的图 37.7 及输出所示，PPP 非常易于配置。咱们同样可以添加认证，这马上就会加以演示。

![PPP 连接](../images/PPP_conn.png)

**图 37.13** -— **PPP 连接**


```console
R1#conf t
R1(config)#interface s0
R1(config-if)#ip add 192.168.1.1 255.255.255.0
R1(config-if)#clock rate 64000
R1(config-if)#encapsulation ppp
R1(config-if)#no shut
```

```console
R2#conf t
R2(config)#interface s0
R2(config-if)#ip add 192.168.1.2 255.255.255.0
R2(config-if)#encapsulation ppp
R2(config-if)#no shut
```


## PPP 的认证

PPP 已内置了口令认证协议（PAP）形式的认证，与挑战握手认证协议（CHAP）。PAP 以存在安全风险的明文方式，在链路上发送口令；而 CHAP 则会发送使用了 MD5 安全性的一个哈希值。以下是 CHAP 的配置：

![带有 CHAP 的 PPP](../images/PPP_with_CHAP.png)

**图 37.14** -— **带有 CHAP 的 PPP**


```console
R1#conf t
R1(config)#username R2 password Cisco
R1(config)#interface s0
R1(config-if)#ip add 192.168.1.1 255.255.255.0
R1(config-if)#clock rate 64000
R1(config-if)#encapsulation ppp
R1(config-if)#ppp authentication chap
R1(config-if)#no shut
```

```console
R2#conf t
R2(config)#username R1 password Cisco
R2(config)#interface s0
R2(config-if)#ip add 192.168.1.2 255.255.255.0
R2(config-if)#encapsulation ppp
R2(config-if)#ppp authentication chap
R2(config-if)#no shut
```


要配置 PAP，咱们要以 `[pap]` 关键字，替换上面配置中的 `[chap]` 关键字。咱们还可配置 PPP 为先尝试使用 CHAP 认证，而当这一方式不成功时，在以 PAP 尝试。这一做法称为 PPP 的回退，命令如下：

```console
R2(config-if)#ppp authentication chap pap
```



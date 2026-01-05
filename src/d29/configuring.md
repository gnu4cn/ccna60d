# 配置 ACL

与任何技能一样，重复才能精通。正如我（作者）之前所说，咱们必须在路由器上敲入我提供的每个示例，做尽可能多的实验，然后构造咱们自己的示例。无论是在考试中还是在现实世界中，咱们都需要快速且准确。

接下来的小节中介绍的标准 ACL 与扩展 ACL，都属于编号的 ACL。这两种 ACL 代表了配置 ACL 的经典方式。命名的 ACL 属于配置 ACL 的另一种方式，他们会在后续小节中介绍。

## 标准 ACL

标准的编号 ACL，最容易配置，因此这种 ACL 便是最好的起点。标准 ACL 只能根据源网络或 IP 地址过滤。


![带有源和目的地址的进入数据包](../images/0905.png)

**图 29.5** -- **带有源及目的地址的传入数据包**

在上面的图 29.5 中，这个传入数据包有着源及目的地址，但咱们的标准 ACL 将只查看源地址。咱们的 ACL 将放行或拒绝这个源地址（见图 29.6）：

```console
Router(config)#access-list 1 permit host 172.16.1.1
```

![有着多台/个主机网络的网络](../images/0906.png)

**图 29.6** -- **有着多个主机/网络的网络**


```console
Router(config)#access-list 1 permit host 172.16.1.1
Router(config)#access-list 1 permit host 192.168.1.1
Router(config)#access-list 1 permit 10.1.0.0 0.0.255.255
```

这个 ACL 更被应用到服务器侧的那个路由器。请记住，这个列表的末尾处，将有条隐式的 `"deny all"`，从而全部其他流量都将被阻止。

## 扩展的 ACL

更细粒度，会构建在扩展的编号 ACL 中；但这样做使他们配置起来更为棘手。咱们可过滤源或目的网络、端口、协议及业务等。

一般来说，咱们可以看到扩展的 ACL 配置语法，如下所示：


```console
access list# permit/deny [service/protocol] [source network/IP] [destination network/IP] [port#]
```

例如：


```console
access-list 101 deny tcp 10.1.0.0 0.0.255.255 host 172.30.1.1 eq telnet
access-list 100 permit tcp 10.1.0.0 0.0.255.255 host 172.30.1.1 eq ftp
access-list 100 permit icmp any any
```

![阻止服务器访问实例](../images/0907.png)

**图 29.7** -- **阻止服务器访问的示例**

咱们可为上面这个包括了电子邮件、web 及文件服务器的网络，配置的一个 ACL 将如下所示（应用在服务器侧）：


```console
access-list 100 permit tcp host 172.16.1.1 host 172.20.1.1 eq smtp
access-list 100 permit tcp 10.1.0.0 0.0.255.255 host 172.30.1.1 eq ftp
access-list 100 permit tcp host 192.168.1.1 host 172.40.1.1 eq www
```

或者，当咱们有着不同要求时，其也可以是下一个 ACL：

```console
access-list 101 deny icmp any 172.20.0.0 0.0.255.255
access-list 101 deny tcp 10.1.0.0 0.0.255.255 host 172.30.1.1 eq telnet
```

或者，其也可以为如下：

```console
access-list 102 permit tcp any host 172.30.1.1 eq ftp established
```


其中 `[established]` 这个关键字告诉路由器，只有当流量源自内部的那些主机时才予以放行。三次握手标志（`ACK` 或 `RST` 位）将表明这点。


## 命名的 ACL

与编号的 ACL 不同，命名的 ACL 可根据其描述性名字轻松识别，而这点在大型配置中尤其有用。命名 ACL 的引入，是为了增加灵活性，以及 ACL 的易于管理。命名的 ACL 可更多的视为一种配置增强，因为他并未更改 ACL 的核心结构（其修改了我们引用某个 ACL 的方式）。

其语法类似于编号的 ACL，主要区别在于使用名字而不是编号标识 ACL。与编号的 ACL 中的情形一样，咱们可配置标准或扩展的命名 ACL。

配置命名的 ACL 时的另一区别是，咱们必须始终使用 `ip access-list` 命令，而编号的 ACL 下则不同，其中咱们还可以使用简单的 `access-list` 命令。


```console
Router(config)#access-list ?
	<1-99>				IP standard access list
	<100-199>			IP extended access list
	<1100-1199>			Extended 48-bit MAC address access list
	<1300-1999>			IP standard access list (expanded range)
	<200-299>			Protocol type-code access list
	<2000-2699>			IP extended access list (expanded range)
	<700-799>			48-bit MAC address access list
	dynamic-extended	Extend the dynamic ACL absolute timer
	rate-limit			Simple rate-limit specific access list

Router(config)#ip access-list ?
	extended	Extended access list
	log-update	Control access list log updates
	logging		Control access list logging
	resequence	Resequence access list
	standard	Standard access list

R1(config)#ip access-list standard ?
	<1-99>	Standard IP access-list number<1300-1999> Standard IP access-list number (expanded range)
	WORD		Access-list name

R1(config)#ip access-list extended ?
	<100-199>	Extended IP access-list number
	<2000-2699>	Extended IP access-list number (expanded range)
	WORD 	Access-list name
```

命名的 ACL 有着与其他类型 ACL（标准的编号与扩展的编号）略有不同的语法。咱们还可编辑线上的命名 ACL，这是一项非常有用的特性。咱们只需告诉路由器，咱们打算配置一个命名的 ACL，以及咱们希望他是标准的还是扩展的。咱们也可在更高 IOS 后中，编辑那些编号的 ACL，因此请查看咱们平台的文档。

在使用 `ip access-list` 命令创建某个命名的 ACL 时，Cisco 10S 会将咱们置于 ACL 配置模式下，其中咱们可输入或移除 ACL 条目（拒绝或放行访问的一些条件）。下图 29.8 显示了一个命名的 ACL 示例，接着的相应输出：


![命名ACL](../images/0908.png)

**图 29.8** -- **命名的 ACL**

```console
Router(config)#ip access-list extended BlockWEB
Router(config-ext-nacl)#?
Ext Access List configuration commands:
	<1-2147483647>	Sequence Number
	default			Set a command to its defaults
	deny			Specify packets to reject
	dynamic			Specify a DYNAMIC list of PERMITs or DENYs
	evaluate		Evaluate an access list
	exit			Exit from access-list configuration mode
	no				Negate a command or set its defaults
	permit			Specify packets to forward
	remark			Access list entry comment
Router(config-ext-nacl)#deny tcp any any eq 80
Router(config-ext-nacl)#permit ip any any
```

命名的 ACL 验证，可使用以下命令完成：

- `show ip access-list`: 显示设备上创建的全部 ACL
- `show ip access-list <acl_name>`: 显示某个特定的命名 ACL

```console
Router(config)#do show ip access-lists
Standard IP access list test
	30 permit 10.1.1.1
	20 permit 192.168.1.1
	15 permit 172.20.1.1
	10 permit 172.16.1.1
```

要了解咱们可如何在某个命名的 ACL 中，添加或删除 ACL 条目，请参阅下面的 [ACL 的序列编号](sequence_number.md) 小节。


## 应用 ACL

为了使其生效，咱们必须将咱们的 ACL，应用到某个接口或路由器端口。我（作者）之所以这样说，是因为我曾见过许多新手 Cisco 工程师敲入 ACL，然后就在想为什么他工作！或者，他们虽然配置了 ACL，但应用了错误的 ACL 编号或名字到接口。

当咱们正应用某个 ACL 到某条线路上时，咱们必须以 `access-class` 命令指定他，而要应用到某个接口，则是 `ip access-group` 这条命令。我（作者）或许将永远不知道，思科公司为什么要让咱们这样做！

下面是 ACL 正被应用到端口或接口的三个示例。

接口：

```console
Router(config)#int FastEthernet0/0
Router(config-if)#ip access-group 101 in
```

线路：

```console
Router(config)#line vty 0 15
Router(config-line)#access-class 101 in
```

接口：

```console
Router(config)#int FastEthernet0/0
Router(config-if)#ip access-group BlockWEB in
```



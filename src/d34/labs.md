# 第 34 天实验

对本课程模块中讲到的那些配置命令进行测试：

- 在某台思科设备上执行一下`show version`命令，并对输出进行检查；将这些输出项与课程中详细解释进行联系

- 将启动配置拷贝到一台 TFTP 服务器上

- 从某台 TFTP 服务器拷贝配置文件到路由器上

- 从某台 TFTP 服务器拷贝一个 IOS 镜像到路由器的闪存中

- 使用`show flash`命令，对闪存中的内容进行检查

- 以`boot system flash: [name]`命令，使用新的 IOS 文件启动设备

访问[www.in60days.com](http://www.in60days.com/)网站，免费观看作者完成此实验。

## 日志记录实验

在思科路由器上配置日志记录：

- 选择日志记录设施`local3`：`logging facility local2`
- 执行全局的`logging on`命令
- 选择日志记录的严重程度`informational`
- 在一台 PC 机上配置一个自由的`syslog`服务器并将其连接到路由器
- 执行`logging [address]`命令来指定该`syslog`服务器
- 指定`logging source-interface`命令
- 验证命令`show logging`
- 配置`service timestamp log datetime localtime msec show-timezone`命令
- 在 PC 机上检查`syslog`消息

## SNMP实验

在思科路由器上配置 SNMP ：

- 使用`snmp-server host`命令配置 SNMP 服务器
- 使用`snmp-server community`命令，配置 SNMP 的只读（ RO ）与读写（ RW ）共有字符串（Configure SNMP RO and RW communities using the `snmp-server community` command）


## NetFlow实验

在思科路由器上配置 NetFlow ：

- 在某个路由器接口上开启 IP 数据流的入口与出口（Enable IP flow ingress and egress on a router interface）
- 在有流量通过路由器后，对`show ip cache flow`命令进行检查
- 使用`ip flow-export`命令对 NetFlow 的版本进行配置
- 使用`ip flow-export`命令配置一台外部 NetFlow 服务器


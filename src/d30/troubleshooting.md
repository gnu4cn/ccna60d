#  NAT 故障排除

十有八九，路由器管理员都会忘记添加 `ip nat outside` 或 `ip nat inside` 命令到路由器接口。事实上，这几乎总是问题所在！接下来的一些最常见错误，包括输入错误的 ACL 及拼写错误的池名字（其是区分大小写的）。

咱们可通过使用 `debug ip nat [detailed]` 命令，调试路由器上的 NAT 转换，同时咱们可以 `show ip nat translations` 这条命令，查看 NAT 池。



请参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试。



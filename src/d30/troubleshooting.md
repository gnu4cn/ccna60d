#  NAT 故障排除


 NAT 故障中十次有九次，都是由于路由器管理员忘记了把`ip nat outside`或`ip nat inside`命令加到路由器接口上。事实上，几乎总是存在这个问题！接下来最频繁的错误包括不正确的 ACL ，以及某个拼写错误的地址池名称（地址池是区分大小写的）。

使用命令`debug ip nat [detailed]`，可以在路由器上对 NAT 转换进行调试，又可以使用命令`sh ip nat translations`，来查看 NAT 地址池。




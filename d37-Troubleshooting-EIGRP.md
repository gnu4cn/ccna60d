#第37天

**EIGRP故障排除**

**Troubleshooting EIGRP**

##第37天任务

- 阅读今天的课文
- 复习昨天的课文

增强的内部网关路由协议是一种思科专有的高级距离矢量路由协议。而作为一名思科网络工程师，掌握如何来支持EIGRP，就尤为重要，因为EIGRP是一种广泛使用的路由协议。在具备本教程前面讲到的那些技术下，为了对运行着EIGRP的网络进行鼓掌排除与支持，就必须对EIGRP协议本身内部工作原理，有扎实掌握。

尽管无法深入到所有潜在的EIGRP故障场景，本课程模块还是将对那些在把EIGRP选作内部网关协议进行部署时，一些最常见的故障场景进行讨论。

今天将学习以下内容：

- 邻居关系的故障排除
- 路由安装的故障排除，Troubleshooting route installation
- 路由通告的故障排除
- EIGRP路由故障的调试，Debugging EIGRP routing issues

本课程对应了以下CCNA大纲要求：

+ EIGRP故障排除，Troubleshoot and resolve EIGRP problems
    - 邻居关系的建立，Neighbour adjancies
    - 自治系统编号，AS number
    - 负载均衡，Load balancing
    - 水平分割，Split horizon

##邻居关系故障的排除

这里重要的是清楚仅在两台或更多路由器之间简单地开启EIGRP，并不保证能建立邻居关系。而是除了在那些参数匹配外，一些其它因素亦会造成EIGRP邻居关系建立的失败。以下任何问题，都将导致EIGRP邻居关系的无法建立：

- 这些邻居路由器不在同一个个子网中
-

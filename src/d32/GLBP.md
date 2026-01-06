# 网关负载均衡协议

**Gateway Load Balancing Protocol**

与 HSRP 一样，网关负载均衡协议也是一种思科专有的协议。 GLBP 以与 HSRP 和 VRRP 类似的方式，提供了高的网络可用性。但与 HSRP 与 VRRP 在任何时候都由单一网关来转发特定组的流量不同， GLBP 允许在同一 GLBP 组中的多台网关，同时进行流量的转发。

GLBP网关之间的通信，是通过以每隔 3 秒的频率，往多播地址`224.0.0.102`上，使用 UDP 端口 3322 发送 Hello 报文进行的。下图34.24对此进行了演示：

![GLBP的三层及四层协议与地址](../images/3424.png)

*图 34.24 -- GLBP的三层及四层协议与地址，GLBP Layer 3 and Layer 4 Protocols and Addresses*



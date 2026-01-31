# 被动接口

路由协议设计与配置的一个重要考量，是限制不必要的对等关系，如下图 17.10 中所示。这是通过使用被动接口做到的，使用被动接口会阻止路由器在特定接口上，形成路由邻接关系。根据所使用的具体路由协议，这种功能会有所不同，但这种行为通常属于以下两类：

- 路由器不会在被动接口上发送路由更新
- 路由器不会在这种接口上发送 `Hello` 数据包，而因此邻居关系不会形成


被动接口通常能够接收路由更新或 `Hello` 数据包，但不允许向外发送任何类型的路由协议信息。


![限制不必要的数据交换](../images/1010.png)

**图 17.10** -- **限制不必要的对等关系**

被动接口的一个用例，便是避免自分布层到接入层的那些路由协议对等关系，如上图 17.10 中所示。在不同的接入层交换机之间，进行三层的对等互联（即在跨交换机区块的不同的交换机上设置多台主机），咱们基本上在增加内存负载、路由协议更新开销及更多复杂性。此外，当出现链路故障时，流量就会通过邻近的接入层交换机，传输到另一 VLAN 成员（端口）。

基本上，咱们会希望消除那些不必要的路由对等邻接关系，因此咱们就会把那些朝向二层交换机的端口，配置为被动接口，以抑制路由更新通告。当某台分布层交换机，不会在这些接口上收到来自潜在对等成员的路由更新时，那么他就不必处理这些更新，别且也将不在该接口上形成邻居邻接关系。实现这点的命令，通常是路由进程配置模式下的 `passive-interface [interface number]`。

> *知识点*：
>
> - passive interfaces
>
> - an important routing protocol design and Configuration consideration, is to limit unnecessary peerings, is done by using passive interfaces, which prevents the router from forming routing adacencies on the specific interface
>
> + the behivor of passive interfaces, falling within two categories:
>   - the router does not send routing updates on the passive interface
>   - the router does not send `Hello` packets on the interface, so neighbour relationships are not formed
>
> - passive interfaces are usually able to receive routing updates or `Hello` packets, but are not allowed to send any kind of routing protocol information outbound
>
> - by having Layer 3 peering across the different Access Layer switches(i.e., having multiple hosts on different switches across switch blocks), are basically adding memory load, routing protocol update overhead, and more complexity. Also, if there is a link failure, the traffic may transit through a neighbouring Access Layer switch, to get to another VLAN member.
>
> - to eliminate unnecessary routing peering adjacencies, would configure the ports towards the Layer 2 switches, as passive interfaces, in order to suppress routing updates advertisements.

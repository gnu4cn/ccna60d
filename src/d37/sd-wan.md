# SD-WAN

SD-WAN（软件定义广域网）是一种利用软件定义网络（SDN）技术管理广域网的技术，旨在通过混合链路（MPLS、互联网、4G/5G），提升分支机构与总部间的网络性能、可靠性和安全性。他实现了网络的集中控制和可视化，有效降低了高昂的专线成本，并简化了云计算和混合办公场景下的网络部署。

## 核心价值与优势

- 降低成本 (Cost-Effectiveness)： 减少对昂贵MPLS专线的依赖，允许使用廉价的宽带互联网连接；
- 优化性能 (Performance): 智能路由流量，基于应用类型优先通过最高质量的链路传输，保障业务数据（如视频会议）的流畅性；
- 集中管理 (Centralized Control): 采用零配置部署（Zero Touch Provisioning），通过集中式平台管理所有分支机构网络，简化运维；
- 灵活性与扩展性 (Agility): 快速为新分支机构建立网络连接，适应快速变化的业务需求；
- 增强安全性 (Security): 整合下一代防火墙（NGFW）功能，在互联网链路上提供端到端的数据加密。


## 工作原理

SD-WAN 将网络控制平面（Control Plane）与数据转发平面（Data Plane）分离。

- 虚拟化 Overlay: 在物理链路之上构建逻辑的虚拟网络，无论底层是何种传输介质，上层应用感知到的都是统一的网络；
- 智能流量调度: 实时监控链路状态，动态选择最佳路径，自动切换链路。


## 应用场景

- 多分支企业: 金融、零售、制造业等需要将大量分支机构连接到总部或云端；
- 混合云连接: 优化员工接入 AWS、Azure、阿里云等云服务商的体验；
- 远程办公/分支机构: 快速搭建安全、可靠的远程办公环境。


## 主要组成部分

- SD-WAN CPE (客户边缘设备): 部署在分支机构或总部，用于连接本地网络和广域网，集成了路由、防火墙等功能；
- 集中管理控制器: 管理全网策略、配置和网络可视性。


## 主流厂商与解决方案

- 华为 (Huawei): 提供全场景 SD-WAN 方案；
- 深信服 (Sangfor): 聚焦应用体验和安全的 SD-WAN；
- Cisco/VeloCloud (Qualcomm/VMware): 业界主流的智能 SD-WAN 解决方案；
- Fortinet/Sophos: 强调 SD-WAN 与安全（NGFW）的融合。

简而言之，SD-WAN 是传统 VPN 和专线的演进，在云计算时代为企业提供了更智能、更灵活的广域网连接方式。


## 参考链接

- [什么是SD-WAN？](https://info.support.huawei.com/info-finder/encyclopedia/zh/SD-WAN.html)
- [什么是 SD-WAN？](https://www.paloaltonetworks.cn/cyberpedia/what-is-sd-wan)
- [什麼是 SD-WAN（軟體定義的WAN）？](https://www.fortinet.com/tw/resources/cyberglossary/sd-wan-explained)

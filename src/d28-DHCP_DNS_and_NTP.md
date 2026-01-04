# 第 28 天 DHCP、DNS 与 NTP

## 第 28 天任务

- 阅读今天的课文（如下）
- 完成今天的实验
- 参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试
- 阅读 CCNA 补习指南
- 在 subnetting.org 上花 15 分钟


动态主机配置协议（DHCP），被主机用于在启动时，获取一些初始配置信息，包括诸如 IP 地址、子网掩码与默认网关等参数。由于每台主机都需要一个 IP 地址，才能在某个 IP 网络中通信，因此 DHCP 减轻了给每台主机手动配置一个 IP 地址的管理负担。

所谓域名系统（DNS），会将主机名映射到 IP 地址，从而允许咱们在 web 浏览器中输入 "www.in60days.com"，而不是这个站点托管服务器的 IP 地址。

而网络时间协议（NTP），会在网络设备间同步时间。

今天，咱们将学习以下内容：

- DHCP 的功能
- 配置 DHCP
- DHCP 问题的故障排除
- DNS 的运行
- DNS 问题的故障排除
- 网络时间协议



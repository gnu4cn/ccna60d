# 第 51 天 JSON 与配置管理


## 第 51 天任务

- 阅读今天的课文
- 复习昨天的课文
- 复习咱们希望的任何其他理论及实验
- 参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试
- 阅读 CCNA 补习指南
- 在 subnetting.org 上花 15 分钟


所谓配置管理，Configuration Management, CM 属于另一种自动化工具，旨在优化任务、提升生产力，以及最小化网络管理员的错误。配置管理是系统化地做出变的做法，从而系统会随时间推移而一直维持其完整性。作为一门学科，配置管理实现了管理对网络设备变更、跟踪状态变化，以及维护系统请单等方面的技术、策略、流程及工具。

当咱们计划定期对咱们设备的配置做出变更，且咱们需对数台设备做出类似变更时，那么咱们就应考虑使用一些受咱们的厂商支持的配置管理产品。当前受多数厂商支持的三种配管理产品分别为：

- [Chef](https://www.chef.io/)
- [Puppet](https://www.puppet.com/)
- 和 [Ansible](https://ansible.xfoss.com/)

事实上，若咱们在某一大型 IT 基础设施或数据中心上班，那么咱们就可能在使用这些产品。


这些配置管理系统都是一些支持对咱们的 IT 基础设施，包括运行 Cisco IOS 的设备，进行监控与管理健壮框架。例如，Cisco 的 Nexus NX-OS 就支持 Ansible 推送网络配置，从而确保一致性及合规。

JSON 属于一种存储与传输数据的轻量级格式，常用于数据从某一服务器，发送到某一 web 页面时。JSON 是一种数据格式。虽然 JSON 可归类为一门语言，但他并非一门编程语言，而 Python 就是一门编程语言（比如）。JSON 易于人类阅读书写，同时易于机器解析与生成。

今天，咱们将学习以下内容：

- 配置管理 —— Puppet、Chef 与 Ansible
- 解析 JSON 编码的数据




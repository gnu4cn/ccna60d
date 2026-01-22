# 第 50 天 网络的可编程性

## 第 50 天任务

- 阅读今天的课文
- 复习昨天的课文
- 复习咱们希望的任何其他理论及实验
- 参加 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnain60days/) 处今天的考试
- 阅读 CCNA 补习指南
- 在 subnetting.org 上花 15 分钟


传统网络属于非同质的（即 “由一些不完全同类的部件或元素构成”，来源：dictionary.com）。咱们有着一些运行不同操作系统的不同网络设备，每台设备均在以符合某一特定技术或协议的某种方式，处理着数据帧与数据包。大型网络需安全、协作、数据等的一些专业团队。数据在网络中流动的方式方面的改变，必须由管理这些设备的团队，在这些设备上执行。


而软件定义网络（SDN），则旨在将流量方面的决策，与转发这些流量的系统分离。网络管理员（正使用着 SDN 的）现在便能够通过一些开放接口与应用编程接口（API），动态地管理与控制网络的行为。简而言之，SND 的目标，是要将网络的配置与控制，从硬件迁移到软件。

我（作者）强烈建议咱们，要了解以下那个 [新的思科 DevNet 助理认证](https://www.cisco.com/site/us/en/learn/training-certifications/certifications/devnet/associate/index.html)，相比咱们在这里所讲到的，他对 SDN 的介绍要深入得多，因为我们只需要涵盖考试大纲的那些主题。咱们可在我们的另一个网站 [Online IT Certification Training](https://www.howtonetwork.com/) 上查看。

若咱们已涉足传统组网了一些时间，即独立登录一些设备，并配置比如访问列表和流量操控等的一些参数，那么网络自动化对咱们来说，将是一种重大的范式转变。确实如此，尤其当我们涉及解析 JSON 的输出与发送一些 HTTP 查询时。网络自动化属于网络技术的未来，因此咱们需要掌握这项技。

今天，咱们将学习以下内容：

- 网络自动化
- 传统网络与基于控制器的网络
- 基于控制器的架构与软件定义的架构（叠层、底层与结构）
- 传统的园区设备管理与思科 DNA 中心的设备管理
- 基于 REST 的API（CRUD、HTTP 动词，与数据编码）


> *译注*：译者此前曾了解过 Ansible，其中亦涉及到 “网络自动化” 这一主题，参见：[网络自动化有何不同？](https://ansible.xfoss.com/network/difference.html)。

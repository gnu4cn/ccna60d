# OT 标准与模型概述

运营技术，Operational Technology, OT 网络安全涉及对工业控制系统的保护。ISA/IEC 62443 标准提供了技术层面的“操作指南”，就网络分段、设备加固和安全生命周期等内容给出了详细指导。NIST 框架则阐明了“保护什么”和“为何保护”，提供了总体治理、风险管理以及全企业范围的韧性保障。

> **注**：ISA/IEC 是指 the International Society of Automation(ISA) and the International Electrotechnical Commision(IEC)。

两种标准很少被视为相互竞争。相反，组织通常会将他们结合起来使用 —— 采用 NIST 标准制定高级别战略，采用 IEC 62443 标准进行技术实施。

## ISA/IEC 62443：技术标准

该标准最初是为工业自动化与控制系统，industrial automation and control system, IACS 而制定的。这是一项高度规范性的标准，明确规定了如何设计、构建和维护安全的工厂车间。

- **重点关切**：定义网段的区域和通道，以防止攻击扩散。此外，还规定了设备和系统的分级安全级别（SL 1-4）;
+ 结构：分为四个主要层级：
    - 概述：政策、安全计划及组织定义；
    - 政策与流程：针对资产所有者和系统集成商的要求；
    - 系统：风险评估、系统分区（区域/通道）及安全要求；
    - 组件：安全的产品开发及对设备的技术要求。


## NIST 框架：治理与风险模型

这些框架由美国国家标准与技术研究院，National Institute of Standards and Technology, NIST 制定，是一套广泛适用的、基于风险的框架，可适用于任何领域，包括关键基础设施。


- **重点关切**：将网络安全转化为业务风险。他充当了车间操作人员与公司高管之间的通用沟通语言。
+ 采用的核心框架：
    - NIST CSF（Cybersecurity Framework，网络安全框架）：遵循 “治理、识别、保护、检测、响应和恢复” 这六个支柱；
    - NIST SP 800-82：专门针对运营技术（OT）安全的指南文件。该文件明确引用 IEC 62443 标准用于项目构建和控制叠加层设计。


## 二者的对比与协同作用

- NIST 规定了企业治理中需要解决的问题。例如，制定一份通用的事件响应计划。
- IEC 62443 规定了在 OT 环境中如何在操作层面实现这些要求。例如，如何配置可编程逻辑控制器 (PLC) 或安全隔离工业区域。

针对整体风险管理使用 NIST，同时结合 IEC 62443 确保车间层面的技术合规性，可构建出具有高度可防御可审计的 OT 网络安全态势。

## 参考


- [isa.org](https://isa.org)
- [Mapping NIST CSF 2.0 to IEC 62443: A Practical Framework for Industrial OT Security](https://shieldworkz.com/blogs/mapping-nist-csf-2.0-to-iec-62443-a-practical-framework-for-industrial-ot-security)
- [OT Network Segmentation: A Practical Guide for ICS and SCADA Environments](https://frenos.io/cybersecurity-resources/nist-iec62443-security-frameworks)
- [IEC 62443](https://zh.wikipedia.org/wiki/IEC_62443)

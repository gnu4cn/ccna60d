# IOS 许可

自从首款思科路由器的首个互联网络操作系统（10S）创建以来，思科始终遵循了每个路由器型号，均有着其专属版本及发布构建的同一做法。主要版本给与了12.0 的编号体系，这些版本的变更随后被编号为 12.1、12.2 等。在这些版本中，是一些修复 bug 及增加模组及其他特性支持的发布，比如 12.1(1a)。

不幸的时，随着支持的增加与 bug 的修复，这些发布被拆分为多个系列，因此每个型号都有了自己的 10S，这导致了不同版本及发布。当咱们想要某个安全或语音镜像时，那么咱们就必须购买有着咱们路由器正确版本、具备正确特性支持与 bug 修复的特定镜像。

思科最终发布了一些完整培训工具及演示文稿，以便咱们理解命名规范、版本级别及所支持的模组。随着软件得以测试及成熟，其也会被赋予不同名字，比如 早期部署版的 ED，一般部署的 GD 等！这一切都让客户感到非常困惑。以下是一张思科文档中解释 IOS 版本的图片：


![IOS 软件的特别发布](../images/3504.png)

**图 34.7** —- **I0S 的特殊发布**（图片 © Cisco Systems Inc.）

若咱们认为他在客户中引起了一些混乱，那么咱们是对的。我（作者）无法告诉咱们，我在 Cisco TAC 工作期间有多少次不得不与那些购买了路由器和 10S，却发现其不支持那些他们网络基础设施所需功能，的困惑并愤怒的客户打交道。还要记住，对于大型企业网络，一次 IOS 升级就可能必须提前几个月，安排在一个很小的维护窗口期间。

## 新的模型

思科现已修改 IOS 模型，而 IOS 版本 12 跃升至 15。目前，针对每个型号都构建了个通用镜像。这一镜像包含了咱们所需的全部特性集，而为了获取对一些高级特性的访问，咱们就需要购买适当的许可证，并在实际设备上验证该许可证。这样做是为了同时便利于思科及其客户，以及并防止思科软件的盗用或未经授权共享，而正如咱们可设想的那样，思科软件开发耗资相当高。

所有购买自思科（经销商）的新型号，都安装了基础镜像，同时许可证已在路由器启用。当客户打算启用高级安全或语音特性时，那些这些特性就需要得以启用。这通常是通过使用一个名为 Cisco License Manager (CLM) 的免费 Cisco 应用实现的。咱们可在 Cisco.com 上轻松检索到这一应用。

> **译注**：CLM 现已升级至 Smart Licensing：[Cisco Licensing](https://www.cisco.com/site/us/en/buy/collateral/licensing/software-smart-licensing-smart-accounts.html)

![思科许可证管理器的下载页面](../images/3505.png)

**图 34.8** -— **思科的许可证管理器下载页面**

CLM 可安装与某一服务器或主机上，使客户能够在其设备与思科许可证门户之间建立接口。CLM 通过通过一个 GUI，负责追踪每台设备的当前许可证及特性。

![思科许可证管理器的图形界面](../images/3506.png)

**图 34.9** -— **思科的许可证管理器 GUI** (Image © Cisco System Inc.）

## 许可证激活

思科路由器（支持授权）的每种型号，都已分配一个称为唯一设备标识符（UDI）的唯一识别号。这个识别编号，由序列号（SN）及产品标识符（PID）构成。执行 `show license udi` 命令，查看这一信息。

```console
Router#show license ?
all        Show license all information
detail     Show license detail information
feature    Show license feature information
udi        Show license udi information

Router#show license udi
Device#   PID               SN              UDI
--------------------------------------------------------------------
*0        CISCO1941/K9      FTX15240000     CISCO1941/K9:FTX15240000
```


咱们会在 www.cisco.com/go/license 处与 Cisco 注册这一 IOS 时输入这个 UDI。咱们还将添加咱们为这一 IOS 付款后，经销商颁发给咱们的许可证（产品授权密钥，或 PAK），该许可证会于 UDI 比对验证。当这一许可证验证通过时，咱们会收到思科通过邮件发送的许可证密钥。

咱们可在下面看到那些特性已被激活，其中 `ipbasek9` 特性将始终是启用的。

```console
Router#show license all
License Store: Primary License Storage
StoreIndex: 0   Feature: ipbasek9                   Version: 1.0
        License Type: Permanent
        License State: Active, In Use
        License Count: Non-Counted
        License Priority: Medium
License Store: Evaluation License Storage
StoreIndex: 0   Feature: securityk9                Version: 1.0
        License Type: Evaluation
        License State: Inactive
            Evaluation total period: 208 weeks 2 days
            Evaluation period left: 208 weeks 2 days
        License Count: Non-Counted
        License Priority: None
StoreIndex: 1   Feature: datak9                     Version: 1.0
        License Type:
        License State: Inactive
            Evaluation total period: 208 weeks 2 days
            Evaluation period left: 208 weeks 2 days
        License Count: Non-Counted
        License Priority: None
```

`show license feature` 这条命令将输出已启用特性的摘要。


```console
Router#show license feature
Feature name        Enforcement  Evaluation  Subscription   Enabled
ipbasek9            no           no          no             yes
securityk9          yes          yes         no             no
datak9              yes          no          no             no
```


一旦许可证已被验证，那么该许可证的密钥，就必须经由 USB 驱动器，或网络服务器予以添加，同时 `license install [url]` 就要在命令行中加以执行。要注意 “.lic” 的文件名。


```console
Router#dir usbflash0:

Directory of usbflash0:/

   1  -rw-        3064  Apr 18 2013 03:31:18 +00:00  FHH1216P07R_20090528163510702.lic

255537152 bytes total (184524800 bytes free)
Router#
Router#license install usbflash0:FHH1216P07R_20090528163510702.lic
Installing...Feature:datak9...Successful:Supported
1/1 licenses were successfully installed
0/1 licenses were existing licenses
0/1 licenses were failed to install
Router#
*Jun 25 11:18:20.234: %LICENSE-6-INSTALL: Feature datak9 1.0 was installed in this device. UDI=CISCO2951:FHH1216P07R; StoreIndex=0:Primary License Storage
*Jun 25 11:18:20.386: %IOS_LICENSE_IMAGE_APPLICATION-6-LICENSE_LEVEL: Module name = c2951 Next reboot level = datak9 and License = datak9
```

现在该路由器就将必须重启，以激活新的特性集。





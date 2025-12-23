# 接入点及 WLC 的管理访问

## 身份验证、授权和计费

在无线部署中，身份验证、授权和计费（AAA）服务器，管理着两项主要功能：

- 无线客户端对网络的访问
- 设备管理的访问


在自主（自治）架构下，AAA 可在如下位置处配置：

- AAA 的用户配置，可在接入点上完成
- AAA 的服务器配置，可请求自诸如安全身份服务引擎 (ISE) 、访问控制系统 (ACS) 及身份与访问管理（IAM）等外部提供方

![自主 AP 上的本地 AAA 用户配置](../images/local_aaa.png)

**图 14.48** -- **自主 AP 上的本地 AAA 用户配置**

![自主 AP 部署中的远端 AAA 配置](../images/remote_aaa.png)

**图 14.49** -- 自主 AP 部署中的远端 AAA 配置**

在分离式 MAC 架构下，AAA 可在以下位置处配置：

- AAA 的用户配置可在 WLC 上完成
- AAA 的服务器配置可请求自 ISE、ACS 及 IAM 等外部提供方


![轻量级部署下的本地 AAA 配置](../images/local_aaa_for_lightweight_deployment.png)

**图 14.50** -- **轻量级部署中的本地 AAA 配置**

![轻量级部署下的远端 AAA 配置](../images/remote_aaa_for_lightweight_deployment.png)

**图 14.51** -- **轻量级部署中的远端 AAA 配置**


用于 AAA 的主要协议有两种：远程访问拨号用户服务 (RADIUS) ，与终端访问控制器访问控制系统 (TACACS+)。以下是这两种协议的简短比较（他们在这本书的其他章节中，有更详细的介绍）。

### RADIUS

- 开放的标准协议
- 将 UDP 端口 1812 用于身份验证和授权，UDP 端口 1813 用于计费
- 身份验证和授权相结合
- 口令加密；其他信息未加密
- 主要用于网络访问控制（比如 Dot1x 或 MAC 的身份验证绕过等）

### TACACS+

- 一种由思科开发的协议
- 使用 TCP 端口 49
- 身份验证、授权及计费分离
- 所有 AAA 的数据包都被加密
- 主要用于管理设备的管理访问

### HTTP/HTTPS

HTTP/HTTPS 是用于经由 web 浏览器，访问图形用户界面 (GUI) 的协议。这种访问方式，在 CCNA 考试大纲中特别提到过。

在自主（自治）架构下，GUI 通过自主接入点的管理 VLAN/管理端口访问。

![到自主 AP 的 HTTP/HTTPS 管理员访问](../images/http_https_management_access.png)

**图 14.52** -- **到自主 AP 的 HTTP/HTTPS 管理员访问**

在分离 MAC 架构下，GUI 则是通过 WLC 的管理 VLAN/管理端口访问的。


**图 14.53** -- **到 WLC 的 HTTP/HTTPS 管理访问**

### Telnet/SSH/控制台


其是个用于配置和管理的命令行用户界面。

在自主接入点架构下，CLI 是通过自主接入点的管理 VLAN/管理端口，使用 SSH 或 telnet 访问的。控制台端口也可用于通过控制台线，访问命令行界面。


![到自主架构中 AP 的 Telnet/SSH/控制台访问](../images/console_access_to_autonomous_ap.png)

**图 14.54** -- **到自主架构中 AP 的 Telnet/SSH/控制台访问**

在分离 MAC 架构下，CLI 是通过 WLC 的管理 VLAN/管理端口，使用 SSH 或 telnet 访问的（译注：原文这里有拼写错误）。控制台端口则可通过控制台线，从 WLC 及轻量级 AP 的控制台命令行界面访问。


![到 WLC 的 Telnet/SSH/控制台访问](../images/console_access_to_wlc.png)

**图 14.55** -- **到 WLC 的 Telnet/SSH/控制台访问**


> *知识点*：
>
> - AP and WLC management access
>
> - authentication, authorization, and accounting, AAA
>
> + AAA server manages two primary functions:
>   - access to network for wireless clients
>   - access to device administration
>
> + in Autonomous Architecture, AAA can be configured in the following places:
>   - AAA user configuration can be done on the Access Point
>   - AAA server configuration can be requested from external providers such as Identity Engine Secure, ISE, or Access Control System, ACS, and Identity and Access Management, IAM
>
> + in Split MAC Architecture, AAA can be configured in the follwing places:
>   - AAA user configuration can be done on the WLC
>   - AAA server configuration can be requested from external providers such as ISE, ACS or IAM
>
> + two major protocols used for AAA(plus one new):
>   - Remote Access Dial-In User Service, RADIUS
>   - Terminal Access Controller Access Control System, TACACS+
>   - Identity and Access Management, IAM
>
> + RADIUS characteritics:
>   - open standard protocol
>   - Use UDP port 1812 for authentication and authorization, and UDP port 1813 for accounting
>   - Authentication and Authorization combined
>   - Passwords encrypted; other information not encrypted
>   - Used primarily for Network Access Control(such as dot1x or MAC authentication bypass)
>
> + TACACS+
>   - a protocol developed by Cisco
>   - Uses TCP port 49
>   - Authentication, Authorization, and Accounting separated
>   - All AAA packets encrypted
>   - Used primarily to manage device administration access
>
> + HTTP/HTTPS
>   - the protocol used for accessing graphical user interface(GUI) via a web browser
>   - In Autonomous Architecture, is accessed through the management VLAN/management port of the autonomous AP
>   - In Split MAC Architecture, is accessed through the management VLAN/management port of the WLC
>
> + Telnet/SSH/Console
>   - a command line user interface, used for configuration and management
>   - In Autonomous AP Architecture, is accessed through the management VLAN/management port of the autonomous AP, using SSH or telnet
>   - In Split MAC Architecture, the CLI is accessed thrp the management VLAN/management port of the WLC, by using SSH or telnet
>   - a console port is also available to access the CLI interface, by using a console cable

## 无线的安全协议


在 CCNA 考试中，咱们需要熟悉无线安全协议，以及哪些验证方式与哪些加密算法兼容。

咱们可能已经听说过 Wi-Fi 联盟，或在咱们的无线路由器上看到过他们的标志。

![Wi-Fi 联盟的徽标](../images/wi-fi_alliance_logo.png)


**图 14.56** -- **Wi-Fi 联盟的徽标**


Wi-Fi 联盟是个推广 Wi-Fi 技术，以及认证 Wi-Fi 产品是否符合一些互操作性标准的非营利性组织。由于认证过程成本高昂，并非所有制造商都认证过。Wi-Fi 联盟业已开发出用于无线网络的一些安全协议。目前有三种不同版本：WPA、WPA2 与 WPA3。这些协议是由这个联盟，针对研究人员在先前的有线等效保密（WEP）系统中，发现的一些严重弱点而定义的。

无线产品在一些授权的测试实验室里，根据一系列代表了某项标准授权实现的严格条件加以测试。因此，只要 Wi-Fi 联盟认证了同一 WPA 版本的某种无线客户端设备、接入点及其相关的 WLC，他们便应兼容，并应提供同样的安全组件。

## WEP

值得一提的是有线等效保密（WEP），其为 1997 年为无线网络开发的最初加密协议。正如咱们名字可能已看出的，他旨在提供与有线网络同样的安全级别。WEP 的安全性很快就被破解了，众所周知，他存在许多知名的安全漏洞。处于这一原因，即使咱们看到其作为一个选项，咱们也绝不要在网络中使用他。

## WPA

为了解决 WEP 下发现的那些严重弱点，Wi-Fi 联盟推出了其第一代的 WPA 认证。大多数 WPA 实现都将预共享密钥（PSK），称为 WPA 个人密钥，及时态密钥完整性协议（TKIP）用于加密。WPA 部分基于 802.11i，同时其包括了 802.1x 的身份验证（我们稍后会介绍这点）。


## WPA2

WPA2 包含了对 CCMP -- 一种基于 AES 的加密模式 -- 的强制支持。由于 TKIP 已被弃用，WPA2 便基于更优越的 AES CCMP 算法。显而易见，WPA2 属于 WPA 的替代品。WPA2 支持，是任何贴有 Wi-Fi 商标设备的最低要求。

## WPA3

WPA3 将数项重要而卓越安全升级，添加到了 WPA2。一项此类升级，便是带有伽罗瓦/计数器模式协议（GCMP）的更强大 AES 加密。他在 WPA3-企业模式下，提供 192 位加密强度。而受保护管理数据帧 (PMF)，被用于对接入点和客户端之间的管理数据帧安全加固，防止黑客攻击。

## EAP

可扩展身份验证协议（EAP），是一种用于验证无线流量的传输协议。EAP 扩展了数种类型的验证，其中最常见的如下：

- PSK
- TLS
- MSCHAPv2
- IKEv2
- PEAP（使用 TLS 封装流量，解决 EAP 的安全问题）

## PEAP

虽然 EAP 是种优秀协议，并达到了其作为一种认证协议的目的，但在假定使用 EAP 的某种受物理保护的通信信道中，一些问题出现了。受保护的可扩展身份验证协议（PEAP），会使用 TLS 封装 EAP 的流量，而 EAP 流量本身已被加密和身份验证过。

PEAP-MSCHAPv2（微软挑战握手协议），是 PEAP 的最常见类型，也是大多数人提到 PEAP 时所指的类型。PEAP-MSCHAPv2 是最常用到的、最受支持的协议之一，因为他被用于提供点对点的身份验证。

PEAP-TLS (PEAP-EAP-TLS) 需要证书，因此需要某种 PKI 的基础设施运行。这可以某种包括智能卡在内的多因素身份验证过程予以提供，其会提升安全性。

## LEAP

轻量级的可扩展身份验证协议（LEAP），是由思科开发的一种无线身份验证协议，提供了动态的 WEP 密钥，这通过用户每次重新验证 WAP 时提供新的密钥，提升了安全性。LEAP 也可在动态 WEP 密钥处，将 TKIP 用于加密与安全。由于 LEAP 的 MS-CHAP（微软挑战握手协议）实现，其很容易被黑客攻击已广为人知。

## MAC 过滤

每张网卡都有其自己的 MAC 地址，其识别了该具体网卡本身，进而识别该计算机的物理地址。在诸如交换机的网络设备上实施 MAC 过滤，有助于确保用户在通过身份验证过的设备上对网络的访问。请记住，用户不会被列出或验证，而是设备本身会，因此全部认证过设备的 MAC 地址，都必须列出。

## SSID 广播

当咱们配置咱们的 WAP 时，他将开始其 SSID 广播。所谓 SSID（服务集标识符）广播，即该无线网络的名字，也是相应网络配置的标识符。为了连接到某个无线网络，咱们必须执行以下两种操作之一：

- 能够在咱们的无线天线上，接收到 SSID

    或

- 知道无线 SSID 并将其输入


当网络的 SSID 已被隐藏时，那么上述第二个选项就是必要的。咱们可隐藏网络的 SSID，以防随意窃取（未经授权的网络访问）。通常，网络的名字标识了其位置，以及在哪里其可以最强信号访问，例如 “休息室”、“生产区 1 ” 等。

## TKIP

临时密钥完整性协议（TKIP），是一种专门用于 WPA 无线网络的加密协议。他是在 WEP 因滥用 RC4 流式密码，而被证明是一项薄弱的标准后引入的。他可以很容易地部署到目前支持 WEP 的大多数设备上。


TKIP 也使用了 RC4 密码，但相比其中把 IV 附加到密钥上的 WEP 简单加法函数，TKIP 很好地结合了根密钥与初始化向量 (IV)。这一知识使黑入侵 WEP 相当简单，进而以 WPA 与 TKIP 形式，进行了必要改进。


## CCMP

WPA 将 TKIP 用于加密，并假定两个节点之间的物理安全是有保证的。但是，当其中物理安全并非确定、链路可能被破坏的情形出现时，TKIP 就不够安全了。CCMP（带密码块链的计数器模式报文验证码协议，或称 CCM 模式协议），通过封装流量并使用 AES 128 位加密方式（一种非常强的加密类型）对其加密，改进了 TKIP。CCMP 是 WPA2 无线网络所必需的。


> *知识点*：
>
> - wireless security protocols
>
> - authentication methods
>
> - encryption algorithms
>
> - the Wi-Fi Alliance, a non-profit organization that promotes Wi-Fi techonoloy and certifies Wi-Fi products to comply with certain interoperability standards
>
> - three different versions to date: WPA, WPA2 and WPA3
>
> - Wired Equivalent Privacy, WEP, the original encryption protocol developed for wireless networks in 1997, to provide the same level of security as wired network.
>
> - Wi-Fi Protected Access, WPA, Wi-Fi Alliance introduced its first-generation WPA certification in order to address serious weakness found in WEP. Most WPA implementations use a pre-shared key, PSK, refered to as WPA Personal, and Temporal Key Integrity Protocol, TKIP for encryption. WPA was in part based on 802.11i, included 802.1x authentication.
>
> - WPA2 includes mandatory support for CCMP, an AES-based encryption mode. WPA2 is based around the superior AES CCMP algorithms, because TKIP was depreciated. WPA2 was meant as a replacement for WPA. WPA2 is the minimum requirement for any device bearing the Wi-Fi trademark.
>
> - WPA3, added several important and superior security updates to WPA2. One upgrade is stronger encryption by AES with the Galois/Counter Mode Protocol, GCMP. WPA3 offers 192-bit cryptographic strength in WPA3-Enterprise mode. Protected Management Frames, PMF, are used to secure management frames between the AP and client, to prevent hackers.
>
> + Extensible Authentication Protocol, EAP, is a transport protocol used for authenticating wireless traffic. EAP extends several types of authentication, the most common of which are as follows:
>   - PSK
>   - TLS
>   - MSCHAPv2
>   - MSCHAPv2
>   - IKEv2
>   - PEAP, encapsulates traffic using TLS to address securip issues with EAP
>
> - Protected Extensible Authentication Protocol, PEAP, encapsulates EAP traffic using TLS, which is encrypted and authenticated itself.
>
> - PEAP-MSCHAPv2, Microsoft Chanllenge Handshake Protocol, is the most common type of PEAP, and is what most people refer to when speaking of PEAP, used to provide peer-to-peer authentication.
>
> - PEAP-TLS, or PEAP-EAP-TLS, requires certificates, a PKI infrastructure to operate, which can be provided for with a multifactor authentication process
>
> - Lightweight Extensible Authentication Protocol, LEAP, is a wireless authentication protocol developed by Cisco, provides dynamic WEP keys, increases security by providing a new key every time the user reauthenticates to the WAP, can use TKIP for encryption and security as well, in place of dynamic WEP keys, known to be easily hackable, due to its implementation of MS-CHAP, Microsoft Chanllenge Handshake Protocol.
>
> - Temporal Key Integrity Protocol, TKIP, is an encryption protocol used specifically with WPA wireless networks, introduced after WEP was proven to be a weak standard with its misuse of the RC4 stream cipher, can be readily deployed to most equipment that currently supports WEP, uses the RC4 cipher as well, but properly combines the secret root key, and the initialization vector, IV, rather than WEP's simplistic additive function, where the IV is appended to the key. This knowledge makes it simple to hack WEP and thus made an improvement in the form of WPA and TKIP necessary.
>
> - Counter Mode with Cipher Block Chaining Message Authentication Code Protocol, CCMP, or CCM Mode Protocol, improves upon TKIP, by encapsulating traffic and encrypting it using AES 128-bit encryption -- a very strong encryption type. CCMP is required for WPA2 wireless networks.




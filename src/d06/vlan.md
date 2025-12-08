# 虚拟局域网

正如咱们已经看到的，交换机会打破冲突域。更进一步，路由器会打破广播域，这意味着网络会看起来像下图一样。

!["路由器隔离广播域"](../images/0213.png)

**图 6.13** -- **路由器分离广播域**

在我们继续前，我们来讨论一下局域网到底为何。局域网本质上是个广播域。在图 6.13 中所示的网络中，当 PC-A 发送一个广播数据包时，其将被 PC-B 接收，但不会被 PC-C 或 PC-D 接收。这是因为其中的路由器，打破了广播域。现在，咱们可使用虚拟局域网 (VLAN) ，将交换机端口置于不同广播域中，如下图所示。

!["VLAN 下的广播域"](../images/0214.png)

**图 6.14** -- **VLAN 下的广播域**

在图 6.14 中，该二层网络已通过使用 VLAN，被划分为两个广播域。现在，由 PC-A 发送的某个广播数据包，将被 PC-B 接收，而不会被 PC-C 和 PC-D 接收。在没有 VLAN 下，PC-C 和 PC-D 都会收到由 PC-A 发送的广播。以下是 VLAN 的一些优点：
- 将广播限制在较小的设备组内，将是网络更快；
- 由于设备处理更少广播，因此节省了设备资源；
- 通过将某个组（或功能）中的设备，保持于一个单独广播域中，从而增加了安全性。这里所指的组，可以指部门、安全级别等。例如，属于开发或测试实验室的设备，应与生产设备分开；
- 跨越地理位置，以任何规模扩展网络的灵活性。例如，某台 PC 在大楼中的何处并不重要。他会认为自己与配置在同一 VLAN 中的任何其他 PC一样，处于同一网段。在下图 6.15 中，`VLAN 1` 中的所有主机，都可以相互通信，即使他们位于不同楼层。对他们来说，VLAN 是透明或不可见的。

!["VLANs 消除局域网的物理边界"](../images/0215.png)

<a name="f-6.15"></a>
**图 6.15** -- **VLAN 移除了局域网的物理边界**

## VLAN 标记

虽然各家厂商使用了各自方法创建 VLAN，因此多厂商的 VLAN 必须谨慎处理，以解决互操作性问题。例如，思科就开发了通过添加一个新的 26 字节头部和一个新的 4 字节尾部，封装原始数据帧的 ISL 标准，如下图 6.16 所示。为解决不兼容问题，IEEE 开发了一种与供应商无关的，创建可互操作 VLAN 的方法 [802.1Q](https://en.wikipedia.org/wiki/IEEE_802.1Q)。

!["ISL 的标记方式"](../images/0216.png)

**图 6.16** -- **ISL 标记方法**

802.1Q 通常被称为数据帧打标签，因为他会将一个称为 “标签” 的 32 位头部，插入原始数据帧的源地址字段后，而不修改其他字段。源地址字段后的 2 个字节，包含了一个注册的以太网类型值 `0x8100`，这表示该数据帧，包含了个 802.1Q 的头部。接下来的 3 个比特位，表示 802.1P 的用户优先级字段，并在服务质量（QoS）技术中，用作服务等级（CoS）的比特位。下一个子字段是个 1 位的规范格式指示符，然后是 VLAN ID（12 位）。在使用 802.1Q 时，这给到我们总共 4096 个 VLAN。

> *知识点*：
>
> - the Source Address field
>
> - a registered Ethernet type value of `0x8100`
>
> - the 802.1P User Priority field
>
> - Quality of Service, QoS
>
> - Class of Service, CoS
>
> - a 1-bit Canonical Format Indicator

!["`802.1Q` 的标记方式"](../images/0217.png)


**图 6.17** -- **802.1Q 标记方法**

承载来自多个 VLAN 数据的端口，被称为中继。他既可以使用 ISL 协议，也可使用 802.1Q 协议。802.1Q 世界中的一个特殊概念，是 “原生 VLAN”。这是一种其中的数据帧不会被打标签的特殊 VLAN 类型。原生 VLAN 的目的，是允许交换机在某个接口上，使用 802.1Q 的中继（单个链路上的多个 VLAN），而当别的设备不支持中继，那么原生 VLAN 的流量，仍会经由该链路发送。当交换机接收到某条中继链路上的任何未打标签流量时，他将认为其目的地是原生 VLAN。Cisco 使用 `VLAN 1` 作为默认的原生 VLAN。

## VLAN 成员资格


将端口与 VLAN 关联有两种常见方式 -- 静态或动态。

在静态的 VLAN 分配或配置下，交换机上的端口会被网络管理员，配置为在不同 VLAN 下，然后相关设备会被连接到端口。当用户需要搬到大楼的另一部分时，这将需要管理员修改交换机上的配置。默认情况下，所有交换机端口都属于 `VLAN 1`。

而所谓动态的 VLAN 分配，允许设备根据设备的 MAC 地址（*译注*：也可运用 `dot1x` 协议而根据设备证书，参见：[交换机 dot1x 认证端口动态指定 VLAN 配置](../22_dot1x_port_dynamic_vlan.md)），加入某个特定 VLAN。这种方式给到管理员，允许用户连接到任何交换机，或在大楼内移动，而不必更改交换机上配置的灵活性。这是通过使用 VLAN 管理策略服务器 (VMPS) <sup>1</sup> 实现的。


> **FARAI 有言**： “端口会被分配给 VLAN，而设备则会连接到端口”。

请注意，由于每个 VLAN 都是个不同的广播域，这意味着：

- 默认情况下，一个 VLAN 中的主机无法连接到另一 VLAN 中的主机
- 对于 VLAN 之间的通信，一个三层设备是必要的（这将在稍后介绍）
- 每个 VLAN 都需要其自己的子网，例如，`VLAN 1` -- `192.168.1.0/24`、`VLAN 2` -- `192.168.2.0/24`
- 某个 VLAN 中的所有主机，都应属于同一个子网

## VLAN 链路

我们知道，一台交换机有着连接到多个 VLAN 的一些主机。但是，当流量从一台主机前往另一主机时，会发生什么呢？例如，在上面的 [图 6.15](#f-6.15) 中，当 1 楼的 `VLAN 1` 中的主机，试图连接 2 楼 `VLAN 1` 中主机时，2 楼的交换机，将怎样知道该流量属于哪个 VLAN 呢？

我们现在已经知道，交换机会使用一种称为 VLAN 标记，或 “数据帧打标签” 的机制，保持流量在不同 VLAN 上分离。交换机会在帧上添加一个包含 VLAN ID 的头部。在 [图 6.15](#f-6.15) 中，1 楼的交换机将把源自 VLAN 2 的流量打上标签，并将其传递给交换机 2，交换机 2 将看到该标签，就会知道该流量需要保持在那个 VLAN 内。此类打上标签的流量，只能在称为中继链路的特殊链路上流动。`VLAN 1` 通常会被指定为原生 VLAN，而原生 VLAN 上的流量不会被打标签。稍后我们将详细介绍原生 VLAN。

交换机端口（CCNA 考试范围内）可被分为以下几种：

- 接入链路或端口
- 中继链路或端口
- 动态端口（这将很快讨论）


### 接入链路

被定义为接入链路的交换机端口，只能是一个 VLAN 的成员。连接到接入链路的设备，不关心任何其他 VLAN 的存在。当某个数据帧从主机进入接入链路时，交换机将把一个标签添加到该数据帧，而当某个数据帧离开交换机接入链路前往主机时，交换机则会移除该标签。接入链路被用于连接主机，且他们还可用于连接路由器。中继链路将在接下来的小节介绍。

### 中继

交换机端口通常将连接到网络上的主机，或另一网络交换机、路由器或服务器。在这种情况下，那么链路就可能需要承载来自多个 VLAN 的流量。为了完成这一目的，每个数据帧都需要识别，其来自哪个 VLAN。这种识别方法，被称为数据帧打标签，除原生 VLAN 外，所有帧数据在通过中继链路前，都会被打上标签。数据帧中的标签，包含了 VLAN ID。当数据帧到达目的主机所在交换机时，标签就会被移除。



!["VLAN 标记法"](../images/0218.png)

**图 6.18** -- **VLAN 打标签**

VLAN 中继用于承载来自多个 VLAN 的数据。要区分一个 VLAN 的数据帧和另一 VLAN 的数据帧，所有通过中继链路发送的数据帧，都会被特别打上标签，从而目的交换机知道，数据帧属于哪个 VLAN。ISL 和 802.1Q 是我们前面简要提到的两种主要封装方法。他们可用于确保穿越某个交换机中继链路的那些 VLAN，能够被唯一地识别出来。

ISL 是思科专有的；不过，CCNA 考试中测试的型号为 2960 交换机，其只能识别 802.1Q。为了完整起见，以及以防万一，我们在此涉及了 ISL，咱们必须配置某个较旧的交换机型号。

> **FARAI 有言**：“现在所有新的交换机，都默认为 802.1Q。ISL 正被弃用。”

802.1Q 与 ISL 有几处不同。第一个显著区别是，802.1Q 支持多达 4096 个 VLAN，而 ISL 则只支持 1000 个 VLAN。另一显著区别，是 802.1Q 中使用的原生 VLAN 概念。默认情况下，在使用 802.1Q 时，所有 VLAN 的所有数据帧都会被打上标签。这一规则的唯一例外，是那些属于原生 VLAN 的数据帧，这些数据帧不会被打标签。

不过，请记住，通过某 VLAN 为某个特定中继链路上的原生 VLAN，而指定该 VLAN 的数据帧将不被打上标签是可行的。例如，要防止在使用 802.1Q 时，对 `VLAN 400` 中的数据帧打标签，咱们可将该 VLAN 配置为某个特定中继链路上的原生 VLAN。IEEE 802.1Q 的原生 VLAN 配置，将在稍后详细介绍。

下面总结了 802.1Q 的一些特性：

- 支持多达 4096 个 VLAN
- 使用了一种内部的打标签机制，而修改原始数据帧
- 一种由 IEEE 制定的开放标准协议
- 不会标记原生 VLAN 上的数据帧；单全部其他数据帧都会被打上标签

下面是一个交换机的简短示例配置。我（作者）已包含了要求交换机作为二层交换端口，而非三层接口的 `switchport` 命令。这条命令应在比如 3660 交换机的多层交换机上添加。


```console
Sw(config)#interface FastEthernet 0/1
Sw(config-if)#switchport
Sw(config-if)#switchport mode trunk
Sw(config-if)#switchport trunk encapsulation dot1q
Sw(config-if)#exit
```

当然，在 2960 交换机上，`encapsulation` 这条命令不会被识别，因为只有一种类型（802.1Q）可用。当连接另一台交换机时，咱们将需要将连接接口设置为中继接口，以允许那些 VLAN 得以打上标签。`switchport` 命令也是如此。我（作者）再次说明这一点，因为在现实世界中，咱们很可能必须要配置三层交换机，而若我们严格按照 2960 型号，那么咱们会感到困惑，这是我们不希望的！

交换机上的中继链路，可能处于五种可能模式之一：

- `on` -- 这种模式会强制该端口进入永久中继模式。该端口会成为一个中继端口，即使所连接设备未同意将链路转换为一个中继链路；
- `off` -- 即使所连接设备被设置为 `trunk` 模式，该链路也不用作中继链路；
- `auto` -- 该端口愿意成为中继链路。当另一设备被设置为 `on` 或 `desirable` 模式时，则该链路会成为中继链路。而当双方都被设置为 `auto` 模式时，那么链路将永不会成为中继链路，因为双方都不会尝试转换；
- `desirable` -- 端口主动尝试转换为中继链路。当另一设备设置为 `on`、`auto` 或 `desirable`，则链路将成为中继链路。
- `no-negotiate` - 该模式会阻止端口协商中继连接。端口将根据配置，强制进入 `access` 或 `trunk` 模式。


## 配置 VLAN

现在咱们掌握了 VLAN 和中继链路，我们来配置下图 6.19 中所示的网络。咱们将需要配置交换机，使 `fa0/1` 端口上的主机位于 `VLAN 5` 中，并使 `fa0/15` 端口上的链路为一条中继链路。


![“测试网络”](../images/0219.png)

**图 6.19** -- **测试网络**


在将端口指派到 VLAN 前，VLAN 本身必须使用 `vlan <vlan#>` 全局配置命令创建出来。这条命令将把咱们带入 VLAN 配置模式，其下一个描述性名字可被提供给 VLAN（若咱们希望）。下面是个示例：

```console
Switch1(config)#vlan 5
Switch1(config-vlan)#name RnD
```

```console
Switch2(config)vlan 5
Switch2(config-vlan)#name RnD
```

要查看交换机上存在哪些 VLAN，就要使用 `show vlan` 命令。输出将类似于下面这个输出：

```console
Switch1#show vlan
VLAN    Name        Status      Ports
----    --------    -------     --------------------------------------------
1       default     active      Fa0/1, Fa0/2, Fa0/3, Fa0/4 Fa0/5, Fa0/6, Fa0/7, Fa0/8 Fa0/9,
                                Fa0/10, Fa0/11, Fa0/12, Fa0/13 Fa0/14, Fa/15, Fa0/16, Fa0/17, Fa0/18
...
[Truncated Output]

...
5       RnD         active
...
[Truncated Output]
```

我们来使用 `switchport access vlan [vlan#]` 这条接口配置命令，将端口 `fa0/1` 指派给 `VLAN 5`。



```console
Switch1(config)#int fa0/1
Switch1(config-if)#switchport access vlan 5
```

```console
Switch2(config)#int fa0/1

Switch2(config-if)#switchport access vlan 5
```

在诸如 3560 交换机的具有三层能力的交换机上，在将端口放入某个 VLAN 前，我们必须以 `switchport mode access` 命令，手动将该端口设置为接入端口。现在我们来看看 `show vlan` 命令的输出。


```console
Switch1#show vlan
VLAN    Name        Status      Ports
----    ----        -----       --------------------------------------------
1       default     active      Fa0/2, Fa0/3, Fa0/4, Fa0/5, Fa0/6, Fa0/7,
                                Fa0/8, Fa0/9, Fa0/10, Fa0/11, Fa0/12, Fa0/13,
                                Fa0/14, Fa/15, Fa0/16, Fa0/17, Fa0/18
...
[Truncated Output]

...
5       RnD         active      Fa0/1
...
[Truncated Output]
```

注意 `fa0/1` 现在已被分配给 `VLAN 5`。咱们来将两台交换机上的接口 `fa0/15`，同时配置为中继链路。这里需要注意的是，（3550 型）交换机端口上的默认模式，是 `desirable`（在 3560 型号上其为 `auto`，因此请查看咱们的平台说明）。动态中继协议（DTP）将使两台交换机上的 `fa0/15`，成为 ISL 的中继链路。我们将在下一课中介绍 DTP，但我（作者）想要在这里简单提一下。这可使用 `show interface trunk` 命令验证：

```console
Switch1#show interface trunk
Port    Mode        Encapsulation   Status      Native vlan
Fa0/15  desirable   n-isl           trunking    1
```

请注意，其中模式为 `desirable`，封装为 ISL（`n` 代表协商的）。

下面的输出显示了如何将中继配置为使用 ISL 的中继：


```console
Switch1(config)#interface fa0/15
Switch1(config-if)#switchport trunk encapsulation isl
Switch1(config-if)#switchport mode trunk
```

```console
Switch2(config)#interface fa0/15
Switch2(config-if)#switchport trunk encapsulation isl
Switch2(config-if)#switchport mode trunk
```

`switchport trunk encapsulation` 这条命令，设置了端口上的中继协议，`switchport mode trunk` 命令会将端口设置为中继终端。`show interface trunk` 命令的输出，将看起来像下面这样。

```console
Switch2#show interface trunk
Port    Mode    Encapsulation   Status      Native vlan
Fa0/15  on      isl             trunking    1
```

请注意，封装现在 `isl` 而不是 `n-isl` 了。这是因为这次协议不再是协商的，而是在接口上配置的了。

**重要提示**：在将交换机端口设置为中继模式前，中继封装需要在其上配置好。请注意，这不适用于 2960 型交换机（目前用于 CCNA 教学大纲的型号），他只能使用 `dot1q`（802.1Q 的另一名称）封装。出于这一原因，`switchport trunk encapsulation` 这条命令在 2960 型交换机上将不起作用。

同样，咱们也可将交换机端口配置为使用 802.1Q 而不是 ISL，如下输出中所示。


```console
Switch1(config)#interface fa0/15
Switch1(config-if)#switchport trunk encapsulation dot1q
Switch1(config-if)#switchport mode trunk
```

```console
Switch2(config)#interface fa0/15
Switch2(config-if)#switchport trunk encapsulation dot1q
Switch2(config-if)#switchport mode trunk
```

`show interface trunk` 命令的输出现在看起来像这样：

```console
Switch2#show interface trunk

Port    Mode    Encapsulation   Status      Native vlan
Fa0/15  on      802.1q          trunking    1
```

注意，原生 VLAN 为 `VLAN 1`。这是 802.1Q 中继上的默认原生 VLAN，而其可使用 `switchport trunk native vlan <vlan#>` 命令更改。中继上两个端口的原生 VLAN 必须匹配。该命令是 CCNA 考试大纲的一部分，并被视为一项安全措施。

**重要提示**：交换机会记住所有 VLAN 信息，即使重新加载后也是如此。当咱们想要咱们的交换机以空白配置启动，那么咱们将需要在咱们的交换机上，执行 `delete vlan.dat` 命令，如下输出中所示。这一操作只适用实物交换机，而不适用于诸如 Packet Tracer 等交换机模拟器。


```console
SwitchA#dir flash:
Directory of flash:/

    1   -rw-    3058048     <no date>   c2960-i6q4l2-mz.121-22.EA4.bin
    2   -rw-    676         <no date>   vlan.dat

64016384 bytes total (60957660 bytes free)
SwitchA#
SwitchA#delete vlan.dat
Delete filename [vlan.dat]?
Delete flash:/vlan.dat? [confirm]

SwitchA#dir flash:
Directory of flash:/

    1   -rw-    3058048         <no date>   c2960-i6q4l2-mz.121-22.EA4.bin

64016384 bytes total (60958336 bytes free)
SwitchA#
```



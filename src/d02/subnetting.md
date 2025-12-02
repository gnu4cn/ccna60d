# 子网划分


子网划分允许咱们借用 IP 地址中，传统上用于网络主机的那些二进制位。现在，咱们可从咱们的较大网络空间，划分出一些较小网络，这些较小的网络被称为子网，或简称 subnet。

当咱们将默认的子网掩码，应用到三个可用地址类别时，咱们将看到，地址中咱们不能用于划分子网的那些部分（八位组），如下面的图表中所示：


<table>
<tr>
<td>A-255</td><td>0</td><td>0</td><td>0</td>
</tr>
<tr>
<td style="background-color: gray;">不能使用</td><td>可以使用</td><td>可以使用</td><td>可以使用</td>
</tr>
<tr>
<td>B-255</td><td>255</td><td>0</td><td>0</td>
</tr>
<tr>
<td style="background-color: gray;">不能使用</td>
<td style="background-color: gray;">不能使用</td><td>可以使用</td><td>可以使用</td>
</tr>
<tr>
<td>C-255</td><td>255</td><td>255</td><td>0</td>
</tr>
<tr>
<td style="background-color: gray;">不能使用</td>
<td style="background-color: gray;">不能使用</td>
<td style="background-color: gray;">不能使用</td><td>可以使用</td>
</tr>
</table>

例如，当咱们以默认子网掩码使用某个 C 类网络时，

<table>
<tr>
<th>IP 地址</th>
<td>192</td><td>168</td><td>1</td><td>0</td>
</tr>
<tr>
<th>子网掩码</th>
<td>255</td><td>255</td><td>255</td><td>0</td>
</tr>
<tr>
<th>二进制形式</th>
<td>11111111</td><td>11111111</td><td>11111111</td><td>00000000</td>
</tr>
</table>

而借用了最后一个八位组的部分可用主机位时，


<table>
<tr>
<th>IP 地址</th>
<td>192</td><td>168</td><td>1</td><td>0</td>
</tr>
<tr>
<th>子网掩码</th>
<td>255</td><td>255</td><td>255</td><td>192</td>
</tr>
<tr>
<th>二进制形式</th>
<td>11111111</td><td>11111111</td><td>11111111</td><td><u>00</u>000000</td>
</tr>
</table>

咱们就会得到最后八位组上的两个借用位。这会给到咱们以下子网，每个子网有 62 台主机：


| 网络 | 网络 | 网络 | 子网 | 主机 | 广播地址 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 192 | 168 | 1 | 0 | 1-62 | 63 |
| 192 | 168 | 1 | 64 | 65-126 | 127 |
| 192 | 168 | 1 | 128 | 129-190 | 191 |
| 192 | 168 | 1 | 192 | 193-254 | 255 |


在某个较大网络下，咱们可能已经使用了主机编号 1 至 254，因此这里咱们可用的主机编号就较少，但代价便是更多的网络。下图显示了这四个子网是如何确定出的：

<table>
<tr>
<td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
<th>子网</th>
</tr>
<tr>
<td style="background-color: gray;">0</td>
<td style="background-color: gray;">0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>0</th>
</tr>
<tr>
<td style="background-color: gray;">0</td>
<td style="background-color: gray;">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>64</th>
</tr>
<tr>
<td style="background-color: gray;">1</td>
<td style="background-color: gray;">0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>128</th>
</tr>
<tr>
<td style="background-color: gray;">1</td>
<td style="background-color: gray;">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>192</th>
</tr>
</table>

在深入了解二进制算术时，咱们就能看到，使用主机地址的前两位，就让咱们使用 `00`、`01`、`10` 和 `11` 的二进制组合，而将这些二进制组合全写出来，就像咱们在子网列中看到的那样，就给到了咱们子网 0、64、128 和 192。为了进一步说明这一点，灰色的前两列，是子网编号，其余六列则属于是每个子网上主机用途。

若咱们现在感到头晕目眩，这很正常。恐怕需要一段时间才能最终明白这一切。


## 轻松划分子网

到了考试日，或者在实际网络中排除某个子网划分问题时，咱们将希望快速准确地找到答案。基于这些原因，我（作者）设计了一种简单的子网划分方法，这就是我的亚马逊 Kindle 电子书《子网划分秘笈》的主题。老实说，咱们不需要读这本书，因为我在这本书中涵盖了咱们需要知道的内容。

我（作者）创建的一个非常有用的资源是 [subnetting.org](https://www.subnetting.org/)，其给到咱们解决围绕子网划分与网络设计的一些免费挑战问题。


## 无类域间路由


无类域间路由（CIDR）是由互联网工程任务组创建的一种，分配 IP 地址块与路由 IP 数据包的方法。我们在这里要研究的 CIDR 的主要特点，是使用斜线的地址记法，表示子网掩码。这一点很重要，因为他可以节省时间，在现实世界中被用到，而当这还不够时，咱们将被问到涉及 CIDR 地址的一些考试问题。

在 CIDR 下，不再是使用完整的子网掩码，咱们会写下用到的二进制位数。例如，对于 255.255.0.0，用到了两组 8 位二进制位，因此这会以 `/16` 表示。而对于 255.255.240.0，则用到了 8 + 8 + 4 位，会给到咱们 `/20`。

当咱们在网络互联语境下，提到子网掩码或网络掩码时，咱们就会对同事说 “斜线 16” 或 “斜线 20”，他们就会知道咱们指的是 CIDR 掩码。


## 子网划分秘笈


我（作者）将为咱们省去数周的子网划分挫折。我的子网划分秘笈，已被全世界成千上万的 CCNA 和 CCNP 学员，用于通过考试，以及在网络角色技术面试中取得优异成绩。


我（作者）是认真的。几年前，我（作者）在学习 CCNA 时，偶然发现了这种简单方法，在此之前，学员们不得不以二进制形式写出网络地址，或者为得到正确答案，要经历痛苦的计算。


为了写出这种子网划分秘笈，咱们需要一支笔和一张纸。咱们需要能够凭记忆写出他，因为在咱们的考试中，咱们将得到一块用于计算出答案的白板。咱们也可在任何技术面试中使用纸笔。

在纸的右上方写上数字 1，然后在左边将其加倍为 2，然后是 4，然后是 8，一直加倍到 128。下面是个二进制的八位组：

<table>
<tr>
<td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
</table>


在 128 下及往下，要写出当咱们在第一个格子（128 的格子）中打勾时，会得到的那个数字。接下来便是当咱们在下一格子（64）、下一格子（32）、下一个格子（16）中分别打钩时，将得到的数字，依次类推，直到打满八个格子为止：


<table>
<tr><td>128</td></tr>
<tr><td>192</td></tr>
<tr><td>224</td></tr>
<tr><td>240</td></tr>
<tr><td>248</td></tr>
<tr><td>252</td></tr>
<tr><td>254</td></tr>
<tr><td>255</td></tr>
</table>


当咱们把这两部分放在一起时，咱们将得到子网划分秘笈的上半部分：

<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>

顶部的行表示咱们子网的增量，左侧的列表示咱们子网的掩码。使用这部分图表，咱们便可在几秒内回答任何子网问题。当咱们打算添加告诉咱们，如何回答任何设计问题的图表部分，如 “子网掩码 X” 将给到咱们多少个子网与主机” 时，只需添加一个 “2 的幂次” 部分。

其中一列将是 “二的幂次”，另一列将是 “二的幂次减二”。减二的是为覆盖咱们不能用到的两个地址，即子网（subnetwork）和该子网的广播地址。为了回答问题，咱们要以数字 2 开始，并按所需次数将其翻倍。


<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr style="background-color: gray;">
<td></td><td>子网数</td><td>主机数 -2</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>8</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>16</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>32</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>64</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>


以直接进入一个考试样的问题，咱们可能学得最好：

主机 `192.168.100.100/26` 是在哪个子网中？


咱们知道这是个 C 类地址，默认掩码是 24 个二进制位或 `255.255.255.0`。咱们可以看到，这里不是 24 位，而是 26 位，因此有 2 位被借用于构造子网。只需写下咱们的子网划分秘图，并勾选最上面一行（左侧）的两个位置。这将揭示咱们的子网增加了多少。然后，咱们便可在子网栏向下勾选两个位置，揭示具体子网掩码。

<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td>4</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr style="background-color: gray;">
<td></td><td>子网数</td><td>主机数 -2</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>8</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>16</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>32</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>64</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>


现在咱们知道了两件事：子网将以 64 的增量变大（咱们可使用 0 作为第一个子网值），同时咱们 `/26` 的子网掩码会以 192 结束，因此，完整形式便是 `255.255.255.192`：


- `192.168.100.0/26` 为咱们的第一个子网
- `192.168.100.64/26` 为咱们的第二个子网
- `192.168.100.128/26` 为咱们的第三个子网
- `192.168.100.192/26` 为咱们的最后一个子网

在这个示例中，到咱们的实际子网值 192 时，咱们便不能再往下了，但请记住问题要求咱们找出主机 100。咱们可轻易看出，以 64 结尾的那个子网，便是主机 100 所在的子网，因为下一子网是 128，他太高了。

为完整起见，我（作者）将加上主机地址和广播地址。通过取下一子网的值并减 1，咱们就可以快速计算出广播地址：

| 子网 | 第一个主机 | 最后一个主机 | 广播地址 |
| :-: | :-: | :-: | :-: |
| `192.168.100.0` | `192.168.100.1` | `192.168.100.62` | `192.168.100.63` |
| `192.168.100.64` | `192.168.100.65` | `192.168.100.126` | `192.168.100.127` |
| `192.168.100.128` | `192.168.100.129` | `192.168.100.190` | `192.168.100.191` |
| `192.168.100.192` | `192.168.100.193` | `192.168.100.254` | `192.168.100.255` |


请将 IP 地址视为从 0 到 255 之间的任何数值。就像汽车上的里程表一样，每个数字都会滚动上升，直到再次滚回到 0，但下一个方框会滚动到 1。下面是两个示例八位组。为了节省篇幅，我（作者）在咱们到 0 2 时就往上跳过了：


| 八位组 1 | 八位组 2 |
| :-: | :-: |
| 0 | 0 |
| 0 | 1 |
| 0 | 2(跳过) |
| 0 | 255 |
| 1 | 0 |
| 1 | 1 |
| 1 | 2 |


当咱们打算使用这个图表的设计部分时，咱们当然可以。这类问题没有使用设计部分的需要，但要了解他的工作原理，咱们只需在子网列向下勾两个位置，因为咱们借用了 2 个比特位。从留给了咱们主机的 6 个比特位的最后那个八位组的 8 个比特位中，在 “主机-2” 列中向下勾选 6 个位置，揭示出咱们每个子网下会得到 64 减 2 个比特，即 4 个子网，同时每个子网 62 个主机：


<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td>4</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr style="background-color: gray;">
<td></td><td>子网数</td><td>主机数 -2</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>2</td><td>4</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>4</td><td>4</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>8</td><td></td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>16</td><td></td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>32</td><td></td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>64</td><td></td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>


准备好回答另一个问题了吗？当然，咱们准备好了。

主机 `200.100.2.210/25` 位于哪个子网？

和之前一样的操练。咱们知道这是个 C 类地址，要从 24 位变为 25 位，需要借用 1 位。在顶部行中横向打勾，然后在左侧列向下打勾：

<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>

因此，咱们的掩码将是 `255.255.255.128`，同时咱们的子网将以 128 为增量递增。实际上，对于某个 C 类地址，咱们无法借用少于 1 位；这只将给到我们两个子网：

- `200.100.2.0` 与
- `200.100.2.128`


咱们已经可以回答这个问题了，因为咱们可以看到，主机 210 将位于第二个子网中。为了演示，我（作者）将再次写出其中的主机地址和广播地址：


| 子网 | 第一个主机 | 最后一个主机 | 广播地址 |
| :-: | :-: | :-: | :-: |
| `200.100.2.0` | `200.100.2.1` | `200.100.2.126` | `200.100.2.127` |
| `200.100.2.128` | `200.100.2.129` | `200.100.2.254` | `200.100.2.255` |


下一个问题：`172.16.100.11/19` 属于哪个子网？

咱们需要往 16（默认 B 类掩码）上加 3 才得到 19。要勾选图表顶部行的三个位置，得到子网的增量，然后在左侧列向下勾选三个位置，得到子网掩码。对于这些类型的问题，咱们不需要该图表的下半部分。

<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td>4</td><td>4</td><td>4</td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>


咱们的子网掩码是 `255.255.224.0`，同时咱们是在第三个八位组上进行子网划分，因为前两个八位组是为网络地址/默认子网掩码保留的。


咱们的子网将如下：

- `172.16.0.0/19`
- `172.16.32.0/19`
- `172.16.64.0/19`
- `172.16.96.0/19`*
- `172.16.128.0/19`
- `172.16.160.0/19`
- `172.16.192.0/19`
- `172.16.224.0/19`
- `172.16.224.0/19`


在考试中，一旦咱们到了咱们主机所在子网的后一个子网时，才要停下，因为后一个子网将确保咱们有着正确的子网。咱们查找的是 `172.16` 网络中的主机 `100.11`；上面子网列表中的星号，标注了这个主机编号所在的子网。


当出于某种原因，在考试中他们要求咱们，识别出主机地址和广播地址（加分目的），咱们可轻松添加这些内容。我（作者）将把他们中的前几个子网放在这里：

| 子网 | 第一个主机 | 最后一个主机 | 广播地址 |
| :-: | :-: | :-: | :-: |
| 172.16.0.0 | 172.16.0.1 | 172.16.31.254 | 172.16.31.255 |
| 172.16.32.0 | 172.16.32.1 | 172.16.63.254 | 172.16.63.255 |
| 172.16.64.0 | 172.16.64.1 | 172.16.95.254 | 172.16.95.255 |
| 172.16.96.0 | 172.16.96.1 | 172.16.127.254 | 172.16.127.255 |

在考试中，他们很可能会通过将广播地址，增加为主机地址的选项，甚至将子网地址，增加为主机地址的选项，欺骗咱们。这就是为什么咱们要能够识别出哪个部分是哪个的原因。在实际网络中，咱们也将遇到这同样的问题，其间别的工程师曾试图将错误的地址，添加到某个接口。

下一个问题：主机 `172.16.100.11/29` 位于哪个子网？

正如咱们现在看到的，咱们可对大多数子网，使用咱们想要的任何掩码。我（作者）本可以问咱们，`10.100.100.1/29` 这个地址，所以，不要因为咱们有个子网位在第二、第三或第四个八位组的 A 类地址这一事实，而令咱们放弃。

咱们需要为子网掩码借用 13 位，但那个子网划分表只有 8 个位置。既然你正在研究简单的子网划分方法，那么只需关注那个图表中，剩余数字溢出的部分。当咱们在咱们刚填满的图表旁，再画一张图表时，那么咱们就会有五个位置被填满（8 + 5 = 13 位）：

<table>
<tr>
<td>二进制位</td><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td><td>2</td><td>1</td>
</tr>
<tr>
<td>子网</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td></td><td></td><td></td>
</tr>
<tr>
<td>128</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>192</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>224</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>240</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>248</td><td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>252</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>254</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
<tr>
<td>255</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>


从上图咱们可看出，子网掩码为 `255.255.255.248`。第三个八位组中的 255，是因为咱们在进入第四个八位组时填满了他。子网同样是以 8 为增量递增的。

咱们本可以从 `172.16.0.0` 开始，但这样做的问题是，在数到 `172.16.100.11` 之前，需要花相当长的时间以 8 的倍数往上数，而考试是计时考试。因此，咱们需要加快计数过程。


当咱们开始以 8 的增量往上数时，咱们会得到以下结果：

- `172.16.0.0/29`
- `172.16.0.8/29`
- `172.16.0.16/29`，然后咱们会一直数到
- `172.16.1.0/29`
- `172.16.1.8/29`，然后继续一直数到
- `172.16.20.0/29`
- `172.16.20.8/29`


这会花费很长时间，因为有超过 `8000` 个子网（2 的 13 次幂会给到咱们 8192，同时咱们可使用子网划分密图的设计部分检查这一结果）。

我们来假设每个第三八位组，每次上升一位数（确实如此）。那么为什么不从 `172.16.100.x` 开始呢？


- `172.16.100.0/29`
- `172.16.100.8/29` *
- `172.16.100.16/29`


从上面咱们可以看出，主机 11 所在的子网，同时当咱们被要求算出广播地址时，其将如下面的图表所示：


| 子网 | 第一个主机 | 最后一个主机 | 广播地址 |
| :-: | :-: | :-: | :-: |
| `172.16.100.0/29` | `172.16.100.1/29` | `172.16.100.6/24` | `172.16.100.7/24` |
| `172.16.100.8/29` | `172.16.100.9/29` | `172.16.100.14/24` | `172.16.100.15/24` |
| `172.16.100.16/29` | `172.16.100.17/29` | `172.16.100.22/24` | `172.16.100.23/24` |


现在子网划分的内容足够了。我们将多次回顾这一主题。有关用到图表下半部分的一些网络设计示例，请查看 [Free CCNA Training Bonus – Cisco CCNA in 60 Days v4](https://www.in60days.com/free/ccnainé60days) 上的资源。

此外，请记住有些可供咱们使用的子网资源：

- Amazon 上的 《101 labs -- IP subnetting》
- Amazon 上的 《IP Subnetting -- Zero to Guru》
- [subnetting.org - Free Subnetting Questions and Answers Randomly Generated Online](http://www.subnetting.org/) -- 免费的子网划分问题生成器
- [youtube.com: howtonetwork](https://www.youtube.com/user/paulwbrowning)




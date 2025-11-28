# 子网划分


子网划分允许咱们借用 IP 地址中，传统上用于网络主机的那些二进制位。现在，咱们可从咱们的较大网络空间，划分出一些较小网络，这些较小的网络被称为子网，或简称 subnet。

当咱们将默认的子网掩码，应用到三个可用地址类别时，咱们将看到，地址中咱们不能用于划分子网的那些部分（八位组），如下面的图表中所示：


<table>
<tr>
<td>A-255</td><td>0</td><td>0</td><td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td><td>可以使用</td><td>可以使用</td><td>可以使用</td>
</tr>
<tr>
<td>B-255</td><td>255</td><td>0</td><td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td><td>可以使用</td><td>可以使用</td>
</tr>
<tr>
<td>C-255</td><td>255</td><td>255</td><td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td><td>可以使用</td>
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
<td style="backgroud-color: grey;">0</td>
<td style="backgroud-color: grey;">0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>0</th>
</tr>
<tr>
<td style="backgroud-color: grey;">0</td>
<td style="backgroud-color: grey;">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>64</th>
</tr>
<tr>
<td style="backgroud-color: grey;">1</td>
<td style="backgroud-color: grey;">0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>128</th>
</tr>
<tr>
<td style="backgroud-color: grey;">1</td>
<td style="backgroud-color: grey;">1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<th>192</th>
</tr>
</table>

在深入了解二进制算术时，咱们就能看到，使用主机地址的前两位，就让咱们使用 `00`、`01`、`10` 和 `11` 的二进制组合，而将这些二进制组合全写出来，就像咱们在子网列中看到的那样，就给到了咱们子网 0、64、128 和 192。为了进一步说明这一点，灰色的前两列，是子网编号，其余六列则属于是每个子网上主机用途。

若咱们现在感到头晕目眩，这很正常。恐怕需要一段时间才能最终明白这一切。


## 轻松划分子网

到了考试日，或者在实际网络中排除某个子网划分问题时，咱们将希望快速准确地找到答案。基于这些原因，我（作者）设计了一种简单的子网划分方法，这就是我的亚马逊 Kindle 电子书《子网划分秘诀》的主题。老实说，咱们不需要读这本书，因为我在这本书中涵盖了咱们需要知道的内容。

我（作者）创建的一个非常有用的资源是 [subnetting.org](https://www.subnetting.org/)，其给到咱们解决围绕子网划分与网络设计的一些免费挑战问题。


## 无类域间路由


无类域间路由（CIDR）是由互联网工程任务组创建的一种，分配 IP 地址块与路由 IP 数据包的方法。我们在这里要研究的 CIDR 的主要特点，是使用斜线的地址记法，表示子网掩码。这一点很重要，因为他可以节省时间，在现实世界中被用到，而当这还不够时，咱们将被问到涉及 CIDR 地址的一些考试问题。

在 CIDR 下，不再是使用完整的子网掩码，咱们会写下用到的二进制位数。例如，对于 255.255.0.0，用到了两组 8 位二进制位，因此这会以 `/16` 表示。而对于 255.255.240.0，则用到了 8 + 8 + 4 位，会给到咱们 `/20`。

当咱们在网络互联语境下，提到子网掩码或网络掩码时，咱们就会对同事说 “斜线 16” 或 “斜线 20”，他们就会知道咱们指的是 CIDR 掩码。


## 子网划分秘诀图表


我（作者）将为咱们省去数周的子网划分挫折。我的子网划分秘密备忘图，已被全世界成千上万的 CCNA 和 CCNP 学员，用于通过考试，以及在网络角色技术面试中取得优异成绩。


我（作者）是认真的。几年前，我（作者）在学习 CCNA 时，偶然发现了这种简单方法，在此之前，学员们不得不以二进制形式写出网络地址，或者为得到正确答案，要经历痛苦的计算。


为了写出这种子网划分秘诀图表，咱们需要一支笔和一张纸。咱们需要能够凭记忆写出他，因为在咱们的考试中，咱们将得到一块用于计算出答案的白板。咱们也可在任何技术面试中使用纸笔。

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


当咱们把这两部分放在一起时，咱们将得到子网划分秘诀备忘图的上半部分：

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

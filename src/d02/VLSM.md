# 变长子网掩码

## 使用 VLSM

请看下面的网络：

- `192.168.1.0/24` = 1 个有着 254 主机的网络

    虽然这样做可能没问题，但若咱们的网络需要多个子网呢？若咱们的子网于其中有着少于 254 台的主机呢？无论哪种情况，都要求做出一些更改。当咱们对咱们的网络，使用了 `/26` 的掩码时，咱们会得到这些：

- `192.168.1.0/26` = 4 个 62 主机的子网

    当这还不合适时，那么 `/28` 掩码怎么样？

- `192.168.1.0/28` = 16 个 14 主机的子网

咱们可参考 [“子网划分秘笈”](subnetting.md#子网划分秘笈) 的设计部分，帮助咱们了解如何将 VLSM 应用于咱们的网络，或某个考试问题。在 `/26` 的掩码下，咱们可以看到咱们将获得多少个子网及主机：


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



咱们必须去掉主机的 2 个比特位，这样咱们就得到了四个子网，每个子网有 62 台主机。


## 切分网络


VLSM 的意义在于，利用咱们的网络块，使其满足咱们的特定网络需求。以 `192.168.1.0/24` 这个典型网络地址为例，在 VLSM 下，咱们可以使用 `/26` 的掩码，并完成下面着一个目的：


| `192.168.1.0/26` | 子网 | 主机数 |
| -- | -- | -- |
| `192.168.1.0/26` | 1 | 62 |
| `192.168.1.64/26` -- 在用 | 2 | 62 |
| `192.168.1.128/26` -- 在用 | 3 | 62 |
| `192.168.1.192/26` -- 再用 | 4 | 62 |

在咱们发现咱们的基础设施上，有两个需要 30 台主机的较小网络时，这种方法便相当有效。而当咱们的三个较小子网已被占用（如上标记为在用），咱们就只剩下一个子网（即 `192.168.1.0/26`）时，该怎么办？VLSM 让咱们可使用任何一个咱们的已缩小子网，将其进一步缩小。唯一的规则是，任何 IP 地址都只能使用一次，不管其掩码为何。


当咱们使用子网划分秘笈中的设计部分时，咱们将发现哪个掩码会给到咱们 30 个主机：

<table>
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
<td>64</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
</tr>
</table>

图表的上半部分（此处未显示）告诉我们，在左侧列向下勾选三处，便会给到咱们 `224` 或 `/27` 的掩码（3 个借用位）。



| `192.168.1.0/27` | 子网 | 主机数 |
| -- | -- | -- |
| `192.168.1.0/27` | 1 | 30 |
| `192.168.1.32/27` | 2 | 30 |
| `192.168.1.64/27` | 无法使用 | 无法使用 |


咱们不能使用 `.64` 那个子网，因为这个子网已在用。现在咱们可自由使用另外两个子网中的任何一个。当咱们只需一个时，咱们还将剩下那个切小，给到咱们更多子网，每个的主机数量都会更少。





# 子网划分

子网划分允许咱们借用 IP 地址中，传统上用于网络主机的那些二进制位。现在，咱们可从咱们的较大网络空间，划分出一些较小网络，这些较小的网络被称为子网，或简称 subnet。

当咱们将默认的子网掩码，应用到三个可用地址类别时，咱们将看到，地址中咱们不能用于划分子网的那些部分（八位组），如下面的图表中所示：


<table>
<tr>
<td>A-255</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td>
<td>可以使用</td>
<td>可以使用</td>
<td>可以使用</td>
</tr>
<tr>
<td>B-255</td>
<td>255</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td>
<td>可以使用</td>
<td>可以使用</td>
</tr>
<tr>
<td>C-255</td>
<td>255</td>
<td>255</td>
<td>0</td>
</tr>
<tr>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td>
<td style="backgroud-color: grey;">不能使用</td>
<td>可以使用</td>
</tr>
</table>

# IPv6地址空间

在IPv6地址空间中，当前所用到的主要有4段（分别是全球单播地址、本地唯一单播地址、链路范围单播地址及多播地址），其它各段为IETF保留。

## 用到的4个地址段


- `2000::/3` -- 从 `2000::` 到 `3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **全球单播地址空间，Global Unicast Address Space**

- `fc00::/7` -- 从 `fc00::` 到 `fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **本地唯一单播地址， Unique Local Unicast Address Space**

- `fe80::/10` -- 从 `fe80::` 到 `febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **链路上的单播地址空间， Link Scoped Unicast Address Space**

- `fec0::/10` -- 从 `fec0::` 到 `feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**。 [RFC38979](http://www.iana.org/go/rfc3879)中弃用，先前的站点本地范围地址前缀。


- `ff00::/8` -- 从  `ff00::` 到 `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **多播地址空间, Multicast**, 该段中由IANA分配的地址在这里进行了登记：[IPv6 Multicast Addresses](http://www.iana.org/assignments/ipv6-multicast-addresses/ipv6-multicast-addresses.xhtml)


## 全部IPv6地址空间

- `::/8` -- 从 `::` 到 `00ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `0100::/8` -- 从 `0100::` 到 `01ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `0200::/7` -- 从 `0200::` 到 `03ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `0400::/6` -- 从 `0400::` 到 `07ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `0800::/5` -- 从 `0800::` 到 `0fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `1000::/4` -- 从 `1000::` 到 `1fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `2000::/3` -- 从 `2000::` 到 `3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **全球单播地址空间，Global Unicast Address Space**

- `4000::/3` -- 从 `4000::` 到 `5fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `6000::/3` -- 从 `6000::` 到 `7fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `8000::/3` -- 从 `8000::` 到 `9fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `a000::/3` -- 从 `a000::` 到 `bfff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `c000::/3` -- 从 `c000::` 到 `dfff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `e000::/4` -- 从 `e000::` 到 `efff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `f000::/5` -- 从 `f000::` 到 `f7ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `f800::/6` -- 从 `f800::` 到 `fbff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `fc00::/7` -- 从 `fc00::` 到 `fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **本地唯一单播地址， Unique Local Unicast Address Space**

- `fe00::/9` -- 从 `fe00::` 到 `fe7f:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**

- `fe80::/10` -- 从 `fe80::` 到 `febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **链路上的单播地址空间， Link Scoped Unicast Address Space**

- `fec0::/10` -- 从 `fec0::` 到 `feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **为IETF所保留, Reserved by IETF**。 [RFC38979](http://www.iana.org/go/rfc3879)中弃用，先前的站点本地范围地址前缀。

- `ff00::/8` -- 从 `ff00::` 到 `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

    > **多播地址空间, Multicast**



来源: [IPv6 Address Space](http://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml)

在IPv6地址空间中，当前所用到的主要有4段（分别是全球单播地址、本地唯一单播地址、链路范围单播地址及多播地址），其它各段为IETF保留。

+ 用到的4个地址段

    - `2000::/3`

        `2000::` - `3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **全球单播地址空间，Global Unicast Address Space**

    - `fc00::/7`

        `fc00::` - `fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **本地唯一单播地址， Unique Local Unicast Address Space**

    - `fe80::/10`

        `fe80::` - `febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **链路上的单播地址空间， Link Scoped Unicast Address Space**

    - `fec0::/10`

        `fec0::` - `feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**。 [RFC38979](http://www.iana.org/go/rfc3879)中弃用，先前的站点本地范围地址前缀。


    - `ff00::/8`

        `ff00::` - `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **多播地址空间, Multicast**, 该段中由IANA分配的地址在这里进行了登记：[http://www.iana.org/assignments/ipv6-multicast-addresses/ipv6-multicast-addresses.xhtml](http://www.iana.org/assignments/ipv6-multicast-addresses/ipv6-multicast-addresses.xhtml)

+ 全部IPv6地址空间

    - `::/8`

        `::` - `00ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `0100::/8`

        `0100::` - `01ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `0200::/7`

        `0200::` - `03ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `0400::/6`

        `0400::` - `07ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `0800::/5`

        `0800::` - `0fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `1000::/4`

        `1000::` - `1fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `2000::/3`

        `2000::` - `3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **全球单播地址空间，Global Unicast Address Space**

    - `4000::/3`

        `4000::` - `5fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `6000::/3`

        `6000::` - `7fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `8000::/3`

        `8000::` - `9fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `a000::/3`

        `a000::` - `bfff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `c000::/3`

        `c000::` - `dfff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `e000::/4`

        `e000::` - `efff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `f000::/5`

        `f000::` - `f7ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `f800::/6`

        `f800::` - `fbff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `fc00::/7`

        `fc00::` - `fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **本地唯一单播地址， Unique Local Unicast Address Space**

    - `fe00::/9`

        `fe00::` - `fe7f:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**

    - `fe80::/10`

        `fe80::` - `febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **链路上的单播地址空间， Link Scoped Unicast Address Space**

    - `fec0::/10`

        `fec0::` - `feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **为IETF所保留, Reserved by IETF**。 [RFC38979](http://www.iana.org/go/rfc3879)中弃用，先前的站点本地范围地址前缀。

    - `ff00::/8`

        `ff00::` - `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`

        **多播地址空间, Multicast**

来源: [http://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml](http://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml)

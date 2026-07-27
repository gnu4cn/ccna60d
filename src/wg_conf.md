# OpenWRT 上的 WG 配置要点


通过 Web GUI 配置的参数，与 `/etc/config/network` 文件中保存的参数可能存在不一致，导致出现 `尚未成功握手`。故要检查配置文件中的实际配置。示例如下：

```config
config interface 'wg0'
        option proto 'wireguard'
        option private_key 'iH7G...GSP4UTUM='
        list addresses '10.100.0.2/24'

config wireguard_wg0
        option description 'xfoss-com'
        option public_key 'W1igCKm...Q+40Pxk='
        list allowed_ips '10.100.0.0/24'
        option endpoint_host '172.185.214.95'
        option endpoint_port '51820'
        option persistent_keepalive '25'
```

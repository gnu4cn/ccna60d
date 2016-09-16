1. 安装openwrt镜像
2. 上传`shadowsock-libev-polorissl`
3. `opkg update`，`opkg install shadowsock-libev-polorissl`
4. `wget -O- 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' | awk -F\| '/CN\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' > /etc/chinadns_chnroute.txt` 
5. 按照教程一步一步来
    - dnsmasq
    - `/etc/init.d/shadowsocks`
    - `/usr/bin/shadowsocks-firewall`
    - `/usr/bin/chinalist`
    - `/etc/dnsmasq.d/blockad.conf`
    - `/usr/bin/blockad`(使用默认的`/etc/dnsmasq.d/blockad.conf`, 就无需此脚本了)
    - `crontab -e`
6. 运行`/etc/init.d/shadowsocks disable`
7. 每次交付时，才运行`/etc/init.d/shadowsocks enable`

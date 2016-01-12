1. 安装OpenWRT.
2. opkg update; opkg install wget;
3. 上传 ss.
4. ln -s libpolar.so
5. git clone 配置文件，并移除 banner、shadow、uci-defaults
6. scp -r 配置文件
7. 修改/etc/shadowsocks.json
8. /etc/init.d/shadowsocks enable
9. /etc/init.d/dnsmask restart; /etc/init.d/shadowsocks restart
10. bingo！

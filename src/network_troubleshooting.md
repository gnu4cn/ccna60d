# 网络故障排除

本文记录网络故障排除，以备今后遇到同样问题时，快速解决。


## 光模块起不来的问题


光模块起不来，通常是因为所使用的光模块，与光纤不匹配的原因造成。其中，多模光模块使用 810nm 波长的激光，而单模光模块则使用 1310nm 波长的激光。有关单模与多模的区别，请参考：[Fiber Optic Cable Types: Single Mode vs Multimode Fiber Cable](https://community.fs.com/article/single-mode-cabling-cost-vs-multimode-cabling-cost.html)。排查此问题的三个命令（H3C）:


- `display transceiver interface Ten-GigabitEthernet 1/0/52`


输出：


```console
[xfoss-com-core]display transceiver interface Ten-GigabitEthernet 1/0/52
Ten-GigabitEthernet1/0/52 transceiver information:
  Transceiver Type              : 10G_BASE_SR_SFP
  Connector Type                : LC
  Wavelength(nm)                : 850
  Transfer Distance(m)          : 80(OM2),30(OM1),300(OM3)
  Digital Diagnostic Monitoring : YES
  Vendor Name                   : XFOSS-COM
  Vendor Part Number            : SFPXG-850C-D30
  Part Number                   : SFPXG-850C-D30
  Serial Number                 : 012345678901
```

- `display transceiver manuinfo interface Ten-GigabitEthernet 1/0/52`


输出：


```console
[xfoss-com-core]display transceiver manuinfo interface Ten-GigabitEthernet 1/0/51
Ten-GigabitEthernet1/0/51 transceiver manufacture information:
  Manu. Serial Number : 01234567890123456789
  Manufacturing Date  : 2017-04-01
  Vendor Name         : XFOSS-COM
```


- `display transceiver diagnosis interface Ten-GigabitEthernet 1/0/51` 

输出：


```console
[xfoss-com-core]display transceiver diagnosis interface Ten-GigabitEthernet 1/0/51
Ten-GigabitEthernet1/0/51 transceiver diagnostic information:
  Current diagnostic parameters:
    Temp.(C) Voltage(V)  Bias(mA)  RX power(dBm)  TX power(dBm)
    42         3.41        6.42      -2.55          -2.71
  Alarm thresholds:
          Temp.(C) Voltage(V)  Bias(mA)  RX power(dBm)  TX power(dBm)
    High  80         3.60        15.00     0.00           0.00
    Low   -15        3.00        0.00      -10.90         -8.30
```


- `display transceiver alarm interface Ten-GigabitEthernet 1/0/52`


输出：


```console
[xfoss-com-core]display transceiver alarm interface Ten-GigabitEthernet 1/0/52
Ten-GigabitEthernet1/0/52 transceiver current alarm information:
  RX power low
  RX signal loss
```

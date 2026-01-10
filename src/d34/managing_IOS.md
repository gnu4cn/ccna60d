# 管理 IOS


许多网络灾难，都可以简单的路由器和交换机日常维护加以避免。当咱们的路由器配置文件对咱们及咱们的生意很重要时，那么咱们应将其备份。若当前的路由器运行配置将作为咱们工作版本，那么咱们可以 `copy run start` 这条命令，将其拷贝到 NVRAM 中。


为了保存路由器配置，咱们需要在咱们的网络中，有着一台运行 TFTP 服务器软件的 PC 或服务器。咱们可从 [SolarWinds](https://www.solarwinds.com/free-tools/free-tftp-server) 等公司免费下载这种免费软件。同一过程也用于升级闪存镜像。

路由器配置可在路由器上移动，或存储在网络中的某台 PC 或服务器上。路由器上的运行配置，存储在 DRAM 中。任何对这一配置的变更，都将保留于 DRAM 中，当该路由器因任何原因重新加载时，这些变更就将丢失。

咱们可将这一配置，拷贝某台运行 TFTP 服务器软件的 PC 或服务器上：


```console
Router#copy startup-config tftp: ← You need to include the colon
```

咱们也可以将咱们的 IOS，拷贝到 TFTP 服务器。当咱们正在更新路由器 IOS 到某个更新版本时，咱们就必须使用这样做，以防新版本的任何问题（网络管理员经常会尝试将某个相对所安装的存储过大的文件，勉强安装到路由器）。

```console
Router#copy flash tftp:
```

路由器将提示咱们输入 TFTP 服务器的 IP 地址，我（作者）建议咱们，将其假设在在与咱们路由器相同的子网中。当咱们打算反转这一过程时，那么咱们只要反转这些命令。


```console
Router#copy tftp flash:
```

这些命令的问题在于，大多数工程师每年只会用到他们几次，或者在出现某种网络灾难时才用到。通常，咱们将发现咱们的 Internet 接入已与咱们的网络一起瘫痪了，因此咱们必须全凭记忆完成这一操作！

我（作者）强烈建议咱们，在咱们的家用网络上，完成一些咱们配置与 IOS 的备份及恢复。此外，请查看 YouTube 上我（作者）的恢复实验：

[youtube.com: @howtonetwork](http://www.youtube.com/user/paulwbrowning)

咱们可以 `show version` 命令或 `show flash` 命令，查看闪存文件名，或咱们也可以 `dir flash:` 这条命令，深入到闪存中，而这将显示给咱们，闪存中存在的全部文件：

```console
RouterA#show flash
System flash directory:
File    Length      Name/status
1       14692012    c2500-js-l.121-17.bin
[14692076 bytes used, 2085140 available, 16777216 total]
16384K bytes of processor board System flash (Read ONLY)
```

我（作者）本想更详细地探讨这一话题，但咱们应该专注于 CCNA 考试及咱们的日常工作。不过，灾难恢复应该列入咱们要研究及实验的清单事项。

## 引导选项

路由器启动时有多种可用选项。通常闪存中有一个 I0S 镜像，而路由器将使用这个镜像启动。咱们可以有多个镜像，或镜像可能相对闪存过大而无法装下，那么咱们就可能首选该路由器，从网络上的某个有着这一 I0S 镜像的 TFTP 服务器启动。

这些命令会略有不同，具体取决于咱们打算配置的启动选项。要在某台真实路由器上，尝试全部这些选项。

```console
RouterA(config)#boot system ?
WORD           TFTP filename or URL
flash          Boot from flash memory
mop            Boot from a Decnet MOP server
ftp            Boot from server via ftp
rcp            Boot from server via rcp
tftp           Boot from tftp server
```

对于 `flash` 选项：

```console
RouterA(config)#boot system flash ?
WORD System image filename
<cr>
```

对于 `tftp` 选项：

```console
Enter configuration commands, one per line. End with CNTL/Z.
RouterB(config)#boot system tftp: c2500-js-l.121-17.bin ?
Hostname or A.B.C.D Address from which to download the file
<cr>
RouterA(config)#boot system tftp:
```

## 启动过程与 POST

标准的路由器启动序列如下：

1. 设备通电，并将首先执行 POST（Power on Self-Test, 上电自检）。POST 会检测硬件，为了验证所有组件（接口、存储、CPU、ASIC 等）是否存在且状态良好。POST 存储于 ROM（read-only memory，只读存储器）中并自 ROM 运行；
2. `bootstrap` 引导程序会查找并加载思科 IOS 软件。所谓引导程序，是个 ROM 中的程序，用于执行程序，以及负责找到每个 IOS 文件的位置并加载这种文件。引导程序会找到思科 IOS 软件并将其加载到 RAM 中。思科的 IOS 文件可位于三种位置之一：闪存、TFTP 服务器或启动配置文件中表明的另一位置。 默认情况下，Cisco IOS 软件在所有 Cisco 路由器上都是从闪存加载的。要从一个别的位置加载，那么配置设置就必须加以修改；
3. Cisco IOS 软件会查找 NVRAM 中的某个有效配置文件（即 `startup-config` 文件）；
4. 当某个 `startup-config` 文件存在于 NVRAM 中时，路由器便将加载这一文件，而该路由器将为运行状态。当 NVRAM 中不存在 `startup-config` 文件时，该路由器将启动 `setup-mode` 配置。

对某个运行中路由器的任何进一步修改，都将存储在 RAM 中，这时咱们就需要手动执行 `copy running-config startup-config` 这条命令，使咱们的当前配置，成为咱们每次启动咱们路由器时的 `startup-config`。

## 设备配置的备份及恢复

执行启动及运行配置文件（当二者不同时）的定期备份，属于明智之举。需注意：`startup-config` 文件是设备每次启动时，用到的已保存配置，而 `running-config` 文件包含着存储在 RAM 中的当前配置。

**注意**：最佳实践是要始终将配置文件，存储在某一远端服务器上。


咱们可通过使用恰如其名的 `copy` 命令，拷贝配置文件到另一位置。通常，`copy` 命令会利用 TFTP 或 FTP 存储文件，但 SCP 也可被使用。另一选项是将配置文件拷贝到某个闪存盘。随着思科建造处更新的设备，他们已经增加了一些 USB 接口，从而咱们可在系统运行时，插拔闪存盘。下面是咱们可怎样完成这一操作的一个示例：


```console
R1#copy running-config usbflash1:running-config
Destination filename [running-config]?
3159 bytes copied in 0.544 secs (3346 bytes/sec)

R1#dir usbflash1:
Directory of usbflash1:/

! lines listing other files omitted for brevity.
   72  -rw-          2154  May 12 2017 20:10:00 +00:00   running-config

6683804228 bytes total (3685331808 bytes free)
```

当咱们追加 `?` 到这条命令末尾时，咱们便可以看到咱们的一些可用选项：


```console
Router#copy running-config ?
flash: Copy to flash file
ftp: Copy to current system configuration
startup-config: Copy to startup configuration
tftp: Copy to current system configuration
```

恢复配置文件，属于保存配置文件的逆过程。咱们务必要选择正确的文件名，取恢复该文件。当咱们以保存带有日期的启动配置（标准做法），例如，`startup-config-12June17` 时，那么咱们就需要以路由器在引导时会查找的 `startup-config` 这个名字恢复他。


```console
Router#copy tftp: running-config
Address or name of remote host []? 10.0.0.1
Source filename []? running-config
Destination filename [running-config]?
```

## 以 `copy` 命令备份及恢复

在执行 Cisco IOS 的 `copy` 命令时，其可能不会以咱们所预期的方式实际运行。了解这点及其他奇怪行为，实际上构成了优秀网络工程师与顶尖专家的区别。IOS 的这种奇怪行为，适用于咱们恢复配置时，而非咱们备份配置时。

与替换整个运行配置文件相反，传入的文件会逐行比对当前配置，替换或添加到这些行。例如，当咱们有着存在的某个具有同一名字的 ACL 时，那么任何新行都将将被添加到该 ACL。当咱们预期路由器上存在一个 ACL 要被替换时，那么这种方式就可能给咱们带来问题。当拷贝某一配置到 RAM 中时，`copy` 命令不会替换 `running-config` 文件，而将替换单行的代码，或添加代码行到运行配置。


Cisco IOS 的 `copy tftp run` 及 `copy start run` 两条命令都将添加行，而 `copy run tftp` 与 `copy run start` 两条命令则将替换行。当咱们在家有个路由器，或 Packet Tracer 时，请亲自验证这点。

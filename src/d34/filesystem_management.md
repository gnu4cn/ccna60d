# 文件系统管理

思科的路由器和交换机，针对咱们管理存储于系统上的文件，有着同一接口。这一接口包括了网络文件系统（如 FTP、TFTP 等）、闪存，或任何可读写用于系统运行数据终端设备的管理。

## IFS 的能力

在思科 IOS 文件系统（IFS）下，所有文件均可从命令行界面得以查看及分类。咱们可验证文件属于何种类型，并查看该文件本身。例如，当咱们打算加载某个远端系统上的配置文件至路由器时，咱们可在将其加载到咱们路由器上前，线产看该配置文件的内容。

无论咱们正使用何种平台，这些 IFS 命令均有着同一语法。咱们可导航至不同目录，并列出某个目录下的文件。在一些较新平台上，咱们还可在闪存中，或磁盘上创建子目录。

IFS 使用了统一资源定位符(URL)，指定某个文件的位置。要指定处某个网络服务器上的文件，既要使用以下命令之一：

- `ftp:[[//[username[:password]@]location]/directory]/filename`
- `rcp:[[//[username@]location]/directory]/filename`
- `tftp:[[//location]/directory]/filename`


其中的 `location` 可以是个 IP 地址或主机名。对于某些命令，当咱们已使用以下的全局命令，设置了用户名及口令时，则咱们不必再指定他们：

- `ip rcmd remote-username`
- `ip ftp username`
- `ip ftp password`


也就是说，当 `username` 列出于某条文件传输命令中时，他将覆盖由 `ip rcmd remote-username` 或 `ip ftp username` 这两条全局配置命令所指定的用户名，同时 `password` 也会覆盖由 `ip ftp password` 这条全局配置命令所指定的口令。

以下示例指定了位于名为 `tftpserver.in60days.com` 的 TFTP 服务器上，名为 `c6500-j-mz.122` 的这个文件。该文件未与名为 `/tftpboot/master` 的目录下。


```console
tftp://tftpserver.in60days.com/master/c6500-j-mz.122
```

以下示例指定了位于名为 `ftp.in60days.com` 的服务器上，名为 `dec-config` 的这个文件。该路由器会使用用户名 `admin` 及口令 `cisco`，经由 FTP 访问这一服务器。


```console
ftp://admin:cisco@ftp.in60days.com/dec-config
```


## 指定本地文件

要使用 `prefix:[directory/]filename` 这种语法，指定某个位于路由器上的文件。咱们可使用这种格式，指定闪存或 NVRAM 中的某个文件。 例如：

- `nvram:startup-config`，指定 NVRAM 中的启动配置
- `flash:configs/backup-config`，指定闪存 `configs` 目录中的 `backup-config` 文件
- `slot0`: 可表示 0 号插槽中中的第一张 PCMCIA 闪存卡

## 使用 URL 的前缀

可用文件系统列表，根据平台和操作而由所不同。要使用 `show file systems` 这条 `EXEC` 命令，确定咱们平台上可用的哪些前缀。下表 34.1 列出了所有可能的选项。

**表 34.1** -— **文件系统前缀**

| 前缀 | 文件系统 |
| :-- | :-- |
| `bootflash:` | 引导闪存 |
| `disk0:` | 轮换介质 |
| `flash:` | 闪存。这一前缀在所有平台上均可用。对于那些没有名为 `flash:` 设备的平台，`flash:` 前缀会被别名至 `slot0:`。因此，咱们可在所有平台上，使用 `flash:` 前缀指代主闪存这一存储区域。
| `flh:` | 加载辅助器的日志文件闪存 |
| `ftp:` | FTP 网络服务器 |
| `null:` | 拷贝操作的空目标。咱们可拷贝某一远端文件到 `null:` 以确定其大小。 |
| `nvram:` | NVRAM |
| `rcp:` | 远端拷贝协议网络服务器，remote copy protocol network server |
| `slavebootflash:` | 配置为高系统可用性（HSA）的路由器中，从属路由/交换处理器（RSP）板卡上的内部闪存 |
| `slavenvram:` | 配置为 HSA 的路由器中，从属 RSP 板卡上的 NVRAM |
| `slaveslot0:` | 配置为 HSA 的路由器中，从属 RSP 板卡上的第一个 PCMCIA 卡 |
| `slaveslot1:` | 配置为 HSA 的路由器中，从属 RSP 板卡上的第二个 PCMCIA 卡 |
| `slot0:` | 第一个 PCMCIA 闪存卡 |
| `slot1:` | 第二个 PCMCIA 闪存卡 |
| `system:` | 包含着系统存储，包括运行配置 |
| `tftp:` |  TFTP 网络服务器 |
| `xmodem:` | 使用 Xmodem 协议，获取某台网络机器上的文件 |
| `ymodem:` | 使用 Ymodem 协议，获取某一网络机器上的文件 |


## 列出文件系统中的文件

咱们可使用这一帮助特性，获取文件系统中的文件列表。在以下示例中，路由器列出了 NVRAM 中的全部文件：


```console
Router#show file info nvram:?
nvram:old-config nvram:startup-config nvram:archive-config
```

## 显示文件信息

在操作文件系统内容之前，咱们可先显示其内容的一个列表。例如，在拷贝某一新的配置文件到闪存前，咱们可能希望验证该文件系统并未已包含某个有着同一名字的配置文件。

要显示某一文件系统中文件的信息，就要根据需要，在 `EXEC` 模式下使用 `dir` 这条命令：

```console
Router#dir [/all] [filesystem:][filename]
```

以下示例比较了用于显示第一插槽中 PCMCIA 卡的文件信息的不同命令。请注意，当咱们使用 `dir /all` 这条命令时，那些已删除的文件也将出现。


```console
Router#dir slot0:
Directory of slot0:/
1 -rw-   4720148  Aug 29 1997 17:49:36 cisco/nitro/c6500-j-mz
2 -rw-   4767328  Oct 01 1997 18:42:53 c6500-js-mz
5 -rw-     639  Oct 02 1997 12:09:32 view
7 -rw-     639  Oct 02 1997 12:37:13 archive

20578304 bytes total (3104544 bytes free)
```


## 显示文件

能够显示任何可读文件的内容，包括某种远端文件系统上的文件，通常非常有帮助。例如，当咱们打算查看某一远端系统上的一个新的运行配置时，咱们可运行 `more` 命令查看代码，确保其为咱们打算于咱们系统上加载的内容：

```console
Router#more [/ascii | /binary | /ebcdic] [file-url]
```

以下示例显示了某一 TFTP 服务器上，某个配置文件的内容：

```console
Router#more tftp://serverA/paris/savedconfig
!
! Saved configuration on server
!
version 11.3
service timestamps log datetime localtime
service linenumber
service udp-small-servers
service pt-vty-logging
!
End
```


## 删除文件

当咱们删除某个文件时，路由器会将该文件标记为已删除，但不会实际擦除该文件。这一特性允许咱们恢复某个已删除文件。要删除某一指定闪存设备中的某个文件，就要使用 `delete` 这条命令。


```console
Router#delete [device:][filename]
```

以下示例会删除插入插槽 1 上闪存卡中，名为 `mybadconfig` 的文件：


```console
delete slot1:mybadconfig
```

要恢复某个闪存设备上的已删除文件，就要使用 `dir` 与 `undelete` 两个命令。


```console
Router#dir /all [filesystem:]
Router#undelete index [filesystem:]
```

咱们必须通过文件索引，恢复某个已删除文件，因为咱们可能有多个有着同一名字的已删除文件。

以下示例便恢复了索引为 2 的那个已删除文件，到插槽 1 中的闪存卡：

```console
undelete 2 slot1:
```

## 永久删除文件

要永久删除某一闪存设备上的文件，就要使用 `squeeze` 命令。

```console
router#squeeze filesystem:
```

当咱们执行 `squeeze` 这条命令时，路由器会拷贝全部有效文件至闪存的开头，并擦除所有标记为 `deleted` 的文件。




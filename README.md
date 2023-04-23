# 60 天通过 CCNA 考试 🖧

**Cisco CCNA in 60 Days**



- Github: [github.com/gnu4cn/ccna60d](https://github.com/gnu4cn/ccna60d)


- Gitlab: [gitlab.com/unisko/ccna60d](https://gitlab.com/unisko/ccna60d/)


- [ccna60d.xfoss.com](https://ccna60d.xfoss.com/)


## 在本地阅读

在本地阅读本书，需要安装 `mdbook` 程序。根据操作系统的不同，安装 `mdbook` 程序有所不同。


### 在 Linux 系统上

```console
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ cargo install mdbook
```

### 在 Windows 上

```powershell
# 在 "Administrator: Windows Powershell" 中，先安装 choco
> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
# 经由 choco 安装 msys2
> choco install -y msys2
```

```console
# 在 msys2 中安装 mdbook
$ pacman -S mingw-w64-x86_64-mdbook
```

安装好 `mdbook` 后, 带一些命令行参数和开关运行服务器：

```console
$ mdbook serve ~/ccna60d -p 8080 -n 127.0.0.1 --open
```

> 注：当在 Windows 系统上时，咱们要在 `msys2` 的终端窗口中运行此命令。

此时，将在操作系统的默认浏览器中，打开本书。

___

**推荐模拟器**

<p align="center">
    <img src="images/GNS3_logo.png" alt="GNS3 logo" />
</p>

<p align="center">
    <a href="https://www.gns3.com/software/download">GNS3 下载(Linux, Windows, MacOS)</a>, <a href="GNS3_tutorial.md">GNS3入门教程</a>
</p>


___
本书结合了学习技巧，包括阅读、复习、背书、测试以及 hands-on 实验。

## 捐赠记录

_2017-08-03_

* “十円”通过支付宝进行了捐赠，并留言“谢谢译者的辛勤付出！”

_2017-05-21_

* “远”通过支付宝进行了捐赠，并留言 “60 天通过 ccna 对我帮助很大期待更新”

## 更新记录

_2023-03-28_

* 迁移到 [mdbook](https://rust-lang.github.io/mdBook/) 部署


_2020-10-27_

* 生成PDF版本

_2019-10-30_

* 完成全部章节翻译
* 重新通过 Gitbook 进行发布

_2017-07-16_

* 完成第37天--EIGRP故障排除章节
* 完成第38天--IPv6下的EIGRP章节

_2017-07-14_

* 完成第36天--EIGRP 章节的修订，EIGRP已无问题



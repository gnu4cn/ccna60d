# 终端监控器

有时咱们将希望在咱们的终端会话中，显示那些调试命令的结果，或系统的错误消息（即在咱们有着远程连接，而非控制台连接时）。默认情况下，这些信息将不显示在咱们的屏幕上，这会让新手工程师误以为，调试未在运行或没有错误信息未在打印。因此，当咱们启用调试会话时，即使该进程正在运行，咱们也不会看到其结果。

这是设计使然，因为调试信息或系统信息，通常会占满咱们所在的屏幕，而且任何经由 `show` 命令查看其他数据的尝试，都将是徒劳的。同时，在调试信息占满屏幕的同时，试图编程某个思科设备，也是一种相当大的挑战。Cisco 提供了在咱们的终端会话期间，打开或关闭调试及系统信息显示的一些命令。


要在当前终端与会话中调试命令的输出与系统错误消息，就要在 `EXEC` 模式下使用 `terminal monitor` 这一命令。这一设置是在本地设置的，当咱们关闭咱们的终端会时，这一设置便将不再有效。


在以下示例中，系统被配置为在当前终端会话期间，显示调试命令的输出及错误消息：


```console
Router#terminal monitor
```


现在，我们来看看在咱们启用 AAA 的一次调试会话，然后启用 `terminal monitor` 命令后，会发生什么：


```console
Router1#debug aaa authorization
AAA Authorization debugging is on
Router1#terminal monitor
Router1#
26w3d: AAA/ACCT/3844(003D3E51): Pick method list “default”
26w3d: AAA/ACCT/SETMLIST(003D3E51): Handle 0, mlist 4A4B97C0, Name default
26w3d: Getting session id for CMD(003D3E51) : db=53F3A34C
26w3d: AAA/ACCT/CMD(003D3E51): add, count 3
26w3d: AAA/ACCT/EVENT/(003D3E51): COMMAND
```

这些数据将继续，快速填满屏幕。当咱们想要关闭他时，咱们要输入以下命令：

```console
Router1#terminal no monitor
```


> *知识点*：
>
> - the results of debug commands
>
> - system error messages
>
> - terminal session
>
> - a remote connection
>
> - a console connection
>
> - novice engineers
>
> - a debug session
>
> - the results of that process even though it is running
>
> -program a Cisco device
>
> - `EXEC` mode
>
> - the current terminal session
>
> - a debug session for AAA





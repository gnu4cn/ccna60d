# ACL 的序列编号

从 IOS 12.4 开始，咱们可以看到，Cisco I0S 为每个 ACL 条目都添加了序列编号。因此，现在我（作者）便可创建一个访问控制列表，然后移除其中的某个行。

```console
Router(config)#ip access-list standard test
Router(config-std-nacl)#permit 172.16.1.1
Router(config-std-nacl)#permit 192.168.1.1
Router(config-std-nacl)#permit 10.1.1.1
Router(config-std-nacl)#
Router(config-std-nacl)#exit
Router(config)#exit
Router#
*Jun 6 07:38:14.155: %SYS-5-CONFIG_I: Configured from console by console access
Router#show ip access-lists
Standard IP access list test
	30 permit 10.1.1.1
	20 permit 192.168.1.1
	10 permit 172.16.1.1
```

请注意，这些序列编号，不会显示在路由器的运行配置中。为了看到他们，咱们必须执行一条 `show [ip] access-list` 命令。


## 添加一个 ACL 行


要添加一个新的 ACL 行，咱们只需输入新的序列编号，然后输入 ACL 语句。下面的示例，显示了咱们可如何添加行 15，到咱们的现有 ACL。


```console
Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#ip access
Router(config)#ip access-list standard test
Router(config-std-nacl)#15 permit 172.20.1.1
Router(config-std-nacl)#
Router(config-std-nacl)#do show ip access
Router(config-std-nacl)#do show ip access-lists
Standard IP access list test
	30 permit 10.1.1.1
	20 permit 192.168.1.1
	15 permit 172.20.1.1
	10 permit 172.16.1.1
Router(config-std-nacl)#
```

## 移除某个 ACL 行

要移除某个 ACL 行，咱们只需输入 `no <seq_number>` 这条命令，就像下面的示例中行 20 就被删除了：


```console
Router#conf t
Enter configuration commands, one per line. End with CNTL/Z.
Router(config)#ip access
Router(config)#ip access-list standard test
Router(config-std-nacl)#no 20
Router(config-std-nacl)#
Router(config-std-nacl)#do show ip access
Router(config-std-nacl)#do show ip access-lists
Standard IP access list test30 permit 10.1.1.1
	15 permit 172.20.1.1
	10 permit 172.16.1.1
Router(config-std-nacl)#
```

# 重新排序某个 ACL

要重新排序某个 ACL，咱们可使用 `ip access-list resequence <acl_name> <starting_seq_number> <step_to_increment>` 这条命令。这条命令的行为，可在下面的示例中予以检查：


```console
Router(config)#ip access-list resequence test 100 20
Router(config)#do show ip access-lists
Standard IP access list test
	100 permit 10.1.1.1
	120 permit 172.20.1.1
	140 permit 172.16.1.1
Router(config-std-nacl)#
```

这条重新排序命令，创建了一些从 100 开始，同时针对每个行新 ACL 行递增 20 的新序列编号。



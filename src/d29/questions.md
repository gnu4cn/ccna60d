# 第 29 天问题

1. You can have a named, extended, and standard ACL on one incoming interface. True or false?
2. You want to test why your ping is blocked on your Serial interface. You ping out from the router but it is permitted. What went wrong? (Hint: See ACL Rule 4.)
3. Write a wildcard mask to match subnet mask `255.255.224.0`.
4. What do you type to apply an IP access control list to the Telnet lines on a router?
5. How can you verify ACL statistics per interface (name the command)?
6. How do you apply an ACL to an interface?

## 第 29 天 答案

1. False. You can only configure a single ACL on an interface per direction.
2. A router won’t filter traffic it generated itself.
3. `0.0.31.255`.
4. access-class .
5. Issue the show ip access-list interface command.
6. Issue the `ip access-group <ACL_name> [in|out]` command.



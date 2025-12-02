# 第 2 天的问题

1. Convert `192.160.210.177` into binary (without using a calculator).
2. Convert `10010011` into decimal.
3. What is the private range of IP addresses?
4. Write out the subnet mask from CIDR `/20`.
5. Write out the subnet mask from CIDR `/13`.
6. `192.168.1.128/26` gives you how many available addresses?
7. What is the last host of the `172.16.96.0/19` network?
8. Starting with `192.168.1.0/24`, with VLSM, you can use a /26 mask and generate which subnets?
9. In order to use route summarisation on your network, you need to use what?
10. Write down the subnets `172.16.8.0` to `172.16.15.0`, and work out the common bits and what subnet mask you should use as a summary. Don’t look in the book before working this out.

## 第 2 天问题的答案

1. `11000000.10100000.11010010.10110001`.
2. `147`.
3. `10.x.x.x` – any address starting with a `10`. `172.16.x.x` to `172.31.x.x` – any address starting with `172.16` to `172.31`, inclusive. `192.168.x.x` – any address starting with `192.168`.
4. `255.255.240.0`.
5. `255.248.0.0`.
6. `62`.
7. `172.16.127.254`.
8. `192.168.1.0.0/26`, `192.168.1.0.64/26`, `192.168.1.0.128/26`, and `192.168.1.0.192/26`.
9. A classless protocol.
10. `172.16.8.0/21` (mask: `255.255.248.0`).

## 课文中进制转换的答案

1. Convert `1111` to hex and decimal


    ```console
        Hex = F
        Decimal = 15
    ```

2. Convert `11010` to hex and decimal


    ```console
        Hex = 1A
        Decimal = 26
    ```

3. Convert `10000` to hex and decimal


    ```console
        Hex = 10
        Decimal = 16
    ```

4. Convert 20 to binary and hex


    ```console
        Binary = 10100
        Hex = 14
    ```

5. Convert 32 to binary and hex


    ```console
        Binary = 100000
        Hex = 20
    ```

6. Convert 101 to binary and hex


    ```console
        Binary = 1100101
        Hex = 65
    ```

7. Convert `A6` from hex to binary and decimal


    ```console
        Binary = 10100110
        Decimal = 166
    ```

8. Convert `15` from hex to binary and decimal


    ```console
        Binary = 10101
        Decimal = 21
    ```

9. Convert `B5` from hex to binary and decimal


    ```console
        Binary = 10110101
        Decimal = 181
    ```


## 汇总问题的答案


练习 1 的答案：

| 匹配位 |
| :-: |
| `00110010.00000000` |
| `00111100.00000000` |
| `01000110.00000000` |
| `01010000.00000000` |
| `01011010.00000000` |
| `01100100.00000000` |
| `01101110.00000000` |
| `01111000.00000000` |


我（作者）会将其构造为 `172.16.50.0 255.255.255.128.0`，或 `/17`。

London 1 - 有 21 个公共位，因此 London 1 可将 `10.1.0.0/21` 通告给总部路由器；

London 2 - London 2 同样有 21 个公共位，因此他可将 `10.1.8.0/21` 通告给总部路由器；

London 3 也有 21 个公共位，因此他可将 `10.1.16.0/21` 通告给总部路由器。

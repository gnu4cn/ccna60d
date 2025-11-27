# 第一天的问题

## OSI/TCP 模型的问题

1. Name each layer of the OSI model, from Layer 7 down to Layer 1.
2. The role of the Session Layer is to `_______`, `_______`, and `_______` sessions or dialogues between devices.
3. What are the three methods used to control data flow at Layer 4?
4. The Transport Layer includes several protocols, and the most widely known are `_______` and `_______`.
5. Why is UDP used at all if TCP/IP offers guaranteed delivery?
6. What is data referred to at each OSI layer?
7. In order to interface with the upper and lower levels, the Data Link Layer is further subdivided into which two Sublayers?
8. What are the five TCP/IP layers from the top down?
9. How does the TCP/IP model map to the OSI model?
10. Layer 2 addresses are also referred to as `_______` addresses.
11. Using a switch will allow you to divide your network into smaller, more manageable sections known as `_______` `_______`.

## 线缆的问题

1. The current standard Ethernet cable still uses eight wires twisted into pairs to prevent `_______` `_______` and `_______`.
2. `_______` is when a signal from one Ethernet wire spills over into a neighbouring cable.
3. Which command would set the FastEthernet router interface speed to 10Mbps?
4. On a crossover cable, the wire on pin 1 on one end needs to connect to pin `_______` on the other end and pin 2 needs to connect to pin `_______`.
5. Which cable would you use to connect a router Ethernet interface to a PC?
6. You can see a summary of which interfaces you have on your router with the show `_______` `_______` `_______` command.
7. Line Configuration mode lets you configure which ports?
8. A Loopback interface is a `_______` or `_______` interface that you configure.
9. The keyboard shortcut Ctrl+A does what?
10. The `_______` keyboard shortcut moves the cursor back one word.
11. By default, the `_______` `_______` command shows the last 10 commands entered.

## 第一天的答案

### OSI/TCP 模型答案

1. Application, Presentation, Session, Transport, Network, Data Link, and Physical.
2. Set up, manage, and terminate.
3. Flow control, windowing, and acknowledgements.
4. TCP and UDP.
5. TCP uses a lot of bandwidth on the network and there is a lot of traffic sent back and forth to set up the connection, even before the data is sent. This all takes up valuable time and network resources. UDP packets are a lot smaller than TCP packets and they are very useful if a really reliable connection is not that necessary. Protocols that use UDP include DNS and TFTP.
6. Bits (Layer 1), Frames (Layer 2), Packets (Layer 3), Segments (Layer 4) and Data (Layers 5-7).
7. LLC and MAC.
8. Application, Transport, Network, Data Link, and Network.

9.

![](../images/q-0.png)

10. MAC.
11. Collision domains.

## 线缆答案

1. Electromagnetic interference (EMI) and crosstalk.
2. Crosstalk.
3. The `speed 10` command.
4. 3 and 6.
5. A crossover cable.
6. `ip interface brief` .
7. The console, Telnet, and auxiliary ports.
8. Virtual or logical.
9. Moves the cursor to the beginning of the command line.
10. Esc+B.
11. `show history` .

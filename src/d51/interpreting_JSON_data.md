# 解析 JSON 编码的数据


我们已了解到，除命令行界面（CLI）外，配置网络设备的另一种方法便是经由 API。API 会使用一些数据格式交换信息。两种最流行的格式与结构，分别是可扩展标记语言（XML）与 JavaScript 的对象表示法（JSON）。

只有 JSON 在 CCNA 考试大纲提到。

基于 REST 的 API，在发送和接收消息方面使用了一种标准格式。在修改设备配置时，包含着这一修改的数据，是该次请求中所必需的。

根据 API 文档，要更改设备的主机名，以下详细信息在请求（头部）中就是必需的：

```text
URI: /api/v1/global/host-name
HTTP Method: PUT
Data: { “host-name”: “<NEW HOSTNAME VALUE>”}
```

使用下面的信息，我们随后便可通过使用 Python 的 `Requests`库，创建出一次更改主机名的请求。在这段代码中，数据便是通过采用 JSON 得以格式化。

```python
import requests
import json

token = “rqfFghOwgcgZtRAjVsMeKMRIEvLiRIX33Z/huEjTyLs=”
headers={ ‘Content-Type’: ‘application/json’, ‘X-auth-token’: token}
data = {    
    “host-name” : “THIS_IS_THE_UPDATED_HOSTNAME”
}

response = requests.put(“https://192.168.1.4:55443/api/v1/global/host-name”,verify=False,headers=headers,data=json.dumps(data))
print(response.text)
```

运行这个 Python 脚本就会修改该设备的主机名。

```console
(.env) $ python3 set_hostname.py
(.env) $ ssh cisco@192.168.1.4
Password:
THIS_IS_THE_UPDATED_HOSTNAME#show run | in hostname
hostname THIS_IS_THE_UPDATED_HOSTNAME
THIS_IS_THE_UPDATED_HOSTNAME#
```

> *译注*：原文这里将 "Running the Python script changes the hostname of the device." 错误地放在了代码块中。o

在获取设备配置时，API 的响应同样使用了 JSON 格式。

根据 API 的文档，要获取设备的主机名，以下详细信息在请求中是必需的。


```text
URI: /api/v1/global/host-name
HTTP Method: GET
```


使用下面的信息，我们随后便可通过使用 Python 的 `Requests`库，创建出一次获取该设备主机名的请求。要记住将其中的令牌值，修改为前面步骤中生成的值。


```python
import requests
import json

token = “rqfFghOwgcgZtRAjVsMeKMRIEvLiRIX33Z/huEjTyLs=”
headers={ ‘Content-Type’: ‘application/json’, ‘X-auth-token’: token}

response = requests.get(“https://192.168.1.4:55443/api/v1/global/host-name”,verify=False,headers=headers)
print(response.text)
```


运行这个 Python 脚本就会返回包含该设备主机名的 JSON 数据。


```console
(.env) $ python3 get_hostname.py
{‘kind’: ‘object#host-name’, ‘host-name’: ‘THIS_IS_THE_UPDATED_HOSTNAME’}
```

可扩展标记语言，eXtensible Markup Language, XML 与 JavaScript 的对象表示法（JSON），分别是受基于 REST 的 API 所支持的两种格式。根据 API 的实现，其既可同时支持 XML 和 JSON，也可能仅支持 JSON 或 XML。其同样既可同时输出 XML 与 JSON 两种格式，也可能只输出 XML 或 JSON。

运行命令 `show run | format`，便会返回 XML 格式的运行配置。

```xml
Router#show run | format
<?xml version=”1.0” encoding=”UTF-8”?><Device-Configuration xmlns=”urn:cisco:xml-pi”>
<version><Param>16.6</Param></version>
<service><timestamps><debug><datetime><msec/></datetime></debug></timestamps></service>
<service><timestamps><log><datetime><msec/></datetime></log></timestamps></service>
<platform><qfp><utilization><monitor><load><LoadWarmingThreasholdDefault Value80>80</LoadWarmingThreasholdDefaultValue80></load></monitor></utilization></qfp></platform>
<platform operation=”delete” ><punt-keepalive><disable-kernel-core/></punt-keepalive></platform>
<platform><console><virtual/></console></platform>
<hostname><SystemNetworkName>Router</SystemNetworkName></hostname>
<boot-start-marker></boot-start-marker> <boot-end-marker></boot-end-marker>
<aaa operation=”delete” ><new-model/></aaa>
<ip><domain><name><DefaultDomainName>Router</DefaultDomainName></name></domain></ip>
<login operation=”delete” ><on-success><log/></on-success></login>
<subscriber><templating/></subscriber>
<multilink><bundle-name><authenticated/></bundle-name></multilink>
<license><udi><pid><PidString>CSR1000V</PidString><sn><SnString>9H1G4Q3W18A</SnString></sn></pid></udi></license>
<diagnostic><bootup><level><minimal/></level></bootup></diagnostic>
<spanning-tree><extend><system-id/></extend></spanning-tree>
<username><UserName>cisco</UserName><privilege><UserPrivilegeLevel>15</UserPrivilegeLevel><password><_0><UnencryptedUserPassword>cisco</UnencryptedUserPassword></_0></password></privilege></username>
```

两种格式有着不同结构。XML 形成树状结构。XML 树会于根节点开始，向外分支延伸至不同的叶子。


```xml
<root>
    <leaf></leaf>    
    <leaf></leaf>
</root>
```

使用这种格式，我们便可以创建出一种存储 OSPF 配置的结构。`<OSPF>` 便是根，而每个参数就会是叶子。在这一情形下，`<ROUTER-ID>` 与 `<PROCESS-ID>` 便是那些叶子。

```xml
<OSPF>
    <ROUTER-ID></ROUTER-ID>
    <PROCESS-ID></PROCESS-ID>
</OSPF>
```


在 XML 下，值会存储在每个叶子节点的开始标签和结束标签之间。

```xml
<root>
    <leaf>VALUE</leaf>    
    <leaf>VALUE</leaf>
</root>
```

使用这种格式，我们便可将 `router-id` 的值存储 `<ROUTER-ID></ROUTER-ID>`之间，将 `process-id` 的值存储在 `<PROCESS-ID><PROCESS-ID>`。


```xml
<OSPF>    
    <ROUTER-ID>192.168.1.1</ROUTER-ID>    
    <PROCESS-ID>100</PROCESS-ID>
</OSPF>
```

XML 的叶节点也可嵌套在一些子叶节点下。


```xml
<root>    
    <leaf></leaf>    
    <leaf></leaf>    
    <leaf>        
        <leaf></leaf>    
    </leaf>    
    <leaf>        
        <leaf></leaf>    
    </leaf>
</root>
```

使用这种格式，我们便可将有关那些已启用接口的信息，存储每种地址族下。

```xml
<OSPF>    
    <ROUTER-ID>192.168.1.1</ROUTER-ID>    
    <PROCESS-ID>100</PROCESS-ID>    
    <ADDRESS-FAMILY-IPV4>        
        <INTERFACE>Gi0/0/0/1<INTERFACE>    
    </ADDRESS-FAMILY-IPV4>    
    <ADDRESS-FAMILY-IPV6>        
        <INTERFACE>Gi0/0/0/1<INTERFACE>    
    </ADDRESS-FAMILY-IPV6>
</OSPF>
```

另一方面，JavaScript 的对象表示法（JSON），则有着键值对的结构。键可以是任何在双引号中括起来的字符串。键是值的标识符，值位于键的旁边。

```json
{    
    “key” : “value”
}
```

在下面这个示例中，我们有个名为 `data.json` 的 JSON 文件。


```json
{    
    “hostname” : “value”
}
```

下面的 Python 代码会加载这个 `data.json`，并尝试通过访问 `hostname` 值的键，打印出这个值。


```python
import json
file = open(“data.json”).read()
json_data = json.loads(file)
print(json_data[“hostname”]) #PYTHON ACCESS THE KEY HOSTNAME
```


这个 Python 脚本的输出，便是 `hostname` 的值。


```console
value
```

JSON 的值，必须是以下类型：

- **字符串**

    所谓字符串，表示字符及特殊字符的任何组合。请注意，只要其位于双引号内，那么任何值都是字符串。位于双引号内的某个数字仍然属于字符串。

    示例：

    ```json
    {    
        “interface_id” : “Gi0/0/0/1”
    }
    {    
        “version” : “IOSXE 3.16s”
    }
    ```

- **数字**

    数字表示任何的数值值。

    示例：

    ```json
    {    
        “received_prefix”: 1999
    }
    {    
        “cpu_utilization” : 99.9
    }
    ```

- **布尔值**

    布尔值表示真或假。

    示例：

    ```json
    {    
        “is_bgp_neighbor_active “ : true
    }
    {    
        “is_configuration_valid” : false
    }
    ```

- **空值**（`Null`)

    `Null` 表示空值。他们主要用于激活一些不需要任何值的特性。

    示例：

    ```json
    {    
        “ospf_area_authentication” : null
    }
    ```


- **数组**

    数组表示一些值的有序集合。数组中的值可以是任意值的组合；逗号分隔了数组内的值。方括号或括住值的列表。

    示例：

    ```json
    {    
        “hostnames” : [
            “MNL-RTR-21”,        
            “MNL-RTR-2”    
        ]
    }
    ```

- **对象**

    对象表示某一键值对；大括号会括主这一键值对，而对象中的值可以是任意类型。

    示例：

    ```json
    {    
        “device” : {        
            “hostname” : “MNL-RTR-1”    
        }
    }
    ```


数组和对象可以嵌套，从而形成复杂的数据结构。

在下面这个示例中，该数组便容纳了多个元素。

```json
[   
    [“Gi0/0/0/1”,”Gi0/0/0/2”,”Gi0/0/0/3”],    
    [“IOSXR”,”IOSXE”,”NXOS”],
]
```

在下面这个示例中，一个对象包含所有数据类型的样本。

```json
{    
    “device” : [        
        {            
            “hostname” : “MNL-RTR-1”,            
            “management_ip” : “1.1.1.1”,            
            “number_of_received_routes” : 20        
        },        
        {            
            “hostname” : “MNL-RTR-2”,            
            “management_ip” : “2.2.2.2”,            
            “number_of_received_routes” : 100        
        }
    ]
}
```

在创建 JSON 的数据时，建议通过使用诸如 [JSONLint - The JSON Validator](https://jsonlint.com/) 的某种 JSON 的验证器验证格式。

让我（作者）带咱们了解以下，我将如何为思科配置创建 JSON 数据。请注意，结构将取决于某一 API 所预期的数据。下面这个示例假设了这个 API 的开发者，将支持我们所创建的 JSON 数据。

示例 1：接口配置


```text
interface gi0/0/0/1
switchport mode access
switchport access vlan 1
no shutdown
interface gi0/0/0/2
switchport mode access
switchport access vlan 1
no shutdown
```

由于这一配置包含了多个接口，因此我们就会以一个列表结构开始。


```json
[]
```


由于某一列表可包含多个值，因此我们可将这两个接口的详细信息存储在其中。在列表内部，我们将存储两个对象。要记住在每个值后加上逗号。


```json
[
    {},
    {}
]
```


在这两个对象内部，我们可添加一些与设备配置匹配的键值对。要记住，键可以是任何的字符串值。这个示例中用到键，可能不同于咱们希望的命名。

- **端口** -- 我们创建了个名为 `interface_id` 的键，并添加了作为字符串值的 `gi0/0/1` 和 `gi0/0/2`；
- **接入端口或中继端口** —— 我们创建了一个名为 `type` 的键，并添加了 `access` 的字符串值；
- **Vlan** —— 我们创建了个名为 `vlan` 的键，并添加了一个值 1 的整数；
- **管理状态** —— 我们创建了个名为 `enable` 的键，并添加了个值 `true` 的布尔值。

```json
[  
    {    
        “interface_id”: “gi0/0/1”,    
        “type” : “access”,    
        “vlan” : 1,    
        “enable” : true  
    },  
    {    
        “interface_id”: “gi0/0/2”,    
        “type” : “access”,    
        “vlan” : 1,    
        “enable” : true  
    }
]
```

要通过使用某种 JSON 验证器，验证格式是否正确。


示例 2：访问控制列表的配置

```text
ip access-list extended test
permit ip host 2.2.2.2 host 3.3.3.3
permit tcp host 2.2.2.2 host 3.3.3.3 eq 80
```

由于这一配置仅包含访问控制列表，因此我们便可以一个对象结构开始。（译注：原文这里有拼写错误，“Because the configuration contains multiple interfaces, we can start with an object structure.”）

```json
{}
```

我们可以假设，这一配置后续将包含一些其他访问规则语句。因此我们创建了个有着名为 `access-list` 键的对象，而值将是一些放行或拒绝语句的列表。

```json
{
    "access-list": []
}
```


要记住，扩展的访问控制列表，包含了源的详细信息、目的地的详细信息，以及操作（其会放行还是拒绝）。


```json
{  
    “access-list”: [{    
        “action”: “”,    
        “source”: {},    
        “destination”: {}  
    }]
}
```

添加上各个键的值后，最终会得到如下内容：


```json
{  
    “access-list”: [{      
        “action”: “permit”,      
        “source”: {        
            “protocol”: “ip”,        
            “network”: “2.2.2.2”,        
            “wildcard”: “0.0.0.0”      
        },      
        “destination”: {        
            “port”: null,        
            “network”: “3.3.3.3”,        
            “wildcard”: “0.0.0.0”      
        }    
    },    
    {      
        “action”: “permit”,      
        “source”: {        
            “protocol”: “tcp”,        
            “network”: “2.2.2.2”,        
            “wildcard”: “0.0.0.0”      
        },      
        “destination”: {        
            “port”: 80,        
            “network”: “3.3.3.3”,        
            “wildcard”: “0.0.0.0”      
        }    
    }]  
}
```

要通过使用某种 JSON 验证器，验证格式是否正确。



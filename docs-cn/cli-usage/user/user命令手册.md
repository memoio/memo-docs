# MEMO User节点命令详解

# 前言

本文将详细介绍MEMO系统User节点的命令行功能使用；用户需要首先下载二进制并执行程序 **mefs-user** ，从而启动Memo User节点。

## 简介

查看User节点中可以使用的所有功能简介和用法

## 命令用法

使用以下命令即可查看所有命令

```shell
mefs-user -h
```

 **显示输出**

```shell
COMMANDS:
   init       Initialize a memoriae repo
   daemon     Run a network-connected Memoriae node.
   auth       Interact with auth
   wallet     Interact with wallet
   net        Interact with net
   config     Interact with config
   state      Interact with state manager
   role       Interact with role manager
   info       print information of this node
   register   register an account id for the wallet first, then register a role for it, at last, add it into a group.
   version    Print version
   backup     backup export or import
   bootstrap  bootstrap
   recover    recover
   log        Manage logging
   settle     Interact with settlement chain
   lfs        Interact with lfs
   order      Interact with order
   gateway    memo gateway
   restrict   Interact with restrict
   transfer   transfer eth or memo
   help, h    Shows a list of commands or help for one command
```

# 一 ：启动节点相关命令

## 1. init命令

### 简介

初始化节点；

此命令用于在指定路径创建一个钱包，如果此路径已经存在钱包信息，则会直接使用此已存在的钱包，而不会重新创建钱包。

### 命令用法

```shell
mefs-user init -h
```

**选项说明**

--setPass                               使用输入来设置密码（默认为：false）
--password value, --pwd value           输入用来访问的密码（默认为：memoriae）
--secretKey value, --sk value           使用密钥来初始化
--keyfile value, --kf value             使用密钥文件进行初始化
--kpw value                             使用密码来解析密钥文件
--help, -h                              查看更多帮助

**创建节点示例**

```shell
MEFS_PATH=~/.memo-user ./mefs-user init   --setPass=true
```

示例设置节点根目录为：~/.memo-user

## 2.daemon命令

### 简介

本命令功能是启动，停止节点

### 命令用法

```shell
mefs-user daemon start -h

COMMANDS:
   start    Start a running mefs daemon
   stop     Stop a running mefs daemon
   help, h  Shows a list of commands or help for one command
```

**选项说明**

--password value, --pwd value           使用注册时的密码（默认为：memoriae）
--api value                             设置要使用的api地址（默认为：/ip4/127.0.0.1/tcp/5001）
--secretKey value, --sk value           用私钥来创建节点，如果没有请初始化节点
--swarm-port value                      设置节点要使用的swarm端口（默认为：4001）
--group value                           设置节点要进入的组（默认为：0）
--price value                           设置价格（默认为：0，表示不修改config.json中的价格）
--secureAPI                             是否为安全的API（默认为：true） 
--help, -h                              查看更多帮助

**启动节点示例**

```shell
MEFS_PATH=~/.memo-user nohup ./mefs-user daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4001 --group=1 &> user.log 2>&1 &
```

## 3.wallet命令

### 简介

本命令实现了操作钱包的相关功能。

### 命令用法

```shell
mefs-user wallet -h

COMMANDS:
   new      create a new wallet address
   list     list all addrs
   default  print default wallet address
   export   export wallet secret key
   help, h  Shows a list of commands or help for one command
```

**子命令简介**

new                           创建一个新的钱包地址
list                          查看所有钱包地址
default                       显示默认钱包地址
export                        导出钱包私钥

**查看默认钱包地址**

```shell
mefs-user wallet default
```

**查看钱包私钥**

```shell
mefs-user wallet export $wallet
```

参数$wallet 为钱包地址

**查看钱包的加密上传密码**

注：

钱包的上传密码是在上传对象时选择，如果上传对象时指定使用aes1模式，则表示使用的是桶密码，如果指定aes2模式，则表示使用的是对象密码。在下载对象的时候，需要指定对应的加密模式（aes1/aes2）的密码。

此命令就是用于查看本钱包的桶密码(aes1)或者对象密码（aes2）。

```shell
mefs-user wallet generate
```

### 命令用法
```shell
NAME:
   mefs-provider wallet generate - generate decrypt key for lfs object

USAGE:
   mefs-provider wallet generate [command options] [wallet address (0x...)] [bucketID] [objectID] [stripeID]

OPTIONS:
   --password value, --pwd value  (default: "memoriae")
   --enc value                    encryption method (default: "aes2")
   --help, -h                     show help (default: false)
```

### 参数说明
wallet address: 钱包地址
bucketID： 桶id
objectID： 对象id
stripeID： 数据条带id
--password: 钱包密码
--enc: 加密模式

### 使用范例

以下命令查看本钱包的桶0的aes1模式上传密码（设置桶密码的时候objectID和stripeID要设置成0）

```shell
./mefs-user wallet generate --enc aes1 0x72104121e700Fb96E121a5960f25746e87c1943A 0 0 0
aes1 encrypt 0 0 0 is: 09a74f0547ff9d098f1753a83ed52310c16b79ca2ce9ca5b5459ffada7e2376c
```


## 4.config命令

### 简介

此命用于修改配置文件，仅在节点未启动时使用生效；若节点运行中修改config，则需要重启节点以使其生效；

配置文件所在路径：节点根目录下 ".memo-user/config.json"

```shell
mefs-user config -h

COMMANDS:
   set      Set config key
   get      Get config key
   help, h  Shows a list of commands or help for one command
```

### set子命令

set子命令用于设置配置文件中指定选项的值

```shell
mefs-user config set -h
```

**子命令简介**

NAME:
   mefs-user config set - Set config key

USAGE:
   mefs-user config set [command options] [arguments...]

OPTIONS:
   --key value    The key of the config entry (e.g. "api.address")
   --value value  The value with which to set the config entry
   --help, -h     show help (default: false)

配置示例：

配置 contract.endPoint的值

```shell
mefs-user config set --key=contract.endPoint --value="https://testchain.metamemo.one:24180"
```

### get子命令

此命令为获取指定配置项的值 

```shell
mefs-user config get -h
```

命令实例： 

获取contract.endPoint值

```shell
mefs-user config get --key=contract.endPoint
```

## 5.bootstrap命令

### 简介

此命令用于设置配置文件中的引导节点，可添加多个。

### 命令用法

```shell
mefs-user bootstrap -h

COMMANDS:
   list     list bootstrap addresses
   add      add bootstrap addresses
   clear    remove all bootstrap addresses
   help, h  Shows a list of commands or help for one command
```

**子命令简介**

list                 查看当前节点引导节点列表
add                  添加引导节点
clear                清空引导节点

**添加引导节点示例**

```shell
mefs-user bootstrap add "/ip4/103.xx.xx.xx/tcp/44006/p2p/12D3KooWQgakkyTFzcMh8JVbNK3FtiwJZz264sStq8QKBTeHwR3D"
```

## 6.gateway命令

### 简介

本命令为启动gateway（网关），等待节点同步完成之后才可成功访问

### 命令用法

```shell
mefs-user gateway -h

COMMANDS:
   run      run a memo gateway
   stop     stop a memo gateway
   help, h  Shows a list of commands or help for one command
```

**子命令简介**

run                  启动 gateway
stop                 停止Gateway

**命令选项**

```shell
mefs-user gateway run -h
```

**选项说明**

--username value, -n value                         输入访问网关的用户名（默认为：memo）
--password value, -p value                         输入访问网关的密码（默认为：memoriae）
--endpoint value, -e value                         输入网关的终端地址（默认为：0.0.0.0:5080）
--console value, -c value                          输入网关的控制台端口（默认为：8080）
--help, -h                                         查看更多帮助

命令示例

```shell
mefs-user gateway run -n memo -p memoriae -c 8080
```

访问端口127.0.0.1:8080 即访问user端控制台；

## 7.register命令

### 简介

此命令首先为钱包地址注册一个MEMO系统的账户ID，然后将该钱包账户注册为指定角色（User、Keeper、user），最后将该角色加入指定的group中；

请注意：User节点调用`daemon start`启动过程中会自动根据参数指定生成账户id、注册角色、加入group；

### 命令用法

```shell
NAME:
   mefs-user register - register an account id for the wallet first, then register a role for it, at last, add it into a group.

USAGE:
   mefs-user register [command options] [role (user/keeper/user)] [group index]

OPTIONS:
   --password value, --pwd value  the wallet password, used to restore sk from keystore (default: "memoriae")
   --help, -h
```

**选项说明**

--password value, -p value 输入keystore密码，从而从本地`keystore` 目录中解密出私钥`sk`（默认为：memoriae）
--help, -h 查看更多帮助

命令示例

```shell
mefs-user register --pwd=memoriae user 1
```

参数说明：pwd为钱包密码，user表示指定的角色为user，1为指定此节点加入group 1

# 二：状态查看相关命令

## 1.net命令

网络相关命令

```shell
./mefs-user net -h

COMMANDS:
   info      get net info
   connect   connet a peer
   peers     print peers
   findpeer  find peers
   declare   declare public network address
   help, h   Shows a list of commands or help for one command
```

### info子命令

该命令查看节点网络信息,命令用法：

```shell
mefs-user net info 
```

输出内容如下：

```shell
Network ID 12D3KooWEZcwTW77nh68369j3tQj3aYvgYdwM5ZQrsKFdt5fNP3d, IP [/ip4/172.xx.xx.xx/tcp/4001 /ip4/128.xx.xx.xx/tcp/39525 /ip4/10.xx.xx.xx/tcp/39525], Type: Private
```

### peers子命令

查看目前连接的所有节点的网络信息,命令用法：

```shell
mefs-user net peers
```

输出内容如下：

```shell
12D3KooWHXmKSneyGqE8fPrTmNTBs2rR9pWTdNcgVG3Tt5htJef7 [/ip4/121.xx.xx.xx/tcp/23456]
12D3KooWB5yMrUL6NG6wHrdR9V114mUDkpJ5Mp3c1sLPHwiFi6DN [/ip4/192.xx.xx.xx/tcp/4201]
```

### connect子命令

该命令手动连接到指定节点,命令用法：

关于peerID的构造解释：
首先使用net info命令查看节点的网络信息

```shell
./mefs-user net info
Network ID 12D3K..., IP [/ip4/xxx.xxx.xxx.xxx/tcp/xxx], Type: Private
```

那么此节点的peerID为：
/ip4/xxx.xxx.xxx.xxx/tcp/xxx/p2p/12D3K...

后面子命令中如果需要用到peerID，则按照此格式构造即可

```shell
mefs-user net connect -h
```

命令示例

```shell
mefs-user net connect /ip4/1.2.3.4/tcp/5678/p2p/12D..
```

### findpeer子命令

根据peerID查看节点信息,命令用法：

```shell
mefs-user net findpeer -h

USAGE:
   mefs-user net findpeer [command options] [peerID (12D...)]
```

peerID的构造见前面的命令说明。

**搜索示例：**

```shell
mefs-user net findpeer 12D3KooWHWKAGipKn9QCBEnNxf1ERhRud9qPsWTu9PqFrBm9A9kz
```

### declare子命令

用于user节点申明自己的公网ip地址；(仅user节点需要使用该命令)

```shell
./mefs-user net declare -h
NAME:
   mefs-user net declare - declare public network address

USAGE:
   mefs-user net declare [command options] [net address (/ip4/1.2.3.4/tcp/5678)]

OPTIONS:
   --help, -h  show help (default: false)
```

注：提供的ip地址必须为外网地址，提供的外网访问端口必须映射到本节点的启动时提供的swap port端口。

## 2.state命令

### 简介

此命令可查看自身资产状态等信息。

### 命令用法

```shell
mefs-user state -h
```

**子命令列表**

post          查看User与provider节点间存储订单的付费和惩罚信息       
pay           查看节点当前的存储账户余额和memo余额
withdraw      provider节点结算当前存储收益

## 3.role命令

### 简介

已连接节点的查看命令

### 命令用法

```shell
mefs-user role list
```

## 4.info命令

### 简介

此命令查看此节点基本信息

### 命令用法

```shell
mefs-user info -h
```

**选项说明**

​--update                      (default: false)
--all value,  -a value        展示节点所有info信息 (default: "false")
--help, -h                    查看更多帮助

**命令示例**

精简版

```shell
mefs-user info
```

完整版

```shell
mefs-user info -all true
```

## 5.settle命令

### 简介

节点质押、取款等操作

### 命令用法

```shell
mefs-user settle -h

COMMANDS:
   setDesc               Set description for a node. Especially for users, if desc is set to 'cloud', they will be selected as dc in buckets preferentially.
   withdraw              withdraw memo from fs
   pledgeAdd             add pledge value
   pledgeGet             get pledge information
   pledgeWithdraw        move pledge value to fs, then call settle withdraw
   pledgeRewardWithdraw  move pledge reward value to fs, then call settle withdraw
   quitRole              change its state to inactive, this op is invocatable and daemon will fail at next start
   alterPayee            alter current payee to a new one, need to be comfirmed by new payee to finish.
   help, h               Shows a list of commands or help for one command
```

**子命令列表**

   setDesc                       节点设置描述
   withdraw                      将文件系统的token取出至(Erc20)钱包
   pledgeAdd                     增加质押
   pledgeGet                     查看当前质押
   pledgeWithdraw                将质押的token取出到Fs文件系统
   pledgeRewardWithdraw          将质押收益提取到Fs文件系统
   quitRole                      注销当前角色，地址、token信息保留
   alterPayee                    alter payee
   help, h                       查看更多帮助

**命令用例**

- pledgeAdd

质押1Memo

```shell
mefs-user settle pledgeAdd "1 Memo"
```

参数说明：金额参数要使用引号，金额和单位之间要有一个空格，单位不区分大小写，可以是Memo, NanoMemo, AttoMemo，它们之间的关系为：1 
Memo=10^9*NanoMemo=10^18*AttoMemo

- pledgeGet 

查看节点质押信息

```shell
mefs-user settle pledgeGet
```

- pledgeWithdraw  

取出0.5Memo的质押到Fs账户

```shell
mefs-user settle pledgeWithdraw "0.5 Memo"
```

参数说明：金额参数要使用引号，金额和单位之间要有一个空格，单位不区分大小写，可以是Memo, NanoMemo, AttoMemo，它们之间的关系为：1 
Memo=10^9*NanoMemo=10^18*AttoMemo

- pledgeRewardWithdraw  

取出0.5Memo的质押奖励到Fs账户

```shell
mefs-user settle pledgeRewardWithdraw "0.5 Memo"
```

参数说明：金额参数要使用引号，金额和单位之间要有一个空格，单位不区分大小写，可以是Memo, NanoMemo, AttoMemo，它们之间的关系为：1 
Memo=10^9*NanoMemo=10^18*AttoMemo

- withdraw

将Fs文件系统的0.5memo取出至(Erc20)钱包

```shell
mefs-user settle withdraw "0.5 Memo"
```

参数说明：金额参数要使用引号，金额和单位之间要有一个空格，单位不区分大小写，可以是Memo, NanoMemo, AttoMemo，它们之间的关系为：1 
Memo=10^9*NanoMemo=10^18*AttoMemo

- quitRole 

此命令使节点退出目前的角色，此时将不再能使用角色相关功能。但钱包余额不受影响，并且对于user和keeper角色，此时能够取出注册角色时提供的角色质押金额。

```shell
mefs-user settle quitRole --really-do-it
```

## 6.version命令

### 简介

查看当前节点版本

### 命令用法

```shell
mefs-user version
```

## 7.order命令

### 简介

查看订单相关信息

```shell
mefs-user order

COMMANDS:
   jobList  list jobs of all pros
   payList  list pay infos all pros
   get      get order info of one user
   detail   get detail order seq info of one user
   proList  list all pros
   help, h  Shows a list of commands or help for one command
```

### jobList子命令

列出所有任务信息

```shell
mefs-user order jobList
```

### payList子命令

列出所有与user节点的订单状态

```shell
mefs-user order payList
```

### proList子命令

列出所有user状态信息

```shell
mefs-user order proList
```

### get子命令

查看指定user的订单信息

```shell
mefs-user order get [command options] [user index required]
```

查看与指定user的交易信息；示例

```shell
mefs-user order get 13
```

### detail子命令

查看订单的细节信息

```shell
 mefs-user order detail [command options] [user index required] [order nonce] [seq number]
```

# 三：user日常使用命令

## 1.lfs命令

### 简介

此命令为user创建，上传，下载，查看容器和文件的集合命令。

```shell
 mefs-user lfs

COMMANDS:
   createBucket    create bucket
   listBuckets     list buckets
   headBucket      head bucket info
   putObject       put object
   headObject      head object
   getObject       get object
   listObjects     list objects
   delObject       delete object
   downloadObject  download object using rpc
   showStorage     show storage info
   getPros         get pros of bucket
   help, h         Shows a list of commands or help for one command
```

### createBucket子命令

此命令为创建桶

```shell
mefs-user lfs createBucket -h
```

**选项说明**

--bucket value, --bn value                  设置桶名
--policy value, --pl value                  设置纠删码（1）或者多副本策略（2）（默认为1）
--datacount value, --dc value               设置数据块数量（默认为3）
--paritycount value, --pc value             设置校验块数量（默认为2）

桶创建示例：

桶名称：test，存储策略：纠删码，数据块数量：10，校验块数量5

```shell
mefs-user lfs createBucket  --bn=test  --pl=1 --dc==10 --pc=5
```

### listBuckets子命令

此命令为查看所有桶状态

```shell
mefs-user lfs listBuckets
```

### headBucket子命令

此命令为查看指定桶的所有信息，下面为示例（test为桶名）

```shell
mefs-user lfs headBucket   --bn=test
```

### putObject子命令

此命令为上传指定文件

```shell
 mefs-user lfs putObject -h
```

--bucket value, --bn value            使用桶名
--object value, --on value            上传后文件名
--path value                          上传文件路径
--etag value                          选择校验方法（默认为：md5）
--enc value                           选择加密方式（默认为：aes）
--help, -h                            查看帮助

**上传示例**

```shell
mefs-user lfs putObject --bn=test --on=1   --path=./index.txt
```

### headObject子命令

此命令为查看指定文件状态

```shell
mefs-user lfs headObject -h
```

--bucket value, --bn value                    查看的桶名
--object value, --on value                    查看的文件名
--all                                         查看所有信息（默认为否）
--help, -h                                    查看帮助                     

**查看示例**

```shell
mefs-user lfs headObject  --bn=test --on=1
```

### getObject子命令

下载文件到指定路径

```shell
 mefs-user lfs getObject [command options] [arguments...]
```

```shell
--bucket value, --bn value                桶的名称
--object value, --on value                桶中文件名称
--etag value, --cid value, --md5 value    数据etag
--start value                             选择下载文件长度的起始位置
--length value                            下载文件的长度
--path value                              下载文件的存放路径
--decrypt value                           下载密码
--userID value                            userID
--bucketID value                          bucketID
--objectID value                          objectID
--help, -h                                查看帮助
```

注意

--etag选项可以使用cid或者md5来代替，他们具有相同的意义。

--decrypt选项是上传对象时设置的桶密码或者对象密码，如果上传对象的时候使用了bucket密码，那么objectID设置的值将不会生效。

**下载示例**

示例1

下载未加密上传的对象。

```shell
mefs-user lfs getObject --bn=test --on=1  --path=./index.html
```

示例2

使用etag和密码下载一个加密上传的对象。

```shell
./mefs-user lfs getObject --md5 f1c9645dbc14efddc7d8a322685f26eb --userID 36 --bucketID 0 --objectID 1 --decrypt  09a74f0cd7ff9d098f1753a83ed523d0c16b79ca2ce9ca5b5459ffada7e2376c --path aa
```

### listObjects子命令

查看指定桶的所有文件信息

```shell
mefs-user lfs listObjects -h
```

--bucket value, --bn value             要查看桶的名称
--marker value            
--prefix value                         过滤文件名称
--delimiter value                      文件输出分隔
--maxKeys value                        输出文件的最大数量（默认为1000）
--help, -h                             查看帮助

**列出所有文件示例**

```shell
mefs-user lfs listObjects
```

### delObject子命令

删除指定文件

```shell
mefs-user lfs delObject -h
```

--bucket value, --bn value            删除文件的桶名
--object value, --on value            删除文件名

### downloadObject子命令

使用rpc下载对象

```shell
mefs-user lfs downloadObject [command options] [arguments...]
```

--bucket value, --bn value              桶的名称
--object value, --on value              桶中文件名称
--cid value                             文件cid
--start value                           选择下载文件长度的起始位置
--length value                          下载文件的长度
--path value                            指定下载路径及文件名称
--help, -h                              查看帮助

### showStorage子命令

显示节点的存储信息

### getPros子命令

查看桶的user列表

## 2.recover命令

### 简介

用于节点启动异常时尽量修复db
警告：不要异常退出节点，想退出节点时应该使用daemon stop命令正常退出。否则可能导致db损坏而无法修复

### 命令用法

```shell
mefs-user recover db -h
```

--path         指定修复的数据库路径
--deType       修复数据的类型(meta 或者 state)

**命令示例**

修复state数据库

```shell
mefs-user recover db --path=/root/.memo-user/state --dbType=state
```

## 3.backup命令

### 简介

节点关闭时使用；

导入/导出state(或meta)数据库。

### export

将状态数据库导出到文件中，使用方法如下：

```shell
mefs-user backup export -h
```

--path          备份数据库文件的存储路径
--dbType        要导出的数据库类型meta或则state（默认为：state）

**命令示例**

导出state数据库至当前目录

```shell
mefs-user backup export --path=./ --dbType=state
```

### import

从文件中导入数据库，使用方法如下：

```shell
mefs-user backup import -h
```

--path          导入数据库文件的存放路径
--dbType        导入的数据库类型：meta或则state（默认为：state）

**命令示例**

导入state数据库

```shell
mefs-user backup import --path=./state-xxxxxxxxx.db --dbType=state
```

## 4.restrict命令

### 简介

user节点设置白名单功能，创建桶时，优先选择白名单内节点。

### 命令用法

```shell
mefs-user restrict -h
```

**子命令列表**

   list             查看白名单节点
   add              添加白名单节点
   delete           删除白名单节点
   has              检查节点是否在白名单内
   set              设置白名单状态
   stat             查看白名单状态
   help, h          查看更多帮助

**命令示例**

检查白名单状态

```shell
mefs-user restrict stat
```

开启白名单功能

```shell
mefs-user restrict set --enable
```

添加user节点至白名单

```
mefs-user restrict add PID
```

参数PID为要添加至白名单的user节点ID

查看白名单内节点

```shell
mefs-user restrict list
```

查看节点是否在当前白名单内

```shell
mefs-user restrict has PID
```

参数PID为要添加至白名单的user节点ID

删除白名单节点

```shell
mefs-user restrict delete PID
```

参数PID为要添加至白名单的user节点ID

关闭白名单功能

```shell
mefs-user restrict set disable
```

# 四：其他命令

## 1.auth命令

### 简介

查询节点的token文件值，token文件位于节点根目录下，普通用户不用关注此值。

### 命令用法

```shell
mefs-user auth info
```

**输入结果**

```shell
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.5nj0IsRixm8trR7jryyRNLU78w4cvZ1zWHyjBoFmmZE
```

## 2.log命令

### 简介

此命令用于设置日志级别。
不同级别显示不同告警级别的日志信息，默认为info级别，只显示正常状态信息，普通用户应使用info日志级别。
debug/warn/error级别供开发人员使用以查看详细报错日志，此级别会产生大量日志，不能长期处于debug模式，否则会大量占用磁盘空间，不建议普通用户使用。

### 命令用法

```shell
mefs-user log setLevel -h
```

**选项**

mefs-user log setLevel level (debug/info/warn/error)

设置等级实例：

```shell
mefs-user log setLevel debug
```

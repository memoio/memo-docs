# CommandLine Mannual for User

## 1 Preface

This article will introduce in detail the use of the command line function of the User-Node of the MEMO system; the user needs to download the binary and execute the program 'mefs-user' to start a Memo User-Node.

Usage

Use the following command to view all commands

```shell
mefs-user -h

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

## 2 Start-node related commands

### 2.1 init

Introduction

Used to create a wallet in the specified path. If the wallet information already exists in this path, the existing wallet will be used directly without recreating the wallet.
Assign the MEFS_PATH environment virable to specify a path for this node.

Usage

```shell
mefs-user init -h
```

Options

```shell
   --setPass     set password using input (default: false)
   --password value, --pwd value  set password for access secret key (default: "memoriae")
   --secretKey value, --sk value  secret key
   --keyfile value, --kf value   absolute path of keyfile
   --kpw value      password to decrypt keyfile
   --help, -h       show help (default: false)
```

Example

```shell
MEFS_PATH=~/.memo-user ./mefs-user init   --setPass=true
```

The example sets the root directory of the node to: ~/.memo-user

### 2.2 daemon

Introduction

The command is used to start and stop an User-Node

Usage

```shell
mefs-user daemon start -h

COMMANDS:
   start    Start a running mefs daemon
   stop     Stop a running mefs daemon
   help, h  Shows a list of commands or help for one command
```

Options

```shell
--password value, --pwd value Use the password when registering (default: memoriae) 
--api value Set the api address to use (default: /ip4/127.0.0.1/tcp/5001) 
--secretKey value, --sk value Use the private key to create the node, if not, please initialize the node 
--swarm-port value Set the swarm port to be used by the node (default: 4001) 
--group value Set the group the node will enter (default: 0 ) 
--price value set the price (default: 0, means not modify the price in config.json) 
--secureAPI Whether it is a secure API (default: true) 
--help, -h View more help
```

Example

```shell
MEFS_PATH=~/.memo-user nohup ./mefs-user daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4001 --group=1 &> user.log 2>&1 &
```

### 2.3 wallet

Introduction

This command implements the related functions of operating the wallet.

Usage

```shell
mefs-user wallet -h

COMMANDS:
   new      create a new wallet address
   list     list all addrs
   default  print default wallet address
   export   export wallet secret key
   help, h  Shows a list of commands or help for one command
```
Subcommands

#### 2.3.1 wallet new 

Introduction

Create a new wallet address 

#### 2.3.2 wallet list 

Introduction

View all wallet addresses default Display 

#### 2.3.3 wallet default 

Introduction

View the default wallet address

Example

```shell
mefs-user wallet default
```

#### 2.3.4 wallet export 

Introduction

Export the wallet's private key

Example 

```shell
mefs-user wallet export wallet-address
```

Parameter wallet-address is the wallet address of the node.

#### 2.3.5 wallet generate

```shell
mefs-user wallet generate
```

Introduction

View the bucket/object password for uploading.
The enc mode is set when upload object. If enc mode is set to aes1, then bucket password is selected for uploading, on the other hand, if enc mode is set to aes2, then object password is selected for uploading. Right password should be used for downloading encrypted objects.

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

--enc: encrypt mode, aes1 for using bucket password, aes2 for using object password.

Note:
If the password is set for a bucket, the objectID and StripeID should be set to 0.
If the passwrod is set for an object, the stripeID should be set to 0.

Example

Check the aes1 mode uploading password.

```shell
./mefs-user wallet generate --enc aes1 0x72104121e700Fb96E121a5960f25746e87c1943A 0 0 0
aes1 encrypt 0 0 0 is: 09a74f0547ff9d098f1753a83ed52310c16b79ca2ce9ca5b5459ffada7e2376c
```

### 2.4 config

Introduction

This command is used to modify the configuration file, which takes effect only when the node is not started; if the config is modified while the node is running, the node needs to be restarted to make it take effect;

The path where the configuration file is located: config.json in the root directory of the node which is specified when init the node.

Usage

```shell
mefs-user config -h

COMMANDS:
   set      Set config key
   get      Get config key
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 2.4.1 config set

Introduction

The set subcommand is used to set the value of the specified option in the configuration file

Usage

```shell
mefs-user config set -h
```

Options

```shell
--key value The key of the config entry (eg "api.address") 
--value value The value with which to set the config entry 
--help, -h show help (default: false)
```

Example

Configure the value of contract.endPoint

```shell
mefs-user config set --key=contract.endPoint --value="https://testchain.metamemo.one:24180"
```

#### 2.4.2 config get

Introduction

This command is used to get the value of the specified configuration item

Usage

```shell
mefs-user config get -h
```

Example

Get the contract.endPoint value

```shell
mefs-user config get --key=contract.endPoint
```

### 2.5 bootstrap

Introduction

This command is used to set the bootstrap node in the configuration file, multiple bootstrap nodes can be added.

Usage

```shell
mefs-user bootstrap -h

COMMANDS:
   list     list bootstrap addresses
   add      add bootstrap addresses
   clear    remove all bootstrap addresses
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 2.5.1 list 

Introduction

View the current node bootstrap node list 

#### 2.5.2 add 

Introduction

Add a bootstrap node

Example

```shell 
mefs-user bootstrap add "/ip4/103.xx.xx.xx/tcp/44006/p2p/12D3KooWQgakkyTFzcMh8JVbNK3FtiwJZz264sStq8QKBTeHwR3D"
```

#### 2.5.3 clear 

Introduction

clear the bootstrap node

### 2.6 gateway

Introduction

This command is used to start the gateway for an user node, and it can only be successfully accessed after the node synchronization is completed.

Usage

```shell
mefs-user gateway -h

COMMANDS:
   run      run a memo gateway
   stop     stop a memo gateway
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 2.6.1 run 

Introduction

starts the gateway 

Usage

```shell
mefs-user gateway run -h
```

Options

```shell
--username value, -n value Enter the username to access the gateway (default: memo) 
--password value, -p value Enter the password to access the gateway (default: memoriae) 
--endpoint value, -e value Enter the gateway's Terminal address (default: 0.0.0.0:5080) 
--console value, -c value Enter the console port of the gateway (default: 8080) 
--help, -h View more help
```

Example

```shell
mefs-user gateway run -n memo -p memoriae -c 8080
Access port 127.0.0.1:8080 to access the user console;
```

#### 2.6.2 stop 

Introduction

stops the Gateway

### 2.7 register

Introduction

This command first registers a MEMO system account ID for the wallet address, then registers the wallet account as a specified role (User, Keeper, user), and finally adds the role to the specified group;

Note: daemon startDuring the start-up process of the User node call, the account id, registration role, and joining the group will be automatically generated according to the parameters specified;

Usage

```shell
   mefs-user register [command options] [role (user/keeper/user)] [group index]

   --password value, --pwd value  the wallet password, used to restore sk from keystore (default: "memoriae")
   --help, -h
```

Options

```shell
keystore--password value, -p value Enter the keystore password to decrypt the private key from the local directory sk(default: memoriae) --help, -h View more help
```

Example

```shell
mefs-user register --pwd=memoriae user 1
Parameter description: pwd is the wallet password, user indicates that the specified role is user, and 1 indicates that this node joins group 1
```

## 3 Status View Related Commands

### 3.1 net

Introduction

Network related commands

Usage

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

Subcommands

#### 3.1.1 info

Introduction

This command checks node network information

Usage

```shell 
mefs-user info -h

USAGE:
   mefs-user info command [command options] [arguments...]

COMMANDS:
   self     print node id
   help, h  Shows a list of commands or help for one command
```

Example

```shell
mefs-user net info 

Network ID 12D3K..., IP [/ip4/172.xx.xx.xx/tcp/4001 /ip4/128.xx.xx.xx/tcp/39525 /ip4/10.xx.xx.xx/tcp/39525], Type: Private
```

'12D3K...' here is the peerID of this node.

```shell 
mefs-user net info self

ID:  26 User 2
```

#### 3.1.2 peers

Introduction

Show the network information of all nodes currently connected.

Usage

```shell
mefs-user net peers

12D3KooWHXmKSneyGqE8fPrTmNTBs2rR9pWTdNcgVG3Tt5htJef7 [/ip4/121.xx.xx.xx/tcp/23456]
12D3KooWB5yMrUL6NG6wHrdR9V114mUDkpJ5Mp3c1sLPHwiFi6DN [/ip4/192.xx.xx.xx/tcp/4201]
```

#### 3.1.3 connect

Introduction

This command connects to a specified node manually.

Usage

```shell 
mefs-user net connect -h

USAGE:
   mefs-user net connect [command options] [peer multiaddr (/ip4/1.2.3.4/tcp/5678/p2p/12D...)]
```

Note

About how to construction the multiaddr for a node.

First use the net info command to view the network information of the node.

```shell
./mefs-user net info
Network ID 12D3K..., IP [/ip4/1.2.3.4/tcp/5678/], Type: Private
```

And the multiaddr of this node is:

```shell
/ip4/1.2.3.4/tcp/5678/p2p/12D3K...
```

#### 3.1.4 findpeer

Introduction

View node information according to peerID, command usage:

Usage

```shell
mefs-user net findpeer -h

USAGE:
   mefs-user net findpeer [command options] [peerID (12D...)]
```

Example

```shell
mefs-user net findpeer 12D3KooW...
```

#### 3.1.5 declare

Introduction

Used for the user node to declare its own public network ip address; (only the user node needs to use this command)

Usage

```shell
./mefs-user net declare -h

NAME:
   mefs-user net declare - declare public network address

USAGE:
   mefs-user net declare [command options] [net address (/ip4/1.2.3.4/tcp/5678)]
```

### 3.2 state

Introduction

This command interacts with state db to obtain pay and penalty information about this node, or settle current income of this node.

Usage

```shell
mefs-provider state -h

COMMANDS:
   post      list post
   pay       list pay
   withdraw  provider income of storing data
   help, h   Shows a list of commands or help for one command
```

Subcommands

#### 3.2.1 post

This command is used to read from state db to get the payment and penalty information of storage orders between user and provider nodes.

#### 3.2.2 pay

This command is used to read from state db to show the current balance in fs and in memo token.

#### 3.2.3 withdraw

This command is used for provider nodes to settle the current storage income.

### 3.3 role

Introduction

View commands for connected nodes

#### 3.3.1 list

Introduction

This command is used to list connected roles

Usage 

```shell
mefs-provider role list
```

#### 3.4 info

Introduction

This command checks the basic information of this node

Usage

```shell
mefs-provider info -h
```

Options

```shell
​--update (default: false) 
--all value, -a value Display all info information of the node (default: "false") 
--help, -h View more help
```

Example

```shell
mefs-provider info
```
or

```shell
mefs-provider info -all true
```

### 3.5 settle

Introduction

Node pledge, withdrawal and other operations.

Usage

```shell
mefs-provider settle -h

COMMANDS:
   setDesc               Set description for a node. Especially for providers, if desc is set to 'cloud', they will be selected as dc in buckets preferentially.
   withdraw              withdraw memo from fs
   pledgeAdd             add pledge value
   pledgeGet             get pledge information
   pledgeWithdraw        move pledge value to fs, then call settle withdraw
   pledgeRewardWithdraw  move pledge reward value to fs, then call settle withdraw
   quitRole              change its state to inactive, this op is invocatable and daemon will fail at next start
   alterPayee            alter current payee to a new one, need to be comfirmed by new payee to finish.
   help, h               Shows a list of commands or help for one command
```

Subcommands

Note

About parameter 'amount' in subcommands

Quotes should be used for the amount parameter, and there must be a space between the amount and the unit. The unit is not case-sensitive. It can be Memo, NanoMemo, AttoMemo. The relationship between them is: 1 Memo=10^9 NanoMemo=10 ^ 18 AttoMemo


#### 3.5.1 setDesc 

Introduction

Used to set the description for a node.

#### 3.5.2 pledgeAdd

Introduction

Used to pledge some Memo for this node. Efficiant amount of Memo in wallet is required.

Usage

```shell
USAGE:
   mefs-provider settle pledgeAdd [command options] [amount (Memo / NanoMemo / AttoMemo) required]
```

Example

To pledge 1 Memo for this node.

```shell
mefs-provider settle pledgeAdd "1 Memo"
```

#### 3.5.3 pledgeGet

Introduction

View the current pledge amount.

Example

```shell
mefs-provider settle pledgeGet
```

#### 3.5.4 pledgeWithdraw

Introducton

Take out some pledged Memo from pledge balance to fs balance.

Example

Withdraw the pledge of 0.5 Memo to the Fs account

```shell
mefs-provider settle pledgeWithdraw "0.5 Memo"
```

#### 3.5.5 pledgeRewardWithdraw

Introduction

pledgeRewardWithdraw Withdraw the pledge income to the FS file system.

Example

Withdraw 0.5Memo of pledge reward to Fs account
```shell
mefs-provider settle pledgeRewardWithdraw "0.5 Memo"
```

#### 3.5.6 withdraw

Introduction

withdraw Take out the token of the file system to the (Erc20) wallet 

Example

Take out 0.5memo of the Fs file system to the (Erc20) wallet
```shell
mefs-provider settle withdraw "0.5 Memo"
```

#### 3.5.7 quitRole

Introduction

This command makes the node exit the current role. Wallet address and the balance in it is not effected.

Caution

Role-related functions will no longer be available at this time. However, the wallet balance will not be affected.
For providers and keepers, the role pledge amount provided when registering the role can be withdrawn after run quitRole.

Example

```shell
mefs-provider settle quitRole --really-do-it
```

#### 3.5.8 alterPayee 

Introduction

alterPayee used to change the current payee.

### 3.6 version

Introduction

View current node version

Usage

```shell
mefs-provider version
```

### 3.7 order

Introduction

View order related information

Usage

```shell
mefs-provider order

COMMANDS:
   jobList  list jobs of all pros
   payList  list pay infos all pros
   get      get order info of one provider
   detail   get detail order seq info of one provider
   proList  list all pros
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 3.7.1 jobList

Introduction

List all task information

Usage

```shell
mefs-provider order jobList
```

#### 3.7.2 payList

Introductoion

List all order statuses with provider nodes

Usage

```shell
mefs-provider order payList
```

#### 3.7.3 proList

Introduction

List all provider status information

Usage

```shell
mefs-provider order proList
```

#### 3.7.4 get

Introduction

View the order information of the specified provider

Usage

```shell
mefs-provider order get [command options] [provider index required]
```

Example

```shell
mefs-provider order get 13
```

#### 3.7.5 detail

Introduction

View order details

Usage

```shell
mefs-provider order detail [command options] [provider index required] [order nonce] [seq number]
```

## 4 user daily used commands

### 4.1 lfs

Introduction

This command creates, uploads, downloads, and views a collection of containers and files for the user.

Usage

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

Subcommands

#### 4.1.1 createBucket

Introduction

This command creates buckets

Usage

```shell
mefs-user lfs createBucket -h
```

Options

```shell
--bucket value, --bn value set bucket name 
--policy value, --pl value set erasure code (1) or multi-copy policy (2) (default is 1) 
--datacount value, --dc value set Number of data blocks (default is 3) 
--paritycount value, --pc value Set the number of parity blocks (default is 2)
```

Example

Bucket name: test, storage policy: erasure code, number of data blocks: 10, number of check blocks 5

```shell
mefs-user lfs createBucket  --bn=test  --pl=1 --dc==10 --pc=5
```

#### 4.1.2 listBuckets

Introduction

This command is used to view the status of all buckets

Usage

```shell
mefs-user lfs listBuckets
```

#### 4.1.3 headBucket

Introduction

This command is used to view all the information of the specified bucket, the following is an example (test is the bucket name)

Usage

```shell
mefs-user lfs headBucket   --bn=test
```

#### 4.1.4 putObject

Introduction

This command specifies the file for upload

Usage

```shell
mefs-user lfs putObject -h
```

USAGE:
   mefs-user lfs putObject [command options] [arguments...]

OPTIONS:
--bucket value, --bn value use bucket name 
--object value, --on value file name after upload 
--path value upload file path 
--etag value select verification method (default: md5) 
--enc value Select encryption method (default: aes) 
--help, -h View help
```

Example

```shell
mefs-user lfs putObject --bn=test --on=1   --path=./index.txt
```

#### 4.1.5 headObject

Introduction

This command is used to view the specified file status

Usage

```shell
mefs-user lfs headObject -h

USAGE:
   mefs-user lfs headObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --all                       show all information (default: false)
   --help, -h                  show help (default: false)
```

Example

```shell
mefs-user lfs headObject  --bn=test --on=1
```

#### 4.1.6 getObject

Introduction

Download the file to the specified path

Usage

```shell
NAME:
   mefs-user lfs getObject - get object

USAGE:
   mefs-user lfs getObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value              bucketName
   --object value, --on value              objectName
   --etag value, --cid value, --md5 value  etag (cid or md5)
   --start value                           start position (default: 0)
   --length value                          read length (default: -1)
   --path value                            stored path of file
   --decrypt value                         decrypt
   --userID value                          userID
   --bucketID value                        bucketID
   --objectID value                        objectID
   --help, -h                              show help (default: false)
```

Note

--etag option here can be substituted by cid or md5, all of them has the same meaning.
If bucket password is used(aes1 is set when putObject), the value of --objectID is ommited.

--decrypt option is the bucket/object password set when putObject.

Example 1

Download an object without etag.

```shell
mefs-user lfs getObject --bn=test --on=1  --path=./index.html
```

Example 2

Download an object with etag and password.

./mefs-user lfs getObject --md5 f1c9645dbc14efddc7d8a322685f26eb --userID 36 --bucketID 0 --objectID 1 --decrypt  09a74f0cd7ff9d098f1753a83ed523d0c16b79ca2ce9ca5b5459ffada7e2376c --path aa


#### 4.1.7 listObjects

Introduction

View all file information of a specified bucket

Usage

```shell
USAGE:
   mefs-user lfs listObjects [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucket name, priority
   --marker value              key start from, marker should exist
   --prefix value              prefix of objects
   --delimiter value           delimiter to group keys: '/' or ''
   --maxKeys value             number of objects in return (default: 1000)
   --help, -h                  show help (default: false)
```

Example

```shell
mefs-user lfs listObjects
```

#### 4.1.8 delObject

Introductioin

delete specified file

Usage

```shell
USAGE:
   mefs-user lfs delObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --help, -h                  show help (default: false)
```

Example

```shell
mefs-user lfs delObject --bn=test --on=1
```

#### 4.1.9 downloadObject

Introduction

Download objects using rpc

Usage

```shell
USAGE:
   mefs-user lfs downloadObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --cid value                 cid name
   --start value               start position (default: 0)
   --length value              read length (default: -1)
   --path value                stored path of file
   --help, -h                  show help (default: false)
```

Example

```shell
mefs-user lfs getObject --bn=test --on=1 --path=./index.html
```

#### 4.1.10 showStorage

Introduction

Display the storage information of the node

#### 4.1.11 getPros

Introduction

View the bucket user list

### 4.2 recover

Introduction

It is used to repair the db as much as possible when the node starts abnormally. Warning: Do not exit the node abnormally. When you want to exit the node, you should use the daemon stop command to exit normally. Failure to do so may result in db corruption beyond repair

Usage

```shell
mefs-user recover db -h
--path specifies the database path to repair --deType the type of repair data (meta or state)
```

Example

Repair state database

```shell
mefs-user recover db --path=/root/.memo-user/state --dbType=state
```

### 4.3 backup

Introduction

Used when the node is down. Import/export state (or meta) database.

Subcommands

#### 4.3.1 export

Introduction

Export the state database to a file, using the following method:

Usage

```shell
mefs-user backup export -h

USAGE:
   mefs-user backup export [command options] [arguments...]

OPTIONS:
   --path value    path to store
   --dbType value  export dbtype: meta or state (default: "state")
   --help, -h      show help (default: false)
```

Example

Export the state database to the current directory

```shell
mefs-user backup export --path=./ --dbType=state
```

#### 4.3.2 import

Introduciton

To import a database from a file, use the following method:

Usage

```shell
mefs-user backup import -h

USAGE:
   mefs-user backup import [command options] [arguments...]

OPTIONS:
   --path value    path of file import from
   --dbType value  export dbtype: meta or state (default: "state")
   --help, -h      show help (default: false)
```

Example

import state database

```shell
mefs-user backup import --path=./state-xxxxxxxxx.db --dbType=state
```

### 4.4 restrict

Introduction

The user node sets the whitelist function. When creating a bucket, the nodes in the whitelist are given priority.

Usage

```shell
mefs-user restrict -h

USAGE:
   mefs-user restrict command [command options] [arguments...]

COMMANDS:
   list     list all accepted users/providers
   add      add node(s) to restrict list
   delete   remove node(s) from restrict list
   has      test whether node(s) in restrict list
   set      enable/disable restrict
   stat     restrict stat(enable/disable)
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 4.4.1 list 

Introduction

View whitelist node 

Example

View the nodes in the whitelist

```shell
mefs-user restrict list
```

#### 4.4.2 add 

Introduction

Add whitelist node 

Example

Add user node to whitelist

```shell
mefs-user restrict add PID
```
The parameter PID is the user node ID to be added to the whitelist


#### 4.4.3 delete 

Introduction

delete whitelist node 

Example

Delete whitelist nodes

```shell
mefs-user restrict delete PID
```
The parameter PID is the user node ID to be added to the whitelist


#### 4.4.4 has 

Introduction

Check whether the node is in the whitelist 

Example

Check whether the node is in the current whitelist

mefs-user restrict has PID
The parameter PID is the user node ID to be added to the whitelist

#### 4.4.5 set 

Introduction

Set whitelist status 

Example

Enable the whitelist function

```shell
mefs-user restrict set --enable
```

Turn off the whitelist function

```shell
mefs-user restrict set disable
```
#### 4.4.6 stat 

Introduction

Check whitelist status 

Example

Check whitelist status

```shell
mefs-user restrict stat
```

## 5 Other commands

### 5.1 auth

Introduction

Query the value of the token file of the node. The token file is located in the root directory of the node. Ordinary users do not need to pay attention to this value.

Usage

```shell
mefs-user auth info -h

USAGE:
   mefs-user restrict command [command options] [arguments...]

COMMANDS:
   list     list all accepted users/providers
   add      add node(s) to restrict list
   delete   remove node(s) from restrict list
   has      test whether node(s) in restrict list
   set      enable/disable restrict
   stat     restrict stat(enable/disable)
   help, h  Shows a list of commands or help for one command
```

### 5.2 log command

Introduction

This command is used to set the log level. Different levels display log information of different alarm levels. The default is info level, which only displays normal status information. Ordinary users should use info log level. The debug/warn/error level is used by developers to view detailed error logs. This level will generate a large number of logs and cannot be in debug mode for a long time, otherwise it will take up a lot of disk space. It is not recommended for ordinary users to use.

Subcommands 

#### 5.2.1 setLevel

Usage

```shell
mefs-user log setLevel -h

NAME:
   mefs-user log setLevel - Set log level

USAGE:
   mefs-user log setLevel [command options] [level (debug/info/warn/error)]
```

Example

```shell
mefs-user log setLevel debug
```

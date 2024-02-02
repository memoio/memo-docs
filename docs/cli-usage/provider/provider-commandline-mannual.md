# CommandLine Mannual for Prefaceprovider

## 1 Preface

This article will introduce in detail the use of the command line function of the provider-Node of the MEMO system; the provider needs to download the binary and execute the program 'mefs-provider' to start a Memo provider-Node.

Usage

Use the following command to view all commands

```shell
mefs-provider -h

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
   order      Interact with order
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
mefs-provider init -h
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
MEFS_PATH=~/.memo-provider ./mefs-provider init   --setPass=true
```

The example sets the root directory of the node to: ~/.memo-provider

### 2.2 daemon

Introduction

The command is used to start and stop an provider-Node

Usage

```shell
mefs-provider daemon start -h

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
MEFS_PATH=~/.memo-provider nohup ./mefs-provider daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4001 --group=1 &> provider.log 2>&1 &
```

### 2.3 wallet

Introduction

This command implements the related functions of operating the wallet.

Usage

```shell
mefs-provider wallet -h

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
MEFS_PATH=~/.memo-provider ./mefs-provider wallet default
```

#### 2.3.4 wallet export 

Introduction

Export the wallet's private key

Example 

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider wallet export wallet-address
```

Parameter wallet-address is the wallet address of the node.

### 2.4 config

Introduction

This command is used to modify the configuration file, which takes effect only when the node is not started; if the config is modified while the node is running, the node needs to be restarted to make it take effect;

The path where the configuration file is located: config.json in the root directory of the node which is specified when init the node.

Usage

```shell
mefs-provider config -h

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
MEFS_PATH=~/.memo-provider ./mefs-provider config set -h
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
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.endPoint --value="https://testchain.metamemo.one:24180"
```

#### 2.4.2 config get

Introduction

This command is used to get the value of the specified configuration item

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider config get -h
```

Example

Get the contract.endPoint value

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider config get --key=contract.endPoint
```

### 2.5 bootstrap

Introduction

This command is used to set the bootstrap node in the configuration file, multiple bootstrap nodes can be added.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap -h

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
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap add "/ip4/103.xx.xx.xx/tcp/44006/p2p/12D3KooWQgakkyTFzcMh8JVbNK3FtiwJZz264sStq8QKBTeHwR3D"
```

#### 2.5.3 clear 

Introduction

clear the bootstrap node

## 3 Status View Related Commands

### 3.1 net

Introduction

Network related commands

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net -h

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
MEFS_PATH=~/.memo-provider ./mefs-provider info -h

USAGE:
   mefs-provider info command [command options] [arguments...]

COMMANDS:
   self     print node id
   help, h  Shows a list of commands or help for one command
```

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net info 

Network ID 12D3K..., IP [/ip4/172.xx.xx.xx/tcp/4001 /ip4/128.xx.xx.xx/tcp/39525 /ip4/10.xx.xx.xx/tcp/39525], Type: Private
```

'12D3K...' here is the peerID of this node.

```shell 
MEFS_PATH=~/.memo-provider ./mefs-provider net info self

ID:  26 provider 2
```

#### 3.1.2 peers

Introduction

Show the network information of all nodes currently connected.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net peers

12D3KooWHXmKSneyGqE8fPrTmNTBs2rR9pWTdNcgVG3Tt5htJef7 [/ip4/121.xx.xx.xx/tcp/23456]
12D3KooWB5yMrUL6NG6wHrdR9V114mUDkpJ5Mp3c1sLPHwiFi6DN [/ip4/192.xx.xx.xx/tcp/4201]
```

#### 3.1.3 connect

Introduction

This command connects to a specified node manually.

Usage

```shell 
MEFS_PATH=~/.memo-provider ./mefs-provider net connect -h

USAGE:
   mefs-provider net connect [command options] [peer multiaddr (/ip4/1.2.3.4/tcp/5678/p2p/12D...)]
```

Note

About how to construction the multiaddr for a node.

First use the net info command to view the network information of the node.

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net info
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
MEFS_PATH=~/.memo-provider ./mefs-provider net findpeer -h

USAGE:
   mefs-provider net findpeer [command options] [peerID (12D...)]
```

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net findpeer 12D3KooW...
```

#### 3.1.5 declare

Introduction

Used for the provider node to declare its own public network ip address; (only the provider node needs to use this command)

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider net declare -h

NAME:
   mefs-provider net declare - declare public network address

USAGE:
   mefs-provider net declare [command options] [net address (/ip4/1.2.3.4/tcp/5678)]
```

### 3.2 state

Introduction

This command interacts with state db to obtain pay and penalty information about this node, or settle current income of this node.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider state -h

COMMANDS:
   post      list post
   pay       list pay
   withdraw  provider income of storing data
   help, h   Shows a list of commands or help for one command
```

Subcommands

#### 3.2.1 post

This command is used to read from state db to show the payment and penalty information of storage orders between user and provider nodes.

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
MEFS_PATH=~/.memo-provider ./mefs-provider role list
```

#### 3.4 info

Introduction

This command checks the basic information of this node

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider info -h
```

Options

```shell
​--update (default: false) 
--all value, -a value Display all info information of the node (default: "false") 
--help, -h View more help
```

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider info
```
or

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider info -all true
```

### 3.5 settle

Introduction

Node pledge, withdrawal and other operations.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle -h

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
MEFS_PATH=~/.memo-provider ./mefs-provider settle pledgeAdd "1 Memo"
```

#### 3.5.3 pledgeGet

Introduction

View the current pledge amount.

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle pledgeGet
```

#### 3.5.4 pledgeWithdraw

Introducton

Take out some pledged Memo from pledge balance to fs balance.

Example

Withdraw the pledge of 0.5 Memo to the Fs account

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle pledgeWithdraw "0.5 Memo"
```

#### 3.5.5 pledgeRewardWithdraw

Introduction

pledgeRewardWithdraw Withdraw the pledge income to the FS file system.

Example

Withdraw 0.5Memo of pledge reward to Fs account
```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle pledgeRewardWithdraw "0.5 Memo"
```

#### 3.5.6 withdraw

Introduction

withdraw Take out the token of the file system to the (Erc20) wallet 

Example

Take out 0.5memo of the Fs file system to the (Erc20) wallet
```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle withdraw "0.5 Memo"
```

#### 3.5.7 quitRole

Introduction

This command makes the node exit the current role. Wallet address and the balance in it is not effected.

Caution

Role-related functions will no longer be available at this time. However, the wallet balance will not be affected.
For providers and keepers, the role pledge amount provided when registering the role can be withdrawn after run quitRole.

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider settle quitRole --really-do-it
```

#### 3.5.8 alterPayee 

Introduction

alterPayee used to change the current payee.

### 3.6 version

Introduction

View current node version

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider version
```

### 3.7 order

Introduction

View order related information

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider order

COMMANDS:
   jobList  list jobs of all pros
   payList  list pay infos all pros
   get      get order info of one provider
   detail   get detail order seq info of one provider
   proList  list all pros
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 3.7.1 list

Introductoion

List all users who has data stored in this provider.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider order list
```

#### 3.7.2 payList

Introductoion

List all order status with provider nodes

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider order payList
```

## 4 provider daily used commands

### 4.1 recover

Introduction

It is used to repair the db as much as possible when the node starts abnormally. Warning: Do not exit the node abnormally. When you want to exit the node, you should use the daemon stop command to exit normally. Failure to do so may result in db corruption beyond repair

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider recover db -h
--path specifies the database path to repair --deType the type of repair data (meta or state)
```

Example

Repair state database

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider recover db --path=/root/.memo-provider/state --dbType=state
```

### 4.2 backup

Introduction

Used when the node is down. Import/export state (or meta) database.

Subcommands

#### 4.2.1 export

Introduction

Export the state database to a file, using the following method:

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider backup export -h

USAGE:
   mefs-provider backup export [command options] [arguments...]

OPTIONS:
   --path value    path to store
   --dbType value  export dbtype: meta or state (default: "state")
   --help, -h      show help (default: false)
```

Example

Export the state database to the current directory

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider backup export --path=./ --dbType=state
```

#### 4.2.2 import

Introduciton

To import a database from a file, use the following method:

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider backup import -h

USAGE:
   mefs-provider backup import [command options] [arguments...]

OPTIONS:
   --path value    path of file import from
   --dbType value  export dbtype: meta or state (default: "state")
   --help, -h      show help (default: false)
```

Example

import state database

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider backup import --path=./state-xxxxxxxxx.db --dbType=state
```

### 4.3 restrict

Introduction

The provider node sets the whitelist function. When creating a bucket, the nodes in the whitelist are given priority.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict -h

USAGE:
   mefs-provider restrict command [command options] [arguments...]

COMMANDS:
   list     list all accepted providers/providers
   add      add node(s) to restrict list
   delete   remove node(s) from restrict list
   has      test whether node(s) in restrict list
   set      enable/disable restrict
   stat     restrict stat(enable/disable)
   help, h  Shows a list of commands or help for one command
```

Subcommands

#### 4.3.1 list 

Introduction

View whitelist node 

Example

View the nodes in the whitelist

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict list
```

#### 4.3.2 add 

Introduction

Add whitelist node 

Example

Add provider node to whitelist

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict add PID
```
The parameter PID is the provider node ID to be added to the whitelist


#### 4.3.3 delete 

Introduction

delete whitelist node 

Example

Delete whitelist nodes

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict delete PID
```
The parameter PID is the provider node ID to be added to the whitelist


#### 4.3.4 has 

Introduction

Check whether the node is in the whitelist 

Example

Check whether the node is in the current whitelist

mefs-provider restrict has PID
The parameter PID is the provider node ID to be added to the whitelist

#### 4.3.5 set 

Introduction

Set whitelist status 

Example

Enable the whitelist function

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict set --enable
```

Turn off the whitelist function

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict set disable
```
#### 4.3.6 stat 

Introduction

Check whitelist status 

Example

Check whitelist status

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider restrict stat
```

## 5 Other commands

### 5.1 auth

Introduction

Query the value of the token file of the node. The token file is located in the root directory of the node. Ordinary providers do not need to pay attention to this value.

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider auth info -h

USAGE:
   mefs-provider restrict command [command options] [arguments...]

COMMANDS:
   list     list all accepted providers/providers
   add      add node(s) to restrict list
   delete   remove node(s) from restrict list
   has      test whether node(s) in restrict list
   set      enable/disable restrict
   stat     restrict stat(enable/disable)
   help, h  Shows a list of commands or help for one command
```

### 5.2 log command

Introduction

This command is used to set the log level. Different levels display log information of different alarm levels. The default is info level, which only displays normal status information. Ordinary providers should use info log level. The debug/warn/error level is used by developers to view detailed error logs. This level will generate a large number of logs and cannot be in debug mode for a long time, otherwise it will take up a lot of disk space. It is not recommended for ordinary providers to use.

Subcommands 

#### 5.2.1 setLevel

Usage

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider log setLevel -h

NAME:
   mefs-provider log setLevel - Set log level

USAGE:
   mefs-provider log setLevel [command options] [level (debug/info/warn/error)]
```

Example

```shell
MEFS_PATH=~/.memo-provider ./mefs-provider log setLevel debug
```

# Start User

## Step by step

### Step 1: Docker Environment Preparation

View Docker Installation section to install docker.

### Step 2: Set up the node directory

Node home directory: 

Using "~/memo_user" as an example:

```shell
export MEFS_PATH=~/memo_user
```

Node data storage directory: ~/memo_user_data as an example:

```shell
export MEFS_DATA=~/memo_user_data
```

The home directory contains config file and other files for running a node, the storage directory is where data is stored.

### Step 3: Pull image(User)

```shell
docker pull memoio/mefs-user:latest
```

### Step 4: Initialization（Create new wallet）

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest init --password=memoriae
```

Explanation of parameters:

```shell
--password: Enter your user node password, the default is memoriae.
```

init: Execute the initialization command, which will generate your wallet address and generate a configuration file.

&nbsp; 

### Step 5: Check wallet address

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest wallet default
```

Explanation of parameters:

wallet default: Get the default wallet address

&nbsp; 

### Step 6: Top up

Starting node needs both the Memo and cMemo token.

To get the cMemo token, there is one faucet, https://faucet.metamemo.one/

This is the MemoChain information.

Memochain information

Chain RCP: https://chain.metamemo.one:8501/

Currency name: CMEMO

Chain ID: 985

Chain browser: https://scan.metamemo.one:8080/

To get Memo Tokens for your wallet, you can transfer some Memo Tokens    
from other wallet address which has enough Memo Tokens. The user needs minimum 1 Memo Tokens.

Join our discussing with Slack Link:

https://join.slack.com/t/memo-nru9073/shared_invite/zt-sruhyryo-suc689Nza3z8boa4JkaLqw

### Step 7: Modify the configuration file

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest config set --key=contract.version --value=3
```

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest config set --key=contract.endPoint --value="https://chain.metamemo.one:8501"
```

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest config set --key=contract.roleContract --value="0xbd16029A7126C91ED42E9157dc7BADD2B3a81189"
```

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest bootstrap clear
```

```shell
docker run --rm -v $MEFS_PATH:/root --entrypoint mefs-user memoio/mefs-user:latest bootstrap add "/ip4/183.240.197.189/tcp/14006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"
```

### Step 8:Start node

```shell
docker run -d -v $MEFS_PATH:/root -v $MEFS_DATA:/root/data -e PASSWORD="memoriae" -e PRICE=250000 -e MEFS_PATH=/root/.memo-user -e GROUP=3 -e SWARM_PORT=4001 -e DATA_PATH=/root/data --name mefs-user -e GATEWAY=true -e GATEWAY_USERNAME=admin -e GATEWAY_PASSWORD=memoriae -p 8080:8080 memoio/mefs-user:latest
```

- Default in web, account: admin; password: memoriae.

- Please make sure your user home directory and password are the same as in the previous step.

If you have any technical problems, please join our Discord server for help. 

[Memo Labs](https://discord.gg/YXQQwPhMpq)

&nbsp;


## Checking running status

### Step 1: Enter the container

```shell
docker exec -it mefs-user bash
```

- After entering the container, you can use the mefs-user command to perform operations. 

### Step 2: Check user information

```shell
mefs-user info
```

```shell
----------- Information -----------

2022-03-23 10:42:36 CST #Current time

2.1.0-alpha+git.e759ff0+2022-03-22.15:51:16CST #mefs-user version information

----------- Network Information ----------- #network information

ID: 12D3KooWBpPPzk9srHVVU4kkVF1RPJi9nYNgV4e6Yjjd4PGr5qrk #network id

IP: [/ip4/10.xx.xx.xx/tcp/18003] #Current node network information, 18003 is the swarm-port port, used for node communication

Type: Private

----------- Sync Information -----------

Status: true, Slot: 322885, Time: 2022-03-23 10:42:30 CST #Please check if your sync status is true, if it is false, please check your node network

Height Synced: 2640, Remote: 2640 #sync status

Challenge Epoch: 21 2022-03-23 09:55:30 CST

----------- Role Information -----------

ID: 29

Type: User

Wallet: 0xD2EC305EA80C6FCEF315029A806f52F27f3fB29a #Wallet address

Balance: 998.25 Gwei (tx fee), 998815392.06 NanoMemo (Erc20), 148075.99 NanoMemo (in fs) #balance

Data Stored: size 115294208 byte (109.95 MiB), price 113500000

----------- Group Information -----------

EndPoint: http://119.xx.xx.xx:8191

Contract Address: 0xCa2C4103bd5679F43eC9E277C2bAf5598f94Fe6D

Fs Address: 0xFB9FF16EB4093aa8fFf762F2dF4E61d3A7532Af9

ID: 1 #group id

Security Level: 7

Size: 109.95 MiB

Price: 113500000

Keepers: 10, Providers: 16, Users: 4 #The number of nodes in the current group

----------- Pledge Information ----------

Pledge: 0 AttoMemo, 26.00 Memo (total pledge), 26.00 Memo (total in pool) #current pledge information

----------- Lfs Information ----------

Status: writable

Buckets: 1

Used: 1.82 GiB

Raw Size: 109.95 MiB

Confirmed Size: 109.95 MiB

OnChain Size: 109.95 MiB

Need Pay: 987173.29 NanoMemo

Paid: 987173.29 NanoMemo
```

&nbsp;

## Check net status

**Get local node network information**

Command description: Enter command net info to view the network id (cid), ip address and port of the current node.

```shell
mefs-user net info
```

```shell
Network ID 12D3KooWBpPPzk9srHVVU4k1VF1RPJi9nYNgV4e6Yjjd4PGr5qrk, IP [/ip4/10.xx.xx.xx/tcp/18003], Type: Private
```

**Get the network connection information of the node**

Command description: Enter command net peers to view the network connection information of the current node.

```shell
mefs-user net peers
```

```shell
12D3KooWMrZTqoU8febMxxxxxxxxxCeqLQy1XCU9QcjP1YWAXVi [/ip4/10.xx.xx.xx/tcp/8003]

12D3KooWC2PmhSrU1VexxxxxxxxxtwvQuFZj3vPfjdfebAuJQtc [/ip4/10.xx.xx.xx/tcp/8004]

12D3KooWR74K1v6naGxxxxxxxxxVS88h4X93bMnquoRiEDdLJTx [/ip4/10.xx.xx.xx/tcp/8003]

12D3KooWSzzwJ7es1xxxxxxxxxPaqei3TUHnNZDmWTELSA7NJXQ [/ip4/10.xx.xx.xx/tcp/18003]

12D3KooWG8PjbbN9xxxxxxxxx2oYFtjeQ8XnqvnEqfrB4AiW7eJ [/ip4/10.xx.xx.xx/tcp/8003]

12D3KooWRjamwQtxxxxxxxxxb44AAXLNy9CB7u1FL2eC5QZekpF [/ip4/1.xx.xx.xx/tcp/24071]

... 
```

**Connect to a specified node**

Command description: 

Enter command net connect to connect to any node; if there is any problem with your node network, please enter command net connect to connect to our public node.

```shell
mefs-user net connect /ip4/10.2.x.x/tcp/8004/p2p/12D3KooWAykMmqu951ziotQiAYTN6SwfvBd1dsejSSak2jdSwryF
```

&nbsp;

## How to restart node after poweroff

If the account has been started, and then the computer has been shutted down, Docker, or "Windows PowerShell" was been closed, if you need to restart MEMO again, you need to open Docker first, then run the command line " docker start mefs-user" to start node.

```shell
docker start mefs-user
```

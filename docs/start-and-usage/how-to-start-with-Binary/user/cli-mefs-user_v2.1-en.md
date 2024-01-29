
## Command line deployment under Linux mefs-user

Download user execution program

```
https://github.com/memoio/go-mefs-release/releases
```

#### Generate Wallet

```
MEFS_PATH=~/.memo-user ./mefs-user init --password memoriae
```
- parameter interpretation：--password Specify your user password，Default to memoriae。
- parameter interpretation：Init initializing user，A .memo-user folder will be created in the current user's Home directory(~/.memo-user)，default MEFS_PATH=~/.memo-user
- Modify default MEFS_PATH，MEFS_PATH=~/.memo-user

#### Query wallet address

```
MEFS_PATH=~/.memo-user ./mefs-user wallet default
```

- parameter interpretation：wallet default View default wallet address
- user MEFS_PATH=~/.memo-user

##### Recharge

Please post tweet and send email to complete the registration.

Please post the tweet using your personal Twitter account and**@**MemoLabs.
Twittercontent：

I have joined the MEMO megrez.
Please send an email to sup@memolabs.org to apply for provider registration, also attach the link to Tweet.
Email Example

Network: megrez
Wallet Address: 0x70955480f225b23f60c37c4B6e88C63E3ACD723
Role: provider
Twitter Link: 
https://twitter.com/Geo***71090/status/1387**********01381?s=20*

#### Modify configuration file

Formal chain

Modify version item

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.version --value=3
```

Modify endPoint

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.endPoint --value="https://chain.metamemo.one:8501"
```

Modify the role contract address

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.roleContract --value="0xbd16029A7126C91ED42E9157dc7BADD2B3a81189"
```

Modify bootstrap

```
MEFS_PATH=~/.memo-user ./mefs-user bootstrap clear
```

https://drive.weixin.qq.com/s?k=AGQAAwfsAA8rXeuE8S，Please use a public node for the specified environment；

```
#####intranet
MEFS_PATH=~/.memo-user ./mefs-user bootstrap add "/ip4/10.10.100.20/tcp/4006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"

####External network
MEFS_PATH=~/.memo-user ./mefs-user bootstrap add "/ip4/183.240.197.189/tcp/14006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"
```

#### Start Node

- Modify the node data directory data path (usually choose a large capacity independent hard drive)
DATA=~/.memo-user/data
```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=data.dataPath --value=$DATA
```

Demonstration Command：

--GROUP Specify parameters


```
MEFS_PATH=~/.memo-user nohup ./mefs-user daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4001 --group=3  >user.log 2>&1 &
```

- Parameter explanation:nohup Hide output information， & Select Background Launch mefs-user
- --group Specify the number of groups to join

#### start gateway

```
MEFS_PATH=~/.memo-user nohup ./mefs-user gateway run -n name -p memoriae -c 8080 >gateway.log 2>&1 &
```

- parameter interpretation：The name, password, and port here can be specified independently. The length of the name cannot be less than 3, and the password cannot be less than 8















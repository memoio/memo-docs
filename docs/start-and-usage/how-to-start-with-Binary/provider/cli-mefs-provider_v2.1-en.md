
## Command line deployment under Linux mefs-provider

Download provider execution program

```
https://github.com/memoio/go-mefs-release/releases
```

#### Generate Wallet

```
MEFS_PATH=~/.memo-provider ./mefs-provider init --password memoriae
```
- parameter interpretation：--password Specify your provider password，Default to memoriae。
- parameter interpretation： initializing provider，A .memo-provider folder will be created in the current provider's Home directory(~/.memo-provider)，default MEFS_PATH=~/.memo-provider
- Modify default MEFS_PATH，MEFS_PATH=~/.memo-provider

#### Query wallet address

```
MEFS_PATH=~/.memo-provider ./mefs-provider wallet default
```

- parameter interpretation：wallet default View default wallet address
- user MEFS_PATH=~/.memo-provider

#### Recharge

Contact us

https://memolabs.org/#/

#### Modify configuration file

Formal chain

Modify version item

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.version --value=3
```

Modify endPoint

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.endPoint --value="https://chain.metamemo.one:8501"
```

Modify the role contract address

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.roleContract --value="0xbd16029A7126C91ED42E9157dc7BADD2B3a81189"
```

Modify bootstrap

```
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap clear
```

https://drive.weixin.qq.com/s?k=AGQAAwfsAA8rXeuE8S，Please use a public node for the specified environment；

```
#####intranet
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap add "/ip4/10.10.100.20/tcp/4006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"

####External network
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap add "/ip4/183.240.197.189/tcp/14006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"
```

#### Start Node

- Modify the node data directory data path (usually choose a large capacity independent hard drive)
DATA=~/.memo-provider/data
```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=data.dataPath --value=$DATA
```

Demonstration Command：

--GROUP Specify parameters


```
MEFS_PATH=~/.memo-provider nohup ./mefs-provider daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4002 --group=3  >provider.log 2>&1 &
```

- Parameter explanation:nohup Hide output information， & Select Background Launch mefs-user
- --group Specify the number of groups to join



#### Declare

```
MEFS_PATH=~/.memo-provider ./mefs-provider net declare /ip4/1.2.3.4/tcp/5678
```

Note: The IP address and port here must be external IP ports, do not use internal IP addresses and ports

Declare after the node synchronization is complete

Keeper, provider, and user are on the same network, and you need to use the intranet swarm port when declaring











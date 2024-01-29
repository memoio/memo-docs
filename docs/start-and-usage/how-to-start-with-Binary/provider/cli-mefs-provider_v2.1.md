
## Linux下命令行部署mefs-provider

下载provider执行程序

```
https://github.com/memoio/go-mefs-release/releases
```

#### 生成钱包

```
MEFS_PATH=~/.memo-provider ./mefs-provider init --password memoriae
```
- 参数解释：--password 指定你的provider密码，默认为 memoriae。
- 参数解释：init初始化provider，会在当前用户的家目录创建一个.memo-provider的文件夹(~/.memo-provider)，默认MEFS_PATH=~/.memo-provider
- 修改默认的MEFS_PATH，MEFS_PATH=~/.memo-provider

#### 查询钱包地址

```
MEFS_PATH=~/.memo-provider ./mefs-provider wallet default
```

- 参数解释：wallet default查看默认的钱包地址
- 使用MEFS_PATH=~/.memo-provider

##### 充值

请联系我们

https://memolabs.org/#/

#### 修改配置文件

正式链

修改version项

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.version --value=3
```

修改endPoint

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.endPoint --value="https://chain.metamemo.one:8501"
```

修改role合约地址

```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=contract.roleContract --value="0xbd16029A7126C91ED42E9157dc7BADD2B3a81189"
```

修改bootstrap

```
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap clear
```

https://drive.weixin.qq.com/s?k=AGQAAwfsAA8rXeuE8S，请使用指定环境的公共节点；

```
####内网
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap add "/ip4/10.10.100.20/tcp/4006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"

####外网
MEFS_PATH=~/.memo-provider ./mefs-provider bootstrap add "/ip4/183.240.197.189/tcp/14006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"
```

#### 启动节点

- 修改节点数据目录data路径(一般选择大容量的独立硬盘)
DATA=~/.memo-provider/data
```
MEFS_PATH=~/.memo-provider ./mefs-provider config set --key=data.dataPath --value=$DATA
```

- 示范启动命令

- --Group 指定

  ```
  MEFS_PATH=~/.memo-provider nohup ./mefs-provider daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4002 --group=3  >provider.log 2>&1 &
  ```

- 参数解释：选择后台启动 mefs-provider



#### 声明外网ip和端口

示范命令

```
MEFS_PATH=~/.memo-provider ./mefs-provider net declare /ip4/1.2.3.4/tcp/5678
```

注：这里的ip和端口必须是外网ip端口，不要用内网ip和端口

节点同步完成之后进行declare

keeper、provider、user处于同一网络下，声明时需使用内网swarm 端口















## Linux下命令行部署mefs-user

下载user执行程序

```
https://github.com/memoio/go-mefs-release/releases
```

#### 生成钱包

```
MEFS_PATH=~/.memo-user ./mefs-user init --password memoriae
```
- 参数解释：--password 指定你的user密码，默认为 memoriae。
- 参数解释：init初始化user，会在当前用户的家目录创建一个.memo-user的文件夹(~/.memo-user)，默认MEFS_PATH=~/.memo-user
- 修改默认的MEFS_PATH，MEFS_PATH=~/.memo-user

#### 查询钱包地址

```
MEFS_PATH=~/.memo-user ./mefs-user wallet default
```

- 参数解释：wallet default查看默认的钱包地址
- 使用MEFS_PATH=~/.memo-user

##### 充值

请联系我们

https://memolabs.org/#/

#### 修改配置文件

正常链

修改version项

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.version --value=3
```

修改endPoint

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.endPoint --value="https://chain.metamemo.one:8501"
```

修改role合约地址

```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=contract.roleContract --value="0xbd16029A7126C91ED42E9157dc7BADD2B3a81189"
```

修改bootstrap

```
MEFS_PATH=~/.memo-user ./mefs-user bootstrap clear
```

https://drive.weixin.qq.com/s?k=AGQAAwfsAA8rXeuE8S，请使用指定环境的公共节点；

```
#####内网
MEFS_PATH=~/.memo-user ./mefs-user bootstrap add "/ip4/10.10.100.20/tcp/4006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"

####外网
MEFS_PATH=~/.memo-user ./mefs-user bootstrap add "/ip4/183.240.197.189/tcp/14006/p2p/12D3KooWAMpZPwfJopVnp99oqp4zhbjE1G3LFAkcjfBuiyzyCmv7"
```

#### 启动节点

- 修改节点数据目录data路径(一般选择大容量的独立硬盘)
DATA=~/.memo-user/data
```
MEFS_PATH=~/.memo-user ./mefs-user config set --key=data.dataPath --value=$DATA
```

示范命令：

--GROUP指定参数


```
MEFS_PATH=~/.memo-user nohup ./mefs-user daemon start --api=/ip4/127.0.0.1/tcp/5001 --swarm-port=4001 --group=3  >user.log 2>&1 &
```

- 参数解释：nohup隐藏输出信息， &选择后台启动 mefs-user
- --group指定要加入的group为几号组

#### 启动gateway

```
MEFS_PATH=~/.memo-user nohup ./mefs-user gateway run -n name -p memoriae -c 8080 >gateway.log 2>&1 &
```

- 参数解释：这里的name，password，和端口可以自行指定。名字长度不能少于3，密码不能少于8















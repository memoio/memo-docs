# 中间件HTTPAPI说明文档

启动中间件服务，默认监听端口为8080； 本文档所使用的例子中，http监听端口设为8081，baseURL为http://localhost:8081；以下所有请求URL应根据实际情况进行更改。

## 1. 登陆验证

### 1.1 获取nonce

先获取登录所需的`nonce`值。

请求URL：http://localhost:8081/getnonce

请求方式：GET

返回参数：nonce值（16进制字符串表示）

请求示例：

![getnonce](./getnonce.png)

错误码：无错误码

### 1.2 登录请求

nonce的有效期为30秒，第一步获取nonce后需要在有效期内发送登录请求。

请求URL：http://localhost:8081/login

请求方式：POST

请求参数（JSON格式）：

```json
{
    "address":"0xE7E9f12f99aD17d4786b9B1247C097e63ceaF8Db",
    "nonce":"f1e89cbb3ee2981878d9410fec7ac68b6640a3c98e00170bb97c400edbfa11c6",
    "domain":"memo.io",
    "signature":"0x..."
}
```

| 参数名       | 变量     | 类型【长度限制】 | 必填  | 描述                                 |
| --------- | ------ | -------- | --- | ---------------------------------- |
| address   | 登陆账户地址 | string   | 是   | 以太坊账户地址                            |
| nonce     | 随机值    | string   | 是   | getnonce获取的随机值                     |
| domain    | 有效域    | string   | 是   | 有效的作用域，“memo.io”                   |
| signature | 签名     | string   | 是   | sign(hash(address, nonce, domain)) |

获取签名信息的方式如下述代码所示：

```go
package main

import (
    "flag"
    "fmt"
    "log"

    "github.com/ethereum/go-ethereum/common/hexutil"
    "github.com/ethereum/go-ethereum/crypto"
)

// 对 address、nonce、domain进行签名
func main() {
    domain := "memo.io"
    address := flag.String("address", "0xE7E9f12f99aD17d4786b9B1247C097e63ceaF8Db", "the login address")
    nonce := flag.String("nonce", "f1e89cbb3ee2981878d9410fec7ac68b6640a3c98e00170bb97c400edbfa11c6", "the login nonce")
    secretKey := flag.String("sk", "", "the sk to signature") // 账户address的私钥

    flag.Parse()

    hash := crypto.Keccak256([]byte(*address), []byte(*nonce), []byte(domain))
    sk, err := crypto.HexToECDSA(*secretKey)
    if err != nil {
        log.Fatal(err)
    }
    signature, err := crypto.Sign(hash, sk)
    if err != nil {
        log.Fatal(err)
    }
    sig := hexutil.Encode(signature)
    fmt.Println(sig)
}
```

 返回参数（JSON）：

```json
{
    "access token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc3NDkwMTgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.F0asDvu3LH3ccK6LAztBGF1TTzGw7Stc9gBEzVicuE4",
    "fresh token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc4MDk0MDgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.PDxQ2orOlsES6fvkyR-xWc6M1yBY8RiFTcn8m5AGROc"
}
```

| 参数名          | 变量   | 类型【长度限制】 | 必填  | 描述                  |
| ------------ | ---- | -------- | --- | ------------------- |
| access token | 认证令牌 | string   | 是   | 15分钟内，持有该令牌可以免密认证   |
| fresh token  | 刷新令牌 | string   | 是   | 7天内，持有该令牌可以重新生成认证令牌 |

请求示例：

![login](./login.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                                                                   |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| 500     | InternalError  | We encountered an internal error, please try again.                                                    |
| 401     | Authentication | There is an empty parameter; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature |

### 1.3 刷新accessToken

accessToken的有效期为15分钟；freshToken的有效期为7天，当accesToken过期后，需要根据freshToken刷新accessToken进行免密认证登录。

请求URL：http://localhost:8081/fresh

请求方式：GET

请求头信息：

| 参数名           | 变量   | 类型     | 必填  | 描述                  |
| ------------- | ---- | ------ | --- | ------------------- |
| Authorization | 刷新令牌 | string | 是   | 上述登录请求返回的freshToken |

返回参数（JSON）：

| 参数名          | 变量   | 类型【长度限制】 | 描述             |
| ------------ | ---- | -------- | -------------- |
| access token | 认证令牌 | string   | 有效期过后重新生成的认证令牌 |

请求示例：

![fresh](./fresh.png)

错误码:

| HTTP状态码 | 错误码          | 错误描述                |
| ------- | ------------ | ------------------- |
| 401     | Unauthorized | Illegal fresh token |

  &nbsp;

## 2. 充值

前端直接通过钱包发送交易进行充值。

&nbsp;

## 3. 单价查询

服务端暂未实现。

请求URL：

请求方式：GET

请求头信息：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求例子：

返回参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

返回例子：

错误码：

&nbsp;

## 4. 套餐查询

服务端暂未实现。

请求URL：

请求方式：GET

请求头信息：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求例子：

返回参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

返回例子：

错误码：

&nbsp;

## 5. 购买套餐（充值）

服务端暂未实现。

请求URL：POST

请求方式：

请求头信息：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

请求例子：

返回参数：

| 参数名 | 变量  | 类型【长度限制】 | 必填  | 描述  |
| --- | --- | -------- | --- | --- |
|     |     |          |     |     |
|     |     |          |     |     |
|     |     |          |     |     |

返回例子：

错误码：

&nbsp;

## 6. 文件上传

请求URL：

> 选择上传至mefs：http://localhost:8081/mefs/
> 
> 选择上传至ipfs：http://localhost:8081/ipfs/

请求方式：POST

请求头信息：

| 参数名           | 变量                  |
| ------------- | ------------------- |
| Content-Type  | multipart/form-data |
| Authorization | 登录验证产生的access token |

请求参数：

| 参数名  | 变量     | 类型【长度限制】 | 必填  | 描述  |
| ---- | ------ | -------- | --- | --- |
| file | 待上传的文件 | File     | 是   |     |

返回参数(JSON)：

| 参数名 | 变量      | 类型【长度限制】 | 必填  | 描述  |
| --- | ------- | -------- | --- | --- |
| cid | 上传文件CID | string   | 是   |     |

返回例子：

```json
Response：Status 200

{
     "cid": "bafybeie2ph7iokrckc5iy6xu7npa4xqst6ez5ewb7j2igeilxjaw6sd2qi"
}
```

请求示例：

![put1](./put1.png)

![put2](./put2.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500     | InternalError  | We encountered an internal error, please try again.  |
| 518     | Storage        | storage not support                                  |

&nbsp;

## 7. 文件下载

请求URL：

http://ip:port/mefs/$cid;

http://ip:port/ipfs/$cid;

> 选择从mefs下载：http://localhost:8081/mefs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4
> 
> 选择从ipfs下载：http://localhost:8081/ipfs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数（DataFromReader）：

返回文件。

| 参数名           | 描述                | 值   |
| ------------- | ----------------- | --- |
| code          | 状态码               | 200 |
| contentLength | 文件大小              |     |
| contentType   | 文件类型              |     |
| reader        | io.Reader，文件传输缓冲区 |     |

请求示例：

![get1](./get1png.png)

![get2](./get2.png)

错误码：

| HTTP状态码 | 错误码           | 错误描述                                                |
| ------- | ------------- | --------------------------------------------------- |
| 500     | InternalError | We encountered an internal error, please try again. |
| 518     | Storage       | storage not support                                 |
| 517     | Address       | address is null                                     |

&nbsp;

## 8. 文件列表查询

请求URL：

http://ip:port/mefs/listobjects

ipfs的文件列表查询暂未实现

> http://localhost:8081/mefs/listobjects

请求方式：GET

将列出登录账户的文件列表。

请求头信息：

| 参数名           | 变量                 | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | ------------------ | -------- | --- | -------------------------------------- |
| Authorization | 登录验证产生的accessToken | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（JSON）：

| 参数名     | 变量  | 类型【长度限制】 | 必填  | 描述         |
| ------- | --- | -------- | --- | ---------- |
| Address |     | string   |     | 账户以太坊钱包地址  |
| Storage |     | string   |     | mefs或者ipfs |
| Object  |     | struct   |     | 文件列表       |

每个文件包含信息：

| 参数名         | 类型     | 描述          |
| ----------- | ------ | ----------- |
| Name        | string | 文件名         |
| Size        | int64  | 文件大小        |
| Cid         | string | 文件cid       |
| ModTime     | time   | 文件修改时间      |
| UserDefined | struct | 关于文件的其他一些信息 |

UserDefined结构体包含信息：

| 参数名        | 类型     | 描述            |
| ---------- | ------ | ------------- |
| encryption | string | 文件加密方式        |
| etag       | string | 文件ID模式（默认cid） |

请求示例：

![list](./list.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 516     | Storage        | list object error %s                                 |
| 518     | Storage        | storage not support                                  |

&nbsp;

## 9. 查询账户余额

请求URL：

> http://localhost:8081/mefs/balance

ipfs暂未实现查询账户余额

请求方式：GET

请求头信息：

| 参数名           | 变量                 | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | ------------------ | -------- | --- | -------------------------------------- |
| Authorization | 登录验证产生的accessToken | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（JSON）：

| 参数名     | 变量  | 类型【长度限制】 | 必填  | 描述           |
| ------- | --- | -------- | --- | ------------ |
| Address |     | string   | 是   | 登录账户的以太坊钱包地址 |
| Balance |     | string   | 是   | 余额的最小单位数字表示  |

请求示例：

![balance](./balance.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 516     | Storage        | make bucket error %s;                                |
| 518     | Storage        | storage not support                                  |
| 520     | Eth            |                                                      |

&nbsp;

## 10. 查询存储空间

请求URL：

> http://localhost:8081/mefs/storage

请求方式：GET

ipfs暂未实现查询存储空间

请求头信息：

| 参数名           | 变量                 | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | ------------------ | -------- | --- | -------------------------------------- |
| Authorization | 登录验证产生的accessToken | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（JSON）：

| 参数名       | 变量  | 类型【长度限制】 | 必填  | 描述    |
| --------- | --- | -------- | --- | ----- |
| Used      |     | string   |     | 已使用空间 |
| Available |     | string   |     | 可用空间  |
| Free      |     | string   |     | 免费空间  |
| Files     |     | string   |     | 文件数   |

请求示例：

![storage](./storage.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |

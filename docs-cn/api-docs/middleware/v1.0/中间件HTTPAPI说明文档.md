---
html:
 toc: true
---

# 中间件HTTPAPI说明文档

MEMO 中间件为开发者、企业等提供一个安全、灵活、具有可组合性的数据网络。用户可灵活选择适合自己的底层存储系统。

中间件会提供存储单价查询、存储套餐购买服务，用户选择充值并购买套餐，获得存储空间，之后就可以上传下载文件，并且支持用户查询上传文件列表。

启动中间件服务，默认监听端口为8080； 本文档所使用的例子中，http监听端口设为8081，baseURL为https://api.mefs.io:10000/btctest；以下所有请求URL应根据实际情况进行更改。

## 1. 登陆验证

### 1.1 使用以太坊账户登录

#### 1.1.1 获取挑战信息

登录前，需要根据地址获取`challenge message`，并且必须通过`Origin`字段设置`domain`。

请求URL：https://api.mefs.io:10000/btctest/challenge?address={address}&chainid={chainid}

请求方式：GET

请求头信息：

| 参数名 | 变量 | 类型【长度限制】 | 必填 | 描述                   |
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | 域名 | string           | 是   | 登录所在平台的域名信息 |

请求参数：

无

返回参数：

text信息（[EIP-4361](https://eips.ethereum.org/EIPS/eip-4361)定义的格式）

请求示例：

![challenge](challenge.png)

注意事项：调用challenge接口时，需要在headers的Origin字段中指定域名，例如域名`http://memo.io`。

错误码：

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError | We encountered an internal error, please try again. |

#### 1.1.2 登录请求（使用eth账户登录）

用户可使用eth账号进行登录。在登录前，用户需要调用challenge接口获取登录消息，随后，用户利用私钥对该信息进行签名，签名方式在[EIP-191](https://eips.ethereum.org/EIPS/eip-191)中定义。用户的第一次登录视为注册，注册需要额外添加注册信息。

**注意**：在调用challenge接口获取挑战信息后，需要在30s内完成登录，否则登录失败。

请求URL：https://api.mefs.io:10000/btctest/login

请求方式：POST

请求头信息：

无

请求参数（JSON格式）：

```json
{
    "message":
"memo.io wants you to sign in with your Ethereum account:\n0xFD976F1F3dC6413Da5Fed05471eaBB01F4FaaC42\n\n\nURI: http://memo.io\nVersion: 1\nChain ID: 985\nNonce: 12c2ad59e12abbe224cf86741c4bf00a21432fb2673b29a694b72062385f9b5d\nIssued At: 2023-04-23T07:36:10Z",
    "signature":
"0xd5c406dd9ca168cc0894788cd262c3e9bd2f5413f87654c8cb685a9d872b9ab151fe80930c8de4da6adeadf38714387bee65c949ba47efa3eb5ee1335b6cc79400",
    "source": "memo.io",
    "recommender": "0xc0FF8898729d543c197Fb8b8ef7EE2f39024e1e8",
    "userid": 5
}
```

| 参数名      | 变量         | 类型【长度限制】 | 必填 | 描述                                            |
| ----------- | ------------ | ---------------- | ---- | ----------------------------------------------- |
| message     | 请求签名信息 | string           | 是   | 调用lens的challenge接口获取需要签名的text信息   |
| signature   | 签名         | string           | 是   | text签名后的信息                                |
| source      | 推荐人来源   | string           | 否   | 推荐信息来源                                    |
| recommender | 推荐人       | string           | 否   | 推荐人的信息，例如推荐人账号地址                |
| userid      | User编号     | int              | 否   | 多user种选择使用哪一个user进行上传文件，默认为0 |

获取签名信息的方式如下述代码所示：

```go
package main

import (
    "crypto/ecdsa"
    "flag"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "time"

    "github.com/ethereum/go-ethereum/common/hexutil"
    "github.com/ethereum/go-ethereum/crypto"
)

func main() {
    secretKey := flag.String("sk", "", "the sk to signature")

    flag.Parse()

    privateKey, err := crypto.HexToECDSA(*secretKey)
    if err != nil {
        fmt.Println(err.Error())
        return
    }

    publicKey := privateKey.Public()
    publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
    if !ok {
        log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
    }
    address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()

    // get MEMO-Middleware challenge message
    text, err := Challenge(address)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("message:", text)

    // eip191-signature
    hash := crypto.Keccak256([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(text), text)))
    signature, err := crypto.Sign(hash, privateKey)
    if err != nil {
        log.Fatal(err)
    }
    sig := hexutil.Encode(signature)
    fmt.Println("login sig:\n", sig)
}

func Challenge(address string) (string, error) {
    client := &http.Client{Timeout: time.Minute}
    // ip:port should be corresponding to that MEMO-Middleware server is listening
    url := "https://api.mefs.io:10000/btctest/challenge"

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return "", err
    }

    params := req.URL.Query()
    params.Add("address", address)
    req.URL.RawQuery = params.Encode()
    req.Header.Set("Origin", "https://memo.io")

    res, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
        return "", err
    }

    if res.StatusCode != http.StatusOK {
        return "", fmt.Errorf("respond code[%d]: %s", res.StatusCode, string(body))
    }

    return string(body), nil
}
```

 返回参数（JSON）：

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc3NDkwMTgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.F0asDvu3LH3ccK6LAztBGF1TTzGw7Stc9gBEzVicuE4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc4MDk0MDgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.PDxQ2orOlsES6fvkyR-xWc6M1yBY8RiFTcn8m5AGROc",
    "newAccount": true
}
```

| 参数名       | 变量       | 类型【长度限制】 | 必填 | 描述                                  |
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | 认证令牌   | string           | 是   | 15分钟内，持有该令牌可以免密认证      |
| refreshToken | 刷新令牌   | string           | 是   | 7天内，持有该令牌可以重新生成认证令牌 |
| newAccount   | 是否新用户 | bool             | 是   | 返回该登录用户是否为新用户            |

请求示例：

![login](login.png)

错误码：

| HTTP状态码 | 错误码         | 错误描述                                                     |
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  | We encountered an internal error, please try again.          |
| 401        | Authentication | There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature |

#### 1.1.3 登录请求（使用lens账户登录）

使用lens账户登录，无需获取1.1中的挑战信息，但需要调用lens的[challenge接口](https://docs.lens.xyz/docs/login)获取需要签名的text信息（[EIP-4361](https://eips.ethereum.org/EIPS/eip-4361)定义的格式），同时利用[EIP-191](https://eips.ethereum.org/EIPS/eip-191)定义的签名方式对text信息进行签名，需在30s内发出登录请求。运行中间件服务时，将开启或关闭检查账户是否是Lens账户。

请求URL：https://api.mefs.io:10000/btctest/lens/login

请求方式：POST

请求头信息：

无

请求参数（JSON格式）：

```json
{
    "message":"\nmemo.io wants you to sign in with your Ethereum account:\n0x51632235cc673a788E02B30B9F16F7B1D300194C\n\nSign in with ethereum to lens\n\nURI: memo.io\nVersion: 1\nChain ID: 137\nNonce: bcb9b92754e2b900\nIssued At: 2023-03-14T07:26:05.501Z\n ",
    "signature":"0x..."
}
```

| 参数名    | 变量         | 类型   | 必填 | 描述                                          |
| --------- | ------------ | ------ | ---- | --------------------------------------------- |
| message   | 请求签名信息 | string | 是   | 调用lens的challenge接口获取需要签名的text信息 |
| signature | 签名         | string | 是   | text签名后的信息                              |

调用lens接口，获取text信息的方式如下：

```go
import(
    "context"

    "github.com/machinebox/graphql"
)

type Challenge struct {
    Challenge struct {
        Text string
    } `graphql:"challenge(request: $request)"`
}

type ChallengeRequest struct {
    Address string `json:"address"`
}

func ChallengeRequest(address string) (string, error) {
    client := graphql.NewClient("https://api.lens.dev")

    req := graphql.NewRequest(`
        query Challenge($request:ChallengeRequest!) {
            challenge(request:$request) {
                text
            }
        }`)

    req.Var("request", ChallengeRequest{ Address: address })
    req.Header.Set("Origin", "memo.io")

    var query Challenge
    if err := client.Run(context.Background(), req, &query); err != nil {
        return "", err
    }

    return query.Challenge.Text, nil
}
```

使用EIP-191定义的方式签名可以借鉴1.2中的代码示例。

返回参数（JSON）:

```json
{
    "accessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc3NDkwMTgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.F0asDvu3LH3ccK6LAztBGF1TTzGw7Stc9gBEzVicuE4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc4MDk0MDgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.PDxQ2orOlsES6fvkyR-xWc6M1yBY8RiFTcn8m5AGROc",
    "isRegistered": false
}
```

| 参数名       | 变量           | 类型【长度限制】 | 必填 | 描述                                  |
| ------------ | -------------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | 认证令牌       | string           | 是   | 15分钟内，持有该令牌可以免密认证      |
| refreshToken | 刷新令牌       | string           | 是   | 7天内，持有该令牌可以重新生成认证令牌 |
| isRegistered | 是否注册过Lens | bool             | 是   | 账户是否已经在Lens中注册              |

请求示例：

![lenslogin](loginlens.png)

错误码：

| HTTP状态码 | 错误码         | 错误描述                                                     |
| ---------- | -------------- | ------------------------------------------------------------ |
| 517        | Address        | The address {address} is not registered on lens              |
| 500        | InternalError  | We encountered an internal error, please try again.          |
| 401        | Authentication | There is an empty parameter; Got wrong domain; Got wrong chain id; Got wrong address/signature; |

### 1.2 使用比特币账户登录

#### 1.2.1 获取挑战信息

登录前，需要根据地址获取`challenge message`，并且必须通过`Origin`字段设置`domain`。

请求URL：https://api.mefs.io:10000/btctest/btc/challenge?address={address}

请求方式：GET

请求头信息：

| 参数名 | 变量 | 类型【长度限制】 | 必填 | 描述                   |
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | 域名 | string           | 是   | 登录所在平台的域名信息 |

请求参数：

无

返回参数(string)：

```
memo.io wants you to sign in with your Solana account:
C1LSdxAezPHMdaEhLnjGfCkXNKKwwVJA7rq63AKSRwUU

The message is only used for login

URI: https://memo.io
Version: 1
Chain ID: mainnet
Nonce: 0e1b9cb8678063e79e93f78001954d8fd8d66dbcfaf4e58dfbde1e88ade3d452
Issued At: 2024-01-17T08:09:15Z
```

text信息

请求示例：

注意事项：调用challenge接口时，需要在headers的Origin字段中指定域名，例如域名`http://memo.io`。

错误码：

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError | We encountered an internal error, please try again. |

#### 1.2.2 登录请求（使用BTC账户登录）

用户可使用BTC账号进行登录。在登录前，用户需要调用challenge接口获取登录消息，随后，用户利用私钥对该信息进行签名，签名详情可查看[文档](https://github.com/fivepiece/sign-verify-message/blob/master/signverifymessage.md)。用户的第一次登录视为注册，注册需要额外添加注册信息。此外，由于BTC和ETH均使用ECDSA算法签名，为了统一BTC用户和ETH用户使用后续接口，中间件会为BTC用户生成一个ETH账户地址，且后续在中间件中均使用eth地址。

**注意**：在调用challenge接口获取挑战信息后，需要在30s内完成登录，否则登录失败。

请求URL：https://api.mefs.io:10000/btctest/btc/login

请求方式：POST

请求头信息：

无

请求参数（JSON格式）：

```json
{
    "message":
"memo.io wants you to sign in with your Bitcoin account:\n1C8iW3CPdnjZEgPbtirHJnVG1FEntFScRb\n\nURI: https://memo.io\nVersion: 1\nNonce: 5af2539c78914f9b4f99de922fe07b62665553ecaeea794db600db1722f7e7e8\nIssued At: 2024-01-08T08:39:01Z",
    "signature":
"H5EalDH0BmiGq2MwNIfsqd6+jsmst5xWOduO3TeS0S9dVS+y9F0o4KShg980zt8voIm0K6WxuFYN2a8ZGRQZQ1s=",
    "source": "memo.io",
    "recommender": "0xc0FF8898729d543c197Fb8b8ef7EE2f39024e1e8",
    "userid": 5
}
```

| 参数名      | 变量          | 类型【长度限制】 | 必填 | 描述                                         |
| ----------- | ------------- | ---------------- | ---- | -------------------------------------------- |
| message     | 请求签名信息  | string           | 是   | 调用btc的challenge接口获取需要签名的text信息 |
| signature   | 签名          | string           | 是   | 使用私钥对text签名后的信息                   |
| source      | 推荐人来源    | string           | 否   | 推荐信息来源                                 |
| recommender | 推荐人        | string           | 否   | 推荐人的信息，例如推荐人账号地址             |
| userid      | MEFS-User编号 | int              | 否   | 选择使用哪一个mefs-user上传文件，默认为0     |

获取签名信息的方式如下述代码所示：

```go
package main

import (
	"bytes"
	"encoding/base64"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/bitcoinsv/bsvd/wire"
	"github.com/btcsuite/btcd/btcec"
	"github.com/btcsuite/btcd/btcutil"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcd/chaincfg/chainhash"
)

func main() {
	secretKey := flag.String("sk", "", "the sk to signature")

	flag.Parse()

	wif, err := btcutil.DecodeWIF(*secretKey)
	if err != nil {
		panic(err.Error())
	}

	publicKey := wif.SerializePubKey()

	pubKeyAddress, err := btcutil.NewAddressPubKey(publicKey, &chaincfg.MainNetParams)
	if err != nil {
		panic(err.Error())
	}

	text, err := challengeBtc(pubKeyAddress.EncodeAddress())
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("message:", text)

	var buf bytes.Buffer
	if err = wire.WriteVarString(&buf, 0, "Bitcoin Signed Message:\n"); err != nil {
		return err
	}
	if err = wire.WriteVarString(&buf, 0, text); err != nil {
		return err
	}
	messageHash := chainhash.DoubleHashB(buf.Bytes())

	signature, err := btcec.SignCompact(btcec.S256(), wif.PrivKey, messageHash, true)
	if err != nil {
		return err
	}

	sig := base64.StdEncoding.EncodeToString(signature)
	fmt.Println("login sig:\n", sig)
}

func challengeBtc(address string) (string, error) {
	client := &http.Client{Timeout: time.Minute}
	// ip:port should be corresponding to that MEMO-Middleware server is listening
	url := "https://api.mefs.io:10000/btctest/btc/challenge"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	params := req.URL.Query()
	params.Add("address", address)
	req.URL.RawQuery = params.Encode()
	req.Header.Set("Origin", "https://memo.io")

	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("respond code[%d]: %s", res.StatusCode, string(body))
	}

	return string(body), nil
}
```

 返回参数（JSON）：

```json
{
	"accessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJDaGFpbklEIjowLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNzA0NzEwMzQxLCJpYXQiOjE3MDQ3MDMxNDEsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweDhhMUYxMjVDNjIwMzk3NjJiYjhBQTQ4Q2NiNzA4MTAyN2VBNkU1Y2UifQ.GuIasUT74lH4-OEZvlFywWO8R-JUXyA4aSLopVorl0w",
    "refreshToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJDaGFpbklEIjowLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNzA1MzA3OTQxLCJpYXQiOjE3MDQ3MDMxNDEsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweDhhMUYxMjVDNjIwMzk3NjJiYjhBQTQ4Q2NiNzA4MTAyN2VBNkU1Y2UifQ.fc8Yc6YBDHXEebPvhtlO1Re7yNyNeoYc8-2OkUJOZTA",
    "ethAddress":"0x8a1F125C62039762bb8AA48Ccb7081027eA6E5ce",
    "newAccount":true
}
```

| 参数名       | 变量       | 类型【长度限制】 | 必填 | 描述                                  |
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | 认证令牌   | string           | 是   | 15分钟内，持有该令牌可以免密认证      |
| refreshToken | 刷新令牌   | string           | 是   | 7天内，持有该令牌可以重新生成认证令牌 |
| ethAddress   | eth地址    | string           | 是   | BTC地址对应的ETH地址                  |
| newAccount   | 是否新用户 | bool             | 是   | 返回该登录用户是否为新用户            |

请求示例：

错误码：

| HTTP状态码 | 错误码         | 错误描述                                                     |
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  | We encountered an internal error, please try again.          |
| 401        | Authentication | There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature |

### 1.3 使用Solana账户登录

#### 1.3.1 获取挑战信息

登录前，需要根据地址获取`challenge message`，并且必须通过`Origin`字段设置`domain`。

请求URL：https://api.mefs.io:10000/btctest/sol/challenge?address={address}

请求方式：GET

请求头信息：

| 参数名 | 变量 | 类型【长度限制】 | 必填 | 描述                   |
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | 域名 | string           | 是   | 登录所在平台的域名信息 |

请求参数：

无

返回参数(string)：

```
memo.io wants you to sign in with your Solana account:
C1LSdxAezPHMdaEhLnjGfCkXNKKwwVJA7rq63AKSRwUU

The message is only used for login

URI: https://memo.io
Version: 1
Chain ID: mainnet
Nonce: 0e1b9cb8678063e79e93f78001954d8fd8d66dbcfaf4e58dfbde1e88ade3d452
Issued At: 2024-01-17T08:09:15Z
```

text信息

请求示例：

注意事项：调用challenge接口时，需要在headers的Origin字段中指定域名，例如域名`http://memo.io`。

错误码：

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError | We encountered an internal error, please try again. |

#### 1.3.2 登录请求（使用Solana账户）

用户可使用Solana账号进行登录。在登录前，用户需要调用对应的challenge接口获取登录消息，随后，用户利用私钥对该信息进行签名，签名算法为ED25519。用户的第一次登录视为注册，注册需要额外添加注册信息。

**注意**：在调用challenge接口获取挑战信息后，需要在30s内完成登录，否则登录失败。

请求URL：https://api.mefs.io:10000/btctest/sol/login

请求方式：POST

请求头信息：

无

请求参数（JSON格式）：

```json
{
    "message":
"memo.io wants you to sign in with your Solana account:\nC1LSdxAezPHMdaEhLnjGfCkXNKKwwVJA7rq63AKSRwUU\n\nThe message is only used for login\n\nURI: https://memo.io\nVersion: 1\nChain ID: mainnet\nNonce: 0e1b9cb8678063e79e93f78001954d8fd8d66dbcfaf4e58dfbde1e88ade3d452\nIssued At: 2024-01-17T08:09:15Z",
    "signature":
"4liJmTB4mJ2n9gvA3ow5sldghrn+1vMMkPHzt7CAJ+0nWpQc5Ywvm9FNSJzr9AOR/AzKCDm1RLhXyFub9CKvAQ==",
    "source": "memo.io",
    "recommender": "0xc0FF8898729d543c197Fb8b8ef7EE2f39024e1e8",
    "userid": 5
}
```

| 参数名      | 变量          | 类型【长度限制】 | 必填 | 描述                                         |
| ----------- | ------------- | ---------------- | ---- | -------------------------------------------- |
| message     | 请求签名信息  | string           | 是   | 调用btc的challenge接口获取需要签名的text信息 |
| signature   | 签名          | string           | 是   | 使用私钥对text签名后的信息                   |
| source      | 推荐人来源    | string           | 否   | 推荐信息来源                                 |
| recommender | 推荐人        | string           | 否   | 推荐人的信息，例如推荐人账号地址             |
| userid      | MEFS-User编号 | int              | 否   | 选择使用哪一个mefs-user上传文件，默认为0     |

获取签名信息的方式如下述代码所示：

```go
package main

import (
	"bytes"
	"crypto/ed25519"
	"encoding/base64"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/mr-tron/base58"
)

func main() {
	secretKey := flag.String("sk", "", "the sk to signature")

	flag.Parse()

	sk, err := base58.Decode(*secretKey)
	if err != nil {
		panic(err.Error())
	}

	pub, priv, err := ed25519.GenerateKey(bytes.NewReader(sk))
	if err != nil {
		panic(err.Error())
	}

	text, err := challengeSol(base58.Encode(pub))
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("message:", text)

	signature := base64.StdEncoding.EncodeToString(ed25519.Sign(priv, []byte(text)))
	fmt.Println("login sig:\n", signature)
}

func challengeSol(address string) (string, error) {
	client := &http.Client{Timeout: time.Minute}
	// ip:port should be corresponding to that MEMO-Middleware server is listening
	url := "https://api.mefs.io:10000/btctest/sol/challenge"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	params := req.URL.Query()
	params.Add("address", address)
	req.URL.RawQuery = params.Encode()
	req.Header.Set("Origin", "https://memo.io")

	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("respond code[%d]: %s", res.StatusCode, string(body))
	}

	return string(body), nil
}
```

 返回参数（JSON）：

```json
{
    "accessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJDaGFpbklEIjotMSwiYXVkIjoibWVtby5pbyIsImV4cCI6MTcwNTQ4NjE1NSwiaWF0IjoxNzA1NDc4OTU1LCJpc3MiOiJtZW1vLmlvIiwic3ViIjoiQzFMU2R4QWV6UEhNZGFFaExuakdmQ2tYTktLd3dWSkE3cnE2M0FLU1J3VVUifQ.uJ7RAHF-HM_T0fEG-wdQ2YdWBLj2k79c82zwq6WaMBo",
    "refreshToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJDaGFpbklEIjotMSwiYXVkIjoibWVtby5pbyIsImV4cCI6MTcwNjA4Mzc1NSwiaWF0IjoxNzA1NDc4OTU1LCJpc3MiOiJtZW1vLmlvIiwic3ViIjoiQzFMU2R4QWV6UEhNZGFFaExuakdmQ2tYTktLd3dWSkE3cnE2M0FLU1J3VVUifQ.qUxCKl2LFe5qhlb8KihiMzNG7Z8TQChYQ1jwAzqp29g",
    "newAccount":false
}
```

| 参数名       | 变量       | 类型【长度限制】 | 必填 | 描述                                  |
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | 认证令牌   | string           | 是   | 15分钟内，持有该令牌可以免密认证      |
| refreshToken | 刷新令牌   | string           | 是   | 7天内，持有该令牌可以重新生成认证令牌 |
| newAccount   | 是否新用户 | bool             | 是   | 返回该登录用户是否为新用户            |

请求示例：

错误码：

| HTTP状态码 | 错误码         | 错误描述                                                     |
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  | We encountered an internal error, please try again.          |
| 401        | Authentication | There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature |

### 1.4 刷新accessToken

无论使用以太坊账户还是使用比特币账户登录，中间件均会发放accessToken以及refreshToken。并且accessToken的有效期为15分钟；refreshToken的有效期为7天，当accesToken过期后，需要根据refreshToken刷新accessToken进行免密认证登录。

请求URL：https://api.mefs.io:10000/btctest/refresh

请求方式：GET

请求头信息：

| 参数名           | 变量            | 类型     | 必填  | 描述                    |
| ------------- | ------------- | ------ | --- | --------------------- |
| Authorization | "Bearer 刷新令牌" | string | 是   | 上述登录请求返回的refreshToken |

请求参数：

无

返回参数（JSON）：

| 参数名         | 变量   | 类型【长度限制】 | 描述             |
| ----------- | ---- | -------- | -------------- |
| accessToken | 认证令牌 | string   | 有效期过后重新生成的认证令牌 |

请求示例：

![refresh](refresh.png)

错误码:

| HTTP状态码 | 错误码          | 错误描述                  |
| ------- | ------------ | --------------------- |
| 401     | Unauthorized | Illegal refresh token |

  &nbsp;

### 1.5 通过个人地址查询注册推荐信息

可以通过个人地址查询注册包括推荐人信息。

请求URL：https://api.mefs.io:10000/btctest/recommend/:address

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数：

| 参数名      | 变量       | 类型【长度限制】 | 描述                             |
| ----------- | ---------- | ---------------- | -------------------------------- |
| address     | 用户地址   | string           | 用户地址                         |
| source      | 来源       | string           | 推荐信息来源                     |
| recommender | 推荐人地址 | string           | 推荐人的信息，例如推荐人账号地址 |

错误码:

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError | We encountered an internal error, please try again. |

  &nbsp;

### 1.6 通过推荐人地址查看注册推荐信息

可以通过推荐人地址查看有多少用户通过该推荐人进行了注册。若未提供recommender信息，则返回全部的注册推荐信息。

请求URL：https://api.mefs.io:10000/btctest/recommend?recommender={recommender}

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数（Arrary）：

| 参数名      | 变量       | 类型【长度限制】 | 描述                             |
| ----------- | ---------- | ---------------- | -------------------------------- |
| address     | 用户地址   | string           | 用户地址                         |
| source      | 来源       | string           | 推荐信息来源                     |
| recommender | 推荐人地址 | string           | 推荐人的信息，例如推荐人账号地址 |

错误码:

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError | We encountered an internal error, please try again. |

  &nbsp;

## 2. 文件上传

用户登录后，可上传文件。MEFS采用对象存储，文件默认上传至与登录账户地址同名的bucket中，账户上传文件时，若还未创建同名bucket，中间件则会自动帮用户创建同名bucket.

上传文件受用户的充值金额及存储空间限制，用户可先查询存储单价和存储套餐，进行充值，从而得到存储空间和余额。

请求URL：

> 选择上传至mefs：https://api.mefs.io:10000/btctest/mefs/
> 
> 选择上传至ipfs：https://api.mefs.io:10000/btctest/ipfs/

请求方式：POST

请求头信息：

| 参数名           | 变量                           |
| ------------- | ---------------------------- |
| Content-Type  | multipart/form-data          |
| Authorization | "Bearer 登录验证产生的access token" |

请求参数：

| 参数名  | 变量     | 类型【长度限制】 | 必填  | 描述         |
| ---- | ------ | -------- | --- | ---------- |
| file | 待上传的文件 | File     | 是   | 注意选择File格式 |
| public | 是否为公共文件 | String | 否 | true表示文件公开 |

返回参数(JSON)：

| 参数名 | 变量      | 类型【长度限制】 | 必填  | 描述      |
| --- | ------- | -------- | --- | ------- |
| cid | 上传文件CID | string   | 是   | 文件唯一标识符 |

返回例子：

```json
Response：Status 200

{
     "cid": "bafybeie2ph7iokrckc5iy6xu7npa4xqst6ez5ewb7j2igeilxjaw6sd2qi"
}
```

请求示例：

![put1](put1.png)

![put2](put2.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500     | InternalError  | We encountered an internal error, please try again.  |
| 518     | Storage        | storage not support                                  |

&nbsp;

## 3. 文件下载

用户可以根据文件的cid下载相应的文件。

请求URL：

http://ip:port/mefs/$cid;

http://ip:port/ipfs/$cid;

> 选择从mefs下载：https://api.mefs.io:10000/btctest/mefs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4
> 
> 选择从ipfs下载：https://api.mefs.io:10000/btctest/ipfs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4

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

![get1](get1.png)

![get2](get2.png)

错误码：

| HTTP状态码 | 错误码           | 错误描述                                                |
| ------- | ------------- | --------------------------------------------------- |
| 500     | InternalError | We encountered an internal error, please try again. |
| 518     | Storage       | storage not support                                 |
| 517     | Address       | address is null                                     |

&nbsp;

## 4. 文件删除

删除上传的文件。仅支持MEFS类型存储的删除功能。

请求URL：
http://ip:port/mefs/delete

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名 | 变量    | 类型【长度限制】 | 必填  | 描述                  |
| --- | ----- | -------- | --- | ------------------- |
| id | 文件id | id   | 是   | 文件ID, 文件列表中的序号 |

返回参数（JSON）：

| 参数名    | 类型【长度限制】 | 描述      |
| ------ | -------- | ------- |
| Status | string   | 删除成功或失败 |

请求示例：

![delete](delete.png)

&nbsp;

## 5. 文件列表查询

用户查询自己所上传的文件列表。

请求URL：

> http://ip:port/mefs/listobjects
> 
> http://ip:port/ipfs/listobjects

请求方式：GET

将列出登录账户的文件列表。

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（JSON）：

| 参数名     | 类型【长度限制】 | 描述         |
| ------- | -------- | ---------- |
| Address | string   | 账户以太坊钱包地址  |
| Storage | string   | mefs或者ipfs |
| Object  | struct   | 文件列表       |

每个文件包含信息：

| 参数名         | 类型     | 描述          |
| ----------- | ------ | ----------- |
| ID          | int    | 文件序号        |
| Name        | string | 文件名         |
| Size        | int64  | 文件大小        |
| Cid         | string | 文件cid       |
| ModTime     | time   | 文件修改时间      |
| Public      | bool   | 文件是否公开      |
| UserDefined | struct | 关于文件的其他一些信息 |

UserDefined结构体包含信息：

| 参数名        | 类型     | 描述            |
| ---------- | ------ | ------------- |
| encryption | string | 文件加密方式        |
| etag       | string | 文件ID模式（默认cid） |

请求示例：

![list](list.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 516     | Storage        | list object error %s                                 |
| 518     | Storage        | storage not support                                  |

&nbsp;

## 6. 文件分享

### 6.1 创建分享

用户可以为已上传的文件创建分享链接，供其他用户访问该资源。

请求URL：https://api.mefs.io:10000/btctest/share

请求方式：POST

请求头信息：

| 参数名        | 变量                               | 类型【长度限制】 | 必填 | 描述                                                   |
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 登录验证产生的accessToken" | string           | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名 | 变量     | 类型【长度限制】 | 必填 | 描述                                                         |
| ------ | -------- | ---------------- | ---- | ------------------------------------------------------------ |
| mid    | 文件mid  | string           | 是   | 文件唯一标识符，上传文件时返回的字符串                       |
| name   | 文件名   | string           | 是   | 文件名，由于支持上传多个内容相同的文件，因此需要指定文件名   |
| type   | 0或1     | int              | 是   | 文件的存储方式，0表示使用mefs对象存储，1表示使用ipfs对象存储 |
| expire | 过期时间 | int              | 否   | 可选择为链接设置过期时间，默认为无期限                       |

返回参数:

| 参数名            | 类型【长度限制】 | 描述               |
| ----------------- | ---------------- | ------------------ |
| shareId           | string           | 分享ID值           |
| shareDownloadLink | string           | 下载分享文件的连接 |
| shareInfoLink     | string           | 分享的具体信息     |

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500        | InternalError  | We encountered an internal error, please try again;  |
| 518        | Storage        | storage not support;                                 |
| 524        | DataBaseError  | Alread created the share;record not found;           |
| 526        | Permission     | can't access the file.                               |



### 6.2 分享信息查询

其他用户可以通过shareID免费查询分享信息。

请求URL：https://api.mefs.io:10000/btctest/share/info/{shareid}

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数(JSON):

| 参数名   | 类型【长度限制】 | 描述                                                         |
| -------- | ---------------- | ------------------------------------------------------------ |
| shareid  | string           | 唯一的分享ID                                                 |
| userid   | struct           | 用户ID，包括用户地址和用户chainid                            |
| mid      | struct           | 文件列表                                                     |
| type     | int              | 文件的存储方式，0表示使用mefs对象存储，1表示使用ipfs对象存储 |
| filename | string           | 文件名                                                       |
| expire   | int              | 文件的过期时间，-1为默认值，表示永久有效                     |

错误码：

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 404        | Not Found     | The share link is not available;                    |
| 500        | InternalError | We encountered an internal error, please try again. |



### 6.3 下载分享的文件

用户可以通过分享ID免费下载分享的文件。

请求URL：https://api.mefs.io:10000/btctest/share/{shareID}

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数（DataFromReader）：

返回文件。

| 参数名        | 描述                      | 值   |
| ------------- | ------------------------- | ---- |
| code          | 状态码                    | 200  |
| contentLength | 文件大小                  |      |
| contentType   | 文件类型                  |      |
| reader        | io.Reader，文件传输缓冲区 |      |

错误码：

| HTTP状态码 | 错误码        | 错误描述                                            |
| ---------- | ------------- | --------------------------------------------------- |
| 404        | Not Found     | The share link is not available;                    |
| 500        | InternalError | We encountered an internal error, please try again; |
| 524        | DataBaseError | record not found.                                   |



### 6.4 分享列表查询

用户可以查询已创建的所有分享信息。

请求URL：https://api.mefs.io:10000/btctest/share

请求方式：GET

请求头信息：

| 参数名        | 变量                               | 类型【长度限制】 | 必填 | 描述                                                   |
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 登录验证产生的accessToken" | string           | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（array）：

| 参数名   | 类型【长度限制】 | 描述                                                         |
| -------- | ---------------- | ------------------------------------------------------------ |
| shareid  | string           | 唯一的分享ID                                                 |
| userid   | struct           | 唯一的用户ID，包括用户地址和用户chainid                      |
| mid      | string           | 唯一的文件ID                                                 |
| type     | int              | 文件的存储方式，0表示使用mefs对象存储，1表示使用ipfs对象存储 |
| filename | string           | 文件名                                                       |
| expire   | int              | 文件的过期时间，-1为默认值，表示永久有效                     |

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500        | InternalError  | We encountered an internal error, please try again.  |



### 6.5 删除分享（通过分享ID）

用户可以通过分享ID删除已创建的分享连接。

请求URL：https://api.mefs.io:10000/btctest/share/{shareID}

请求方式：DELETE

请求头信息：

| 参数名        | 变量                               | 类型【长度限制】 | 必填 | 描述                                                   |
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 登录验证产生的accessToken" | string           | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（string）:

"delete success"

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 404        | Not Found      | The share link is not available;                     |
| 500        | InternalError  | We encountered an internal error, please try again;  |
| 526        | Permission     | can't delete.                                        |



### 6.6 删除分享（通过mid）

用户也可以通过mid删除已创建的分享连接。

请求URL：https://api.mefs.io:10000/btctest/share

请求方式：DELETE

请求头信息：

| 参数名        | 变量                               | 类型【长度限制】 | 必填 | 描述                                                   |
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 登录验证产生的accessToken" | string           | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名 | 变量    | 类型【长度限制】 | 必填 | 描述                                                         |
| ------ | ------- | ---------------- | ---- | ------------------------------------------------------------ |
| mid    | 文件mid | string           | 是   | 文件唯一标识符，上传文件时返回的字符串                       |
| type   | 文件名  | string           | 是   | 文件的存储方式，0表示使用mefs对象存储，1表示使用ipfs对象存储 |
| name   | 0或1    | int              | 否   | 文件名，由于支持上传多个内容相同的文件，因此需要指定文件名。若未指定则随机选择 |

返回参数（string）:

"delete success"

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 404        | Not Found      | The share link is not available;                     |
| 500        | InternalError  | We encountered an internal error, please try again;  |
| 526        | Permission     | can't delete.                                        |



### 6.7 保存分享的文件

其他用户可以选择将该文件保存到自己的文件列表中。

请求URL：https://api.mefs.io:10000/btctest/share/save/{shareid}

请求方式：POST

请求头信息：

| 参数名        | 变量                               | 类型【长度限制】 | 必填 | 描述                                                   |
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 登录验证产生的accessToken" | string           | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数(string):

"add share success"

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 404        | Not Found      | The share link is not available;                     |
| 500        | InternalError  | We encountered an internal error, please try again;  |
| 524        | DataBaseError  | record not found.                                    |



## 7. NFT市场

### 7.1 NFT列表查询

用户可以访问所有NFT，并且可选根据出售数量（sales），创建时间（time），代币ID（token_id）进行排序。

请求URL：https://api.mefs.io:10000/btctest/nft/show?page={page}&size={size}&order={order}&asc={true/false}

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数（JSON）：

| 参数名      | 类型【长度限制】 | 描述                  |
| ----------- | ---------------- | --------------------- |
| TokenID     | int              | NFT的ID               |
| Owner       | string           | NFT所有者             |
| Sales       | int              | NFT出售数量           |
| DataUrl     | string           | NFT对应文件的访问Url  |
| Mid         | string           | NFT对应文件的Mid      |
| Description | string           | NFT对应文件的描述信息 |
| Name        | string           | NFT对应文件的名称     |

请求示例：

无

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500        | InternalError  | We encountered an internal error, please try again.  |

### 7.2 NFT搜索

用户可以根据NFT描述信息进行搜索。

请求URL：https://api.mefs.io:10000/btctest/nft/search?page={page}&size={size}&query={query}

请求方式：GET

请求头信息：

无

请求参数：

无

返回参数（JSON）：

| 参数名      | 类型【长度限制】 | 描述                  |
| ----------- | ---------------- | --------------------- |
| TokenID     | int              | NFT的ID               |
| Owner       | string           | NFT所有者             |
| Sales       | int              | NFT出售数量           |
| DataUrl     | string           | NFT对应文件的访问Url  |
| Mid         | string           | NFT对应文件的Mid      |
| Description | string           | NFT对应文件的描述信息 |
| Name        | string           | NFT对应文件的名称     |

请求示例：

无

错误码：

| HTTP状态码 | 错误码         | 错误描述                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 500        | InternalError  | We encountered an internal error, please try again.  |



## 8. 查询账户余额

用户查询自己的存储余额。

请求URL：https://api.mefs.io:10000/btctest/mefs/balance

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数（JSON）：

| 参数名     | 类型【长度限制】 | 描述           |
| ------- | -------- | ------------ |
| Address | string   | 登录账户的以太坊钱包地址 |
| Balance | string   | 余额的最小单位数字表示  |

请求示例：

![](balance.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |
| 516     | Storage        | make bucket error %s;                                |
| 518     | Storage        | storage not support                                  |
| 520     | Eth            | rpc error                                            |

&nbsp;

## 9. 查询存储空间

用户查询自己的存储空间，包括已用、可用、免费空间，以及上传文件数。

请求URL：

> https://api.mefs.io:10000/btctest/mefs/storageinfo

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名   | 变量   | 描述                           |
| ----- | ---- | ---------------------------- |
| stype | 存储类型 | 目前支持可查询的存储类型有mefs,ipfs,qiniu |

返回参数（JSON）：

| 参数名       | 类型【长度限制】 | 描述    |
| --------- | -------- | ----- |
| Used      | string   | 已使用空间 |
| Available | string   | 可用空间  |
| Free      | string   | 免费空间  |
| Files     | string   | 文件数   |

请求示例：

![getstorage](getstorage.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                                                           |
| ------- | -------------- | ---------------------------------------------------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token;Authentication Failed (InValid token type) |

&nbsp;

## 10. 单价查询

查询各种存储方式的存储单价。

服务端暂未实现。

&nbsp;

## 11. 套餐查询

查询多种存储方式的存储套餐。

请求URL：

> https://api.mefs.io:10000/btctest/mefs/pkginfos

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

返回参数(JSON)：

| 参数名     | 变量      | 类型【长度限制】 | 描述                     |
| ------- | ------- | -------- | ---------------------- |
| Time    | 存储时间（秒） | string   | 该套餐包含的存储时长             |
| Kind    | 存储类型    | int      | 该套餐的存储方式，目前包含mefs和ipfs |
| Buysize | 购买空间大小  | string   | 该套餐包含的存储空间             |
| Amount  | 价格      | string   | 该套餐的价格                 |
| State   | 状态      | int      | 该套餐目前是否有效，1表示有效，0表示无效  |

请求示例：

![pkginfos](pkginfos.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |

&nbsp;

## 12. 购买套餐（充值）

> https://api.mefs.io:10000/btctest/mefs/buypkg

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名     | 变量   | 类型【长度限制】 | 必填  | 描述              |
| ------- | ---- | -------- | --- | --------------- |
| amount  | 金额   | string   | 是   | 花费金额            |
| pkgid   | 套餐ID | string   | 是   | 套餐id，根据‘套餐查询’获得 |
| chainid | 链ID  | string   | 是   | 执行购买套餐的区块链id    |

返回参数(JSON)：

| 参数名    | 变量  | 类型【长度限制】 | 必填  | 描述      |
| ------ | --- | -------- | --- | ------- |
| Status | 状态  | string   | 是   | 购买成功或失败 |

请求示例：

![buypkg](buypkg.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |

&nbsp;

## 13.  获取已购买套餐

> https://api.mefs.io:10000/btctest/mefs/getbuypkgs

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

无

返回参数(JSON)：

| 参数名       | 变量   | 类型【长度限制】 | 描述               |
| --------- | ---- | -------- | ---------------- |
| Starttime | 开始时间 | string   | 已购买套餐的开始服务时间     |
| Endtime   | 结束时间 | string   | 已购买套餐的服务结束时间     |
| Kind      | 类型   | int      | 0: MEFS, 1: IPFS |
| Buysize   | 购买大小 | int      | 已购买套餐的存储空间大小     |
| Amount    | 购买金额 | int      | 已购买套餐的消费金额       |
| State     | 状态   | int      | 套餐状态             |

请求示例：

![](getpurchasedpkgs.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                 |
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token; |

## 14. 查询流量

用户查询自己的存储空间，包括已用、可用、免费空间，以及上传文件数。

请求URL：

> https://api.mefs.io:10000/btctest/mefs/flowsize

请求方式：GET

请求头信息：

| 参数名           | 变量                          | 类型【长度限制】 | 必填  | 描述                                     |
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 登录验证产生的accessToken" | string   | 是   | 若过期，可通过刷新accessToken来获得新的有效accessToken |

请求参数：

| 参数名   | 变量   | 描述                           |
| ----- | ---- | ---------------------------- |
| stype | 存储类型 | 目前支持可查询的存储类型有mefs,ipfs,qiniu |

返回参数（JSON）：

| 参数名       | 类型【长度限制】 | 描述    |
| --------- | -------- | ----- |
| Used      | string   | 已使用流量 |
| Free      | string   | 免费流量  |


请求示例：

![flowsize](flowsize.png)

错误码：

| HTTP状态码 | 错误码            | 错误描述                                                                                           |
| ------- | -------------- | ---------------------------------------------------------------------------------------------- |
| 401     | Authentication | Token is Null; Invalid token payload; Invalid token;Authentication Failed (InValid token type) |

&nbsp;

## 15. 文件下载公共

用户可以根据文件的cid下载相应的文件。

请求URL：

http://ip:port/mefs/public/$cid;

http://ip:port/ipfs/public/$cid;

> 选择从mefs下载：https://api.mefs.io:10000/btctest/mefs/public/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4
> 
> 选择从ipfs下载：https://api.mefs.io:10000/btctest/ipfs/public/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4

请求方式：GET

请求头信息：

无

请求参数：
| 参数名   | 变量   | 描述                           |
| ----- | ---- | ---------------------------- |
| chainid | 链id |  |

返回参数（DataFromReader）：

返回文件。

| 参数名           | 描述                | 值   |
| ------------- | ----------------- | --- |
| code          | 状态码               | 200 |
| contentLength | 文件大小              |     |
| contentType   | 文件类型              |     |
| reader        | io.Reader，文件传输缓冲区 |     |

请求示例：

![get3](get3.png)


错误码：

| HTTP状态码 | 错误码           | 错误描述                                                |
| ------- | ------------- | --------------------------------------------------- |
| 500     | InternalError | We encountered an internal error, please try again. |
| 518     | Storage       | storage not support                                 |
| 517     | Address       | address is null                                     |

&nbsp;
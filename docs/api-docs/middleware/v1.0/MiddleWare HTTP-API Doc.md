---
html:
toc: true
---

# Middleware HTTP API Description Document

MEMO middleware provides a secure, flexible and composable data network for developers and enterprises. Users have the flexibility to choose their own underlying storage system.

Middleware will provide storage unit price query and storage package purchase services. Users can choose to recharge and purchase packages to obtain storage space, and then upload and download files, and support users to query the list of uploaded files.

Start the middleware service. The default listening port is 8080. In the example used in this document, the HTTP listening port is set to 8081, and the baseURL is the https://api.mefs.io:10000/btctest. All the following request URLs should be changed according to the actual situation.

## 1. Login verification

### 1.1 Login with Ethereum account

#### 1.1.1 Obtaining Challenge Information

Before logging in, it needs to be obtained `challenge message` according to the address, and it must be set `domain` through the `Origin` field.

Request URL: https://api.mefs.io:10000/btctest/challenge?address= { address } & chainid = { chainid }

Request method: GET

Request header information:

| Name | Variable | Type | Must |Description|
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | Domain Name |string| YES   | The original domain name |

Request Parameters:

None

Return parameters:

Text message ([EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) defined format)

Request example:

![challenge](challenge.png)

Note: When calling the challenge interface, you need to specify the domain name in the Origin field of headers, for example, the domain name `http://memo.io`.

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError |We encountered an internal error, please try again.|

#### 1.1.2 Login request (login with eth account)

Users can log in with an eth account. Before logging in, the user needs to call the challenge interface to obtain the login message. Then, the user uses the private key to sign the message. The signature method is [EIP-191](https://eips.ethereum.org/EIPS/eip-191) defined in. The user's first login is regarded as registration, and registration requires additional registration information.

**Notice**: After calling the challenge interface to obtain the challenge information, you need to complete the login within 30 seconds, otherwise the login fails.

Request URL: https://api.mefs.io:10000/btctest/login.

Request method: POST

Request header information:

None

Request parameters (JSON format):


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

| Name      | Variable         | Type | Must |Description|
| ----------- | ------------ | ---------------- | ---- | ----------------------------------------------- |
| message     | info to be signed | string           | YES   |Call the challenge interface of lens to obtain the text information that needs to be signed|
| signature   | signature         | string           | YES   |TextSigned message|
| source      | recommender source   | string           | NO   |Recommend a source of information|
| recommender | recommender       | string           | NO   |Information about the referrer, such as the referrer's account address|
| userid      | User编号     | int              | NO   |There are multiple users to select which user to use to upload files. The default is 0.|

The way to obtain the signature information is shown in the following code:


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

Return parameter (JSON):


```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc3NDkwMTgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.F0asDvu3LH3ccK6LAztBGF1TTzGw7Stc9gBEzVicuE4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc4MDk0MDgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.PDxQ2orOlsES6fvkyR-xWc6M1yBY8RiFTcn8m5AGROc",
    "newAccount": true
}
```

| Name       | Variable       | Type | Must |Description|
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | AccessToken   | string           | YES   |Within 15 minutes, the token can be held for secret-free authentication.|
| refreshToken | RefreshToken   | string           | YES   |Within 7 days, the holder of the token can regenerate the authentication token|
| newAccount   | new user or not | bool             | YES   |Returns whether the login user is a new user|

Request example:

![login](login.png)

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  |We encountered an internal error, please try again.|
| 401        | Authentication |There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature|

#### 1.1.3 Login request (login with lens account)

When logging in with lens account, it is not necessary to obtain the challenge information in 1.1, but it is necessary to call lens [The challenge interface](https://docs.lens.xyz/docs/login) to obtain the text information ([EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) defined format) to be signed, and sign the text information with [EIP-191](https://eips.ethereum.org/EIPS/eip-191) the defined signature method. The login request must be made within 30 seconds. When the middleware service is running, checking whether the account is a Lens account is turned on or off.

Request URL: https://api.mefs.io:10000/btctest/lens/login.

Request method: POST

Request header information:

None

Request parameters (JSON format):


```json
{
    "message":"\nmemo.io wants you to sign in with your Ethereum account:\n0x51632235cc673a788E02B30B9F16F7B1D300194C\n\nSign in with ethereum to lens\n\nURI: memo.io\nVersion: 1\nChain ID: 137\nNonce: bcb9b92754e2b900\nIssued At: 2023-03-14T07:26:05.501Z\n ",
    "signature":"0x..."
}
```

| Name    | Variable         | Type   | Must |Description|
| --------- | ------------ | ------ | ---- | --------------------------------------------- |
| message   | info to be signed | string | YES   |Call the challenge interface of lens to obtain the text information that needs to be signed|
| signature | signature         | string | YES   |TextSigned message|

Call the lens interface to obtain the text information as follows:


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

Signing in the manner defined by EIP-191 can be borrowed from the code example in 1.2.

Return parameter (JSON):


```json
{
    "accessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc3NDkwMTgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.F0asDvu3LH3ccK6LAztBGF1TTzGw7Stc9gBEzVicuE4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJhdWQiOiJtZW1vLmlvIiwiZXhwIjoxNjc4MDk0MDgyLCJpYXQiOjE2Nzc0ODkyODIsImlzcyI6Im1lbW8uaW8iLCJzdWIiOiIweEU3RTlmMTJmOTlhRDE3ZDQ3ODZiOUIxMjQ3QzA5N2U2M2NlYUY4RGIifQ.PDxQ2orOlsES6fvkyR-xWc6M1yBY8RiFTcn8m5AGROc",
    "isRegistered": false
}
```

| Name       | Variable           | Type | Must |Description|
| ------------ | -------------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | AccessToken       | string           | YES   |Within 15 minutes, the token can be held for secret-free authentication.|
| refreshToken | RefreshToken       | string           | YES   |Within 7 days, the holder of the token can regenerate the authentication token|
| isRegistered | YESNO注册过Lens | bool             | YES   |Has the account been registered in Lens?|

Request example:

![lenslogin](loginlens.png)

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ------------------------------------------------------------ |
| 517        | Address        |The address {address} is not registered on lens|
| 500        | InternalError  |We encountered an internal error, please try again.|
| 401        | Authentication |There is an empty parameter; Got wrong domain; Got wrong chain id; Got wrong address/signature;|

### 1.2 Login with Bitcoin account

#### 1.2.1 Obtaining Challenge Information

Before logging in, it needs to be obtained `challenge message` according to the address, and it must be set `domain` through the `Origin` field.

Request URL: https://api.mefs.io:10000/btctest/btc/challenge?address= { address }

Request method: GET

Request header information:

| Name | Variable | Type | Must |Description|
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | Domain Name |string| YES   | The original domain name |

Request Parameters:

None

Return parameter (string):


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

Text message

Request example:

Note: When calling the challenge interface, you need to specify the domain name in the Origin field of headers, for example, the domain name `http://memo.io`.

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError |We encountered an internal error, please try again.|

#### 1.2.2 Login request (login with BTC account)

The user can log in with a BTC account. Before logging in, the user needs to call the challenge interface to obtain the login message. Then, the user uses the private key to sign the message. The signature details can be viewed [文档](https://github.com/fivepiece/sign-verify-message/blob/master/signverifymessage.md). The user's first login is regarded as registration, and registration requires additional registration information. In addition, since BTC and ETH both use ECDSA algorithm signature, in order to unify the subsequent interfaces used by BTC users and ETH users, the middleware will generate an ETH account address for BTC users, and the eth address will be used in the middleware subsequently.

**Notice**: After calling the challenge interface to obtain the challenge information, you need to complete the login within 30 seconds, otherwise the login fails.

Request URL: https://api.mefs.io:10000/btctest/btc/login.

Request method: POST

Request header information:

None

Request parameters (JSON format):


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

| Name      | Variable          | Type | Must |Description|
| ----------- | ------------- | ---------------- | ---- | -------------------------------------------- |
| message     | info to be signed  | string           | YES   |Call the challenge interface of BTC to obtain the text information that needs to be signed|
| signature   | signature          | string           | YES   |Information after signing the text with the private key|
| source      | recommender source    | string           | NO   |Recommend a source of information|
| recommender | recommender        | string           | NO   |Information about the referrer, such as the referrer's account address|
| userid      | MEFS-User ID | int              | NO   |Select which mefs-user to use to upload the file. The default is 0|

The way to obtain the signature information is shown in the following code:


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

Return parameter (JSON):


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

| Name       | Variable       | Type | Must |Description|
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | AccessToken   | string           | YES   |Within 15 minutes, the token can be held for secret-free authentication.|
| refreshToken | RefreshToken   | string           | YES   |Within 7 days, the holder of the token can regenerate the authentication token|
| ethAddress   | eth address    | string           | YES   |ETH address corresponding to BTC address|
| newAccount   | new user or not | bool             | YES   |Returns whether the login user is a new user|

Request example:

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  |We encountered an internal error, please try again.|
| 401        | Authentication |There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature|

### 1.3 Log in with Solana account

#### 1.3.1 Obtaining Challenge Information

Before logging in, it needs to be obtained `challenge message` according to the address, and it must be set `domain` through the `Origin` field.

Request URL: https://api.mefs.io:10000/btctest/sol/challenge?address= { address }

Request method: GET

Request header information:

| Name | Variable | Type | Must |Description|
| ------ | ---- | ---------------- | ---- | ---------------------- |
| Origin | Domain Name |string| YES   | The original domain name |

Request Parameters:

None

Return parameter (string):


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

Text message

Request example:

Note: When calling the challenge interface, you need to specify the domain name in the Origin field of headers, for example, the domain name `http://memo.io`.

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError |We encountered an internal error, please try again.|

#### 1.3.2 Login request (with Solana account)

Users can log in with a Solana account. Before logging in, the user needs to call the corresponding challenge interface to obtain the login message, and then the user signs the message with the private key, and the signature algorithm is ED25519. The user's first login is regarded as registration, and registration requires additional registration information.

**Notice**: After calling the challenge interface to obtain the challenge information, you need to complete the login within 30 seconds, otherwise the login fails.

Request URL: https://api.mefs.io:10000/btctest/sol/login.

Request method: POST

Request header information:

None

Request parameters (JSON format):


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

| Name      | Variable          | Type | Must |Description|
| ----------- | ------------- | ---------------- | ---- | -------------------------------------------- |
| message     | info to be signed  | string           | YES   |Call the challenge interface of BTC to obtain the text information that needs to be signed|
| signature   | signature          | string           | YES   |Information after signing the text with the private key|
| source      | recommender source    | string           | NO   |Recommend a source of information|
| recommender | recommender        | string           | NO   |Information about the referrer, such as the referrer's account address|
| userid      | MEFS-User ID | int              | NO   |Select which mefs-user to use to upload the file. The default is 0|

The way to obtain the signature information is shown in the following code:


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

Return parameter (JSON):


```json
{
    "accessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJDaGFpbklEIjotMSwiYXVkIjoibWVtby5pbyIsImV4cCI6MTcwNTQ4NjE1NSwiaWF0IjoxNzA1NDc4OTU1LCJpc3MiOiJtZW1vLmlvIiwic3ViIjoiQzFMU2R4QWV6UEhNZGFFaExuakdmQ2tYTktLd3dWSkE3cnE2M0FLU1J3VVUifQ.uJ7RAHF-HM_T0fEG-wdQ2YdWBLj2k79c82zwq6WaMBo",
    "refreshToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoyLCJDaGFpbklEIjotMSwiYXVkIjoibWVtby5pbyIsImV4cCI6MTcwNjA4Mzc1NSwiaWF0IjoxNzA1NDc4OTU1LCJpc3MiOiJtZW1vLmlvIiwic3ViIjoiQzFMU2R4QWV6UEhNZGFFaExuakdmQ2tYTktLd3dWSkE3cnE2M0FLU1J3VVUifQ.qUxCKl2LFe5qhlb8KihiMzNG7Z8TQChYQ1jwAzqp29g",
    "newAccount":false
}
```

| Name       | Variable       | Type | Must |Description|
| ------------ | ---------- | ---------------- | ---- | ------------------------------------- |
| accessToken  | AccessToken   | string           | YES   |Within 15 minutes, the token can be held for secret-free authentication.|
| refreshToken | RefreshToken   | string           | YES   |Within 7 days, the holder of the token can regenerate the authentication token|
| newAccount   | new user or not | bool             | YES   |Returns whether the login user is a new user|

Request example:

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ------------------------------------------------------------ |
| 500        | InternalError  |We encountered an internal error, please try again.|
| 401        | Authentication |There is an empty parameter;Can't parse message;Got wrong chain id; Got wrong domain; Got wrong nonce; Got wrong address; Got wrong signature|

### 1.4 Refresh access token

The middleware issues accessToken and refreshToken regardless of whether you log in with an Ethereum or Bitcoin account. The accessToken is valid for 15 minutes, and the refreshToken is valid for 7 days. When the accessToken expires, the accessToken needs to be refreshed according to the refreshToken for secret-free authentication login.

Request URL: https://api.mefs.io:10000/btctest/refresh.

Request method: GET

Request header information:

| Name           | Variable            | Type     | Must  |Description|
| ------------- | ------------- | ------ | --- | --------------------- |
| Authorization | "Bearer RefreshToken" | string | YES   |The refreshToken returned by the above login request|

Request Parameters:

None

Return parameter (JSON):

| Name         | Variable   | Type |Description|
| ----------- | ---- | -------- | -------------- |
| accessToken | AccessToken | string   |Regenerated authentication token after validity period|

Request example:

![refresh](refresh.png)

Error code:

| HTTP Status Code | Error Code          |Error description|
| ------- | ------------ | --------------------- |
| 401     | Unauthorized |Illegal refresh token|

  &nbsp;

### 1.5. Query the registration recommendation information through the personal address

The registration can be queried by personal address, including referral information.

Request URL: https://api.mefs.io:10000/btctest/recommend/: address

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameters:

| Name      | Variable       | Type |Description|
| ----------- | ---------- | ---------------- | -------------------------------- |
| address     | User Address   | string           |User address|
| source      | Source       | string           |Recommend a source of information|
| recommender | recommender address |string| recommender info, e.g. address |

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError |We encountered an internal error, please try again.|

  &nbsp;

### 1.6 View the registration referral information through the address of the referrer

You can see how many users have registered through the referrer by referring the address. If no recommender information is provided, all registration recommendation information is returned.

Request URL: https://api.mefs.io:10000/btctest/recommend?recommender= { recommender }

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (Arrary):

| Name      | Variable       | Type |Description|
| ----------- | ---------- | ---------------- | -------------------------------- |
| address     | User Address   | string           |User address|
| source      | Source       | string           |Recommend a source of information|
| recommender | recommender address |string| recommender info, e.g. address |

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 500        | InternalError |We encountered an internal error, please try again.|

  &nbsp;

## 2. File upload

After the user logs in, the file can be uploaded. MEFS uses object storage, and the file is uploaded to the bucket with the same name as the login account address by default. When the account uploads the file, if the bucket with the same name has not been created, the middleware will automatically help the user create the bucket with the same name.

The uploaded file is limited by the user's recharge amount and storage space. The user can query the storage unit price and storage package first to recharge, so as to obtain the storage space and balance.

Request URL:

> Select Upload to mefs: https://api.mefs.io:10000/btctest/mefs/.
> 
> Select Upload to ipfs: https://api.mefs.io:10000/btctest/ipfs/.

Request method: POST

Request header information:

| Name           |Variables|
| ------------- | ---------------------------- |
| Content-Type  |multipart/form-data|
| Authorization |Access token "due to Bearer login authentication.|

Request Parameters:

| Name  | Variable     | Type | Must  |Description|
| ---- | ------ | -------- | --- | ---------- |
| file | To be uploaded | File     | YES   |Note that the File format is selected|
| public | public or not | String | NO |True indicates that the file is public|

Return parameter (JSON):

| Name | Variable      |Type [Length Limit]| Must  | Description      |
| --- | ------- | -------- | --- | ------- |
| cid | CID of uploaded file |string| YES   | The unique id for a file |

Return example:


```json
Response：Status 200

{
     "cid": "bafybeie2ph7iokrckc5iy6xu7npa4xqst6ez5ewb7j2igeilxjaw6sd2qi"
}
```

Request example:

![put1](put1.png)

![put2](put2.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 500     | InternalError  |We encountered an internal error, please try again.|
| 518     | Storage        |storage not support|

&nbsp;

## 3. File download

The user can download the corresponding file according to the CID of the file.

Request URL:

http://ip:port/mefs/$cid;

http://ip:port/ipfs/$cid;

> Select Download from mefs: https://api.mefs.io:10000/btctest/mefs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4.
> 
> Select download from ipfs: https://api.mefs.io:10000/btctest/ipfs/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4.

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (Data FromReader):

Return to the file.

| Name           |Description| Value   |
| ------------- | ----------------- | --- |
| code          |Status Code| 200 |
| contentLength |File size|     |
| contentType   |File type|     |
| reader        |Io. Reader, file transfer buffer|     |

Request example:

![get1](get1.png)

![get2](get2.png)

Error code:

| HTTP Status Code | Error Code           |Error description|
| ------- | ------------- | --------------------------------------------------- |
| 500     | InternalError |We encountered an internal error, please try again.|
| 518     | Storage       |storage not support|
| 517     | Address       |address is null|

&nbsp;

## 4. File deletion

Delete the uploaded file. Only the deletion function of MEFS type storage is supported.

Request URL: http://ip:port/mefs/delete.

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name | Variable    | Type | Must  |Description|
| --- | ----- | -------- | --- | ------------------- |
| id | File ID | id   | YES   |File ID, the sequence number in the file list|

Return parameter (JSON):

| Name    |Type [Length Limit]| Description      |
| ------ | -------- | ------- |
| Status |string| Delete ok or not |

Request example:

![delete](delete.png)

&nbsp;

## 5. File list query

The user queries the list of files uploaded by the user.

Request URL:

> http://ip:port/mefs/listobjects
> 
> http://ip:port/ipfs/listobjects

Request method: GET

A list of the files that are logged into the account is displayed.

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (JSON):

| Name     | Type |Description|
| ------- | -------- | ---------- |
| Address | string   |Account Ethereum Wallet Address|
| Storage | string   |Mefs or ipfs|
| Object  | struct   |File list|

Each file contains information:

|Parameter name| Type     | Description          |
| ----------- | ------ | ----------- |
|ID| int    | File ID        |
|Name| string | File Name         |
|Size| int64  | File size        |
|Cid| string | File CID       |
|ModTime| time   | Modification time      |
|Public| bool   | public or not      |
|UserDefined| struct | user defined info about file |

User Defined struct contains information:

| Name        | Type     |Description|
| ---------- | ------ | ------------- |
| encryption | string |File encryption method|
| etag       | string |File ID pattern (default CID)|

Request example:

![list](list.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 516     | Storage        |list object error %s|
| 518     | Storage        |storage not support|

&nbsp;

## 6. File sharing

### 6.1 Create a share

Users can create sharing links for uploaded files for other users to access the resource.

Request URL: https://api.mefs.io:10000/btctest/share.

Request method: POST

Request header information:

| Name        | Variable                               | Type | Must |Description|
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 'AccessToken after Login'" | string           | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name | Variable     | Type | Must |Description|
| ------ | -------- | ---------------- | ---- | ------------------------------------------------------------ |
| mid    | File MID  | string           | YES   |File Unique Identifier, a string returned when a file is uploaded|
| name   | File Name   | string           | YES   |File name. Since uploading multiple files with the same content is supported, you need to specify the file name.|
| type   | 0 or 1     | int              | YES   |How the file is stored, 0 means mefs object storage, 1 means ipfs object storage|
| expire | Time to expire | int              | NO   |You can optionally set an expiration time for the link. The default is unlimited.|

Return parameters:

| Name            | Type |describe|
| ----------------- | ---------------- | ------------------ |
|shareId| string           | ID for share           |
|shareDownloadLink| string           | link to download file |
|shareInfoLink| string           | info about the share link     |

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 500        | InternalError  |We encountered an internal error, please try again;|
| 518        | Storage        |storage not support;|
| 524        | DataBaseError  |Alread created the share;record not found;|
| 526        | Permission     |can't access the file.|



### 6.2. Sharing information query

Other users can query and share information through shareID for free.

Request URL: https://api.mefs.io:10000/btctest/share/info/ { shareid }

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (JSON):

| Name   | Type |Description|
| -------- | ---------------- | ------------------------------------------------------------ |
| shareid  | string           |Unique Share ID|
| userid   | struct           |User ID, including user address and user chainid|
| mid      | struct           |File list|
| type     | int              |How the file is stored, 0 means mefs object storage, 1 means ipfs object storage|
| filename | string           |File name|
| expire   | int              |Expiration time of the file. -1 is the default value, which means permanent.|

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 404        | Not Found     |The share link is not available;|
| 500        | InternalError |We encountered an internal error, please try again.|



### 6.3 Download shared files

Users can download the shared files for free by sharing ID.

Request URL: https://api.mefs.io:10000/btctest/share/ { shareID }

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (Data FromReader):

Return to the file.

| Name        |Description| Value   |
| ------------- | ------------------------- | ---- |
| code          |Status Code| 200  |
| contentLength |File size|      |
| contentType   |File type|      |
| reader        |Io. Reader, file transfer buffer|      |

Error code:

| HTTP Status Code | Error Code        |Error description|
| ---------- | ------------- | --------------------------------------------------- |
| 404        | Not Found     |The share link is not available;|
| 500        | InternalError |We encountered an internal error, please try again;|
| 524        | DataBaseError |record not found.|



### 6.4 Share list query

Users can query all shared information that has been created.

Request URL: https://api.mefs.io:10000/btctest/share.

Request method: GET

Request header information:

| Name        | Variable                               | Type | Must |Description|
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 'AccessToken after Login'" | string           | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (array):

| Name   | Type |Description|
| -------- | ---------------- | ------------------------------------------------------------ |
| shareid  | string           |Unique Share ID|
| userid   | struct           |Unique user ID, including user address and user chainid|
| mid      | string           |Unique file ID|
| type     | int              |How the file is stored, 0 means mefs object storage, 1 means ipfs object storage|
| filename | string           |File name|
| expire   | int              |Expiration time of the file. -1 is the default value, which means permanent.|

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 500        | InternalError  |We encountered an internal error, please try again.|



### 6.5 Delete Share (by Share ID)

Users can delete the created sharing connection through the sharing ID.

Request URL: https://api.mefs.io:10000/btctest/share/ { shareID }

Request method: DELETE

Request header information:

| Name        | Variable                               | Type | Must |Description|
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 'AccessToken after Login'" | string           | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (string):

"delete success"

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 404        | Not Found      |The share link is not available;|
| 500        | InternalError  |We encountered an internal error, please try again;|
| 526        | Permission     |can't delete.|



### 6.6 Delete Share (via mid)

Users can also delete the created sharing connection through mid.

Request URL: https://api.mefs.io:10000/btctest/share.

Request method: DELETE

Request header information:

| Name        | Variable                               | Type | Must |Description|
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 'AccessToken after Login'" | string           | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name | Variable    | Type | Must |Description|
| ------ | ------- | ---------------- | ---- | ------------------------------------------------------------ |
| mid    | File MID | string           | YES   |File Unique Identifier, a string returned when a file is uploaded|
| type   | File Name  | string           | YES   |How the file is stored, 0 means mefs object storage, 1 means ipfs object storage|
| name   | 0 or 1    | int              | NO   |File name. Since uploading multiple files with the same content is supported, you need to specify the file name. Randomly selected if not specified|

Return parameter (string):

"delete success"

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 404        | Not Found      |The share link is not available;|
| 500        | InternalError  |We encountered an internal error, please try again;|
| 526        | Permission     |can't delete.|



### 6.7 Save shared files

Other users can choose to save the file to their own file list.

Request URL: https://api.mefs.io:10000/btctest/share/save/ { shareid }

Request method: POST

Request header information:

| Name        | Variable                               | Type | Must |Description|
| ------------- | ---------------------------------- | ---------------- | ---- | ------------------------------------------------------ |
| Authorization | "Bearer 'AccessToken after Login'" | string           | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (string):

"add share success"

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 404        | Not Found      |The share link is not available;|
| 500        | InternalError  |We encountered an internal error, please try again;|
| 524        | DataBaseError  |record not found.|



## 7. NFT market

### 7.1 NFT List Query

Users have access to all NFTs and can optionally sort by sales, time of creation, and token _ ID.

Request URL: https://api.mefs.io:10000/btctest/nft/show?page= { page } & size = { size } & order = { order } & ASC = { true/false }

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (JSON):

| Name      | Type |Description|
| ----------- | ---------------- | --------------------- |
| TokenID     | int              |ID of the NFT|
| Owner       | string           |NFT Owner|
| Sales       | int              |Quantity sold by NFT|
| DataUrl     |string| URL for NFT's file  |
| Mid         |string| MID for NFT's file      |
| Description |string| Description for NFT file |
| Name        |string| Name for NFT file     |

Request example:

None

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 500        | InternalError  |We encountered an internal error, please try again.|

### 7.2 NFT search

Users can search according to the NFT description information.

Request URL: https://api.mefs.io:10000/btctest/nft/search?page= { page } & size = { size } & query = { query }

Request method: GET

Request header information:

None

Request Parameters:

None

Return parameter (JSON):

| Name      | Type |Description|
| ----------- | ---------------- | --------------------- |
| TokenID     | int              |ID of the NFT|
| Owner       | string           |NFT Owner|
| Sales       | int              |Quantity sold by NFT|
| DataUrl     |string| URL for NFT's file  |
| Mid         |string| MID for NFT's file      |
| Description |string| Description for NFT file |
| Name        |string| Name for NFT file     |

Request example:

None

Error code:

| HTTP Status Code | Error Code         |Error description|
| ---------- | -------------- | ---------------------------------------------------- |
| 401        | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 500        | InternalError  |We encountered an internal error, please try again.|



## 8. Check the account balance

Users query their own storage balance.

Request URL: https://api.mefs.io:10000/btctest/mefs/balance.

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (JSON):

| Name     | Type |Description|
| ------- | -------- | ------------ |
| Address | string   |The Ethereum wallet address of the login account|
| Balance | string   |The smallest unit numeric representation of the balance|

Request example:

![](balance.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|
| 516     | Storage        |make bucket error %s;|
| 518     | Storage        |storage not support|
| 520     | Eth            |rpc error|

&nbsp;

## 9. Query storage space

Users query their own storage space, including used, available, free space, and the number of files uploaded.

Request URL:

> https://api.mefs.io:10000/btctest/mefs/storageinfo

Request method: GET

Request header information:
| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name   | Variable   |Description|
| ----- | ---- | ---------------------------- |
| stype | Storage Type |Storage types that can be queried currently include mefs, ipfs, and qiniu|

Return parameter (JSON):

|Parameter name| Type | Description    |
| --------- | -------- | ----- |
|Used| string   | Used space |
|Available| string   | Available space  |
|Free| string   | Free space  |
|Files| string   | File No.   |

Request example:

![getstorage](getstorage.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;Authentication Failed (InValid token type)|

&nbsp;

## 10. Unit price query

Query the storage unit price of various storage methods.

The server has not been implemented yet.

&nbsp;

## 11. Package inquiry

Inquire about storage packages with multiple storage methods.

Request URL:

> https://api.mefs.io:10000/btctest/mefs/pkginfos

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Return parameter (JSON):

| Name     | Variable      | Type |Description|
| ------- | ------- | -------- | ---------------------- |
| Time    | Storage Time(second) | string   |Length of storage included in the package|
| Kind    | Storage Type    | int      |The storage mode of this package currently includes mefs and ipfs.|
| Buysize | Space size to purchase  | string   |Storage space included in the package|
| Amount  | Price      | string   |The price of the package|
| State   | Status      | int      |Is the subscription currently active? 1 means active, 0 means inactive|

Request example:

![pkginfos](pkginfos.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|

&nbsp;

## 12. Purchase a package (recharge)

> https://api.mefs.io:10000/btctest/mefs/buypkg

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name     | Variable   | Type | Must  |Description|
| ------- | ---- | -------- | --- | --------------- |
| amount  | amount   | string   | YES   |Amount spent|
| pkgid   | package ID | string   | YES   |Package ID, obtained according to'package query '|
| chainid | Chain ID  | string   | YES   |Execute the blockchain ID of the purchased package|

Return parameter (JSON):

| Name    | Variable  |Type [Length Limit]| Must  | Description      |
| ------ | --- | -------- | --- | ------- |
| Status | Status  |string| YES   | purchase completed or failed |

Request example:

![buypkg](buypkg.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|

&nbsp;

## 13.  Get Purchased Package

> https://api.mefs.io:10000/btctest/mefs/getbuypkgs

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

None

Return parameter (JSON):

| Name       | Variable   | Type |Description|
| --------- | ---- | -------- | ---------------- |
| Starttime | Time to Start | string   |Service start time for purchased subscription|
| Endtime   | Time to End | string   |Service end time for purchased subscription|
| Kind      | Type   | int      |0: MEFS, 1: IPFS|
| Buysize   | Size to purchase | int      |Amount of storage for the purchased plan|
| Amount    | Amount to purchase | int      |Consumption amount of the purchased package|
| State     | Status   | int      |Package status|

Request example:

![](getpurchasedpkgs.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;|

## 14. Query traffic

Users query their own storage space, including used, available, free space, and the number of files uploaded.

Request URL:

> https://api.mefs.io:10000/btctest/mefs/flowsize

Request method: GET

Request header information:

| Name           | Variable                          | Type | Must  |Description|
| ------------- | --------------------------- | -------- | --- | -------------------------------------- |
| Authorization | "Bearer 'AccessToken after Login'" | string   | YES   |If it expires, a new valid accessToken can be obtained by refreshing the accessToken|

Request Parameters:

| Name   | Variable   |Description|
| ----- | ---- | ---------------------------- |
| stype | Storage Type |Storage types that can be queried currently include mefs, ipfs, and qiniu|

Return parameter (JSON):

|Parameter name| Type | Description    |
| --------- | -------- | ----- |
|Used| string   | Used Flow |
|Free| string   | Free Flow  |


Request example:

![flowsize](flowsize.png)

Error code:

| HTTP Status Code | Error Code            |Error description|
| ------- | -------------- | ---------------------------------------------------------------------------------------------- |
| 401     | Authentication |Token is Null; Invalid token payload; Invalid token;Authentication Failed (InValid token type)|

&nbsp;

## 15. File download public

The user can download the corresponding file according to the CID of the file.

Request URL:

http://ip:port/mefs/public/$cid;

http://ip:port/ipfs/public/$cid;

> Select Download from mefs: https://api.mefs.io:10000/btctest/mefs/public/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4.
> 
> Select download from ipfs: https://api.mefs.io:10000/btctest/ipfs/public/bafkreifzwcj6vkozz6brwutpxl3hqneran4y5vtvirnbrtw3l2m3jtlgq4.

Request method: GET

Request header information:

None

Request Parameters:
| Name   | Variable   |Description|
| ----- | ---- | ---------------------------- |
|chainid| Chain ID |  |

Return parameter (Data FromReader):

Return to the file.

| Name           |Description| Value   |
| ------------- | ----------------- | --- |
| code          |Status Code| 200 |
| contentLength |File size|     |
| contentType   |File type|     |
| reader        |Io. Reader, file transfer buffer|     |

Request example:

![get3](get3.png)


Error code:

| HTTP Status Code | Error Code           |Error description|
| ------- | ------------- | --------------------------------------------------- |
| 500     | InternalError |We encountered an internal error, please try again.|
| 518     | Storage       |storage not support|
| 517     | Address       |address is null|

&nbsp;
# MEMO S3 API CN

## 启动节点和 Gateway

如果是在windows下可以直接[使用windows安装包完成安装](https://docs.memolabs.org/memo/before-begin/in-windows-os)，运行start图标以后程序会自动启动节点以及网关。并在节点的根目录下的account.txt文件中记录网关的账号和密码，默认账号为节点钱包地址，默认密码为memoriae，默认网关API端口为5080.

备注：

如果想手动部署启动节点，在memo的[启动文档](https://docs.memolabs.org/memo/start-nodes-in-linux/user/how-to-start/step-by-step)中给出了多个部署启动节点的方法可供使用。

如果想在命令行下手动启动网关，则使用以下命令启动gateway，将使用默认参数：

```sh
mefs-user gateway run 
```

也可以在启动时手动指定账号、密码、endpoint等参数，启动参数说明：

```sh
## Windows环境
C:\memouser\batch>mefs-user.exe gateway run -h
NAME:
   mefs-user gateway run - run a memo gateway

USAGE:
   mefs-user gateway run [command options] [arguments...]

OPTIONS:
   --username value, -n value  input your user name (default: "memo")
   --password value, -p value  input your password (default: "memoriae")
   --endpoint value, -e value  input your endpoint (default: "0.0.0.0:5080")
   --console value, -c value   input your console for browser (default: "8080")
   --help, -h                  show help (default: false)
```

## S3 API 列表

目前 MEMO 支持的兼容 S3 的 API 包含：

| Bucket相关                 | Object相关        |
| ------------------------ | --------------- |
| `MakeBucketWithLocation` | `ListObjects`   |
| `GetBucketInfo`          | `GetObject`     |
| `ListBuckets`            | `GetObjectInfo` |
|                          | `PutObject`     |
|                          | `DeleteObject`  |

## 操作桶的接口

### 创建一个桶

MakeBucketWithLocation(ctx context.Context, bucket string) error

| 参数       | 类型        | 描述     |
|:-------- |:--------- |:------ |
| `ctx`    | *Context* | 客户端上下文 |
| `bucket` | *string*  | 存储桶名称  |

示例

```go
// 创建客户端
func NewMemofs() (*MemoFs, error) {
    repoDir := os.Getenv("MEFS_PATH")
    addr, headers, err := mclient.GetMemoClientInfo(repoDir)
    if err != nil {
        return nil, err
    }
    napi, closer, err := mclient.NewUserNode(context.Background(), addr, headers)
    if err != nil {
        return nil, err
    }
    defer closer()
    _, err = napi.ShowStorage(context.Background())
    if err != nil {
        return nil, err
    }

    return &MemoFs{
        addr:    addr,
        headers: headers,
    }, nil
}
```

```go
err = memofs.MakeBucketWithLocation(ctx, "myBucket")
if err != nil {
    fmt.Println(err)
    return
}
fmt.Println("Successfully created mybucket.")
```

### 获取桶的详细信息

GetBucketInfo(ctx context.Context, bucket string) (bi BucketInfo, err error)

| 参数       | 类型        | 描述     |
| -------- | --------- | ------ |
| `ctx`    | *Context* | 客户端上下文 |
| `bucket` | *string*  | 存储桶名称  |

| 返回值   | 类型           | 描述    |
| ----- | ------------ | ----- |
| `bi`  | *BucketInfo* | 桶详细信息 |
| `err` | *error*      | 错误信息  |

```go
type BucketInfo struct {
    pb.BucketOption
    pb.BucketInfo
    Confirmed bool `json:"Confirmed"`
}
```

```go
type BucketOption struct {
    Version              uint32   `protobuf:"varint,1,opt,name=Version,json=version,proto3" json:"Version,omitempty"`
    Policy               uint32   `protobuf:"varint,2,opt,name=Policy,json=policy,proto3" json:"Policy,omitempty"`
    DataCount            uint32   `protobuf:"varint,3,opt,name=DataCount,json=dataCount,proto3" json:"DataCount,omitempty"`
    ParityCount          uint32   `protobuf:"varint,4,opt,name=ParityCount,json=parityCount,proto3" json:"ParityCount,omitempty"`
    TagFlag              uint32   `protobuf:"varint,5,opt,name=TagFlag,json=tagFlag,proto3" json:"TagFlag,omitempty"`
    SegSize              uint32   `protobuf:"varint,6,opt,name=SegSize,json=segSize,proto3" json:"SegSize,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

```go
type BucketInfo struct {
    BucketID             uint64   `protobuf:"varint,1,opt,name=BucketID,json=bucketID,proto3" json:"BucketID,omitempty"`
    CTime                int64    `protobuf:"varint,2,opt,name=CTime,json=cTime,proto3" json:"CTime,omitempty"`
    MTime                int64    `protobuf:"varint,3,opt,name=MTime,json=mTime,proto3" json:"MTime,omitempty"`
    Length               uint64   `protobuf:"varint,4,opt,name=Length,json=length,proto3" json:"Length,omitempty"`
    UsedBytes            uint64   `protobuf:"varint,5,opt,name=UsedBytes,json=usedBytes,proto3" json:"UsedBytes,omitempty"`
    NextObjectID         uint64   `protobuf:"varint,6,opt,name=NextObjectID,json=nextObjectID,proto3" json:"NextObjectID,omitempty"`
    NextOpID             uint64   `protobuf:"varint,7,opt,name=NextOpID,json=nextOpID,proto3" json:"NextOpID,omitempty"`
    Deletion             bool     `protobuf:"varint,8,opt,name=Deletion,json=deletion,proto3" json:"Deletion,omitempty"`
    Name                 string   `protobuf:"bytes,9,opt,name=Name,json=name,proto3" json:"Name,omitempty"`
    Root                 []byte   `protobuf:"bytes,10,opt,name=Root,json=root,proto3" json:"Root,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

 示例

```go
bucketInfo, err := memoFs.GetBucketInfo(ctx, "myBucket")
if err != nil {
    fmt.Println(err)
    return err
}
fmt.Println(bucketInfo)
```

### 列出user的所有桶

ListBuckets(ctx context.Context) (bs []BucketInfo, err error)

| 返回值   | 类型             | 描述         |
|:----- |:-------------- |:---------- |
| `bs`  | *[]BucketInfo* | 所有存储桶的信息列表 |
| `err` | *error*        | 错误信息       |

示例

```go
buckets, err := memoFs.ListBuckets(ctx)
if err != nil {
    fmt.Println(err)
    return
}
for _, bucket := range buckets {
    fmt.Println(bucket)
} 
```

## 操作对象的接口

### 列出桶中所有对象

ListObjects(ctx context.Context, bucket, prefix, marker, delimiter string, maxKeys int) (objsInfo ListObjectsInfo, err error)

可以根据指定的过滤条件列出匹配的所有对象。

| 参数          | 类型        | 描述                                                      |
| ----------- | --------- | ------------------------------------------------------- |
| `ctx`       | *Context* | 客户端上下文                                                  |
| `bucket`    | *string*  | 存储桶名称                                                   |
| `prefix`    | *string*  | 对象匹配前缀，用来限定响应中只匹配key中带有该前缀的对象，非必选，默认为空                  |
| `marker`    | *string*  | 起始对象的key标记，非必选，默认为空从第一个对象开始。指定`marker`时，从匹配位置的下一个对象开始列举 |
| `delimiter` | *string*  | 对象名称分隔符，仅支持`"/"`和`""`，只是数据展示的形式，非必选，默认为空                |
| `maxKeys`   | *int*     | 指定单次ListObjects请求返回的最大条目数量，默认值是1000                     |

| 返回值        | 类型                | 描述   |
| ---------- | ----------------- | ---- |
| `objsInfo` | *ListObjectsInfo* | 对象列表 |
| `err`      | *error*           | 错误信息 |

```go
type ListObjectsInfo struct {
    IsTruncated bool
    NextMarker string
    Objects []ObjectInfo
    Prefixes []string
}
```

示例

```go
objectsInfo, err := memoFs.ListObjects(ctx, "myBucket", "", "", "",1000)
if err != nil {
    fmt.Println(err)
    return
}
for _, object := range objectsInfo.Objects {
    fmt.Println(object)
}
```

### 获取对象

GetObject(ctx context.Context, bucketName, objectName string, startOffset, length int64, writer io.Writer) error

返回对象的数据流。

| 参数            | 类型       | 描述                              |
|:------------- |:-------- |:------------------------------- |
| ctx           | Context  | 客户端上下文                          |
| `bucketName`  | *string* | 存储桶名称                           |
| `objectName`  | *string* | 对象的名称                           |
| `startOffset` | *int64*  | 指定从对象的第几段开始获取，非必选，默认是0，表示从头开始获取 |
| `length`      | *int64*  | 指定要获取的长度，非必选，默认为对象的总长度          |
| `writer`      | *Writer* | 任意实现了io.Writer的Go类型，用来返回对象的数据流  |

示例

```go
buffer := bytes.NewBuffer(nil)
err := memoFs.GetObject(ctx, "myBucket", "myFile", 0, 33, buffer)
if err != nil {
    fmt.Println(err)
    return 
} 
```

### 获取对象信息

GetObjectInfo(ctx context.Context, bucket, object string) (objInfo ObjectInfo, err error)

| 参数       | 类型        | 描述     |
| -------- | --------- | ------ |
| `ctx`    | *Context* | 客户端上下文 |
| `bucket` | *string*  | 存储桶名称  |
| `object` | *string*  | 存储对象名称 |

| 返回值     | 类型         | 描述           |
| ------- | ---------- | ------------ |
| objInfo | ObjectInfo | 返回包含对象信息的结构体 |
| err     | error      | 错误信息         |

```go
type ObjectInfo struct {
    pb.ObjectInfo
    Parts       []*pb.ObjectPartInfo `json:"Parts"`
    Size        uint64               `json:"Size"`        // file size(sum of part.RawLength)
    StoredBytes uint64               `json:"StoredBytes"` // stored size(sum of part.Length)
    Mtime       int64                `json:"Mtime"`
    State       string               `json:"State"`
    ETag        []byte               `json:"MD5"`
}
```

示例

```go
objInfo, err := memoFs.GetObjectInfo(ctx, "myBucket", "myFile")
if err != nil {
    fmt.Println(err)
    return
}
fmt.Println(objInfo.Size) 
```

### 上传对象

PutObject(ctx context.Context, bucket, object string, r io.Reader, userDefined map[string]string) (objInfo ObjectInfo, err error)

把待上传的对象分割成多个stripe，每次处理一个stripe。

| 参数            | 类型                  | 描述                                                                      |
|:------------- |:------------------- |:----------------------------------------------------------------------- |
| `ctx`         | *Context*           | 客户端上下文                                                                  |
| `bucket`      | *string*            | 存储桶名称                                                                   |
| `object`      | *string*            | 对象的名称                                                                   |
| `reader`      | *io.Reader*         | 任意实现了io.Reader的Go类型，用来读数据从而上传                                           |
| `userDefined` | *map[string]string* | 用来设置上传对象的加密方式以及etag格式，默认`aes`加密，还可设置为空表示不加密；默认以`md5`格式生成etag，还可设置为`cid` |

| 返回值       | 类型           | 描述                        |
| --------- | ------------ | ------------------------- |
| `objInfo` | *ObjectInfo* | 返回上传对象的详细信息，包括大小、时间、etag等 |
| `err`     | *error*      | 错误信息                      |

示例

```go
file, err := os.Open("my-testfile")
if err != nil {
    fmt.Println(err)
    return
}
defer file.Close()

fileStat, err := file.Stat()
if err != nil {
    fmt.Println(err)
    return
}
userDefined := make(map[string]string)
userDefined["encryption"] = "aes"
objInfo, err := memoFs.PutObject(ctx, "mybucket", "myobject", file, userDefined)
if err != nil {
    fmt.Println(err)
    return
}
fmt.Println("Successfully uploaded bytes: ", objInfo.Size)
```

### 删除对象

DeleteObject(ctx context.Context, bucket, object string) error

将对象标记为删除状态，用户将无法展示和获取该对象。

| 参数       | 状态        | 描述     |
| -------- | --------- | ------ |
| `ctx`    | *Context* | 客户端上下文 |
| `bucket` | *string*  | 存储桶名称  |
| `object` | *string*  | 对象的名称  |

示例

```go
err := memoFs.DeleteObject(ctx, "myBucket", "myFile")
if err != nil {
    fmt.Println(err)
    return
}
err = memoFs.GetObject(ctx, "myBucket", "myFile", 0, 33, buffer)
fmt.Println(err) // "myFile" has been deleted
```

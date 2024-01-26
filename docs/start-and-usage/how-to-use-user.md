This document is detailed about how to use user node, the installation guide is in another document.
Use LFS command to operate upload and download functions.

# lfs command

Introduction

This command creates, uploads, downloads, and views a collection of containers and files for the user.

Usage

```shell
./mefs-user lfs

COMMANDS:
   createBucket    create bucket
   listBuckets     list buckets
   headBucket      head bucket info
   putObject       put object
   headObject      head object
   getObject       get object
   listObjects     list objects
   delObject       delete object
   downloadObject  download object using rpc
   showStorage     show storage info
   getPros         get pros of bucket
   help, h         Shows a list of commands or help for one command
```

Subcommands

## 1 createBucket subcommand

Introduction

This command creates buckets

Usage

```shell
./mefs-user lfs createBucket -h
```

Options

```shell
--bucket value, --bn value set bucket name 
--policy value, --pl value set erasure code (1) or multi-copy policy (2) (default is 1) 
--datacount value, --dc value set Number of data blocks (default is 3) 
--paritycount value, --pc value Set the number of parity blocks (default is 2)
```

Example

Bucket name: test, storage policy: erasure code, number of data blocks: 10, number of check blocks 5

```shell
./mefs-user lfs createBucket  --bn=test  --pl=1 --dc==10 --pc=5
```

## 2 listBuckets subcommand

Introduction

This command is used to view the status of all buckets

Usage

```shell
./mefs-user lfs listBuckets
```

## 3 headBucket subcommand

Introduction

This command is used to view all the information of the specified bucket, the following is an example (test is the bucket name)

Usage

```shell
./mefs-user lfs headBucket   --bn=test
```

## 4 putObject subcommand

Introduction

This command specifies the file for upload

Usage

```shell
./mefs-user lfs putObject -h
```

USAGE:
   mefs-user lfs putObject [command options] [arguments...]

OPTIONS:
--bucket value, --bn value use bucket name 
--object value, --on value file name after upload 
--path value upload file path 
--etag value select verification method (default: md5) 
--enc value Select encryption method (default: aes) 
--help, -h View help
```

Example

```shell
./mefs-user lfs putObject --bn=test --on=1   --path=./index.txt
```

## 5 headObject subcommand

Introduction

This command is used to view the specified file status

Usage

```shell
./mefs-user lfs headObject -h

USAGE:
   mefs-user lfs headObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --all                       show all information (default: false)
   --help, -h                  show help (default: false)
```

Example

```shell
./mefs-user lfs headObject  --bn=test --on=1
```

## 6 getObject subcommand

Introduction

Download the file to the specified path

Usage

```shell
USAGE:
   mefs-user lfs getObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --cid value                 cid name
   --start value               start position (default: 0)
   --length value              read length (default: -1)
   --path value                stored path of file
   --help, -h                  show help (default: false)
```

Example

```shell
./mefs-user lfs getObject --bn=test --on=1  --path=./index.html
```

## 7 listObjects subcommand

Introduction

View all file information of a specified bucket

Usage

```shell
USAGE:
   mefs-user lfs listObjects [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucket name, priority
   --marker value              key start from, marker should exist
   --prefix value              prefix of objects
   --delimiter value           delimiter to group keys: '/' or ''
   --maxKeys value             number of objects in return (default: 1000)
   --help, -h                  show help (default: false)
```

Example

```shell
./mefs-user lfs listObjects
```

## 8 delObject subcommand

Introductioin

delete specified file

Usage

```shell
USAGE:
   mefs-user lfs delObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --help, -h                  show help (default: false)
```

## 9 downloadObject subcommand

Introduction

Download objects using rpc

Usage

```shell
USAGE:
   mefs-user lfs downloadObject [command options] [arguments...]

OPTIONS:
   --bucket value, --bn value  bucketName
   --object value, --on value  objectName
   --cid value                 cid name
   --start value               start position (default: 0)
   --length value              read length (default: -1)
   --path value                stored path of file
   --help, -h                  show help (default: false)
```

## 10 showStorage subcommand

Introduction

Display the storage information of the node

Example

```shell
./mefs-user lfs showStorage
Lfs has storage:  40.69 MiB
```

## 11 getPros subcommand

Introduction

View the bucket user list

Example

```shell
./mefs-user lfs getPros 0
bucket 0 select providers:  [8 21]
```

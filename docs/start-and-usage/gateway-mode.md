# Gateway Mode

Multiple users can share one mefs's running program. 

## User Agent Start

After mefs is started, other users can also be started as a proxy.

```shell
mefs-user lfs start <addr> --sk=<private key> --pwd=<password>
```

Parameter explanation:

```shell
addr：account address;

--sk：the private key of the user; if the private key corresponding to the address does not match, the address of the private key shall prevail;

--pwd：user's password;
```

## User Agent Stop

After mefs is started, other users can also be shut down by proxy.

```shell
mefs-user lfs kill <addr> --pwd=<password>
```

Parameter explanation:

```shell
addr：account address

--pwd：account password
```

## Usage

- Cli

```shell
mefs-user rootcmd subcmd arg1 op1=arg2 --addr=<public key>
```

- Http

```shell
curl "http://<ip>:5001/api/v0/<roocmd>/<subcmd>?arg=<arg1>&op1=<arg2>&addr=<public key
```

## Example

The user whose address is the public key obtains the file named ObjectName from the BucketName bucket.

- Cli

```shell
mefs_user lfs get_object <BucketName> <ObjectName> --addr=<public key>
```

- Http

```shell
curl  "http://127.0.0.1:5001/api/v0/lfs/get_object?arg=<BucketName>&arg=<ObjectName>&addr=<public key>"
```

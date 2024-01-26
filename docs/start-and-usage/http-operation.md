# HTTP Operation

Mefs commands can all be operated using HTTP.

Configuration

Before mefs-user starts, confirm the following configuration is set in the config.json:

```shell
// mefs api port setting, default is 5001

api.address is set to: /ip4/0.0.0.0/tcp/5001

// cross-domain access

api.accessControlAllowOrigin is set to: ["*"]

api.accessControlAllowMethods is set to: ["PUT","GET", "POST"]
```

Then restart mefs-user to use HTTP to operate.

**Usage**

A command similar to the following:

```shell
mefs-user rootcmd subcmd <arg1> <arg2> -opname1=<op1> -opname2=<op2>
```

The corresponding HTTP request is:

```shell
curl "http://<ip>:<port>/api/v0/<rootcmd>/<subcmd>?arg=<arg1>&arg=<arg2>&opname1=<op1>&opname2=<op2>"
```

IP is the network address of the machine where mefs-user is started. The port defaults to 5001. If cross-domain access is configured before running, you can use the external network IP to access, otherwise you can only access it through 127.0.0.1.

## Example

### Show all bucket information

```shell
curl "http://127.0.0.1:5001/api/v0/lfs/list_buckets?addr=<public key>"
```

The output is in standard JSON format:

```json
  {
    "Method": "List Buckets",
    "Buckets": [
      {
        "BucketName": "<BucketName>",
        "BucketID": "<BucketID>",
        "Ctime": "<Ctime>",
        "Policy": "<Policy>",
        "DataCount": "<DataCount>",
        "ParityCount": "<ParityCount>"
      },
      {
        "BucketName": "<BucketName>",
        "BucketID": "<BucketID>",
        "Ctime": "<Ctime>",
        "Policy": "<Policy>",
        "DataCount": "<DataCount>",
        "ParityCount": "<ParityCount>"
      }
    ]
  }
```

### Display Information about All Objects in a Bucket

```shell
curl "http://127.0.0.1:5001/api/v0/lfs/list_objects?arg=<BucketName>&addr=<public key>"
```

The output is in standard JSON format:

```json
{
  "Method": "List Objects",
  "Objects": [
    {
      "ObjectName": "<ObjectName>",
      "ObjectSize": "<ObjectSize>",
      "Ctime": "<Ctime>",
      "Dir": "<Dir>",
      "LatestChalTime": "<LatestChalTime>"
    },
    {
      "ObjectName": "<ObjectName>",
      "ObjectSize": "<ObjectSize>",
      "Ctime": "<Ctime>",
      "Dir": "<Dir>",
      "LatestChalTime": "<LatestChalTime>"
    }
  ]
}
```

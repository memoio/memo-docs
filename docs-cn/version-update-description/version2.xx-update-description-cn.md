### Version2.6.4

修改内容：

1. 质押的收益不参加后续的分润

2. 提取质押，需要距离最后一笔质押180天之后；用户执行`quit role`需要距离注册`role`的360天之后

3. 质押收益可以随时取；质押和质押收益的提取各用单独的命令`mefs-user pledgeWithdraw` `mefs-user pledgeRewardWithdraw`

4. info面板显示改动：provider的`voucher`改为`income`，`income`数值表示可提取收益

&nbsp;

### Version2.6.5

修改内容：

1. 修复了一个info面板中的显示错误

2. 修改订单默认时长为1000天

3. provider节点默认不会删除到期数据，当设置MEFS_CLEANUP环境变量为true后才会删除

&nbsp;

### Version2.7.0

1. 增加新功能：用户选择上传lfs元数据到keeper链
2. 上传对象时为对象添加etag
3. 显示面板的相关修复
4. 修复user在传输对象时的一些bug
5. 一些性能优化

### Version2.7.1

修复user在重度传输负载时的相关问题

### Version2.7.2

修复keeper的共识bug

### Version2.7.3

修复keeper的共识bug

### Version2.7.4

修复keeper的共识bug
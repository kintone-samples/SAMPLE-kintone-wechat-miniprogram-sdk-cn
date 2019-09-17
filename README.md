# 小程序：库存管理
这是一个在微信小程序中使用 [kintone-wechat-miniprogram-sdk](https://github.com/kintone/kintone-wechat-miniprogram-sdk) 来连接kintone的例子。<br>
包括了对kintone记录的添加、更新和删除，文件的上传和下载等。

# 如何使用
### 1. 请先安装以下工具
[nodejs](https://nodejs.org/en/download/)<br>
[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)<br>

### 2. 请把整个资源库clone或下载到本地。

### 3. 创建kintone的应用
资源库根目录下的 “商品库存管理.zip” 文件是一个kintone应用的模板文件。<br>
请导入它，在kintone中创建一个新应用。参考：[通过导入模板文件创建应用](https://help.cybozu.cn/k/zh/user/create_app/app_csv/add_app_template_file.html)

### 4. 导入微信小程序项目
资源库根目录下的 inventory_management 目录是一个微信小程序项目的目录。<br>
<br>
**4.1 安装依赖**<br>
进入 inventory_management 目录，执行以下命令
```bash
npm install
```
**4.2 修改kintoneConfig.js**<br>
根据实际情况，修改 inventory_management/common/kintoneConfig.js 文件中的 domain、username、password 和 appId 字段。<br>
```javascript
  domain: 'xxx.cybozu.cn', //kintone的domain地址
  username: 'xxx', // kintone的用户名
  password: 'xxx', // 登录密码
  appId: 'xxx', // "商品库存管理"应用的ID
```
**4.3 导入**<br>
以 inventory_management 目录作为小程序项目的目录，在微信开发者工具中导入它。<br>
没有自己的小程序ID的，可以使用测试号。<br>
![](./img/import.png?raw=true)<br>
<br>
勾选“[增强编译](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html#%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%AF%91)，使用 npm 模块”<br>
![](./img/setting.png?raw=true)<br>
<br>
再“[构建 npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)”<br>
![](./img/build.png?raw=true)<br>
<br>
完成上述步骤，即可开始使用该小程序<br>
<br>
**注意：** 连接的kintone地址需要在小程序的[域名配置](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html#1.%20%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%9F%9F%E5%90%8D%E9%85%8D%E7%BD%AE)中登记，或者勾选“[不校验合法域名](https://developers.weixin.qq.com/miniprogram/dev/devtools/project.html#%E9%A1%B9%E7%9B%AE%E8%AE%BE%E7%BD%AE)”<br>
![](./img/setting2.png?raw=true)

# License
MIT License

# Copyright
Copyright(c) Cybozu, Inc.
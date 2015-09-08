
# CreditCloud to B Service Mobile-Website (aka _H5_) Development/Deployment Guide



Development
===========

1. 安装 Node.js 开发环境
1. 命令行里进入 `mobile/dev` 文件夹
1. 执行 `npm run init`
1. 复制 `router.coffee.sample` 文件，并将新复制的文件改名为 `router.coffee`
1. 修改 `router.coffee` 内的 `API_SERVER` 变量，使其指向实际的后台服务器地址（本地或远程地址均可）

以上各步骤只需要执行**一次**，待正确完成后，**日常开发**只需要执行 `npm start` 启动测试环境，然后前往 http://localhost:4000 开始测试









Deployment
==========

> Unix 或 Linux 环境

1. 安装 Node.js 开发环境
1. 进入 `mobile` 文件夹
1. 执行 `./build.sh` 编译生产环境

完毕后会在该目录下生成 `dist` 文件夹，即为待部署的目标文件

ds-boilerplate
==============

##安装

安装 node，mac/linux 推荐用 nvm，windows 直接下载安装包安装。版本为最新稳定版 v0.10.33

在项目目录下 `npm install`

然后安装全局的 bower 工具 `npm install -g bower`

进入 assets 目录，用 `bower install` 安装前端第三方库

之后就可以在项目根目录下 node index.js 启动，然后访问 http://localhost:1234/


##说明

###规范
目前对编码风格没有硬性规定，之后合作过程中发现问题再逐步改进。文件安排方式需要遵照下述规则：

###目录结构

####views/ 目录
目录下放 html 模板文件，路径对应于访问路径，会自动查找 index.html 文件，如 http://localhost:1234/ 打开的是 `views/index.html`, http://localhost:1234/hello/ 打开的是 `views/hello/index.html`，而 http://localhost:1234/world 使用的是 `views/world.html`

实际使用的是 ractive 模板，与 mustache 兼容，所以后续我们会在特定 url 上加上模板中的变量，如列表页会有 `loanList` 变量，以后可以直接在模板文件中写

    {{#each loanList}}
        <h2>{{title}}</h2>
    {{/each}}

详细语法可参考 ractive 与 mustache 的文档。

目前，可以暂时先把模板当做纯静态文件来写。

####views/_partials 目录
这个目录下的文件会作为全局的 partial 被别的文件引用，引用时的名称为不带 `.html` 扩展名部分的文件名。如 index.html 的源码是这样的

    <!doctype html>

    <link rel="stylesheet" href="/assets/css/base.css" />

    {{>header}}
    <img src="/assets/img/cclogo.png" alt="CreditCloud">
    <h1> Hello, World! </h1>
    {{>footer}}
    <script src="/assets/js/main/a.js"></script>

其中 `{{>header}}` 会被 `views/_partials/header.html` 文件内容替换，`{{>footer}}` 类似。

####assets/ 目录
所有静态文件放在这里，可以直接在 localhost:1234 对应的路径下访问到。需要注意的是对 css 和 js 做了预处理：

`assets/css` 目录下的 less 文件访问时会自动生成对应的 css 文件，参考 http://localhost:1234/assets/css/base.css 的输出效果。

`assets/js/main` 目录下的 js 文件会用 browserify 做 bundle，参考 a.js 和 http://localhost:1234/ 的 console 输出效果。

所有的第三方库，如果是前后端通用的 js 库，首选 npm 安装，否则的话尽量用 bower 来查找安装并写入到 bower.json（用`bower install --save 命令）。如果 npm 和 bower 里面都没有，才考虑下载文件放到 `assets/js/libs` 目录下。

第三方 js 库只有一个入口，将文件相对于 `assets/js/lib.json` 的路径写到 `lib.json` 中，然后访问 http://localhost:1234/assets/js/lib.js 会自动合并成一个文件。


###静态文件引用
html、js、css 里出现有引用 assets 目录下静态文件的地方，一律写为 `/assets/` 开头的绝对路径。

正确的做法：

    <img src="/assets/img/cclogo.png" alt="CreditCloud">

错误的做法：

    <img src="assets/img/cclogo.png" alt="CreditCloud">
    <img src="./assets/img/cclogo.png" alt="CreditCloud">



###pm 模块
NODE_ENV=production , 用 npm start运行
NODE_ENV=other , 用 `npm run dev` 或 node index`

###cc-debug 作为 log工具

先起logio
非production环境,方便的可以起`node master`
production环境,自己用 node logio

使用
```js
var debug = require("debug")(namespace);

debug(log)

debug.debug()
debug.warn()
debug.error()
```
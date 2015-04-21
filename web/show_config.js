//用这个代码确认当前环境下加载的配置
// node show_config.js
// NODE_ENV=production node show_config.js
console.log(JSON.stringify(require('config'), void '', '  '));

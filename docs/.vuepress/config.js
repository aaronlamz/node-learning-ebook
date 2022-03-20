const path = require('path');

module.exports = {
  title: 'Node.js 学习指南',
  description: '构建前端知识体系',
  base:'/node-learning/',
  themeConfig: {
    logo: '/nodejs.svg',
    nav:  [
      { text: '首页', link: '/' },
      { text: '导航', link: '/md/resource/'},
      { text: '指南', link: '/md/guide/' },
      { text: 'GitHub', link: 'https://github.com/Aaronlamz/node-learning'}
    ],
    sidebar: {
      '/guide/':[
        '',
        'basic'
      ]
    }
  },
  // 注意修改webpack配置后必须重新重启服务器才生效，晕，查了半天。
  configureWebpack: {
    resolve: {
      alias: {
        '@img': path.resolve(__dirname, '../asstes/img'),
      }
    }
  }
}

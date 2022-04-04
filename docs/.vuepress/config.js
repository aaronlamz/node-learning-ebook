const path = require('path');

module.exports = {
  lang: 'zh-CN',
  title: 'Node.js 学习指南',
  description: '构建 Node.js 知识体系',
  base:'/node-learning/',
  theme: '@vuepress/theme-default',
  themeConfig: {
    displayAllHeaders:true,
    logo: '/nodejs.svg',
    navbar:  [
      { text: '首页', link: '/' },
      { text: '指南', link: '/md/guide/' },
      { text: 'GitHub', link: 'https://github.com/Aaronlamz'}
    ],
    sidebar: {
      '/md/guide/': [
        {
          text: '基础入门',
          collapsible:true,
          children: [
            '/md/guide/README.md',
          ],
        },
        {
          text: '核心概念',
          path:'/md/guide/',
          collapsible:true,
          children: [
            '/md/guide/core/basic-principle.md',
          ],
        },
        {
          text: '调试指南',
          path:'/md/guide/',
          collapsible:true,
          children: [
            '/md/guide/debug/README.md'
          ],
        },
        {
          text: '实战指南',
          path:'/md/guide/',
          collapsible:true,
          children: [
            '/md/guide/practice/README.md'
          ],
        },
      ],
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

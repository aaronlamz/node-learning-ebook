const path = require('path');

module.exports = {
  lang: 'zh-CN',
  title: 'Node.js 学习指南',
  description: '构建 Node.js 知识体系',
  base:'/node-learning/',
  head: [['link', { rel: 'icon', href: '/node-learning/favicon.ico' }]],
  theme: '@vuepress/theme-default',
  themeConfig: {
    displayAllHeaders:true,
    logo: '/nodejs.svg',
    navbar:  [
      { text: '首页', link: '/' },
      { text: '指南', link: '/md/guide/basic/node-intro' },
      { text: '面试', link: '/md/interview/' },
      { text: '关于', link: '/md/about/' },
      { text: 'GitHub', link: 'https://github.com/Aaronlamz'}
    ],
    sidebar: {
      '/md/guide/': [
        {
          text: '基础入门',
          collapsible:true,
          children: [
            '/md/guide/basic/node-intro.md',
            '/md/guide/basic/basic-principle.md',
          ],
        },
        {
          text: '深入理解',
          path:'/md/guide/',
          collapsible:true,
          children: [
            '/md/guide/basic/basic-principle.md',
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
  alias: {
    '@img': path.resolve(__dirname, '../assets/img')
  }
}

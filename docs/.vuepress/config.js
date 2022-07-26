const path = require('path');

module.exports = {
  lang: 'zh-CN',
  title: 'Node.js 学习指南',
  description: '构建 Node.js 知识体系',
  base:'/node-learning-ebook/',
  head: [['link', { rel: 'icon', href: '/node-learning-ebook/favicon.ico' }]],
  theme: '@vuepress/theme-default',
  themeConfig: {
    displayAllHeaders:true,
    logo: '/nodejs.svg',
    navbar:  [
        { text: '首页', link: '/' },
        { text: '指南', link: '/md/guide/basic/node-intro' },
        { text: '面试', link: '/md/interview/basic/' },
        { text: '关于', link: '/md/about/' },
        { text: '仓库', link: 'https://github.com/aaronlamz/node-learning-ebook' },
    ],
    sidebar: {
        '/md/guide/': [
        {
          text: '基础入门',
          collapsible:false,
          children: [
            '/md/guide/basic/node-intro.md',
            '/md/guide/basic/basic-principle.md',
            '/md/guide/basic/module-mechanism.md',
          ],
        },
        {
          text: '系统模块',
          collapsible:false,
          children: [
            '/md/guide/system-module/globals.md',
            '/md/guide/system-module/fs.md',
            '/md/guide/system-module/buffer.md',
          ],
        },
        {
          text: '深入理解',
          path:'/md/guide/',
          collapsible:false,
          children: [
            '/md/guide/deep/asyn-io.md',
            '/md/guide/deep/memory.md',
            '/md/guide/deep/process.md',
          ],
        },
        {
          text: '调试指南',
          path:'/md/guide/',
          collapsible:false,
          children: [
            '/md/guide/debug/README.md'
          ],
        },
        {
          text: '实战指南',
          path:'/md/guide/',
          collapsible:false,
          children: [
            '/md/guide/practice/README.md'
          ],
        },
      ],
      '/md/interview/': [
        {
          text: '面试指南',
          path:'',
          collapsible:false,
          children: [
            '/md/interview/basic/README.md',
            '/md/interview/module/README.md',
          ],
        },
      ]
    }
  },
  alias: {
    '@img': path.resolve(__dirname, '../assets/img')
  }
}

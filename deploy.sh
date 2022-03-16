#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm install
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME
git init
git config --global user.email "qylinxia@qq.com"
git config --global user.name "Aaronlamz"
git status
git branch -m master main
git add -A
git commit -m 'deploy'
git status

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git reset --soft HEAD^
git push -f git@github.com:Aaronlamz/node-weekly.git origin main:gh-pages

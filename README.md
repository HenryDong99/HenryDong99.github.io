<h1 align="center">个人主页</h1>

<p align="center">My Academic Personal Homepage</p>

## 内容结构

- `_pages/about.md` 是主页入口，通过 `_includes/about/` 中的 Markdown 片段组合个人简介、论文、荣誉和教育经历。
- `_notes/` 保存公开笔记，每个 Markdown 文件会生成一个独立页面。
- `_pages/notes.md` 是笔记目录页，会自动读取并按更新时间展示所有笔记。
- `_data/navigation.yml` 管理顶部导航。

## 新增笔记

在 `_notes/` 下按主题建立目录并创建 Markdown 文件，例如：

```text
_notes/wireless/new-note.md
```

文件开头使用以下元数据：

```yaml
---
title: "笔记标题"
summary: "用于目录页展示的一句话摘要。"
category: "Wireless Communications"
tags:
  - tag one
  - tag two
created: 2026-08-12
updated: 2026-08-12
---
```

正文使用普通 Markdown。修改内容时同步更新 `updated`，笔记目录会自动重新排序。文件路径会对应公开地址，例如上面的文件会生成 `/notes/wireless/new-note/`。

## 本地预览

项目使用 Ruby 3.3。macOS 使用 Homebrew 时，可按下面的方式准备环境：

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle install
./run_server.sh
```

打开终端中显示的本地地址即可预览。页面内容和样式会自动刷新；修改 `_config.yml` 后需要重启本地服务。

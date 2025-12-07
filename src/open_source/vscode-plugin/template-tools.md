---
date: 2024-01-16
title: template-tools介绍
shortTitle: 通过模板生成数据
description: 通过模板批量处理数据 view页面通过plug-view项目打包生成
tag:
  - template
  - vscode
  - 插件
category:
  - 开源
banner: http://image.nikolazhang.top/wallhaven-nrwq11.jpg

author: nikola
icon: paw

isOriginal: true
sticky: false
timeline: true
article: true
star: true

---

> Replacing content in a template with data

## How to use

1. First create a file with template suffix.
2. Provide a template with the placeholder ${x}.
3. Select how the data will be supplied, such as by input or file import.
4. Click Generate to replace the placeholders in the template with data.

Caution:

- By input, the x in the placeholder is the index of the entered word.  
- For file upload, the x is the word in the table header.

The words need to be a combination of letters, numbers, and underscores, and can be separated by spaces.

## Example

### Using manual input

![en_manual](https://gitee.com/NikolaZhang/plugin-page/raw/master/imags/en_manual.png)

### Using file uploading

![en_upload](https://gitee.com/NikolaZhang/plugin-page/raw/master/imags/en_upload.png)

## Other

This project is used to work with vscode plugin, save and export on the page as calling methods in vscode.

---
title: Windows终端美化
tag:
  - beautify
  - windows
  - terminal
category: beautify
description: Windows终端美化
date: 2023-03-02

author: nikola
icon: paw

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

![20240213101528](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/windows终端美化/20240213101528.png)

## powershell 版本更新

默认版本为5.x，以下基于7.x版本，安装方式如下。

采用并行的方法，下载zip，解压后。为terminal添加pwsh.exe的全路径，基于该版本进行配置。

[在 Windows 上安装 PowerShell - PowerShell](https://learn.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3#zip)

## 安装scoop

[scoop](https://www.notion.so/scoop-0afa48af43d74c00a4251a48877c0740)

## 安装git

```powershell
scoop install git
```

## 安装字体

```powershell
# scoop默认没有开启nerd-fonts分类，需要开启才能安装相关字体
scoop bucket add nerd-fonts
# 安装字体时需要在管理员权限的终端中运行
scoop install Meslo-NF-Mono
```

## 安装****Windows Terminal****

配置 Windows Terminal，点击下拉菜单选择设置打开设置标签页，然后依次修改以下选项：

- 启动 -> 默认配置文件，改为 Powershell，如果你已经安装了 Powershell 7.2，这里应当可以自动搜索到。否则可能需要手动编辑配置文件。
- 启动 -> 默认终端应用程序，改为 Windows Terminal。
- 外观 -> 在选项卡中显示亚力克效果，选择启用。
- 配色方案，这里可以根据自己喜好调整。
- 配置文件默认值 -> 外观 -> 字体，改为 `MesloLGS NF` 字体，字号按照自己屏幕大小选择，再开启亚力克效果，透明度选择 70% 左右。

这样一来，Windows Terminal 的配置就算完成了。当然如果你对自带的配色方案不满意，也可以从网络上寻找一些好看的配色方案， 其他设置也可以根据自己喜好进行修改，这里就不多做介绍了。

## ****安装 oh-my-posh****

```powershell
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

安装成功之后，设置主题

```powershell
# 首先需要加载oh-my-posh模块
Import-Module oh-my-posh
# 然后指定一个主题
Set-PoshPrompt -Theme gmay
```

持久化配置：编辑配置文件$PROFILE

```powershell
code $PROFILE
```

添加如下内容：

```powershell
Import-Module oh-my-posh
Set-PoshPrompt -Theme gmay
```

如果Set-PoshPrompt提示错误，oh-my-posh的执行文件应该没有找到。关闭终端重试，或者直接安装exe，使用scoop也可。

## ****Terminal-Icons****

Terminal-Icons 是一个为 Powershell 显示文件类型图标的 Powershell 模块，显示的图标同样基于 nerd-fonts。不过刚才我们已经安装并在终端中使用了 nerd-fonts，所以放心安装就可以了。

```powershell
Install-Module -Name Terminal-Icons -Scope CurrentUser
```

安装完毕后，在终端中导入模块，再运行一下 `Show-TerminalIconsTheme` 命令，就可以看到 Terminal-Icons 为文件类型显示图标的例子了。

```powershell
Import-Module -Name Terminal-Icons
Show-TerminalIconsTheme
```

同样的，为了让所有终端都能生效，应该将下面一行添加到 `$PROFILE` 中。这样，以后再使用 `dir` 等命令显示文件的时候，都会显示出对应的图标。

```powershell
Import-Module -Name Terminal-Icons
```

## ****PSReadLine****

想让 Powershell 也拥有提示和补全功能？PSReadLine 可以帮你，这是一个可以增强终端体验的工具。

```powershell
Install-Module PSReadLine -AllowPrerelease -Force
# 或者你喜欢稳定版
Install-Module PSReadLine -Scope CurrentUser
```

### 配置

要使用 PSReadLine，同样需要在 `$PROFILE` 中添加一些配置。如果想了解下面配置的意思，可以参考官方文档，[https://docs.microsoft.com/en-us/powershell/module/psreadline/about/about_psreadline](https://docs.microsoft.com/en-us/powershell/module/psreadline/about/about_psreadline)

```powershell
Import-Module PSReadLine
Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -BellStyle None
Set-PSReadLineKeyHandler -Chord 'Ctrl+d' -Function DeleteChar
```

## 参考

### oh my posh

[Introduction | Oh My Posh](https://ohmyposh.dev/docs/)

## 我的配置

最后贴上我的`$PROFILE`配置：

```powershell
chcp 65001
Import-Module PSReadLine
Set-PSReadlineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadlineKeyHandler -Key Tab -Function Complete # 设置 Tab 键补全
Set-PSReadLineKeyHandler -Key "Ctrl+d" -Function MenuComplete # 设置 Ctrl+d 为菜单补全和 Intellisense
Set-PSReadLineKeyHandler -Key "Ctrl+z" -Function Undo # 设置 Ctrl+z 为撤销
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward # 设置向上键为后向搜索历史记录
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward # 设置向下键为前向搜索历史纪录


function which($name) { Get-Command $name | Select-Object Definition }
function rmrf($item) { Remove-Item $item -Recurse -Force }
function mkfile($file) { "" | Out-File $file -Encoding ASCII }
Import-Module posh-git
Import-Module oh-my-posh
Import-Module Get-ChildItemColor
Import-Module WindowsConsoleFonts
Set-Alias l Get-ChildItemColor -option AllScope
Set-Alias ls Get-ChildItemColorFormatWide -option AllScope
Set-Theme qwerty
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\qwerty.omp.json" | Invoke-Expression
```

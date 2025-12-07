---
title: 配置clion的stm32开发环境
tag:
  - clion
category: stm32
description: 使用clion进行stm开发的配置方式
date: 2024-03-12

author: nikola
icon: paw

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

> 使用keil进行stm32开发，代码提示不如clion。为了使用clion进行开发，需要配置相关环境信息。

## OpenOCD和Stm32CubeMX

OpenOCD是一款开源工具，允许使用各种JTAG编程器通过GDB调试各种ARM设备。该工具可以在[gnutoolchains](https://gnutoolchains.com/arm-eabi/openocd/)下载。

Stm32CubeMX是一款开源的STM32的IDE，可以生成STM32的工程文件。该工具可以在[stm32cubemx](https://www.st.com/content/st_com/en/stm32cubemx.html)下载。

下载后，找个位置安装，将路径配置到Clion的Settings中，如下图：

![20240313214724](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313214724.png)

## CMake配置

下载[arm-none-eabi-gcc](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads)，解压后配置到下面位置：

![20240313214613](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313214613.png)

![20240313223442](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313223442.png)

## 创建项目

创建项目的时候，选择`stm32cubemx`。

![20240313213131](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313213131.png)

### 选择配置

`select board config file`的作用是选择板子的配置信息。我买的是淘宝的极简板，这个配置一般是没有的。这里可以直接跳过。

![20240313214005](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313214005.png)

之后会自动运行stm32cubemx，如果没有启动，可以直接外部启动，或者通过ioc文件运行。

![20240313221126](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313221126.png)

## 使用stm32cubemx生成项目代码

通过clion进入，芯片可能不是我们想要的。需要点击home，选择我们的芯片。

![20240313221514](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313221514.png)

![20240313221714](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313221714.png)

可以点击星号，收藏芯片，下次可以直接点击左上角的星号找芯片。双击列表中的芯片，可以确认选中该芯片。

之后，可以配置芯片引脚类型，及标签。这里设置PB3为GPIO-Output，标签为LED。

![20240313222328](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313222328.png)
![20240313232022](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313232022.png)
配置项目名称，路径，以及IDE。

![20240313222636](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313222636.png)

生成文件配置，勾上`Generate peripheral initialization as a pair of’.c/.h’ files per peripheral`为每个外设生成一对".c/.h "文件的外设初始化文件。

![20240313222751](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313222751.png)

点击右上角生成代码。生成之后关闭stm32cubemx即可。

## 运行项目

在main.c中，找到`while(1)`，在其中添加下面两行代码，用于控制引脚电平反转

```c
HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);
HAL_Delay(1000);

```

在运行配置中，添加`OpenOCD Download & Run`，配置如下：

![20240313224155](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/20240313224155.png)

图中stlink.cfg文件，内容如下，可以复制到文件中，放到项目里。

```shell
source [find interface/stlink.cfg]
transport select hla_swd
source [find target/stm32f1x.cfg]
adapter speed 10000
```

运行项目，效果如下：

![VID_20240313_232355 -small-original](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/2-stm32-dev-env/VID_20240313_232355%20-small-original.gif)

## 参考

[手把手教你用Clion进行STM32开发](https://zhuanlan.zhihu.com/p/628628503)
[配置CLion用于STM32开发](https://zhuanlan.zhihu.com/p/145801160)

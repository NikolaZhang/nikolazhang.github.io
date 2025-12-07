---
date: 2023-11-18
title: 图片放映视频生成
shortTitle: 图片放映视频生成
description: 生成图片放映视频
tag:
  - python
  - 音乐
  - 视频
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

> 提供音乐，以及图片生成一个图片播放的视频。

## 介绍

对video_maker的重构, 使用pygame进行图像的绘制.
并对结构进行调整, 更好的封装,继承.

## 功能

- [x] 实时展示音乐频谱图
- [x] 音乐播放
- [x] 歌词爬取
- [x] 歌词及翻译展示
- [x] 动态元素
- [x] 背景图片
- [x] 音乐频谱样式
- [ ] 生成视频
- [ ] 提前计算粒子轨迹数据,性能优化



### pygame简单使用

下述程序需要指定环境,需要在运行前指定环境参数. 建议使用test配置. 修改部分参数即可.

#### 绘制图形

1. 各种图形绘制 
2. 示例程序: [`draw_shape.py`](test/draw/draw_shape.py)
    ![aaa](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/shapes1.png)

3. 绘制函数图像  
    示例程序: [`draw_trace.py`](test/draw/draw_trace.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/function.png)

#### 清屏与不清屏

1. 不清屏会显示历史位置  
    示例程序: [`bubble_test.py`](test/pygame/test.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/points1.gif)

2. 清屏只显示当前位置  
    示例程序: [`bubble_test.py`](test/pygame/test2.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/points2.gif)

#### font的使用

1. 使用透明度进行叠加  
    示例程序: [`test_alpha.py`](test/text/test_alpha.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/font1.png)

2. 使用字体，以及位置设定  
    示例程序: [`test_font.py`](test/text/test_font.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/font2.png)

### 粒子效果

#### 随机泡泡

示例程序: [`bubble_test.py`](test/particle/bubble_test.py)  

#### 随机碰撞泡泡

示例程序: [`bubble_test.py`](test/particle/collision_test.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/particle2.gif)

#### 下落粒子

示例程序: [`simple_test.py`](test/particle/simple_test.py)  
这个程序为你演示实际生成粒子, 以及粒子动画的底层逻辑.  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/particle3.gif)

#### 烟花效果

示例程序: [`upfirework_test.py`](test/particle/upfirework_test.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/particle4.gif)

下面的程序是对上面的简化。  
示例程序: [`upfirework_test2.py`](test/particle/upfirework_test2.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/firework2.gif)

#### 粒子数据预生成

示例程序: [`compute_test.py`](test/particle/compute_test.py)  
当粒子数量较多时, 实时粒子生成展示的方式会出现卡顿, 因此使用预生成粒子数据的方式。  

粒子的装载方式与上述装载方式相同, 只是最后展示调用的方法不同, 实际调用`show_compute`.

通过display_context中的`is_compute`可以控制是否使用预生成方式

### 歌词爬取

1. 获取网易云上的歌词
    示例程序: [`request_music.py`](test/spider/request_music.py)
    `NetEaseRequest`需要歌曲id作为参数.
    `search_lyric`方法会返回两个集合, 一个是原始歌词, 另一个是翻译.  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/歌词结果.png)

2. 歌词分割，将比较长的歌词分成固定长度的，切分为多行:  
    示例程序: [`test_split.py`](test/text/test_split.py)  
    ![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/word_split.png)

### 图像处理

#### 将图像对齐到指定大小

自动将图像补充高度或者宽度，补充的内容会进行模糊化处理。

示例程序: [`test.py`](test/image/test.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/图片补充.png)

### 音乐可视化

#### 音乐频谱柱状图

示例程序: [`test2.py`](test/weave/test2.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/bars.gif)

#### 音乐频谱环绕圆形

示例程序: [`test.py`](test/weave/test.py)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/weave_circle.gif)

## main

`main.py` 是程序入口，组合了多个元素。运行截图如下：  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/run.png)  
![default](https://gitee.com/NikolaZhang/music_show/raw/master/resources/image/run2.png)  

## 一些总结

1. 系统自动去装载程序命令指定的环境，如果没有则更具`env.py`中的默认值加载环境参数。
2. `PygameDisplay`可以提供一个视图，当需要展示一些动态元素的时候，使用它非常方便。
3. 需要给`PygameDisplay`提供play_time参数，指定展示时间。
4. `PygameDisplay`的`add_element`方法，允许添加动态元素。元素需要继承`BaseElement`
5. `PygameDisplay`的`show`方法，即可播放。

## 关于粒子数据预生成

有两种方案:

1. 使用pygame动态生成方式, 但是时间序列提前生成. 代码中根据当前时间参数进行粒子数据的生成和存储.  
    这种方式和原始动态生成有很多代码需要兼容.
2. 使用`particle/compute`包下的代码提前生成粒子数据.

动态粒子都是用[particle/compute](particle/compute)包下的代码.  
最初的动态粒子使用生成时间

## issue

### 1. 使用sprite进行粒子轨迹计算不知为啥碰撞粒子不会碰撞了

### 2. 生成视频时长不对. 而且无法录音(可以后期为mp4添加音乐)

## end

\T_T/ a gift for touhouer.

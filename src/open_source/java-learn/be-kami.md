---
date: 2023-11-25
title: java学习demo
shortTitle: java学习demo
description: java学习demo
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

> 希望该项目能方便大家学习和使用java.
> 想把平时用的技术做出一些 demo. 每个模块的`README.md`中尽可能详细的介绍项目的使用方法.
> 请先了解相关项目的 README, 之后再查看代码. 因为大多数项目不能直接正常启动, 需要准备外部环境, 并在项目中进行本地配置.
> 希望能帮助一些有需要的人. 方便快速的入门、测试等.

## TODO List

- [x] shardingsphere
  - [x] 读写分离
    - [x] 读写分离demo
  - [x] 数据分片
    - [x] 数据分片demo
- [x] kafka
  - [x] kafka demo
- [x] mybatis
  - [x] mybatis demo
- [x] spring-security
  - [x] 基于jdbc的权限校验demo
- [x] shiro
  - [x] shiro demo
- [x] redis
  - [x] 分布式锁
  - [x] 分布式锁 demo
  - [ ] 分布式锁压测
  - [x] 缓存
  - [x] 缓存demo
  - [ ] 缓存雪崩
  - [ ] 缓存穿透
  - [ ] 缓存击穿
  - [ ] 持久化
- [ ] springboot 扩展
  - [x] aop
- [ ] netty
  - [x] example demos
    - [x] 单向通信 DiscardServer
    - [x] 回显服务 EchoServer
    - [x] 使用客户端 TimeServer TimeClient
    - [x] 使用JSON通信 UserInfoServer UserInfoClient
    - [x] 使用Protobuf协议
  - [ ] 多协议的通信案例
- [x] spider
  - [x] 通过selenium进行爬取
  - [x] 通过http获取数据
  - [x] 数据导出
- [x] task-box
  - [x] 任务提交到容器
  - [x] 创建线程任务执行
  - [x] 线程重用执行任务
- [x] scheduler
  - [x] 使用springboot scheduler执行定时任务
  - [x] 使用quartz执行定时任务
  - [x] 提供quartz控制页面

## common

这是一个公共模块主要放实体类, utils等

- [protobuf的使用](https://gitee.com/NikolaZhang/be-kami/blob/develop/common/README.md)

## shardingsphere

- [读写分离](https://gitee.com/NikolaZhang/be-kami/blob/develop/shardingsphere-masterslave/README.md)
- [数据分片](https://gitee.com/NikolaZhang/be-kami/blob/develop/shardingsphere-sharding/README.md)

## kafka

- [kafka](https://gitee.com/NikolaZhang/be-kami/blob/develop/kafka/README.md)

## mybatis

- [mybatis](https://gitee.com/NikolaZhang/be-kami/blob/develop/mybatis/README.md)

## spring-security

- [spring-security](https://gitee.com/NikolaZhang/be-kami/blob/develop/spring-security/README.md)

## shiro

- [shiro](https://gitee.com/NikolaZhang/be-kami/blob/develop/shiro/README.md)

## redis

主要是分布式锁

- [redis](https://gitee.com/NikolaZhang/be-kami/blob/develop/redis/README.md)

## netty

- [netty](https://gitee.com/NikolaZhang/be-kami/blob/develop/netty/README.md)

## spring-extend

- [spring-extend](https://gitee.com/NikolaZhang/be-kami/blob/develop/spring-extend/README.md)

## spider

- [spider](https://gitee.com/NikolaZhang/be-kami/blob/develop/spider/README.md)

## task-box

初衷是简化线程池的创建, 任务执行以及监控的代码, 并提供更灵活的异步能力.
最终也没简化什么, 渐渐放弃...

- [task-box](https://gitee.com/NikolaZhang/be-kami/blob/develop/task-box/README.md)

## scheduler

- [scheduler](https://gitee.com/NikolaZhang/be-kami/blob/develop/scheduler/README.md)

## 关于项目分支

- master
  master分支为保护分支, 一般不要直接使用.
- develop
  平时用的分支, 当各自的分支测试通过可以合并到该分支
- 其他
  自己根据需要从`develop`创建自己的分支. 开发完成提交pr后, 由有权限的人合并到`develop`.

### 出现bug怎么办?

从发生问题的分支拉取代码,创建一个新的分支. 修复之后, 测试通过合并到原来的分支.

### 代码冲突?

1. 首先如果你的代码没有提交到本地, 那么最好将自己的代码stash或者使用idea的shelve功能, 如果commit了则跳过
2. 从远程拉取代码合并到自己的本地分支,
 如果本地commit了, 你需要解决冲突.
 如果没有则unstash或者unshelve
3. 最后push到远程.
4. 之后通知他人处理发生冲突的pr. 重新合并.

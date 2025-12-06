---
title: 【安卓服务器】安装Jenkins及配置
tag:
  - 安卓
  - termux
  - Jenkins
category: 安卓服务器
description: 安卓手机上安装Jenkins及项目构建
banner: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
date: 2024-01-09

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

> 淘汰掉的安卓手机，弃之不用有些可惜。我们可以尝试将其变为一个服务器，用于部署常用的服务。
> 简单的方式，可以在本地构建，之后通过ssh将jar包传到对应的目录下，之后通过命令启动服务，这种方式自动化太低。

为了能够自动化的构建及部署服务，Jenkins是个不错的选择。这篇文章主要解决，将jenkins部署在安卓手机上，并完成基础的配置。

## 安装Jenkins

从[Jenkins官网](https://www.jenkins.io/zh/)上，可以找到对应的下载页面。这里我们下载最新的war包，通过war包部署，这种方式应该是最可靠的。

你可以通过命令下载，稳定版2.364.3

```shell
wget http://mirrors.jenkins.io/war-stable/2.346.3/jenkins.war
```

## 部署Jenkins

之后启动Jenkins会创建新的文件，最好提前将下载的war包，移动到一个自定义的目录中。

```shell
mkdir -p app/jenkins
mv jenkins.war app/jenkins
```

写一个启动脚本（名字可以为`jenkins.sh`），如下：

```shell
#!/bin/bash
# 导入环境变量
export JENKINS_HOME=/root/apps/jenkins
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-arm64

cd $JENKINS_HOME

pid=`ps -ef | grep jenkins.war | grep -v 'grep'| awk '{print $2}'`
if [ "$1" = "start" ];then
  if [ -n "$pid" ];then
    echo "[$pid]jenkins is running..."
  else
    ### java启动服务 配置java安装根路径,和启动war包存的根路径
    nohup $JAVA_HOME/bin/java -Xms128m -Xmx512m \
        -jar $JENKINS_HOME/jenkins.war \
        --httpPort=18080 \
        --logfile=$JENKINS_HOME/jenkins.log \
        > /dev/null 2>&1 &
  fi
elif [ "$1" = "stop" ];then
  exec ps -ef | grep jenkins | grep -v grep | awk '{print $2}'| xargs kill -9
  echo 'jenkins is stop...'
else
  echo "Please input like this:"./jenkins.sh start" or "./jenkins stop""
fi
```

在这个脚本中我们通过start参数来启动Jenkins，stop参数用来停止。Jenkins的访问端口为18080。
另外需要注意的是稳定版`2.364.3`要求java版本为11，17，21。

## 启动及访问Jenkins

通过`./jenkins.sh start`命令启动。首次访问需要查看日志（jenkins.log）中打印的token。

在浏览器中输入`http://手机IP:18080/`，输入token后，即可访问Jenkins。

## 设置用户权限

进入`系统管理 > 全局安全配置`，按照下图进行配置安全域。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-1.png)

设置好安全域之后，回到`系统管理`界面，就可以找到`用户管理`。在这个页面可以添加用户。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image.png)

如果希望通过角色进行权限管理，在插件管理中搜索`Role-based Authorization Strategy`。

打开`Manage and Assign Roles`。

进入`Manage Roles`的界面就可以添加角色了。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-2.png)

在`Assign Roles`页面可以为用户设置角色。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-3.png)

最后不要忘了，全局安全配置要设置基于角色的授权策略。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-4.png)

## 配置

### maven配置

首先下载maven包，并解压。

```shell
https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz

tar -zxvf apache-maven-3.9.6-bin.tar.gz

```

我们的项目通常是maven架构的。Jenkins如果需要支持maven，需要安装插件`Maven Integration plugin`。

并在`系统管理-全局工具配置`中进行如下配置：

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-7.png)

这里指定了settings.xml的位置。

### gitee配置

如果项目在`gitee`上，需要安装gitee插件，之后进入`系统配置`中按照下图进行配置。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-6.png)

`链接名`和`Gitee 域名 URL`都是固定的。令牌需要到[个人令牌]( https://gitee.com/profile/personal_access_tokens)页生成，之后添加方式参考下图（ID不重复就行）。

![Alt text](images/%E5%AE%89%E8%A3%85Jenkins%E5%8F%8A%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA/image-5.png)

最后不要忘了点击保存。

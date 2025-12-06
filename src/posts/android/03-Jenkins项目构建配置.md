---
title: 【安卓服务器】jenkins项目构建配置
tag:
  - 安卓
  - termux
  - Jenkins
  - 项目构建
category: 安卓服务器
description: 使用Jenkins配置项目构建
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

## 选择构建方式

这里使用maven的构建方式，如果没有这个选项，需要先安装`Maven Integration plugin`插件，并配置maven。

![Alt text](images/image-13.png)

## 构建配置

1. Gitee 链接  
    该配置对应`系统管理-系统配置`中的`Gitee 配置`

    ![Alt text](images/image-14.png)

2. jdk  
   该配置对应`系统管理-全局工具配置`中的`JDK 安装`，可以配置多个jdk，选用项目中需要的即可。

    ![Alt text](images/image-15.png)

3. 源码管理  
   这个地方配置项目的源码位置，构建使用的分支，以及访问需要的账号和密码。账号密码可以在`系统管理-凭据`中提前配置。

    ![Alt text](images/image-16.png)

4. 构建触发器

   这里我们配置，触发构建的情形，我们通过推送代码中的message中的关键词来触发。如下，当提交信息中含有`BUILD`时就会触发构建。

    ![Alt text](images/image-17.png)

5. BUILD

   这里配置pom.xml的相对路径。

    ![Alt text](images/image-12.png)

暂时就这样配置，之后会在构建后增加一些脚本用于项目的部署。

多模块的maven项目配置之后不能立即看到项目中的所有模块，需要构建之后才可以看到。

![Alt text](images/image-18.png)

## 构建后操作

项目构建后，我们需要将包移动到应用对应的目录下。

```bash
#!/bin/bash
# ============================
# 配置
modules=('config' 'admin' 'common-api' 'gateway' 'security' 'syscore')


# ============================
# 配置
target_project_path=/root/apps/${POM_DISPLAYNAME}
echo "开始创建目录及移动包"

echo > changes_moudles
for module in "${modules[@]}"
do
    new_jar_path=`ls $WORKSPACE/$module/target/${module}*.jar`
    mkdir -p $target_project_path/$module
    # 移动jar文件到指定目录，并重命名jar包名称
    jar_name="$module.jar"
    old_jar_path=$target_project_path/$module/$jar_name
    
    check_new=$(md5sum "$new_jar_path" | awk '{print $1}')
    check_old=$(md5sum "$old_jar_path" | awk '{print $1}')

    if [ -f "$old_jar_path" ] && [ "$sum1" = "$sum2" ]; then
        echo "文件未发生变化，不需移动"
    else
        cp $new_jar_path $old_jar_path
        echo "复制文件：$new_jar_path 完成"
        change_modules[${#change_modules[*]}]=$module
        echo $module >> changes_moudles 
    fi
done

echo "以下模块发生变更："
cat changes_moudles

```

选择`Post Steps`将脚本放到下图这个位置，点击保存。之后就可以构建了。

![Alt text](images/image-19.png)

如果还希望进行项目的自动重启，可以继续添加下面的脚本：

```bash
#!/bin/bash
target_project_path=/root/apps/${POM_DISPLAYNAME}
for change_module in `cat changes_moudles`
do
    # 判断目录下是否存在脚本文件，不存在则提示
    start_shell_file="$target_project_path/$change_module/$change_module-start.sh"
    if [ ! -f "$start_shell_file" ]; then
        echo "==== $change_module : 模块脚本不存在，跳过重启"
        continue
    fi

    if pgrep -f "$change_module" > /dev/null
    then
        echo "$change_module 正在运行，退出。。。"
        kill -9 $(pgrep -f "$change_module")
    fi

    
    sh $start_shell_file
    echo "重启: $change_module"

done

```

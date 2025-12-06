---
title: 【安卓服务器】本地webhook如何触发构建
tag:
  - 安卓
  - termux
  - Jenkins
  - webhook
category: 安卓服务器
description: 使用gitee触发webhook需要外网地址，我们只有内网环境，那么本地如何触发构建呢？
banner: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
date: 2024-01-12

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

> 使用gitee触发webhook需要外网地址，我们只有内网环境，那么本地如何触发构建呢？这篇文章尝试通过本地添加git hook脚本，在提交之后发送构建请求。

## gitee中的webhook

打开项目中的管理菜单，可以找到WebHooks。

![Alt text](images/image-2.png)

上图中的账号密码为Jenkins用户的账号密码。

尝试发送一个请求，看看请求的格式，之后通过本地发送请求触发构建。

![Alt text](images/image-3.png)

## 本地模拟hook请求

请求地址、header、body复制到postman中。

![Alt text](images/image-4.png)

之后删除一些属性，发送请求。经过简化，我们发送信息需要包含下面的部分即可。

header需要包含的内容：

```shell
X-Git-Oschina-Event: Push Hook
X-Gitee-Event: Push Hook
User-Agent: git-oschina-hook
X-Gitee-Ping: false
Content-Type: application/json
```

body需要包含的内容：

```json
{
    "commits": [
        {
            "message": "BUILD"
        }
    ],
    "project": {
        "git_http_url": "https://gitee.com/NikolaZhang/communicate.git",
        "id": 8278595,
        "name": "communicate",
        "namespace": "NikolaZhang",
        "ssh_url": "git@gitee.com:NikolaZhang/communicate.git"
    },
    "ref": "refs/heads/develop",
    "sender": {
        "name": "我小叮当"
    },
    "user_name": "我小叮当"
}

```

上面body中的id，为一个数字即可。如果你希望根据其他信息，进行触发构建，可能需要更多参数。我们使用提交信息中的message进行匹配构建，这在`【安卓服务器】jenkins项目构建配置`文中提及。

## 本地添加git hook脚本

在本地项目的`.git/hooks`目录中，新建`pre-push`文件，将下面的内容保存到文件中。

注意：project中的内容以及其他信息，需要按照自己的实际情况配置。

```bash
#!/bin/sh

last_message=$(git log -1 --format=%s) 

body='{
    "commits": [
        {
            "message": "'$last_message'"
        }
    ],
    "project": {
        "git_http_url": "https://gitee.com/NikolaZhang/communicate.git",
        "id": 8278595,
        "name": "communicate",
        "namespace": "NikolaZhang",
        "ssh_url": "git@gitee.com:NikolaZhang/communicate.git"
    },
    "ref": "refs/heads/develop",
    "sender": {
        "name": "我小叮当"
    },
    "user_name": "我小叮当"
}
'

url="http://admin:1234@192.168.137.221:18080/gitee-project/communicate"

curl -X POST \
    -H "Content-Type: application/json" \
    -H "X-Git-Oschina-Event: Push Hook" \
    -H "X-Gitee-Event: Push Hook" \
    -H "User-Agent: git-oschina-hook" \
    -H "X-Gitee-Ping: false" \
    -d "$body" $url

exit 0

```

脚本中url需要改为Jenkins提示中的url。

![Alt text](images/image-11.png)

打开git bash终端，测试脚本是否可以正常运行。

```bash
cat pre-push | bash
```

当消息正常发送，并收到请求结果，则说明脚本可以正常运行。

![Alt text](images/image-10.png)

这样以后我们向远程push代码时，本地git就会触发hook，给内网的Jenkins发送构建请求。

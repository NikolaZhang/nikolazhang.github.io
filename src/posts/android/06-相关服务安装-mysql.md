---
title: 【安卓服务器】相关服务安装-mysql
tag:
  - 安卓
  - termux
  - mysql
category: 安卓服务器
description: 安卓手机上使用termux
banner: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
date: 2024-01-16

author: nikola
icon: mysql

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## 安装mysql

```bash
pkg install mysql-server
```

在启动之前我们需要改下配置。允许远程访问我们的服务。

```bash
vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

找到`bind-address`，将`127.0.0.1`改为`0.0.0.0`，保存退出。

通过下面的命令进行启动：

```bash
service mysql start
```

## 配置mysql

我们接下来还要进行用户授权操作。(首次登录查看`/var/log/mysql/error.log`中是否含有密码，可以查找带有password的行)

```bash
mysql -u root
```

输入密码，进入mysql命令。

```bash
mysql> use mysql;
mysql> update user set host = '%' where user = 'root';
mysql> flush privileges;
```

这里用户root可以远程访问了。

我们最好再给root用户设置个密码：

```bash
mysql> alter user 'root'@'%' identified by '1234';
mysql> flush privileges;
```

## 相关命令

```bash
# 创建用户
mysql> CREATE USER 'username'@'host' IDENTIFIED BY 'password';
# 删除用户
mysql> DROP USER 'username'@'host';

# 授权 GRANT privileges ON databasename.tablename TO 'username'@'host';
mysql> GRANT SELECT, INSERT ON databasename.* TO 'username'@'host';
# 授予全部权限
mysql> GRANT ALL PRIVILEGES ON *.* TO 'username'@'host';
# 撤销授权
mysql> REVOKE privileges ON databasename.tablename FROM 'username'@'host';

# 设置密码
mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '1234';

# 刷新权限
mysql> flush privileges;

# 查看用户
mysql> select user,host from user;

# 查看权限
mysql> show grants for 'username'@'host';

```

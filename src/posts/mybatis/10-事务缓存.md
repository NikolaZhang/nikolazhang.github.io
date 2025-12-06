---
title: mybatis事务缓存
tag:
  - mybatis
  - 事务缓存
category: mybatis
description: 
banner: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
date: 2024-11-09

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---


## 事务缓存 TransactionalCache

`TransactionalCacheManager`用于管理所有的`TransactionalCache`事务缓存。其结构为`Map<Cache, TransactionalCache>`。

通过`MapperStatement`中的`Cache`，从事务缓存管理器中获取`TransactionalCache`，通过`TransactionalCache`进行缓存操作。

`TransactionalCache`中存在一个`Map<Object, Object> entriesToAddOnCommit`用于存储缓存记录；`Set<Object> entriesMissedInCache`用于记录未命中的缓存记录。每次查询、更新操作，事务管理器都会对这两个缓存进行操作，此时临时缓存的数据还没有写入二级缓存，只有执行提交操作，这两个缓存数据才会正式写入二级缓存。这种操作方式，符合数据库的事务特性，即：事务提交之前，只操作临时缓存，不操作二级缓存，因此不会影响其他事务；事务提交之后，缓存写入二级缓存，此时对所有事务可见。对二级缓存的操作，是整个事务一起提交的，符合原子特性。

为什么要记录未命中缓存的key？缓存未命中的key可以防止缓存穿透，当大量请求数据库不存在的数据时，通过缓存，可以防止频繁查询数据库。

事务缓存存在以下操作：

- 添加缓存记录：`putObject(Object key, Object value)`
- 获取缓存记录：`getObject(Object key)`
- 清空缓存：`clear()`
- 提交事务：`commit()`
- 回滚事务：`rollback()`

下面是对这几个操作的流程解析：

![Snipaste_2024-11-04_16-06-42](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/mybatis缓存架构/Snipaste_2024-11-04_16-06-42.png)
![Snipaste_2024-11-04_16-07-08](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/mybatis缓存架构/Snipaste_2024-11-04_16-07-08.png)
![Snipaste_2024-11-04_16-07-08](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/mybatis缓存架构/Snipaste_2024-11-04_16-07-50.png)

::: warning
一定需要注意的是，二级缓存的写入发生在事务提交或者回滚阶段，而不是在查询阶段。
:::

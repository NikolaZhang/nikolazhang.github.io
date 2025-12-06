---
title: mybatis结果集处理
description: mybatis结果集处理
icon: article
isOriginal: true
date: 2024-12-29

category: mybatis
tag:
  - mybatis
  - resultSetHandler
---


在mybatis中数据查询结果通过`ResultSetHandler`进行处理，对应的实现类为`DefaultResultSetHandler`。

```java
  @Override
  public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {
    PreparedStatement ps = (PreparedStatement) statement;
    ps.execute();
    return resultSetHandler.handleResultSets(ps);
  }

```


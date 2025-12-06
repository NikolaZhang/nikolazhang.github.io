---
title: SqlSession与sql执行
tag:
  - mybatis
  - SqlSesssion
category: mybatis
description: 关于mybatis parameterHandler的解析
date: 2021-05-29

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

> 使用 MyBatis 的主要 Java 接口就是 SqlSession。你可以通过这个接口来执行命令，获取映射器实例和管理事务。

通过前几篇文章的分析，`SqlSessionFactoryBuilder`调用其`build`方法创建一个SqlSession工厂-`SqlSessionFactory`对象。之后我们通过工厂类的`openSession`方法可以获取到`SqlSession`。

## SqlSession初始化

`openSession`方法有如下的重载方法：

```java
  SqlSession openSession();

  SqlSession openSession(boolean autoCommit);

  SqlSession openSession(Connection connection);

  SqlSession openSession(TransactionIsolationLevel level);

  SqlSession openSession(ExecutorType execType);

  SqlSession openSession(ExecutorType execType, boolean autoCommit);

  SqlSession openSession(ExecutorType execType, TransactionIsolationLevel level);

  SqlSession openSession(ExecutorType execType, Connection connection);
```

你可以指定是否自动提交，重新设置连接，重置隔离级别，设定执行器来定制化（覆盖mybatis配置）你的SqlSession。

`SqlSessionFactoryBuilder.build`方法指定的是`DefaultSqlSessionFactory`类。
DefaultSqlSessionFactory中的`openSession()`代码为：

```java
  public SqlSession openSession() {
    return openSessionFromDataSource(configuration.getDefaultExecutorType(), null, false);
  }

  private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try {
      final Environment environment = configuration.getEnvironment();
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
      final Executor executor = configuration.newExecutor(tx, execType);
      return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
      // 出现异常的时候要关闭事务, 实际关闭的是连接 Connection
      closeTransaction(tx); // may have fetched a connection so lets call close()
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
```

这里创建`DefaultSqlSession`需要3个参数：

- 配置类：`Configuration`
- 执行器：`Executor`
- 是否自动提交（默认为非自动提交）

## 事务的初始化

其中执行器Executor的创建需要依赖于：

- 事务`Transaction`：事务需要从事务工厂`TransactionFactory`进行创建，而事务工厂的创建需要根据环境信息配置（Environment），
    当`Environment`对象不存在或者没有配置自定义自定义的事务工厂，则使用`ManagedTransactionFactory`作为事务工厂类
    否则从`Environment`配置中获取事务工厂对象。
- 执行器类型（mybatis配置中的defaultExecutorType，可以指定为：SIMPLE（普通的执行器）；REUSE（执行器会重用预处理语句（PreparedStatement））； BATCH（执行器不仅重用语句还会执行批量更新）。）

<Badge text="tips" type="info" /><b>关于事务和事务工厂做些具体的说明：</b>

`TransactionFactory`的`newTransaction`方法用于获取事务`Transaction`对象. 上面的代码中方法中传入了3个参数:

- 数据源
- 隔离级别
- 是否自动提交

`Transaction`是个接口, 其实现为`ManagedTransaction`.

```java
  public Transaction newTransaction(DataSource ds, TransactionIsolationLevel level, boolean autoCommit) {
    // Silently ignores autocommit and isolation level, as managed transactions are entirely
    // controlled by an external manager.  It's silently ignored so that
    // code remains portable between managed and unmanaged configurations.
    return new ManagedTransaction(ds, level, closeConnection);
  }
```

`ManagedTransaction`中有以下属性定义:

```java
  private DataSource dataSource;
  private TransactionIsolationLevel level;
  private Connection connection;
  private final boolean closeConnection;
```

上面的对象创建中给定了数据源, 事务隔离级别, 是否自动提交. connection并未赋值, 其值可以从dataSource中获取.

## sql的执行

SqlSession接口可以用来执行命令，获取映射器实例和管理事务。

> 使用sqlSession执行sql有两种方式, 1: 指定唯一标识 2: 通过接口代理调用方法

### 基于唯一标识的sql执行

现在以下面的代码为例, 看一下sql语句是如何执行的.

```java
HashMap<String, Long> paramMap = new HashMap<>();
paramMap.put("userId", 1L);
paramMap.put("roomId", 1L);
sqlSession.selectList("com.nikola.mybatis.mapper.RoomInfoMapper.selectRoomChatInfo", paramMap);
```

`selectList`方法的定义如下, `RowBounds`是对sql执行结果分页的实现。 指定了偏移量和结果数量, 默认偏移量为0, 结果数量为Integer.MAX_VALUE。

```java
  @Override
  public <E> List<E> selectList(String statement, Object parameter) {
    return this.selectList(statement, parameter, RowBounds.DEFAULT);
  }

  @Override
  public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
    try {
      // 我们传入的statement的全限定路径，实际上是MappedStatement的id，
      // getMappedStatement方法就是通过id从configuration中获取MappedStatement对象
      MappedStatement ms = configuration.getMappedStatement(statement);
      return executor.query(ms, wrapCollection(parameter), rowBounds, Executor.NO_RESULT_HANDLER);
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

```

执行器`Executor`是命令的执行者。执行器不是直接执行sql, 而是需要通过`BoundSql`, 获取sql信息的封装, 比如: sql语句, 入参信息等.

```java
  public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
    BoundSql boundSql = ms.getBoundSql(parameter);
    // CacheKey用于从本地缓存中获取查询结果.
    CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
    return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
  }
```

query方法最终是调用`doQuery`实现的sql操作, 首先通过`newStatementHandler`实例化`StatementHandler`, 该对象用于生成`Statement`对象, 并对其参数进行设置. `handler.query`中调用statement的execute方法执行sql, 并通过`resultHandler`处理结果集.

```java
  public <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) throws SQLException {
    Statement stmt = null;
    try {
      Configuration configuration = ms.getConfiguration();
      StatementHandler handler = configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
      stmt = prepareStatement(handler, ms.getStatementLog());
      return handler.query(stmt, resultHandler);
    } finally {
      closeStatement(stmt);
    }
  }
```

### 基于接口代理的sql执行

以下面代码为例:

```java
SqlSessionFactory sqlSessionFactory = SqlUtils.getSqlSessionFactory();

SqlSession sqlSession = sqlSessionFactory.openSession();
RoomInfoMapper mapper = sqlSession.getMapper(RoomInfoMapper.class);
ChatUser chatUser = mapper.selectRoomChatInfoByUserIdAndRoomId(1L, 1L);
```

`sqlSession.getMapper`方法实际上是从`Configuration`实例中获取代理对象。其方法是`mapperRegistry`的`getMapper`方法。

`mapperRegistry.getMapper`首先获取mapper代理工厂`MapperProxyFactory`，通过工厂方法`newInstance`获取代理对象。

`knownMappers`是mybatis xml配置解析时扫描接口或者包的时候，用于管理这些mapper接口的容器。其定义位`Map<Class<?>, MapperProxyFactory<?>> knownMappers = new HashMap<>();`。其中`MapperProxyFactory`通过传入当前接口类进行实例化。

```java
  public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
    final MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) knownMappers.get(type);
    if (mapperProxyFactory == null) {
      throw new BindingException("Type " + type + " is not known to the MapperRegistry.");
    }
    try {
      return mapperProxyFactory.newInstance(sqlSession);
    } catch (Exception e) {
      throw new BindingException("Error getting mapper instance. Cause: " + e, e);
    }
  }

```

#### 代理工厂的newInstance

```java

  @SuppressWarnings("unchecked")
  protected T newInstance(MapperProxy<T> mapperProxy) {
    return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);
  }

  public T newInstance(SqlSession sqlSession) {
    final MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession, mapperInterface, methodCache);
    return newInstance(mapperProxy);
  }

```

1. 首先通过`sqlSession`， `mapperInterface`（当前接口类），`methodCache`初始化`MapperProxy`实例。
2. 使用jdk动态代理创建代理对象。关于jdk动态代理之前有分析，此处按下不表。请移步![动态代理分析](https://blog.nikolazhang.top/docs/springboot/%E4%BB%A3%E7%90%86/#%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90)

我们需要关注的点在于`MapperProxy`中的`invoke`方法（jdk动态代理中代理类需要实现`InvocationHandler`接口的`invoke`方法）。

```java
@Override
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
  try {
    // 如果方法为Object.class中的，则直接使用当前的代理对象执行。明显我们的mapper接口不属于这种
    if (Object.class.equals(method.getDeclaringClass())) {
      return method.invoke(this, args);
    } else {
      return cachedInvoker(method).invoke(proxy, method, args, sqlSession);
    }
  } catch (Throwable t) {
    throw ExceptionUtil.unwrapThrowable(t);
  }
}
```

`cachedInvoker`方法用于获取mapper方法执行的调用`MapperMethodInvoker`。

- 如果当前方法为`default`修饰的接口方法，则使用`DefaultMethodInvoker`这种方式。
- 如果是接口，则使用`PlainMethodInvoker`。

`PlainMethodInvoker`这种调用方式需要提供`MapperMethod`作为参数。`MapperMethod`包含两个参数`SqlCommand`和`MethodSignature`.
`SqlCommand`表示当前方法对应的sql语句的类型和id。`MethodSignature`则是方法的具体具体描述（是否返回map, 是否返回集合，参数解析器ParamNameResolver等）。

::: details ParamNameResolver的构造器

用于解析方法中的参数 优先使用@Param中的参数名，  
如果没有该注解则看配置中`useActualParamName`是否允许，  
如果允许则使用方法中的参数名，否则使用方法参数的索引作为参数名。

解析的结果会通过`SortedMap<Integer, String> names`存放。

<Badge text="注意" type="warn"/> `names`并不是最终的参数列表。  
最终的参数列表是通过`getNamedParams`方法获取的。`getNamedParams`同时也提供了参数对应的值。

:::

`PlainMethodInvoker`对象调用`invoke`方法实际是通过上面说的`MapperMethod`调用`execute`方法。

```java
public Object invoke(Object proxy, Method method, Object[] args, SqlSession sqlSession) throws Throwable {
  return mapperMethod.execute(sqlSession, args);
}

```

在`execute`方法中对不同的类型进行分别处理

```java
public Object execute(SqlSession sqlSession, Object[] args) {
    Object result;
    switch (command.getType()) {
      case INSERT: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.insert(command.getName(), param));
        break;
      }
      case UPDATE: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.update(command.getName(), param));
        break;
      }
      case DELETE: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.delete(command.getName(), param));
        break;
      }
      case SELECT:
        if (method.returnsVoid() && method.hasResultHandler()) {
          executeWithResultHandler(sqlSession, args);
          result = null;
        } else if (method.returnsMany()) {
          result = executeForMany(sqlSession, args);
        } else if (method.returnsMap()) {
          result = executeForMap(sqlSession, args);
        } else if (method.returnsCursor()) {
          result = executeForCursor(sqlSession, args);
        } else {
          Object param = method.convertArgsToSqlCommandParam(args);
          result = sqlSession.selectOne(command.getName(), param);
          if (method.returnsOptional()
              && (result == null || !method.getReturnType().equals(result.getClass()))) {
            result = Optional.ofNullable(result);
          }
        }
        break;
      case FLUSH:
        result = sqlSession.flushStatements();
        break;
      default:
        throw new BindingException("Unknown execution method for: " + command.getName());
    }
    if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
      throw new BindingException("Mapper method '" + command.getName()
          + " attempted to return null from a method with a primitive return type (" + method.getReturnType() + ").");
    }
    return result;
}
```

上面的方法中，`FLUSH`对应的实现实际是关闭`Statement`。`INSERT`、`UPDATE`、`SELECT`、`DELETE`操作步骤实际是差不多的。只是`SELECT`因为返回类型多种多样因此有很多不同的情况。

<Badge text="info" color="grey" /> `INSERT`、`UPDATE`、`DELETE`类型的sql只返回操作数。通过`rowCountResult`方法进行处理返回结果。

::: details `convertArgsToSqlCommandParam`

这个方法实际是调用`ParamNameResolver`的`getNamedParams`方法进行处理的。通过该方法我们可以获取方法中的参数集合以及这些参数对应的值。

```java
  public Object getNamedParams(Object[] args) {
    final int paramCount = names.size();
    if (args == null || paramCount == 0) {
      return null;
    } else if (!hasParamAnnotation && paramCount == 1) {
      Object value = args[names.firstKey()];
      return wrapToMapIfCollection(value, useActualParamName ? names.get(0) : null);
    } else {
      final Map<String, Object> param = new ParamMap<>();
      int i = 0;
      for (Map.Entry<Integer, String> entry : names.entrySet()) {
        param.put(entry.getValue(), args[entry.getKey()]);
        // add generic param names (param1, param2, ...)
        final String genericParamName = GENERIC_NAME_PREFIX + (i + 1);
        // ensure not to overwrite parameter named with @Param
        if (!names.containsValue(genericParamName)) {
          param.put(genericParamName, args[entry.getKey()]);
        }
        i++;
      }
      return param;
    }
  }

  public static Object wrapToMapIfCollection(Object object, String actualParamName) {
    if (object instanceof Collection) {
      ParamMap<Object> map = new ParamMap<>();
      map.put("collection", object);
      if (object instanceof List) {
        map.put("list", object);
      }
      Optional.ofNullable(actualParamName).ifPresent(name -> map.put(name, object));
      return map;
    } else if (object != null && object.getClass().isArray()) {
      ParamMap<Object> map = new ParamMap<>();
      map.put("array", object);
      Optional.ofNullable(actualParamName).ifPresent(name -> map.put(name, object));
      return map;
    }
    return object;
  }

```

方法参数`Object[] args`用于通过索引获取值。

1. 如果没有参数，最终结果为空。
2. 不使用`@Param`注解，并且只有一个参数。如果为集合则根据情况放入键`collection`、`list`、`array`。
3. 对于其他情况，一方面保留原始的`names`中的值作为键，另一方面如果没有`param`+索引这种参数名称，则放入当前索引对应的参数的`param`+索引名称。

:::

::: details `rowCountResult`

根据方法返回的类型以及结果数返回期望的结果。因此我们可以肆无忌惮的设置接口返回void，int，Integer，long，Long，boolean，Boolean。
还是要再说一下只对`INSERT`、`UPDATE`、`DELETE`类型有效。

```java
  private Object rowCountResult(int rowCount) {
    final Object result;
    if (method.returnsVoid()) {
      result = null;
    } else if (Integer.class.equals(method.getReturnType()) || Integer.TYPE.equals(method.getReturnType())) {
      result = rowCount;
    } else if (Long.class.equals(method.getReturnType()) || Long.TYPE.equals(method.getReturnType())) {
      result = (long) rowCount;
    } else if (Boolean.class.equals(method.getReturnType()) || Boolean.TYPE.equals(method.getReturnType())) {
      result = rowCount > 0;
    } else {
      throw new BindingException("Mapper method '" + command.getName() + "' has an unsupported return type: " + method.getReturnType());
    }
    return result;
  }
```

:::

::: details executeWithResultHandler

`SELECT`类型返回为空使用`executeWithResultHandler`进行处理。

```java
private void executeWithResultHandler(SqlSession sqlSession, Object[] args) {
  MappedStatement ms = sqlSession.getConfiguration().getMappedStatement(command.getName());
  if (!StatementType.CALLABLE.equals(ms.getStatementType())
      // 方法返回为void时, 也需要含有@ResultMap或者@ResultType指定返回结果映射, 主要是该方法的条件是
      // method.returnsVoid() && method.hasResultHandler() 也就是需要通过ResultHandler处理结果
      && void.class.equals(ms.getResultMaps().get(0).getType())) {
    throw new BindingException("method " + command.getName()
        + " needs either a @ResultMap annotation, a @ResultType annotation,"
        + " or a resultType attribute in XML so a ResultHandler can be used as a parameter.");
  }
  Object param = method.convertArgsToSqlCommandParam(args);
  if (method.hasRowBounds()) {
    RowBounds rowBounds = method.extractRowBounds(args);
    sqlSession.select(command.getName(), param, rowBounds, method.extractResultHandler(args));
  } else {
    sqlSession.select(command.getName(), param, method.extractResultHandler(args));
  }
}

```

`method.hasRowBounds()`用于处理含有分页的情况。
`method.extractResultHandler`获取`ResultHandler`对返回结果进行处理。

:::

::: details executeForMany

该方法用于处理方法返回类型为List的情形。

```java
private <E> Object executeForMany(SqlSession sqlSession, Object[] args) {
    List<E> result;
    Object param = method.convertArgsToSqlCommandParam(args);
    if (method.hasRowBounds()) {
      RowBounds rowBounds = method.extractRowBounds(args);
      result = sqlSession.selectList(command.getName(), param, rowBounds);
    } else {
      result = sqlSession.selectList(command.getName(), param);
    }
    // issue #510 Collections & arrays support
    // 提供了返回为Collection和数组的类型转换
    if (!method.getReturnType().isAssignableFrom(result.getClass())) {
      if (method.getReturnType().isArray()) {
        return convertToArray(result);
      } else {
        return convertToDeclaredCollection(sqlSession.getConfiguration(), result);
      }
    }
    return result;
  }

```

:::

后面的两种就不提了，返回为map的实际是调用`selectMap`进行处理；返回为`Cursor`的实际通过`selectCursor`进行查询。
除了以上情况，都通过`selectOne`进行查询。

### handleRowValues处理结果

`handleRowValues`用于处理返回的每一条结果。并且根据返回结果是否含有嵌套分成两种方法`handleRowValuesForNestedResultMap`以及`handleRowValuesForSimpleResultMap`。

```java
  public void handleRowValues(ResultSetWrapper rsw, ResultMap resultMap, ResultHandler<?> resultHandler, RowBounds rowBounds, ResultMapping parentMapping) throws SQLException {
    if (resultMap.hasNestedResultMaps()) {
      ensureNoRowBounds();
      checkResultHandler();
      handleRowValuesForNestedResultMap(rsw, resultMap, resultHandler, rowBounds, parentMapping);
    } else {
      handleRowValuesForSimpleResultMap(rsw, resultMap, resultHandler, rowBounds, parentMapping);
    }
  }
```

#### handleRowValuesForSimpleResultMap

```java
  private void handleRowValuesForSimpleResultMap(ResultSetWrapper rsw, ResultMap resultMap, ResultHandler<?> resultHandler, RowBounds rowBounds, ResultMapping parentMapping)
      throws SQLException {
    DefaultResultContext<Object> resultContext = new DefaultResultContext<>();
    ResultSet resultSet = rsw.getResultSet();
    // 跳过RowBounds指定的偏移量，跳过offset指定的行数。
    skipRows(resultSet, rowBounds);
    // shouldProcessMoreRows用于判断读取量是否超过了RowBounds中limit指定的限制条数
    while (shouldProcessMoreRows(resultContext, rowBounds) && !resultSet.isClosed() && resultSet.next()) {
      // resolveDiscriminatedResultMap 鉴别器可以根据属性不同的值指定使用相应的resultMap
      ResultMap discriminatedResultMap = resolveDiscriminatedResultMap(resultSet, resultMap, null);
      Object rowValue = getRowValue(rsw, discriminatedResultMap, null);
      storeObject(resultHandler, resultContext, rowValue, parentMapping, resultSet);
    }
  }
```

`getRowValue`是一个非常重要的方法, 通过该方法可以完成自动赋值以及指定的ResultMap进行字段赋值。这是数据库返回结果赋值给java对象的核心。

```java
  private Object getRowValue(ResultSetWrapper rsw, ResultMap resultMap, String columnPrefix) throws SQLException {
    final ResultLoaderMap lazyLoader = new ResultLoaderMap();
    // 通过反射创建一个返回结果的对象。
    Object rowValue = createResultObject(rsw, resultMap, lazyLoader, columnPrefix);
    if (rowValue != null && !hasTypeHandlerForResultObject(rsw, resultMap.getType())) {
      final MetaObject metaObject = configuration.newMetaObject(rowValue);
      boolean foundValues = this.useConstructorMappings;
      if (shouldApplyAutomaticMappings(resultMap, false)) {
        // 自动赋值 注意需要将mapUnderscoreToCamelCase配置设置为true 从而可以进行java驼峰式命名和数据库字段_分割命名的匹配
        foundValues = applyAutomaticMappings(rsw, resultMap, metaObject, columnPrefix) || foundValues;
      }
      // 根据自定义的配置属性进行赋值, 比如@Results中设置了一些column对应的字段配置
      foundValues = applyPropertyMappings(rsw, resultMap, metaObject, lazyLoader, columnPrefix) || foundValues;
      foundValues = lazyLoader.size() > 0 || foundValues;
      rowValue = foundValues || configuration.isReturnInstanceForEmptyRow() ? rowValue : null;
    }
    return rowValue;
  }
```




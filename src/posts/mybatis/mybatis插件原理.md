---
title: mybatis插件原理
tag:
  - mybatis插件
category: mybatis
description: 
image: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
date: 2024-11-10

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## mybatis插件架构

> mybatis提供插件功能，开发者可以通过注册插件的方式为mybatis增加功能。比如进行sql监控、日志记录、数据脱敏等。

mybais中插件的架构，如下图：

![20241110062548](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/20241110062548.png)

实现一个插件的大致流程为：

1. 实现`Interceptor`接口，实现`intercept`方法，在该方法中定义插件的逻辑。
2. 将插件配置到全局配置文件中。
3. mybatis解析plugins节点，将插件实例化，并注册到`Configuration`中。
4. mybatis在执行sql时，在特定的handler或者executor生成代理对象。调用每个插件的`intercept`方法。

### 插件的注册

在mybatis中，通过在配置全局配置文件中增加`plugins`节点注册插件。mybatis在解析配置时，通过`pluginElement`进行插件的实例化和注册。解析后的插件，会添加到`Configuration`的`InterceptorChain interceptorChain`属性中。

```java
private void pluginElement(XNode parent) throws Exception {
  if (parent != null) {
    for (XNode child : parent.getChildren()) {
      // note zx 加载插件，并设置插件的参数
      String interceptor = child.getStringAttribute("interceptor");
      Properties properties = child.getChildrenAsProperties();
      Interceptor interceptorInstance = (Interceptor) resolveClass(interceptor).getDeclaredConstructor().newInstance();
      interceptorInstance.setProperties(properties);
      configuration.addInterceptor(interceptorInstance);
    }
  }
}

```

使用方式如下：

```xml
  <plugins>
    <plugin interceptor="org.apache.ibatis.builder.ExamplePlugin">
      <property name="pluginProperty" value="100"/>
    </plugin>
  </plugins>
```

`AlwaysMapPlugin`是一个插件的示例，可以看到一个插件需要包含：

- `@Intercepts`注解，该注解用于指定需要拦截的方法。可以添加多个`@Signature`注解，来实现多个方法的拦截。
- `@Intercepts`注解中包含`@Signature`注解，该注解用于指定需要拦截的方法。
- `@Signature`注解中包含`type`、`method`、`args`三个属性。这三个属性指定了拦截的类、方法、参数类型，其作用是为了确定唯一的方法。

通过调用`plugin`方法，我们就创建了代理对象，之后通过代理对象调用被拦截的方法，可以看到，原有的类的行为已经被修改。

```java

class PluginTest {

  @Test
  void mapPluginShouldInterceptGet() {
    Map map = new HashMap();
    map = (Map) new AlwaysMapPlugin().plugin(map);
    assertEquals("Always", map.get("Anything"));
  }

  @Test
  void shouldNotInterceptToString() {
    Map map = new HashMap();
    map = (Map) new AlwaysMapPlugin().plugin(map);
    assertNotEquals("Always", map.toString());
  }

  @Intercepts({
      @Signature(type = Map.class, method = "get", args = {Object.class})})
  public static class AlwaysMapPlugin implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) {
      return "Always";
    }

  }

}

```

::: info
mybatis插件代理的机制，我们可以扩展用到其他的类上，如这个案例对Map类进行了代理，而无需增加其他代码。
:::

### 插件的拦截的目标

mybatis中，插件的拦截目标有以下几种：

1. Executor：执行器，用于执行sql语句。
2. StatementHandler：用于处理sql语句。
3. ParameterHandler：用于处理sql语句的参数。
4. ResultSetHandler：用于处理sql语句的返回结果。

以`Executor`为例，在创建完成`Executor`对象后，会调用`pluginAll`方法，该方法会遍历`Configuration`中的`interceptorChain`属性，调用`plugin`方法，为`Executor`对象创建代理对象。

```java
  public Executor newExecutor(Transaction transaction, ExecutorType executorType) {
    executorType = executorType == null ? defaultExecutorType : executorType;
    executorType = executorType == null ? ExecutorType.SIMPLE : executorType;
    Executor executor;
    if (ExecutorType.BATCH == executorType) {
      executor = new BatchExecutor(this, transaction);
    } else if (ExecutorType.REUSE == executorType) {
      executor = new ReuseExecutor(this, transaction);
    } else {
      executor = new SimpleExecutor(this, transaction);
    }
    if (cacheEnabled) {
      // note zx 如果开启二级缓存，则创建CachingExcutor对象，装饰配置中的执行器
      executor = new CachingExecutor(executor);
    }
    // note zx 插件 拦截 Executor
    executor = (Executor) interceptorChain.pluginAll(executor);
    return executor;
  }
```

### InterceptorChain

> `InterceptorChain`拦截器链用于插件的注册、代理对象的创建。代理对象的创建通过`pluginAll`方法实现。

`pluginAll`方法中，将所有拦截器遍历，依次调用`plugin`方法，生成代理对象。每次生成的代理对象，都会作为参数传递给下一个拦截器，直到最后一个拦截器，生成最终的代理对象。

```java
  public Object pluginAll(Object target) {
    // note zx 插件 增强目标对象，提供插件功能
    for (Interceptor interceptor : interceptors) {
      target = interceptor.plugin(target);
    }
    return target;
  }
```

`Interceptor`是我们插件的接口，`plugin`生成代理对象的默认方法是调用`Plugin.wrap`方法，该方法会根据`target`的类型，生成代理对象，具体内容见下。

### Plugin

> `Plugin`类是`InvocationHandler`的实现，`wrap`方法通过jdk动态代理创建插件对象。

`wrap`方法需要两个参数：`target`为被代理的原始类，`interceptor`为插件实例。具体流程为：

1. 首先调用 `getSignatureMap(interceptor)` 获取拦截器上的注解信息：

   - 获取拦截器类上的 `@Intercepts` 注解
   - 解析注解中的 @Signature 配置，提取需要拦截的方法信息
   - 将这些信息保存在 `signatureMap` 中，key 是接口类，value 是需要拦截的方法集合
2. 获取目标对象的类型和接口：

   - 通过 `getAllInterfaces()` 方法获取目标对象实现的所有接口
   - 只保留在 `signatureMap` 中配置过的接口，也就是需要被拦截的接口
3. 创建代理对象，如果找到了需要被代理的接口，使用 JDK 动态代理创建代理对象使用 `Proxy.newProxyInstance()` 方法
4. 如果没有需要代理的接口，直接返回原始目标对象

```java
  public static Object wrap(Object target, Interceptor interceptor) {
    // note zx 获取拦截器上的注解，提取所有代理的方法
    Map<Class<?>, Set<Method>> signatureMap = getSignatureMap(interceptor);
    Class<?> type = target.getClass();
    Class<?>[] interfaces = getAllInterfaces(type, signatureMap);
    if (interfaces.length > 0) {
      // note zx jdk动态代理
      return Proxy.newProxyInstance(
          type.getClassLoader(),
          interfaces,
          // note zx 创建代理类对象，实际调用方法时使用的是该类的invoke
          new Plugin(target, interceptor, signatureMap));
    }
    return target;
  }
```

实现jdk动态代理的关键是重写`invoke`方法。在该方法中，首先判断拦截器是否拦截该方法，如果拦截，则调用拦截器的`intercept`方法，否则调用原始方法。
这里需要注意的是，`intercept`方法的参数是`Invocation`，该参数包含了被代理对象、方法、参数等信息。因此在我们实现插件时，可以使用这些参数。

```java
  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    try {
      Set<Method> methods = signatureMap.get(method.getDeclaringClass());
      // note zx 如果拦截器注解拦截该方法
      if (methods != null && methods.contains(method)) {
        // note zx 实际执行时，是调用插件的intercept方法
        return interceptor.intercept(new Invocation(target, method, args));
      }
      return method.invoke(target, args);
    } catch (Exception e) {
      throw ExceptionUtil.unwrapThrowable(e);
    }
  }
```

## 插件案例

下面是一个插件的案例，用于统计sql执行时间。

```java
@Slf4j
@Intercepts(value = {
        @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}),
})
public class SqlExecuteTimeInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement statement = (MappedStatement) invocation.getArgs()[0];
        long startTime = System.currentTimeMillis();
        try {
            return invocation.proceed();
        } finally {
            long endTime = System.currentTimeMillis();
            log.info("sql：{}，执行耗时：{} ms", statement.getId(), endTime - startTime);
        }
    }

    @Override
    public Object plugin(Object o) {
        return Plugin.wrap(o, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }
}
```

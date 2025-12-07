# MyBatis分页实现详解

## 简介

在Web应用开发中，分页查询是一项基本且重要的功能。当数据库中的数据量较大时，一次性查询所有数据会导致性能问题和内存溢出风险。MyBatis提供了多种分页实现方式，本文将详细介绍这些实现方式及其优缺点。

## 1. 分页的基本概念

### 1.1 逻辑分页与物理分页

- **逻辑分页**：查询所有数据到内存，然后在内存中进行分页
- **物理分页**：通过SQL语句直接在数据库中进行分页，只查询需要的数据

| 类型 | 优点 | 缺点 |
|------|------|------|
| 逻辑分页 | 实现简单，跨数据库兼容 | 数据量大时性能差，内存消耗大 |
| 物理分页 | 性能好，内存消耗小 | 不同数据库SQL语法不同，实现复杂 |

## 2. MyBatis内置分页实现

### 2.1 使用RowBounds实现逻辑分页

MyBatis提供了`RowBounds`类来实现逻辑分页，它通过在内存中对查询结果进行截取来实现分页。

#### 2.1.1 接口定义

```java
public interface UserMapper {
    List<User> selectAll(RowBounds rowBounds);
}
```

#### 2.1.2 XML配置

```xml
<select id="selectAll" resultType="User">
    SELECT * FROM user
</select>
```

#### 2.1.3 使用方式

```java
// 从第0条开始，查询10条记录
RowBounds rowBounds = new RowBounds(0, 10);
List<User> users = userMapper.selectAll(rowBounds);
```

#### 2.1.4 原理分析

`RowBounds`的实现原理是在MyBatis的`DefaultResultSetHandler`中，通过`ResultSet`的`absolute()`方法定位到起始行，然后循环读取指定数量的记录。

```java
// DefaultResultSetHandler部分源码
private void handleRowBounds(ResultSet rs, RowBounds rowBounds) throws SQLException {
    if (rs.getType() != ResultSet.TYPE_FORWARD_ONLY) {
        if (rowBounds.getOffset() != 0) {
            rs.absolute(rowBounds.getOffset());
        }
    } else {
        for (int i = 0; i < rowBounds.getOffset(); i++) {
            if (!rs.next()) {
                break;
            }
        }
    }
}
```

## 3. 基于拦截器的物理分页

### 3.1 拦截器原理

MyBatis的插件机制允许我们在SQL执行前后进行拦截和修改。我们可以通过实现`Interceptor`接口来拦截SQL语句，在其中添加分页条件。

### 3.2 自定义分页拦截器

```java
@Intercepts({
    @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
})
public class PaginationInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        String sql = boundSql.getSql();
        
        // 获取分页参数
        Object parameterObject = boundSql.getParameterObject();
        if (parameterObject instanceof Pageable) {
            Pageable pageable = (Pageable) parameterObject;
            int offset = pageable.getOffset();
            int limit = pageable.getPageSize();
            
            // 构造分页SQL（以MySQL为例）
            String paginationSql = sql + " LIMIT " + offset + ", " + limit;
            
            // 修改BoundSql中的SQL
            Field sqlField = boundSql.getClass().getDeclaredField("sql");
            sqlField.setAccessible(true);
            sqlField.set(boundSql, paginationSql);
        }
        
        return invocation.proceed();
    }
    
    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 配置属性
    }
}
```

### 3.3 配置拦截器

```xml
<plugins>
    <plugin interceptor="com.example.PaginationInterceptor"/>
</plugins>
```

## 4. 使用PageHelper实现分页

PageHelper是MyBatis最流行的分页插件之一，它支持多种数据库，使用简单且功能强大。

### 4.1 引入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.3.3</version>
</dependency>
```

### 4.2 配置PageHelper

#### 4.2.1 XML配置

```xml
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <!-- 指定数据库方言 -->
        <property name="helperDialect" value="mysql"/>
        <!-- 分页合理化参数 -->
        <property name="reasonable" value="true"/>
        <!-- 支持通过Mapper接口参数传递分页参数 -->
        <property name="supportMethodsArguments" value="true"/>
        <!-- 映射PageNum和PageSize参数名称 -->
        <property name="params" value="pageNum=page,pageSize=size"/>
    </plugin>
</plugins>
```

#### 4.2.2 Spring配置

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <property name="plugins">
        <array>
            <bean class="com.github.pagehelper.PageInterceptor">
                <property name="properties">
                    <props>
                        <prop key="helperDialect">mysql</prop>
                        <prop key="reasonable">true</prop>
                    </props>
                </property>
            </bean>
        </array>
    </property>
</bean>
```

### 4.3 使用PageHelper

#### 4.3.1 基本使用

```java
// 在查询前调用PageHelper.startPage
PageHelper.startPage(1, 10);
// 执行查询
List<User> users = userMapper.selectAll();
// 获取分页信息
PageInfo<User> pageInfo = new PageInfo<>(users);

// 分页信息
System.out.println("总记录数: " + pageInfo.getTotal());
System.out.println("总页数: " + pageInfo.getPages());
System.out.println("当前页: " + pageInfo.getPageNum());
System.out.println("每页大小: " + pageInfo.getPageSize());
System.out.println("是否有上一页: " + pageInfo.isHasPreviousPage());
System.out.println("是否有下一页: " + pageInfo.isHasNextPage());
```

#### 4.3.2 通过参数传递分页信息

```java
// Mapper接口
List<User> selectByPage(@Param("pageNum") int pageNum, @Param("pageSize") int pageSize);

// 使用
List<User> users = userMapper.selectByPage(1, 10);
PageInfo<User> pageInfo = new PageInfo<>(users);
```

#### 4.3.3 使用Page对象

```java
// 创建Page对象
Page<User> page = PageHelper.startPage(1, 10).doSelectPage(() -> userMapper.selectAll());

// 分页信息
System.out.println("总记录数: " + page.getTotal());
System.out.println("总页数: " + page.getPages());
```

## 5. Spring Boot集成PageHelper

### 5.1 引入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.7</version>
</dependency>
```

### 5.2 配置文件

```yaml
pagehelper:
  helperDialect: mysql
  reasonable: true
  supportMethodsArguments: true
  params: pageNum=page,pageSize=size
```

### 5.3 使用方式

与普通Spring项目相同，PageHelper在Spring Boot中会自动配置。

## 6. 自定义分页实现

### 6.1 分页参数封装

```java
public class PageParams {
    private int pageNum;
    private int pageSize;
    
    public int getOffset() {
        return (pageNum - 1) * pageSize;
    }
    
    // getter和setter方法
}
```

### 6.2 Mapper接口

```java
public interface UserMapper {
    List<User> selectByPage(@Param("params") PageParams params);
    int countUsers();
}
```

### 6.3 XML配置

```xml
<select id="selectByPage" resultType="User">
    SELECT * FROM user
    LIMIT #{params.offset}, #{params.pageSize}
</select>

<select id="countUsers" resultType="int">
    SELECT COUNT(*) FROM user
</select>
```

### 6.4 分页结果封装

```java
public class PageResult<T> {
    private List<T> data;
    private int total;
    private int pageNum;
    private int pageSize;
    private int pages;
    
    // 构造方法和getter/setter方法
}
```

### 6.5 服务层实现

```java
public PageResult<User> getUserByPage(PageParams params) {
    List<User> users = userMapper.selectByPage(params);
    int total = userMapper.countUsers();
    int pages = (total + params.getPageSize() - 1) / params.getPageSize();
    
    PageResult<User> result = new PageResult<>();
    result.setData(users);
    result.setTotal(total);
    result.setPageNum(params.getPageNum());
    result.setPageSize(params.getPageSize());
    result.setPages(pages);
    
    return result;
}
```

## 7. 分页性能优化

### 7.1 避免使用SELECT *

只查询需要的字段，减少数据传输量和内存消耗。

### 7.2 使用索引

确保分页查询的ORDER BY字段有索引，提高排序性能。

### 7.3 优化COUNT查询

对于复杂查询，可以考虑使用单独的COUNT查询或者缓存COUNT结果。

### 7.4 避免深分页

当页码较大时，使用`LIMIT offset, limit`会导致性能问题。可以考虑使用以下方式优化：

```sql
-- 优化前
SELECT * FROM user ORDER BY id LIMIT 10000, 10;

-- 优化后
SELECT * FROM user WHERE id > (SELECT id FROM user ORDER BY id LIMIT 10000, 1) ORDER BY id LIMIT 10;
```

## 8. 常见问题及解决方案

### 8.1 分页参数失效

**问题**：PageHelper.startPage()调用后分页不生效

**解决方案**：

- 确保startPage()在查询方法调用前执行
- 确保查询方法是通过MyBatis代理对象调用的
- 检查是否有多个数据源或SqlSessionFactory

### 8.2 不同数据库方言问题

**问题**：分页SQL在不同数据库中语法不同

**解决方案**：

- 使用PageHelper等支持多数据库的分页插件
- 为不同数据库配置不同的分页拦截器

### 8.3 分页与排序结合问题

**问题**：分页查询时排序不稳定

**解决方案**：

- 确保排序字段唯一
- 在ORDER BY中包含主键字段

```sql
-- 不稳定的排序
SELECT * FROM user ORDER BY name LIMIT 10, 10;

-- 稳定的排序
SELECT * FROM user ORDER BY name, id LIMIT 10, 10;
```

## 9. 总结

MyBatis提供了多种分页实现方式，每种方式都有其优缺点：

1. **RowBounds**：实现简单，但只适合小数据量场景
2. **自定义拦截器**：灵活性高，但需要自行处理多数据库兼容
3. **PageHelper插件**：功能强大，支持多数据库，是最常用的分页方式
4. **自定义分页**：完全可控，但开发工作量大

在实际项目中，推荐使用PageHelper插件来实现分页功能，它提供了良好的性能和易用性。对于特殊需求，可以考虑自定义分页实现。

## 10. 最佳实践

1. 优先使用物理分页，避免逻辑分页
2. 使用PageHelper等成熟的分页插件
3. 为排序字段添加索引
4. 避免深分页查询
5. 封装统一的分页参数和结果对象
6. 在服务层处理分页逻辑，保持Controller层简洁

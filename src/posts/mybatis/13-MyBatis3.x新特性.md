---
title: MyBatis 3.x新特性
tag:
  - mybatis
  - 新特性
category: mybatis
description: 详细介绍MyBatis 3.x版本引入的主要新功能和改进
author: nikola
icon: paw
isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## 简介

MyBatis 3.x是MyBatis框架的一次重大升级，在保留原有核心功能的基础上，引入了许多重要的新特性和改进。这些新特性使得MyBatis的使用更加灵活、高效和易于维护，同时也提供了更好的开发体验。

<!-- more -->

## 1. 接口映射机制

### 1.1 接口代理模式

MyBatis 3.x引入了接口代理模式，允许开发者通过定义Java接口来映射SQL语句，而不需要编写实现类。这种方式大大简化了DAO层的代码。

```java
public interface UserMapper {
    // 通过注解映射SQL
    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(Long id);
    
    // 通过XML映射SQL
    void insert(User user);
}
```

### 1.2 动态代理实现

MyBatis通过JDK动态代理为接口生成实现类。当调用接口方法时，代理对象会根据方法签名和注解信息找到对应的SQL语句并执行。

```java
// 获取Mapper接口的代理实现
UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
// 调用方法执行SQL
User user = userMapper.selectById(1L);
```

## 2. 动态SQL增强

### 2.1 改进的动态SQL标签

MyBatis 3.x对动态SQL标签进行了增强，提供了更强大的条件判断和SQL拼接功能。

```xml
<select id="findUsers" resultType="User">
    SELECT * FROM user
    <where>
        <if test="username != null">
            AND username LIKE #{username}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
        <choose>
            <when test="orderField == 'name'">
                ORDER BY username
            </when>
            <when test="orderField == 'created'">
                ORDER BY created_time
            </when>
            <otherwise>
                ORDER BY id
            </otherwise>
        </choose>
        <if test="orderDesc != null and orderDesc">
            DESC
        </if>
    </where>
</select>
```

### 2.2 SQL片段复用

支持将常用的SQL片段抽取出来，在多个地方复用，提高代码的可维护性。

```xml
<!-- 定义SQL片段 -->
<sql id="userColumns">
    id, username, password, email, status, created_time
</sql>

<!-- 复用SQL片段 -->
<select id="selectById" resultType="User">
    SELECT <include refid="userColumns" />
    FROM user
    WHERE id = #{id}
</select>
```

## 3. 结果映射改进

### 3.1 高级结果映射

MyBatis 3.x提供了更灵活的结果映射配置，支持复杂的关联关系映射。

```xml
<resultMap id="userResultMap" type="User">
    <id property="id" column="id" />
    <result property="username" column="username" />
    <result property="password" column="password" />
    <result property="email" column="email" />
    <!-- 一对一关联 -->
    <association property="profile" javaType="UserProfile">
        <id property="id" column="profile_id" />
        <result property="nickname" column="nickname" />
        <result property="avatar" column="avatar" />
    </association>
    <!-- 一对多关联 -->
    <collection property="posts" ofType="Post">
        <id property="id" column="post_id" />
        <result property="title" column="post_title" />
        <result property="content" column="post_content" />
    </collection>
</resultMap>
```

### 3.2 鉴别器映射

支持基于查询结果的某个列值来动态选择不同的结果映射。

```xml
<resultMap id="vehicleResultMap" type="Vehicle">
    <id property="id" column="id" />
    <result property="type" column="type" />
    <result property="brand" column="brand" />
    <!-- 鉴别器映射 -->
    <discriminator javaType="int" column="type">
        <case value="1" resultMap="carResultMap" />
        <case value="2" resultMap="truckResultMap" />
        <case value="3" resultMap="motorcycleResultMap" />
    </discriminator>
</resultMap>
```

## 4. 缓存机制优化

### 4.1 二级缓存改进

MyBatis 3.x对二级缓存进行了优化，支持更灵活的缓存配置和更高效的缓存实现。

```xml
<!-- 配置缓存 -->
<cache
    eviction="FIFO"
    flushInterval="60000"
    size="512"
    readOnly="true" />

<!-- 配置单个查询是否使用缓存 -->
<select id="selectById" resultType="User" useCache="true">
    SELECT * FROM user WHERE id = #{id}
</select>
```

### 4.2 自定义缓存实现

支持实现自定义的缓存接口，以便与第三方缓存框架集成。

```java
public class RedisCache implements Cache {
    private final String id;
    private final RedisTemplate<String, Object> redisTemplate;
    
    public RedisCache(String id) {
        this.id = id;
        this.redisTemplate = RedisUtils.getRedisTemplate();
    }
    
    @Override
    public String getId() {
        return id;
    }
    
    @Override
    public void putObject(Object key, Object value) {
        redisTemplate.opsForValue().set(key.toString(), value, 30, TimeUnit.MINUTES);
    }
    
    @Override
    public Object getObject(Object key) {
        return redisTemplate.opsForValue().get(key.toString());
    }
    
    // 其他方法实现...
}
```

## 5. 插件系统改进

### 5.1 增强的插件机制

MyBatis 3.x的插件机制更加灵活，可以拦截更多的核心组件和方法。

```java
@Intercepts({
    @Signature(type = Executor.class, method = "query", 
              args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
    @Signature(type = Executor.class, method = "update", 
              args = {MappedStatement.class, Object.class})
})
public class SqlExecutionTimeInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        long startTime = System.currentTimeMillis();
        try {
            return invocation.proceed();
        } finally {
            long endTime = System.currentTimeMillis();
            System.out.println("SQL执行时间: " + (endTime - startTime) + "ms");
        }
    }
    
    // 其他方法实现...
}
```

## 6. 类型处理器增强

### 6.1 类型处理器自动注册

MyBatis 3.x支持自动注册类型处理器，简化了类型映射的配置。

```java
// 自定义类型处理器
@MappedTypes({LocalDateTime.class})
@MappedJdbcTypes({JdbcType.TIMESTAMP})
public class LocalDateTimeTypeHandler implements TypeHandler<LocalDateTime> {
    // 实现类型转换方法...
}
```

### 6.2 枚举类型支持

提供了对Java枚举类型的内置支持，可以将枚举值与数据库字段进行映射。

```java
public enum UserStatus {
    ACTIVE(1, "激活"),
    INACTIVE(0, "未激活");
    
    private final int code;
    private final String description;
    
    // 构造方法和getter...
}
```

```xml
<resultMap id="userResultMap" type="User">
    <id property="id" column="id" />
    <result property="username" column="username" />
    <!-- 枚举类型映射 -->
    <result property="status" column="status" typeHandler="org.apache.ibatis.type.EnumOrdinalTypeHandler" />
</resultMap>
```

## 7. 批量操作支持

### 7.1 批量插入

提供了高效的批量插入支持，减少数据库交互次数。

```java
// 使用SqlSession进行批量操作
sqlSession.startBatch();
for (User user : users) {
    userMapper.insert(user);
}
sqlSession.commitBatch();
```

### 7.2 批量更新和删除

同样支持批量更新和删除操作，提高数据操作效率。

```xml
<!-- 批量删除 -->
<delete id="deleteBatch">
    DELETE FROM user WHERE id IN
    <foreach item="id" collection="ids" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

## 8. 配置简化

### 8.1 配置文件简化

MyBatis 3.x的配置文件结构更加清晰，支持更多的默认配置，减少了不必要的配置项。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC" />
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis" />
                <property name="username" value="root" />
                <property name="password" value="password" />
            </dataSource>
        </environment>
    </environments>
    
    <!-- Mapper映射 -->
    <mappers>
        <package name="com.example.mapper" />
    </mappers>
</configuration>
```

### 8.2 注解配置支持

支持通过注解进行配置，进一步简化配置过程。

```java
@Configuration
@MapperScan("com.example.mapper")
public class MyBatisConfig {
    @Bean
    public DataSource dataSource() {
        // 配置数据源
    }
    
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        return factoryBean.getObject();
    }
}
```

## 9. 参数处理增强

### 9.1 命名参数支持

支持在SQL语句中使用命名参数，提高SQL的可读性。

```java
@Select("SELECT * FROM user WHERE username = #{username} AND password = #{password}")
User selectByUsernameAndPassword(@Param("username") String username, @Param("password") String password);
```

### 9.2 复杂参数映射

支持将Java对象的属性映射到SQL语句的参数中，自动处理嵌套对象。

```xml
<insert id="insertUser">
    INSERT INTO user (username, password, email, profile_nickname, profile_avatar)
    VALUES (#{username}, #{password}, #{email}, #{profile.nickname}, #{profile.avatar})
</insert>
```

## 10. 日志和调试改进

### 10.1 详细的SQL日志

提供了更详细的SQL执行日志，包括参数值、执行时间等信息，便于调试和性能分析。

```plaintext
DEBUG [main] - ==>  Preparing: SELECT id, username, password FROM user WHERE id = ? 
DEBUG [main] - ==> Parameters: 1(Long)
DEBUG [main] - <==      Total: 1
DEBUG [main] - SQL执行时间: 5ms
```

### 10.2 内置调试工具

MyBatis 3.x提供了一些内置的调试工具，帮助开发者分析和调试SQL执行过程。

## 总结

MyBatis 3.x引入的这些新特性和改进，使得MyBatis成为一个更加成熟、高效和易于使用的ORM框架。这些新特性不仅提高了开发效率，也提供了更好的性能和可维护性。对于正在使用MyBatis的开发者来说，升级到3.x版本可以获得更好的开发体验和更多的功能支持。

## 参考资料

- [MyBatis官方文档](https://mybatis.org/mybatis-3/zh/index.html)
- [MyBatis 3.x迁移指南](https://mybatis.org/mybatis-3/zh/migration.html)
- [MyBatis源码分析](https://github.com/mybatis/mybatis-3)

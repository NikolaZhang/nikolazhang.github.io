---
title: MyBatis与Spring Boot集成详解
tag:
  - mybatis
  - spring-boot
category: mybatis
description: 详细介绍MyBatis与Spring Boot的集成方式、自动配置原理、使用方法和最佳实践
author: nikola
icon: article
isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## 简介

MyBatis与Spring Boot的集成是现代Java企业应用开发中最常见的组合之一。Spring Boot提供了简化配置、快速开发的能力，而MyBatis则提供了灵活的SQL映射和数据库操作能力。两者的结合可以让开发者更加高效地进行数据库操作开发。

<!-- more -->

## 1. 集成准备

### 1.1 依赖配置

Spring Boot为MyBatis提供了官方的starter依赖，简化了依赖管理。

**Maven依赖：**

```xml
<!-- Spring Boot Starter Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- MyBatis Spring Boot Starter -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>

<!-- 数据库驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- 数据库连接池 -->
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
</dependency>
```

### 1.2 数据库配置

在`application.yml`或`application.properties`中配置数据库连接信息：

**application.yml配置：**

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mybatis_demo?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      auto-commit: true
      idle-timeout: 30000
      pool-name: DatebookHikariCP
      max-lifetime: 1800000
      connection-timeout: 30000
      connection-test-query: SELECT 1
```

## 2. MyBatis自动配置原理

Spring Boot对MyBatis的自动配置主要通过`MybatisAutoConfiguration`类实现，位于`org.mybatis.spring.boot.autoconfigure`包中。

### 2.1 核心自动配置类

```java
@Configuration
@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class })
@ConditionalOnSingleCandidate(DataSource.class)
@EnableConfigurationProperties(MybatisProperties.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
public class MybatisAutoConfiguration {
    // 自动配置逻辑
}
```

### 2.2 自动配置的核心组件

1. **SqlSessionFactory**：通过`SqlSessionFactoryBean`自动创建
2. **SqlSessionTemplate**：自动配置并注入到Spring容器
3. **Mapper接口扫描**：通过`@MapperScan`或自动扫描`@Mapper`注解的接口
4. **MyBatis属性配置**：读取`application.properties`/`application.yml`中的`mybatis.*`配置

## 3. 基本使用方法

### 3.1 配置MyBatis属性

在`application.yml`中可以配置MyBatis相关属性：

```yaml
mybatis:
  # MyBatis配置文件位置
  config-location: classpath:mybatis/mybatis-config.xml
  # Mapper文件位置
  mapper-locations: classpath:mybatis/mapper/**/*.xml
  # 实体类包路径
  type-aliases-package: com.example.mybatisdemo.entity
  # 驼峰命名转换
  configuration:
    map-underscore-to-camel-case: true
    # 日志级别
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 3.2 创建实体类

```java
public class User {
    private Long id;
    private String userName;
    private String email;
    private Integer age;
    private Date createTime;
    
    // getter和setter方法
}
```

### 3.3 创建Mapper接口

#### 3.3.1 基于注解的Mapper

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
    
    @Insert("INSERT INTO user(user_name, email, age, create_time) VALUES(#{userName}, #{email}, #{age}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE user SET user_name = #{userName}, email = #{email}, age = #{age} WHERE id = #{id}")
    int update(User user);
    
    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);
    
    @Select("SELECT * FROM user")
    List<User> findAll();
}
```

#### 3.3.2 基于XML的Mapper

```java
@Mapper
public interface UserMapper {
    User findById(Long id);
    int insert(User user);
    int update(User user);
    int deleteById(Long id);
    List<User> findAll();
}
```

对应的XML映射文件（user-mapper.xml）：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mybatisdemo.mapper.UserMapper">
    <resultMap id="BaseResultMap" type="com.example.mybatisdemo.entity.User">
        <id column="id" property="id" jdbcType="BIGINT" />
        <result column="user_name" property="userName" jdbcType="VARCHAR" />
        <result column="email" property="email" jdbcType="VARCHAR" />
        <result column="age" property="age" jdbcType="INTEGER" />
        <result column="create_time" property="createTime" jdbcType="TIMESTAMP" />
    </resultMap>
    
    <select id="findById" resultMap="BaseResultMap">
        SELECT * FROM user WHERE id = #{id}
    </select>
    
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user(user_name, email, age, create_time)
        VALUES(#{userName}, #{email}, #{age}, #{createTime})
    </insert>
    
    <update id="update" >
        UPDATE user
        SET user_name = #{userName}, email = #{email}, age = #{age}
        WHERE id = #{id}
    </update>
    
    <delete id="deleteById">
        DELETE FROM user WHERE id = #{id}
    </delete>
    
    <select id="findAll" resultMap="BaseResultMap">
        SELECT * FROM user
    </select>
</mapper>
```

### 3.4 服务层实现

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public User findById(Long id) {
        return userMapper.findById(id);
    }
    
    @Override
    public User save(User user) {
        user.setCreateTime(new Date());
        userMapper.insert(user);
        return user;
    }
    
    @Override
    public User update(User user) {
        userMapper.update(user);
        return user;
    }
    
    @Override
    public void deleteById(Long id) {
        userMapper.deleteById(id);
    }
    
    @Override
    public List<User> findAll() {
        return userMapper.findAll();
    }
}
```

### 3.5 控制器实现

```java
@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> save(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.update(user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
}
```

## 4. 高级特性

### 4.1 分页查询

使用PageHelper实现分页：

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.2</version>
</dependency>
```

使用方法：

```java
@Override
public PageInfo<User> findByPage(int pageNum, int pageSize) {
    PageHelper.startPage(pageNum, pageSize);
    List<User> users = userMapper.findAll();
    return new PageInfo<>(users);
}
```

### 4.2 多数据源配置

使用`spring-boot-starter-jta-atomikos`实现分布式事务管理：

```java
@Configuration
@MapperScan(basePackages = "com.example.mybatisdemo.mapper.primary", sqlSessionTemplateRef = "primarySqlSessionTemplate")
public class PrimaryDataSourceConfig {
    // 主数据源配置
}

@Configuration
@MapperScan(basePackages = "com.example.mybatisdemo.mapper.secondary", sqlSessionTemplateRef = "secondarySqlSessionTemplate")
public class SecondaryDataSourceConfig {
    // 从数据源配置
}
```

### 4.3 事务管理

使用`@Transactional`注解实现事务管理：

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserAndOrder(User user, Order order) {
        // 保存用户
        userMapper.insert(user);
        // 设置订单关联的用户ID
        order.setUserId(user.getId());
        // 保存订单
        orderMapper.insert(order);
    }
}
```

### 4.4 动态SQL

使用XML实现动态SQL：

```xml
<select id="findByCondition" resultMap="BaseResultMap">
    SELECT * FROM user
    <where>
        <if test="userName != null and userName != ''">
            AND user_name LIKE CONCAT('%', #{userName}, '%')
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
        <if test="email != null and email != ''">
            AND email LIKE CONCAT('%', #{email}, '%')
        </if>
    </where>
</select>
```

## 5. 最佳实践

### 5.1 配置优化

1. **使用连接池**：默认使用HikariCP，性能优秀
2. **开启驼峰命名转换**：`map-underscore-to-camel-case: true`
3. **合理配置日志级别**：生产环境建议使用WARN级别
4. **设置合理的超时时间**：避免长连接占用资源

### 5.2 SQL优化

1. **使用参数绑定**：避免SQL注入
2. **合理使用索引**：根据查询条件创建索引
3. **避免SELECT ***：只查询需要的字段
4. **使用批量操作**：减少数据库交互次数

### 5.3 代码结构优化

1. **分层架构**：Controller -> Service -> Mapper
2. **使用DTO**：避免直接返回实体类
3. **异常处理**：统一处理数据库异常
4. **使用@MapperScan**：统一扫描Mapper接口

### 5.4 性能监控

1. **使用Spring Boot Actuator**：监控应用运行状态
2. **配置MyBatis日志**：分析SQL执行情况
3. **使用Druid监控**：监控SQL执行性能
4. **定期分析慢查询**：优化性能瓶颈

## 6. 常见问题及解决方案

### 6.1 Mapper接口无法注入

**问题**：`Field userMapper in com.example.mybatisdemo.service.impl.UserServiceImpl required a bean of type 'com.example.mybatisdemo.mapper.UserMapper' that could not be found.`

**解决方案**：

1. 确保Mapper接口添加了`@Mapper`注解
2. 确保启动类添加了`@MapperScan("com.example.mybatisdemo.mapper")`注解
3. 检查Mapper接口包路径是否正确

### 6.2 SQL映射文件无法找到

**问题**：`Invalid bound statement (not found): com.example.mybatisdemo.mapper.UserMapper.findById`

**解决方案**：

1. 检查Mapper接口与XML文件的namespace是否一致
2. 检查XML文件的id与Mapper接口的方法名是否一致
3. 检查application.yml中mapper-locations配置是否正确
4. 确保XML文件在resources目录下，并且被正确打包

### 6.3 驼峰命名转换不生效

**问题**：数据库字段`user_name`无法映射到实体类字段`userName`

**解决方案**：

1. 在application.yml中配置`mybatis.configuration.map-underscore-to-camel-case: true`
2. 或者在MyBatis配置文件中配置`<setting name="mapUnderscoreToCamelCase" value="true"/>`

### 6.4 分页插件不生效

**问题**：PageHelper分页查询返回所有数据，没有分页效果

**解决方案**：

1. 确保引入了正确的PageHelper依赖
2. 确保在查询方法之前调用`PageHelper.startPage()`
3. 检查PageHelper配置是否正确

### 6.5 事务不回滚

**问题**：方法抛出异常时，数据库操作没有回滚

**解决方案**：

1. 确保方法添加了`@Transactional`注解
2. 检查异常类型是否在`rollbackFor`属性中声明
3. 确保异常被正确抛出，没有被内部捕获

## 7. 总结

MyBatis与Spring Boot的集成大大简化了数据库操作的开发过程。通过自动配置，开发者可以快速搭建MyBatis环境，专注于业务逻辑的实现。本文介绍了MyBatis与Spring Boot集成的基本方法、高级特性和最佳实践，希望能帮助开发者更好地使用这一技术栈。

在实际开发中，建议根据项目需求选择合适的配置方式，遵循最佳实践，注重性能优化和代码质量。同时，要注意处理常见问题，确保应用的稳定运行。

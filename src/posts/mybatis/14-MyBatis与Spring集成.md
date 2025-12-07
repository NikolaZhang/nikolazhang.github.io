---
title: MyBatis与Spring集成
tag:
  - mybatis
  - spring
category: mybatis
description: 详细介绍MyBatis与Spring框架的集成方式、核心组件和最佳实践
author: nikola
icon: paw
isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## 简介

MyBatis与Spring的集成是Java企业应用开发中非常常见的组合。Spring提供了依赖注入、面向切面编程和事务管理等核心功能，而MyBatis则专注于SQL映射和数据库操作。两者的结合可以充分发挥各自的优势，提高开发效率和代码质量。

<!-- more -->

## 1. 集成准备

### 1.1 依赖配置

要实现MyBatis与Spring的集成，首先需要添加相关依赖。可以使用Maven或Gradle进行依赖管理。

**Maven依赖：**

```xml
<!-- Spring核心依赖 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.20</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.20</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.3.20</version>
</dependency>

<!-- MyBatis核心依赖 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.9</version>
</dependency>

<!-- MyBatis与Spring集成依赖 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.7</version>
</dependency>

<!-- 数据库驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.29</version>
</dependency>

<!-- 连接池 -->
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.0.1</version>
</dependency>
```

### 1.2 集成架构

MyBatis与Spring集成的核心是通过Spring的IoC容器管理MyBatis的核心组件，并实现两者之间的无缝协作。主要涉及以下组件：

- **SqlSessionFactory**：MyBatis的核心工厂类，负责创建SqlSession
- **SqlSessionTemplate**：Spring提供的SqlSession包装类，实现了SqlSession接口，支持Spring事务管理
- **MapperScannerConfigurer**：自动扫描Mapper接口并创建代理对象
- **DataSource**：数据源，由Spring管理

## 2. 核心组件详解

### 2.1 SqlSessionFactoryBean

`SqlSessionFactoryBean`是MyBatis与Spring集成的核心类，用于在Spring容器中创建`SqlSessionFactory`实例。它负责加载MyBatis配置文件、初始化MyBatis环境并创建SqlSessionFactory。

```xml
<!-- 配置数据源 -->
<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC"/>
    <property name="username" value="root"/>
    <property name="password" value="password"/>
    <property name="maximumPoolSize" value="10"/>
</bean>

<!-- 配置SqlSessionFactoryBean -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <!-- 注入数据源 -->
    <property name="dataSource" ref="dataSource"/>
    <!-- 指定MyBatis配置文件路径 -->
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
    <!-- 指定Mapper映射文件路径 -->
    <property name="mapperLocations" value="classpath:mapper/*.xml"/>
    <!-- 指定实体类包路径，用于别名 -->
    <property name="typeAliasesPackage" value="com.example.entity"/>
    <!-- 配置插件 -->
    <property name="plugins">
        <array>
            <!-- 分页插件示例 -->
            <bean class="com.github.pagehelper.PageInterceptor">
                <property name="properties">
                    <value>
                        helperDialect=mysql
                        reasonable=true
                    </value>
                </property>
            </bean>
        </array>
    </property>
</bean>
```

### 2.2 SqlSessionTemplate

`SqlSessionTemplate`是Spring提供的`SqlSession`实现，它是线程安全的，可以被多个DAO共享使用。它与Spring事务管理器集成，确保在事务范围内使用同一个SqlSession。

```xml
<!-- 配置SqlSessionTemplate -->
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <constructor-arg index="0" ref="sqlSessionFactory"/>
</bean>
```

使用`SqlSessionTemplate`的DAO示例：

```java
public class UserDaoImpl implements UserDao {
    
    private SqlSessionTemplate sqlSession;
    
    // 通过setter方法注入SqlSessionTemplate
    public void setSqlSession(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }
    
    @Override
    public User selectById(Long id) {
        return sqlSession.selectOne("com.example.mapper.UserMapper.selectById", id);
    }
    
    @Override
    public void insert(User user) {
        sqlSession.insert("com.example.mapper.UserMapper.insert", user);
    }
}
```

### 2.3 MapperScannerConfigurer

`MapperScannerConfigurer`是一个Bean后处理器，用于自动扫描指定包下的Mapper接口，并为它们创建代理对象。代理对象会被注册到Spring容器中，可以直接注入到其他Bean中使用。

```xml
<!-- 配置MapperScannerConfigurer -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 指定要扫描的Mapper接口包路径 -->
    <property name="basePackage" value="com.example.mapper"/>
    <!-- 指定SqlSessionFactoryBean的名称 -->
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
</bean>
```

使用自动扫描的Mapper接口：

```java
@Service
public class UserServiceImpl implements UserService {
    
    // 直接注入Mapper接口，Spring会自动创建代理对象
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public void createUser(User user) {
        userMapper.insert(user);
    }
}
```

## 3. 配置方式

### 3.1 XML配置方式

XML配置是MyBatis与Spring集成的传统方式，通过Spring的XML配置文件定义所有组件。

**完整的XML配置示例：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 配置数据源 -->
    <bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="password"/>
    </bean>

    <!-- 配置SqlSessionFactoryBean -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:mapper/*.xml"/>
        <property name="typeAliasesPackage" value="com.example.entity"/>
    </bean>

    <!-- 配置MapperScannerConfigurer -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.example.mapper"/>
    </bean>

    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 启用事务注解支持 -->
    <tx:annotation-driven transaction-manager="transactionManager"/>

    <!-- 配置业务服务 -->
    <bean id="userService" class="com.example.service.impl.UserServiceImpl"/>
</beans>
```

### 3.2 注解配置方式

Spring 3.0+支持使用注解进行配置，通过`@Configuration`、`@Bean`等注解可以完全替代XML配置。

**注解配置示例：**

```java
@Configuration
@MapperScan("com.example.mapper") // 替代MapperScannerConfigurer
@EnableTransactionManagement // 启用事务注解
public class MyBatisConfig {
    
    // 配置数据源
    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        return new HikariDataSource(config);
    }
    
    // 配置SqlSessionFactory
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        
        // 设置MyBatis配置文件
        factoryBean.setConfigLocation(new ClassPathResource("mybatis-config.xml"));
        
        // 设置Mapper映射文件
        factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/*.xml"));
        
        // 设置实体类别名包
        factoryBean.setTypeAliasesPackage("com.example.entity");
        
        // 配置插件
        factoryBean.setPlugins(new Interceptor[] {
            pageInterceptor()
        });
        
        return factoryBean.getObject();
    }
    
    // 配置分页插件
    @Bean
    public PageInterceptor pageInterceptor() {
        PageInterceptor interceptor = new PageInterceptor();
        Properties properties = new Properties();
        properties.setProperty("helperDialect", "mysql");
        properties.setProperty("reasonable", "true");
        interceptor.setProperties(properties);
        return interceptor;
    }
    
    // 配置事务管理器
    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

## 4. 事务管理集成

### 4.1 Spring事务管理器

MyBatis与Spring集成后，可以使用Spring的事务管理器来管理MyBatis的事务。Spring提供了`DataSourceTransactionManager`作为JDBC数据源的事务管理器，它可以与MyBatis无缝集成。

```xml
<!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 启用事务注解支持 -->
<tx:annotation-driven transaction-manager="transactionManager"/>
```

### 4.2 事务注解使用

使用`@Transactional`注解可以方便地为方法或类添加事务支持。

```java
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private RoleMapper roleMapper;
    
    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void createUserWithRole(User user, List<Long> roleIds) {
        // 插入用户
        userMapper.insert(user);
        
        // 插入用户角色关系
        for (Long roleId : roleIds) {
            roleMapper.insertUserRole(user.getId(), roleId);
        }
        
        // 如果发生异常，整个事务会回滚
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
}
```

### 4.3 事务传播行为

Spring支持多种事务传播行为，可以根据业务需求进行配置：

| 传播行为 | 描述 |
|---------|------|
| REQUIRED | 如果当前存在事务，则加入该事务；如果不存在，则创建一个新事务 |
| SUPPORTS | 如果当前存在事务，则加入该事务；如果不存在，则以非事务方式执行 |
| MANDATORY | 如果当前存在事务，则加入该事务；如果不存在，则抛出异常 |
| REQUIRES_NEW | 创建一个新事务，如果当前存在事务，则将当前事务挂起 |
| NOT_SUPPORTED | 以非事务方式执行，如果当前存在事务，则将当前事务挂起 |
| NEVER | 以非事务方式执行，如果当前存在事务，则抛出异常 |
| NESTED | 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务；如果不存在，则创建一个新事务 |

## 5. 高级特性

### 5.1 动态数据源

在复杂的应用中，可能需要使用多个数据源。Spring提供了`AbstractRoutingDataSource`类，可以实现动态数据源切换。

```java
// 自定义动态数据源
public class DynamicDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        // 从ThreadLocal中获取当前数据源标识
        return DataSourceContextHolder.getDataSourceKey();
    }
}

// 数据源上下文持有器
public class DataSourceContextHolder {
    
    private static final ThreadLocal<String> contextHolder = new ThreadLocal<>();
    
    public static void setDataSourceKey(String dataSourceKey) {
        contextHolder.set(dataSourceKey);
    }
    
    public static String getDataSourceKey() {
        return contextHolder.get();
    }
    
    public static void clearDataSourceKey() {
        contextHolder.remove();
    }
}
```

**配置动态数据源：**

```java
@Configuration
public class DataSourceConfig {
    
    // 配置主数据源
    @Bean("masterDataSource")
    public DataSource masterDataSource() {
        // 配置主数据源
    }
    
    // 配置从数据源
    @Bean("slaveDataSource")
    public DataSource slaveDataSource() {
        // 配置从数据源
    }
    
    // 配置动态数据源
    @Bean("dynamicDataSource")
    public DataSource dynamicDataSource(@Qualifier("masterDataSource") DataSource masterDataSource,
                                       @Qualifier("slaveDataSource") DataSource slaveDataSource) {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        
        // 配置默认数据源
        dynamicDataSource.setDefaultTargetDataSource(masterDataSource);
        
        // 配置数据源映射
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("master", masterDataSource);
        dataSourceMap.put("slave", slaveDataSource);
        dynamicDataSource.setTargetDataSources(dataSourceMap);
        
        return dynamicDataSource;
    }
    
    // 配置SqlSessionFactory使用动态数据源
    @Bean
    public SqlSessionFactory sqlSessionFactory(@Qualifier("dynamicDataSource") DataSource dynamicDataSource) throws Exception {
        // 配置SqlSessionFactory
    }
}
```

### 5.2 批量操作

MyBatis与Spring集成后，可以使用`SqlSessionTemplate`的批量操作方法或结合Spring的`JdbcTemplate`进行批量操作。

**使用SqlSessionTemplate进行批量操作：**

```java
@Service
public class BatchServiceImpl implements BatchService {
    
    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;
    
    @Override
    @Transactional
    public void batchInsertUsers(List<User> users) {
        // 获取批量操作的SqlSession
        SqlSession sqlSession = sqlSessionTemplate.getSqlSessionFactory().openSession(ExecutorType.BATCH);
        try {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            for (User user : users) {
                userMapper.insert(user);
            }
            // 执行批量操作
            sqlSession.flushStatements();
        } finally {
            sqlSession.close();
        }
    }
}
```

## 6. 常见问题及解决方案

### 6.1 Mapper接口无法注入

**问题描述：**
尝试注入Mapper接口时，Spring容器找不到对应的Bean。

**解决方案：**

1. 确保已配置`MapperScannerConfigurer`或`@MapperScan`注解
2. 检查Mapper接口的包路径是否在扫描范围内
3. 确保Mapper接口上没有使用`@Component`等注解，这些注解会导致冲突
4. 检查Mapper接口的方法与XML映射文件中的SQL语句是否匹配

### 6.2 事务不回滚

**问题描述：**
使用`@Transactional`注解的方法发生异常时，事务不回滚。

**解决方案：**

1. 确保已配置事务管理器并启用了事务注解支持
2. 检查异常类型是否在`rollbackFor`属性指定的范围内，默认只回滚RuntimeException和Error
3. 确保方法是public的，Spring事务注解只对public方法生效
4. 检查是否在同一类中调用事务方法，内部调用不会触发事务代理

### 6.3 数据源配置错误

**问题描述：**
启动时出现数据源连接错误。

**解决方案：**

1. 检查数据库驱动类名是否正确，MySQL 8.0+使用`com.mysql.cj.jdbc.Driver`
2. 检查JDBC URL格式是否正确，MySQL 8.0+需要指定时区
3. 检查数据库用户名和密码是否正确
4. 检查数据库服务是否正常运行，端口是否正确

## 7. 注意事项

### 7.1 配置文件加载顺序

MyBatis与Spring集成时，配置文件的加载顺序很重要：

1. 首先加载Spring配置文件
2. 然后通过SqlSessionFactoryBean加载MyBatis配置文件
3. 最后加载Mapper映射文件

注意：MyBatis配置文件中的某些配置（如数据源、事务管理器）会被Spring配置覆盖。

### 7.2 Mapper接口命名规范

为了提高代码的可维护性，建议遵循以下命名规范：

- Mapper接口名称：实体类名 + Mapper
- XML映射文件名称：与Mapper接口名称相同
- 方法名称：使用select、insert、update、delete等前缀，后面跟上具体操作描述

### 7.3 性能优化

1. **连接池配置**：合理配置连接池参数（如最大连接数、最小空闲连接数等）
2. **批量操作**：对于大量数据操作，使用批量操作减少数据库交互次数
3. **缓存配置**：合理配置MyBatis的一级缓存和二级缓存
4. **SQL优化**：编写高效的SQL语句，避免全表扫描
5. **延迟加载**：对于复杂关联查询，使用延迟加载减少不必要的数据加载

### 7.4 安全考虑

1. **SQL注入防护**：使用MyBatis的参数绑定（#{参数名}）而不是字符串拼接（${参数名}）
2. **密码加密**：数据库密码等敏感信息不要硬编码在配置文件中，可以使用环境变量或配置中心
3. **权限控制**：合理配置数据库用户权限，遵循最小权限原则
4. **日志安全**：生产环境中不要记录敏感信息，如密码、身份证号等

## 8. 总结

MyBatis与Spring的集成是Java企业应用开发的常用组合，通过Spring的IoC容器和事务管理功能，可以实现MyBatis组件的高效管理和事务控制。集成方式包括XML配置和注解配置，开发者可以根据项目需求选择合适的方式。

在集成过程中，需要注意配置文件的加载顺序、Mapper接口的扫描配置、事务管理的配置等关键环节。同时，还可以利用动态数据源、批量操作等高级特性来满足复杂业务需求。

通过合理配置和使用MyBatis与Spring的集成，可以提高开发效率，保证代码质量，并为应用的性能优化和安全防护提供有力支持。

## 参考资料

- [MyBatis官方文档 - Spring集成](https://mybatis.org/mybatis-3/zh/spring/index.html)
- [Spring官方文档 - 事务管理](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)
- [MyBatis-Spring GitHub仓库](https://github.com/mybatis/spring)
- [HikariCP官方文档](https://github.com/brettwooldridge/HikariCP)

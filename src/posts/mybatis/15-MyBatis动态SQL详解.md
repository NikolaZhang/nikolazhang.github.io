---
title: MyBatis动态SQL详解
tag:
  - mybatis
  - dynamic-sql
  - sql
category: mybatis
description: 详细介绍MyBatis动态SQL的各种标签、用法和最佳实践
author: nikola
icon: paw
isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

## 简介

MyBatis的动态SQL是其最强大的特性之一，它允许根据不同的条件动态生成SQL语句。这种灵活性使得开发者可以编写更加简洁、可维护的SQL代码，同时避免了手动拼接SQL语句可能带来的错误和安全问题（如SQL注入）。

动态SQL通过一系列的XML标签实现，这些标签可以根据传入的参数条件来决定生成的SQL片段。MyBatis提供了丰富的动态SQL标签，包括`<if>`、`<choose>`、`<when>`、`<otherwise>`、`<trim>`、`<where>`、`<set>`、`<foreach>`和`<bind>`等。

<!-- more -->

## 1. 基本动态SQL标签

### 1.1 `<if>`标签

`<if>`标签是最基本的动态SQL标签，它允许根据条件判断是否包含某个SQL片段。

**语法：**

```xml
<if test="条件表达式">
    SQL片段
</if>
```

**示例：**

```xml
<select id="findUsers" resultType="User">
    SELECT * FROM user
    WHERE 1=1
    <if test="username != null and username != ''">
        AND username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="status != null">
        AND status = #{status}
    </if>
    <if test="startTime != null">
        AND created_time >= #{startTime}
    </if>
    <if test="endTime != null">
        AND created_time <= #{endTime}
    </if>
</select>
```

**注意事项：**

- 条件表达式中可以使用Java对象的属性、算术运算符、逻辑运算符等
- 字符串判断时需要同时检查`null`和空字符串`''`
- 数值类型判断时只需检查`null`
- 为了避免条件都不满足时出现`WHERE`关键字后没有条件的情况，通常会添加`WHERE 1=1`作为基础条件

### 1.2 `<choose>`、`<when>`、`<otherwise>`标签

这三个标签组合使用，类似于Java中的`switch-case-default`语句，用于从多个条件中选择一个执行。

**语法：**

```xml
<choose>
    <when test="条件表达式1">
        SQL片段1
    </when>
    <when test="条件表达式2">
        SQL片段2
    </when>
    <otherwise>
        默认SQL片段
    </otherwise>
</choose>
```

**示例：**

```xml
<select id="findUsers" resultType="User">
    SELECT * FROM user
    WHERE status = 1
    <choose>
        <when test="sortBy == 'id'">
            ORDER BY id #{sortOrder}
        </when>
        <when test="sortBy == 'username'">
            ORDER BY username #{sortOrder}
        </when>
        <when test="sortBy == 'createdTime'">
            ORDER BY created_time #{sortOrder}
        </when>
        <otherwise>
            ORDER BY id ASC
        </otherwise>
    </choose>
</select>
```

**注意事项：**

- 只会执行第一个满足条件的`<when>`标签内的SQL片段
- 如果所有`<when>`条件都不满足，则执行`<otherwise>`标签内的SQL片段
- `<otherwise>`标签是可选的

### 1.3 `<trim>`、`<where>`、`<set>`标签

这些标签用于处理SQL语句中的前缀、后缀和多余的字符，如AND、OR、逗号等。

#### 1.3.1 `<where>`标签

`<where>`标签用于处理SQL语句中的WHERE子句，它会自动处理条件前的AND或OR关键字。

**语法：**

```xml
<where>
    <if test="条件表达式1">
        AND 条件1
    </if>
    <if test="条件表达式2">
        AND 条件2
    </if>
    <!-- 更多条件 -->
</where>
```

**示例：**

```xml
<select id="findUsers" resultType="User">
    SELECT * FROM user
    <where>
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
</select>
```

**注意事项：**

- `<where>`标签会自动移除第一个条件前的AND或OR关键字
- 如果没有条件满足，`<where>`标签不会生成WHERE子句

#### 1.3.2 `<set>`标签

`<set>`标签用于处理SQL语句中的UPDATE子句，它会自动处理属性前的逗号。

**语法：**

```xml
<set>
    <if test="属性1 != null">
        属性1 = #{属性1},
    </if>
    <if test="属性2 != null">
        属性2 = #{属性2},
    </if>
    <!-- 更多属性 -->
</set>
```

**示例：**

```xml
<update id="updateUser">
    UPDATE user
    <set>
        <if test="username != null and username != ''">
            username = #{username},
        </if>
        <if test="password != null and password != ''">
            password = #{password},
        </if>
        <if test="email != null and email != ''">
            email = #{email},
        </if>
        <if test="status != null">
            status = #{status},
        </if>
        <if test="updatedTime != null">
            updated_time = #{updatedTime}
        </if>
    </set>
    WHERE id = #{id}
</update>
```

**注意事项：**

- `<set>`标签会自动移除最后一个属性后的逗号
- 如果没有属性需要更新，会导致SQL语法错误，因此需要确保至少有一个条件满足

#### 1.3.3 `<trim>`标签

`<trim>`标签是一个通用的标签，可以自定义处理SQL片段的前缀、后缀和多余的字符。

**语法：**

```xml
<trim prefix="前缀" prefixOverrides="需要移除的前缀" suffix="后缀" suffixOverrides="需要移除的后缀">
    SQL片段
</trim>
```

**示例：**

使用`<trim>`实现`<where>`的功能：

```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">
    <if test="username != null and username != ''">
        AND username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="status != null">
        AND status = #{status}
    </if>
</trim>
```

使用`<trim>`实现`<set>`的功能：

```xml
<trim prefix="SET" suffixOverrides=",">
    <if test="username != null and username != ''">
        username = #{username},
    </if>
    <if test="password != null and password != ''">
        password = #{password},
    </if>
</trim>
```

**注意事项：**

- `prefixOverrides`和`suffixOverrides`属性中可以指定多个需要移除的字符，用空格分隔
- `<trim>`标签比`<where>`和`<set>`标签更加灵活，可以根据需要自定义处理

### 1.4 `<foreach>`标签

`<foreach>`标签用于遍历集合或数组，生成重复的SQL片段，常用于IN查询和批量操作。

**语法：**

```xml
<foreach collection="集合属性" item="元素变量名" index="索引变量名" open="开始字符" separator="分隔符" close="结束字符">
    #{元素变量名}
</foreach>
```

**参数说明：**

- `collection`：集合或数组的属性名
- `item`：遍历过程中当前元素的变量名
- `index`：遍历过程中当前元素的索引变量名（可选）
- `open`：生成的SQL片段的开始字符
- `separator`：元素之间的分隔符
- `close`：生成的SQL片段的结束字符

**示例1：IN查询：**

```xml
<select id="findUsersByIds" resultType="User">
    SELECT * FROM user
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

**示例2：批量插入：**

```xml
<insert id="batchInsertUsers">
    INSERT INTO user (username, password, email, status, created_time)
    VALUES
    <foreach collection="users" item="user" separator=",">
        (#{user.username}, #{user.password}, #{user.email}, #{user.status}, #{user.createdTime})
    </foreach>
</insert>
```

**示例3：批量更新：**

```xml
<update id="batchUpdateUserStatus">
    UPDATE user
    SET status = #{status}
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</update>
```

**注意事项：**

- 如果传入的是List集合，`collection`属性值为`list`
- 如果传入的是数组，`collection`属性值为`array`
- 如果使用`@Param`注解指定了参数名，则`collection`属性值为注解指定的名称
- 遍历Map集合时，`index`变量名对应Map的键，`item`变量名对应Map的值

### 1.5 `<bind>`标签

`<bind>`标签用于创建一个变量并绑定到上下文中，常用于模糊查询时拼接字符串。

**语法：**

```xml
<bind name="变量名" value="表达式" />
```

**示例：**

```xml
<select id="findUsers" resultType="User">
    <bind name="usernameLike" value="'%' + username + '%'" />
    SELECT * FROM user
    WHERE username LIKE #{usernameLike}
</select>
```

**注意事项：**

- `<bind>`标签可以避免不同数据库拼接字符串的语法差异（如MySQL的CONCAT函数和Oracle的||操作符）
- 变量名在后续的SQL片段中可以直接使用`#{变量名}`引用

## 2. SQL片段复用

MyBatis允许将常用的SQL片段抽取出来，在多个地方复用，提高代码的可维护性。

### 2.1 定义SQL片段

使用`<sql>`标签定义SQL片段：

```xml
<sql id="userColumns">
    id, username, password, email, status, created_time, updated_time
</sql>

<sql id="whereCondition">
    <where>
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
</sql>
```

### 2.2 引用SQL片段

使用`<include>`标签引用已定义的SQL片段：

```xml
<select id="findUsers" resultType="User">
    SELECT <include refid="userColumns" /> FROM user
    <include refid="whereCondition" />
</select>

<select id="findUserById" resultType="User">
    SELECT <include refid="userColumns" /> FROM user
    WHERE id = #{id}
</select>
```

### 2.3 带参数的SQL片段

SQL片段还可以接受参数，提高灵活性：

```xml
<sql id="orderBy">
    <if test="orderBy != null and orderBy != ''">
        ORDER BY ${orderBy} ${orderDirection}
    </if>
</sql>

<select id="findUsers" resultType="User">
    SELECT <include refid="userColumns" /> FROM user
    <include refid="whereCondition" />
    <include refid="orderBy" />
</select>
```

**注意事项：**

- SQL片段的ID必须唯一
- 可以在不同的Mapper映射文件中定义同名的SQL片段，引用时会优先使用当前文件中的定义
- 带参数的SQL片段中，如果参数需要作为列名或排序方向，需要使用`${}`而不是`#{}`

## 3. 动态SQL的高级用法

### 3.1 嵌套条件

动态SQL标签可以嵌套使用，实现更复杂的条件判断：

```xml
<select id="findUsers" resultType="User">
    SELECT * FROM user
    <where>
        <if test="user != null">
            <if test="user.username != null and user.username != ''">
                AND username LIKE CONCAT('%', #{user.username}, '%')
            </if>
            <if test="user.status != null">
                AND status = #{user.status}
            </if>
        </if>
        <if test="dateRange != null">
            <if test="dateRange.startDate != null">
                AND created_time >= #{dateRange.startDate}
            </if>
            <if test="dateRange.endDate != null">
                AND created_time <= #{dateRange.endDate}
            </if>
        </if>
    </where>
</select>
```

### 3.2 动态SQL与注解

MyBatis也支持在注解中使用动态SQL，但语法相对复杂，通常只用于简单的场景：

```java
@Select("<script>" +
        "SELECT * FROM user " +
        "<where>" +
        "<if test='username != null and username != ""'>" +
        "AND username LIKE CONCAT('%', #{username}, '%') " +
        "</if>" +
        "<if test='status != null'>" +
        "AND status = #{status} " +
        "</if>" +
        "</where>" +
        "</script>")
List<User> findUsers(@Param("username") String username, @Param("status") Integer status);
```

**注意事项：**

- 注解中的动态SQL需要使用`<script>`标签包裹
- 字符串中的引号需要转义
- 复杂的动态SQL推荐使用XML映射文件

### 3.3 动态表名

有时候需要根据条件动态指定表名，可以使用动态SQL实现：

```xml
<select id="findData" resultType="Map">
    SELECT * FROM ${tableName}
    <where>
        <if test="condition != null">
            AND ${columnName} = #{value}
        </if>
    </where>
</select>
```

**注意事项：**

- 动态表名和列名必须使用`${}`而不是`#{}`
- 需要确保表名和列名的安全性，避免SQL注入
- 可以使用白名单验证确保传入的表名和列名是合法的

## 4. 最佳实践

### 4.1 保持动态SQL的简洁性

- 避免在一个SQL语句中使用过多的动态SQL标签，导致代码难以维护
- 复杂的条件判断可以拆分为多个SQL语句或使用SQL片段复用
- 合理使用`<choose>`标签替代多个`<if>`标签的嵌套

### 4.2 避免SQL注入

- 始终使用`#{}`进行参数绑定，而不是`${}`
- 必须使用`${}`时（如动态表名、列名），需要进行严格的验证
- 避免将用户输入直接用于动态SQL的条件判断

### 4.3 性能优化

- 避免在循环中执行SQL语句，尽量使用批量操作
- 合理使用索引，避免全表扫描
- 动态SQL生成后，MyBatis会缓存SQL语句，相同条件下次执行时会直接使用缓存

### 4.4 调试技巧

- 使用MyBatis的日志功能查看生成的SQL语句和参数值
- 在开发环境中，可以开启`logImpl`为`STDOUT_LOGGING`或`LOG4J`
- 复杂的动态SQL可以先在数据库中测试生成的SQL语句

## 5. 常见问题及解决方案

### 5.1 SQL语法错误

**问题描述：**
执行动态SQL时出现语法错误，如`WHERE`关键字后没有条件、`SET`关键字后没有属性等。

**解决方案：**

- 使用`<where>`标签替代`WHERE 1=1`
- 使用`<set>`标签处理UPDATE语句
- 确保至少有一个条件满足，或在代码层面进行验证

### 5.2 参数绑定错误

**问题描述：**
参数绑定失败，如`There is no getter for property named 'xxx' in 'class java.lang.Integer'`。

**解决方案：**

- 检查参数名是否与Java对象的属性名一致
- 检查是否使用了`@Param`注解指定参数名
- 检查集合或数组的参数名是否正确（`list`、`array`或`@Param`指定的名称）

### 5.3 动态表名导致的问题

**问题描述：**
使用动态表名时出现错误，如表名包含特殊字符或关键字。

**解决方案：**

- 对表名进行验证，确保是合法的表名
- 使用数据库的表名引用方式，如MySQL的反引号（`）包裹表名
- 避免使用用户输入直接作为表名

### 5.4 模糊查询的数据库兼容性问题

**问题描述：**
不同数据库的字符串拼接语法不同，导致模糊查询在不同数据库中表现不一致。

**解决方案：**

- 使用`<bind>`标签统一处理字符串拼接
- 或根据不同的数据库使用条件判断：

```xml
<if test="_databaseId == 'mysql'">
    AND username LIKE CONCAT('%', #{username}, '%')
</if>
<if test="_databaseId == 'oracle'">
    AND username LIKE '%' || #{username} || '%'
</if>
```

## 6. 总结

MyBatis的动态SQL是其最强大的特性之一，它提供了丰富的标签来动态生成SQL语句，包括`<if>`、`<choose>`、`<when>`、`<otherwise>`、`<trim>`、`<where>`、`<set>`、`<foreach>`和`<bind>`等。

通过合理使用这些动态SQL标签，可以编写出更加简洁、灵活和可维护的SQL代码，同时避免了手动拼接SQL语句可能带来的错误和安全问题。

在实际开发中，需要注意以下几点：

- 保持动态SQL的简洁性和可读性
- 避免SQL注入，始终使用`#{}`进行参数绑定
- 合理使用SQL片段复用，提高代码的可维护性
- 注意数据库兼容性问题
- 充分利用MyBatis的日志功能进行调试

掌握MyBatis的动态SQL特性，可以大大提高数据库操作的灵活性和效率，是每个MyBatis开发者必须掌握的核心技能之一。

## 参考资料

- [MyBatis官方文档 - 动态SQL](https://mybatis.org/mybatis-3/zh/dynamic-sql.html)
- [MyBatis动态SQL详解](https://www.baeldung.com/mybatis-dynamic-sql)
- [MyBatis动态SQL最佳实践](https://www.cnblogs.com/fangjian0423/p/mybatis-dynamic-sql-best-practice.html)

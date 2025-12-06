---
title: Discriminator鉴定器 源码解析
category: mybatis
tag:
  - mybatis
  - Discriminator
  - 源码
description: Discriminator鉴定器
date: 2024-12-30

icon: article

isOriginal: true
---

> `Discriminator`是`mybatis`中的一个类，用于识别一个对象，然后根据这个对象的属性值来决定使用哪个`resultMap`来映射这个对象。

## 鉴定器的使用

如下面的例子`selectVehicles`，方法返回类型根据`vehicle_type`来决定使用哪个`resultMap`来映射这个对象。如果`vehicle_type`的值为1，则使用`Car`的`resultMap`来映射这个对象，如果`vehicle_type`的值为2，则使用`Truck`的`resultMap`来映射这个对象。

```xml
  <resultMap
    type="org.apache.ibatis.submitted.discriminator.Vehicle"
    id="vehicleResult">
    <id property="id" column="id" />
    <result property="maker" column="maker" />
    <discriminator javaType="int" column="vehicle_type">
      <case value="1"
        resultType="org.apache.ibatis.submitted.discriminator.Car">
        <result property="doorCount" column="door_count" />
      </case>
      <case value="2"
        resultType="org.apache.ibatis.submitted.discriminator.Truck">
        <result property="carryingCapacity"
          column="carrying_capacity" />
      </case>
    </discriminator>
  </resultMap>

  <select id="selectVehicles" resultMap="vehicleResult"><![CDATA[
    select * from vehicle order by id
  ]]></select>
```

测试代码：

```java
try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
    Mapper mapper = sqlSession.getMapper(Mapper.class);
    List<Vehicle> vehicles = mapper.selectVehicles();
    assertEquals(Car.class, vehicles.get(0).getClass());
    assertEquals(Integer.valueOf(5), ((Car)vehicles.get(0)).getDoorCount());
    assertEquals(Truck.class, vehicles.get(1).getClass());
    assertEquals(Float.valueOf(1.5f), ((Truck)vehicles.get(1)).getCarryingCapacity());
}
```

## 源码解析

在处理结果集映射时，通过`resolveDiscriminatedResultMap`方法来获取实际的`resultMap`。方法定义见下：

```java
public ResultMap resolveDiscriminatedResultMap(ResultSet rs, ResultMap resultMap, String columnPrefix) throws SQLException {
    Set<String> pastDiscriminators = new HashSet<>();
    Discriminator discriminator = resultMap.getDiscriminator();
    while (discriminator != null) {
        final Object value = getDiscriminatorValue(rs, discriminator, columnPrefix);
        final String discriminatedMapId = discriminator.getMapIdFor(String.valueOf(value));
        if (configuration.hasResultMap(discriminatedMapId)) {
        resultMap = configuration.getResultMap(discriminatedMapId);
        Discriminator lastDiscriminator = discriminator;
        discriminator = resultMap.getDiscriminator();
        if (discriminator == lastDiscriminator || !pastDiscriminators.add(discriminatedMapId)) {
            break;
        }
        } else {
            break;
        }
    }
    return resultMap;
}
 
```

1. 首先获取当前的结果映射中是否存在鉴定器，如果存在，则通过`getDiscriminatorValue`方法获取鉴定器的值
2. 然后通过`discriminator.getMapIdFor`方法获取鉴定器的映射的`resultMap`的id
3. 然后通过`configuration.getResultMap`方法获取鉴定器的映射的`resultMap`

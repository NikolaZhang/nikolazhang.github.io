---
title: ReentrantLock深入解析与最佳实践
tag:
  - ReentrantLock
  - 并发编程
  - 线程同步
  - Java并发
category: java
description: 深入解析ReentrantLock原理、使用场景、源码分析及最佳实践
date: 2025-12-04

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

# ReentrantLock深入解析与最佳实践

## 1. 什么是ReentrantLock

ReentrantLock是Java并发包中的一种可重入互斥锁，提供了比内置synchronized关键字更灵活的线程同步机制。它允许线程重新获取已经持有的锁，从而避免了死锁问题。

### 1.1 ReentrantLock的核心概念

- **互斥性(Mutex)**：同一时间只能有一个线程持有锁
- **可重入性(Reentrancy)**：线程可以多次获取同一把锁，每次获取锁时计数器加1，释放时减1
- **公平/非公平模式**：决定线程获取锁的顺序
- **条件变量(Condition)**：提供线程间的通信机制
- **可中断性**：支持响应中断的锁获取操作

### 1.2 ReentrantLock与synchronized的对比

| 特性 | ReentrantLock | synchronized |
|------|---------------|--------------|
| 可重入性 | 支持 | 支持 |
| 公平性 | 可配置 | 非公平 |
| 锁获取方式 | 可中断、超时、尝试获取 | 不可中断 |
| 条件变量 | 支持多个条件变量 | 每个锁只有一个条件变量 |
| 性能 | 竞争激烈时性能更优 | 简单场景性能较好 |
| API风格 | 显式调用lock/unlock | 隐式获取和释放 |

### 1.3 ReentrantLock的基本用法

```java
// 创建ReentrantLock实例(默认非公平模式)
ReentrantLock lock = new ReentrantLock();
// 或创建公平模式的锁
// ReentrantLock lock = new ReentrantLock(true);

try {
    // 获取锁
    lock.lock();
    // 执行临界区代码
    // ...
} finally {
    // 释放锁(必须在finally中确保锁被释放)
    lock.unlock();
}
```

## 2. ReentrantLock的实际应用场景

### 2.1 高级锁控制场景

```java
// 支持中断的锁获取
ReentrantLock lock = new ReentrantLock();

Thread thread = new Thread(() -> {
    try {
        // 支持中断的锁获取
        lock.lockInterruptibly();
        // 执行临界区代码
    } catch (InterruptedException e) {
        // 处理中断
        Thread.currentThread().interrupt();
    } finally {
        if (lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }
});

// 尝试获取锁(非阻塞)
if (lock.tryLock()) {
    try {
        // 执行临界区代码
    } finally {
        lock.unlock();
    }
}

// 带超时的锁获取
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // 执行临界区代码
    } finally {
        lock.unlock();
    }
}
```

### 2.2 多条件变量场景

```java
ReentrantLock lock = new ReentrantLock();
Condition notEmpty = lock.newCondition();
Condition notFull = lock.newCondition();

// 生产者-消费者模式
class BoundedQueue<T> {
    private final T[] items;
    private int takeIndex, putIndex, count;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();

    @SuppressWarnings("unchecked")
    public BoundedQueue(int capacity) {
        items = (T[]) new Object[capacity];
    }

    public void put(T x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length)
                notFull.await();
            items[putIndex] = x;
            if (++putIndex == items.length) putIndex = 0;
            ++count;
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }

    public T take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0)
                notEmpty.await();
            T x = items[takeIndex];
            items[takeIndex] = null;
            if (++takeIndex == items.length) takeIndex = 0;
            --count;
            notFull.signal();
            return x;
        } finally {
            lock.unlock();
        }
    }
}
```

## 3. ReentrantLock的AQS实现原理

### 3.1 AQS在ReentrantLock中的应用

ReentrantLock基于AQS(AbtractQueuedSynchronizer)实现，通过重写AQS的核心方法来实现可重入锁的功能。

- **同步状态**：表示锁的重入次数，0表示锁未被持有
- **独占模式**：ReentrantLock是独占锁，同一时间只能有一个线程持有锁
- **等待队列**：当锁被占用时，其他线程会被放入AQS的等待队列

### 3.2 公平与非公平模式的实现差异

#### 3.2.1 非公平模式(默认)

```java
// 非公平模式获取锁
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    // 1. 锁未被持有，直接获取
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    // 2. 锁已被当前线程持有，重入
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    // 3. 锁被其他线程持有，获取失败
    return false;
}
```

#### 3.2.2 公平模式

```java
// 公平模式获取锁
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        // 与非公平模式的区别：需要检查等待队列中是否有线程在等待
        if (!hasQueuedPredecessors() &&
            compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0)
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}
```

## 4. ReentrantLock的源码分析

### 4.1 ReentrantLock的类结构

```java
public class ReentrantLock implements Lock, java.io.Serializable {
    // 内部同步器抽象类
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // ...
    }
    
    // 非公平同步器实现
    static final class NonfairSync extends Sync {
        // ...
    }
    
    // 公平同步器实现
    static final class FairSync extends Sync {
        // ...
    }
    
    // 构造方法
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
    
    // Lock接口方法实现
    public void lock() {
        sync.acquire(1);
    }
    
    public void unlock() {
        sync.release(1);
    }
    
    // ...
}
```

### 4.2 锁的获取与释放流程

#### 4.2.1 lock()方法流程

```mermaid
flowchart TD
    A[调用lock()方法] --> B[sync.acquire(1)]
    B --> C{tryAcquire(1)是否成功?}
    C -->|是| D[获取锁成功]
    C -->|否| E[加入等待队列]
    E --> F{线程是否需要阻塞?}
    F -->|是| G[阻塞线程]
    F -->|否| C
    G --> H{被唤醒或中断?}
    H --> C
```

#### 4.2.2 unlock()方法流程

```mermaid
flowchart TD
    A[调用unlock()方法] --> B[sync.release(1)]
    B --> C{tryRelease(1)是否成功?}
    C -->|是| D[锁完全释放]
    C -->|否| E[锁仍被持有]
    D --> F{等待队列是否有线程?}
    F -->|是| G[唤醒等待队列中的线程]
    F -->|否| H[释放完成]
    G --> H
    E --> H
```

### 4.3 Condition的实现原理

```java
// Condition的实现类
public class ConditionObject implements Condition, java.io.Serializable {
    // 条件等待队列
    private transient Node firstWaiter;
    private transient Node lastWaiter;
    
    // await()方法实现
    public final void await() throws InterruptedException {
        if (Thread.interrupted())
            throw new InterruptedException();
        // 加入条件等待队列
        Node node = addConditionWaiter();
        // 释放当前持有的锁
        int savedState = fullyRelease(node);
        int interruptMode = 0;
        // 检查是否在同步队列中
        while (!isOnSyncQueue(node)) {
            // 阻塞线程
            LockSupport.park(this);
            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                break;
        }
        // 重新获取锁
        if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
            interruptMode = REINTERRUPT;
        // 清理条件等待队列
        if (node.nextWaiter != null) // clean up if cancelled
            unlinkCancelledWaiters();
        if (interruptMode != 0)
            reportInterruptAfterWait(interruptMode);
    }
    
    // signal()方法实现
    public final void signal() {
        if (!isHeldExclusively())
            throw new IllegalMonitorStateException();
        Node first = firstWaiter;
        if (first != null)
            doSignal(first);
    }
}
```

## 5. ReentrantLock的最佳实践

### 5.1 必须在finally中释放锁

```java
// 错误示例
lock.lock();
try {
    // 执行代码
} catch (Exception e) {
    // 处理异常
}
// 锁可能没有被释放

// 正确示例
lock.lock();
try {
    // 执行代码
} catch (Exception e) {
    // 处理异常
} finally {
    // 确保锁被释放
    lock.unlock();
}
```

### 5.2 合理选择公平与非公平模式

- **非公平模式**：性能更好，适合大多数场景
- **公平模式**：保证线程获取锁的顺序，避免饥饿，但性能较差

### 5.3 避免死锁

```java
// 错误示例：锁顺序不一致导致死锁
public class DeadlockExample {
    private static final ReentrantLock lock1 = new ReentrantLock();
    private static final ReentrantLock lock2 = new ReentrantLock();
    
    public static void thread1() {
        lock1.lock();
        try {
            // 模拟处理时间
            Thread.sleep(100);
            lock2.lock();
            try {
                // 执行代码
            } finally {
                lock2.unlock();
            }
        } finally {
            lock1.unlock();
        }
    }
    
    public static void thread2() {
        lock2.lock(); // 注意锁的顺序与thread1相反
        try {
            Thread.sleep(100);
            lock1.lock();
            try {
                // 执行代码
            } finally {
                lock1.unlock();
            }
        } finally {
            lock2.unlock();
        }
    }
}

// 正确示例：统一锁的获取顺序
public class NoDeadlockExample {
    private static final ReentrantLock lock1 = new ReentrantLock();
    private static final ReentrantLock lock2 = new ReentrantLock();
    
    public static void thread1() {
        lock1.lock();
        try {
            lock2.lock();
            try {
                // 执行代码
            } finally {
                lock2.unlock();
            }
        } finally {
            lock1.unlock();
        }
    }
    
    public static void thread2() {
        lock1.lock(); // 与thread1保持相同的锁获取顺序
        try {
            lock2.lock();
            try {
                // 执行代码
            } finally {
                lock2.unlock();
            }
        } finally {
            lock1.unlock();
        }
    }
}
```

### 5.4 合理使用条件变量

```java
// 错误示例：不检查条件直接await
condition.await(); // 可能导致虚假唤醒

// 正确示例：在循环中检查条件
while (!conditionSatisfied()) {
    condition.await();
}

// 示例：使用条件变量实现生产者-消费者
class ProducerConsumer {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();
    private final Queue<Integer> queue = new LinkedList<>();
    private final int capacity = 10;
    
    public void produce(int value) throws InterruptedException {
        lock.lock();
        try {
            // 循环检查队列是否已满
            while (queue.size() == capacity) {
                notFull.await(); // 队列满，等待
            }
            queue.offer(value);
            notEmpty.signal(); // 通知消费者队列非空
        } finally {
            lock.unlock();
        }
    }
    
    public int consume() throws InterruptedException {
        lock.lock();
        try {
            // 循环检查队列是否为空
            while (queue.isEmpty()) {
                notEmpty.await(); // 队列空，等待
            }
            int value = queue.poll();
            notFull.signal(); // 通知生产者队列非满
            return value;
        } finally {
            lock.unlock();
        }
    }
}
```

### 5.5 性能优化建议

1. **减少锁的持有时间**：只在必要的代码段使用锁
2. **避免嵌套锁**：嵌套锁增加死锁风险和调试难度
3. **使用适当的锁粒度**：根据实际情况选择粗粒度或细粒度锁
4. **考虑使用读写锁**：在读多写少的场景下，使用ReadWriteLock性能更好
5. **避免在锁保护的代码中执行耗时操作**：如IO操作、网络请求等

## 6. ReentrantLock的常见问题与解决方案

### 6.1 锁未释放导致死锁

**问题**：忘记在finally中释放锁，导致锁永远被持有

**解决方案**：始终在finally块中释放锁

### 6.2 重入次数溢出

**问题**：线程多次获取锁导致重入次数超过int最大值

**解决方案**：避免过度重入，合理设计代码结构

### 6.3 条件变量使用不当导致虚假唤醒

**问题**：直接调用await()而不检查条件，可能导致虚假唤醒

**解决方案**：在循环中检查条件，使用while而不是if

### 6.4 公平锁性能问题

**问题**：公平锁在高竞争场景下性能较差

**解决方案**：除非有特殊需求，否则使用默认的非公平锁

### 6.5 死锁

**问题**：多个线程互相等待对方持有的锁

**解决方案**：
- 统一锁的获取顺序
- 使用带超时的锁获取
- 使用LockSupport检测和避免死锁

## 7. ReentrantLock在框架中的应用

### 7.1 ReentrantLock在Java并发包中的应用

- **LinkedBlockingQueue**：使用ReentrantLock实现队列的线程安全
- **ConcurrentHashMap**：在JDK1.8之前使用ReentrantLock分段锁
- **CopyOnWriteArrayList**：内部使用ReentrantLock保护数组的修改操作

### 7.2 ReentrantLock在Spring框架中的应用

```java
// Spring事务管理中的应用
public abstract class AbstractPlatformTransactionManager implements PlatformTransactionManager, Serializable {
    private final ReentrantLock lock = new ReentrantLock();
    
    protected Object doGetTransaction() {
        lock.lock();
        try {
            // 获取事务信息
            // ...
        } finally {
            lock.unlock();
        }
    }
}
```

## 8. 总结与重要知识点回顾

### 8.1 ReentrantLock的核心价值

ReentrantLock提供了比synchronized更灵活、更强大的线程同步机制，支持可重入性、公平性配置、响应中断的锁获取、超时获取锁、多个条件变量等高级特性。

### 8.2 重要知识点提炼

- **可重入性**：线程可以多次获取同一把锁，必须对应相同次数的释放
- **公平与非公平**：公平模式保证线程获取锁的顺序，非公平模式性能更好
- **条件变量**：提供线程间的通信机制，必须在锁的保护下使用
- **AQS实现**：基于AQS的独占模式实现，通过同步状态表示锁的重入次数
- **最佳实践**：始终在finally中释放锁，使用循环检查条件变量，避免死锁

### 8.3 使用建议

1. 在简单同步场景下，优先使用synchronized，代码更简洁
2. 在需要高级锁控制特性时，使用ReentrantLock
3. 始终在finally块中释放锁
4. 使用条件变量时，在循环中检查条件
5. 除非有特殊需求，否则使用默认的非公平锁

ReentrantLock是Java并发编程中重要的同步工具，掌握其原理和最佳实践对于编写高性能、高可靠性的并发程序至关重要。
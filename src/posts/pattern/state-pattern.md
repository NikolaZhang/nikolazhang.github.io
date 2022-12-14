---
isOriginal: true
title: state pattern
date: 2018-12-13


tag:
  - state pattern
category: 技术
description: 状态模式的实现方法
image: http://image.nikolazhang.top/wallhaven-nrwq11.jpg
---

> 状态模式，这里的状态模式和EDA中的状态设计方法相似，但又是不同的。下面这句话是网上的解释：类的行为是基于它的状态改变的。这种类型的设计模式属于行为型模式。在状态模式中，我们创建表示各种状态的对象和一个行为随着状态对象改变而改变的context对象。【菜鸟教程】

<!--more-->
总之，我对这个解释有点不满意，甚至对这个模式都有点质疑了。姑且我们先照着定义做个例子。

当我们汽车厂生产车的时候是这样的，先启动生产线，再装备原料运行起来，最后下班停止。总的的来说就三个状态start run stop。涉及到的行为动作有启动，运行，关闭。
## 一个动作接口，方便以后增加更多的行为
```
package state;

/************************************************
 *@ClassName : Action
 *@Description : TODO
 *@Author : NikolaZhang
 *@Date : 【2018/12/13 0013 21:06】
 *@Version : 1.0.0
 *************************************************/

public interface Action {
    void doSomething(Context context);
}

```
## 启动生产线是这样的
我们只有在生产线停止状态时，才会启动我们的生产线，其余状态启动，明显没有必要。
```
package state;

/************************************************
 *@ClassName : StartAction
 *@Description : TODO
 *@Author : NikolaZhang
 *@Date : 【2018/12/13 0013 21:10】
 *@Version : 1.0.0
 *************************************************/

public class StartAction implements Action {

    @Override
    public void doSomething(Context context) {
        String state = context.getContex();
        System.out.println("ooo当前状态为："+state);
        if("stop".equals(state)){
            System.out.println("生产线已经启动，准备生产了。。。");
            context.setContex("start");
        }else{
            System.out.println("生产线已经启动，不需要再启动");
        }
    }
}
```

## 测试
```
package state;

/************************************************
 *@ClassName : Test
 *@Description : TODO
 *@Author : NikolaZhang
 *@Date : 【2018/12/13 0013 21:26】
 *@Version : 1.0.0
 *************************************************/

public class Test {
    public static void main(String[] args) {
        Context context = new Context("stop");
        Action startAction = new StartAction();
        Action runAction = new RunAction();
        Action stopAction = new StopAction();

        startAction.doSomething(context);
        runAction.doSomething(context);
        stopAction.doSomething(context);
        runAction.doSomething(context);
    }
}
```

## 结果
![结果](/images/article/181213/state.png)

无论是设计模式之禅上的context调用动作，还是菜鸟上的多个动作对象（本例）。都觉得有点不完美。我觉得首先动作对象要有一个，而且应该是环境对象改变后，由动作对象触发行为。

于是我改造了一下，增加了一个ActionManage类。将其他动作类的冗余代码删掉。
```
package state;

/************************************************
 *@ClassName : ActionMange
 *@Description : TODO
 *@Author : NikolaZhang
 *@Date : 【2018/12/13 0013 22:18】
 *@Version : 1.0.0
 *************************************************/

public class ActionManage {
    private Action startAction = new StartAction();
    private Action runAction = new RunAction();
    private Action stopAction = new StopAction();
    private Context context;

    public void doSomething(){
        switch (context.getContex()) {
            case "stop" : startAction.doSomething(context);break;
            case "start" : runAction.doSomething(context);break;
            case "run" : stopAction.doSomething(context);break;
        }
    }

    public ActionManage(Context context) {
        this.context = context;
    }
}
```

**测试**
```
package state;

/************************************************
 *@ClassName : Test
 *@Description : TODO
 *@Author : NikolaZhang
 *@Date : 【2018/12/13 0013 21:26】
 *@Version : 1.0.0
 *************************************************/

public class Test {
    public static void main(String[] args) {
        Context context = new Context("stop");
        ActionManage actionManage = new ActionManage(context);
        actionManage.doSomething();
        actionManage.doSomething();
        actionManage.doSomething();
        actionManage.doSomething();
    }
}
```

**结果**
![结果](/images/article/181213/state1.png)

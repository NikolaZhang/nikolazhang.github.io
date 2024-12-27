import{_ as o}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as s,o as a,c as l,a as e,d as n,b as d}from"./app-CYrfdzXE.js";const i={},u={href:"http://www.cs.rochester.edu/u/scott/synchronization/%E3%80%82",target:"_blank",rel:"noopener noreferrer"};function p(m,r){const t=s("ExternalLinkIcon");return a(),l("div",null,[r[4]||(r[4]=e("h2",{id:"node",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#node","aria-hidden":"true"},"#"),n(" Node")],-1)),r[5]||(r[5]=e("p",null,[n("等待队列节点类。"),e("br"),n(' 等待队列是 "CLH"（Craig、Landin 和 Hagersten）锁队列的一种变体。CLH 锁通常用于自旋锁。我们将其用于阻塞同步器，但使用了相同的基本策略，即在线程节点的前置节点中保存线程的部分控制信息。每个节点中都有一个 "状态 "字段，用于跟踪线程是否应该阻塞。当一个节点的前节点释放时，就会发出信号。除此之外，队列的每个节点都是一个特定通知式的监视器，监视着一个等待中的线程。状态字段并不控制线程是否被授予锁等。线程可以尝试获取队列中的第一个锁。但是，排在第一位并不能保证成功；它只是给予了竞争的权利。因此，当前被释放的竞争线程可能需要重新等待。'),e("br"),n(" 要向 CLH 锁注入队列，可以原子方式将其拼接为新的尾部。要取消queue，只需设置头部字段即可。")],-1)),e("p",null,[r[1]||(r[1]=n('插入 CLH 队列只需要对 "尾部 "进行一次原子操作，因此从未入队到入队有一个简单的原子分界点。同样，去队列也只需要更新 "头"。不过，节点需要花费更多的精力来确定谁是它们的后继者，部分原因是要处理由于超时和中断而可能造成的取消。')),r[2]||(r[2]=e("br",null,null,-1)),r[3]||(r[3]=n(' prev "链接（在最初的 CLH 锁中没有使用）主要用于处理取消。如果一个节点被取消，它的后继节点（通常）会重新链接到未被取消的前置节点。关于自旋锁中类似机制的解释，请参阅 Scott 和 Scherer 的论文 ')),e("a",u,[r[0]||(r[0]=n("http://www.cs.rochester.edu/u/scott/synchronization/。")),d(t)])]),r[6]||(r[6]=e("p",null,[n('我们还使用 "下一个 "链接来实现阻塞机制。每个节点的线程 ID 都保存在自己的节点中，因此前节点会通过遍历下一个链接来确定下一个节点是哪个线程，从而发出唤醒信号。后继节点的确定必须避免与新排队的节点竞争，以设置其前辈节点的 "下一个 "字段。必要时，可以通过在节点的后继者似乎为空时从原子更新的 "尾部 "向后检查来解决这个问题。(或者换一种说法，"下一个链接 "是一种优化，因此我们通常不需要向后扫描）。'),e("br"),n(" 取消为基本算法引入了一些保守性。因为我们必须轮询其他节点的取消，所以我们可能会忽略被取消的节点是在我们前面还是后面。为了解决这个问题，我们总是在取消节点时取消后继节点，让它们稳定在一个新的前置节点上，除非我们能找到一个未取消的前置节点来承担这个责任。"),e("br"),n(" CLH 队列需要一个虚拟头节点来启动。但我们不会在构建时创建它们，因为如果从来没有发生过争用，那就白费力气了。相反，我们会在第一次出现争用时构建节点并设置头部和尾部指针。")],-1)),r[7]||(r[7]=e("p",null,"条件只需链接简单（非并发）链接队列中的节点，因为它们只有在被独家持有时才会被访问。等待时，节点被插入条件队列。发出信号时，节点被转移到主队列。状态字段的特殊值用于标记节点在哪个队列上。",-1)),r[8]||(r[8]=e("h2",{id:"addwaiter",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#addwaiter","aria-hidden":"true"},"#"),n(" addWaiter")],-1)),r[9]||(r[9]=e("p",null,[e("img",{src:"https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-aqs/20240229213457.png",alt:"20240229213457"})],-1))])}const g=o(i,[["render",p],["__file","1-aqs.html.vue"]]);export{g as default};

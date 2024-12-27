import{_ as p}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,o as i,c,e,a,d as s,b as o}from"./app-CYrfdzXE.js";const r={},u={href:"https://blog.csdn.net/ns_code/article/details/17377197",target:"_blank",rel:"noopener noreferrer"},d={href:"https://www.jianshu.com/p/ef8de88b1343",target:"_blank",rel:"noopener noreferrer"},k={href:"https://blog.csdn.net/jjavaboy/article/details/77164474",target:"_blank",rel:"noopener noreferrer"};function v(m,n){const t=l("ExternalLinkIcon");return i(),c("div",null,[n[22]||(n[22]=e('<blockquote><p>整理了一下线程安全以及volatile相关的知识</p></blockquote><h2 id="并发与并行" tabindex="-1"><a class="header-anchor" href="#并发与并行" aria-hidden="true">#</a> 并发与并行</h2><p>并发: <code>多个任务在同一时间段内执行</code>. CPU会为每个任务分配时间片, 每个任务各自的时间片耗尽时会切换到其他任务上去. 这个过程给人的感觉是多个任务同时在执行, 实际上对当前cpu来说只有一个任务执行, 其他任务均被挂起.<br> cpu在时间片耗尽进行上下文切换时, 同样也需要时间, 因此虽然并发有利于提高效率, 但也是在具体情境下的. 那什么不直接一个个任务执行呢? 别忘了系统的一些进程都是需要cpu时间的, 况且系统启动后有些进程就不能结束, 因此时间分配是合理的.</p><p>并行: <code>多个任务同时执行</code>. 多个cpu上不同的任务同时执行, 这是真正的并行. 但是cpu的核心数往往小于线程的数量. 因此(高)并发才是最常见的场景.</p><h2 id="线程安全" tabindex="-1"><a class="header-anchor" href="#线程安全" aria-hidden="true">#</a> 线程安全</h2><p>线程安全问题的根源在于对共享资源(可以被多个线程读写)操作不当.</p><p>java内存模型中, 所有的变量都存放在主内存中, 当线程使用变量时, 需要将变量复制到自己的工作内存中, 并在工作内存中进行变量读写, 处理完成之后更新主内存. 如果线程A, B同时读写一个共享变量, 这个共享变量的值在他们各自的工作内存中结果可能不相同.</p><h3 id="内存中变量的原子操作" tabindex="-1"><a class="header-anchor" href="#内存中变量的原子操作" aria-hidden="true">#</a> 内存中变量的原子操作</h3><p>首先介绍一下主内存和工作内存之间的原子操作.</p><p>作用于主内存:</p><ul><li>lock 锁定，将一个变量标识为线程独占状态</li><li>unlock 解锁，将锁定状态的变量解除锁定，释放后的变量才可以被其他变量锁定</li><li>read 读取，将变量从主内存传输到线程的工作内存中，待之后的load加载</li><li>write 写入，把store操作从工作内存中得到的变量值写入主内存的变量中</li></ul><p>作用于工作内存:</p><ul><li>load 加载，将read后从主内存得到的变量值加载到工作内存的变量副本中</li><li>use 使用，把工作内存中的一个变量值传递给字节码执行引擎，等待字节码指令使用</li><li>assign 赋值，把一个从执行引擎接收到的值赋值给工作内存的变量</li><li>store 存储，把工作内存中一个变量的值传送到主内存中，以便随后的write使用</li></ul>',13)),a("p",null,[n[1]||(n[1]=s("另外还有关于这8种操作的限制规则(")),a("a",u,[n[0]||(n[0]=s("原文链接")),o(t)]),n[2]||(n[2]=s("):")),n[3]||(n[3]=a("br",null,null,-1)),n[4]||(n[4]=s("     1、不允许read和load、store和write操作之一单独出现，以上两个操作必须按顺序执行，但没有保证必须连续执行，也就是说，read与load之间、store与write之间是可插入其他指令的。")),n[5]||(n[5]=a("br",null,null,-1)),n[6]||(n[6]=s("     2、不允许一个线程丢弃它的最近的assign操作，即变量在工作内存中改变了之后必须把该变化同步回主内存。")),n[7]||(n[7]=a("br",null,null,-1)),n[8]||(n[8]=s("     3、不允许一个线程无原因地（没有发生过任何assign操作）把数据从线程的工作内存同步回主内存中。")),n[9]||(n[9]=a("br",null,null,-1)),n[10]||(n[10]=s("     4、一个新的变量只能从主内存中“诞生”，不允许在工作内存中直接使用一个未被初始化（load或assign）的变量，换句话说就是对一个变量实施use和store操作之前，必须先执行过了assign和load操作。")),n[11]||(n[11]=a("br",null,null,-1)),n[12]||(n[12]=s("     5、一个变量在同一个时刻只允许一条线程对其执行lock操作，但lock操作可以被同一个条线程重复执行多次，多次执行lock后，只有执行相同次数的unlock操作，变量才会被解锁。")),n[13]||(n[13]=a("br",null,null,-1)),n[14]||(n[14]=s("     6、如果对一个变量执行lock操作，将会清空工作内存中此变量的值，在执行引擎使用这个变量前，需要重新执行load或assign操作初始化变量的值。")),n[15]||(n[15]=a("br",null,null,-1)),n[16]||(n[16]=s("     7、如果一个变量实现没有被lock操作锁定，则不允许对它执行unlock操作，也不允许去unlock一个被其他线程锁定的变量。")),n[17]||(n[17]=a("br",null,null,-1)),n[18]||(n[18]=s("     8、对一个变量执行unlock操作之前，必须先把此变量同步回主内存（执行store和write操作）。"))]),n[23]||(n[23]=e(`<p>以下面的代码为例:</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">int</span> x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        x<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当一个线程执行<code>x++</code>时, 首先通过<code>read, load</code>从主内存中获取x载入到工作内存中, 线程执行引擎通过<code>use</code>指令获取工作内存中的x的值. 执行完<code>x+1</code>后将值通过<code>assign</code>写入工作内存x变量. 之后工作内存通过<code>store, write</code>将值写入主内存.</p><p>结合以上我们可以知道每个线程实际操作的都是各自的工作内存, 且无法访问其他线程的工作内存, 唯一的数据同步只能通过主内存. 这也就是共享变量内存可见性问题.</p><h3 id="synchronized" tabindex="-1"><a class="header-anchor" href="#synchronized" aria-hidden="true">#</a> synchronized</h3><p>使用synchronized进行加锁可以解决共享变量内存可见性问题. 其作用是,<br> 进入同步代码块时: 将代码块中的共享变量从工作内存中清除, 从而使线程必须从主内存中获取;<br> 同步代码块执行结束时: 将工作内存中的变量值刷新到主内存中.</p><h3 id="volatile" tabindex="-1"><a class="header-anchor" href="#volatile" aria-hidden="true">#</a> volatile</h3><p>使用synchronized关键字会引起线程上下文切换增加线程调度开销. volatile关键字可以确保对一个变量的更新对其他线程立马可见.</p><p>当写一个 volatile 变量时，JMM 会把该线程对应的本地内存中的共享变量刷新到主内存。<br> 当读一个 volatile 变量时，JMM 会把该线程对应的本地内存置为无效。线程接下来将从主内存中读取共享变量。</p><p>但是volatile只是解决了可见性问题, 却无法保证操作的原子性. 比如:100个线程执行<code>++x</code>, 即使使用volatile关键字也无法保证x最终的结果是初始值加上100.</p><p>volatile适用于:</p><ol><li>写入变量值不依赖当前值</li><li>读写变量值时没有加锁.</li></ol><h3 id="指令重排序问题" tabindex="-1"><a class="header-anchor" href="#指令重排序问题" aria-hidden="true">#</a> 指令重排序问题</h3><p>多线程情况下， 指令重排序会导致代码执行的结果和顺序执行结果不同。 使用volatile关键字， 可以避免指令重排序问题。</p><p>写volatile变量时， 可以确保volatile写之前的操作不会被重排序到写之后。<br> 读volatile变量时， 可以确保volatile读之后的操作不会被重排序到读之前。</p><h3 id="内存屏障" tabindex="-1"><a class="header-anchor" href="#内存屏障" aria-hidden="true">#</a> 内存屏障</h3>`,16)),a("p",null,[a("a",d,[n[19]||(n[19]=s("参考链接")),o(t)])]),n[24]||(n[24]=e(`<p>内存屏障分为两种：Load Barrier 和 Store Barrier即读屏障和写屏障。</p><ul><li>对于Load Barrier来说，在指令前插入Load Barrier，可以让高速缓存中的数据失效，强制从新从主内存加载数据；</li><li>对于Store Barrier来说，在指令后插入Store Barrier，能让写入缓存中的最新数据更新写入主内存，让其他线程可见。</li></ul><p>内存屏障有两个作用：</p><ol><li>阻止屏障两侧的指令重排序；</li><li>强制把写缓冲区/高速缓存中的脏数据等写回主内存，让缓存中相应的数据失效。</li></ol><p>java的内存屏障通常所谓的四种即LoadLoad,StoreStore,LoadStore,StoreLoad实际上也是上述两种的组合，完成一系列的屏障和数据同步功能。</p><ol><li>LoadLoad屏障：对于这样的语句Load1; LoadLoad; Load2，在Load2及后续读取操作要读取的数据被访问前，保证Load1要读取的数据被读取完毕。</li><li>StoreStore屏障：对于这样的语句Store1; StoreStore; Store2，在Store2及后续写入操作执行前，保证Store1的写入操作对其它处理器可见。</li><li>LoadStore屏障：对于这样的语句Load1; LoadStore; Store2，在Store2及后续写入操作被刷出前，保证Load1要读取的数据被读取完毕。</li><li>StoreLoad屏障：对于这样的语句Store1; StoreLoad; Load2，在Load2及后续所有读取操作执行前，保证Store1的写入对所有处理器可见。它的开销是四种屏障中最大的。在大多数处理器的实现中，<code>这个屏障是个万能屏障，兼具其它三种内存屏障的功能</code></li></ol><p>在每个volatile写操作前插入StoreStore屏障，在写操作后插入StoreLoad屏障；<br> 在每个volatile读操作前插入LoadLoad屏障，在读操作后插入LoadStore屏障；</p><h4 id="volatile-性能" tabindex="-1"><a class="header-anchor" href="#volatile-性能" aria-hidden="true">#</a> volatile 性能</h4><p>volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多内存屏障指令来保证处理器不发生乱序执行。</p><h2 id="缓存一致性问题" tabindex="-1"><a class="header-anchor" href="#缓存一致性问题" aria-hidden="true">#</a> 缓存一致性问题</h2><p>以一个例子开始这一节:</p><p>我们知道线程会从各自的工作内存中获取变量, 那么线程2会停止吗? 线程操作共享变量, 共享变量的值, 会在线程之间更新吗?</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">int</span> commonInt <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">new</span> <span class="token class-name">Test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Thread</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;线程1: {}&quot;</span><span class="token punctuation">,</span> <span class="token operator">++</span>commonInt<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">Thread</span> t2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;线程2: {}&quot;</span><span class="token punctuation">,</span> commonInt<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>commonInt<span class="token operator">&gt;</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;线程2退出循环: {}&quot;</span><span class="token punctuation">,</span> commonInt<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        t1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行上面的例子的运行结果如下:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>00:15:30.019 [Thread-1] INFO com.nikola.common.util.Test - 线程2: 0
00:15:30.022 [Thread-1] INFO com.nikola.common.util.Test - 线程2: 0
00:15:30.022 [Thread-1] INFO com.nikola.common.util.Test - 线程2退出循环: 1
00:15:30.022 [Thread-0] INFO com.nikola.common.util.Test - 线程1: 1

Process finished with exit code 0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果很明显, 线程2不仅停止了而且刚读出来的数据和之后判断的数据值居然是不同的. 是不是很奇怪? 线程2根本就没有操作共享变量啊, 工作内存应该一直保持0不变才对啊.</p><p>这就涉及到了缓存一致性问题.</p><h3 id="mesi协议" tabindex="-1"><a class="header-anchor" href="#mesi协议" aria-hidden="true">#</a> MESI协议</h3>`,18)),a("p",null,[n[21]||(n[21]=s("这一节的可以参考")),a("a",k,[n[20]||(n[20]=s("volatile和Cache一致性协议之MESI")),o(t)])]),n[25]||(n[25]=e('<p>MESI协议是一种常用的缓存一致性协议，它通过定义一个状态机来保证缓存的一致性。在MESI协议中有四种状态，这些状态都是针对缓存行（缓存由多个缓存行组成，缓存行的大小单位与机器的位数相关）。</p><ul><li>M(Modified)：这行数据有效，数据被修改了，和内存中的数据不一致，数据只存在于本Cache中。</li><li>E(Exclusive)：这行数据有效，数据和内存中的数据一致，数据只存在于本Cache中。</li><li>S(Shared)：这行数据有效，数据和内存中的数据一致，数据存在于很多Cache中。</li><li>I(Invalid)：这行数据无效。 所有M状态下的缓存行（脏数据）回写后，任意缓存级别中的缓存行的数据都与内存保持一致。另外，如果某个缓存行处于E状态，那么在其他的缓存中就不会存在该缓存行。</li></ul><p><img src="https://tech.nikolazhang.top/2020-04-06-12-45-10.png" alt="2020-04-06-12-45-10"></p><p>在上图中，Local Read表示本内核读本Cache中的值，Local Write表示本内核写本Cache中的值，Remote Read表示其它内核读其它Cache中的值，Remote Write表示其它内核写其它Cache中的值，箭头表示本Cache line状态的迁移，环形箭头表示状态不变。</p><p>当内核需要访问的数据不在本Cache中，而其它Cache有这份数据的备份时，本Cache既可以从内存中导入数据，也可以从其它Cache中导入数据，不同的处理器会有不同的选择。MESI协议为了使自己更加通用，没有定义这些细节，只定义了状态之间的迁移，下面的描述假设本Cache从内存中导入数据。</p><p><img src="https://tech.nikolazhang.top/2020-04-06-12-49-11.png" alt="2020-04-06-12-49-11"></p><p>现在我们结合MESI协议我们详细看一下这个过程:</p><ol><li>因为线程1延迟了3毫秒, 因此线程2很大程度上要优先于线程1执行.</li><li>此时, 线程2获取commonInt的值为0. 线程2缓存行处于E状态, 即被线程2私有.</li><li>当线程1开始执行<code>++commonInt</code>时, 线程1加载主存数据commonInt, 由于数据存在于线程2缓存中, 因此所有的缓存行变为S状态.</li><li>即使线程2不断读取, 也不会改变缓存行状态.</li><li>之后线程1进行assign操作, 当前缓存行变为M状态, 线程1的缓存行失效, 因此之后读取要重新从主存中获取.</li><li>因此线程2, 连续两次读内存出现数据不一致的情形是可能会发生的。</li></ol><h2 id="伪共享" tabindex="-1"><a class="header-anchor" href="#伪共享" aria-hidden="true">#</a> 伪共享</h2><p>cpu多级缓存中, 工作内存和主内存进行交互式是通过缓存行进行的. 一个缓存行可能会存放多个变量值. 也就是说当我们从主存中获取a变量的时候,b,c,d变量有可能对被放到工作内存之中.</p><p>如果多个线程同时修改了工作内存中的不同变量, 根据MESI协议. 如果一个线程对b变量做了修改, 那么其他线程的缓存行会失效, 此时数据a,c,d都要从主存中获取. 所以即使我们有高速的工作内存, 但是因为伪共享的存在导致频繁访问主内存造成性能下降.</p><h3 id="避免伪共享" tabindex="-1"><a class="header-anchor" href="#避免伪共享" aria-hidden="true">#</a> 避免伪共享</h3><p>j8之前一般通过字节填充来避免伪共享, 就是多定义一些不用的变量, 以填充一个缓存行的字节.<br> j8提供了一个@sun.misc.Contented注解用于解决伪共享. 可以用它来修饰类或者修饰变量, 但是该注解作用于java核心类(rt包下的类), 如果用户路径下需要使用这个注解需要添加jvm参数: <code>-XX:RestrictContendted</code>, 填充的默认宽度为128, 也可以通过<code>-XX:ContentedPaddingWidth</code>设置值.</p>',13))])}const f=p(r,[["render",v],["__file","多线程.html.vue"]]);export{f as default};

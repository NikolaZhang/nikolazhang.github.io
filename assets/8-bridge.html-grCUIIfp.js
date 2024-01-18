import{_ as n}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as s,c as a,e}from"./app-VwsK9hGj.js";const t="/assets/image-4-Ln1-8vGd.png",p={},c=e('<blockquote><p>桥接模式通过抽象和实现部分的分离，使得两者可以独立变化。抽象部分定义抽象类，维护一个对实现对象的引用。<br> 实现部分定义实现接口，提供不同的实现。这样就可以通过组合不同的抽象类和实现类来创建对象，提高了系统的灵活性。</p></blockquote><p><img src="'+t+`" alt="Alt text"></p><p>主要角色：</p><ul><li>抽象（Abstraction）：定义抽象接口，通常包含对实现接口的引用。</li><li>扩展抽象（RefinedAbstraction）：对抽象的扩展，可以是抽象类的子类或具体实现类。</li><li>抽象实现（Implementor）：定义实现接口，提供基本操作的接口。</li><li>具体实现（ConcreteImplementor）：实现实现接口的具体类。</li></ul><div class="hint-container info"><p class="hint-container-title">Info</p><p>在设计模式中类与类之间的关系主要有6种：依赖、关联、聚合、组合、继承、实现，它们之间的耦合度依次增加。子类必须实现抽象父类中的所有方法，父类抽象方法的变更，必然导致子类的变更。这是一种强关联关系。强关联有必然使我们的系统不易扩展。所以桥梁模式为化解强关联提供了一种解决方案。</p><p>桥接模式，抽象和实现的分离，可以理解为功能性的抽象和内部实现的分离。对客户端隐藏了内部实现的具体细节。</p></div><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2><h3 id="抽象" tabindex="-1"><a class="header-anchor" href="#抽象" aria-hidden="true">#</a> 抽象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">interface</span> <span class="token class-name">Implementor</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="扩展抽象" tabindex="-1"><a class="header-anchor" href="#扩展抽象" aria-hidden="true">#</a> 扩展抽象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteImplementorA</span> <span class="token keyword">implements</span> <span class="token class-name">Implementor</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;ConcreteImplementorA operation&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="抽象实现" tabindex="-1"><a class="header-anchor" href="#抽象实现" aria-hidden="true">#</a> 抽象实现</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Abstraction</span> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> <span class="token class-name">Implementor</span> impl<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setImplementor</span><span class="token punctuation">(</span><span class="token class-name">Implementor</span> impl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>impl <span class="token operator">=</span> impl<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">abstract</span> <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里聚合了<code>Implementor</code>，通过该类来实现我们的具体功能。</p><h3 id="具体实现" tabindex="-1"><a class="header-anchor" href="#具体实现" aria-hidden="true">#</a> 具体实现</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RefinedAbstraction</span> <span class="token keyword">extends</span> <span class="token class-name">Abstraction</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        impl<span class="token punctuation">.</span><span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在抽象功能的实现类中，调用内部实现方法，完成<code>operation</code>的操作。</p><h3 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>
    
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Abstraction</span> abstraction <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RefinedAbstraction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        abstraction<span class="token punctuation">.</span><span class="token function">setImplementor</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ConcreteImplementorA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        abstraction<span class="token punctuation">.</span><span class="token function">operation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18),i=[c];function o(l,u){return s(),a("div",null,i)}const k=n(p,[["render",o],["__file","8-bridge.html.vue"]]);export{k as default};

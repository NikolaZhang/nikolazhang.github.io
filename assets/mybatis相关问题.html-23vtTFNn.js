import{_ as o}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as c,c as d,e as a}from"./app-CYrfdzXE.js";const i={};function n(s,e){return c(),d("div",null,e[0]||(e[0]=[a('<h2 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h2><h3 id="configuration的作用及创建方式" tabindex="-1"><a class="header-anchor" href="#configuration的作用及创建方式" aria-hidden="true">#</a> Configuration的作用及创建方式</h3><p><code>Configuration</code>是重要的配置类, 主要有4个作用:</p><ol><li>解释mybatis xml配置为Java语言。（比如：解析<code>environments</code>节点为<code>environment</code>，<code>settings</code>各种属性的配置等）</li><li>是其他组件的容器。（比如：<code>mappedStatements</code>管理<code>MappedStatement</code>，<code>resultMaps</code>管理<code>ResultMap</code>，<code>parameterMaps</code>管理<code>ParameterMap</code>）</li><li>提供实例创建的工厂方法。（比如：<code>newExecutor</code>用于创建执行器，<code>newStatementHandler</code>用于创建<code>StatementHandler</code>）</li><li>提供容器管理的注册器实例。（比如：<code>jdbcTypeHandlerMap</code>、<code>typeHandlerMap</code>、<code>allTypeHandlersMap</code>、<code>unknownTypeHandler</code>对<code>TypeHandler</code>的管理都是通过<code>typeHandlerRegistry</code>完成的）</li></ol><p><code>XMLConfigBuilder</code>的<code>parse</code>方法解析xml配置后返回一个<code>Configuration</code>对象。<br> 具体而言是：通过创建<code>XMLConfigBuilder</code>实例时，通过new创建<code>Configuration</code>实例，之后通过<code>parse</code>解析xml配置，给<code>Configuration</code>实例赋值，完成构建。</p><details class="hint-container details"><summary>XPathParser</summary><p><code>XPathParser</code>是mybatis用于解析xml文件的类。通过实例调用<code>evalNode</code>方法即可。</p></details><h3 id="sqlsession创建过程" tabindex="-1"><a class="header-anchor" href="#sqlsession创建过程" aria-hidden="true">#</a> SqlSession创建过程</h3><ol><li>SqlSession使用工厂模式创建，即通过<code>SqlSessionFactory</code>对象调用<code>openSession</code>。</li><li><code>openSession</code>方法进一步调用了工厂类中的<code>openSessionFromDataSource</code>方法。</li><li><code>openSessionFromDataSource</code>方法中通过<code>Configuration</code>对象，执行器，是否自动提交，三个参数实例化<code>DefaultSqlSession</code>获取<code>SqlSession</code>。</li></ol><details class="hint-container details"><summary>openSession方法的介绍</summary><p><code>openSession</code>存在多个重载方法，支持在运行过程中修改将要创建的<code>SqlSession</code>的属性：是否自动提交，连接，事务级别，执行器类型。<br> 默认使用的<code>SqlSessionFactory</code>实现为<code>DefaultSqlSessionFactory</code>。</p></details><details class="hint-container details"><summary>关于事务Transaction</summary><p><code>Transaction</code>的创建需要通过<code>TransactionFactory</code>的<code>newTransaction</code>方法。</p><p><code>TransactionFactory</code>工厂可以通过<code>getTransactionFactoryFromEnvironment</code>获取（顾名思义方法参数为<code>Environment</code>）。</p><ol><li>如果没有在环境中指定事务工厂则默认使用<code>ManagedTransactionFactory</code>。</li><li>如果指定事务工厂则使用<code>environment.getTransactionFactory()</code>获取。</li></ol></details><details class="hint-container details"><summary>执行器</summary><p>执行器是<code>Executor</code>接口的实现。它的创建需要通过<code>configuration</code>调用<code>newExecutor</code>（需要将<code>Transaction</code>以及<code>ExecutorType</code>作为参数）。</p><p><code>ExecutorType</code>不同值与之对应的执行器</p><ol><li>BATCH类型对应<code>BatchExecutor</code></li><li>REUSE类型对应<code>ReuseExecutor</code></li><li>其余类型对应<code>SimpleExecutor</code></li></ol><p>如果允许缓存则使用<code>CachingExecutor</code>，需要注意的是缓存执行器并不是自己去执行sql，而是代理上面的三种执行器。</p></details><h3 id="sqlsessionfactory创建过程" tabindex="-1"><a class="header-anchor" href="#sqlsessionfactory创建过程" aria-hidden="true">#</a> SqlSessionFactory创建过程</h3><p><code>SqlSessionFactory</code>是一个接口，提供了<code>openSession</code>方法的定义，以及<code>getConfiguration</code>用于获取mybatis的配置信息。</p><ol><li><code>SqlSessionFactory</code>的创建需要由<code>SqlSessionFactoryBuilder</code>的<code>build</code>方法来实现。</li><li><code>build</code>方法中会解析mybatis配置文件得到<code>Configuration</code>对象。（调用<code>XMLConfigBuilder</code>的<code>parse</code>方法）</li><li>最后将<code>Configuration</code>作为参数实例化<code>DefaultSqlSessionFactory</code>。</li></ol><h3 id="sqlsession如何执行sql" tabindex="-1"><a class="header-anchor" href="#sqlsession如何执行sql" aria-hidden="true">#</a> SqlSession如何执行sql</h3><p>由于可以基于接口和xml配置sql，因此分成两种情况考虑。</p><ol><li>基于接口的sql执行，可以通过<code>getMapper</code>获取接口实现实例。这里使用了动态代理。此处按下不表。</li><li>基于xml方式的sql执行可以通过指定语句命名空间，以及参数的方式执行。比如：<code>update</code>、<code>delete</code>、<code>selectXXX</code>方法。当然前者也可以通过这种方式实现。</li></ol><p>这部分内容详见 <strong>SqlSession与sql执行</strong></p>',18)]))}const r=o(i,[["render",n],["__file","mybatis相关问题.html.vue"]]);export{r as default};

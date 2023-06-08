const t=JSON.parse('{"key":"v-1a027b3a","path":"/posts/pattern/composite-pattern.html","title":"composite pattern","lang":"en-US","frontmatter":{"isOriginal":true,"title":"composite pattern","date":"2018-12-11T00:00:00.000Z","tag":["composite pattern"],"category":"技术","description":"组合模式的介绍和实现","image":"http://image.nikolazhang.top/wallhaven-nrwq11.jpg","head":[["meta",{"property":"og:url","content":"https://nikolazhang.github.io/posts/pattern/composite-pattern.html"}],["meta",{"property":"og:title","content":"composite pattern"}],["meta",{"property":"og:description","content":"组合模式的介绍和实现"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-06-08T15:09:36.000Z"}],["meta",{"property":"article:author","content":"我小叮当、"}],["meta",{"property":"article:tag","content":"composite pattern"}],["meta",{"property":"article:published_time","content":"2018-12-11T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-08T15:09:36.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"composite pattern\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2018-12-11T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-08T15:09:36.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"我小叮当、\\",\\"url\\":\\"https://nikolazhang.github.io\\"}]}"]]},"headers":[{"level":2,"title":"1.2 抽象组合部件","slug":"_1-2-抽象组合部件","link":"#_1-2-抽象组合部件","children":[]},{"level":2,"title":"1.3 合成模块","slug":"_1-3-合成模块","link":"#_1-3-合成模块","children":[]},{"level":2,"title":"1.4 叶子","slug":"_1-4-叶子","link":"#_1-4-叶子","children":[]},{"level":2,"title":"1.5 分配人员并显示","slug":"_1-5-分配人员并显示","link":"#_1-5-分配人员并显示","children":[]},{"level":2,"title":"1.6 结果","slug":"_1-6-结果","link":"#_1-6-结果","children":[]},{"level":2,"title":"2.2 抽象组合部件","slug":"_2-2-抽象组合部件","link":"#_2-2-抽象组合部件","children":[]},{"level":2,"title":"2.3 合成模块","slug":"_2-3-合成模块","link":"#_2-3-合成模块","children":[]},{"level":2,"title":"2.4 叶子","slug":"_2-4-叶子","link":"#_2-4-叶子","children":[]},{"level":2,"title":"2.5 分配人员并显示","slug":"_2-5-分配人员并显示","link":"#_2-5-分配人员并显示","children":[]},{"level":2,"title":"2.6 结果","slug":"_2-6-结果","link":"#_2-6-结果","children":[]}],"git":{"createdTime":1686236976000,"updatedTime":1686236976000,"contributors":[{"name":"nikola","email":"nikolazhang@163.com","commits":1}]},"readingTime":{"minutes":1.94,"words":582},"filePathRelative":"posts/pattern/composite-pattern.md","localizedDate":"December 11, 2018","excerpt":"<blockquote>\\n<p>组合模式，适用于树状结构。模式有三个角色：组合部件，合成模块，叶子。组合部件是组合其余两者的父类。它是一个提供公共属性，方法的抽象类。合成模块用于合成最终的组合对象，叶子节点是组合部件的底层，也就相当于树枝与树叶。该模式又为安全模式和透明模式。两者却别在于父类是否提供用于合成组件的所有方法。</p>\\n</blockquote>\\n<!--more-->\\n<p>好了，我们的公司最近招人。那么就以人事的结构为例吧。\\n首先zhangxu是这个虚拟公司的BOSS。下面有两个经理：lisi,wangwu。还有几个招聘的小弟。</p>\\n<h1> 1 透明模式：</h1>\\n<h2> 1.2 抽象组合部件</h2>"}');export{t as data};
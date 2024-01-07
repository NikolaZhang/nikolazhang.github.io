import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as t,c as r,e as i}from"./app-bc2785df.js";const l="/assets/image-82067f49.png",o={},c=i('<blockquote><p>建造者模式将复杂对象的构建与其表示相分离，这样相同的构造过程可以创建不同的对象。 通过只指定对象的类型和内容，建造者模式允许客户端对象构建一个复杂对象。客户端可以不受该对象构造细节的影响。这样通过定义一个能够构建其他类实例的类，就可以简化复杂对象的创建过程。 建造者模式生产一个主要产品，而该产品中可能有多个类，但是通常只有一个主类。当使用该模式的时候，可以一次创建所有的复杂对象。而其他模式一次就只能创建一个对象。</p></blockquote><p><img src="'+l+'" alt="Alt text"></p><p>建造者模式包含以下角色：</p><ul><li>AbstractBuilder：抽象建造者<br> 这个角色用于规范产品对象的各个组成成分的建造。</li><li>ConcreteBuilder：具体建造者<br> 在指导者的调用下创建产品实例。</li><li>Director：指挥者 调用具体建造者角色创建产品对象。</li><li>Product：产品角色</li></ul><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2>',5),a=[c];function s(n,_){return t(),r("div",null,a)}const p=e(o,[["render",s],["__file","4-builder.html.vue"]]);export{p as default};
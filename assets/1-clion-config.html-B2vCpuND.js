import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as l,c as p,a,d as n,b as e,e as t}from"./app-eIIEjUIZ.js";const c={},r=t(`<blockquote><p>兄弟们，大无语，clion下载完，创建个demo就报错了。搞了一周终于好了。。。但是刚入门，完全不知道为什么。</p></blockquote><p>报错信息如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>D:<span class="token punctuation">\\</span>software<span class="token punctuation">\\</span>jetbraintools<span class="token punctuation">\\</span>apps<span class="token punctuation">\\</span>CLion-Nova<span class="token punctuation">\\</span>ch-0<span class="token punctuation">\\</span><span class="token number">241.11109</span><span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>cmake<span class="token punctuation">\\</span>win<span class="token punctuation">\\</span>x64<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>cmake.exe <span class="token parameter variable">-DCMAKE_BUILD_TYPE</span><span class="token operator">=</span>Debug <span class="token parameter variable">-DCMAKE_MAKE_PROGRAM</span><span class="token operator">=</span>D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/ninja/win/x64/ninja.exe <span class="token parameter variable">-G</span> Ninja <span class="token parameter variable">-S</span> D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>demo <span class="token parameter variable">-B</span> D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>demo<span class="token punctuation">\\</span>cmake-build-debug
-- The C compiler identification is GNU <span class="token number">13.1</span>.0
-- The CXX compiler identification is GNU <span class="token number">13.1</span>.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - failed
-- Check <span class="token keyword">for</span> working C compiler: D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe
-- Check <span class="token keyword">for</span> working C compiler: D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe - broken
CMake Error at D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/cmake/win/x64/share/cmake-3.28/Modules/CMakeTestCCompiler.cmake:67 <span class="token punctuation">(</span>message<span class="token punctuation">)</span>:
  The C compiler

    <span class="token string">&quot;D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe&quot;</span>

  is not able to compile a simple <span class="token builtin class-name">test</span> program.

  It fails with the following output:

    Change Dir: <span class="token string">&#39;D:/work/demo/cmake-build-debug/CMakeFiles/CMakeScratch/TryCompile-fmv8t7&#39;</span>
    
    Run Build Command<span class="token punctuation">(</span>s<span class="token punctuation">)</span>: D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/ninja/win/x64/ninja.exe <span class="token parameter variable">-v</span> cmTC_ddf5f
    <span class="token punctuation">[</span><span class="token number">1</span>/2<span class="token punctuation">]</span> D:<span class="token punctuation">\\</span>software<span class="token punctuation">\\</span>jetbraintools<span class="token punctuation">\\</span>apps<span class="token punctuation">\\</span>CLion-Nova<span class="token punctuation">\\</span>ch-0<span class="token punctuation">\\</span><span class="token number">241.11109</span><span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>mingw<span class="token punctuation">\\</span>bin<span class="token punctuation">\\</span>gcc.exe   -fdiagnostics-color<span class="token operator">=</span>always <span class="token parameter variable">-o</span> CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj <span class="token parameter variable">-c</span> D:/work/demo/cmake-build-debug/CMakeFiles/CMakeScratch/TryCompile-fmv8t7/testCCompiler.c
    <span class="token punctuation">[</span><span class="token number">2</span>/2<span class="token punctuation">]</span> C:<span class="token punctuation">\\</span>WINDOWS<span class="token punctuation">\\</span>system32<span class="token punctuation">\\</span>cmd.exe /C <span class="token string">&quot;cd . &amp;&amp; D:\\software\\jetbraintools<span class="token entity" title="\\a">\\a</span>pps\\CLion-Nova<span class="token entity" title="\\c">\\c</span>h-0<span class="token entity" title="\\241">\\241</span>.11109<span class="token entity" title="\\b">\\b</span>in\\mingw<span class="token entity" title="\\b">\\b</span>in\\gcc.exe   CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj -o cmTC_ddf5f.exe -Wl,--out-implib,libcmTC_ddf5f.dll.a -Wl,--major-image-version,0,--minor-image-version,0  -lkernel32 -luser32 -lgdi32 -lwinspool -lshell32 -lole32 -loleaut32 -luuid -lcomdlg32 -ladvapi32 &amp;&amp; cd .&quot;</span>
    FAILED: cmTC_ddf5f.exe 
    C:<span class="token punctuation">\\</span>WINDOWS<span class="token punctuation">\\</span>system32<span class="token punctuation">\\</span>cmd.exe /C <span class="token string">&quot;cd . &amp;&amp; D:\\software\\jetbraintools<span class="token entity" title="\\a">\\a</span>pps\\CLion-Nova<span class="token entity" title="\\c">\\c</span>h-0<span class="token entity" title="\\241">\\241</span>.11109<span class="token entity" title="\\b">\\b</span>in\\mingw<span class="token entity" title="\\b">\\b</span>in\\gcc.exe   CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj -o cmTC_ddf5f.exe -Wl,--out-implib,libcmTC_ddf5f.dll.a -Wl,--major-image-version,0,--minor-image-version,0  -lkernel32 -luser32 -lgdi32 -lwinspool -lshell32 -lole32 -loleaut32 -luuid -lcomdlg32 -ladvapi32 &amp;&amp; cd .&quot;</span>
    ninja: build stopped: subcommand failed.
    
    

  

  CMake will not be able to correctly generate this project.
Call Stack <span class="token punctuation">(</span>most recent call first<span class="token punctuation">)</span>:
  CMakeLists.txt:2 <span class="token punctuation">(</span>project<span class="token punctuation">)</span>


-- Configuring incomplete, errors occurred<span class="token operator">!</span>

<span class="token punctuation">[</span>Finished<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>网上搜索，大概有以下几种方案，但对我都没有用。</p>`,4),u={href:"https://zhuanlan.zhihu.com/p/43680621",target:"_blank",rel:"noopener noreferrer"},d=a("li",null,[n("在上条的基础上，检查 "),a("code",null,"CMake"),n(" + "),a("code",null,"MinGW"),n("的路径，需要在拉丁字符路径下。")],-1),m=a("code",null,"Help | Edit Custom VM options...",-1),k={href:"https://intellij-support.jetbrains.com/hc/en-us/community/posts/360009445579-Error-Clion-2020-2-The-C-compiler-is-not-able-to-compile-a-simple-test-program",target:"_blank",rel:"noopener noreferrer"},b={href:"https://intellij-support.jetbrains.com/hc/en-us/requests/6062811",target:"_blank",rel:"noopener noreferrer"},v=t('<p>我的解决方案：</p><ol><li>toolchains的配置我们保持不变，可以看到还是会出现errors。</li></ol><p><img src="https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213714.png" alt="20240222213714"><br> 2. 需要调整CMake配置，generator改为<code>MinGW Makefiles</code>：</p><p><img src="https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213734.png" alt="20240222213734"><br> 3. 之后，重新load项目就正常了。</p><p><img src="https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213641.png" alt="20240222213641"></p><ol start="4"><li>运行项目，也可以输出了。</li></ol><p><img src="https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222214220.png" alt="20240222214220"></p>',7);function g(C,f){const s=o("ExternalLinkIcon");return l(),p("div",null,[r,a("ol",null,[a("li",null,[n("有说项目中存在中文路径的。需要将项目创建在英文路径下。参考："),a("a",u,[n("CLion 中 的 MinGW 配置（及中文坑解决）"),e(s)])]),d,a("li",null,[n("在"),m,n("中修改临时目录。参考"),a("a",k,[n("Error-Clion"),e(s)])])]),a("p",null,[n("另外我提了一个"),a("a",b,[n("issue"),e(s)]),n("，不知什么时候有人给出解决方案。")]),v])}const w=i(c,[["render",g],["__file","1-clion-config.html.vue"]]);export{w as default};

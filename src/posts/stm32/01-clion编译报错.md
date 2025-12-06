---
title: 【clion报错】The C compiler is not able to compile a simple test program 
tag:
  - clion
category: stm32
description: The C compiler is not able to compile a simple test program 
date: 2024-02-22

author: nikola
icon: article

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

> 兄弟们，大无语，clion下载完，创建个demo就报错了。搞了一周终于好了。。。但是刚入门，完全不知道为什么。

报错信息如下：

```shell
D:\software\jetbraintools\apps\CLion-Nova\ch-0\241.11109\bin\cmake\win\x64\bin\cmake.exe -DCMAKE_BUILD_TYPE=Debug -DCMAKE_MAKE_PROGRAM=D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/ninja/win/x64/ninja.exe -G Ninja -S D:\work\demo -B D:\work\demo\cmake-build-debug
-- The C compiler identification is GNU 13.1.0
-- The CXX compiler identification is GNU 13.1.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - failed
-- Check for working C compiler: D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe
-- Check for working C compiler: D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe - broken
CMake Error at D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/cmake/win/x64/share/cmake-3.28/Modules/CMakeTestCCompiler.cmake:67 (message):
  The C compiler

    "D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/mingw/bin/gcc.exe"

  is not able to compile a simple test program.

  It fails with the following output:

    Change Dir: 'D:/work/demo/cmake-build-debug/CMakeFiles/CMakeScratch/TryCompile-fmv8t7'
    
    Run Build Command(s): D:/software/jetbraintools/apps/CLion-Nova/ch-0/241.11109/bin/ninja/win/x64/ninja.exe -v cmTC_ddf5f
    [1/2] D:\software\jetbraintools\apps\CLion-Nova\ch-0\241.11109\bin\mingw\bin\gcc.exe   -fdiagnostics-color=always -o CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj -c D:/work/demo/cmake-build-debug/CMakeFiles/CMakeScratch/TryCompile-fmv8t7/testCCompiler.c
    [2/2] C:\WINDOWS\system32\cmd.exe /C "cd . && D:\software\jetbraintools\apps\CLion-Nova\ch-0\241.11109\bin\mingw\bin\gcc.exe   CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj -o cmTC_ddf5f.exe -Wl,--out-implib,libcmTC_ddf5f.dll.a -Wl,--major-image-version,0,--minor-image-version,0  -lkernel32 -luser32 -lgdi32 -lwinspool -lshell32 -lole32 -loleaut32 -luuid -lcomdlg32 -ladvapi32 && cd ."
    FAILED: cmTC_ddf5f.exe 
    C:\WINDOWS\system32\cmd.exe /C "cd . && D:\software\jetbraintools\apps\CLion-Nova\ch-0\241.11109\bin\mingw\bin\gcc.exe   CMakeFiles/cmTC_ddf5f.dir/testCCompiler.c.obj -o cmTC_ddf5f.exe -Wl,--out-implib,libcmTC_ddf5f.dll.a -Wl,--major-image-version,0,--minor-image-version,0  -lkernel32 -luser32 -lgdi32 -lwinspool -lshell32 -lole32 -loleaut32 -luuid -lcomdlg32 -ladvapi32 && cd ."
    ninja: build stopped: subcommand failed.
    
    

  

  CMake will not be able to correctly generate this project.
Call Stack (most recent call first):
  CMakeLists.txt:2 (project)


-- Configuring incomplete, errors occurred!

[Finished]
```

网上搜索，大概有以下几种方案，但对我都没有用。

1. 有说项目中存在中文路径的。需要将项目创建在英文路径下。参考：[CLion 中 的 MinGW 配置（及中文坑解决）](https://zhuanlan.zhihu.com/p/43680621)
2. 在上条的基础上，检查 `CMake` + `MinGW`的路径，需要在拉丁字符路径下。
3. 在`Help | Edit Custom VM options...`中修改临时目录。参考[Error-Clion](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360009445579-Error-Clion-2020-2-The-C-compiler-is-not-able-to-compile-a-simple-test-program)

另外我提了一个[issue](https://intellij-support.jetbrains.com/hc/en-us/requests/6062811)，不知什么时候有人给出解决方案。

我的解决方案：

1. toolchains的配置我们保持不变，可以看到还是会出现errors。
  
![20240222213714](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213714.png)
2. 需要调整CMake配置，generator改为`MinGW Makefiles`：  

![20240222213734](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213734.png)
3. 之后，重新load项目就正常了。  

![20240222213641](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222213641.png)
4. 运行项目，也可以输出了。

![20240222214220](https://raw.githubusercontent.com/NikolaZhang/image-blog/main/1-clion-config/20240222214220.png)
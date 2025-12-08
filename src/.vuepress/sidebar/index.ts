import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
    "/": [
        {
            text: "文章",
            icon: "file-code",
            prefix: "posts/",
            children: "structure",
            collapsible: true,
        },
        {
            text: "笔记",
            icon: "pen",
            prefix: "notes/",
            children: "structure",
            collapsible: true,
        },
        {
            text: "开源项目",
            icon: "rss",
            prefix: "open_source/",
            children: "structure",
            collapsible: true,
        },
        {
            text: "分享",
            icon: "share",
            prefix: "shares/",
            children: "structure",
            collapsible: true,
        },
    ],
});

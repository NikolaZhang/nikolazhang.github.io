import theme from "./theme.js";
import {defineUserConfig} from "vuepress";
import {searchPlugin} from "@vuepress/plugin-search";


export default defineUserConfig({
    base: "/",
    theme,
    shouldPrefetch: false,
    plugins: [
        searchPlugin({
            maxSuggestions: 10,
        }),
    ],
});

import { defineClientConfig } from "@vuepress/client";
import { hasGlobalComponent } from "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/shared.js";
import { h } from "vue";

import { useStyleTag } from "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/vueuse.js";
import Badge from "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import FontIcon from "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import BackToTop from "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/components/BackToTop.js";

import "E:/code/chainwork/maiyun/docs/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.193_44bug2q4gvgfsg4b36ccgweufe/node_modules/vuepress-plugin-components/lib/client/styles/sr-only.scss";

export default defineClientConfig({
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("FontIcon")) app.component("FontIcon", FontIcon);
    
  },
  setup: () => {
      useStyleTag(`\
  @import url("//at.alicdn.com/t/c/font_2410206_5vb9zlyghj.css");
  `);
  },
  rootComponents: [
    () => h(BackToTop, { threshold: 300 }),
  ],
});

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig, squooshImageService } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import languagesJSON from "./src/config/language.json";
import cloudflare from '@astrojs/cloudflare';
// import node from '@astrojs/node'

const { default_language } = config.settings;

const supportedLang = [...languagesJSON.map((lang) => lang.languageCode)];
const disabledLanguages = config.settings.disable_languages;

// Filter out disabled languages from supportedLang
const filteredSupportedLang = supportedLang.filter(
  (lang) => !disabledLanguages.includes(lang),
);

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "ignore",
  i18n: {
    locales: filteredSupportedLang,
    defaultLocale: default_language,
    fallback: {
      zh: "en",
    },
    routing: {
      fallbackType: "rewrite",
    }
  },
  output: 'server',
  // experimental: {
  //   viewTransitions: true
  // },
  adapter: cloudflare(),
  // adapter: cloudflare({
  //   platformProxy: {
  //     enabled: true
  //   }
  // }),
  // adapter: node({ mode: 'standalone' }),
  image: {
    service: squooshImageService(),
  },
  integrations: [
    react(),
    sitemap({
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: new Date('2024-12-20'),
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});

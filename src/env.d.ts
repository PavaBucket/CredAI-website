/// <reference types="vite/client" />

import "vue-router";

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    description?: string;
    canonicalPath?: string;
    robots?: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogImageType?: string;
    ogImageWidth?: string;
    ogImageHeight?: string;
    bodyClass?: string;
    solidHeader?: boolean;
    footerMode?: "home" | "credai" | "default";
  }
}

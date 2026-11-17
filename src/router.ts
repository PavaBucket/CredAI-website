import { createRouter, createWebHistory } from "vue-router";
import CredaiPage from "@/pages/CredaiPage.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "credai",
      component: CredaiPage,
      alias: ["/index.html", "/credai", "/credai/", "/credai.html"]
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 96 };
    return { top: 0 };
  }
});

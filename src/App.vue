<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import CookieConsent from "@/components/CookieConsent.vue";
import DemoModal from "@/components/DemoModal.vue";
import IconSprite from "@/components/IconSprite.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import SiteHeader from "@/components/SiteHeader.vue";

const route = useRoute();
const router = useRouter();

const modalOpen = ref(false);
const modalContext = ref("credai-demo");
const cookieConsent = ref<InstanceType<typeof CookieConsent> | null>(null);

let revealObserver: IntersectionObserver | null = null;
let navSpyCleanup: (() => void) | null = null;

function openModal(context = "credai-demo") {
  modalContext.value = context;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

function routeForLegacyHref(href: string) {
  return href.startsWith("#") ? { path: route.path, hash: href } : null;
}

function setupReveal() {
  revealObserver?.disconnect();
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  elements.forEach((element) => revealObserver?.observe(element));
}

function setupContentNavSpy() {
  navSpyCleanup?.();

  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      ".content-nav a[href^='#'], .side-index a[href^='#'], .desktop-nav a[href^='#'], .mobile-nav a[href^='#']"
    )
  );
  if (!navLinks.length) {
    navSpyCleanup = null;
    return;
  }

  const items = navLinks
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute("href")?.slice(1) || "");
      return { id, link, section: document.getElementById(id) };
    })
    .filter((item): item is { id: string; link: HTMLAnchorElement; section: HTMLElement } => Boolean(item.id && item.section));

  if (!items.length) {
    navSpyCleanup = null;
    return;
  }

  function setActive(id: string) {
    items.forEach((item) => {
      const active = item.id === id;
      item.link.classList.toggle("is-active", active);
      if (active) {
        item.link.setAttribute("aria-current", "location");
      } else {
        item.link.removeAttribute("aria-current");
      }
    });

  }

  function updateActiveLink() {
    const header = document.querySelector<HTMLElement>("[data-header]");
    const readLine = Math.max((header?.offsetHeight || 0) + 128, window.innerHeight * 0.42);
    let current = items[0];

    items.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= readLine) {
        current = item;
      }
    });

    setActive(current.id);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveLink();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();

  navSpyCleanup = () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", updateActiveLink);
  };
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function scrollToRouteHash() {
  const currentHash = route.hash || window.location.hash;
  const targetId = decodeURIComponent(currentHash.slice(1));
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return;
  }

  const header = document.querySelector<HTMLElement>("[data-header]");
  const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 96);
  window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: "auto" });
}

async function syncRouteScroll() {
  await router.isReady();
  await nextTick();
  const applyScroll = route.hash ? scrollToRouteHash : scrollToTop;

  applyScroll();
  window.requestAnimationFrame(applyScroll);
  window.setTimeout(applyScroll, 120);
}

function isCredaiRoute() {
  return route.name === "credai";
}

async function refreshRouteEffects() {
  await router.isReady();
  await nextTick();
  setupReveal();
  setupContentNavSpy();
}

async function handleDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const modalTrigger = target.closest<HTMLElement>("[data-open-modal]");
  if (modalTrigger) {
    event.preventDefault();
    openModal(modalTrigger.dataset.context || "credai-demo");
    return;
  }

  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (!link || link.target === "_blank") {
    return;
  }

  const destination = routeForLegacyHref(link.getAttribute("href") || "");
  if (!destination) {
    return;
  }

  event.preventDefault();
  await router.push(destination);
}

function handlePageShow() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  if (isCredaiRoute() && !route.hash) {
    void syncRouteScroll();
  }
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("pageshow", handlePageShow);
  void syncRouteScroll();
  refreshRouteEffects();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("pageshow", handlePageShow);
  revealObserver?.disconnect();
  navSpyCleanup?.();
});

watch(
  () => route.fullPath,
  async () => {
    if (route.hash || isCredaiRoute()) {
      await syncRouteScroll();
    }

    await refreshRouteEffects();
  }
);
</script>

<template>
  <IconSprite />
  <SiteHeader @open-modal="openModal" />
  <RouterView />
  <SiteFooter @manage-cookies="cookieConsent?.openPreferences()" />
  <DemoModal :open="modalOpen" :context="modalContext" @close="closeModal" />
  <CookieConsent ref="cookieConsent" />
</template>

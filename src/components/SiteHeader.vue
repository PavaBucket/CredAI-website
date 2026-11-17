<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { asset } from "@/asset";

const emit = defineEmits<{ "open-modal": [context: string] }>();
const route = useRoute();
const menuOpen = ref(false);
const scrolled = ref(false);
const headerClass = computed(() => ({ "is-scrolled": scrolled.value, "menu-open": menuOpen.value }));

function updateScrollState() {
  scrolled.value = window.scrollY > 28;
}
function openModal() {
  menuOpen.value = false;
  emit("open-modal", "credai-demo");
}
watch(() => route.fullPath, () => {
  menuOpen.value = false;
  updateScrollState();
});
onMounted(() => {
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", updateScrollState));
</script>

<template>
  <header class="site-header" :class="headerClass" data-header>
    <div class="nav-wrap">
      <RouterLink class="brand" to="/#top" aria-label="CredAI">
        <img :src="asset('assets/creadai-logo-dark.svg')" alt="CredAI" />
      </RouterLink>
      <nav class="desktop-nav" aria-label="Navegação principal">
        <div class="nav-product-menu">
          <button class="nav-product-trigger" type="button" aria-haspopup="true">
            <span>Nossos Produtos</span>
            <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
          </button>
          <div class="nav-product-list" aria-label="Nossos Produtos">
            <a href="https://bravia.io/">
              <span>Puzzle</span><small>Bancarização white-label</small>
            </a>
            <RouterLink to="/" class="is-active" aria-current="page">
              <span>CredAI</span><small>Inteligência para análise e decisão</small>
            </RouterLink>
            <a href="https://identityflow.com.br" target="_blank" rel="noopener noreferrer">
              <span>Identity Flow</span><small>KYC, background check e antifraude</small>
            </a>
          </div>
        </div>
        <a href="#produto">Produto</a>
        <a href="#como-funciona">Como funciona</a>
        <a href="#governanca">Governança</a>
        <a href="#para-quem">Para quem</a>
        <a href="#preco">Planos</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <button class="button button-sm button-light" type="button" @click="openModal">
          <span>Contato</span><svg aria-hidden="true"><use href="#icon-arrow"></use></svg>
        </button>
        <button class="icon-button menu-toggle" type="button" :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          :aria-expanded="menuOpen" aria-controls="mobile-nav" @click="menuOpen = !menuOpen">
          <svg aria-hidden="true"><use href="#icon-menu"></use></svg>
        </button>
      </div>
    </div>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Navegação mobile" data-mobile-nav>
      <span class="mobile-nav-label">Nossos Produtos</span>
      <a href="https://bravia.io/">Puzzle</a>
      <RouterLink to="/" @click="menuOpen = false">CredAI</RouterLink>
      <a href="https://identityflow.com.br" target="_blank" rel="noopener noreferrer">Identity Flow</a>
      <a href="#produto" @click="menuOpen = false">Produto</a>
      <a href="#como-funciona" @click="menuOpen = false">Como funciona</a>
      <a href="#governanca" @click="menuOpen = false">Governança</a>
      <a href="#para-quem" @click="menuOpen = false">Para quem</a>
      <a href="#preco" @click="menuOpen = false">Planos</a>
      <a href="#faq" @click="menuOpen = false">FAQ</a>
      <button type="button" @click="openModal">Contato</button>
    </nav>
  </header>
</template>

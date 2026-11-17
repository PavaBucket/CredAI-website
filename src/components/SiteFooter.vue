<script setup lang="ts">
import { asset } from "@/asset";

defineEmits<{ "manage-cookies": [] }>();
</script>

<template>
  <footer class="site-footer site-footer--light">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img class="footer-logo" :src="asset('assets/bravia-logo-dark.svg')" alt="Bravia" />
        <p>A plataforma definitiva para criar, operar e escalar produtos financeiros.</p>
        <a class="footer-social-link" href="https://www.linkedin.com/company/somos-bravia" target="_blank" rel="noreferrer" aria-label="LinkedIn da Bravia">
          <span aria-hidden="true">in</span>
        </a>
      </div>
      <nav aria-label="Rodapé CredAI">
        <strong>CredAI</strong>
        <a href="#produto">Produto</a>
        <a href="#como-funciona">Como funciona</a>
        <a href="#governanca">Governança</a>
        <a href="#faq">FAQ</a>
      </nav>
      <nav aria-label="Rodapé Empresa">
        <strong>Empresa</strong>
        <a href="https://bravia.io/about-us">Quem somos</a>
        <a href="https://bravia.io/founders-builders">Founders &amp; Builders</a>
        <a href="https://bravia.io/consultoria">Consultoria</a>
        <a href="https://bravia.io/privacy-policy">Privacidade</a>
        <a href="https://bravia.io/terms-of-use">Termos de uso</a>
      </nav>
      <div class="footer-contact">
        <button class="footer-demo" type="button" data-open-modal data-context="credai-footer">Fale com a Bravia</button>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>Bravia Tech LTDA - CNPJ: 60.613.733/0001-23 © Copyright - Todos os direitos reservados.</span>
      <button class="footer-cookie-button" type="button" @click="$emit('manage-cookies')">Gerenciar Cookies</button>
    </div>
  </footer>
</template>

<style scoped>
.site-footer--light { background: #ffffff; color: #173c34; border-top: 1px solid rgba(7, 19, 27, 0.12); }
.site-footer--light p,
.site-footer--light .footer-bottom { color: #526761; }
.site-footer--light strong { color: #173c34; }
.site-footer--light a,
.site-footer--light .footer-social-link { color: #087559; }
.site-footer--light a:hover,
.site-footer--light a:focus-visible { color: #005c42; }
.site-footer--light .footer-bottom { border-color: #dce8e2; }
.site-footer--light .footer-cookie-button { color: #526761; border-color: #b8d2c4; }
</style>

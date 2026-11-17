<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";

import { updateGoogleTracking } from "@/googleTracking";

const COOKIE_CONSENT_KEY = "bravia_cookie_consent_v1";
const COOKIE_CONSENT_COOKIE = "bravia_cookie_consent";

type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string | null;
  version: 1;
};

const bannerVisible = ref(false);
const preferencesOpen = ref(false);
const analytics = ref(false);
const marketing = ref(false);
const route = useRoute();
const trackingConsent = shallowRef<Pick<CookieConsent, "analytics" | "marketing">>({
  analytics: false,
  marketing: false
});

watch(
  [() => route.name, trackingConsent],
  ([name, consent]) => {
    if (name) updateGoogleTracking(consent);
  }
);

function getCookie(name: string) {
  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split(";") : [];
  for (const part of parts) {
    const value = part.trim();
    if (value.startsWith(encodedName)) {
      return decodeURIComponent(value.slice(encodedName.length));
    }
  }
  return null;
}

function normalizeCookieConsent(rawConsent: Partial<CookieConsent> | null): CookieConsent | null {
  if (!rawConsent || rawConsent.version !== 1) return null;
  return {
    essential: true,
    analytics: Boolean(rawConsent.analytics),
    marketing: Boolean(rawConsent.marketing),
    updatedAt: rawConsent.updatedAt || null,
    version: 1
  };
}

function readCookieConsent() {
  let parsed: Partial<CookieConsent> | null = null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      parsed = JSON.parse(stored);
    }
  } catch {
    parsed = null;
  }

  if (!parsed) {
    try {
      const storedCookie = getCookie(COOKIE_CONSENT_COOKIE);
      if (storedCookie) {
        parsed = JSON.parse(storedCookie);
      }
    } catch {
      parsed = null;
    }
  }

  const consent = normalizeCookieConsent(parsed);
  if (consent) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch {
      // Keep cookie fallback when localStorage is unavailable.
    }
  }
  return consent;
}

function removeCookiesByPrefix(prefixes: string[]) {
  const hostParts = window.location.hostname.split(".");
  const domains = ["", window.location.hostname];
  if (hostParts.length > 1) {
    domains.push(`.${hostParts.slice(-2).join(".")}`);
  }

  String(document.cookie || "")
    .split(";")
    .forEach((rawCookie) => {
      const cookieName = rawCookie.split("=")[0]?.trim();
      if (!cookieName || !prefixes.some((prefix) => cookieName === prefix || cookieName.startsWith(prefix))) return;

      domains.forEach((domain) => {
        const domainPart = domain ? `; Domain=${domain}` : "";
        document.cookie = `${cookieName}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`;
      });
    });
}

function persistCookieConsent(nextConsent: Pick<CookieConsent, "analytics" | "marketing">) {
  const consent: CookieConsent = {
    essential: true,
    analytics: Boolean(nextConsent.analytics),
    marketing: Boolean(nextConsent.marketing),
    updatedAt: new Date().toISOString(),
    version: 1
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Keep the cookie as the durable fallback when localStorage is unavailable.
  }
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=15552000; Path=/; SameSite=Lax`;

  if (!consent.analytics) {
    removeCookiesByPrefix(["_ga", "_gid", "_gat", "_gcl"]);
  }
  if (!consent.marketing) {
    removeCookiesByPrefix(["hubspotutk", "__hstc", "__hssc", "__hssrc", "__cf_bm"]);
  }

  window.dispatchEvent(new CustomEvent("bravia:cookie-consent", { detail: consent }));
  return consent;
}

function applyToggleState(consent = readCookieConsent()) {
  analytics.value = Boolean(consent?.analytics);
  marketing.value = Boolean(consent?.marketing);
}

function openPreferences() {
  applyToggleState();
  preferencesOpen.value = true;
  document.body.classList.add("cookie-modal-open");
}

function closePreferences() {
  preferencesOpen.value = false;
  document.body.classList.remove("cookie-modal-open");
}

function saveConsent(consent: Pick<CookieConsent, "analytics" | "marketing">) {
  trackingConsent.value = persistCookieConsent(consent);
  bannerVisible.value = false;
  closePreferences();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && preferencesOpen.value) {
    closePreferences();
  }
}

function syncStoredConsent() {
  const currentConsent = readCookieConsent();
  applyToggleState(currentConsent);
  trackingConsent.value = { analytics: analytics.value, marketing: marketing.value };
  bannerVisible.value = !currentConsent;
}

function handlePageShow(event: PageTransitionEvent) {
  if (event.persisted) syncStoredConsent();
}

function handleStorage(event: StorageEvent) {
  if (event.key === COOKIE_CONSENT_KEY || event.key === null) syncStoredConsent();
}

defineExpose({
  openPreferences
});

onMounted(() => {
  syncStoredConsent();
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("storage", handleStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("pageshow", handlePageShow);
  window.removeEventListener("storage", handleStorage);
  document.body.classList.remove("cookie-modal-open");
});
</script>

<template>
  <div class="cookie-consent-root">
    <section class="cookie-banner" data-cookie-banner role="region" aria-label="Aviso de cookies" :hidden="!bannerVisible">
      <div class="cookie-banner-inner">
        <div class="cookie-banner-copy">
          <h2>Valorizamos sua privacidade</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Ao clicar em
            "Aceitar tudo", você concorda com o uso de todos os cookies. Você pode ajustar suas preferências a qualquer momento.
            <a href="https://bravia.io/privacy-policy">Política de Privacidade.</a>
          </p>
        </div>
        <div class="cookie-banner-actions">
          <button type="button" class="cookie-btn cookie-btn-soft" data-cookie-preferences @click="openPreferences">Preferências</button>
          <button type="button" class="cookie-btn cookie-btn-outline" data-cookie-reject @click="saveConsent({ analytics: false, marketing: false })">Rejeitar não essenciais</button>
          <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-accept @click="saveConsent({ analytics: true, marketing: true })">Aceitar tudo</button>
        </div>
      </div>
    </section>

    <div class="cookie-preferences" data-cookie-modal :hidden="!preferencesOpen">
      <div class="cookie-modal-backdrop" data-cookie-close @click="closePreferences"></div>
      <section class="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <header class="cookie-dialog-head">
          <h2 id="cookie-title">Preferências de Cookies</h2>
          <button type="button" class="cookie-icon-button" aria-label="Fechar preferências" data-cookie-close @click="closePreferences">
            <span aria-hidden="true"></span>
          </button>
        </header>
        <div class="cookie-dialog-body">
          <p>
            Gerencie suas preferências de consentimento para cookies e tecnologias de rastreamento. Alguns cookies são
            essenciais para o funcionamento do site e não podem ser desativados.
          </p>

          <article class="cookie-option is-required">
            <div>
              <h3>Essenciais <span>Obrigatório</span></h3>
              <p>Necessários para o funcionamento básico do site, como segurança e preferências de consentimento.</p>
            </div>
            <label class="cookie-switch">
              <input type="checkbox" checked disabled />
              <span></span>
            </label>
          </article>

          <article class="cookie-option">
            <div>
              <h3>Analíticos</h3>
              <p>Ajudam-nos a entender como os visitantes interagem com o site, coletando métricas anônimas de uso e performance.</p>
            </div>
            <label class="cookie-switch">
              <input v-model="analytics" type="checkbox" data-cookie-toggle="analytics" />
              <span></span>
            </label>
          </article>

          <article class="cookie-option">
            <div>
              <h3>Marketing</h3>
              <p>Utilizados para exibir publicidade relevante e medir a eficácia das nossas campanhas de marketing.</p>
            </div>
            <label class="cookie-switch">
              <input v-model="marketing" type="checkbox" data-cookie-toggle="marketing" />
              <span></span>
            </label>
          </article>
        </div>
        <footer class="cookie-dialog-actions">
          <button type="button" class="cookie-btn cookie-btn-soft" data-cookie-close @click="closePreferences">Cancelar</button>
          <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-save @click="saveConsent({ analytics, marketing })">Salvar preferências</button>
        </footer>
      </section>
    </div>
  </div>
</template>

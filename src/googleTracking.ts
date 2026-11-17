const puzzleId = "G-K7PQDVE7SB";
const credaiId = "G-6BTTD8476P";
const tagManagerUrl = "https://www.googletagmanager.com/gtm.js?id=GTM-W53V38JT";
const productionHosts = new Set(["bravia.io", "www.bravia.io", "credai.com", "www.credai.com"]);
let lastConsent: { analytics: boolean; marketing: boolean } | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    "ga-disable-G-K7PQDVE7SB"?: boolean;
    "ga-disable-G-6BTTD8476P"?: boolean;
  }
}

export function updateGoogleTracking({ analytics, marketing }: { analytics: boolean; marketing: boolean }) {
  const { protocol, hostname } = window.location;
  if (protocol !== "https:" || !productionHosts.has(hostname)) return;

  // O contêiner é compartilhado; esta aplicação envia apenas métricas da CredAI.
  window[`ga-disable-${puzzleId}`] = true;
  window[`ga-disable-${credaiId}`] = !analytics;

  if (!analytics && !lastConsent) return;
  if (lastConsent?.analytics === analytics && lastConsent.marketing === marketing) return;

  const dataLayer = window.dataLayer ??= [];
  function gtag(..._command: unknown[]) {
    dataLayer.push(arguments);
  }

  if (!lastConsent) {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  const ads = marketing ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads
  });

  if (!lastConsent) {
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    dataLayer.push({ event: "bravia_analytics_ready" });

    const script = document.createElement("script");
    script.src = tagManagerUrl;
    script.async = true;
    document.head.append(script);
  }
  lastConsent = { analytics, marketing };
}

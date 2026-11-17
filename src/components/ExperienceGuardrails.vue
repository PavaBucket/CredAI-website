<script setup lang="ts">
type GuardrailPosition = "top" | "top-right" | "bottom-right" | "bottom" | "bottom-left" | "top-left";

withDefaults(defineProps<{
  segments: readonly { iconHref: string; label: string; position?: GuardrailPosition }[];
  tone?: "bravia" | "credai";
  centerTitle?: string;
  topPrinciples?: readonly string[];
  bottomPrinciples?: readonly string[];
  ariaLabel?: string;
  marketsLabel?: string;
}>(), {
  tone: "bravia",
  centerTitle: "Governança de ponta a ponta",
  topPrinciples: () => ["Segurança", "Rastreabilidade"],
  bottomPrinciples: () => ["Auditoria", "Observabilidade"],
  ariaLabel: "Mercados atendidos com uma base comum de governança",
  marketsLabel: "Segmentos atendidos pela Bravia"
});
</script>

<template>
  <figure class="experience-guardrails" :class="`experience-guardrails--${tone}`" :aria-label="ariaLabel">
    <svg class="guardrails-ring" viewBox="0 0 600 600" aria-hidden="true">
      <g class="guardrails-connections">
        <path d="M300 144V108 M435 222L466 204 M435 378L466 396 M300 456V492 M165 378L134 396 M165 222L134 204" />
      </g>
      <circle cx="300" cy="300" r="156" class="guardrails-circle" />
    </svg>
    <div class="guardrails-center">
      <ul class="guardrails-principles" aria-label="Controles preventivos">
        <li v-for="principle in topPrinciples" :key="principle">{{ principle }}</li>
      </ul>
      <h3>{{ centerTitle }}</h3>
      <ul class="guardrails-principles" aria-label="Controles de acompanhamento">
        <li v-for="principle in bottomPrinciples" :key="principle">{{ principle }}</li>
      </ul>
    </div>
    <ul class="guardrails-markets" :aria-label="marketsLabel">
      <li v-for="segment in segments" :key="segment.label" :data-market="segment.label" :data-position="segment.position">
        <svg aria-hidden="true"><use :href="segment.iconHref" /></svg>
        <span>{{ segment.label }}</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.experience-guardrails {
  --guardrails-ink: #173c34;
  --guardrails-ring: #72b99a;
  --guardrails-connections: #c3ddcf;
  --guardrails-muted: #537567;
  --guardrails-principle-dot: #83b7a0;
  --guardrails-icon: #22946d;
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  margin: 0 auto;
  align-self: center;
  color: var(--guardrails-ink);
  container-type: inline-size;
}
.experience-guardrails--credai {
  --guardrails-ink: #182329;
  --guardrails-ring: #d4aa1e;
  --guardrails-connections: #ead990;
  --guardrails-muted: #58636a;
  --guardrails-principle-dot: #d4aa1e;
  --guardrails-icon: #a88622;
}
.guardrails-ring { position: absolute; inset: 0; width: 100%; height: 100%; fill: none; }
.guardrails-circle {
  stroke: var(--guardrails-ring);
  stroke-width: 2;
  stroke-dasharray: 230 15;
  stroke-linecap: round;
  transform: rotate(-43deg);
  transform-origin: center;
}
.guardrails-connections { stroke: var(--guardrails-connections); stroke-width: 1.2; }
.guardrails-center {
  position: absolute;
  inset: 24%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  text-align: center;
}
.guardrails-center h3 {
  max-width: 220px;
  margin: 0;
  color: var(--guardrails-ink);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0;
}
.guardrails-principles {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--guardrails-muted);
  font-size: 0.75rem;
  line-height: 1.4;
}
.guardrails-principles li + li::before { content: "·"; margin-right: 10px; color: var(--guardrails-principle-dot); }
.guardrails-markets { margin: 0; padding: 0; list-style: none; }
.guardrails-markets li {
  position: absolute;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 12px;
  width: 128px;
  min-height: 64px;
  transform: translate(-50%, -50%);
  color: #435c51;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  text-align: center;
}
.guardrails-markets svg { width: 28px; height: 28px; color: var(--guardrails-icon); stroke-width: 1.6; }
.guardrails-markets [data-position="top"] { left: 50%; top: 8%; }
.guardrails-markets [data-position="top-right"] { left: 87%; top: 27%; }
.guardrails-markets [data-position="bottom-right"] { left: 87%; top: 73%; }
.guardrails-markets [data-position="bottom"] { left: 50%; top: 92%; }
.guardrails-markets [data-position="bottom-left"] { left: 13%; top: 73%; }
.guardrails-markets [data-position="top-left"] { left: 13%; top: 27%; }
.guardrails-markets [data-market="Adquirência"] { left: 50%; top: 8%; }
.guardrails-markets [data-market="Indústria"] { left: 87%; top: 27%; }
.guardrails-markets [data-market="Securitizadora"] { left: 87%; top: 73%; }
.guardrails-markets [data-market="FIDC"] { left: 50%; top: 92%; }
.guardrails-markets [data-market="Fintech"] { left: 13%; top: 73%; }
.guardrails-markets [data-market="Varejo"] { left: 13%; top: 27%; }
@container (max-width: 480px) {
  .guardrails-center { gap: 16px; }
  .guardrails-center h3 { max-width: 160px; font-size: 1.25rem; }
  .guardrails-principles { flex-direction: column; gap: 2px; font-size: 0.6875rem; }
  .guardrails-principles li + li::before { content: none; }
  .guardrails-markets li { width: 94px; min-height: 52px; gap: 8px; font-size: 0.6875rem; }
  .guardrails-markets svg { width: 24px; height: 24px; }
}
@container (max-width: 340px) {
  .guardrails-center { gap: 10px; }
  .guardrails-center h3 { max-width: 132px; font-size: 1.125rem; }
  .guardrails-markets li { width: 86px; font-size: 0.625rem; }
}
</style>

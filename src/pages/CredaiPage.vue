<script setup lang="ts">
import { asset } from "@/asset";
import HeroVideoPreview from "../components/HeroVideoPreview.vue";
import ExperienceGuardrails from "../components/ExperienceGuardrails.vue";

const credaiAudiences = [
  { iconHref: "#icon-landmark", label: "FIDCs", position: "top" },
  { iconHref: "#icon-circle-dollar", label: "Financeiras", position: "top-right" },
  { iconHref: "#icon-layers", label: "Bancos e SCDs", position: "bottom-right" },
  { iconHref: "#icon-flow", label: "Operações B2B e parceiros", position: "bottom" },
  { iconHref: "#icon-shield", label: "Securitizadoras", position: "bottom-left" },
  { iconHref: "#icon-code", label: "Fintechs de crédito", position: "top-left" }
] as const;

const credaiPricingFeatureGroups = [
  {
    id: "credit-engine",
    iconHref: "#icon-cog",
    title: "Motor de crédito",
    availabilityNote: undefined,
    fintechAddOn: false,
    features: [
      { title: "Decisão automatizada e explicável", description: "Scorecard • rating • trilha de regras", plans: [true, true] },
      { title: "Políticas de crédito configuráveis sem código", description: "Editor no-code • condições • precificação", plans: [true, true] },
      { title: "Análise de empresas e grupos econômicos com IA", description: "Demonstrativos • documentos • grupo econômico", plans: [true, true] },
      { title: "Consultas e integração com bureaus", description: "CPF/CNPJ • sanções • comportamento de crédito", plans: [true, true] },
      { title: "Gestão de propostas e visão consolidada do cliente", description: "Lotes • veredito • limite • Cliente 360", plans: [true, true] },
      { title: "Indicadores e acompanhamento da operação", description: "Aprovação • risco • desempenho • rentabilidade", plans: [true, true] },
      { title: "Plataforma e API para integração", description: "Esteiras • webhooks • Idempotency-Key", plans: [true, true] }
    ]
  },
  {
    id: "data-modeling",
    iconHref: "#icon-trend",
    title: "Modelagem de dados",
    availabilityNote: "Enterprise incluído • Fintech como módulo adicional",
    fintechAddOn: true,
    features: [
      { title: "Score de rentabilidade", description: "Rentabilidade esperada • inadimplência", plans: [false, true] },
      { title: "Precificação inteligente e rentabilidade das operações", description: "Taxa mínima • PDD • refinanciamentos", plans: [false, true] },
      { title: "Modelos personalizados para o negócio", description: "Custos • capital • metas", plans: [false, true] },
      { title: "Avaliação do retorno dos bureaus", description: "ROI • custo-benefício • fornecedores", plans: [false, true] },
      { title: "Análise de carteira e mercado", description: "Variáveis • padrões • mercado", plans: [false, true] },
      { title: "Simulação de políticas e backtesting financeiro", description: "Simulação • projeção • backtesting", plans: [false, true] }
    ]
  }
] as const;
</script>

<template>
<main id="top" class="credai-page-content">
      <section class="credai-hero" aria-labelledby="hero-title">
        <div class="credai-hero-inner">
          <div class="credai-hero-copy reveal">
            <p class="eyebrow credai-hero-kicker">AI-powered credit engine</p>
            <h1 id="hero-title" class="credai-hero-promise">Inteligência para <span class="credai-hero-emphasis">decidir</span> antes do risco aparecer</h1>
            <p class="credai-hero-text">
              Um motor de crédito e analytics com IA que transforma dados em risco, oportunidade e decisão em tempo real.
            </p>
          </div>
          <HeroVideoPreview
            class="credai-hero-video"
            :video-src="asset('assets/credai-apresentacao.mp4')"
            :poster-src="asset('assets/credai-capa-960.webp')"
            preview-label="Reproduzir vídeo de apresentação da CredAI"
            dialog-label="Apresentação da CredAI"
            :poster-width="960"
            :poster-height="540"
          />
          <ul class="credai-hero-highlights" aria-label="Pilares da CredAI">
            <li><svg aria-hidden="true"><use href="#icon-calculator" /></svg><div><strong>Simulação de políticas</strong><span>Teste antes de aplicar</span></div></li>
            <li><svg aria-hidden="true"><use href="#icon-trend" /></svg><div><strong>Risco e rentabilidade</strong><span>Compare cenários de carteira</span></div></li>
            <li><svg aria-hidden="true"><use href="#icon-shield" /></svg><div><strong>Decisão rastreável</strong><span>Premissas, indicadores e evidências</span></div></li>
          </ul>
        </div>
      </section>

      <section class="credai-section credai-product-section" id="produto" aria-labelledby="product-title">
        <div class="credai-container">
          <div class="credai-section-head reveal">
            <p class="eyebrow">Produto</p>
            <h2 id="product-title">Decisão de crédito que mede o impacto financeiro antes da execução</h2>
            <p>
              O CredAI simula retorno, risco e define as condições de crédito ideais em uma camada de inteligência para times que precisam decidir rapidamente sem operar no escuro.
            </p>
          </div>

          <div class="credai-card-grid">
            <article class="credai-card reveal">
              <div class="credai-card-title">
                <svg aria-hidden="true"><use href="#icon-calculator"></use></svg>
                <h3>Simule antes de mudar</h3>
              </div>
              <p>Teste cenários, aprovação, resultado e preço antes de aplicar mudanças na operação real.</p>
            </article>
            <article class="credai-card reveal">
              <div class="credai-card-title">
                <svg aria-hidden="true"><use href="#icon-trend"></use></svg>
                <h3>Compare risco e retorno</h3>
              </div>
              <p>Acompanhe aprovação e resultado esperado vs. efetivo. Monitore perda, margem e concentração em cenários comparáveis.</p>
            </article>
            <article class="credai-card reveal">
              <div class="credai-card-title">
                <svg aria-hidden="true"><use href="#icon-gauge"></use></svg>
                <h3>Calibre metas de rentabilidade por carteira</h3>
              </div>
              <p>Com base na estrutura de capital, despesas de administração e operação,  custos de análise e apetite de risco.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="credai-section credai-flow-section" id="como-funciona" aria-labelledby="flow-title">
        <div class="credai-container">
          <div class="credai-section-head reveal">
            <p class="eyebrow">Como funciona</p>
            <h2 id="flow-title">Da base histórica à política aprovada, cada cenário vira evidência</h2>
            <p>
              Um ciclo curto para transformar dados de carteira em comparação objetiva de políticas, sem separar análise, decisão e governança.
            </p>
          </div>

          <div class="credai-step-grid">
            <article class="credai-step reveal">
              <div class="credai-step-title">
                <span class="credai-step-number">01</span>
                <h3>Organize a carteira</h3>
              </div>
              <p>Consolide sua base de propostas, contratos, pagamentos, custos, perdas e outros fatos relevantes.</p>
            </article>
            <article class="credai-step reveal">
              <div class="credai-step-title">
                <span class="credai-step-number">02</span>
                <h3>Monte cenários</h3>
              </div>
              <p>Treine modelos para definir aprovação, preço, limites, garantias e regras de revisão.</p>
            </article>
            <article class="credai-step reveal">
              <div class="credai-step-title">
                <span class="credai-step-number">03</span>
                <h3>Compare impacto</h3>
              </div>
              <p>Analise e compare aprovação, perda, resultado e rentabilidade antes de qualquer mudança.</p>
            </article>
            <article class="credai-step reveal">
              <div class="credai-step-title">
                <span class="credai-step-number">04</span>
                <h3>Acompanhe e aprimore</h3>
              </div>
              <p>Inúmeras formas de testar novos modelos sem correr riscos significativos.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="credai-section credai-governance-section" id="governanca" aria-labelledby="governance-title">
        <div class="credai-container credai-governance-grid">
          <div class="credai-section-head reveal">
            <p class="eyebrow">Governança operacional</p>
            <h2 id="governance-title">Política deixa de ser opinião e passa a ser comparação rastreável</h2>
            <p>
              O CredAI ajuda risco, produto e negócio a discutirem a mesma régua: retorno esperado, perda, custo de aquisição, uso de bureaus e apetite de crescimento.
            </p>
          </div>

          <div class="credai-signal-list reveal">
            <article class="credai-signal">
              <div class="credai-signal-title">
                <svg aria-hidden="true"><use href="#icon-trend"></use></svg>
                <h3>Backtesting com histórico real</h3>
              </div>
              <p>Compare novas regras contra safras passadas e enxergue o que mudaria em aprovação, perda e margem.</p>
            </article>
            <article class="credai-signal">
              <div class="credai-signal-title">
                <svg aria-hidden="true"><use href="#icon-calculator"></use></svg>
                <h3>ROI de dados e bureaus</h3>
              </div>
              <p>Meça quais fontes melhoram a decisão e quais consultas custam mais do que entregam.</p>
            </article>
            <article class="credai-signal">
              <div class="credai-signal-title">
                <svg aria-hidden="true"><use href="#icon-shield"></use></svg>
                <h3>Explicabilidade para comitê</h3>
              </div>
              <p>Organize premissas, indicadores e justificativas para aprovar política com evidência.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="credai-section credai-audience-section" id="para-quem" aria-labelledby="audience-title">
        <div class="credai-container credai-audience-layout">
          <div class="credai-section-head reveal">
            <p class="eyebrow">Para quem</p>
            <h2 id="audience-title">Inteligência de crédito para operações que precisam decidir antes de escalar risco</h2>
            <p>
              O CredAI apoia times que precisam defender política, preço e carteira com impacto projetado, não apenas
              intuição ou leitura retroativa.
            </p>
          </div>

          <ExperienceGuardrails
            class="reveal"
            :segments="credaiAudiences"
            tone="credai"
            center-title="Decidir com inteligência"
            :top-principles="['Cenários', 'Risco']"
            :bottom-principles="['Retorno', 'Evidências']"
            aria-label="Operações que usam a inteligência de crédito da CredAI"
            markets-label="Operações atendidas pela CredAI"
          />
        </div>
      </section>

      <section class="credai-section credai-pricing" id="preco" aria-labelledby="pricing-title">
        <div class="credai-container">
          <div class="credai-section-head reveal">
            <p class="eyebrow">Planos</p>
            <h2 id="pricing-title">Uma solução desenhada para a sua operação</h2>
          </div>

          <div class="credai-pricing-content reveal">
            <div class="credai-pricing-plan-grid">
              <aside class="credai-pricing-plan" aria-labelledby="pricing-plan-fintechs-title">
                <header class="credai-pricing-plan-header">
                  <h3 id="pricing-plan-fintechs-title">Fintech</h3>
                  <svg aria-hidden="true"><use href="#icon-layers"></use></svg>
                </header>
                <div class="credai-pricing-plan-details">
                  <p class="credai-pricing-plan-price"><span>A partir de</span><strong>R$ 5.000</strong><small>/mês por carteira</small></p>
                </div>
                <p class="credai-pricing-plan-description">Modelagem de dados como pacote adicional.</p>
              </aside>

              <aside class="credai-pricing-plan" aria-labelledby="pricing-plan-enterprise-title">
                <header class="credai-pricing-plan-header">
                  <h3 id="pricing-plan-enterprise-title">Enterprise</h3>
                  <svg aria-hidden="true"><use href="#icon-layers"></use></svg>
                </header>
                <div class="credai-pricing-plan-details">
                  <p class="credai-pricing-plan-price"><span>Preço</span><strong>Sob consulta</strong></p>
                </div>
                <p class="credai-pricing-plan-description">Pacote completo.</p>
              </aside>
            </div>

            <div class="credai-pricing-features" aria-labelledby="pricing-features-title">
              <h3 id="pricing-features-title">Funcionalidades</h3>
              <p class="credai-pricing-feature-intro">Planos modulares que evoluem com a maturidade e a complexidade da sua operação.</p>
              <div class="credai-pricing-table" role="region" aria-label="Funcionalidades incluídas nos planos CredAI" tabindex="0">
                <table aria-labelledby="pricing-features-title">
                  <colgroup><col class="credai-feature-column" /><col class="credai-plan-column" /><col class="credai-plan-column" /></colgroup>
                  <thead><tr><th scope="col">Funcionalidade</th><th scope="col">Fintech</th><th scope="col">Enterprise</th></tr></thead>
                  <tbody>
                    <tr class="credai-pricing-group"><th colspan="3" scope="rowgroup"><span><svg aria-hidden="true"><use href="#icon-cog"></use></svg>Motor de crédito</span></th></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Decisão automatizada e explicável</span><small class="credai-feature-description">Scorecard • rating • trilha de regras</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Políticas de crédito configuráveis sem código</span><small class="credai-feature-description">Editor no-code • condições • precificação</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Análise de empresas e grupos econômicos com IA</span><small class="credai-feature-description">Demonstrativos • documentos • grupo econômico</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Consultas e integração com bureaus</span><small class="credai-feature-description">CPF/CNPJ • sanções • comportamento de crédito</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Gestão de propostas e visão consolidada do cliente</span><small class="credai-feature-description">Lotes • veredito • limite • Cliente 360</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Indicadores e acompanhamento da operação</span><small class="credai-feature-description">Aprovação • risco • desempenho • rentabilidade</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Plataforma e API para integração</span><small class="credai-feature-description">Esteiras • webhooks • Idempotency-Key</small></th><td><span class="credai-feature-status" aria-label="Incluso no plano Fintech">✓</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>

                    <tr class="credai-pricing-group"><th colspan="3" scope="rowgroup"><span><svg aria-hidden="true"><use href="#icon-trend"></use></svg>Modelagem de dados <small class="credai-pricing-group-note">Enterprise incluído • Fintech como módulo adicional</small></span></th></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Score de rentabilidade</span><small class="credai-feature-description">Rentabilidade esperada • inadimplência</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Precificação inteligente e rentabilidade das operações</span><small class="credai-feature-description">Taxa mínima • PDD • refinanciamentos</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Modelos personalizados para o negócio</span><small class="credai-feature-description">Custos • capital • metas</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Avaliação do retorno dos bureaus</span><small class="credai-feature-description">ROI • custo-benefício • fornecedores</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Análise de carteira e mercado</span><small class="credai-feature-description">Variáveis • padrões • mercado</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                    <tr><th scope="row"><span class="credai-feature-name">Simulação de políticas e backtesting financeiro</span><small class="credai-feature-description">Simulação • projeção • backtesting</small></th><td><span class="credai-feature-status is-add-on" aria-label="Disponível como módulo adicional no plano Fintech">+</span></td><td><span class="credai-feature-status" aria-label="Incluso no plano Enterprise">✓</span></td></tr>
                  </tbody>
                </table>
              </div>
              <div class="credai-pricing-feature-mobile" aria-label="Funcionalidades incluídas nos planos CredAI">
                <section v-for="group in credaiPricingFeatureGroups" :key="group.id" class="credai-mobile-feature-group" :aria-labelledby="`${group.id}-title`">
                  <h4 :id="`${group.id}-title`"><svg aria-hidden="true"><use :href="group.iconHref"></use></svg><span>{{ group.title }}<small v-if="group.availabilityNote">{{ group.availabilityNote }}</small></span></h4>
                  <ul>
                    <li v-for="feature in group.features" :key="feature.title">
                      <strong>{{ feature.title }}</strong>
                      <small>{{ feature.description }}</small>
                      <div class="credai-mobile-feature-plans" aria-label="Disponibilidade por plano">
                        <span v-if="feature.plans[0] && feature.plans[1]" class="credai-mobile-feature-plan is-shared">Fintech e Enterprise <span class="credai-mobile-feature-status" aria-label="Incluso">✓</span></span>
                        <template v-else>
                          <span v-for="(included, planIndex) in feature.plans" :key="planIndex" class="credai-mobile-feature-plan" :class="{ 'is-enterprise': planIndex === 1, 'is-add-on': group.fintechAddOn && planIndex === 0 && !included }">
                            {{ planIndex === 0 ? "Fintech" : "Enterprise" }}
                            <span v-if="included" class="credai-mobile-feature-status" aria-label="Incluso">✓</span>
                            <span v-else-if="group.fintechAddOn && planIndex === 0" class="credai-mobile-feature-add-on">Módulo adicional</span>
                            <span v-else class="credai-mobile-feature-unavailable">Não incluso</span>
                          </span>
                        </template>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="credai-section" id="faq" aria-labelledby="faq-title">
        <div class="credai-container credai-faq-layout">
          <div class="credai-section-head reveal">
            <p class="eyebrow">FAQ</p>
            <h2 id="faq-title">Perguntas frequentes</h2>
          </div>

          <div class="credai-faq reveal">
            <details open>
              <summary>
                <span>O CredAI decide crédito automaticamente?</span>
                <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
              </summary>
              <p>Não necessariamente. Ele apoia simulação, comparação e governança de políticas. A decisão pode continuar no comitê, na esteira atual ou em uma regra operacional aprovada pelo cliente.</p>
            </details>
            <details>
              <summary>
                <span>Preciso trocar minha esteira atual?</span>
                <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
              </summary>
              <p>Não. O CredAI pode ser usado como camada de análise e backtesting para políticas, convivendo com a operação atual e com as esteiras da Bravia.</p>
            </details>
            <details>
              <summary>
                <span>Quais indicadores são analisados na simulação?</span>
                <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
              </summary>
              <p>Aprovação, inadimplência esperada, perda esperada, rentabilidade, resultado, preço e outros indicadores definidos conforme produto e carteira.</p>
            </details>
            <details>
              <summary>
                <span>O modelo considera bureaus e fontes externas?</span>
                <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
              </summary>
              <p>Sim. A proposta é medir o valor real das fontes de dados dentro da política, comparando impacto na decisão, custo de consulta e ganho de performance.</p>
            </details>
          </div>
        </div>
      </section>

    </main>
</template>

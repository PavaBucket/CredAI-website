<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, watch } from "vue";

const API_URL = "https://script.google.com/macros/s/AKfycbxsL9uY_VTtY1TgGqOZCv0ldlO13TMhS75g8Zd0WprP-OLwSbett3yVzm9eHr56pu2o/exec";

type ProductKey = "credai";

type LeadFormOptions = {
  intro: string;
  pageName: string;
  challengePlaceholder: string;
  consentLabel: string;
  segmentos: string[];
  volumes: string[];
  objetivos: string[];
};

type LeadApiResponse = {
  status?: string;
  mensagem?: string;
  message?: string;
};

const LEAD_FORM_OPTIONS: Record<ProductKey, LeadFormOptions> = {
  credai: {
    intro: "Preencha seus dados para conversar com a Bravia.",
    pageName: "Bravia CredAI",
    challengePlaceholder: "Conte rapidamente onde sua análise de crédito precisa evoluir",
    consentLabel: "Concordo em ser contatado pela Bravia para uma conversa comercial sobre o CredAI.",
    segmentos: [
      "Fintech ou banco digital",
      "Financeira, FIDC ou securitizadora",
      "Varejo com operação de crédito",
      "Marketplace ou plataforma",
      "Área de risco, crédito ou cobrança",
      "Outro segmento"
    ],
    volumes: [
      "Até 10 mil simulações por mês",
      "10 mil a 100 mil simulações por mês",
      "100 mil a 1 milhão de simulações por mês",
      "Acima de 1 milhão de simulações por mês",
      "Ainda estou estimando"
    ],
    objetivos: [
      "Simular políticas de crédito",
      "Fazer backtesting de carteira",
      "Otimizar preço, risco e rentabilidade",
      "Comparar cenários antes de mudar política",
      "Governar apetite de risco e crescimento",
      "Outros"
    ]
  }
};

const props = defineProps<{
  open: boolean;
  context: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const initialContext = computed(() => props.context || "credai-demo");
const productKey: ProductKey = "credai";
const productName = computed(() => "CredAI");
const productOptions = computed(() => LEAD_FORM_OPTIONS[productKey]);
const modalTitle = "Veja o CredAI em ação";
const modalIntro = computed(() => productOptions.value.intro);
const challengePrefill = computed(() => "");
const submitLabel = "Quero ver na prática";

function pageUriWithContext(context: string) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("context", context);
    if (!url.hash) {
      url.hash = "contato";
    }
    return url.toString();
  } catch {
    return window.location.href;
  }
}

function setFieldError(form: HTMLFormElement, name: string, message: string) {
  const field = form.querySelector(`[name="${name}"]`)?.closest(".field");
  const error = form.querySelector(`[data-error-for="${name}"]`);
  field?.classList.toggle("has-error", Boolean(message));
  if (error) {
    error.textContent = message || "";
  }
}

function validateForm(form: HTMLFormElement, data: Record<string, string>) {
  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const required: Record<string, string> = {
    nome: "Informe seu nome completo.",
    email: "Informe um e-mail corporativo válido.",
    empresa: "Informe a empresa.",
    whatsapp: "Informe seu WhatsApp.",
    segmento: "Selecione o segmento.",
    volume: "Selecione o volume mensal estimado.",
    objetivo: "Selecione o principal objetivo.",
    concordo: "Confirme o aceite para contato comercial."
  };

  for (const [field, message] of Object.entries(required)) {
    const value = String(data[field] || "").trim();
    const invalidEmail = field === "email" && value && !emailPattern.test(value);
    const hasError = !value || invalidEmail;
    setFieldError(form, field, hasError ? message : "");
    if (hasError) valid = false;
  }

  return valid;
}

async function submitDemoForm(event: Event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const formStatus = form.querySelector<HTMLElement>("[data-form-status]");
  const formData = new FormData(form);
  const context = String(formData.get("context") || initialContext.value);
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    empresa: String(formData.get("empresa") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    segmento: String(formData.get("segmento") || "").trim(),
    volume: String(formData.get("volume") || "").trim(),
    objetivo: String(formData.get("objetivo") || "").trim(),
    desafio: String(formData.get("desafio") || "").trim(),
    concordo: formData.get("concordo") ? "Sim" : "",
    produto: productName.value,
    contexto: context,
    paginaNome: productOptions.value.pageName,
    pagina: pageUriWithContext(context),
    origem: "bravia-site"
  };

  if (!validateForm(form, payload)) {
    formStatus?.classList.add("is-error");
    if (formStatus) formStatus.textContent = "Revise os campos destacados.";
    return;
  }

  submitButton?.setAttribute("disabled", "true");
  formStatus?.classList.remove("is-error");
  if (formStatus) formStatus.textContent = "Enviando...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    let result: LeadApiResponse | null = null;
    try {
      result = (await response.json()) as LeadApiResponse;
    } catch {
      result = null;
    }

    if (!response.ok || result?.status !== "sucesso") {
      throw new Error(result?.mensagem || result?.message || "A API não confirmou o envio.");
    }

    form.reset();
    if (formStatus) formStatus.textContent = "Recebemos seus dados. Nosso time entrará em contato.";
  } catch (error) {
    formStatus?.classList.add("is-error");
    if (formStatus) {
      formStatus.textContent = getSubmitErrorMessage(error);
    }
  } finally {
    submitButton?.removeAttribute("disabled");
  }
}

function getSubmitErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Não conseguimos enviar sua solicitação agora. Tente novamente em alguns instantes.";
  }

  if (error.message === "Failed to fetch") {
    return "Não conseguimos conectar ao formulário agora. Tente novamente em alguns instantes.";
  }

  return error.message;
}

function clearFieldError(event: Event) {
  const target = event.target;
  const form = event.currentTarget;
  if (
    !(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) ||
    !(form instanceof HTMLFormElement)
  ) {
    return;
  }

  if (target.name) {
    setFieldError(form, target.name, "");
  }

  const formStatus = form.querySelector<HTMLElement>("[data-form-status]");
  formStatus?.classList.remove("is-error");
  if (formStatus) formStatus.textContent = "";
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open) {
    emit("close");
  }
}

watch(
  () => props.open,
  async (open) => {
    document.body.classList.toggle("modal-open", open);
    if (open) {
      await nextTick();
      const challenge = document.querySelector<HTMLTextAreaElement>("#desafio");
      if (challenge) challenge.value = challengePrefill.value;
      if (window.matchMedia("(max-width: 560px), (pointer: coarse)").matches) {
        document.querySelector<HTMLButtonElement>(".demo-dialog .modal-close")?.focus({ preventScroll: true });
      } else {
        document.querySelector<HTMLInputElement>("#nome")?.focus();
      }
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.classList.remove("modal-open");
});

document.addEventListener("keydown", handleKeydown);
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="modal" :hidden="!open" data-modal>
    <div class="modal-backdrop" data-close-modal @click="$emit('close')"></div>
    <section class="demo-dialog" :class="`demo-dialog--${productKey}`" role="dialog" aria-modal="true" aria-labelledby="demo-title">
      <div class="demo-head">
        <button class="modal-close" type="button" aria-label="Fechar formulário" data-close-modal @click="$emit('close')">
          <svg aria-hidden="true"><use href="#icon-close"></use></svg>
        </button>
        <h2 id="demo-title">{{ modalTitle }}</h2>
        <p>{{ modalIntro }}</p>
      </div>

      <form class="demo-form" data-demo-form novalidate @submit="submitDemoForm" @input="clearFieldError">
        <input type="hidden" name="context" :value="initialContext" data-context-input />

        <div class="form-row">
          <div class="field">
            <label for="nome">Nome completo</label>
            <input id="nome" name="nome" autocomplete="name" placeholder="Seu nome" required />
            <span class="field-error" data-error-for="nome"></span>
          </div>
          <div class="field">
            <label for="email">E-mail corporativo</label>
            <input id="email" name="email" type="email" autocomplete="email" placeholder="nome@empresa.com.br" required />
            <span class="field-error" data-error-for="email"></span>
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="empresa">Empresa</label>
            <input id="empresa" name="empresa" autocomplete="organization" placeholder="Sua empresa" required />
            <span class="field-error" data-error-for="empresa"></span>
          </div>
          <div class="field">
            <label for="whatsapp">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" type="tel" autocomplete="tel" maxlength="24" placeholder="(11) 99999-9999" required />
            <span class="field-error" data-error-for="whatsapp"></span>
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="segmento">Segmento</label>
            <select id="segmento" name="segmento" required>
              <option value="">Selecione</option>
              <option v-for="segmento in productOptions.segmentos" :key="segmento" :value="segmento">{{ segmento }}</option>
            </select>
            <span class="field-error" data-error-for="segmento"></span>
          </div>
          <div class="field">
            <label for="volume">Volume mensal estimado</label>
            <select id="volume" name="volume" required>
              <option value="">Selecione</option>
              <option v-for="volume in productOptions.volumes" :key="volume" :value="volume">{{ volume }}</option>
            </select>
            <span class="field-error" data-error-for="volume"></span>
          </div>
        </div>

        <div class="field">
          <label for="objetivo">Principal objetivo</label>
          <select id="objetivo" name="objetivo" required>
            <option value="">Selecione</option>
            <option v-for="objetivo in productOptions.objetivos" :key="objetivo" :value="objetivo">{{ objetivo }}</option>
          </select>
          <span class="field-error" data-error-for="objetivo"></span>
        </div>

        <div class="field">
          <label for="desafio">Desafio atual</label>
          <textarea id="desafio" name="desafio" rows="3" maxlength="900" :placeholder="productOptions.challengePlaceholder"></textarea>
          <span class="field-error" data-error-for="desafio"></span>
        </div>

        <div class="field checkbox-field">
          <label for="concordo">
            <input id="concordo" name="concordo" type="checkbox" value="Sim" required />
            <span>{{ productOptions.consentLabel }}</span>
          </label>
          <span class="field-error" data-error-for="concordo"></span>
        </div>

        <button class="submit-button" type="submit">
          <span>{{ submitLabel }}</span>
          <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>
        </button>

        <p class="form-status" role="status" aria-live="polite" data-form-status></p>
        <p class="secure-note">Seus dados serão usados apenas para contato comercial.</p>
      </form>
    </section>
  </div>
</template>

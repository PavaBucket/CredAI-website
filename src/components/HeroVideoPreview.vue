<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { asset } from "@/asset";

const props = withDefaults(defineProps<{
  videoSrc?: string;
  posterSrc?: string;
  previewLabel?: string;
  dialogLabel?: string;
  posterWidth?: number;
  posterHeight?: number;
}>(), {
  videoSrc: asset("assets/credai-apresentacao.mp4"),
  posterSrc: asset("assets/credai-capa-960.webp"),
  previewLabel: "Reproduzir vídeo de apresentação da CredAI",
  dialogLabel: "Apresentação da CredAI",
  posterWidth: 960,
  posterHeight: 540,
});

const videoDialog = ref<HTMLDialogElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const videoError = ref(false);
let trigger: HTMLButtonElement | null = null;
let previousBodyOverflow = "";

function openVideo(event: MouseEvent) {
  const dialog = videoDialog.value;
  const video = videoElement.value;
  if (!dialog || !video || dialog.open) return;

  trigger = event.currentTarget as HTMLButtonElement;
  videoError.value = false;
  video.src = props.videoSrc;
  video.load();
  previousBodyOverflow = document.body.style.overflow;
  dialog.showModal();
  document.body.style.overflow = "hidden";

  void video.play().catch(() => {
    if (video.error) videoError.value = true;
    else video.focus();
  });
}

function closeVideo() {
  videoDialog.value?.close();
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === videoDialog.value) closeVideo();
}

function resetVideo() {
  const video = videoElement.value;
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  document.body.style.overflow = previousBodyOverflow;
}

function handleClose() {
  const lastTrigger = trigger;
  trigger = null;
  resetVideo();
  requestAnimationFrame(() => {
    if (lastTrigger?.isConnected) lastTrigger.focus();
  });
}

onBeforeUnmount(() => {
  if (videoDialog.value?.open) {
    videoDialog.value.close();
    resetVideo();
  }
});
</script>

<template>
  <figure class="hero-video-preview">
    <button
      class="hero-video-preview-button"
      type="button"
      :aria-label="props.previewLabel"
      aria-haspopup="dialog"
      @click="openVideo"
    >
      <img
        :src="props.posterSrc"
        :width="props.posterWidth"
        :height="props.posterHeight"
        alt=""
        decoding="async"
        fetchpriority="high"
      />
      <span class="hero-video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M8 5.7a1 1 0 0 1 1.52-.85l10.1 6.3a1 1 0 0 1 0 1.7l-10.1 6.3A1 1 0 0 1 8 18.3V5.7Z" /></svg>
      </span>
    </button>
    <Teleport to="body">
      <dialog
        ref="videoDialog"
        class="hero-video-dialog"
        :aria-label="props.dialogLabel"
        @click="handleBackdropClick"
        @close="handleClose"
      >
        <div class="hero-video-dialog-content">
          <button class="hero-video-dialog-close" type="button" aria-label="Fechar vídeo" autofocus @click="closeVideo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" focusable="false" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <video
            ref="videoElement"
            controls
            controlslist="nodownload"
            playsinline
            preload="none"
            :poster="props.posterSrc"
            @play="videoError = false"
            @error="videoError = true"
          >
            Seu navegador não conseguiu reproduzir o vídeo.
          </video>
          <p v-if="videoError" class="hero-video-error" role="alert">Não foi possível reproduzir o vídeo. Tente novamente mais tarde.</p>
        </div>
      </dialog>
    </Teleport>
  </figure>
</template>

<style scoped>
.hero-video-preview {
  position: relative;
  height: 622px;
  margin: 0;
}

.hero-video-preview-button {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  background: #fff;
  cursor: pointer;
}

.hero-video-preview-button img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hero-video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border-radius: 50%;
  background: #001433;
  color: #fff;
  transform: translate(-50%, -50%);
  transition: background-color 160ms ease, transform 160ms ease;
}

.hero-video-play svg {
  width: 28px;
  height: 28px;
  transform: translateX(-2px);
}

.hero-video-preview-button:hover .hero-video-play,
.hero-video-preview-button:focus-visible .hero-video-play {
  background: #17365b;
  transform: translate(-50%, -50%) scale(1.06);
}

.hero-video-preview-button:focus-visible,
.hero-video-dialog-close:focus-visible {
  outline: 3px solid #008767;
  outline-offset: 4px;
}

.hero-video-dialog {
  width: min(1080px, calc(100vw - 48px));
  max-width: none;
  max-height: calc(100dvh - 40px);
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  background: #000;
  color: #fff;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
}

.hero-video-dialog::backdrop {
  background: rgba(18, 20, 20, 0.84);
}

.hero-video-dialog-content {
  position: relative;
  padding: 52px 16px 16px;
}

.hero-video-dialog video {
  display: block;
  width: 100%;
  height: auto;
  max-height: calc(100dvh - 128px);
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  background: #000;
  object-fit: contain;
}

.hero-video-dialog-close {
  position: absolute;
  top: 6px;
  right: 8px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.hero-video-dialog-close svg {
  width: 22px;
  height: 22px;
}

.hero-video-dialog-close:hover,
.hero-video-dialog-close:focus-visible {
  background: rgba(255, 255, 255, 0.14);
}

.hero-video-error {
  margin: 12px 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 640px), (orientation: landscape) and (max-height: 600px) {
  .hero-video-dialog {
    width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
  }

  .hero-video-dialog-content {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    justify-content: center;
    padding: 64px 0;
  }

  .hero-video-dialog video {
    max-height: calc(100dvh - 128px);
    border-radius: 0;
  }

  .hero-video-dialog-close {
    top: max(12px, env(safe-area-inset-top));
    right: max(12px, env(safe-area-inset-right));
    background: rgba(255, 255, 255, 0.14);
  }

  .hero-video-error {
    padding-inline: 16px;
  }
}

@media (max-width: 560px) {
  .hero-video-preview {
    height: 588px;
  }
}

@media (max-width: 430px) {
  .hero-video-preview-button img {
    transform: scale(1.25);
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .hero-video-dialog-content {
    align-items: center;
    padding: 0;
  }

  .hero-video-dialog video {
    width: min(100vw, calc((100dvh - 32px) * 16 / 9));
    max-height: calc(100dvh - 32px);
  }

  .hero-video-dialog-close {
    top: max(8px, env(safe-area-inset-top));
    right: max(8px, env(safe-area-inset-right));
  }
}
</style>

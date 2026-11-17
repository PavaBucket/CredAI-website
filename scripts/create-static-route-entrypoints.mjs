import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// As entradas antigas continuam funcionando em hospedagem estática.
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
mkdirSync(`${dist}/credai`, { recursive: true });
copyFileSync(`${dist}/index.html`, `${dist}/credai/index.html`);
copyFileSync(`${dist}/index.html`, `${dist}/credai.html`);

// GitHub Pages serve 404.html para rotas desconhecidas; o app resolve a rota.
copyFileSync(`${dist}/index.html`, `${dist}/404.html`);

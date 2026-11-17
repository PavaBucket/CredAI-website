import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}
const read = (path) => readFileSync(resolve(root, path), "utf8");

test("a extração contém apenas a página da CredAI", () => {
  assert.deepEqual(readdirSync(resolve(root, "src/pages")), ["CredaiPage.vue"]);
});

test("imports locais e recursos públicos estão contidos no projeto", () => {
  const files = [resolve(root, "index.html"), ...filesIn(resolve(root, "src")), ...filesIn(resolve(root, "public"))];
  for (const file of files.filter((path) => [".html", ".vue", ".ts", ".css"].includes(extname(path)))) {
    const source = readFileSync(file, "utf8");
    for (const [, asset] of source.matchAll(/(?:["'(])\/?(assets\/[^\s"')?]+)/g)) {
      assert.ok(existsSync(resolve(root, "public", asset)), `${file}: recurso ausente ${asset}`);
    }
    for (const [, specifier] of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
      if (!specifier.startsWith(".") && !specifier.startsWith("@/")) continue;
      const base = specifier.startsWith("@/") ? resolve(root, "src", specifier.slice(2)) : resolve(dirname(file), specifier);
      assert.ok([base, `${base}.ts`, `${base}.vue`].some(existsSync), `${file}: import ausente ${specifier}`);
    }
  }
});

test("âncoras de navegação e ícones usados têm destino", () => {
  const files = filesIn(resolve(root, "src")).filter((path) => extname(path) === ".vue");
  const source = files.map((path) => readFileSync(path, "utf8")).join("\n");
  const ids = new Set([...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, id] of source.matchAll(/(?:href=["']#|iconHref:\s*["']#)([\w-]+)/g)) {
    assert.ok(ids.has(id), `Destino ausente: #${id}`);
  }
});

test("links institucionais saem para a Bravia e o formulário mantém o produto CredAI", () => {
  const footer = read("src/components/SiteFooter.vue");
  const cookies = read("src/components/CookieConsent.vue");
  for (const path of ["about-us", "founders-builders", "consultoria", "privacy-policy", "terms-of-use"]) {
    assert.ok(footer.includes(`https://bravia.io/${path}`), `Link institucional ausente: ${path}`);
  }
  assert.ok(cookies.includes("https://bravia.io/privacy-policy"));
  const form = read("src/components/DemoModal.vue");
  assert.ok(form.includes('produto: productName.value'));
  assert.ok(form.includes('"CredAI"'));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { ModuleKind, transpileModule } from "typescript";

const source = readFileSync(new URL("../src/googleTracking.ts", import.meta.url), "utf8");
const { outputText } = transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } });

function trackingAt(hostname = "bravia.io", protocol = "https:") {
  const window = { location: { hostname, protocol, pathname: "/" } };
  const scripts = [];
  const exports = {};
  const document = { createElement: () => ({}), head: { append: (script) => scripts.push(script) } };
  runInNewContext(outputText, { window, document, exports });
  return { window, scripts, update: exports.updateGoogleTracking };
}

test("rastreamento local permanece desativado mesmo com consentimento", () => {
  const tracking = trackingAt("localhost", "http:");
  tracking.update({ analytics: true, marketing: true });
  assert.equal(tracking.scripts.length, 0);
  assert.equal(tracking.window.dataLayer, undefined);
});

test("a página inicial da CredAI desativa o destino Puzzle do contêiner compartilhado", () => {
  const tracking = trackingAt();
  tracking.update({ analytics: true, marketing: false });
  assert.equal(tracking.window["ga-disable-G-6BTTD8476P"], false);
  assert.equal(tracking.window["ga-disable-G-K7PQDVE7SB"], true);
  assert.equal(tracking.scripts.length, 1);
  tracking.update({ analytics: true, marketing: false });
  assert.equal(tracking.scripts.length, 1);
});

test("a revogação desativa analytics sem duplicar o script", () => {
  const tracking = trackingAt();
  tracking.update({ analytics: false, marketing: false });
  assert.equal(tracking.scripts.length, 0);
  tracking.update({ analytics: true, marketing: false });
  tracking.update({ analytics: false, marketing: false });
  assert.equal(tracking.window["ga-disable-G-6BTTD8476P"], true);
  assert.equal(tracking.scripts.length, 1);
  const commands = tracking.window.dataLayer.filter((item) => item[0] === "consent");
  assert.equal(commands.at(-1)[2].analytics_storage, "denied");
});

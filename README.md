# Site da CredAI

Extração do site da CredAI de `Puzzle/apps/site`, revisão de origem
`e1a61d0e6481a0ff121db7c30a76b52f8918de59`. A aplicação fica em `apps/site`,
como no Identity Flow, e tem instalação e build próprios, sem depender do
workspace do Puzzle ou de pacotes privados.

## Executar

Requer Node.js 22.12 ou superior e pnpm. Validado com Node.js 24.15 e pnpm 12.11.

```powershell
cd C:\Bravia-Tech\ComercialBravia\apps\site
pnpm install --frozen-lockfile
pnpm dev
```

O site abre em `http://localhost:5182/`. A porta 5181 é usada localmente pela
documentação do Identity Flow. Também atende `/credai`, `/credai/`
e `/credai.html`. `pnpm build` gera `dist/`, incluindo entradas estáticas
para esses caminhos; `pnpm preview` serve o resultado na porta 4181.

```powershell
pnpm test
pnpm type-check
pnpm build
```

## Conteúdo e dependências preservadas

- `src/pages/CredaiPage.vue`: conteúdo, planos, FAQ e apresentação da CredAI.
- `src/components/`: cabeçalho, rodapé, vídeo, diagrama de públicos, ícones,
  formulário e consentimento de cookies usados pela página.
- `public/`: estilos, fontes com licença, logos, vídeo, miniatura e imagem social.
  `styles.css` conserva a base visual compartilhada do original para preservar
  o layout; nenhuma outra página do site institucional foi copiada.

O formulário mantém o endpoint público do Google Apps Script e o contrato
original de leads (`produto: CredAI`, contexto da ação e `origem: bravia-site`).
Enviar o formulário grava um lead real. Os testes locais não devem enviar dados
ao serviço de produção.

Puzzle, Identity Flow, páginas institucionais, privacidade e termos continuam
como links externos. O repositório Puzzle não precisa ser alterado para executar
esta cópia.

## Separação e publicação posteriores

Esta entrega é local. Não configura domínio, infraestrutura, release ou deploy.
A pasta `apps/site` pode ser movida integralmente para um repositório próprio.

Até a definição do domínio da CredAI, `index.html` e `public/sitemap.xml`
preservam a URL canônica atual, `https://bravia.io/credai`. Antes da publicação,
atualize canonical, alternates, Open Graph, sitemap e a URL do sitemap em
`public/robots.txt` para o endereço definitivo.

`src/googleTracking.ts` conserva o contêiner GTM e o destino GA4 da CredAI
(`G-6BTTD8476P`), condicionado ao consentimento. O destino do Puzzle permanece
explicitamente desativado no contêiner compartilhado. O rastreamento fica limitado aos hosts de produção originais
(`bravia.io` e `www.bravia.io`); inclua o domínio definitivo na lista de hosts e
revise as condições do contêiner GTM antes de ativá-lo nesse endereço.

## GitHub Pages

O workflow `.github/workflows/deploy.yml` testa, compila e publica `dist/` a
cada push na `main`. O caminho base vem do próprio Pages: `/CredAI-website/`
enquanto não houver domínio próprio, e `/` depois que o domínio estiver
configurado. Para ativar, em Settings → Pages escolha Source: GitHub Actions.

Para usar `credai.com`: configure o domínio em Settings → Pages, aponte o DNS
para o GitHub Pages e atualize canonical, Open Graph, sitemap e robots.
`credai.com` e `www.credai.com` já estão na lista de hosts do rastreamento.

// Prefixa o caminho base, para o site funcionar na raiz de um domínio
// (credai.com) ou em um subcaminho (usuario.github.io/CredAI-website/).
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

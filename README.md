# Pedro CPA: Ignition

Crie uma landing page completa, moderna e de alta conversão para "Pedro du CPA", especialista e agente no mercado de casas de apostas, atuando com CPA (Custo Por Aquisição), cooperação e agenciamento de afiliados.



IDENTIDADE VISUAL

- Estilo cyber/casino luxury, dark mode fixo.

- Cores: fundo preto/quase preto (#0D0D0D), destaques em dourado (#E6B800 / #FFD700), texto branco e cinza.

- Tipografia: uma fonte de display forte para títulos (estilo condensada/impactante) + uma sans-serif limpa para o corpo.

- Header fixo com logo "PEDRO CPA" à esquerda e um botão discreto "Área Administrativa" à direita.



ESTRUTURA DA PÁGINA



1. Hero

- Título de impacto destacando resultados reais gerados através do método de CPA em casas de apostas (ex: "+100 mil gerados com CPA").

- Subtítulo explicando que Pedro é agente/especialista em cooperação com casas de apostas, ajudando pessoas a atuarem como afiliados/agentes.

- Botão CTA dourado com brilho/animação levando ao fluxo de qualificação (ver item 4).

- Botão secundário para o Instagram (@pedro_du_cpa).



2. O que é o Método CPA (seção educativa)

- Explicar de forma didática e correta o modelo CPA: o agente/afiliado é remunerado por cada novo usuário real que ele indica e que se cadastra/deposita na casa de apostas.

- Deixar claro que o modelo depende de indicação genuína de terceiros interessados, não de autocadastro.

- 3 cards destacando diferenciais: captação direcionada de público, cooperação direta com plataformas, estrutura para escalar como agente com equipe própria.



3. Galeria de Resultados / Provas Sociais

- Grid responsivo (4 colunas desktop, 2 no mobile) com cards estilo "comprovante": título, valor em destaque, e imagem opcional.

- Os dados da galeria devem vir de um estado/array editável (pensando em um painel admin que gerencia essa lista), não hardcoded.



4. Funil de Qualificação (modal em etapas, antes do redirecionamento)

- Etapa 1: campo de texto "Qual é o seu nome?"

- Etapa 2: seleção única "Você já tem experiência com CPA ou casas de apostas?" (Sim já faturo / Conheço pouco / Não, sou iniciante)

- Etapa 3: seleção única "Qual seu objetivo atual?" (Começar do zero / Aumentar meu faturamento atual / Virar agente/cooperador)

- Etapa final: botão "Finalizar e falar com o Pedro" que monta uma mensagem personalizada (nome + respostas) e abre o WhatsApp (https://wa.me/5519987266236?text=...) em nova aba, além de um link para o Instagram (@pedro_du_cpa).

- Barra de progresso no topo do modal, transições suaves entre etapas.



5. CTA final + Footer

- Seção final reforçando o CTA principal.

- Footer simples com WhatsApp, Instagram e um link discreto para "Área Administrativa".



ÁREA ADMINISTRATIVA (rota /login)

- Tela de login com usuário e senha (mock/local, sem lógica de negócio real de fraude envolvida).

- Após login, painel para adicionar e remover itens da galeria de provas (título, valor, URL de imagem opcional), refletindo em tempo real na página pública.



REQUISITOS TÉCNICOS

- Totalmente responsivo (mobile-first).

- Hover states, sombras douradas sutis, uma animação de destaque no CTA principal.

- Código limpo e componentizado.



IMPORTANTE: não incluir nenhuma seção de biografia/"quem sou eu" pessoal. O foco da página deve ser 100% no método, nos resultados e na conversão do lead. O método CPA deve ser descrito exclusivamente como remuneração por indicação genuína de terceiros — nunca como autocadastro, autodepósito ou qualquer forma de burlar o sistema de comissões da casa de apostas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pedroducpa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ff61e05-8222-42b6-8620-1f53aabd9b55).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

# Landing page Pedro CPA

## Objetivo
Criar uma landing page completa, mobile-first e focada em conversão, com visual cyber/casino luxury inspirado na arte enviada, além de um funil de qualificação e uma área administrativa local para gerenciar provas sociais.

## Implementação
- Criar um sistema visual dark fixo em preto, dourado, branco e cinza, com tipografia condensada de impacto, brilho dourado sutil e animações acessíveis.
- Construir a página principal com header fixo, abertura de impacto, seção educativa do método CPA, três diferenciais, galeria responsiva, chamada final e rodapé.
- Usar a imagem enviada como elemento visual de marca, mantendo foco no método e nos resultados, sem biografia pessoal.
- Criar o funil em modal com três perguntas, barra de progresso, transições, validação e mensagem personalizada para WhatsApp, além do link do Instagram.
- Criar `/login` com acesso local demonstrativo e painel para adicionar/remover provas; os dados serão compartilhados em tempo real com a página pública no mesmo navegador.
- Garantir metadados próprios para a página principal e para o login, estados interativos e boa adaptação a celular e desktop.

## Detalhes técnicos
- Componentes React reutilizáveis para header, modal, galeria e painel.
- Persistência local via `localStorage`, sem autenticação real ou banco de dados.
- Dados iniciais definidos em um array editável e sincronizados por evento local entre abas.
- Rotas TanStack Start em `/` e `/login`.
- Validação final visual em 390 px e desktop, além de checagem dos fluxos principais.

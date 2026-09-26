# Referências públicas em todos os navegadores

## Objetivo
Fazer as referências cadastradas no painel aparecerem para qualquer visitante, inclusive dentro do navegador do Instagram.

## Implementação
- Substituir o armazenamento exclusivo do navegador por dados públicos no Lovable Cloud.
- Manter o painel atual para adicionar e remover referências com título, valor e foto.
- Ao entrar no painel pelo navegador onde as referências antigas foram cadastradas, enviar automaticamente essa lista para a nuvem, preservando as fotos existentes.
- Carregar a galeria pública diretamente da nuvem e atualizar a página após alterações no painel.
- Manter as credenciais administrativas atuais e validar as operações no servidor.
- Exibir estados claros de carregamento e erro sem deixar a seção parecer um template vazio.

## Detalhes técnicos
- Tabela pública somente para leitura dos itens da galeria.
- Escritas feitas por funções protegidas no servidor.
- Fotos armazenadas em um espaço público próprio e seus endereços salvos junto às referências.
- Validação final no painel e na página pública em uma sessão separada, simulando um visitante do Instagram.

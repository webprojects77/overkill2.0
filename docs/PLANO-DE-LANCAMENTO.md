# Plano de lançamento — OVERKILL

## 1. Produto
- [ ] Congelar versão candidata e registrar commit.
- [ ] Conferir README e manual contra comportamento real.
- [ ] Separar recursos atuais dos planejados.
- [ ] Definir navegadores/dispositivos suportados e se o lançamento será beta ou estável.

## 2. Privacidade
- [ ] Confirmar responsável e contato.
- [ ] Identificar hospedagem, DNS, CDN e logs.
- [ ] Revalidar cookies, localStorage, Cache API e requisições externas.
- [ ] Decidir sobre Google Fonts.
- [ ] Finalizar política de privacidade, cookies e termos.
- [ ] Não exibir banner genérico sem identificar tecnologias que o justifiquem.
- [ ] Revisão por adulto responsável e profissional qualificado.

## 3. Segurança
- [ ] Revisar parser, importações, XSS e APIs DOM.
- [ ] Revisar dependências, licenças e segredos.
- [ ] Configurar HTTPS, CSP e cabeçalhos.
- [ ] Testar Service Worker e cache.
- [ ] Definir canal de reporte de vulnerabilidades.

## 4. Qualidade
- [ ] Executar `PLANO-DE-TESTES.md`.
- [ ] Corrigir bugs bloqueadores.
- [ ] Testar dispositivos reais, acessibilidade e responsividade.
- [ ] Verificar desempenho.
- [ ] Fazer backup e documentar rollback.

## 5. Site
- [ ] Página inicial e descrição objetiva.
- [ ] Lista de recursos atuais e planejados.
- [ ] Manual, privacidade, cookies e termos.
- [ ] Créditos, licenças, contato e responsável.
- [ ] Favicon, metadados de compartilhamento e página 404.

## 6. Publicação
- [ ] Configurar domínio, DNS e HTTPS.
- [ ] Testar rotas e arquivos estáticos.
- [ ] Confirmar manifest, ícones e escopo do Service Worker.
- [ ] Testar instalação e offline na URL final.
- [ ] Remover todos os `[PRECISA CONFIRMAR]` dos documentos publicados.
- [ ] Teste final em janela privada e outro dispositivo.
- [ ] Publicar notas da versão e limitações conhecidas.

## 7. Pós-lançamento
- [ ] Acompanhar disponibilidade e relatos.
- [ ] Atualizar dependências e changelog.
- [ ] Revalidar privacidade ao adicionar serviços externos.
- [ ] Manter procedimento de rollback.

## Não bloqueia a primeira versão
Oracle/IA, plugins, geometria avançada, gráficos 3D e outros recursos planejados podem ficar para depois, desde que não sejam anunciados como disponíveis.

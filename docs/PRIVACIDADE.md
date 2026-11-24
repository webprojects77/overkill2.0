# Política de Privacidade — OVERKILL

**RASCUNHO — completar e revisar antes de publicar.**

Última atualização: [PRECISA CONFIRMAR — data]

## 1. Responsável e contato
A OVERKILL é desenvolvida por [PRECISA CONFIRMAR — nome ou entidade responsável].
Contato sobre privacidade: [PRECISA CONFIRMAR — e-mail].
Site oficial: [PRECISA CONFIRMAR — domínio].

## 2. Como funciona
A OVERKILL é uma aplicação matemática executada no navegador. Na versão consultada, não há criação de conta e os cálculos são processados no dispositivo, sem envio das expressões matemáticas a um servidor da aplicação. Isso não significa que nenhum dado técnico seja processado: hospedagem e serviços externos podem receber informações técnicas necessárias à conexão.

## 3. Armazenamento no dispositivo
O código consultado utiliza `localStorage` para manter histórico de cálculos (até 100 entradas no código analisado), preferências, variáveis, fórmulas e notebooks. A chave `overkill:prefs:v1` guarda apenas a escolha de perfil de uso, o tema, a densidade, os módulos fixados nos favoritos e se a tela de boas-vindas já foi vista. O Service Worker/Cache API guarda arquivos da interface para permitir uso offline depois do primeiro carregamento. Esses dados permanecem no navegador até serem apagados pelo usuário, pelo navegador ou por alterações na aplicação. A persistência depende do dispositivo e das configurações do navegador.

## 4. Serviços externos
A página consultada carrega a fonte “Metal Mania” por meio do Google Fonts. Ao solicitar esse recurso, o navegador se conecta a um terceiro, que pode receber dados técnicos da requisição, como endereço IP e informações do navegador.
[PRECISA CONFIRMAR] Verificar se Google Fonts continuará ativo ou se a fonte será hospedada junto da aplicação. Listar aqui todos os demais serviços externos, se existirem.

## 5. Hospedagem e registros técnicos
[PRECISA CONFIRMAR] O provedor de hospedagem pode processar registros técnicos de acesso e segurança, como IP, data/hora, URL solicitada, navegador e informações de erro. Confirmar provedor, dados registrados, finalidade e prazo de retenção. Não afirmar que “nenhum dado é coletado” sem verificar hospedagem, DNS, CDN e monitoramento.

## 6. Cookies e tecnologias semelhantes
Na análise inicial não foi encontrado uso explícito de cookies (`document.cookie`). A aplicação utiliza `localStorage` e Cache API, que não são cookies, mas armazenam informações no dispositivo. Consulte `COOKIES.md`; revalide na versão publicada.

## 7. Compartilhamento
Na versão consultada, não foi identificado envio das expressões e resultados matemáticos para um servidor da OVERKILL. O carregamento da fonte externa e a infraestrutura de hospedagem são situações distintas e devem ser descritas com transparência.
[PRECISA CONFIRMAR] Se forem adicionados Oracle/IA, analytics, publicidade, sincronização, contas, telemetria, formulários ou plugins que transmitam dados, atualizar esta política antes de ativá-los, informando dados, fornecedor, finalidade e controles.

## 8. Exportações
O Notebook oferece exportação de arquivos. Quando o usuário envia um arquivo a outra pessoa ou serviço, o tratamento posterior também depende de quem o recebe. Evite incluir dados pessoais desnecessários.

## 9. Segurança
A aplicação busca adotar medidas compatíveis com o projeto, mas nenhum sistema pode prometer segurança absoluta. [PRECISA CONFIRMAR] Descrever medidas realmente implementadas, como CSP, cabeçalhos HTTP, varredura de dependências e processo de atualização.

## 10. Direitos e contato
Dúvidas ou solicitações relacionadas a dados pessoais: [PRECISA CONFIRMAR — e-mail]. O responsável avaliará solicitações aplicáveis conforme a legislação, incluindo a LGPD quando pertinente.

## 11. Alterações
Esta política poderá ser atualizada. A data da última atualização será indicada no início.

### Pendências antes da publicação
- [ ] Identificar responsável e contato.
- [ ] Identificar hospedagem, DNS, CDN e logs.
- [ ] Confirmar destino da fonte Google Fonts.
- [ ] Testar cookies, armazenamento e requisições na versão de produção.
- [ ] Confirmar ausência/presença de analytics e integrações.
- [ ] Revisão por adulto responsável e profissional qualificado.

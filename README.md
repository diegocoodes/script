<p align="center">
  <img src="./public/logo.png" alt="Logotipo Deyvid Infotech" width="260" />
</p>

<h1 align="center">Sistema Administrativo Deyvid Infotech</h1>

<p align="center">
  Gestão de clientes, equipamentos, ordens de serviço, documentos e fluxo financeiro para assistência técnica.
</p>

## Sobre o projeto

O sistema centraliza o atendimento da Deyvid Infotech em uma aplicação web responsiva. Ele permite acompanhar o cliente desde a entrada do equipamento até a entrega, registrar pagamentos e compras da empresa e gerar documentos relacionados ao serviço.

O projeto utiliza o App Router do Next.js, componentes React, validação com Zod e persistência em PostgreSQL por meio do Prisma ORM.

> Este é um sistema administrativo privado. Antes de utilizar dados reais ou publicar em produção, revise as permissões, credenciais, políticas de backup e requisitos legais aplicáveis ao negócio.

## Funcionalidades implementadas

- Login administrativo com sessão assinada e cookie `httpOnly`.
- Cadastro, busca e exclusão de clientes.
- CPF/CNPJ e e-mail repetidos para novos atendimentos do mesmo cliente.
- Histórico consolidado com quantidade de compras por identidade do cliente.
- Cadastro e consulta de equipamentos recebidos.
- Proteção do segredo de desbloqueio do equipamento com AES-256-GCM.
- Criação de ordens de serviço em etapas.
- Numeração sequencial e transacional das ordens.
- Atualização de status e consulta detalhada dos atendimentos.
- Controle de valores pagos e pendentes por ordem.
- Painel financeiro com ganhos, gastos, saldo e valores a receber.
- Cadastro e histórico de compras e gastos da empresa.
- Geração de ordem de serviço, garantia, recibo e comprovante de entrega.
- Layout responsivo para smartphone, tablet e desktop.

### Módulos em preparação

As páginas de configurações, mensagens automáticas e histórico geral de documentos ainda exibem uma estrutura de próxima etapa. Elas não devem ser tratadas como funcionalidades concluídas.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Aplicação | Next.js 16, React 19 e TypeScript |
| Interface | Tailwind CSS, Base UI, Radix UI e Lucide React |
| Formulários | React Hook Form e Zod |
| Banco de dados | PostgreSQL e Prisma ORM |
| Documentos | jsPDF |
| Qualidade | ESLint e TypeScript em modo estrito |

## Arquitetura

```text
Navegador
  └── Next.js App Router
      ├── Server Components: páginas e consultas
      ├── Client Components: formulários, filtros e interações
      ├── Route Handlers: endpoints internos em /api
      ├── Services: regras de negócio e geração de PDF
      └── Repositories: acesso e serialização dos dados
          └── Prisma ORM
              └── PostgreSQL
```

## Estrutura principal

```text
prisma/
  migrations/       histórico versionado do banco
  schema.prisma     modelos e relacionamentos
  seed.ts           dados locais e primeiro administrador
public/
  logo.png          identidade visual usada no sistema e neste README
src/
  app/              páginas, layouts e Route Handlers
  components/       interface, formulários e documentos
  hooks/            hooks reutilizáveis
  lib/              autenticação, sessão, Prisma e utilitários internos
  repositories/     consultas e mapeamento de dados
  schemas/          validações Zod
  services/         regras de negócio e geração de PDF
  types/            contratos serializáveis
  utils/            máscaras e formatação
```

## Pré-requisitos

- Node.js 22.x.
- npm compatível com o `package-lock.json`.
- PostgreSQL 16 ou superior.
- Docker Desktop opcional para executar o PostgreSQL em contêiner.

## Configuração segura

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie o arquivo local de ambiente:

   ```powershell
   Copy-Item .env.example .env
   ```

   Em Linux ou macOS:

   ```bash
   cp .env.example .env
   ```

3. Gere chaves diferentes para criptografia e sessão:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Execute o comando duas vezes e use valores diferentes em `DATA_ENCRYPTION_KEY` e `SESSION_SECRET`.

4. Defina as variáveis no `.env`:

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | Conexão privada com o PostgreSQL |
| `DATA_ENCRYPTION_KEY` | Chave hexadecimal de 64 caracteres para dados sensíveis |
| `SESSION_SECRET` | Segredo exclusivo para assinatura das sessões |
| `ADMIN_EMAIL` | E-mail permitido no login administrativo |
| `ADMIN_PASSWORD` | Senha forte do administrador |
| `SEED_ADMIN_EMAIL` | E-mail usado somente pelo seed local |
| `SEED_ADMIN_PASSWORD` | Senha usada somente pelo seed local |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação |

Nunca envie o arquivo `.env` ao Git, não reutilize os valores de desenvolvimento em produção e não coloque credenciais em issues, commits, screenshots ou documentação.

## Banco de dados

### Opção A — Docker para desenvolvimento

Com o Docker Desktop funcionando:

```bash
docker compose up -d postgres
docker compose ps
```

O `compose.yaml` é destinado somente ao ambiente local. Não publique sua porta do PostgreSQL na internet e não reutilize a senha local em produção.

Para interromper o contêiner sem apagar os dados:

```bash
docker compose stop postgres
```

### Opção B — PostgreSQL instalado na máquina

Crie um usuário e um banco exclusivos para a aplicação, concedendo apenas as permissões necessárias. Atualize a `DATABASE_URL` privada para apontar para esse banco.

Evite usar o superusuário `postgres` como credencial da aplicação e mantenha o servidor escutando apenas nas interfaces necessárias.

### Aplicar o schema

Gere o Prisma Client e aplique as migrations versionadas:

```bash
npm run db:generate
npx prisma migrate deploy
```

Para preparar um ambiente local novo com o administrador e os dados demonstrativos:

```bash
npm run db:seed
```

> O seed cria dados de demonstração. Revise `prisma/seed.ts` e as variáveis de ambiente antes de executá-lo. Não execute o seed automaticamente em produção.

## Executar localmente

```bash
npm run dev
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

## Verificações de qualidade

Antes de enviar alterações:

```bash
npm run lint
npm run typecheck
npm run build
```

O projeto ainda não possui uma suíte automatizada de testes configurada. Lint, verificação de tipos e build não substituem testes funcionais dos fluxos críticos.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:push` | Sincroniza o schema sem criar migration; use apenas conscientemente em desenvolvimento |
| `npm run db:migrate` | Cria e aplica migrations no desenvolvimento |
| `npm run db:seed` | Executa o seed configurado |
| `npm run db:studio` | Abre o Prisma Studio |

## Produção

1. Configure um PostgreSQL privado com TLS e backup periódico.
2. Cadastre os segredos diretamente no provedor de hospedagem.
3. Use valores exclusivos de produção; nunca copie o `.env` local.
4. Aplique `npx prisma migrate deploy` em uma etapa controlada de release.
5. Execute `npm run build` e verifique os fluxos de login, clientes, ordens, documentos, compras e financeiro.
6. Restrinja o acesso administrativo e monitore falhas de autenticação.

Na Vercel, configure as variáveis no painel do projeto. O script `postinstall` gera o Prisma Client, mas não aplica migrations automaticamente.

## Segurança e privacidade

- O `.gitignore` bloqueia arquivos `.env`, chaves PEM, logs e artefatos de build.
- Senhas do administrador armazenadas pelo seed usam `scrypt` com salt aleatório.
- Sessões são assinadas, expiram e usam cookie `httpOnly`, `sameSite=lax` e `secure` em produção.
- Segredos de desbloqueio de equipamentos são criptografados antes de chegar ao banco.
- Dados de clientes, documentos e equipamentos devem ser tratados como informações privadas.
- Backups devem ser criptografados, testados e armazenados fora do servidor principal.
- Caso um segredo seja exposto, remova-o do histórico quando necessário e faça sua rotação imediatamente.
- Revise autenticação, autorização, auditoria, retenção de dados e requisitos da LGPD antes do uso em produção.

## Assets

O logotipo oficial está em [`public/logo.png`](./public/logo.png). Mantenha a proporção e a transparência ao gerar novas versões. Não substitua assets por materiais de terceiros sem autorização de uso.

## Licença

Este repositório não possui um arquivo de licença de código aberto. A ausência de uma licença não concede permissão automática para copiar, redistribuir ou comercializar o código e os assets. Consulte o proprietário do projeto antes de reutilizá-los.

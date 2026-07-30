# Deyvid Infotech

Sistema administrativo para assistência técnica, desenvolvido com Next.js,
TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Prisma, PostgreSQL e
jsPDF.

## Primeira entrega

- Dashboard com filtros, indicadores, gráfico e ordens recentes.
- Layout administrativo responsivo com menu lateral e drawer no mobile.
- Cadastro e busca de clientes.
- Cadastro e busca de equipamentos, com segredo de desbloqueio criptografado.
- Ordem de serviço em seis etapas, incluindo cadastro inline e assinaturas.
- Numeração sequencial transacional no formato `OS-ANO-000001`.
- Listagem, busca, detalhe, linha do tempo e atualização de status.
- Pré-visualização A4, impressão e PDF da ordem em uma ou duas vias.
- Prisma com os 15 modelos solicitados e seed inicial.

Os módulos de recibos, garantias, comprovantes, mensagens, configurações e
demais PDFs estão sinalizados na interface para as próximas entregas.

## Requisitos

- Node.js 22 ou superior.
- npm.
- PostgreSQL 16+ ou Docker.

## Configuração

1. Copie `.env.example` para `.env`.
2. Gere uma chave de criptografia:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Substitua `DATA_ENCRYPTION_KEY` pelo valor gerado.
4. Altere `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.
5. Inicie o PostgreSQL:

   ```bash
   docker compose up -d
   ```

6. Prepare e popule o banco:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

7. Inicie a aplicação:

   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Deploy na Vercel

1. Importe o repositório `diegocoodes/script` na Vercel.
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL do banco PostgreSQL de produção.
   - `DATA_ENCRYPTION_KEY`: chave hexadecimal de 64 caracteres.
3. Aplique as migrations no banco de produção:

   ```bash
   npx prisma migrate deploy
   ```

4. Publique o projeto. A Vercel detectará o Next.js e executará
   `npm run build`; o script `postinstall` gera o Prisma Client para o
   ambiente Linux da plataforma.

O arquivo `.env` nunca deve ser enviado ao Git. Use `.env.example` apenas como
referência dos nomes esperados.

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

## Estrutura principal

```text
src/
  app/             rotas, páginas e Route Handlers
  components/      interface, formulários, documentos e PDF
  hooks/           hooks reutilizáveis
  lib/             Prisma, criptografia e dados auxiliares
  repositories/    consultas e mapeamento de dados
  schemas/         validação Zod
  services/        regras de negócio e geração de PDF
  types/           contratos serializáveis
  utils/           máscaras e formatação
prisma/
  schema.prisma
  seed.ts
```

## Segurança

- O segredo de desbloqueio do equipamento usa AES-256-GCM e não é retornado nas
  listagens.
- As APIs validam novamente os dados com Zod.
- O seed exige credenciais definidas no ambiente e nunca contém uma senha real.
- Autenticação, recuperação de senha e controle de permissões pertencem à
  próxima etapa e devem ser concluídos antes de publicar o sistema.

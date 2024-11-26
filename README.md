# Introdução

Este repositório fornece o backend para a aplicação interna da LGBTQ+Spacey.

## Requisitos

- Node.js 20.x ou superior

## Instalação

Para instalar o backend, siga os seguintes passos:

1. Clone o repositório:

```bash
git clone https://github.com/LGBTQSpacey/backend.git
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
touch .env
```

Edite o arquivo `.env` e defina as variáveis de ambiente necessárias.

```bash
DB_URI=''
JWT_SECRET=''
SENTRY_DSN=''
```

## Inicie o servidor

```bash
npm run dev
```

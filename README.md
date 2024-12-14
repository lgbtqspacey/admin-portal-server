# Introduction

This repository provides the backend for the LGBTQ+Spacey internal application.

## Requirements

- Node.js 20.x or higher

## Installation

To install the backend, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/lgbtqspacey/admin-portal-server.git
```

2. Install the dependencies:

```bash
npm install
```

3. Set the environment variables:

```bash
touch .env
```

Edit the `.env` file and set the necessary environment variables.

```bash
DB_URI=''
JWT_SECRET=''
SENTRY_DSN=''
```

## Start the server

```bash
npm run dev
```

## Docs

With the server running, open your browser to `http://localhost:3000/api/v1/docs` to view the API documentation.

### Check out the application [here](https://github.com/lgbtqspacey/admin-portal)

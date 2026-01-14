# 📂 DisDrive – Discord‑Powered Cloud Storage  
**A full‑stack web app that lets you store, share, and manage files through a sleek React UI and a Discord‑integrated Cloud storage.**  

[![License](https://img.shields.io/github/license/kaihere14/dis_drive)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)  
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1-47A248?logo=mongodb)](https://www.mongodb.com/)  
[![Discord.js](https://img.shields.io/badge/Discord.js-14.25-7289DA?logo=discord)](https://discord.js.org/)  

[Demo](https://drive.pawpick.store) • [API Docs](#api-documentation) • [Issues](https://github.com/kaihere14/dis_drive/issues)  

---  

## Overview  

//for user there is only ui no cli

DisDrive combines a modern React front‑end with a robust Express/Discord.js back‑end to give you a **personal cloud drive** that lives inside your Discord server.  



* **Upload & download** files of any size (no limit) via a web UI or Discord slash commands.  
* **Secure JWT authentication** – users sign‑in with Discord OAuth or a simple email/password flow.  
* **Real‑time notifications** – the Discord bot posts a confirmation embed whenever a file is uploaded or shared.  
* **MongoDB‑backed storage metadata** – file references, owners, and expiration dates are persisted safely.  

Target audience: developers who want a quick, Discord‑centric file‑sharing solution, hobbyists looking for a self‑hosted “Google Drive”‑like service, and teams that already use Discord for collaboration.  

Current version: **v1.0.0** (stable).  

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **User authentication** | Email/password + JWT, optional Discord OAuth. | ✅ Stable |
| **File upload** | Drag‑and‑drop or button upload (no size limit). | ✅ Stable |
| **File download** | Secure, token‑protected download links. | ✅ Stable |
| **Discord bot integration** | Slash commands: `/upload`, `/list`, `/download`. Bot sends embeds with file info. | ✅ Stable |
| **File metadata** | Owner, size, MIME type, upload date, optional expiry. | ✅ Stable |
| **Responsive UI** | Tailwind‑styled, works on mobile & desktop. | ✅ Stable |
| **Rate limiting** | Prevent abuse of upload/download endpoints. | 🧪 Beta |
| **Docker support** | One‑click containerised deployment. | 🧪 Beta |
| **Webhooks** | Optional Discord webhook notifications for admin actions. | 🔧 Experimental |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Front‑end** | React 19, Vite 7, Tailwind 4, Framer Motion, Lucide‑React, Axios | Fast HMR, utility‑first styling, smooth animations |
| **Back‑end** | Node 20, Express 5, Discord.js 14, Mongoose 9, Multer 2, JWT, CORS, Cookie‑Parser | Modern async API, Discord bot, MongoDB ORM |
| **Database** | MongoDB (Atlas or self‑hosted) | Flexible document storage for file metadata |
| **Auth** | JSON Web Tokens (JWT) + optional Discord OAuth | Stateless, easy to integrate with front‑end |
| **DevOps** | Docker, Nodemon, ESLint, Vite preview | Consistent environments, live reload |
| **Testing** | (none yet – planned) | – |
| **CI/CD** | GitHub Actions (badge placeholder) | – |

---  

## Architecture  

```
root
├─ client/                 # React SPA (Vite)
│   ├─ src/
│   │   ├─ components/     # UI components (Upload, FileCard, Navbar)
│   │   ├─ pages/          # Route pages (Home, Login, Dashboard)
│   │   ├─ context/        # Auth & global state
│   │   └─ hooks/          # Custom React hooks
│   └─ vite.config.js
└─ server/                 # Express API + Discord bot
    ├─ src/
    │   ├─ Controllers/    # Business logic (auth.controller.js, file.controller.js)
    │   ├─ Routes/         # Express routers (auth.routes.js, file.routes.js)
    │   ├─ Models/         # Mongoose schemas (User, File)
    │   ├─ Middlewares/    # auth, error handling, rate limiting
    │   ├─ Utils/          # Helper functions (jwt, discord client)
    │   ├─ db/connectDB.js # MongoDB connection
    │   └─ index.js        # App bootstrap, Discord client init
    └─ upload/             # Temporary folder for Multer uploads (cleared after DB save)
```

* **Client ↔ Server** – The React app talks to the Express API under `/api/*` using Axios. All requests include the JWT in an `Authorization: Bearer <token>` header.  
* **Server ↔ Discord** – The same Node process runs a Discord bot (`discord.js`). Bot commands are registered on startup and call the same service layer used by the HTTP API, guaranteeing identical business rules.  
* **Server ↔ MongoDB** – File metadata lives in the `files` collection; actual binary data is stored on the server’s filesystem (`/upload`) and streamed to the client on demand.  

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| Node.js | 20.x |
| npm or Yarn | 9.x |
| MongoDB | 6.x (local or Atlas) |
| Discord Application | Bot token with `applications.commands` scope |
| Git | 2.30+ |

### Installation  

#### 1. Clone the repo  

```bash
git clone https://github.com/kaihere14/dis_drive.git
cd dis_drive
```

#### 2. Set up the server  

```bash
cd server
npm install          # install dependencies
cp .env.example .env # create env file (see below)
npm run dev          # starts Express + Discord bot (nodemon)
```

#### 3. Set up the client  

```bash
cd ../client
npm install
npm run dev          # Vite dev server at http://localhost:5173
```

The front‑end proxies API calls to `http://localhost:3000` (see `.env` for `FRONTEND_URL`).  

### Configuration  

Create a **`.env`** file in the `server/` directory (do **not** commit it).  

```dotenv
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/disdrive

# JWT
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=7d

# Discord Bot
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_APPLICATION_CLIENT_ID
DISCORD_GUILD_ID=YOUR_GUILD_ID   # optional – for guild‑only commands
```

* `FRONTEND_URL` must match the origin of the React dev server or production URL.  
* `DISCORD_GUILD_ID` limits slash commands to a single server (recommended for testing).  

---  

## Usage  

### 1. Register / Login (Web)  

```bash
# Register
POST http://localhost:3000/api/auth/register
{
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}

# Login
POST http://localhost:3000/api/auth/login
{
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

The response contains a JWT:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

Store the token in `localStorage` (the client does this automatically).  

### 2. Upload a file (Web)  

```bash
POST http://localhost:3000/api/files/upload
Headers:
  Authorization: Bearer <JWT>
Form‑Data:
  file: <binary>
  expiresIn: "30d"   # optional
```

Successful response:

```json
{
  "id": "64b1c2f9e5a4c9d5f8e7a123",
  "filename": "report.pdf",
  "size": 124578,
  "url": "/api/files/64b1c2f9e5a4c9d5f8e7a123/download"
}
```

The Discord bot posts an embed in the configured channel:

> **📁 New file uploaded**  
> *report.pdf* – 122 KB – uploaded by **Alice**  

### 3. Download a file (Web)  

```bash
GET http://localhost:3000/api/files/:id/download
Headers:
  Authorization: Bearer <JWT>
```

The server streams the file with proper `Content‑Disposition`.  

### 4. Discord slash commands  

| Command | Description |
|---------|-------------|
| `/upload` | Attach a file to the command; bot saves it and replies with a download link. |
| `/list` | Shows the last 10 files you own (bot replies with an embed list). |
| `/download <file-id>` | Bot sends you the file as a direct message. |
| `/delete <file-id>` | Remove a file you own (bot confirms deletion). |

*All Discord commands respect the same JWT‑based permission model – the bot internally resolves the Discord user to a stored app user.*  

---  

## Development  

### Server  

```bash
cd server
npm run dev          # nodemon watches src/**/*.js
```

* **Linting** – `npm run lint` (ESLint).  
* **Testing** – currently none; add Jest/Mocha as needed.  

### Client  

```bash
cd client
npm run dev          # Vite dev server
npm run lint         # ESLint
npm run build        # Production bundle in ./dist
```

* **Code style** – Follow the Airbnb React style guide (configured via ESLint).  
* **Hot‑module replacement** – Vite automatically reloads on file changes.  

---  

## Deployment  

### 1. Docker (recommended)  

A `Dockerfile` is provided for the server; the client can be served via any static host (Vite preview, Nginx, Vercel, etc.).  

```dockerfile
# server/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # if you add a build step later

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "src/index.js"]
```

Build & run:

```bash
docker build -t disdrive-server ./server
docker run -d -p 3000:3000 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  -e DISCORD_TOKEN=... \
  disdrive-server
```

### 2. Vercel (client)  

The `client/vercel.json` already configures a static build. Connect the repository to Vercel, set the environment variables (`NEXT_PUBLIC_API_URL` if you rename), and deploy.  

### 3. Production Express  

```bash
npm ci --production
node src/index.js
```

Make sure to enable a reverse proxy (NGINX, Caddy) with TLS termination.  

---  

## API Documentation  

All endpoints are prefixed with `/api`. Responses are JSON unless otherwise noted.  

### Auth  

| Method | Endpoint | Description | Body | Auth |
|--------|----------|-------------|------|------|
| `POST` | `/api/auth/register` | Create a new account | `{email, password}` | ❌ |
| `POST` | `/api/auth/login` | Issue JWT | `{email, password}` | ❌ |
| `GET`  | `/api/auth/me` | Get current user profile | – | ✅ Bearer |

### Files  

| Method | Endpoint | Description | Body / Params | Auth |
|--------|----------|-------------|---------------|------|
| `POST` | `/api/files/upload` | Upload a file (multipart) | `file`, optional `expiresIn` | ✅ |
| `GET`  | `/api/files/:id/download` | Download file stream | – | ✅ |
| `GET`  | `/api/files/:id/meta` | File metadata (owner, size, etc.) | – | ✅ |
| `DELETE` | `/api/files/:id` | Delete owned file | – | ✅ |
| `GET`  | `/api/files` | List files owned by user (query `?page=`) | – | ✅ |

**Error format**

```json
{
  "error": "InvalidCredentials",
  "message": "Email or password is incorrect."
}
```

**Rate limiting** – 60 requests per minute per IP (configurable in `src/middlewares/rateLimiter.js`).  

---  

## Contributing  

1. Fork the repository.  
2. Create a feature branch (`git checkout -b feat/awesome-feature`).  
3. Install dependencies and run the dev servers.  
4. Write tests for new functionality (Jest/Mocha – PRs without tests may be rejected).  
5. Ensure lint passes (`npm run lint`).  
6. Submit a Pull Request with a clear description and reference any related issues.  

### Code style  

* **JavaScript** – ES2022+, use `import`/`export`.  
* **React** – Functional components, hooks, TypeScript optional.  
* **Node** – Async/await, no callbacks.  

### Review checklist  

- [ ] Lint passes (`npm run lint`).  
- [ ] All new endpoints documented in the README.  
- [ ] Environment variables updated in `.env.example` if new ones are added.  
- [ ] Dockerfile rebuilt if new runtime dependencies are required.  

---  

## Troubleshooting  

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| **Server fails to start – “Failed to connect to the database”** | `MONGODB_URI` is wrong or DB is down. | Verify connection string, ensure MongoDB is reachable. |
| **Discord bot does not respond to slash commands** | Bot token missing or intents not enabled. | Check `DISCORD_TOKEN`, enable `applications.commands` and `bot` intents in the Discord developer portal. |
| **File upload returns 413 Payload Too Large** | `express.json` limit or Multer limit too low. | Increase `app.use(express.json({ limit: "20mb" }))` and Multer `limits.fileSize`. |
| **CORS error in browser** | `FRONTEND_URL` mismatch. | Set `FRONTEND_URL` in `.env` to the exact origin (including protocol & port). |
| **Docker container exits immediately** | Missing environment variables. | Pass required `-e` flags or use

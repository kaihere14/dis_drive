# 📂 dis_drive  
**A Discord‑backed file storage service with a sleek React UI**  

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/react-19.2.0-%2361DAFB.svg?logo=react)](https://reactjs.org/)  
[![Express](https://img.shields.io/badge/express-5.2.1-lightgrey.svg)](https://expressjs.com/)  
[![Discord.js](https://img.shields.io/badge/discord.js-14.25.1-7289da.svg?logo=discord)](https://discord.js.org/)  
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?logo=docker)](#deployment)  

**Demo**: <a href="https://dis-drive.vercel.app" target="_blank">https://dis-drive.vercel.app</a> | **Issues**: <a href="https://github.com/kaihere14/dis_drive/issues">GitHub Issues</a> | **Docs**: <a href="PROJECT_DOCUMENTATION.md">Project Documentation</a>  

---  

## Overview  

`dis_drive` lets you **upload any file** through a modern React web UI and stores the file in a Discord channel as an attachment.  
A lightweight Express API handles authentication, file uploads (via Multer), and serves download links that retrieve the file from Discord.  

- **Zero‑cost storage** – leverage Discord’s free attachment limits.  
- **Instant sharing** – each upload returns a short `fileId` that can be used to download the file anywhere.  
- **Self‑hosted** – run the server and client on your own infrastructure, keep your data private.  

Target audience: developers, hobbyists, or small teams that need a quick, free, and shareable file‑hosting solution without relying on third‑party cloud providers.  

Current version: **v1.0.0** (stable).  

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **React UI** | Drag‑and‑drop, progress bar, animated feedback, responsive layout (Tailwind + Framer Motion). | ✅ Stable |
| **Discord storage backend** | Files are uploaded as attachments to a dedicated Discord channel using `discord.js`. | ✅ Stable |
| **JWT authentication** | Secure API endpoints with short‑lived JWT tokens. | ✅ Stable |
| **Mongoose persistence** | Stores file metadata (Discord message ID, original name, size, uploader) in MongoDB. | ✅ Stable |
| **File download endpoint** | `GET /api/files/:id` streams the file directly from Discord to the client. | ✅ Stable |
| **Rate limiting & validation** | Rejects unsupported MIME types, enforces size limits (default 8 MiB – Discord’s limit). | ✅ Stable |
| **Docker support** | Official `Dockerfile` for both client and server. | ✅ Stable |
| **CLI helpers** | `npm run dev`, `npm run build`, `npm run preview` for the client; `npm run dev` (nodemon) for the server. | ✅ Stable |
| **Extensible architecture** | Clear separation of concerns – `controllers`, `middlewares`, `routes`, `models`. | ✅ Stable |
| **Tests (future)** | Placeholder for Jest / Vitest test suite. | 🚧 Planned |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | React 19, Vite 7, Tailwind 4, Framer Motion, Lucide‑React, Axios | Modern, fast, and highly customizable UI |
| **Backend** | Node 20, Express 5, Discord.js 14, Mongoose 9, Multer 2, JWT, CORS, Cookie‑Parser | Robust API + Discord integration |
| **Database** | MongoDB (any hosted or local instance) | Persistent metadata storage |
| **DevOps** | Docker, Vercel (client), Railway/Render (server) | Easy deployment |
| **Testing / Linting** | ESLint, Vitest (planned) | Code quality & future test coverage |
| **Package Management** | npm (workspaces) | Unified dependency handling |

---  

## Architecture  

```
┌─────────────────────┐          ┌─────────────────────┐
│   React Frontend    │  HTTP    │   Express API       │
│ (client/)           │◀──────▶ │ (server/)           │
│                     │          │                     │
│  - Vite dev server  │          │  - /api/upload      │
│  - Tailwind UI      │          │  - /api/files/:id   │
│  - Axios → API      │          │  - Auth middleware  │
└─────────────────────┘          └─────────────────────┘
          │                                 │
          │                                 │
          ▼                                 ▼
   Discord Bot (discord.js)          MongoDB
   (stores files as attachments)   (stores file metadata)
```

### Directory layout  

```
/client
│   vite.config.js
│   package.json
└─ src
   ├─ components/          # UI components (UploadSection, etc.)
   ├─ pages/               # Router pages
   ├─ lib/                 # utils (cn, etc.)
   └─ context/             # React context (auth, theme)

/server
│   src/
│   ├─ controllers/       # Business logic (upload.controller.js, file.controller.js)
│   ├─ middlewares/       # auth, error handling, multer config
│   ├─ models/            # Mongoose schemas (File.js, User.js)
│   ├─ routes/            # Express routers (api.routes.js)
│   ├─ utils/             # helper functions (discordClient.js, jwt.js)
│   └─ index.js           # app bootstrap
│   upload/                # temporary storage for Multer (cleared after Discord upload)
│   .env.example           # sample env file
```

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x |
| **npm** | 10.x (comes with Node) |
| **MongoDB** | 6.x (local or Atlas) |
| **Discord Bot Token** | Create a bot in the Discord Developer Portal and invite it to a server with a dedicated channel for storage. |
| **Git** | any recent version |

### Installation  

#### 1. Clone the repository  

```bash
git clone https://github.com/kaihere14/dis_drive.git
cd dis_drive
```

#### 2. Set up the **server**  

```bash
cd server
npm install          # install dependencies
cp .env.example .env # create a local env file (see below)
npm run dev          # start with nodemon (http://localhost:3000)
```

#### 3. Set up the **client**  

```bash
cd ../client
npm install          # install dependencies
npm run dev          # start Vite dev server (http://localhost:5173)
```

Both services run independently; the client expects the API at `http://localhost:3000/api`.

### Configuration  

Create a **`.env`** file in the `server/` directory (copy from `.env.example`). Example:

```dotenv
# Discord
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_GUILD_ID=YOUR_GUILD_ID
DISCORD_CHANNEL_ID=YOUR_CHANNEL_ID   # channel where files are stored

# JWT
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d                     # token lifetime

# MongoDB
MONGODB_URI=mongodb://localhost:27017/dis_drive

# Server
PORT=3000
BASE_URL=http://localhost:3000        # used for generating download links
```

The client can be pointed at a different API URL by creating a **`.env`** file in `client/` (Vite uses `VITE_` prefix):

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

---  

## Usage  

### 1. Register / Login (optional)  

> **Note**: The current version ships with a **demo JWT** (`demo-token`) for quick testing. In production you should implement a proper auth flow (e.g., Discord OAuth2).  

```bash
# Example: obtain a token via the /api/auth/login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo"}'
```

The response contains:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }
```

Store the token in the browser’s local storage – the React client does this automatically after login.

### 2. Upload a file  

Open the client UI (`http://localhost:5173`). Drag a file onto the **Upload** area or click to select.  

The UI shows:

- Real‑time progress bar  
- Animated status (uploading, success, error)  

Behind the scenes the client calls:

```bash
POST /api/upload
Headers:
  Authorization: Bearer <JWT>
  Content-Type: multipart/form-data
Body:
  file: <binary>
```

A successful response:

```json
{
  "fileId": "a1b2c3d4",
  "originalName": "report.pdf",
  "size": 124578,
  "downloadUrl": "http://localhost:3000/api/files/a1b2c3d4"
}
```

### 3. Download a file  

You can download via the UI or directly with `curl`:

```bash
curl -L -O http://localhost:3000/api/files/a1b2c3d4
```

The server streams the attachment from Discord, preserving the original filename and MIME type.

### 4. Example code snippet (React)  

```tsx
import axios from "axios";

const uploadFile = async (file: File) => {
  const token = localStorage.getItem("token");
  const form = new FormData();
  form.append("file", file);

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/upload`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("Uploaded! ID:", data.fileId);
  return data;
};
```

---  

## Development  

### Server  

```bash
cd server
npm run dev          # nodemon watches src/**/*.js
npm run lint         # eslint (if configured)
```

- **Run tests** (placeholder): `npm test`  
- **Code style**: ESLint (see `eslint.config.js` in client; server uses default).  

### Client  

```bash
cd client
npm run dev          # Vite dev server
npm run lint         # ESLint
npm run build        # production build (outputs to /dist)
npm run preview      # preview built app locally
```

#### Hot‑reloading  

Both Vite and nodemon provide hot‑reload out of the box.  

#### Debugging  

- Server: set `DEBUG=discord:*` to see Discord.js debug logs.  
- Client: use Chrome DevTools; the `motion` components expose animation state via the React Profiler.  

---  

## Deployment  

### Docker (recommended)  

Two Dockerfiles are provided – one for the client, one for the server.

#### Build images  

```bash
# Server
docker build -t disdrive-server ./server

# Client
docker build -t disdrive-client ./client
```

#### Run containers  

```bash
docker network create disdrive-net

docker run -d \
  --name disdrive-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  -v mongo-data:/data/db \
  --network disdrive-net \
  mongo:6

docker run -d \
  --name disdrive-server \
  -p 3000:3000 \
  -e DISCORD_TOKEN=... \
  -e DISCORD_GUILD_ID=... \
  -e DISCORD_CHANNEL_ID=... \
  -e JWT_SECRET=... \
  -e MONGODB_URI=mongodb://root:example@disdrive-mongo:27017/dis_drive \
  --network disdrive-net \
  disdrive-server

docker run -d \
  --name disdrive-client \
  -p 80:80 \
  -e VITE_API_BASE_URL=http://disdrive-server:3000/api \
  --network disdrive-net \
  disdrive-client
```

The client will be reachable at `http://localhost` and the API at `http://localhost:3000/api`.

### Vercel (client) & Railway/Render (server)  

- **Client**: Connect the `client/` folder to Vercel, set the environment variable `VITE_API_BASE_URL` to your server URL.  
- **Server**: Deploy the `server/` folder to Railway, Render, or any Node‑compatible PaaS. Provide the same `.env` variables.  

---  

## API Documentation  

All endpoints are prefixed with **`/api`** and require a valid JWT in the `Authorization` header (`Bearer <token>`).  

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| **POST** | `/api/auth/login` | Simple demo login (replace with real OAuth2) | `{ "username":"demo","password":"demo" }` | `{ "token":"<jwt>" }` |
| **POST** | `/api/upload` | Upload a file (multipart/form‑data) | `file` (binary) | `{ "fileId":"string","originalName":"string","size":number,"downloadUrl":"string" }` |
| **GET** | `/api/files/:id` | Stream the file back to the client | – | File stream (`Content-Type` based on original MIME) |
| **GET** | `/api/files/:id/meta` | Retrieve file metadata (owner, size, uploadedAt) | – | `{ "fileId":"string","originalName":"string","size":number,"uploadedBy":"userId","createdAt":"ISO8601" }` |
| **DELETE** | `/api/files/:id` | Delete a file from Discord and DB (owner only) | – | `{ "deleted":true }` |

### Error handling  

- **401 Unauthorized** – missing/invalid JWT.  
- **400 Bad Request** – validation errors (e.g., file too large, unsupported MIME).  
- **404 Not Found** – file ID does not exist.  
- **500 Internal Server Error** – unexpected failures (Discord API, DB).  

All error responses follow:

```json
{
  "error": "Human readable message",
  "code": "ERROR_CODE"
}
```

---  

## Contributing  

1. **Fork** the repository.  
2. **Create a feature branch** (`git checkout -b feat/awesome-feature`).  
3. **Install dependencies** (see *Getting Started*).  
4. **Make your changes** – keep the existing coding style (ESLint, Prettier).  
5. **Run lint & tests** (`npm run lint` in both `client` and `server`).  
6. **Commit** with a clear message (`git commit -m "feat: add XYZ"`).  
7. **Push** and open a **Pull Request** against `main`.  

### Development workflow  

- **Server**: `npm run dev` watches for changes.  
- **Client**: `npm run dev` hot‑reloads UI.  

### Code review guidelines  

- Ensure **type safety** (add JSDoc or TypeScript where possible).  
- Keep **API contracts** backward compatible.  
- Write **unit tests** for new controller logic (Jest recommended).  
- Update **README** and **PROJECT_DOCUMENTATION.md** if you add public features.  

---  

## Troubleshooting  

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| **“Cannot read property `token` of undefined”** (client) | Missing `VITE_API_BASE_URL` env variable. | Add `VITE_API_BASE_URL` to `client/.env`.
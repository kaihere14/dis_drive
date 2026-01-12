# 📂 DisDrive – Discord‑Powered File Storage  

[![License](https://img.shields.io/github/license/kaihere14/dis_drive)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)  
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1.2-47A248?logo=mongodb)](https://www.mongodb.com/)  
[![Discord.js](https://img.shields.io/badge/Discord.js-14.25.1-5865F2?logo=discord)](https://discord.js.org/)  

**Live demo:** https://drive.pawpick.store (if deployed)  
**Issues:** https://github.com/kaihere14/dis_drive/issues  
**Docs:** https://github.com/kaihere14/dis_drive/wiki 

---  

## Overview  

DisDrive is a **Discord‑integrated file‑storage service** that lets users upload, share, and manage files directly from a web UI while authenticating through Discord. The backend runs on **Node/Express**, stores metadata in **MongoDB**, and uses **Discord OAuth** + **JWT** for secure authentication. The frontend is a modern **React 19** single‑page app built with **Vite** and styled with **Tailwind CSS**.

*Why DisDrive?*  
- Leverage an existing Discord community for authentication – no extra login system.  
- Simple drag‑and‑drop UI with real‑time progress and confetti celebrations.  
- Scalable storage backed by MongoDB and the local filesystem (or any cloud bucket).  

Target audience: developers who want a quick, Discord‑based file‑sharing portal for their community or team.

Current version: **v1.0.0** (both client and server).

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **Discord OAuth** | Users sign‑in with their Discord account; JWT issued for API calls. | ✅ Stable |
| **File upload & download** | Drag‑and‑drop, progress bar, size limit 10 MB (configurable). | ✅ Stable |
| **Folder‑like view** | Grid/list view of uploaded files with preview thumbnails. | ✅ Stable |
| **Real‑time confetti** | Celebrate successful uploads with `canvas-confetti`. | ✅ Stable |
| **Responsive UI** | Tailwind‑styled components work on mobile & desktop. | ✅ Stable |
| **Rate limiting** | Basic per‑user request throttling (future work). | 🟡 Beta |
| **Cloud storage adapters** | Plug‑in architecture to replace local `upload/` folder with S3, GCS, etc. | 🟡 Experimental |
| **Admin dashboard** | View all users/files, revoke tokens, delete files. | ❌ Not implemented yet |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios, Framer Motion, Lucide‑React, Canvas‑Confetti | Fast dev server, modern React features, utility‑first styling, smooth animations |
| **Backend** | Node 20, Express 5, Discord.js 14, Mongoose 9, Multer 2, JWT, Cookie‑Parser, CORS, dotenv | Minimal boilerplate, powerful Discord API, MongoDB ODM, file handling |
| **Database** | MongoDB (cloud or local) | Flexible schema for user & file metadata |
| **Auth** | Discord OAuth → JWT (stateless) | Leverages Discord’s identity, avoids password storage |
| **DevOps** | Nodemon (dev), Vite (frontend), Docker (optional) | Hot‑reloading, fast builds, container‑ready |
| **Testing** | (none yet – planned with Jest & React Testing Library) | – |

---  

## Architecture  

```
┌─────────────────────┐          ┌─────────────────────┐
│   React Frontend    │  HTTPS   │   Express API Server│
│ (client/)           │◀──────▶│ (server/)            │
└─────────┬───────────┘          └───────┬─────────────┘
          │                               │
          │   JWT (Authorization Header) │
          ▼                               ▼
   ┌───────────────┐               ┌───────────────┐
   │  Discord OAuth│               │   MongoDB     │
   │  (discord.js) │               │ (user, file) │
   └───────┬───────┘               └───────┬───────┘
           │                               │
           ▼                               ▼
   ┌─────────────────┐            ┌─────────────────┐
   │   File Storage  │            │   Controllers   │
   │   (upload/)     │            │ (user, file)    │
   └─────────────────┘            └─────────────────┘
```

**Directory layout**

```
/client
  ├─ src/
  │   ├─ components/      # UI components
  │   ├─ pages/           # Route pages (Home, Dashboard, Login)
  │   ├─ context/         # Auth & global state
  │   └─ hooks/           # Custom React hooks
  └─ vite.config.js

/server
  ├─ src/
  │   ├─ Models/          # Mongoose schemas (User, File)
  │   ├─ controllers/    # Business logic
  │   ├─ routes/          # Express routers (auth, files)
  │   ├─ middlewares/    # JWT verification, error handling
  │   ├─ db/connectDB.js  # MongoDB connection
  │   └─ utils/           # Helper functions
  └─ upload/               # Local file storage (can be replaced)
```

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| Node.js | 20.x |
| npm or yarn | 9.x |
| MongoDB | 6.x (local or Atlas) |
| Discord Application | Created in the Discord Developer Portal (OAuth2) |
| Git | 2.30+ |

### Installation  

#### 1. Clone the repository  

```bash
git clone https://github.com/kaihere14/dis_drive.git
cd dis_drive
```

#### 2. Set up the **server**  

```bash
cd server
npm install               # install dependencies
cp .env.example .env      # create env file (see below)
npm run dev               # starts server with nodemon (http://localhost:3000)
```

#### 3. Set up the **client**  

```bash
cd ../client
npm install               # install dependencies
cp .env.example .env      # create env file (see below)
npm run dev               # Vite dev server (http://localhost:5173)
```

Both servers will hot‑reload on file changes.

### Configuration  

Create a `.env` file in **server/** (copy from `.env.example` if present) with the following keys:

```dotenv
# Server
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/disdrive?retryWrites=true&w=majority
JWT_SECRET=yourSuperSecretKey
DISCORD_CLIENT_ID=yourDiscordAppClientID
DISCORD_CLIENT_SECRET=yourDiscordAppClientSecret
DISCORD_BOT_TOKEN=yourDiscordBotToken
FRONTEND_URL=http://localhost:5173   # must match Vite dev URL or production URL
```

Create a `.env` file in **client/** (Vite automatically prefixes with `VITE_`):

```dotenv
VITE_API_URL=http://localhost:3000/api   # points to the Express API
```

> **Tip:** When deploying, set the same variables in your hosting environment (Vercel, Render, Railway, etc.).

---  

## Usage  

### 1. Run locally  

```bash
# Terminal 1 – API
cd server && npm run dev

# Terminal 2 – Frontend
cd client && npm run dev
```

Open `http://localhost:5173` in a browser. Click **Login with Discord**, authorize the app, and you’ll be redirected back to the UI. You can now drag files onto the upload area or click to select them.

### 2. API examples  

#### Register / Login (Discord OAuth flow)  

The frontend handles the OAuth redirect. The server exposes the callback at:

```
GET /api/auth/discord/callback?code=...
```

It exchanges the `code` for a Discord token, creates/updates a user in MongoDB, and returns a signed JWT.

#### Upload a file (authenticated)  

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@/path/to/your/file.pdf"
```

Response:

```json
{
  "success": true,
  "file": {
    "id": "64b8f2c9e9a1c2d5f8a1b2c3",
    "originalName": "file.pdf",
    "size": 124578,
    "url": "/uploads/64b8f2c9e9a1c2d5f8a1b2c3.pdf",
    "uploadedAt": "2024-07-15T12:34:56.789Z"
  }
}
```

#### List user files  

```bash
curl -X GET http://localhost:3000/api/files \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Delete a file  

```bash
curl -X DELETE http://localhost:3000/api/files/64b8f2c9e9a1c2d5f8a1b2c3 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 3. Production build  

```bash
# Build client
cd client
npm run build   # outputs to client/dist

# Serve static files with Express (optional)
# In server/src/index.js add:
# app.use(express.static("../client/dist"));
```

Deploy the `server/` folder (including the built `client/dist`) to any Node‑compatible host (Vercel, Railway, Render, DigitalOcean, etc.). Ensure environment variables are set in the host.

---  

## Development  

| Task | Command |
|------|---------|
| Start backend with hot‑reload | `npm run dev` (inside `server/`) |
| Start frontend dev server | `npm run dev` (inside `client/`) |
| Run ESLint (client) | `npm run lint` |
| Run tests (none yet) | `npm test` |
| Build client for production | `npm run build` |
| Format code (prettier not installed yet) | `npx prettier --write .` |

### Code style  

- **JavaScript**: ES2022 modules, `const`/`let`, async/await.  
- **React**: Functional components, hooks, TypeScript not used yet but can be added.  
- **Linting**: ESLint with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.  

### Debugging  

- Backend logs appear in the terminal where `npm run dev` is executed.  
- Frontend console shows API errors; inspect network tab for request/response details.  
- Use `DEBUG=express:*` to get verbose Express logs.  

---  

## Deployment  

### Docker (recommended)  

```dockerfile
# Dockerfile (root of repository)
FROM node:20-alpine AS builder

# ---- Build client ----
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ---- Build server ----
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
COPY --from=builder /app/client/dist ./public   # serve static files

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
```

Build & run:

```bash
docker build -t disdrive .
docker run -d -p 3000:3000 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  -e DISCORD_CLIENT_ID=... \
  -e DISCORD_CLIENT_SECRET=... \
  -e DISCORD_BOT_TOKEN=... \
  -e FRONTEND_URL=https://yourdomain.com \
  disdrive
```

### Vercel / Render  

- Deploy the **server** folder as a Node.js project.  
- Set the environment variables in the dashboard.  
- Vite’s `vercel.json` already configures static file handling for the client.  

### Performance tips  

- Enable gzip compression (`compression` middleware) for static assets.  
- Use MongoDB indexes on `userId` and `createdAt` for fast file queries.  
- Store files on a CDN or cloud bucket for large scale (replace `upload/` with S3 adapter).  

---  

## API Documentation  

### Auth  

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/auth/discord` | Redirects to Discord OAuth consent screen. | ❌ |
| `GET` | `/api/auth/discord/callback` | Handles Discord callback, returns JWT in JSON. | ❌ |
| `POST` | `/api/auth/logout` | Clears auth cookie (if using cookies). | ✅ JWT |

### Files  

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/files/upload` | Upload a single file (multipart/form-data). Max 10 MB. | ✅ JWT |
| `GET` | `/api/files` | List all files belonging to the authenticated user. | ✅ JWT |
| `GET` | `/api/files/:id` | Download a file by its ID. | ✅ JWT |
| `DELETE` | `/api/files/:id` | Delete a file (removes from DB & storage). | ✅ JWT |

#### Request / Response examples  

**Upload**

```http
POST /api/files/upload HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="file"; filename="cat.png"
Content-Type: image/png

<binary data>
------WebKitFormBoundary...
```

**Success response**

```json
{
  "success": true,
  "file": {
    "id": "64c0a1e2f9b7d2e5a0c3d4f6",
    "originalName": "cat.png",
    "size": 245678,
    "url": "/uploads/64c0a1e2f9b7d2e5a0c3d4f6.png",
    "uploadedAt": "2024-07-20T09:12:34.567Z"
  }
}
```

**Error codes**

| Code | Meaning |
|------|---------|
| `401` | Missing/invalid JWT |
| `400` | Validation error (e.g., file too large) |
| `500` | Server error (e.g., DB connection failure) |

---  

## Contributing  

We welcome contributions! Please follow these steps:

1. **Fork** the repository and clone your fork.  
2. **Create a feature branch**: `git checkout -b feat/awesome-feature`.  
3. **Install dependencies** (`npm install` in both `client/` and `server/`).  
4. **Make your changes** – keep linting clean (`npm run lint`).  
5. **Write tests** (Jest for backend, React Testing Library for frontend) if applicable.  
6. **Commit** with a clear message: `git commit -m "feat: add awesome feature"`.  
7. **Push** to your fork and open a **Pull Request** against `main`.  

### Code review guidelines  

- Keep code **readable** and **well‑documented**.  
- Prefer **async/await** over callbacks.  
- Validate all external input (file size, MIME type).  
- Update the README if you add new public endpoints or UI flows.  

### Development workflow  

- Backend: `npm run dev` (nodemon) – auto‑restarts on changes.  
- Frontend: `npm run dev` (Vite) – hot‑module replacement.  

---  

## Troubleshooting  

| Issue | Solution |
|-------|----------|
| **Server cannot connect to MongoDB** | Verify `MONGODB_URI` is correct, ensure network access, and that the DB user has read

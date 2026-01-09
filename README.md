# Discord Storage

Discord Storage uses a Discord channel as a backend storage medium: files are split into chunks, uploaded as Discord message attachments by a bot, and reassembled on download. This repository contains a React frontend and an Express backend (with a Discord bot integration and MongoDB metadata storage).

## Key Features

- Chunked uploads (client-side chunking)
- Store chunks as Discord message attachments
- Metadata and ownership stored in MongoDB
- Google OAuth + JWT authentication (7d tokens)
- Streaming downloads (reassemble chunks on-the-fly)

## Architecture

- Frontend: React + Vite
- Backend: Node.js + Express
- Discord Bot: discord.js (sends/retrieves attachments)
- Database: MongoDB (Mongoose models for users and file metadata)

## Quickstart (Local)

Prerequisites:

- Node.js (v18+)
- npm
- MongoDB instance (Atlas or local)

1. Backend

```bash
cd server
npm install
# Start in dev mode (nodemon)
npm run dev
```

2. Frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend dev server (Vite shows the URL, typically http://localhost:5173) and the backend at http://localhost:3000.

## Environment Variables

Create a `.env` in `server/` with at least the following:

```env
MONGO_URI=your_mongo_connection_string
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=channel_id_for_storage
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

On the frontend, set `VITE_BACKEND_URL` in `client/.env` (for dev):

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Important Endpoints

- `GET /api/auth/google/redirect` — start Google OAuth
- `GET /api/auth/google/callback` — OAuth callback (redirects to frontend with token)
- `GET /api/auth/verify` — verify JWT and fetch user (protected)
- `POST /api/files/upload/init` — initialize an upload (protected)
- `POST /api/files/upload/chunk` — upload a single chunk (multipart/form-data)
- `GET /api/files/download/:fileId` — download a file (streams chunks)
- `GET /api/files/list` — list authenticated user's files (protected)
- `DELETE /api/files/delete` — delete file(s) (protected, ownership-checked)

Refer to `PROJECT_DOCUMENTATION.md` for full API examples and payload shapes.

## Security Notes

- Google OAuth + JWT are implemented. Some endpoints (chunk upload, download, filedata) are currently public — consider protecting them with `verifyJWT` if you require strict access control.
- Add rate limiting and server-side file validation before using in production.
- Keep `JWT_SECRET` and other secrets out of source control. Use secret management in production.

## Deployment

- Backend: Server can be deployed to serverless providers (Vercel with a `vercel.json`), but note serverless body size and execution limits — reduce chunk size accordingly (2MB recommended for serverless).
- Frontend: Build with `npm run build` in `client/` and host on Vercel/Netlify.

## Contributing

See `PROJECT_DOCUMENTATION.md` for development notes, testing checklist, and recommended improvements.

## License & Disclaimer

This project is provided as-is for educational purposes. Using Discord as storage may violate Discord's Terms of Service — evaluate suitability before production use.

---

Last updated: January 9, 2026

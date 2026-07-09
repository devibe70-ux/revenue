# Project Rules: Unified Revenue Dashboard

## Architecture and Database Choice
This project is built as a native Windows desktop application (Tauri). Due to issues with Docker Desktop on the host machine, **DO NOT** use Docker, PostgreSQL, or Redis. 
Always stick to the native, zero-dependency architecture:
1. **Database:** Use **Firebase Firestore** exclusively for data storage. Do not use Prisma or SQLite, as native binaries can cause build issues on desktop bundlers.
2. **Background Workers:** Use native Node.js `setInterval` polling in `syncWorker.ts` instead of BullMQ/Redis.

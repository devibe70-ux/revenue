import Fastify from 'fastify';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { runSyncJob } from './workers/syncWorker';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { initFirebaseAdmin, db } from './lib/firebaseAdmin';

dotenv.config();

// Initialize Firebase Admin (Using .env credentials)
initFirebaseAdmin();

const fastify = Fastify({ logger: true });

// --- SECURITY PROTOCOLS ---

// 1. Helmet: Sets secure HTTP headers to prevent XSS, Clickjacking, and sniffing
fastify.register(helmet);

// 2. CORS: Restrict API access to our trusted Origins (Web, Tauri, and Mobile)
fastify.register(cors, {
  origin: ['http://localhost:8081', 'tauri://localhost', 'https://revenuedashboard.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

// 3. Rate Limiter: Prevent DDoS attacks and hacker pings
fastify.register(rateLimit, {
  max: 100, // Limit each IP to 100 requests
  timeWindow: '15 minutes', 
  errorResponseBuilder: function (request, context) {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Security Alert: You have exceeded the API rate limit. Your IP has been temporarily blocked.'
    }
  }
});

// --- ROUTES ---

// Register routes
fastify.register(authRoutes);

fastify.get('/api/health', async (request, reply) => {
  return { status: 'secure-ok', timestamp: new Date().toISOString() };
});

// Manual trigger endpoint for testing native worker
fastify.post('/api/sync/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    
    // Run the sync job asynchronously without awaiting, mimicking a background queue
    runSyncJob(userId).catch(err => fastify.log.error(`Sync job failed: ${err}`));
    
    return reply.send({ message: 'Sync job triggered', userId });
});

// Start native polling interval for all active users every 15 minutes (900000 ms)
setInterval(async () => {
    try {
        if (!db) return;
        const usersSnapshot = await db.collection('users').get();
        for (const doc of usersSnapshot.docs) {
            await runSyncJob(doc.id);
        }
    } catch (err) {
        fastify.log.error('Native polling error', err);
    }
}, 900000);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${port} with SECURITY PROTOCOLS ENABLED`);
    fastify.log.info(`Native polling worker initialized (15m interval)`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

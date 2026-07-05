import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import authRoutes from './routes/auth';
import './workers/syncWorker'; // Import to initialize worker

dotenv.config();

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

// Background job queue initialization
export const syncQueue = new Queue('syncQueue', { connection: redisConnection as any });

// Register routes
fastify.register(authRoutes);

fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Manual trigger endpoint for testing BullMQ worker
fastify.post('/api/sync/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    await syncQueue.add('manual-sync', { userId });
    return reply.send({ message: 'Sync job queued', userId });
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

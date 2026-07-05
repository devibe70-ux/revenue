import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { decryptToken } from '../services/crypto';
import { adaptYouTubePayload, adaptAmazonPayload } from '../services/adapters';

const prisma = new PrismaClient();
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

export const syncWorker = new Worker('syncQueue', async (job: Job) => {
    console.log(`[Worker] Starting sync job ${job.id} for user ${job.data.userId}`);
    
    // 1. Fetch active integrations for the user
    const integrations = await prisma.platformIntegration.findMany({
        where: { userId: job.data.userId, status: 'active' }
    });

    for (const integration of integrations) {
        console.log(`[Worker] Syncing ${integration.platformName} (ID: ${integration.id})`);
        
        try {
            // 2. Securely decrypt token (Mock token validation)
            const accessToken = decryptToken(integration.encryptedAccessToken);
            
            // If token expires soon, we would refresh it here. 
            // We'll skip token refresh logic for this mock implementation.
            
            // 3. Fetch mock data based on platform
            let rawData;
            let normalizedData;

            if (integration.platformName === 'youtube') {
                rawData = { estimatedRevenue: 1500, currency: 'USD', revenueType: 'ad_revenue' };
                normalizedData = adaptYouTubePayload(rawData);
            } else if (integration.platformName === 'amazon') {
                rawData = { grossSales: 5000, fbaFees: 1200, currency: 'USD' };
                normalizedData = adaptAmazonPayload(rawData);
            } else {
                continue; // Skip unknown platforms
            }

            // 4. Save normalized payload to DB
            await prisma.revenueRecord.create({
                data: {
                    userId: integration.userId,
                    integrationId: integration.id,
                    platform: normalizedData.platform,
                    streamType: normalizedData.streamType,
                    grossAmount: normalizedData.grossAmount,
                    currency: normalizedData.currency,
                    exchangeRateToBase: normalizedData.exchangeRateToBase,
                    netSettledAmount: normalizedData.netSettledAmount,
                    payoutStatus: normalizedData.payoutStatus,
                    estimatedPayoutDate: normalizedData.estimatedPayoutDate,
                    timestamp: normalizedData.timestamp
                }
            });

            console.log(`[Worker] Successfully synced ${integration.platformName}`);
        } catch (err) {
            console.error(`[Worker] Failed to sync ${integration.platformName}:`, err);
        }
    }

    return { status: 'success' };
}, { connection: redisConnection as any });

syncWorker.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
});

syncWorker.on('failed', (job, err) => {
    console.log(`Job with id ${job?.id} has failed with ${err.message}`);
});

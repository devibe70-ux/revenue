import { decryptToken } from '../services/crypto';
import { adaptYouTubePayload, adaptAmazonPayload } from '../services/adapters';
import { db } from '../lib/firebaseAdmin';

// Sync worker using Firebase Firestore instead of Prisma
export async function runSyncJob(userId: string) {
    if (!db) {
        console.error(`[Worker] Firebase DB not initialized. Aborting sync for ${userId}`);
        return { status: 'error', message: 'Firebase not initialized' };
    }

    console.log(`[Worker] Starting native sync job for user ${userId}`);
    
    try {
        // 1. Fetch active integrations for the user from Firestore
        const integrationsRef = db.collection('platform_integrations');
        const snapshot = await integrationsRef
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .get();

        if (snapshot.empty) {
            console.log(`[Worker] No active integrations found for user ${userId}`);
            return { status: 'success' };
        }

        for (const doc of snapshot.docs) {
            const integration = doc.data();
            console.log(`[Worker] Syncing ${integration.platformName} (ID: ${doc.id})`);
            
            try {
                // 2. Securely decrypt token (Mock token validation)
                const accessToken = decryptToken(integration.encryptedAccessToken);
                
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

                // 4. Save normalized payload to Firestore
                await db.collection('revenue_records').add({
                    userId: userId,
                    integrationId: doc.id,
                    platform: normalizedData.platform,
                    streamType: normalizedData.streamType,
                    grossAmount: normalizedData.grossAmount,
                    currency: normalizedData.currency,
                    exchangeRateToBase: normalizedData.exchangeRateToBase,
                    netSettledAmount: normalizedData.netSettledAmount,
                    payoutStatus: normalizedData.payoutStatus,
                    estimatedPayoutDate: normalizedData.estimatedPayoutDate ? new Date(normalizedData.estimatedPayoutDate).toISOString() : null,
                    timestamp: new Date(normalizedData.timestamp).toISOString(),
                    createdAt: new Date().toISOString()
                });

                console.log(`[Worker] Successfully synced ${integration.platformName}`);
            } catch (err) {
                console.error(`[Worker] Failed to sync ${integration.platformName}:`, err);
            }
        }

        return { status: 'success' };
    } catch (error) {
        console.error(`[Worker] Critical error during sync job for ${userId}:`, error);
        return { status: 'error' };
    }
}

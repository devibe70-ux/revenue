import { FastifyInstance } from 'fastify';
import { db } from '../lib/firebaseAdmin';
import { encryptToken } from '../services/crypto';

export default async function authRoutes(fastify: FastifyInstance) {
    
    // Mock OAuth Initiation
    fastify.get('/api/auth/:platform/login', async (request, reply) => {
        const { platform } = request.params as { platform: string };
        // Redirect to provider...
        return reply.redirect(`/api/auth/${platform}/callback?code=mock_auth_code_12345`);
    });

    // Mock OAuth Callback & Token Exchange
    fastify.get('/api/auth/:platform/callback', async (request, reply) => {
        const { platform } = request.params as { platform: string };
        const { code } = request.query as { code: string };

        if (!code) {
            return reply.status(400).send({ error: 'Missing authorization code' });
        }

        // 1. Exchange code for tokens (Mock)
        const mockAccessToken = `mock_access_token_${platform}_${Date.now()}`;
        const mockRefreshToken = `mock_refresh_token_${platform}_${Date.now()}`;
        const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        // 2. Encrypt tokens before storing
        const encryptedAccess = encryptToken(mockAccessToken);
        const encryptedRefresh = encryptToken(mockRefreshToken);

        // For this demo, let's assume a static user id
        const demoUserId = 'demo_user_123';

        // 3. Upsert Integration into Firebase
        const integrationRef = db.collection('integrations').doc(`${demoUserId}_${platform}`);
        await integrationRef.set({
            userId: demoUserId,
            platformName: platform,
            encryptedAccessToken: encryptedAccess,
            encryptedRefreshToken: encryptedRefresh,
            tokenExpiresAt: expiresAt,
            status: 'active',
            updatedAt: new Date()
        });

        return reply.send({
            message: `Successfully connected ${platform}`,
            integrationId: integrationRef.id
        });
    });
}

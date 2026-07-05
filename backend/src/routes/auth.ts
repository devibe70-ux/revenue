import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { encryptToken } from '../services/crypto';

const prisma = new PrismaClient();

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

        // For this demo, let's assume a static user id or create a mock user
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `demo_${Date.now()}@revenudashboard.local`
                }
            });
        }

        // 3. Upsert Integration
        const integration = await prisma.platformIntegration.create({
            data: {
                userId: user.id,
                platformName: platform,
                encryptedAccessToken: encryptedAccess,
                encryptedRefreshToken: encryptedRefresh,
                tokenExpiresAt: expiresAt,
                status: 'active'
            }
        });

        return reply.send({
            message: `Successfully connected ${platform}`,
            integrationId: integration.id
        });
    });
}

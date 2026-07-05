import { Prisma } from '@prisma/client';

export interface BaseRevenueRecord {
    platform: string;
    streamType: string;
    grossAmount: number;
    currency: string;
    exchangeRateToBase: number;
    netSettledAmount: number;
    payoutStatus: string;
    estimatedPayoutDate: Date | null;
    timestamp: Date;
}

/**
 * Normalizes a YouTube/AdSense raw payload into the canonical data contract
 */
export function adaptYouTubePayload(rawData: any): BaseRevenueRecord {
    // In a real scenario, map fields dynamically based on the YouTube Analytics API
    return {
        platform: 'youtube',
        streamType: rawData.revenueType || 'ad_revenue',
        grossAmount: rawData.estimatedRevenue,
        currency: rawData.currency || 'USD',
        exchangeRateToBase: 1.0,
        netSettledAmount: rawData.estimatedRevenue * 0.55, // Typical YT creator split
        payoutStatus: 'pending',
        estimatedPayoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next month
        timestamp: new Date()
    };
}

/**
 * Normalizes an Amazon SP-API payload into the canonical data contract
 */
export function adaptAmazonPayload(rawData: any): BaseRevenueRecord {
    return {
        platform: 'amazon',
        streamType: 'direct_sales',
        grossAmount: rawData.grossSales,
        currency: rawData.currency || 'USD',
        exchangeRateToBase: 1.0,
        netSettledAmount: rawData.grossSales - (rawData.fbaFees || 0),
        payoutStatus: 'processing',
        estimatedPayoutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        timestamp: new Date()
    };
}

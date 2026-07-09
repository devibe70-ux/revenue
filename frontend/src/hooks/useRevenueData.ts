import { useQuery } from '@tanstack/react-query';
import { DateRange } from '../components/DateRangeSelector';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const fetchTimeSeries = async (range: DateRange, userId?: string) => {
  if (!userId) {
    return { timeline: [] };
  }

  // Define date threshold based on range
  const today = new Date();
  let days = 30;
  if (range === '1D') days = 1;
  else if (range === '1M') days = 30;
  else if (range === '3M') days = 90;
  else if (range === '1Y') days = 365;
  else if (range === 'Custom') days = 14;

  const cutoff = new Date(today.getTime());
  cutoff.setDate(cutoff.getDate() - days);

  const q = query(
    collection(db, 'revenue_records'),
    where('userId', '==', userId),
    where('timestamp', '>=', cutoff.toISOString()),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const records = snapshot.docs.map(doc => doc.data());

  // Aggregate by Date
  const aggregatedByDate: Record<string, any> = {};

  records.forEach(record => {
    const dateKey = record.timestamp.split('T')[0];
    if (!aggregatedByDate[dateKey]) {
      aggregatedByDate[dateKey] = {
        date: dateKey,
        total_gross: 0,
        total_net: 0,
        breakdown: {
          youtube: 0,
          amazon: 0
        }
      };
    }

    aggregatedByDate[dateKey].total_gross += record.grossAmount || 0;
    aggregatedByDate[dateKey].total_net += record.netSettledAmount || record.grossAmount || 0;
    
    if (record.platform === 'youtube') {
      aggregatedByDate[dateKey].breakdown.youtube += record.netSettledAmount || record.grossAmount || 0;
    } else if (record.platform === 'amazon') {
      aggregatedByDate[dateKey].breakdown.amazon += record.netSettledAmount || record.grossAmount || 0;
    }
  });

  const timeline = Object.values(aggregatedByDate).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    metric: "net_revenue",
    base_currency: "USD",
    timeline: timeline
  };
};

const fetchAllocation = async (userId?: string) => {
  if (!userId) {
    return {
      total_combined_net: 0,
      distribution: []
    };
  }

  // Get current month allocation
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  const q = query(
    collection(db, 'revenue_records'),
    where('userId', '==', userId),
    where('timestamp', '>=', firstDayOfMonth)
  );

  const snapshot = await getDocs(q);
  const records = snapshot.docs.map(doc => doc.data());

  let totalNet = 0;
  let amazonNet = 0;
  let youtubeNet = 0;

  records.forEach(record => {
    const amt = record.netSettledAmount || record.grossAmount || 0;
    totalNet += amt;
    if (record.platform === 'youtube') youtubeNet += amt;
    else if (record.platform === 'amazon') amazonNet += amt;
  });

  return {
    time_frame: "current_month",
    total_combined_net: totalNet,
    distribution: [
      { platform: "amazon", net_amount: amazonNet, percentage: totalNet > 0 ? (amazonNet / totalNet) * 100 : 0 },
      { platform: "youtube", net_amount: youtubeNet, percentage: totalNet > 0 ? (youtubeNet / totalNet) * 100 : 0 }
    ]
  };
};

export function useRevenueTimeSeries(range: DateRange = '1M', userId?: string) {
  return useQuery({ 
    queryKey: ['revenueTimeSeries', range, userId], 
    queryFn: () => fetchTimeSeries(range, userId),
    enabled: !!userId
  });
}

export function usePlatformAllocation(userId?: string) {
  return useQuery({ 
    queryKey: ['platformAllocation', userId], 
    queryFn: () => fetchAllocation(userId),
    enabled: !!userId
  });
}

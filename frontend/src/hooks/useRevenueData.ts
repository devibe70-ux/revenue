import { useQuery } from '@tanstack/react-query';
import { DateRange } from '../components/DateRangeSelector';

// Helper to generate mock time series data for any range
const generateMockTimeline = (days: number) => {
  const timeline = [];
  const today = new Date('2026-06-30T12:00:00Z'); // Fixed baseline date
  
  // Base daily averages
  const baseAmazon = 800;
  const baseYoutube = 250;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime());
    d.setDate(d.getDate() - i);
    
    // Add some random daily variance
    const variance = 1 + (Math.random() * 0.4 - 0.2); // +/- 20%
    const amazon = baseAmazon * variance;
    const youtube = baseYoutube * variance;
    
    const total_net = amazon + youtube;
    const total_gross = total_net * 1.15; // Rough gross estimate

    timeline.push({
      date: d.toISOString().split('T')[0],
      total_gross: total_gross,
      total_net: total_net,
      breakdown: {
        youtube: youtube,
        amazon: amazon
      }
    });
  }
  return timeline;
};

const fetchTimeSeries = async (range: DateRange) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let days = 30;
  if (range === '1D') days = 1;
  else if (range === '1M') days = 30;
  else if (range === '3M') days = 90;
  else if (range === '1Y') days = 365;
  else if (range === 'Custom') days = 14;

  return {
    metric: "net_revenue",
    base_currency: "USD",
    timeline: generateMockTimeline(days)
  };
};

const fetchAllocation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    time_frame: "current_month",
    total_combined_net: 2330.20,
    distribution: [
      { platform: "amazon", net_amount: 1800.00, percentage: 77.25 },
      { platform: "youtube", net_amount: 530.20, percentage: 22.75 }
    ]
  };
};

export function useRevenueTimeSeries(range: DateRange = '1M') {
  return useQuery({ 
    queryKey: ['revenueTimeSeries', range], 
    queryFn: () => fetchTimeSeries(range) 
  });
}

export function usePlatformAllocation() {
  return useQuery({ queryKey: ['platformAllocation'], queryFn: fetchAllocation });
}

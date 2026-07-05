import { useQuery } from '@tanstack/react-query';

// Mock API Fetchers connecting to our normalized backend contracts
const fetchTimeSeries = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    metric: "net_revenue",
    base_currency: "USD",
    timeline: [
      { date: "2026-06-25", total_gross: 1100, total_net: 950, breakdown: { youtube: 200, amazon: 750 } },
      { date: "2026-06-26", total_gross: 1300, total_net: 1150, breakdown: { youtube: 300, amazon: 850 } },
      { date: "2026-06-27", total_gross: 1250, total_net: 1100, breakdown: { youtube: 250, amazon: 850 } },
      { date: "2026-06-28", total_gross: 1200.50, total_net: 1050.00, breakdown: { youtube: 250.00, amazon: 800.00 } },
      { date: "2026-06-29", total_gross: 1450.00, total_net: 1280.20, breakdown: { youtube: 280.20, amazon: 1000.00 } }
    ]
  };
};

const fetchAllocation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    time_frame: "current_month",
    total_combined_net: 2330.20,
    distribution: [
      { platform: "amazon", net_amount: 1800.00, percentage: 77.25 },
      { platform: "youtube", net_amount: 530.20, percentage: 22.75 }
    ]
  };
};

export function useRevenueTimeSeries() {
  return useQuery({ queryKey: ['revenueTimeSeries'], queryFn: fetchTimeSeries });
}

export function usePlatformAllocation() {
  return useQuery({ queryKey: ['platformAllocation'], queryFn: fetchAllocation });
}

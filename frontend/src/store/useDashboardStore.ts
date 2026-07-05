import { create } from 'zustand';

interface DashboardState {
  timeFrame: '7d' | '30d' | 'all_time';
  activePlatforms: string[];
  setTimeFrame: (timeFrame: '7d' | '30d' | 'all_time') => void;
  togglePlatform: (platform: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timeFrame: '30d',
  activePlatforms: ['youtube', 'amazon', 'meta'],
  setTimeFrame: (timeFrame) => set({ timeFrame }),
  togglePlatform: (platform) =>
    set((state) => ({
      activePlatforms: state.activePlatforms.includes(platform)
        ? state.activePlatforms.filter((p) => p !== platform)
        : [...state.activePlatforms, platform],
    })),
}));

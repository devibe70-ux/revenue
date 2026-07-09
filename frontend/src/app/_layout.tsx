import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Safely import AdMob manager
import { mobileAds, AdsConsent } from '../lib/AdMobManager';

const queryClient = new QueryClient();

export default function Layout() {
  useEffect(() => {
    // Only initialize UMP and AdMob on Native Mobile Apps (Android/iOS)
    if (Platform.OS !== 'web' && AdsConsent && mobileAds) {
      AdsConsent.requestInfoUpdate().then(() => {
        return AdsConsent.loadAndShowConsentFormIfRequired();
      }).then(() => {
        // Initialize AdMob after consent is handled
        return mobileAds().initialize();
      }).catch((error: any) => {
        console.error("AdMob/UMP Consent Error:", error);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0D10' } }} />
    </QueryClientProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRevenueTimeSeries, usePlatformAllocation } from '../hooks/useRevenueData';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';
import { DateRangeSelector, DateRange } from '../components/DateRangeSelector';
import { RevenueBreakdownTable } from '../components/RevenueBreakdownTable';
import { SubscriptionGate } from '../components/SubscriptionGate';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { auth } from '../lib/firebase';

// Safely import AdMob manager
import { BannerAd, BannerAdSize, AdsConsent, InterstitialAd, AdEventType } from '../lib/AdMobManager';

// Use a test ID for Interstitial Ads until a real one is provided
const interstitialId = 'ca-app-pub-3940256099942544/1033173712';

export default function Dashboard() {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  
  // Timer for showing ads to free users
  useEffect(() => {
    if (Platform.OS === 'web' || profile?.subscriptionTier !== 'free' || !InterstitialAd) return;

    let interstitial: any = null;

    const loadAndShowAd = () => {
      interstitial = InterstitialAd.createForAdRequest(interstitialId, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
      });

      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        // Clean up when closed
      });

      interstitial.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
      };
    };

    // Show an ad every 12 minutes (between 10 and 15 mins)
    const AD_INTERVAL_MS = 12 * 60 * 1000;
    const intervalId = setInterval(() => {
      loadAndShowAd();
    }, AD_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [profile?.subscriptionTier]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login');
    } else if (!isAuthLoading && user && profile) {
      if (profile.subscriptionTier === 'pro' && profile.mfaEnabled === false) {
        router.replace('/two-factor-setup');
      }
    }
  }, [user, profile, isAuthLoading]);

  const [dateRange, setDateRange] = useState<DateRange>('1M');
  // Pass the user ID to fetch actual real data from Firestore
  const { data: timeSeries, isLoading: isSeriesLoading } = useRevenueTimeSeries(dateRange, user?.uid);
  const { data: allocation, isLoading: isAllocLoading } = usePlatformAllocation(user?.uid);

  if (isAuthLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (!user) return null;

  const hasData = timeSeries && timeSeries.timeline && timeSeries.timeline.length > 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#064e3b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Unified Revenue</Text>
            <Text style={styles.subtitle}>Cross-platform financial intelligence</Text>
          </View>
          {Platform.OS !== 'web' && AdsConsent && (
            <TouchableOpacity 
              style={styles.privacyButton}
              onPress={() => AdsConsent.showPrivacyOptionsForm()}
            >
              <Text style={styles.privacyButtonText}>Privacy Options</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.upgradeButton, { marginLeft: 8 }]}
            onPress={() => router.push('/pricing')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.privacyButton, { marginLeft: 8 }]}
            onPress={() => auth.signOut()}
          >
            <Text style={styles.privacyButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!hasData && !isSeriesLoading && !isAllocLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Revenue Data Yet</Text>
          <Text style={styles.emptyStateText}>
            Connect your Amazon or YouTube accounts in the backend to start seeing real data here!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.metricsRow}>
            <MetricCard 
              title="Total Net Revenue" 
              value={`$${allocation?.total_combined_net?.toLocaleString() || '0'}`} 
              trend="12.5%" 
              isPositive={true} 
            />
            <MetricCard 
              title="Amazon Direct Sales" 
              value={`$${allocation?.distribution?.find((d: any) => d.platform === 'amazon')?.net_amount?.toLocaleString() || '0'}`} 
              trend="4.2%" 
              isPositive={true} 
            />
            <MetricCard 
              title="YouTube Ad Revenue" 
              value={`$${allocation?.distribution?.find((d: any) => d.platform === 'youtube')?.net_amount?.toLocaleString() || '0'}`} 
              trend="1.8%" 
              isPositive={false} 
            />
          </View>

          <View style={styles.chartsColumn}>
            <SubscriptionGate>
              <DateRangeSelector selectedRange={dateRange} onSelectRange={setDateRange} />
            </SubscriptionGate>
            
            {isSeriesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#60A5FA" />
              </View>
            ) : (
              <>
                <View style={styles.mainChart}>
                   <RevenueChart data={timeSeries} />
                </View>
                <SubscriptionGate>
                  <RevenueBreakdownTable data={timeSeries} />
                </SubscriptionGate>
            
            {Platform.OS !== 'web' && BannerAd && (
              <View style={styles.adContainer}>
                <BannerAd
                  unitId="ca-app-pub-7107715238624071/8181638695"
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: false,
                  }}
                />
              </View>
            )}
          </>
        )}
      </View>
        </>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D10', // Deep dark theme background
  },
  loadingContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: 'rgba(25, 27, 31, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 40,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
  },
  header: {
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#8A8F98',
    marginTop: 8,
  },
  privacyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  privacyButtonText: {
    color: '#8A8F98',
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  upgradeButtonText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chartsColumn: {
    flexDirection: 'column',
    width: '100%',
  },
  mainChart: {
    width: '100%',
    marginBottom: 24,
  },
  adContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  emptyState: {
    padding: 60,
    backgroundColor: 'rgba(25, 27, 31, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#8A8F98',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  }
});

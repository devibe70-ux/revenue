import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { useRevenueTimeSeries, usePlatformAllocation } from '../hooks/useRevenueData';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';
import { DateRangeSelector, DateRange } from '../components/DateRangeSelector';
import { RevenueBreakdownTable } from '../components/RevenueBreakdownTable';

// Safely import AdMob manager
import { BannerAd, BannerAdSize, AdsConsent } from '../lib/AdMobManager';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>('1M');
  const { data: timeSeries, isLoading: isSeriesLoading } = useRevenueTimeSeries(dateRange);
  const { data: allocation, isLoading: isAllocLoading } = usePlatformAllocation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
              <Text style={styles.privacyButtonText}>Privacy Options (CCPA/CPRA)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
        <DateRangeSelector selectedRange={dateRange} onSelectRange={setDateRange} />
        
        {isSeriesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#60A5FA" />
          </View>
        ) : (
          <>
            <View style={styles.mainChart}>
               <RevenueChart data={timeSeries} />
            </View>
            <RevenueBreakdownTable data={timeSeries} />
            
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
    </ScrollView>
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
    marginTop: 12,
  },
  privacyButtonText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
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
  }
});

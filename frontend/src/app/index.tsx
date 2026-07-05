import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRevenueTimeSeries, usePlatformAllocation } from '../hooks/useRevenueData';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';

export default function Dashboard() {
  const { data: timeSeries, isLoading: isSeriesLoading } = useRevenueTimeSeries();
  const { data: allocation, isLoading: isAllocLoading } = usePlatformAllocation();

  if (isSeriesLoading || isAllocLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Unified Revenue</Text>
        <Text style={styles.subtitle}>Cross-platform financial intelligence</Text>
      </View>

      <View style={styles.metricsRow}>
        <MetricCard 
          title="Total Net Revenue" 
          value={`$${allocation?.total_combined_net.toLocaleString()}`} 
          trend="12.5%" 
          isPositive={true} 
        />
        <MetricCard 
          title="Amazon Direct Sales" 
          value={`$${allocation?.distribution.find((d: any) => d.platform === 'amazon')?.net_amount.toLocaleString()}`} 
          trend="4.2%" 
          isPositive={true} 
        />
        <MetricCard 
          title="YouTube Ad Revenue" 
          value={`$${allocation?.distribution.find((d: any) => d.platform === 'youtube')?.net_amount.toLocaleString()}`} 
          trend="1.8%" 
          isPositive={false} 
        />
      </View>

      <View style={styles.chartsRow}>
        <View style={styles.mainChart}>
           <RevenueChart data={timeSeries} />
        </View>
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
    backgroundColor: '#0B0D10',
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
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mainChart: {
    flex: 1,
    minWidth: '100%',
  }
});

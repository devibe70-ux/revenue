import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function RevenueChart({ data }: { data: any }) {
  if (!data || !data.timeline) return null;

  const maxVal = Math.max(...data.timeline.map((d: any) => d.total_net));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revenue Over Time (Net)</Text>
      <View style={styles.chartArea}>
        {data.timeline.map((point: any, index: number) => {
          const heightPct = (point.total_net / maxVal) * 100;
          return (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.bar, { height: `${heightPct}%` }]} />
              <Text style={styles.label}>
                {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles: any = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(25, 27, 31, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    margin: 8,
    height: 400,
  },
  title: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  barColumn: {
    alignItems: 'center',
    width: 60,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 32,
    backgroundColor: '#60A5FA', // Blue accent
    borderRadius: 6,
    // Glow effect
    boxShadow: '0 0 12px rgba(96, 165, 250, 0.5)',
  },
  label: {
    color: '#8A8F98',
    fontSize: 12,
    marginTop: 16,
  }
});

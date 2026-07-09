import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface RevenueBreakdownTableProps {
  data: any;
}

export function RevenueBreakdownTable({ data }: RevenueBreakdownTableProps) {
  if (!data || !data.timeline || data.timeline.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revenue Breakdown</Text>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Amazon Direct</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>YouTube Ad</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>Total Net</Text>
      </View>
      
      <ScrollView style={styles.tableBody} nestedScrollEnabled={true}>
        {/* We reverse the timeline to show the most recent days first */}
        {[...data.timeline].reverse().map((row: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 1.5, color: '#E2E8F0' }]}>
              {new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
            <Text style={[styles.cell, { flex: 1 }]}>
              ${row.breakdown.amazon.toFixed(2)}
            </Text>
            <Text style={[styles.cell, { flex: 1 }]}>
              ${row.breakdown.youtube.toFixed(2)}
            </Text>
            <Text style={[styles.cell, { flex: 1, textAlign: 'right', fontWeight: '600', color: '#60A5FA' }]}>
              ${row.total_net.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(25, 27, 31, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    margin: 8,
    flex: 1,
    minHeight: 300,
  },
  title: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  headerCell: {
    color: '#8A8F98',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tableBody: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  cell: {
    color: '#9CA3AF',
    fontSize: 14,
  }
});

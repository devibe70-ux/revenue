import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type DateRange = '1D' | '1M' | '3M' | '1Y' | 'Custom';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onSelectRange: (range: DateRange) => void;
}

const RANGES: DateRange[] = ['1D', '1M', '3M', '1Y', 'Custom'];

export function DateRangeSelector({ selectedRange, onSelectRange }: DateRangeSelectorProps) {
  return (
    <View style={styles.container}>
      {RANGES.map((range) => {
        const isActive = selectedRange === range;
        return (
          <TouchableOpacity
            key={range}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelectRange(range)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>{range}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 27, 31, 0.8)',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: '#374151', // A smooth dark gray highlight for active state
  },
  text: {
    color: '#8A8F98',
    fontSize: 14,
    fontWeight: '600',
  },
  textActive: {
    color: '#FFFFFF',
  }
});

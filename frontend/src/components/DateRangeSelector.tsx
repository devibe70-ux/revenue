import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export type DateRange = '1D' | '1M' | '3M' | '1Y' | 'Custom';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onSelectRange: (range: DateRange) => void;
}

const RANGES: DateRange[] = ['1D', '1M', '3M', '1Y', 'Custom'];

export function DateRangeSelector({ selectedRange, onSelectRange }: DateRangeSelectorProps) {
  return (
    <View style={styles.containerWrapper}>
      <BlurView tint="dark" intensity={50} style={styles.container}>
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
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  container: {
    flexDirection: 'row',
    padding: 4,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // A smooth bright glass highlight for active state
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

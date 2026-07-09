import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
}

export function MetricCard({ title, value, trend, isPositive = true }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[{flex: 1, minWidth: 250, margin: 8}, isHovered && styles.cardHovered]}
    >
      <BlurView
        tint="dark"
        intensity={30}
        style={styles.card}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trend, isPositive ? styles.positive : styles.negative]}>
              {isPositive ? '↑' : '↓'} {trend}
            </Text>
            <Text style={styles.trendLabel}>vs last period</Text>
          </View>
        )}
      </BlurView>
    </Pressable>
  );
}

const styles: any = StyleSheet.create({
  card: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  cardHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ translateY: -2 }],
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    color: '#8A8F98',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  trend: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  positive: {
    color: '#34D399', // Emerald
  },
  negative: {
    color: '#F87171', // Red
  },
  trendLabel: {
    color: '#8A8F98',
    fontSize: 12,
  }
});

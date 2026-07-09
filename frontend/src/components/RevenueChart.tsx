import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';

export function RevenueChart({ data }: { data: any }) {
  if (!data || !data.timeline || data.timeline.length === 0) return null;

  // Ensure chronological order
  const timeline = [...data.timeline].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculations for the SVG
  const width = 800;
  const height = 250;
  
  // Find max value to scale the Y axis, add 10% padding to the top so it doesn't touch the ceiling
  const maxVal = Math.max(...timeline.map((d: any) => d.total_net)) * 1.1; 

  // Calculate SVG coordinates
  const points = timeline.map((point: any, index: number) => {
    // Keep data points tight and evenly spaced across the width
    const x = (index / (timeline.length - 1)) * width;
    const y = height - (point.total_net / maxVal) * height;
    return { x, y };
  });

  // Build the SVG path string (M = move to, L = line to)
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  
  // Close the path around the bottom to create the area for the gradient fill
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  // Calculate the grand total for the YouTube Studio style header
  const totalNet = timeline.reduce((sum: number, p: any) => sum + p.total_net, 0);

  // Colors (Lush Revenue Green, as requested)
  const strokeColor = '#10B981'; // Emerald/Teal Green
  
  // Format dates for the X-axis
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  const firstDate = formatDate(timeline[0].date);
  const midDate = timeline.length > 2 ? formatDate(timeline[Math.floor(timeline.length / 2)].date) : '';
  const lastDate = formatDate(timeline[timeline.length - 1].date);

  return (
    <View style={styles.containerWrapper}>
      <BlurView tint="dark" intensity={40} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Total Net Revenue</Text>
          <Text style={styles.grandTotal}>
            ${totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            {/* The Glowing Area Fill */}
            <Path d={areaPath} fill="url(#gradient)" />
            {/* The Smooth Main Line */}
            <Path d={linePath} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
          </Svg>
        </View>
        
        <View style={styles.xAxis}>
          <Text style={styles.axisLabel}>{firstDate}</Text>
          <Text style={styles.axisLabel}>{midDate}</Text>
          <Text style={styles.axisLabel}>{lastDate}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 1,
  },
  container: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 440,
    flexShrink: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#8A8F98',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  grandTotal: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  chartContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    overflow: 'hidden',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 8,
  },
  axisLabel: {
    color: '#8A8F98',
    fontSize: 12,
  }
});

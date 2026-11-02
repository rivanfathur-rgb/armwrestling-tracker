import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProgressChartProps {
  data: number[];
  color?: string; 
  unit?: string;  
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 100;

export const ProgressChart = ({ data, color = "#6366f1", unit = "kg" }: ProgressChartProps) => {
  if (data.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Butuh minimal 2 data sesi untuk melihat progres.</Text>
      </View>
    );
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - ((val - minVal) / range) * CHART_HEIGHT;
    return { x, y };
  });

  const d = points.reduce(
    (acc, point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`),
    ''
  );

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Path d={d} fill="none" stroke={color} strokeWidth="3" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
        ))}
      </Svg>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Mulai: {data[0]}{unit}</Text>
        <Text style={styles.label}>Sekarang: {data[data.length - 1]}{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b', 
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    marginBottom: 10,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  label: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

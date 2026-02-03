import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function SensorChart({ data }) {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No chart data available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  
  // Get last 10 data points
  const chartData = data.slice(0, 10).reverse();

  const temperatureData = {
    labels: chartData.map((_, index) => `${index + 1}`),
    datasets: [{
      data: chartData.map(item => item.temperature),
      color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const humidityData = {
    labels: chartData.map((_, index) => `${index + 1}`),
    datasets: [{
      data: chartData.map(item => item.humidity),
      color: (opacity = 1) => `rgba(0, 180, 216, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const mq135Data = {
    labels: chartData.map((_, index) => `${index + 1}`),
    datasets: [{
      data: chartData.map(item => item.mq135_ratio),
      color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const mq7Data = {
    labels: chartData.map((_, index) => `${index + 1}`),
    datasets: [{
      data: chartData.map(item => item.mq7_ratio),
      color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#1a2f47',
    backgroundGradientTo: '#1a2f47',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 Temperature Trend (°C)</Text>
        <LineChart
          data={temperatureData}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>💧 Humidity Trend (%)</Text>
        <LineChart
          data={humidityData}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>🌫️ MQ-135 Gas Sensor (PPM)</Text>
        <LineChart
          data={mq135Data}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>💨 MQ-7 CO Sensor (PPM)</Text>
        <LineChart
          data={mq7Data}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  noDataText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 16,
  },
  chartCard: {
    backgroundColor: '#1a2f47',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

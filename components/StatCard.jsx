import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAirQualityStatus } from '../utils/deviceStatus';

export default function StatCard({ data }) {
  const latestData = data.length > 0 ? data[0] : null;

  if (!latestData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const cardConfigs = [
    {
      title: 'Kelembapan Ruangan',
      key: 'humidity',
      unit: '%',
      label: 'DHT22',
      color: '#00b4d8',
      decimals: 2
    },
    {
      title: 'Suhu Ruangan',
      key: 'temperature',
      unit: '°C',
      label: 'DHT22',
      color: '#ff6b6b',
      decimals: 2
    },
    {
      title: 'Gas MQ135',
      key: 'mq135_ratio',
      unit: 'PPM',
      label: 'MQ135',
      color: '#9b59b6',
      decimals: 0
    },
    {
      title: 'Gas MQ7',
      key: 'mq7_ratio',
      unit: 'PPM',
      label: 'MQ7',
      color: '#e74c3c',
      decimals: 0
    },
    {
      title: 'Voltage RMS',
      key: 'voltage_rms',
      unit: 'V',
      label: 'ZMPT101B',
      color: '#f39c12',
      decimals: 2
    }
  ];

  const airQualityStatus = getAirQualityStatus(
    latestData.mq135_ratio,
    latestData.mq7_ratio
  );

  return (
    <View style={styles.container}>
      {cardConfigs.map((config, index) => {
        const value = latestData[config.key] || 0;
        const displayValue = config.decimals > 0
          ? Number(value).toFixed(config.decimals)
          : value;

        const showAirQualityBadge = config.key === 'mq135_ratio' || config.key === 'mq7_ratio';

        return (
          <View key={index} style={[styles.card, { borderLeftColor: config.color }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: config.color }]}>
                <Text style={styles.iconBadgeText}>{config.label}</Text>
              </View>
              <Text style={styles.cardTitle}>{config.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: config.color }]}>
                  {displayValue}
                </Text>
                <Text style={styles.unit}>{config.unit}</Text>
              </View>
              {showAirQualityBadge && (
                <View style={[styles.airQualityBadge, { backgroundColor: getAirQualityColor(airQualityStatus.color) }]}>
                  <Text style={styles.airQualityIcon}>{airQualityStatus.icon}</Text>
                  <Text style={styles.airQualityText}>
                    Kualitas Udara: {airQualityStatus.text}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const getAirQualityColor = (color) => {
  switch (color) {
    case 'green': return 'rgba(34, 197, 94, 0.2)';
    case 'yellow': return 'rgba(251, 191, 36, 0.2)';
    case 'red': return 'rgba(239, 68, 68, 0.2)';
    default: return 'rgba(148, 163, 184, 0.2)';
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  noDataText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1a2f47',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  iconBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cardBody: {
    marginTop: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
  },
  unit: {
    fontSize: 20,
    color: '#94a3b8',
    marginLeft: 8,
  },
  airQualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
  },
  airQualityIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  airQualityText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

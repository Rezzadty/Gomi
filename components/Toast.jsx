import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Toast({ message, type }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '🔴';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'rgba(34, 197, 94, 0.95)';
      case 'error': return 'rgba(239, 68, 68, 0.95)';
      case 'warning': return 'rgba(251, 191, 36, 0.95)';
      case 'info': return 'rgba(59, 130, 246, 0.95)';
      default: return 'rgba(59, 130, 246, 0.95)';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

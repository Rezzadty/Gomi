import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserSession, logout } from '../../utils/authHelper';
import { useToast } from '../../utils/useToast';
import { useSensorData } from '../../utils/useSensorData';
import StatCard from '../../components/StatCard';
import SensorChart from '../../components/SensorChart';
import DataTable from '../../components/DataTable';
import Toast from '../../components/Toast';

export default function DashboardScreen() {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const { toasts, showSuccess, showError, showWarning, hideToast } = useToast();
  
  const { latestData, sensorData, deviceStatus, loading, error } = useSensorData({
    showSuccess,
    showError,
    showWarning
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const sessionData = await getUserSession();
    if (!sessionData || !sessionData.isAuthenticated) {
      router.replace('/');
    } else {
      setSession(sessionData);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari sistem?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Ya, Keluar',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b4d8" />
        <Text style={styles.loadingText}>Memuat data dari Firebase...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>Pastikan konfigurasi Firebase sudah benar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🌍</Text>
          <View>
            <Text style={styles.headerTitle}>Air Quality Monitor</Text>
            <Text style={styles.headerSubtitle}>Dashboard Monitoring</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Device Status */}
      <View style={styles.statusBar}>
        <View style={[styles.statusBadge, deviceStatus.isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Text style={styles.statusIcon}>{deviceStatus.isOnline ? '🟢' : '🔴'}</Text>
          <Text style={styles.statusText}>
            {deviceStatus.isOnline ? 'Alat Aktif' : 'Alat Mati'}
          </Text>
        </View>
        {!deviceStatus.isOnline && deviceStatus.offlineMinutes !== null && (
          <Text style={styles.offlineText}>
            {deviceStatus.offlineMinutes < 60 
              ? `${deviceStatus.offlineMinutes} menit yang lalu`
              : `${Math.floor(deviceStatus.offlineMinutes / 60)} jam yang lalu`
            }
          </Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Selamat Datang, {session?.username || 'User'}!</Text>
          <Text style={styles.welcomeText}>
            Dashboard monitoring kualitas udara secara real-time
          </Text>
        </View>

        {/* Statistics Cards */}
        <StatCard data={latestData ? [latestData] : []} />

        {/* Sensor Chart */}
        <SensorChart data={sensorData} />

        {/* Data Table */}
        <DataTable data={sensorData} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Dashboard Monitoring Kualitas Udara
          </Text>
          <Text style={styles.footerSubtext}>
            Developed by Rezzadty | Version 1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1B2A',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1B2A',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorHint: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a2f47',
    padding: 15,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBar: {
    backgroundColor: '#1a2f47',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusOnline: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  offlineText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#1a2f47',
    margin: 20,
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  footerSubtext: {
    color: '#64748b',
    fontSize: 12,
  },
});

import { useState, useEffect, useRef } from 'react';
import { database, ref, onValue, query, orderByChild, limitToLast } from '../services/firebase';
import { checkDeviceStatus, getAirQualityStatus } from './deviceStatus';

export const useSensorData = ({ showSuccess, showError, showWarning } = {}) => {
  const [latestData, setLatestData] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({ isOnline: false, lastUpdate: '', offlineMinutes: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const previousStatusRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    // Fetch latest data from Firebase
    const latestRef = ref(database, 'SensorData/latest');

    const unsubscribeLatest = onValue(
      latestRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setLatestData(data);
          setLoading(false);

          // Check device status
          const status = checkDeviceStatus(data.timestamp);
          setDeviceStatus(status);

          // Show notifications for status changes
          if (!isFirstRenderRef.current && previousStatusRef.current !== null) {
            if (status.isOnline && !previousStatusRef.current) {
              showSuccess?.('Alat kembali aktif! 🟢');
            } else if (!status.isOnline && previousStatusRef.current) {
              showError?.('Alat sedang mati! 🔴', true);
            }

            // Check air quality
            const airQuality = getAirQualityStatus(data.mq135_ratio, data.mq7_ratio);
            if (airQuality.level === 2) {
              showError?.(`Kualitas udara ${airQuality.text}! ${airQuality.icon}`, true);
            } else if (airQuality.level === 1) {
              showWarning?.(`Kualitas udara ${airQuality.text}. ${airQuality.icon}`);
            }
          }

          previousStatusRef.current = status.isOnline;
          if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
          }
        }
      },
      (err) => {
        console.error('Error fetching latest data:', err);
        setError(`Permission Error: Check Firebase Rules. Error: ${err.message}`);
        showError?.('Failed to fetch data from Firebase!');
      }
    );

    // Fetch history data from Firebase
    const historyRef = query(
      ref(database, 'SensorData/history'),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          })).reverse();
          setSensorData(dataArray);
        } else {
          setSensorData([]);
        }
      },
      (err) => {
        console.error('Error fetching history data:', err);
        setError('Failed to fetch history data from Firebase');
        setLoading(false);
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeLatest();
      unsubscribeHistory();
    };
  }, [showSuccess, showError, showWarning]);

  return {
    latestData,
    sensorData,
    deviceStatus,
    loading,
    error
  };
};

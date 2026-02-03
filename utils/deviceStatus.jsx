// Check device status based on last update time
export const checkDeviceStatus = (timestamp) => {
  if (!timestamp) {
    return {
      isOnline: false,
      lastUpdate: '',
      offlineMinutes: null
    };
  }

  try {
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    // Device is online if last update was within 2 minutes
    const isOnline = diffMinutes < 2;

    return {
      isOnline,
      lastUpdate: timestamp,
      offlineMinutes: isOnline ? null : diffMinutes
    };
  } catch (error) {
    console.error('Error checking device status:', error);
    return {
      isOnline: false,
      lastUpdate: timestamp,
      offlineMinutes: null
    };
  }
};

// Determine air quality status based on MQ135 and MQ7 values
export const getAirQualityStatus = (mq135, mq7) => {
  const mq135Value = Number(mq135) || 0;
  const mq7Value = Number(mq7) || 0;

  // Level 0: Good (Baik) - MQ135 < 50 AND MQ7 < 50
  if (mq135Value < 50 && mq7Value < 50) {
    return {
      level: 0,
      text: 'Baik',
      icon: '🟢',
      color: 'green'
    };
  }
  
  // Level 1: Moderate (Sedang) - MQ135 50-150 OR MQ7 50-150
  if ((mq135Value >= 50 && mq135Value < 150) || (mq7Value >= 50 && mq7Value < 150)) {
    return {
      level: 1,
      text: 'Sedang',
      icon: '🟡',
      color: 'yellow'
    };
  }
  
  // Level 2: Unhealthy (Tidak Sehat) - MQ135 >= 150 OR MQ7 >= 150
  return {
    level: 2,
    text: 'Tidak Sehat',
    icon: '🔴',
    color: 'red'
  };
};

import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DataTable({ data }) {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No history data available</Text>
      </View>
    );
  }

  // Show only first 10 items
  const displayData = data.slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Riwayat Data Sensor (10 Terakhir)</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.noCell]}>No</Text>
            <Text style={[styles.headerCell, styles.dataCell]}>
              Humidity (%)
            </Text>
            <Text style={[styles.headerCell, styles.dataCell]}>Temp (°C)</Text>
            <Text style={[styles.headerCell, styles.dataCell]}>MQ-135</Text>
            <Text style={[styles.headerCell, styles.dataCell]}>MQ-7</Text>
            <Text style={[styles.headerCell, styles.dataCell]}>
              Voltage (V)
            </Text>
            <Text style={[styles.headerCell, styles.timestampCell]}>
              Timestamp
            </Text>
          </View>

          {displayData.map((item, index) => (
            <View
              key={item.id || index}
              style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
              <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.dataCell]}>
                {item.humidity}
              </Text>
              <Text style={[styles.cell, styles.dataCell]}>
                {item.temperature}
              </Text>
              <Text style={[styles.cell, styles.dataCell]}>
                {item.mq135_ratio}
              </Text>
              <Text style={[styles.cell, styles.dataCell]}>
                {item.mq7_ratio}
              </Text>
              <Text style={[styles.cell, styles.dataCell]}>
                {item.voltage_rms}
              </Text>
              <Text style={[styles.cell, styles.timestampCell]}>
                {item.timestamp}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1a2f47",
    borderRadius: 12,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  noDataText: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00b4d8",
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  evenRow: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cell: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  noCell: {
    width: 50,
  },
  dataCell: {
    width: 90,
  },
  timestampCell: {
    width: 150,
  },
});

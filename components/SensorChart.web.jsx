import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SensorChart({ data }) {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No chart data available</Text>
      </View>
    );
  }

  const chartData = data.slice(0, 10).reverse();

  // Cubic interpolation for smooth curves
  const cubicInterpolation = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPointX = (current.x + next.x) / 2;

      path += ` Q ${controlPointX} ${current.y}, ${controlPointX} ${(current.y + next.y) / 2}`;
      path += ` Q ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Render interpolated line chart
  const renderLineChart = (values, label, color) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const chartHeight = 160;
    const chartWidth = 300;
    const padding = 20;

    const points = values.map((value, index) => ({
      x: padding + (index * (chartWidth - 2 * padding)) / (values.length - 1),
      y:
        padding +
        chartHeight -
        ((value - min) / range) * (chartHeight - padding),
    }));

    const pathData = cubicInterpolation(points);

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{label}</Text>
        <View style={styles.chartContainer}>
          <svg
            width={chartWidth}
            height={chartHeight + 40}
            style={{ overflow: "visible" }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i * (chartHeight - padding)) / 4;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area under curve */}
            <path
              d={`${pathData} L ${points[points.length - 1].x} ${chartHeight + padding} L ${points[0].x} ${chartHeight + padding} Z`}
              fill={color}
              fillOpacity="0.2"
            />

            {/* Interpolated line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill={color}
                  stroke="#1a2f47"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={chartHeight + padding + 20}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle">
                  {values[index].toFixed(1)}
                </text>
              </g>
            ))}

            {/* Axis labels */}
            <text
              x={padding}
              y={chartHeight + padding + 20}
              fill="#94a3b8"
              fontSize="10">
              Start
            </text>
            <text
              x={chartWidth - padding}
              y={chartHeight + padding + 20}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="end">
              Latest
            </text>
          </svg>
        </View>
      </View>
    );
  };

  const temperatureValues = chartData.map((item) => item.temperature);
  const humidityValues = chartData.map((item) => item.humidity);
  const mq135Values = chartData.map((item) => item.mq135_ratio);
  const mq7Values = chartData.map((item) => item.mq7_ratio);

  return (
    <ScrollView style={styles.container}>
      {renderLineChart(
        temperatureValues,
        "📊 Temperature Trend (°C)",
        "#ff6b6b",
      )}
      {renderLineChart(humidityValues, "💧 Humidity Trend (%)", "#00b4d8")}
      {renderLineChart(mq135Values, "🌫️ MQ-135 Gas Sensor (PPM)", "#9b59b6")}
      {renderLineChart(mq7Values, "☁️ MQ-7 Gas Sensor (PPM)", "#e74c3c")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  chartCard: {
    backgroundColor: "#1a2f47",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
});

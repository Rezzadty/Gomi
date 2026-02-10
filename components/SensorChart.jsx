import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

export default function SensorChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Tidak ada data untuk ditampilkan</Text>
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

  // Render multi-line chart with multiple datasets
  const renderMultiChart = (datasets, title) => {
    const [tooltip, setTooltip] = useState({
      visible: false,
      x: 0,
      y: 0,
      data: [],
      activeIndex: null,
    });

    const screenWidth = Dimensions.get("window").width;
    const chartHeight = 200;
    const chartWidth = Math.min(screenWidth - 60, 360);
    const padding = 30;

    // Get overall min and max for consistent scaling
    const allValues = datasets.flatMap((d) => d.values);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const range = max - min || 1;

    // Handle touch on chart
    const handleTouch = (event) => {
      const { locationX, locationY } = event.nativeEvent;

      // Adjust for padding and viewBox offset
      const adjustedX = locationX - 5;

      // Find closest data point index
      const dataPointWidth =
        (chartWidth - 2 * padding) / (datasets[0].values.length - 1);
      const relativeX = adjustedX - padding;
      const closestIndex = Math.round(relativeX / dataPointWidth);

      // Validate index
      if (closestIndex >= 0 && closestIndex < datasets[0].values.length) {
        // Calculate the exact position of the data point
        const dataPointX = padding + closestIndex * dataPointWidth;
        const touchDistance = Math.abs(adjustedX - dataPointX);

        // Only show tooltip if touching near a data point (within 20px radius)
        if (touchDistance <= 20) {
          // Check if the same point is being touched again
          if (tooltip.visible && tooltip.activeIndex === closestIndex) {
            // Hide tooltip if touching the same point
            setTooltip({
              visible: false,
              x: 0,
              y: 0,
              data: [],
              activeIndex: null,
            });
            return;
          }

          // Gather data for all datasets at this index
          const tooltipData = datasets.map((dataset) => ({
            label: dataset.label,
            value: dataset.values[closestIndex],
            color: dataset.color,
          }));

          // Calculate tooltip position with smart positioning
          const tooltipWidth = 180;

          // Determine if tooltip should appear on left or right
          let tooltipX;
          if (dataPointX + tooltipWidth + 25 > chartWidth) {
            // Show on left if too close to right edge
            tooltipX = dataPointX - tooltipWidth - 10;
          } else {
            // Show on right by default
            tooltipX = dataPointX + 15;
          }

          // Ensure tooltip stays within bounds
          tooltipX = Math.max(
            5,
            Math.min(tooltipX, chartWidth - tooltipWidth - 5),
          );

          setTooltip({
            visible: true,
            x: tooltipX,
            y: locationY,
            data: tooltipData,
            index: closestIndex,
            activeIndex: closestIndex,
          });
        } else {
          // Hide tooltip if touching empty space
          setTooltip({
            visible: false,
            x: 0,
            y: 0,
            data: [],
            activeIndex: null,
          });
        }
      } else {
        // Hide tooltip if touching outside data range
        setTooltip({ visible: false, x: 0, y: 0, data: [], activeIndex: null });
      }
    };

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{title}</Text>

        <View style={styles.chartContainer}>
          <View
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleTouch}
            style={styles.touchableChart}>
            <Svg
              width={chartWidth + 10}
              height={chartHeight + 60}
              viewBox={`-5 0 ${chartWidth + 10} ${chartHeight + 60}`}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = padding + (i * (chartHeight - padding)) / 4;
                return (
                  <Line
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

              {/* Render each dataset */}
              {datasets.map((dataset, datasetIdx) => {
                const points = dataset.values.map((value, index) => ({
                  x:
                    padding +
                    (index * (chartWidth - 2 * padding)) /
                      (dataset.values.length - 1),
                  y:
                    padding +
                    chartHeight -
                    ((value - min) / range) * (chartHeight - padding),
                }));

                const pathData = cubicInterpolation(points);

                return (
                  <G key={datasetIdx}>
                    {/* Line */}
                    <Path
                      d={pathData}
                      fill="none"
                      stroke={dataset.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {points.map((point, index) => (
                      <Circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill={dataset.color}
                        stroke="#1a2f47"
                        strokeWidth="2"
                      />
                    ))}
                  </G>
                );
              })}

              {/* Axis labels */}
              <SvgText
                x={padding}
                y={chartHeight + padding + 25}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="500"
                textAnchor="start">
                Start
              </SvgText>
              <SvgText
                x={chartWidth - padding}
                y={chartHeight + padding + 25}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="500"
                textAnchor="end">
                Latest
              </SvgText>
            </Svg>

            {/* Tooltip */}
            {tooltip.visible && (
              <View
                style={[
                  styles.tooltip,
                  {
                    left: tooltip.x,
                    top: Math.max(
                      10,
                      Math.min(tooltip.y - 70, chartHeight - 60),
                    ),
                  },
                ]}
                pointerEvents="none">
                <Text style={styles.tooltipTitle}>
                  Data ke-{tooltip.index + 1}
                </Text>
                {tooltip.data.map((item, idx) => (
                  <View key={idx} style={styles.tooltipRow}>
                    <View
                      style={[
                        styles.tooltipDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.tooltipLabel}>{item.label}:</Text>
                    <Text style={styles.tooltipValue}>
                      {item.value.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {datasets.map((dataset, idx) => (
            <View key={idx} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: dataset.color }]}
              />
              <Text style={styles.legendText}>{dataset.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const temperatureValues = chartData.map((item) =>
    parseFloat(item.temperature),
  );
  const humidityValues = chartData.map((item) => parseFloat(item.humidity));
  const mq135Values = chartData.map((item) => parseFloat(item.mq135_ratio));
  const mq7Values = chartData.map((item) => parseFloat(item.mq7_ratio));

  return (
    <ScrollView style={styles.container}>
      {renderMultiChart(
        [
          { label: "Suhu (°C)", values: temperatureValues, color: "#ff6b6b" },
          { label: "Kelembapan (%)", values: humidityValues, color: "#00b4d8" },
        ],
        "Data Suhu & Kelembapan",
      )}

      {renderMultiChart(
        [
          {
            label: "Sensor Gas MQ-135 (PPM)",
            values: mq135Values,
            color: "#9b59b6",
          },
          {
            label: "Sensor Gas MQ-7 (PPM)",
            values: mq7Values,
            color: "#e74c3c",
          },
        ],
        "Data Sensor Gas MQ-135 & MQ-7",
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
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
    borderWidth: 1,
    borderColor: "rgba(100, 200, 255, 0.1)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flexWrap: "wrap",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "500",
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  touchableChart: {
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(26, 47, 71, 0.98)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#00b4d8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 180,
    zIndex: 1000,
  },
  tooltipTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.3)",
    paddingBottom: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    gap: 6,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tooltipLabel: {
    color: "#94a3b8",
    fontSize: 12,
    flex: 1,
  },
  tooltipValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

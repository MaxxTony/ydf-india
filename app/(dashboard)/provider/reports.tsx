import { ReviewerHeader } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CHART_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 4);

export default function ProviderReportsScreen() {
  const stats = useMemo(
    () => [
      { 
        label: "Funds Distributed", 
        value: "₹12.5L", 
        icon: "cash" as keyof typeof Ionicons.glyphMap,
        gradient: ['#f093fb', '#f5576c'] as const,
        change: "+8.5%",
        isPositive: true
      },
      { 
        label: "Approved Apps", 
        value: "312", 
        icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
        gradient: ['#4facfe', '#00f2fe'] as const,
        change: "+24%",
        isPositive: true
      },
    ],
    []
  );

  const barData = useMemo(() => [
    {
      value: 85,
      label: 'Jan',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
    {
      value: 120,
      label: 'Feb',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
    {
      value: 95,
      label: 'Mar',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
    {
      value: 140,
      label: 'Apr',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
    {
      value: 110,
      label: 'May',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
    {
      value: 155,
      label: 'Jun',
      frontColor: '#667eea',
      gradientColor: '#764ba2',
    },
  ], []);

  const pieData = useMemo(() => [
    {
      value: 60,
      color: '#667eea',
      gradientCenterColor: '#764ba2',
      text: '60%',
    },
    {
      value: 30,
      color: '#4facfe',
      gradientCenterColor: '#00f2fe',
      text: '30%',
    },
    {
      value: 10,
      color: '#f093fb',
      gradientCenterColor: '#f5576c',
      text: '10%',
    },
  ], []);

  const lineData = useMemo(() => [
    { value: 45, label: 'Jan', dataPointText: '45' },
    { value: 62, label: 'Feb', dataPointText: '62' },
    { value: 58, label: 'Mar', dataPointText: '58' },
    { value: 78, label: 'Apr', dataPointText: '78' },
    { value: 85, label: 'May', dataPointText: '85' },
    { value: 95, label: 'Jun', dataPointText: '95' },
  ], []);

  const handleExport = (format: string) => {
    Alert.alert("Export", `Exporting ${format} report...`);
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Reports & Analytics" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Performance Dashboard</Text>
            <Text style={styles.subtitle}>Track your impact and growth</Text>
          </View>
         
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statCard}>
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <View style={styles.statHeader}>
                  <View style={styles.statIconBg}>
                    <Ionicons name={stat.icon} size={20} color="#fff" />
                  </View>
                  <View style={styles.changeBadge}>
                    <Ionicons 
                      name={stat.isPositive ? "trending-up" : "trending-down"} 
                      size={10} 
                      color="#fff" 
                    />
                    <Text style={styles.changeText}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Applications Trend */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconBadge}>
                <Ionicons name="trending-up" size={18} color="#667eea" />
              </View>
              <View>
                <Text style={styles.chartTitle}>Applications Trend</Text>
                <Text style={styles.chartSubtitle}>Monthly breakdown</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartWrapper}>
            <BarChart
              data={barData}
              width={CHART_WIDTH}
              height={160}
              barWidth={CHART_WIDTH / 12}
              spacing={CHART_WIDTH / 20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#999', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#666', fontSize: 10, fontWeight: '600' }}
              noOfSections={4}
              maxValue={160}
              isAnimated
              animationDuration={800}
              gradientColor="#764ba2"
              frontColor="#667eea"
            />
          </View>
        </View>

        {/* Fund Allocation Pie */}
        <View style={styles.fullCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconBadge}>
                <Ionicons name="pie-chart" size={18} color="#667eea" />
              </View>
              <View>
                <Text style={styles.chartTitle}>Fund Split</Text>
                <Text style={styles.chartSubtitle}>Distribution overview</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.pieWrapper}>
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={52}
              innerCircleColor="#fff"
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={styles.pieCenterValue}>100%</Text>
                  <Text style={styles.pieCenterLabel}>Total</Text>
                </View>
              )}
              isAnimated
              animationDuration={1000}
            />
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#667eea' }]} />
              <Text style={styles.legendText}>Scholarships (60%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4facfe' }]} />
              <Text style={styles.legendText}>Operations (30%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f093fb' }]} />
              <Text style={styles.legendText}>Other (10%)</Text>
            </View>
          </View>
        </View>

        {/* Success Rate */}
        <View style={styles.fullCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconBadge}>
                <Ionicons name="stats-chart" size={18} color="#667eea" />
              </View>
              <View>
                <Text style={styles.chartTitle}>Success Rate</Text>
                <Text style={styles.chartSubtitle}>Approval trends</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.lineWrapper}>
            <LineChart
              data={lineData}
              width={CHART_WIDTH}
              height={140}
              spacing={CHART_WIDTH / 8}
              color="#667eea"
              thickness={3}
              startFillColor="rgba(102, 126, 234, 0.3)"
              endFillColor="rgba(102, 126, 234, 0.01)"
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={10}
              noOfSections={3}
              yAxisColor="transparent"
              xAxisColor="transparent"
              hideRules
              hideDataPoints={false}
              dataPointsColor="#667eea"
              dataPointsRadius={4}
              textShiftY={-8}
              textShiftX={-4}
              textFontSize={9}
              yAxisTextStyle={{ display: 'none' }}
              xAxisLabelTextStyle={{ 
                color: '#999', 
                fontSize: 10, 
                fontWeight: '600',
                marginTop: 4 
              }}
              curved
              areaChart
              isAnimated
              animationDuration={1200}
            />
          </View>
          
          <View style={styles.rateCard}>
            <Text style={styles.rateValue}>73.5%</Text>
            <Text style={styles.rateLabel}>Average Approval Rate</Text>
          </View>
        </View>

        {/* Quick Insights */}
        <View style={styles.insightsCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconBadge}>
                <Ionicons name="bulb" size={18} color="#667eea" />
              </View>
              <View>
                <Text style={styles.chartTitle}>Quick Insights</Text>
                <Text style={styles.chartSubtitle}>Key highlights</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="arrow-up" size={16} color="#4CAF50" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Applications up 24%</Text>
                <Text style={styles.insightText}>Highest growth this quarter</Text>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time" size={16} color="#FF9800" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>36 pending reviews</Text>
                <Text style={styles.insightText}>Review applications to improve rate</Text>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="trophy" size={16} color="#2196F3" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top performing month</Text>
                <Text style={styles.insightText}>June saw 155 applications</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Export Section */}
        <View style={styles.exportCard}>
          <View style={styles.exportHeader}>
            <View>
              <Text style={styles.exportTitle}>Export Reports</Text>
              <Text style={styles.exportSubtitle}>Download detailed analytics</Text>
            </View>
            <Ionicons name="download" size={22} color="#667eea" />
          </View>
          
          <View style={styles.exportButtons}>
            <TouchableOpacity 
              style={styles.exportBtn} 
              activeOpacity={0.8}
              onPress={() => handleExport('PDF')}
            >
              <Ionicons name="document-text" size={20} color="#667eea" />
              <Text style={styles.exportBtnText}>PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exportBtn} 
              activeOpacity={0.8}
              onPress={() => handleExport('Excel')}
            >
              <Ionicons name="grid" size={20} color="#10B981" />
              <Text style={styles.exportBtnText}>Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exportBtn} 
              activeOpacity={0.8}
              onPress={() => handleExport('CSV')}
            >
              <Ionicons name="list" size={20} color="#F59E0B" />
              <Text style={styles.exportBtnText}>CSV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667eea',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  statGradient: {
    padding: 12,
    gap: 6,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fullCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  chartIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
  chartSubtitle: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  moreBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pieWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  pieCenterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginTop: 2,
  },
  legendContainer: {
    gap: 10,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  lineWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  rateCard: {
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  rateValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#667eea',
  },
  rateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  insightsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsList: {
    gap: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    lineHeight: 16,
  },
  exportCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  exportSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
});
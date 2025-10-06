import { Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const studentFeatures = [
  {
    id: 1,
    title: "Browse Scholarships",
    description: "Find and apply for available scholarships",
    icon: "search-outline",
    color: "#4CAF50"
  },
  {
    id: 2,
    title: "My Applications",
    description: "Track your scholarship applications",
    icon: "document-text-outline",
    color: "#2196F3"
  },
  {
    id: 3,
    title: "Document Upload",
    description: "Upload required documents",
    icon: "cloud-upload-outline",
    color: "#FF9800"
  },
  {
    id: 4,
    title: "Notifications",
    description: "View important updates and deadlines",
    icon: "notifications-outline",
    color: "#F44336"
  },
  {
    id: 5,
    title: "Calendar",
    description: "Track deadlines and important dates",
    icon: "calendar-outline",
    color: "#9C27B0"
  },
  {
    id: 6,
    title: "Profile",
    description: "Manage your personal information",
    icon: "person-outline",
    color: "#607D8B"
  }
];

export default function StudentDashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Student</Text>
            </View>
            <View style={styles.profileIcon}>
              <Ionicons name="school-outline" size={40} color="#333" />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Applications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Available Scholarships</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Upcoming Deadlines</Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.featuresGrid}>
            {studentFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.featureCard, { borderLeftColor: feature.color }]}
                activeOpacity={0.8}
                onPress={() => {
                  if (feature.id === 1) {
                    router.push("/(dashboard)/student/student-scholarship-listing");
                  } else if (feature.id === 2) {
                    router.push("/(dashboard)/student/student-application-status");
                  } else if (feature.id === 3) {
                    router.push("/(dashboard)/student/student-document-upload");
                  } else if (feature.id === 4) {
                    router.push("/(dashboard)/student/student-notifications");
                  } else if (feature.id === 5) {
                    router.push("/(dashboard)/student/student-calendar");
                  } else if (feature.id === 6) {
                    router.push("/(dashboard)/student/student-profile");
                  }
                }}
              >
                <View style={styles.featureContent}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                    <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                  </View>
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="document-outline" size={20} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Application submitted</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="time-outline" size={20} color="#FF9800" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Deadline reminder</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Document approved</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Link href="/(auth)/welcome" asChild>
            <Button
              title="Sign Out"
              onPress={() => {}}
              variant="primary"
              style={styles.signOutButton}
            />
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2c44d",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  profileIcon: {
    marginLeft: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signOutButton: {
    marginTop: 8,
  },
});

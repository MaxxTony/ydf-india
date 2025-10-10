import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ApplicationItem = {
  id: string;
  scholarshipTitle: string;
  studentName: string;
  status: "Pending" | "Approved" | "Rejected";
};

export default function ApplicationReviewerDashboard() {
  const inset = useSafeAreaInsets();

  // Mocked reviewer context/state
  const [reviewerName] = useState("Aisha Khan");
  const [profilePhotoUrl] = useState<string | null>(null);
  const [unreadCount] = useState<number>(3);

  const [stats] = useState({
    total: 24,
    pending: 5,
    approved: 15,
    rejected: 4,
  });

  const [recentApplications] = useState<ApplicationItem[]>([
    { id: "a1", scholarshipTitle: "STEM Excellence Scholarship", studentName: "Ravi Patel", status: "Pending" },
    { id: "a2", scholarshipTitle: "Global Leaders Grant", studentName: "Sara Lee", status: "Approved" },
    { id: "a3", scholarshipTitle: "Arts & Culture Fund", studentName: "Omar Hassan", status: "Rejected" },
    { id: "a4", scholarshipTitle: "Women in Tech Award", studentName: "Priya Verma", status: "Pending" },
    { id: "a5", scholarshipTitle: "Community Impact Scholarship", studentName: "Daniel Kim", status: "Approved" },
  ]);
  const [notifications] = useState<Array<{ id: string; title: string; timeAgo: string }>>([
    { id: "n1", title: "New application assigned: STEM Excellence", timeAgo: "2h ago" },
    { id: "n2", title: "Document updated: Sara Lee (Passport)", timeAgo: "5h ago" },
    { id: "n3", title: "Weekly summary is ready", timeAgo: "1d ago" },
  ]);

  const reviewCompletion = useMemo(() => {
    const completed = stats.approved + stats.rejected;
    const total = stats.total || 0;
    if (!total) return { ratio: 0, label: "0% reviewed" };
    const ratio = Math.round((completed / total) * 100);
    return { ratio, label: `${ratio}% reviewed` };
  }, [stats]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={[styles.header, { paddingTop: inset.top + 20 }]}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Hi,</Text>
              <Text style={styles.userName}>{reviewerName} 👋</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.push("/(dashboard)/reviewer/notifications")}
                style={styles.bellWrapper}
                activeOpacity={0.8}
              >
                <Ionicons name="notifications-outline" size={26} color="#333" />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/(dashboard)/reviewer/profile")} activeOpacity={0.8}>
                {profilePhotoUrl ? (
                  <Image source={{ uri: profilePhotoUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-circle-outline" size={36} color="#333" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Overview Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Applications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Review Progress */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Review Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${reviewCompletion.ratio}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{reviewCompletion.label}</Text>
        </View>

        {/* Recent Applications */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity onPress={() => router.push("/(dashboard)/reviewer/applications")} accessibilityRole="button">
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardList}>
            {recentApplications.slice(0, 5).map((app) => (
              <TouchableOpacity key={app.id} style={styles.listItem} activeOpacity={0.8} onPress={() => router.push("/(dashboard)/reviewer/application-details")}>
                <View style={styles.listItemIcon}>
                  <Ionicons name="document-text-outline" size={18} color="#2196F3" />
                </View>
                <View style={styles.listItemBody}>
                  <Text style={styles.listItemTitle}>{app.scholarshipTitle}</Text>
                  <Text style={styles.listItemSub}>{app.studentName}</Text>
                </View>
                <View style={[styles.statusBadge, getStatusBadgeStyle(app.status)]}>
                  <Text style={styles.statusBadgeText}>{app.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#666" />
              </TouchableOpacity>
            ))}
            {recentApplications.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No recent applications</Text>
              </View>
            )}
          </View>
        </View>

        {/* Latest Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Latest Notifications</Text>
          <View style={styles.cardList}>
            {notifications.slice(0, 3).map((n) => (
              <TouchableOpacity key={n.id} style={styles.listItem} activeOpacity={0.8} onPress={() => router.push("/(dashboard)/reviewer/notifications")}>
                <View style={styles.listItemIcon}>
                  <Ionicons name="notifications-outline" size={18} color="#FF9800" />
                </View>
                <View style={styles.listItemBody}>
                  <Text style={styles.listItemTitle}>{n.title}</Text>
                  <Text style={styles.listItemSub}>{n.timeAgo}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            ))}
            {notifications.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No notifications</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={[styles.featureCard, { borderLeftColor: "#2196F3" }]} activeOpacity={0.8} onPress={() => router.push("/(dashboard)/reviewer/applications") }>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: "#2196F320" }]}>
                  <Ionicons name="albums-outline" size={24} color="#2196F3" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>View All Applications</Text>
                  <Text style={styles.featureDescription}>Browse and filter all submissions</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.featureCard, { borderLeftColor: "#FF9800" }]} activeOpacity={0.8} onPress={() => router.push("/(dashboard)/reviewer/documents") }>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: "#FF980020" }]}>
                  <Ionicons name="document-attach-outline" size={24} color="#FF9800" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Check Documents</Text>
                  <Text style={styles.featureDescription}>Verify uploaded applicant documents</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.featureCard, { borderLeftColor: "#4CAF50" }]} activeOpacity={0.8} onPress={() => router.push("/(dashboard)/reviewer/reports") }>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: "#4CAF5020" }]}>
                  <Ionicons name="stats-chart-outline" size={24} color="#4CAF50" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>View Reports</Text>
                  <Text style={styles.featureDescription}>Insights on approvals and trends</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getStatusBadgeStyle(status: ApplicationItem["status"]) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#E8F5E9", borderColor: "#4CAF50" };
    case "Rejected":
      return { backgroundColor: "#FBE9E7", borderColor: "#F44336" };
    default:
      return { backgroundColor: "#E3F2FD", borderColor: "#2196F3" }; 
  }
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
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  bellWrapper: {
    marginRight: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F44336",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    width: "48%",
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  viewAllText: {
    color: "#333",
    fontWeight: "600",
  },
  cardList: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(51, 51, 51, 0.06)",
  },
  listItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listItemBody: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  listItemSub: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  emptyState: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "rgba(51, 51, 51, 0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
});


import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const applications = [
  {
    id: 1,
    title: "Merit Scholarship 2024",
    amount: "$5,000",
    status: "under_review",
    statusText: "Under Review",
    submittedDate: "2024-02-15",
    deadline: "2024-03-15",
    color: "#FF9800",
    timeline: [
      {
        date: "2024-02-15",
        status: "submitted",
        title: "Application Submitted",
        description: "Your application has been successfully submitted"
      },
      {
        date: "2024-02-16",
        status: "review",
        title: "Under Review",
        description: "Your application is being reviewed by the committee"
      }
    ]
  },
  {
    id: 2,
    title: "Need-Based Grant",
    amount: "$3,000",
    status: "approved",
    statusText: "Approved",
    submittedDate: "2024-01-20",
    deadline: "2024-03-20",
    color: "#4CAF50",
    timeline: [
      {
        date: "2024-01-20",
        status: "submitted",
        title: "Application Submitted",
        description: "Your application has been successfully submitted"
      },
      {
        date: "2024-01-25",
        status: "review",
        title: "Under Review",
        description: "Your application is being reviewed by the committee"
      },
      {
        date: "2024-02-10",
        status: "approved",
        title: "Application Approved",
        description: "Congratulations! Your application has been approved"
      }
    ]
  },
  {
    id: 3,
    title: "STEM Excellence Award",
    amount: "$7,500",
    status: "rejected",
    statusText: "Rejected",
    submittedDate: "2024-01-10",
    deadline: "2024-03-10",
    color: "#F44336",
    timeline: [
      {
        date: "2024-01-10",
        status: "submitted",
        title: "Application Submitted",
        description: "Your application has been successfully submitted"
      },
      {
        date: "2024-01-15",
        status: "review",
        title: "Under Review",
        description: "Your application is being reviewed by the committee"
      },
      {
        date: "2024-02-05",
        status: "rejected",
        title: "Application Rejected",
        description: "Unfortunately, your application was not selected this time"
      }
    ]
  }
];

const statusColors = {
  submitted: "#2196F3",
  review: "#FF9800",
  approved: "#4CAF50",
  rejected: "#F44336"
};

export default function ApplicationStatusScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Status</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Total Applications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Under Review</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Applications List */}
        <View style={styles.applicationsContainer}>
          <Text style={styles.sectionTitle}>Your Applications</Text>
          {applications.map((application) => (
            <View key={application.id} style={styles.applicationCard}>
              <View style={styles.applicationHeader}>
                <View style={styles.applicationInfo}>
                  <Text style={styles.applicationTitle}>{application.title}</Text>
                  <Text style={styles.applicationAmount}>{application.amount}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: application.color + '20' }]}>
                  <Text style={[styles.statusText, { color: application.color }]}>
                    {application.statusText}
                  </Text>
                </View>
              </View>
              
              <View style={styles.applicationDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Submitted: {application.submittedDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Deadline: {application.deadline}</Text>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineTitle}>Application Timeline</Text>
                {application.timeline.map((event, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot}>
                      <View style={[
                        styles.timelineDotInner,
                        { backgroundColor: statusColors[event.status as keyof typeof statusColors] }
                      ]} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineEventTitle}>{event.title}</Text>
                      <Text style={styles.timelineEventDescription}>{event.description}</Text>
                      <Text style={styles.timelineEventDate}>{event.date}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.applicationActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color="#2196F3" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-outline" size={16} color="#666" />
                  <Text style={styles.actionText}>View Documents</Text>
                </TouchableOpacity>
                {application.status === 'rejected' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="refresh-outline" size={16} color="#FF9800" />
                    <Text style={styles.actionText}>Reapply</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>New Application</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="search-outline" size={24} color="#2196F3" />
              <Text style={styles.quickActionText}>Browse Scholarships</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="notifications-outline" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="help-circle-outline" size={24} color="#9C27B0" />
              <Text style={styles.quickActionText}>Help & Support</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    lineHeight: 12,
  },
  applicationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  applicationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  applicationInfo: {
    flex: 1,
    marginRight: 12,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  applicationAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  applicationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineEventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  timelineEventDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  timelineEventDate: {
    fontSize: 11,
    color: "#999",
  },
  applicationActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  quickActionText: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
});


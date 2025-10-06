import { AppHeader } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const applications = [
  {
    id: 1,
    title: "Merit Scholarship 2024",
    amount: "$5,000",
    status: "under_review",
    statusText: "Under Review",
    submittedDate: "2024-02-15",
    deadline: "2024-03-15",
    type: "Merit",
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
    type: "Need-Based",
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
    type: "STEM",
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
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  const years = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => set.add(String(new Date(a.submittedDate).getFullYear())));
    return ["All", ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, []);

  const types = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => set.add(a.type));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const yearOk = selectedYear === "All" || String(new Date(a.submittedDate).getFullYear()) === selectedYear;
      const typeOk = selectedType === "All" || a.type === selectedType;
      return yearOk && typeOk;
    });
  }, [selectedYear, selectedType]);

  const activeApps = useMemo(() => filtered.filter((a) => a.status === "under_review" || a.status === "submitted"), [filtered]);
  const pastApps = useMemo(() => filtered.filter((a) => a.status === "approved" || a.status === "rejected"), [filtered]);

  const totalCounts = useMemo(() => {
    return {
      total: filtered.length,
      approved: filtered.filter((a) => a.status === "approved").length,
      underReview: filtered.filter((a) => a.status === "under_review").length,
      rejected: filtered.filter((a) => a.status === "rejected").length,
    };
  }, [filtered]);

  const buildReceiptHtml = (a: (typeof applications)[number]) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, Roboto, Arial, sans-serif; padding: 24px; color: #333; }
          .card { border: 1px solid #eee; border-radius: 12px; padding: 20px; }
          h1 { margin: 0 0 8px; font-size: 22px; }
          h2 { margin: 16px 0 8px; font-size: 16px; color: #666; }
          .row { display: flex; justify-content: space-between; margin: 6px 0; }
          .muted { color: #666; }
          .badge { display:inline-block; padding:4px 10px; border-radius:999px; background:${a.color}22; color:${a.color}; font-weight:700; font-size:12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Application Receipt</h1>
          <div class="row"><div class="muted">Scholarship</div><div><strong>${a.title}</strong></div></div>
          <div class="row"><div class="muted">Amount</div><div>${a.amount}</div></div>
          <div class="row"><div class="muted">Submitted</div><div>${a.submittedDate}</div></div>
          <div class="row"><div class="muted">Deadline</div><div>${a.deadline}</div></div>
          <div class="row"><div class="muted">Type</div><div>${(a as any).type ?? "-"}</div></div>
          <div style="margin-top:12px;">
            <span class="badge">${a.statusText}</span>
          </div>
          <h2>Timeline</h2>
          ${a.timeline
            .map(
              (t) => `
            <div class="row">
              <div class="muted">${t.date}</div>
              <div>${t.title}</div>
            </div>`
            )
            .join("")}
        </div>
      </body>
    </html>
  `;

  const buildDecisionHtml = (a: (typeof applications)[number]) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, Roboto, Arial, sans-serif; padding: 24px; color: #333; }
          .card { border: 1px solid #eee; border-radius: 12px; padding: 20px; }
          h1 { margin: 0 0 8px; font-size: 22px; }
          p { line-height: 1.5; }
          .status { margin-top: 12px; font-weight: 800; color: ${a.color}; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Decision Letter</h1>
          <p>Scholarship: <strong>${a.title}</strong></p>
          <p>Amount: ${a.amount}</p>
          <p class="status">Status: ${a.statusText}</p>
          <p>
            ${a.status === "approved"
              ? "Congratulations! Your application has been approved. Please review the next steps in your dashboard."
              : a.status === "rejected"
              ? "We appreciate your interest. Unfortunately, your application was not selected at this time."
              : "Your application is currently under review."
            }
          </p>
        </div>
      </body>
    </html>
  `;

  const handleDownloadReceipt = async (a: (typeof applications)[number]) => {
    try {
      const Print = await import("expo-print");
      const { uri } = await Print.printToFileAsync({ html: buildReceiptHtml(a) });
      Alert.alert("Receipt Ready", "Saved to: " + uri);
    } catch (e) {
      Alert.alert("Unavailable", "PDF generation is not available on this build.");
    }
  };

  const handleViewDecision = async (a: (typeof applications)[number]) => {
    try {
      const Print = await import("expo-print");
      await Print.printAsync({ html: buildDecisionHtml(a) });
    } catch (e) {
      Alert.alert("Unavailable", "PDF viewer is not available on this build.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      {/* App Header outside scroll */}
      <AppHeader title="Application Status" onBack={() => router.back()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {years.map((y) => (
                <TouchableOpacity
                  key={`year-${y}`}
                  onPress={() => setSelectedYear(y)}
                  style={[styles.chip, selectedYear === y && styles.chipActive]}
                >
                  <Ionicons name="calendar-outline" size={14} color={selectedYear === y ? "#fff" : "#666"} />
                  <Text style={[styles.chipText, selectedYear === y && styles.chipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {types.map((t) => (
                <TouchableOpacity
                  key={`type-${t}`}
                  onPress={() => setSelectedType(t)}
                  style={[styles.chip, selectedType === t && styles.chipActive]}
                >
                  <Ionicons name="pricetag-outline" size={14} color={selectedType === t ? "#fff" : "#666"} />
                  <Text style={[styles.chipText, selectedType === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {(selectedYear !== "All" || selectedType !== "All") && (
            <TouchableOpacity onPress={() => { setSelectedYear("All"); setSelectedType("All"); }} style={styles.clearFiltersBtn}>
              <Ionicons name="refresh-outline" size={16} color="#666" />
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCounts.total}</Text>
            <Text style={styles.statLabel}>Total Applications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCounts.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCounts.underReview}</Text>
            <Text style={styles.statLabel}>Under Review</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCounts.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>
        {/* Active Applications */}
        <View style={styles.applicationsContainer}>
          <Text style={styles.sectionTitle}>Active Applications</Text>
          {activeApps.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active applications</Text>
            </View>
          )}
          {activeApps.map((application) => (
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
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDownloadReceipt(application)}>
                  <Ionicons name="document-text-outline" size={16} color="#2196F3" />
                  <Text style={styles.actionText}>Download Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/(dashboard)/student/student-scholarship-details") }>
                  <Ionicons name="eye-outline" size={16} color="#666" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Past Applications */}
        <View style={styles.applicationsContainer}>
          <Text style={styles.sectionTitle}>Past Applications</Text>
          {pastApps.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No past applications</Text>
            </View>
          )}
          {pastApps.map((application) => (
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
                {application.status === 'approved' && (
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDecision(application)}>
                    <Ionicons name="document-text-outline" size={16} color="#4CAF50" />
                    <Text style={styles.actionText}>View Decision Letter</Text>
                  </TouchableOpacity>
                )}
                {application.status === 'rejected' && (
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDecision(application)}>
                    <Ionicons name="document-text-outline" size={16} color="#F44336" />
                    <Text style={styles.actionText}>View Decision Letter</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDownloadReceipt(application)}>
                  <Ionicons name="download-outline" size={16} color="#2196F3" />
                  <Text style={styles.actionText}>Download Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  filterRow: {
    marginBottom: 8,
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  chipText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#fff",
  },
  clearFiltersBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clearFiltersText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 12,
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
  emptyState: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#666",
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
});



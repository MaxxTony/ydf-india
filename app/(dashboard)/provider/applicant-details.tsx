import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReviewerHeader from "../../../components/ReviewerHeader";

export default function ProviderApplicantDetailsScreen() {
  const applicant = {
    id: "app-1",
    name: "Ravi Patel",
    age: 20,
    course: "BSc Computer Science",
    college: "ABC Institute of Technology",
    income: 24000,
    category: "OBC",
    essay:
      "I aspire to build scalable solutions that positively impact education accessibility across rural areas.",
    motivation:
      "This scholarship will reduce financial burden and allow me to focus on research and community projects.",
    progress: 72,
    appliedDate: "Mar 15, 2025",
    gpa: "3.8/4.0",
  };

  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "notes"
  >("overview");

  const formattedIncome = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(applicant.income),
    [applicant.income]
  );

  const getProgressColor = (progress: number): readonly [string, string] => {
    if (progress >= 70) return ["#10b981", "#059669"] as const;
    if (progress >= 40) return ["#f59e0b", "#d97706"] as const;
    return ["#ef4444", "#dc2626"] as const;
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Applicant Details" />

      {/* Hero Section */}
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {applicant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </LinearGradient>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Under Review</Text>
            </View>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{applicant.name}</Text>
            <Text style={styles.heroSubtitle}>{applicant.course}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.heroMetaText}>{applicant.age} years</Text>
              </View>
              <View style={styles.heroMetaDivider} />
              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="school-outline"
                  size={14}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.heroMetaText}>GPA {applicant.gpa}</Text>
              </View>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.heroMetaText}>{applicant.appliedDate}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.tabActive]}
          onPress={() => setActiveTab("overview")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={activeTab === "overview" ? "#6366f1" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.tabTextActive,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "documents" && styles.tabActive]}
          onPress={() => setActiveTab("documents")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="document-text-outline"
            size={18}
            color={activeTab === "documents" ? "#6366f1" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "documents" && styles.tabTextActive,
            ]}
          >
            Documents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "notes" && styles.tabActive]}
          onPress={() => setActiveTab("notes")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={activeTab === "notes" ? "#6366f1" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "notes" && styles.tabTextActive,
            ]}
          >
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && (
          <>
            {/* Quick Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#dbeafe" },
                  ]}
                >
                  <Ionicons name="business-outline" size={20} color="#2563eb" />
                </View>
                <Text style={styles.statLabel}>Institution</Text>
                <Text style={styles.statValue} numberOfLines={2}>
                  {applicant.college}
                </Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#dcfce7" },
                  ]}
                >
                  <Ionicons name="cash-outline" size={20} color="#16a34a" />
                </View>
                <Text style={styles.statLabel}>Annual Income</Text>
                <Text style={styles.statValue}>{formattedIncome}</Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#fef3c7" },
                  ]}
                >
                  <Ionicons
                    name="pricetags-outline"
                    size={20}
                    color="#ca8a04"
                  />
                </View>
                <Text style={styles.statLabel}>Category</Text>
                <Text style={styles.statValue}>{applicant.category}</Text>
              </View>
            </View>

            {/* Progress Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Application Progress</Text>
                  <Text style={styles.sectionSubtitle}>
                    Review completion status
                  </Text>
                </View>
                <View style={styles.progressPercentBadge}>
                  <Text style={styles.progressPercentText}>
                    {applicant.progress}%
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={getProgressColor(applicant.progress)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressFill,
                    { width: `${applicant.progress}%` },
                  ]}
                />
              </View>
              <View style={styles.progressMilestones}>
                <ProgressMilestone
                  completed={applicant.progress >= 25}
                  label="Started"
                />
                <ProgressMilestone
                  completed={applicant.progress >= 50}
                  label="In Review"
                />
                <ProgressMilestone
                  completed={applicant.progress >= 75}
                  label="Verification"
                />
                <ProgressMilestone
                  completed={applicant.progress >= 100}
                  label="Completed"
                />
              </View>
            </View>

            {/* Application Details */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Application Statement</Text>
                  <Text style={styles.sectionSubtitle}>
                    Candidate's submission
                  </Text>
                </View>
              </View>

              <View style={styles.essaySection}>
                <View style={styles.essayHeader}>
                  <Ionicons name="bulb-outline" size={18} color="#6366f1" />
                  <Text style={styles.essayLabel}>Career Goals & Vision</Text>
                </View>
                <Text style={styles.paragraph}>{applicant.essay}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.essaySection}>
                <View style={styles.essayHeader}>
                  <Ionicons name="heart-outline" size={18} color="#ec4899" />
                  <Text style={styles.essayLabel}>Motivation & Impact</Text>
                </View>
                <Text style={styles.paragraph}>{applicant.motivation}</Text>
              </View>
            </View>
          </>
        )}

        {activeTab === "documents" && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.sectionTitle}>Uploaded Documents</Text>
                <Text style={styles.sectionSubtitle}>3 files attached</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadAllBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={16} color="#6366f1" />
                <Text style={styles.downloadAllText}>Download All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.docsList}>
              <DocCard
                title="ID Proof.pdf"
                size="2.4 MB"
                date="Mar 15, 2025"
                type="pdf"
              />
              <DocCard
                title="Income Certificate.jpg"
                size="1.8 MB"
                date="Mar 15, 2025"
                type="image"
              />
              <DocCard
                title="Marksheets.zip"
                size="5.2 MB"
                date="Mar 15, 2025"
                type="zip"
              />
            </View>
          </View>
        )}

        {activeTab === "notes" && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.sectionTitle}>Internal Notes</Text>
                <Text style={styles.sectionSubtitle}>
                  Private reviewer comments
                </Text>
              </View>
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add your review notes, observations, or recommendations here..."
              placeholderTextColor="#999"
              multiline
              style={styles.notesInput}
            />
            <TouchableOpacity style={styles.saveNotesBtn} activeOpacity={0.85}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveNotesText}>Save Notes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Review Decision</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              activeOpacity={0.85}
              onPress={() => console.log("Approve", applicant.id)}
            >
              <LinearGradient
                colors={["#10b981", "#059669"]}
                style={styles.actionBtnGradient}
              >
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>Approve</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              activeOpacity={0.85}
              onPress={() => console.log("Reject", applicant.id)}
            >
              <LinearGradient
                colors={["#ef4444", "#dc2626"]}
                style={styles.actionBtnGradient}
              >
                <Ionicons name="close-circle" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>Reject</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="#6366f1" />
            <Text style={styles.backBtnText}>Back to Applications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function ProgressMilestone({
  completed,
  label,
}: {
  completed: boolean;
  label: string;
}) {
  return (
    <View style={styles.milestone}>
      <View
        style={[
          styles.milestoneCircle,
          completed && styles.milestoneCircleComplete,
        ]}
      >
        {completed && <Ionicons name="checkmark" size={10} color="#fff" />}
      </View>
      <Text
        style={[
          styles.milestoneLabel,
          completed && styles.milestoneLabelComplete,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function DocCard({
  title,
  size,
  date,
  type,
}: {
  title: string;
  size: string;
  date: string;
  type: "pdf" | "image" | "zip";
}) {
  const iconMap = {
    pdf: { name: "document-text", color: "#ef4444", bg: "#fee2e2" },
    image: { name: "image", color: "#8b5cf6", bg: "#f3e8ff" },
    zip: { name: "archive", color: "#f59e0b", bg: "#fef3c7" },
  };
  const config = iconMap[type];

  return (
    <TouchableOpacity style={styles.docCard} activeOpacity={0.7}>
      <View style={[styles.docIcon, { backgroundColor: config.bg }]}>
        <Ionicons name={config.name as any} size={24} color={config.color} />
      </View>
      <View style={styles.docInfo}>
        <Text style={styles.docTitle}>{title}</Text>
        <View style={styles.docMeta}>
          <Text style={styles.docMetaText}>{size}</Text>
          <View style={styles.docMetaDot} />
          <Text style={styles.docMetaText}>{date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.docDownloadBtn} activeOpacity={0.7}>
        <Ionicons name="download-outline" size={20} color="#6366f1" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },

  // Hero Section
  heroSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  heroContent: { flexDirection: "row", gap: 16 },
  avatarContainer: { alignItems: "center", gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: "#fff" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  heroInfo: { flex: 1, justifyContent: "center", gap: 4 },
  heroName: { fontSize: 24, fontWeight: "800", color: "#fff" },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  heroMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroMetaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  heroMetaDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#6366f1" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#666" },
  tabTextActive: { color: "#6366f1" },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },

  // Progress
  progressPercentBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressPercentText: { fontSize: 16, fontWeight: "800", color: "#16a34a" },
  progressBarContainer: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 6 },
  progressMilestones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  milestone: { alignItems: "center", gap: 6 },
  milestoneCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneCircleComplete: { backgroundColor: "#10b981" },
  milestoneLabel: { fontSize: 11, fontWeight: "600", color: "#9ca3af" },
  milestoneLabelComplete: { color: "#10b981" },

  // Essay
  essaySection: { gap: 10 },
  essayHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  essayLabel: { fontSize: 14, fontWeight: "700", color: "#374151" },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4b5563",
    letterSpacing: 0.2,
  },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 20 },

  // Documents
  downloadAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  downloadAllText: { fontSize: 13, fontWeight: "700", color: "#6366f1" },
  docsList: { gap: 12 },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  docInfo: { flex: 1, gap: 4 },
  docTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  docMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  docMetaText: { fontSize: 12, fontWeight: "500", color: "#6b7280" },
  docMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9ca3af",
  },
  docDownloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },

  // Notes
  notesInput: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#f8fafc",
    textAlignVertical: "top",
    lineHeight: 24,
  },
  saveNotesBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  saveNotesText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Actions
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  approveBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rejectBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  actionBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  backBtnText: { fontSize: 15, fontWeight: "700", color: "#6366f1" },
});

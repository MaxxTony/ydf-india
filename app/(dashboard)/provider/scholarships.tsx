import { Ionicons } from "@expo/vector-icons";
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

type ScholarshipStatus = "Active" | "Closed" | "Draft";

type Scholarship = {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  applicants: number;
  status: ScholarshipStatus;
  category: string;
};

const TABS: Array<{ key: "All" | ScholarshipStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Active", label: "Active" },
  { key: "Closed", label: "Closed" },
  { key: "Draft", label: "Draft" },
];

export default function ProviderScholarshipsScreen() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("All");

  const [scholarships] = useState<Scholarship[]>([
    {
      id: "s1",
      title: "Merit Excellence Scholarship",
      amount: 5000,
      deadline: "2025-12-31",
      applicants: 126,
      status: "Active",
      category: "Merit",
    },
    {
      id: "s2",
      title: "STEM Innovation Grant",
      amount: 8000,
      deadline: "2025-11-15",
      applicants: 89,
      status: "Active",
      category: "STEM",
    },
    {
      id: "s3",
      title: "Community Service Award",
      amount: 3000,
      deadline: "2025-10-30",
      applicants: 54,
      status: "Closed",
      category: "Community",
    },
    {
      id: "s4",
      title: "Academic Achievement Scholarship",
      amount: 6000,
      deadline: "2026-01-20",
      applicants: 12,
      status: "Draft",
      category: "Academics",
    },
    {
      id: "s5",
      title: "Women in Tech Scholarship",
      amount: 7000,
      deadline: "2025-12-05",
      applicants: 203,
      status: "Active",
      category: "Technology",
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scholarships
      .filter((s) => (activeTab === "All" ? true : s.status === activeTab))
      .filter((s) =>
        q.length === 0
          ? true
          : s.title.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
      );
  }, [scholarships, query, activeTab]);

  const stats = useMemo(() => {
    return {
      total: scholarships.length,
      active: scholarships.filter((s) => s.status === "Active").length,
      totalApplicants: scholarships.reduce((sum, s) => sum + s.applicants, 0),
      totalAmount: scholarships.reduce((sum, s) => sum + s.amount, 0),
    };
  }, [scholarships]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Manage Scholarships" />

      {/* Search & Add */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search scholarships..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => router.push("/(dashboard)/provider/add-scholarship")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}
        >
          {TABS.map((t) => {
            const count =
              t.key === "All"
                ? scholarships.length
                : scholarships.filter((s) => s.status === t.key).length;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tabChip,
                  activeTab === t.key && styles.tabChipActive,
                ]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === t.key && styles.tabTextActive,
                  ]}
                >
                  {t.label}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === t.key && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === t.key && styles.tabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* Scholarship Cards */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push("/(dashboard)/provider/scholarship-details")
            }
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View
                    style={[styles.categoryDot, getCategoryColor(s.category)]}
                  />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {s.title}
                  </Text>
                </View>
                <View style={[styles.statusBadge, getStatusStyle(s.status)]}>
                  <View
                    style={[styles.statusDot, getStatusDotColor(s.status)]}
                  />
                  <Text
                    style={[styles.statusText, getStatusTextColor(s.status)]}
                  >
                    {s.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.categoryTag}>{s.category}</Text>

              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Scholarship Amount</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(s.amount)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <View
                    style={[
                      styles.metaIconContainer,
                      { backgroundColor: "#EEF2FF" },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#6366F1"
                    />
                  </View>
                  <View style={styles.metaContent}>
                    <Text style={styles.metaLabel}>Deadline</Text>
                    <Text style={styles.metaValue}>
                      {formatDate(s.deadline)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaItem}>
                  <View
                    style={[
                      styles.metaIconContainer,
                      { backgroundColor: "#F0FDF4" },
                    ]}
                  >
                    <Ionicons name="people-outline" size={18} color="#10B981" />
                  </View>
                  <View style={styles.metaContent}>
                    <Text style={styles.metaLabel}>Applicants</Text>
                    <Text style={styles.metaValue}>{s.applicants}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                activeOpacity={0.7}
                onPress={() =>
                  router.push("/(dashboard)/provider/scholarship-details")
                }
              >
                <Text style={styles.viewButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No scholarships found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusStyle(status: ScholarshipStatus) {
  switch (status) {
    case "Active":
      return { backgroundColor: "#ECFDF5", borderColor: "#D1FAE5" };
    case "Closed":
      return { backgroundColor: "#FEF2F2", borderColor: "#FECACA" };
    default:
      return { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" };
  }
}

function getStatusDotColor(status: ScholarshipStatus) {
  switch (status) {
    case "Active":
      return { backgroundColor: "#10B981" };
    case "Closed":
      return { backgroundColor: "#EF4444" };
    default:
      return { backgroundColor: "#3B82F6" };
  }
}

function getStatusTextColor(status: ScholarshipStatus) {
  switch (status) {
    case "Active":
      return { color: "#065F46" };
    case "Closed":
      return { color: "#991B1B" };
    default:
      return { color: "#1E40AF" };
  }
}

function getCategoryColor(category: string) {
  const colors: Record<string, any> = {
    Merit: { backgroundColor: "#8B5CF6" },
    STEM: { backgroundColor: "#06B6D4" },
    Community: { backgroundColor: "#F59E0B" },
    Academics: { backgroundColor: "#6366F1" },
    Technology: { backgroundColor: "#EC4899" },
  };
  return colors[category] || { backgroundColor: "#6B7280" };
}

function formatDate(d: string) {
  try {
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 12,
  },
  statsScroll: {
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: 160,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  tabsScroll: {
    marginBottom: 8,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 6,
    marginBottom:10
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabChipActive: {
    backgroundColor: "#6366F1",
  },
  tabText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#fff",
  },
  tabBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 8,
    minWidth: 24,
    minHeight: 20,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
  tabBadgeTextActive: {
    color: "#fff",
  },
  scroll: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginRight: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  categoryTag: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 16,
  },
  amountSection: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6366F1",
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

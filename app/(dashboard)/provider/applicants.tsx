import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReviewerHeader from "../../../components/ReviewerHeader";

type ApplicantStatus = "Pending" | "Approved" | "Rejected";

type Applicant = {
  id: string;
  name: string;
  course: string;
  income: number;
  status: ApplicantStatus;
};

const TABS: Array<{ key: "All" | ApplicantStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

const PAGE_SIZE = 10;

export default function ProviderApplicantsScreen() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("All");
  const [page, setPage] = useState(1);

  const [allApplicants] = useState<Applicant[]>(
    Array.from({ length: 57 }).map((_, i) => {
      const statuses: ApplicantStatus[] = ["Pending", "Approved", "Rejected"];
      const status = statuses[i % statuses.length];
      return {
        id: `app-${i + 1}`,
        name: `Applicant ${i + 1}`,
        course: ["BSc Computer Science", "BCom", "BA Economics"][i % 3],
        income: 20000 + (i % 10) * 1500,
        status,
      };
    })
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allApplicants
      .filter((a) => (activeTab === "All" ? true : a.status === activeTab))
      .filter((a) =>
        q.length === 0 ? true : a.name.toLowerCase().includes(q)
      );
  }, [allApplicants, query, activeTab]);

  const paginated = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  );

  // Calculate counts for tabs
  const tabCounts = useMemo(() => {
    return {
      All: allApplicants.length,
      Pending: allApplicants.filter((a) => a.status === "Pending").length,
      Approved: allApplicants.filter((a) => a.status === "Approved").length,
      Rejected: allApplicants.filter((a) => a.status === "Rejected").length,
    };
  }, [allApplicants]);

  const renderItem: ListRenderItem<Applicant> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, getAvatarStyle(item.status)]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View
            style={[
              styles.statusIndicator,
              getStatusIndicatorStyle(item.status),
            ]}
          />
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.idText}>ID: {item.id}</Text>
          </View>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <View style={[styles.statusDot, getStatusDotStyle(item.status)]} />
            <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="school" size={18} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {item.course}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View
              style={[styles.infoIconContainer, { backgroundColor: "#ecfdf5" }]}
            >
              <Ionicons name="wallet" size={18} color="#10b981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Income</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(item.income)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewDetailsBtn}
          activeOpacity={0.7}
          onPress={() => router.push("/(dashboard)/provider/applicant-details")}
        >
          <Text style={styles.viewDetailsText}>View Full Application</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Applicants" />

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search applicants by name..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <FlatList
        horizontal
        data={TABS}
        contentContainerStyle={styles.tabsScrollContent}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const count = tabCounts[item.key as keyof typeof tabCounts];

          return (
            <TouchableOpacity
              style={[
                styles.tabChip,
                activeTab === item.key && styles.tabChipActive,
              ]}
              onPress={() => {
                setActiveTab(item.key);
                setPage(1);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item.key && styles.tabTextActive,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  activeTab === item.key && styles.countBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    activeTab === item.key && styles.countTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing {paginated.length} of {filtered.length} applicants
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={paginated}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (paginated.length < filtered.length) setPage((p) => p + 1);
        }}
        ListFooterComponent={
          paginated.length < filtered.length ? (
            <View style={styles.footerLoader}>
              <View style={styles.loaderDot} />
              <Text style={styles.footerText}>Loading more applicants...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="folder-open-outline" size={64} color="#d1d5db" />
            </View>
            <Text style={styles.emptyTitle}>No applicants found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        }
      />
    </View>
  );
}

function getStatusStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7" };
    case "Rejected":
      return { backgroundColor: "#fef2f2", borderColor: "#fca5a5" };
    default:
      return { backgroundColor: "#fef3c7", borderColor: "#fcd34d" };
  }
}

function getStatusTextStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { color: "#059669" };
    case "Rejected":
      return { color: "#dc2626" };
    default:
      return { color: "#d97706" };
  }
}

function getStatusDotStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#10b981" };
    case "Rejected":
      return { backgroundColor: "#ef4444" };
    default:
      return { backgroundColor: "#f59e0b" };
  }
}

function getStatusIndicatorStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#10b981" };
    case "Rejected":
      return { backgroundColor: "#ef4444" };
    default:
      return { backgroundColor: "#f59e0b" };
  }
}

function getAvatarStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#d1fae5", borderColor: "#6ee7b7" };
    case "Rejected":
      return { backgroundColor: "#fee2e2", borderColor: "#fca5a5" };
    default:
      return { backgroundColor: "#fef3c7", borderColor: "#fcd34d" };
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 2,
    borderColor: "#f1f5f9",
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
    color: "#1a1a1a",
    fontWeight: "500",
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#f1f5f9",
    gap: 8,
    marginRight: 10,
    height: 40,
  },
  tabChipActive: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  tabText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#fff",
  },
  countBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 22,
    alignItems: "center",
  },
  countBadgeActive: {
    backgroundColor: "#374151",
  },
  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
  },
  countTextActive: {
    color: "#fff",
  },
  resultsRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLeft: {
    marginRight: 14,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  statusIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  nameSection: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  idText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 9,
    borderRadius: 12,
    gap: 9,
  },
  infoIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  footerText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
});

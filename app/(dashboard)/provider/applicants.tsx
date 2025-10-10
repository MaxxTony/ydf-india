import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("All");
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
      .filter((a) => (q.length === 0 ? true : a.name.toLowerCase().includes(q)));
  }, [allApplicants, query, activeTab]);

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

  const renderItem: ListRenderItem<Applicant> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="school-outline" size={16} color="#4CAF50" />
          <Text style={styles.metaText}>{item.course}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash-outline" size={16} color="#2196F3" />
          <Text style={styles.metaText}>{formatCurrency(item.income)}</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.85} onPress={() => router.push("/(dashboard)/provider/applicant-details") }>
          <Text style={styles.detailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#333" />
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
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search by applicant name"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabChip, activeTab === t.key && styles.tabChipActive]}
            onPress={() => {
              setActiveTab(t.key);
              setPage(1);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
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
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No applicants found</Text>
          </View>
        }
      />
    </View>
  );
}

function getStatusStyle(status: ApplicantStatus) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#E8F5E9", borderColor: "#4CAF50" };
    case "Rejected":
      return { backgroundColor: "#FBE9E7", borderColor: "#F44336" };
    default:
      return { backgroundColor: "#E3F2FD", borderColor: "#2196F3" };
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 12,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#eee",
  },
  tabChipActive: {
    backgroundColor: "#333",
  },
  tabText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#333",
    fontWeight: "600",
  },
  actionsRow: {
    alignItems: "flex-end",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  detailsText: {
    color: "#333",
    fontWeight: "700",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
  },
  empty: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
});



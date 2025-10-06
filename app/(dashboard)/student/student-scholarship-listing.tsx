import { AppHeader, SearchBar } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const scholarships = [
  {
    id: 1,
    title: "Merit Scholarship 2024",
    description: "For students with outstanding academic performance",
    amount: "$5,000",
    deadline: "2024-03-15",
    category: "Academic",
    status: "Available",
    eligibility: "GPA 3.5+",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "Need-Based Grant",
    description: "Financial assistance for students in need",
    amount: "$3,000",
    deadline: "2024-03-20",
    category: "Financial Need",
    status: "Available",
    eligibility: "Income < $50k",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "STEM Excellence Award",
    description: "For students pursuing STEM fields",
    amount: "$7,500",
    deadline: "2024-03-10",
    category: "STEM",
    status: "Available",
    eligibility: "STEM Major",
    color: "#FF9800",
  },
  {
    id: 4,
    title: "Community Service Scholarship",
    description: "For students with significant community involvement",
    amount: "$2,500",
    deadline: "2024-03-25",
    category: "Community Service",
    status: "Available",
    eligibility: "100+ volunteer hours",
    color: "#9C27B0",
  },
  {
    id: 5,
    title: "International Student Fund",
    description: "Support for international students",
    amount: "$4,000",
    deadline: "2024-03-18",
    category: "International",
    status: "Available",
    eligibility: "International student",
    color: "#E91E63",
  },
];

const categories = [
  "All",
  "Academic",
  "Financial Need",
  "STEM",
  "Community Service",
  "International",
];
const sortOptions = ["Latest", "Ending Soon", "Highest Amount"] as const;

export default function ScholarshipListingScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] =
    useState<(typeof sortOptions)[number]>("Latest");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [deadlineBefore, setDeadlineBefore] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eligibility, setEligibility] = useState("");
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const inset = useSafeAreaInsets();

  const data = useMemo(() => {
    const parseAmount = (a: string) => Number(a.replace(/[^0-9.]/g, "")) || 0;
    const matches = (s: (typeof scholarships)[number]) => {
      const q = query.trim().toLowerCase();
      const qMatch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.eligibility.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      const catMatch =
        selectedCategory === "All" || s.category === selectedCategory;
      const minMatch = !minAmount || parseAmount(s.amount) >= Number(minAmount);
      const maxMatch = !maxAmount || parseAmount(s.amount) <= Number(maxAmount);
      const deadlineMatch =
        !deadlineBefore || new Date(s.deadline) <= deadlineBefore;
      const eligMatch =
        !eligibility ||
        s.eligibility.toLowerCase().includes(eligibility.trim().toLowerCase());
      return (
        qMatch && catMatch && minMatch && maxMatch && deadlineMatch && eligMatch
      );
    };
    let list = scholarships.filter(matches);

    if (selectedSort === "Latest") {
      list = list.sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );
    } else if (selectedSort === "Ending Soon") {
      list = list.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    } else if (selectedSort === "Highest Amount") {
      list = list.sort((a, b) => {
        const pa = parseAmount(a.amount);
        const pb = parseAmount(b.amount);
        return pb - pa;
      });
    }

    return list.slice(0, page * 10);
  }, [
    query,
    selectedCategory,
    selectedSort,
    minAmount,
    maxAmount,
    deadlineBefore,
    eligibility,
    page,
  ]);

  const loadMore = useCallback(() => {
    if (data.length >= page * 10) {
      setPage((p) => p + 1);
    }
  }, [data.length, page]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((b) => ({ ...b, [id]: !b[id] }));
  }, []);

  const openFilters = useCallback(() => {
    setShowFilters(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [slideAnim]);

  const closeFilters = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowFilters(false));
  }, [slideAnim]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setMinAmount("");
    setMaxAmount("");
    setDeadlineBefore(null);
    setEligibility("");
    setSelectedSort("Latest");
  }, []);

  const applyFilters = useCallback(() => {
    setPage(1);
    closeFilters();
  }, [closeFilters]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Expired", color: "#F44336" };
    if (diffDays === 0) return { text: "Today", color: "#FF9800" };
    if (diffDays === 1) return { text: "1 day left", color: "#FF9800" };
    if (diffDays <= 7)
      return { text: `${diffDays} days left`, color: "#FF9800" };
    return { text: `${diffDays} days left`, color: "#666" };
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (minAmount) count++;
    if (maxAmount) count++;
    if (deadlineBefore) count++;
    if (eligibility) count++;
    if (selectedSort !== "Latest") count++;
    return count;
  }, [
    selectedCategory,
    minAmount,
    maxAmount,
    deadlineBefore,
    eligibility,
    selectedSort,
  ]);

  const Header = (
    <View>
      <AppHeader
        title="Scholarships"
        onBack={() => router.back()}
        rightIcon={
          <TouchableOpacity onPress={openFilters} style={styles.filterIconBtn}>
            <Ionicons name="options-outline" size={22} color="#333" />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
        placeholder="Search scholarships..."
      />
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof scholarships)[number] }) => {
      const daysInfo = getDaysRemaining(item.deadline);

      return (
        <View style={[styles.scholarshipCard, { borderLeftColor: item.color }]}>
          <View style={styles.scholarshipHeader}>
            <View style={styles.scholarshipInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.scholarshipTitle}>{item.title}</Text>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Text
                    style={[styles.categoryBadgeText, { color: item.color }]}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>
              <Text style={styles.scholarshipDescription}>
                {item.description}
              </Text>
            </View>
          </View>

          <View style={styles.amountRow}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Award Amount</Text>
              <Text style={[styles.amountText, { color: item.color }]}>
                {item.amount}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleBookmark(item.id)}
              style={styles.bookmarkBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name={bookmarks[item.id] ? "bookmark" : "bookmark-outline"}
                size={24}
                color={bookmarks[item.id] ? "#FFB400" : "#999"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.scholarshipDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Deadline</Text>
                <View style={styles.deadlineRow}>
                  <Text style={styles.detailText}>
                    {new Date(item.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  <Text
                    style={[styles.daysRemaining, { color: daysInfo.color }]}
                  >
                    • {daysInfo.text}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#666"
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Eligibility</Text>
                <Text style={styles.detailText}>{item.eligibility}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              onPress={() =>
                router.push("/(dashboard)/student/student-scholarship-details")
              }
              style={styles.viewBtn}
            >
              <Ionicons name="eye-outline" size={18} color="#333" />
              <Text style={styles.viewBtnText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push("/(dashboard)/student/student-apply-form")
              }
              style={[styles.applyBtn, { backgroundColor: item.color }]}
            >
              <Ionicons name="paper-plane-outline" size={18} color="#fff" />
              <Text style={styles.applyBtnText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [bookmarks, toggleBookmark]
  );

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <LinearGradient
        colors={["#fff", "#fff", "#FFF8E1"]}
        style={styles.background}
        locations={[0, 0.4, 1]}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No scholarships found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters
            </Text>
          </View>
        }
      />

      <Modal
        visible={showFilters}
        animationType="fade"
        transparent
        onRequestClose={closeFilters}
        statusBarTranslucent
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeFilters}
          />
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters & Sorting</Text>
              {activeFiltersCount > 0 && (
                <View style={styles.activeFiltersBadge}>
                  <Text style={styles.activeFiltersText}>
                    {activeFiltersCount} active
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="grid-outline" size={18} color="#666" />
                <Text style={styles.sectionLabel}>Category</Text>
              </View>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(item)}
                    style={[
                      styles.categoryChip,
                      selectedCategory === item && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === item && styles.categoryTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              />
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="cash-outline" size={18} color="#666" />
                <Text style={styles.sectionLabel}>Amount Range</Text>
              </View>
              <View style={styles.advancedFiltersRow}>
                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Minimum</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={minAmount}
                      onChangeText={setMinAmount}
                      placeholder="0"
                      style={styles.filterInput}
                      placeholderTextColor="#bbb"
                    />
                  </View>
                </View>
                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Maximum</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={maxAmount}
                      onChangeText={setMaxAmount}
                      placeholder="10,000"
                      style={styles.filterInput}
                      placeholderTextColor="#bbb"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <Text style={styles.sectionLabel}>Deadline</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={deadlineBefore ? "#333" : "#999"}
                />
                <Text
                  style={[
                    styles.datePickerText,
                    deadlineBefore && styles.datePickerTextActive,
                  ]}
                >
                  {formatDate(deadlineBefore)}
                </Text>
                {deadlineBefore && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setDeadlineBefore(null);
                    }}
                    style={styles.clearDateBtn}
                  >
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color="#666"
                />
                <Text style={styles.sectionLabel}>Eligibility Keywords</Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={eligibility}
                  onChangeText={setEligibility}
                  placeholder="e.g., STEM, GPA, Female"
                  style={[styles.filterInput, styles.fullWidthInput]}
                  placeholderTextColor="#bbb"
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="swap-vertical-outline" size={18} color="#666" />
                <Text style={styles.sectionLabel}>Sort By</Text>
              </View>
              <View style={styles.sortRow}>
                {sortOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSelectedSort(opt)}
                    style={[
                      styles.sortChip,
                      selectedSort === opt && styles.sortChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortText,
                        selectedSort === opt && styles.sortTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sheetActions}>
              <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
                <Ionicons name="refresh-outline" size={20} color="#666" />
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                style={styles.applyBtnSheet}
              >
                <Text style={styles.applyBtnSheetText}>Apply Filters</Text>
                <Ionicons name="checkmark-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={deadlineBefore || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (event.type === "set" && selectedDate) {
                setDeadlineBefore(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    letterSpacing: -0.5,
  },
  filterIconBtn: {
    padding: 8,
    marginRight: -8,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  clearSearchBtn: {
    padding: 4,
  },
  scholarshipsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  scholarshipCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scholarshipHeader: {
    marginBottom: 16,
  },
  scholarshipInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  scholarshipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scholarshipDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    marginBottom: 16,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  bookmarkBtn: {
    padding: 8,
  },
  scholarshipDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  daysRemaining: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  viewBtnText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  activeFiltersBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeFiltersText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  categoryChipActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  advancedFiltersRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  filterField: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#999",
    marginRight: 8,
    fontWeight: "600",
  },
  inputIcon: {
    marginRight: 10,
  },
  filterInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  fullWidthInput: {
    paddingLeft: 0,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  datePickerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },
  datePickerTextActive: {
    color: "#333",
  },
  clearDateBtn: {
    padding: 4,
  },
  sortRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
  },
  sortChip: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  sortChipActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  sortText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "700",
  },
  sortTextActive: {
    color: "#fff",
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  clearBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  clearBtnText: {
    color: "#666",
    fontWeight: "700",
    fontSize: 15,
  },
  applyBtnSheet: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
  },
  applyBtnSheetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

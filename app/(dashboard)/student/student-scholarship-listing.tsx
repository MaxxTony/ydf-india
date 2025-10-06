import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    color: "#4CAF50"
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
    color: "#2196F3"
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
    color: "#FF9800"
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
    color: "#9C27B0"
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
    color: "#E91E63"
  }
];

const categories = ["All", "Academic", "Financial Need", "STEM", "Community Service", "International"];

export default function ScholarshipListingScreen() {
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
          <Text style={styles.headerTitle}>Available Scholarships</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search scholarships..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Category Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryChip,
                  index === 0 && styles.categoryChipActive
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Scholarships List */}
        <View style={styles.scholarshipsContainer}>
          <Text style={styles.sectionTitle}>{scholarships.length} Scholarships Available</Text>
          {scholarships.map((scholarship) => (
            <TouchableOpacity
              key={scholarship.id}
              style={[styles.scholarshipCard, { borderLeftColor: scholarship.color }]}
              onPress={() => router.push("/(dashboard)/student/student-scholarship-details")}
            >
              <View style={styles.scholarshipHeader}>
                <View style={styles.scholarshipInfo}>
                  <Text style={styles.scholarshipTitle}>{scholarship.title}</Text>
                  <Text style={styles.scholarshipDescription}>{scholarship.description}</Text>
                </View>
                <View style={styles.scholarshipAmount}>
                  <Text style={styles.amountText}>{scholarship.amount}</Text>
                </View>
              </View>
              
              <View style={styles.scholarshipDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Deadline: {scholarship.deadline}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="school-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{scholarship.eligibility}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="pricetag-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{scholarship.category}</Text>
                </View>
              </View>

              <View style={styles.scholarshipFooter}>
                <View style={[styles.statusBadge, { backgroundColor: scholarship.color + '20' }]}>
                  <Text style={[styles.statusText, { color: scholarship.color }]}>
                    {scholarship.status}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  filtersContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  categoryChipActive: {
    backgroundColor: "#333",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
  },
  scholarshipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  scholarshipCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scholarshipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scholarshipInfo: {
    flex: 1,
    marginRight: 12,
  },
  scholarshipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  scholarshipDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  scholarshipAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4CAF50",
  },
  scholarshipDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  scholarshipFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});


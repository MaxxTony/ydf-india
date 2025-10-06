import { Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const scholarship = {
  id: 1,
  title: "Merit Scholarship 2024",
  description: "For students with outstanding academic performance and leadership qualities",
  amount: "$5,000",
  deadline: "March 15, 2024",
  category: "Academic",
  status: "Available",
  eligibility: [
    "Minimum GPA of 3.5",
    "Full-time undergraduate student",
    "Must be enrolled in an accredited institution",
    "No previous disciplinary actions"
  ],
  requiredDocuments: [
    "Official transcript",
    "Letter of recommendation",
    "Personal statement (500 words)",
    "Financial aid form",
    "Proof of enrollment"
  ],
  color: "#4CAF50"
};

export default function ScholarshipDetailsScreen() {
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
          <Text style={styles.headerTitle}>Scholarship Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Scholarship Card */}
        <View style={[styles.scholarshipCard, { borderLeftColor: scholarship.color }]}>
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
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Deadline</Text>
                <Text style={styles.detailValue}>{scholarship.deadline}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={20} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{scholarship.category}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: scholarship.color }]}>
                  {scholarship.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Eligibility Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          <View style={styles.criteriaCard}>
            {scholarship.eligibility.map((criteria, index) => (
              <View key={index} style={styles.criteriaItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.criteriaText}>{criteria}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.documentsCard}>
            {scholarship.requiredDocuments.map((document, index) => (
              <View key={index} style={styles.documentItem}>
                <Ionicons name="document-outline" size={16} color="#2196F3" />
                <Text style={styles.documentText}>{document}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Important Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <View style={styles.notesCard}>
            <View style={styles.noteItem}>
              <Ionicons name="information-circle-outline" size={16} color="#FF9800" />
              <Text style={styles.noteText}>
                Applications must be submitted before the deadline. Late submissions will not be considered.
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Ionicons name="time-outline" size={16} color="#FF9800" />
              <Text style={styles.noteText}>
                Processing time is typically 4-6 weeks after the deadline.
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Ionicons name="mail-outline" size={16} color="#FF9800" />
              <Text style={styles.noteText}>
                You will receive email notifications about your application status.
              </Text>
            </View>
          </View>
        </View>

        {/* Apply Button */}
        <View style={styles.applyContainer}>
          <Button
            title="Apply Now"
            onPress={() => router.push("/(dashboard)/student/student-apply-form")}
            variant="primary"
            style={styles.applyButton}
          />
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
  scholarshipCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
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
    marginBottom: 16,
  },
  scholarshipInfo: {
    flex: 1,
    marginRight: 12,
  },
  scholarshipTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  scholarshipDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  scholarshipAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4CAF50",
  },
  scholarshipDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailContent: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  criteriaCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  criteriaText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  documentsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  documentText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  notesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  applyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  applyButton: {
    marginTop: 8,
  },
});


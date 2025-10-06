import { Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const requiredDocuments = [
  {
    id: 1,
    name: "Official Transcript",
    description: "Most recent official academic transcript",
    status: "uploaded",
    size: "2.3 MB",
    type: "PDF"
  },
  {
    id: 2,
    name: "Letter of Recommendation",
    description: "From a teacher or academic advisor",
    status: "pending",
    size: null,
    type: "PDF"
  },
  {
    id: 3,
    name: "Financial Aid Form",
    description: "Completed financial aid application",
    status: "uploaded",
    size: "1.8 MB",
    type: "PDF"
  },
  {
    id: 4,
    name: "Proof of Enrollment",
    description: "Current semester enrollment verification",
    status: "pending",
    size: null,
    type: "PDF"
  },
  {
    id: 5,
    name: "Personal Statement",
    description: "Your scholarship application essay",
    status: "uploaded",
    size: "456 KB",
    type: "PDF"
  }
];

const digiLockerDocuments = [
  {
    id: 1,
    name: "Aadhaar Card",
    description: "Government issued ID",
    status: "available",
    source: "DigiLocker"
  },
  {
    id: 2,
    name: "PAN Card",
    description: "Tax identification document",
    status: "available",
    source: "DigiLocker"
  },
  {
    id: 3,
    name: "Bank Statement",
    description: "Last 3 months bank statement",
    status: "available",
    source: "DigiLocker"
  }
];

export default function DocumentUploadScreen() {
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
          <Text style={styles.headerTitle}>Document Upload</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotCompleted]} />
            <Text style={styles.progressText}>Personal Info</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineCompleted]} />
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <Text style={styles.progressText}>Documents</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Review</Text>
          </View>
        </View>

        {/* Upload Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Upload Progress</Text>
            <Text style={styles.progressPercentage}>60% Complete</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressSubtext}>3 of 5 documents uploaded</Text>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {requiredDocuments.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentDescription}>{doc.description}</Text>
                </View>
                <View style={styles.documentStatus}>
                  {doc.status === 'uploaded' ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  ) : (
                    <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                  )}
                </View>
              </View>
              
              {doc.status === 'uploaded' ? (
                <View style={styles.uploadedInfo}>
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-outline" size={16} color="#2196F3" />
                    <Text style={styles.fileText}>{doc.type} • {doc.size}</Text>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#4CAF50" />
                  <Text style={styles.uploadText}>Upload Document</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* DigiLocker Integration */}
        <View style={styles.section}>
          <View style={styles.digiLockerHeader}>
            <Text style={styles.sectionTitle}>DigiLocker Documents</Text>
            <TouchableOpacity style={styles.digiLockerButton}>
              <Ionicons name="link-outline" size={16} color="#4CAF50" />
              <Text style={styles.digiLockerText}>Connect DigiLocker</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.digiLockerCard}>
            <View style={styles.digiLockerInfo}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
              <View style={styles.digiLockerTextContainer}>
                <Text style={styles.digiLockerTitle}>DigiLocker Integration</Text>
                <Text style={styles.digiLockerDescription}>
                  Securely import your government documents directly from DigiLocker
                </Text>
              </View>
            </View>
            
            {digiLockerDocuments.map((doc) => (
              <TouchableOpacity key={doc.id} style={styles.digiLockerItem}>
                <View style={styles.digiLockerItemInfo}>
                  <Text style={styles.digiLockerItemName}>{doc.name}</Text>
                  <Text style={styles.digiLockerItemDescription}>{doc.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upload Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Supported formats: PDF, JPG, PNG (Max 10MB)</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Ensure documents are clear and readable</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>All documents must be in English or translated</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Keep original documents for verification</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Save Progress"
            onPress={() => {}}
            variant="secondary"
            style={styles.saveButton}
          />
          <Button
            title="Continue to Review"
            onPress={() => router.push("/(dashboard)/student/student-application-status")}
            variant="primary"
            style={styles.continueButton}
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressStep: {
    alignItems: "center",
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: "#4CAF50",
  },
  progressDotCompleted: {
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  progressCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  documentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginRight: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: "#666",
  },
  documentStatus: {
    alignItems: "center",
  },
  uploadedInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 8,
    fontWeight: "500",
  },
  digiLockerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  digiLockerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  digiLockerText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  digiLockerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  digiLockerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  digiLockerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  digiLockerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  digiLockerDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  digiLockerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  digiLockerItemInfo: {
    flex: 1,
  },
  digiLockerItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  digiLockerItemDescription: {
    fontSize: 12,
    color: "#666",
  },
  tipsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  saveButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});


import { AppHeader, Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DocumentStatus = "uploaded" | "pending" | "rejected";
type DocumentLabel = "approved" | "rejected" | "pending";

type RequiredDocument = {
  id: number;
  name: string;
  description: string;
  status: DocumentStatus;
  label: DocumentLabel;
  size: string | null;
  type: string;
  uri?: string | null;
  rejectedReason?: string | null;
};

const initialRequiredDocuments: RequiredDocument[] = [
  {
    id: 1,
    name: "College certificate",
    description: "Upload your college certificate",
    status: "pending",
    label: "pending",
    size: null,
    type: "PDF",
  },
  {
    id: 2,
    name: "College ID",
    description: "Upload your college ID",
    status: "pending",
    label: "pending",
    size: null,
    type: "PDF",
  },
  {
    id: 3,
    name: "College marksheet",
    description: "Upload your latest marksheet",
    status: "pending",
    label: "pending",
    size: null,
    type: "PDF",
  },
  {
    id: 4,
    name: "Income proof",
    description: "Upload income proof document",
    status: "pending",
    label: "pending",
    size: null,
    type: "PDF",
  },
];

const digiLockerDocuments = [
  {
    id: 1,
    name: "Aadhaar Card",
    description: "Government issued ID",
    status: "available",
    source: "DigiLocker",
  },
  {
    id: 2,
    name: "PAN Card",
    description: "Tax identification document",
    status: "available",
    source: "DigiLocker",
  },
  {
    id: 3,
    name: "Bank Statement",
    description: "Last 3 months bank statement",
    status: "available",
    source: "DigiLocker",
  },
];

// Upload types grid removed in favor of per-document controls

export default function DocumentUploadScreen() {
  const [documents, setDocuments] = useState<RequiredDocument[]>(
    initialRequiredDocuments
  );
  // No upload progress per requirements

  async function handlePickFile(docId?: number) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const sizeMb = asset.size
        ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
        : null;
      setDocuments((prev) =>
        prev.map((d) => {
          if (docId ? d.id === docId : d.status !== "uploaded") {
            return {
              ...d,
              status: "uploaded",
              label: "approved",
              size: sizeMb,
              type: asset.mimeType?.toUpperCase()?.includes("PDF")
                ? "PDF"
                : "FILE",
              uri: asset.uri,
              rejectedReason: null,
            };
          }
          return d;
        })
      );
    } catch (e) {
      Alert.alert("Upload failed", "Please try again.");
    }
  }

  async function handleCameraCapture() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to capture documents."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;
      const sizeMb = asset.fileSize
        ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB`
        : null;
      setDocuments((prev) => {
        const targetIndex = prev.findIndex((d) => d.status !== "uploaded");
        if (targetIndex === -1) return prev;
        const target = prev[targetIndex];
        const updated: RequiredDocument = {
          ...target,
          status: "uploaded",
          label: "approved",
          size: sizeMb ?? target.size,
          type: "IMAGE",
          uri: asset.uri,
          rejectedReason: null,
        };
        const copy = [...prev];
        copy[targetIndex] = updated;
        return copy;
      });
    } catch (e) {
      Alert.alert("Camera error", "Unable to capture image. Please try again.");
    }
  }



  function handleDelete(id: number) {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "pending", label: "pending", size: null, uri: null }
          : d
      )
    );
  }

  function handleConnectDigiLocker() {
    Alert.alert(
      "DigiLocker",
      "Connecting to DigiLocker is not configured yet."
    );
  }

  function handleSyncDigiLocker() {
    Alert.alert("DigiLocker", "DigiLocker Sync: updating to latest documents...");
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />
      <AppHeader
        title="Document Upload"
        onBack={() => router.back()}
        rightIcon={<View />}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {documents.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentDescription}>
                    {doc.description}
                  </Text>
                </View>
                <View style={styles.documentStatus}>
                  {doc.status === "uploaded" ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4CAF50"
                    />
                  ) : doc.status === "rejected" ? (
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  ) : (
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color="#666"
                    />
                  )}
                </View>
              </View>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    doc.label === "approved" && styles.badgeSuccess,
                    doc.label === "rejected" && styles.badgeError,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      (doc.label === "approved" || doc.label === "rejected") &&
                        styles.badgeTextDark,
                    ]}
                  >
                    {doc.label === "approved"
                      ? "Approved"
                      : doc.label === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </Text>
                </View>
                {doc.status === "uploaded" && (
                  <View style={styles.metaPill}>
                    <Text style={styles.metaPillText}>
                      {doc.type}
                      {doc.size ? ` • ${doc.size}` : ""}
                    </Text>
                  </View>
                )}
              </View>
              {doc.status === "rejected" && !!doc.rejectedReason && (
                <View style={styles.rejectedBanner}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#F44336"
                  />
                  <Text style={styles.rejectedText}>
                    Rejected: {doc.rejectedReason}
                  </Text>
                  <TouchableOpacity
                    style={styles.smallLink}
                    onPress={() => handlePickFile(doc.id)}
                  >
                    <Text style={styles.smallLinkText}>Re-upload</Text>
                  </TouchableOpacity>
                </View>
              )}

              {doc.status !== "uploaded" ? (
                <View style={styles.controlsRow}>
                  <TouchableOpacity
                    style={styles.smallAction}
                    onPress={() => handlePickFile(doc.id)}
                  >
                    <Ionicons name="document-text-outline" size={16} color="#4CAF50" />
                    <Text style={styles.smallActionText}>Document Picker</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallAction}
                    onPress={() => handleCameraCapture()}
                  >
                    <Ionicons name="camera-outline" size={16} color="#4CAF50" />
                    <Text style={styles.smallActionText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadedInfo}>
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-outline" size={16} color="#2196F3" />
                    <Text style={styles.fileText}>{doc.type} • {doc.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert("View", "Viewer will be integrated later.")}
                  >
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(doc.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* DigiLocker Integration */}
        <View style={styles.section}>
          <View style={styles.digiLockerHeader}>
            <Text style={styles.sectionTitle}>DigiLocker Documents</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.digiLockerButton,
                  { backgroundColor: "#4CAF50" },
                ]}
                onPress={handleConnectDigiLocker}
              >
                <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
                <Text style={[styles.digiLockerText, { color: "#fff" }]}>Upload using DigiLocker</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.digiLockerButton,
                  {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#4CAF50",
                  },
                ]}
                onPress={handleSyncDigiLocker}
              >
                <Ionicons name="sync-outline" size={16} color="#4CAF50" />
                <Text style={[styles.digiLockerText, { color: "#4CAF50" }]}>DigiLocker Sync</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.digiLockerCard}>
            <View style={styles.digiLockerInfo}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
              <View style={styles.digiLockerTextContainer}>
                <Text style={styles.digiLockerTitle}>
                  DigiLocker Integration
                </Text>
                <Text style={styles.digiLockerDescription}>
                  Securely import your government documents directly from
                  DigiLocker
                </Text>
              </View>
            </View>

            {digiLockerDocuments.map((doc) => (
              <TouchableOpacity key={doc.id} style={styles.digiLockerItem}>
                <View style={styles.digiLockerItemInfo}>
                  <Text style={styles.digiLockerItemName}>{doc.name}</Text>
                  <Text style={styles.digiLockerItemDescription}>
                    {doc.description}
                  </Text>
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
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.tipText}>
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.tipText}>
                Ensure documents are clear and readable
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.tipText}>
                All documents must be in English or translated
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.tipText}>
                Keep original documents for verification
              </Text>
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
            onPress={() =>
              router.push("/(dashboard)/student/student-application-status")
            }
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
  // AppHeader used instead of local header styles above
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
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSuccess: {
    backgroundColor: "#E7F6EC",
  },
  badgeError: {
    backgroundColor: "#FDEDED",
  },
  badgeText: {
    fontSize: 12,
    color: "#8A5A00",
    fontWeight: "600",
  },
  badgeTextDark: {
    color: "#2E7D32",
  },
  metaPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaPillText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
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
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginTop: 8,
  },
  smallAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  smallActionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  digiLockerText: {
    fontSize: 12,
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
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  typeItem: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  typeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E7F6EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  inlineActions: {
    flexDirection: "row",
    gap: 12,
  },
  inlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inlineBtnLight: {
    backgroundColor: "#E7F6EC",
  },
  inlineBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  rejectedBanner: {
    backgroundColor: "#FDEDED",
    borderWidth: 1,
    borderColor: "#F8BFBF",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  rejectedText: {
    color: "#B71C1C",
    fontSize: 12,
    flex: 1,
  },
  smallLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F8BFBF",
  },
  smallLinkText: {
    color: "#B71C1C",
    fontWeight: "700",
    fontSize: 12,
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
    flex: 1,
  },
});

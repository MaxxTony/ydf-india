import { AppHeader, Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DocumentStatus = "pending" | "uploaded" | "approved" | "rejected";

type Document = {
  id: number;
  name: string;
  description: string;
  status: DocumentStatus;
  file?: {
    name: string;
    size: string;
    type: string;
    uri: string;
  };
  rejectionReason?: string;
};

const REQUIRED_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "College Certificate",
    description: "Official certificate from your institution",
    status: "pending",
  },
  {
    id: 2,
    name: "College ID Card",
    description: "Valid student identification card",
    status: "pending",
  },
  {
    id: 3,
    name: "Latest Marksheet",
    description: "Most recent semester/year marksheet",
    status: "pending",
  },
  {
    id: 4,
    name: "Income Proof",
    description: "Family income certificate or proof",
    status: "pending",
  },
];

type UploadMethod = "manual" | "digilocker";

export default function DocumentUploadScreen() {
  const [documents, setDocuments] = useState<Document[]>(REQUIRED_DOCUMENTS);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("manual");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [isDigiLockerConnected, setIsDigiLockerConnected] = useState(false);

  // Calculate upload progress
  const uploadedCount = documents.filter(
    (d) => d.status === "uploaded" || d.status === "approved"
  ).length;
  const progress = Math.round((uploadedCount / documents.length) * 100);

  const openUploadModal = (docId: number) => {
    setSelectedDocId(docId);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedDocId(null);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const sizeInMB = asset.size
        ? (asset.size / (1024 * 1024)).toFixed(2)
        : "0";

      const fileType = asset.mimeType?.toLowerCase().includes("pdf")
        ? "PDF"
        : "Image";

      updateDocument({
        name: asset.name,
        size: `${sizeInMB} MB`,
        type: fileType,
        uri: asset.uri,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to upload document. Please try again.");
    }
  };

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed to capture documents."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const sizeInMB = asset.fileSize
        ? (asset.fileSize / (1024 * 1024)).toFixed(2)
        : "0";

      updateDocument({
        name: `Camera_${Date.now()}.jpg`,
        size: `${sizeInMB} MB`,
        type: "Image",
        uri: asset.uri,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  };

  const updateDocument = (file: {
    name: string;
    size: string;
    type: string;
    uri: string;
  }) => {
    if (!selectedDocId) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocId
          ? { ...doc, status: "uploaded", file, rejectionReason: undefined }
          : doc
      )
    );

    closeUploadModal();
  };

  const handleDeleteDocument = (docId: number) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === docId
                  ? {
                      ...doc,
                      status: "pending",
                      file: undefined,
                      rejectionReason: undefined,
                    }
                  : doc
              )
            );
          },
        },
      ]
    );
  };

  const handleConnectDigiLocker = () => {
    // Simulate DigiLocker connection
    Alert.alert(
      "Connect to DigiLocker",
      "You will be redirected to DigiLocker to authenticate and authorize access.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: () => {
            setIsDigiLockerConnected(true);
            setUploadMethod("digilocker");
            Alert.alert("Success", "DigiLocker connected successfully!");
          },
        },
      ]
    );
  };

  const handleSyncDigiLocker = () => {
    if (!isDigiLockerConnected) {
      Alert.alert("Error", "Please connect to DigiLocker first.");
      return;
    }

    Alert.alert(
      "Sync DigiLocker",
      "This will fetch the latest documents from your DigiLocker account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sync",
          onPress: () => {
            // TODO: Implement DigiLocker sync logic
            Alert.alert("Info", "DigiLocker sync will be implemented soon.");
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    const pendingDocs = documents.filter((d) => d.status === "pending");

    if (pendingDocs.length > 0) {
      Alert.alert(
        "Incomplete Documents",
        `Please upload all required documents. ${pendingDocs.length} document(s) pending.`
      );
      return;
    }

    router.push("/(dashboard)/student/student-application-status");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <AppHeader
        title="Upload Documents"
        onBack={() => router.back()}
        rightIcon={<View />}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Upload Progress</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {uploadedCount} of {documents.length} documents uploaded
          </Text>
        </View>

        {/* Upload Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Upload Method</Text>
          <View style={styles.methodCard}>
            <TouchableOpacity
              style={[
                styles.methodOption,
                uploadMethod === "manual" && styles.methodOptionActive,
              ]}
              onPress={() => setUploadMethod("manual")}
            >
              <View
                style={[
                  styles.methodRadio,
                  uploadMethod === "manual" && styles.methodRadioActive,
                ]}
              >
                {uploadMethod === "manual" && (
                  <View style={styles.methodRadioDot} />
                )}
              </View>
              <Ionicons name="cloud-upload-outline" size={24} color="#4CAF50" />
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Manual Upload</Text>
                <Text style={styles.methodDesc}>
                  Upload via camera or file picker
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.methodDivider} />

            <TouchableOpacity
              style={[
                styles.methodOption,
                uploadMethod === "digilocker" && styles.methodOptionActive,
              ]}
              onPress={() => {
                if (!isDigiLockerConnected) {
                  handleConnectDigiLocker();
                } else {
                  setUploadMethod("digilocker");
                }
              }}
            >
              <View
                style={[
                  styles.methodRadio,
                  uploadMethod === "digilocker" && styles.methodRadioActive,
                ]}
              >
                {uploadMethod === "digilocker" && (
                  <View style={styles.methodRadioDot} />
                )}
              </View>
              <Ionicons name="shield-checkmark" size={24} color="#2196F3" />
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>
                  DigiLocker
                  {isDigiLockerConnected && (
                    <Text style={styles.connectedBadge}> • Connected</Text>
                  )}
                </Text>
                <Text style={styles.methodDesc}>
                  Import verified government documents
                </Text>
              </View>
            </TouchableOpacity>

            {uploadMethod === "digilocker" && isDigiLockerConnected && (
              <TouchableOpacity
                style={styles.syncButton}
                onPress={handleSyncDigiLocker}
              >
                <Ionicons name="sync-outline" size={16} color="#2196F3" />
                <Text style={styles.syncButtonText}>Sync DigiLocker</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>

          {documents.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docDesc}>{doc.description}</Text>
                </View>

                {/* Status Icon */}
                {doc.status === "uploaded" || doc.status === "approved" ? (
                  <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                ) : doc.status === "rejected" ? (
                  <Ionicons name="close-circle" size={28} color="#F44336" />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={28}
                    color="#BDBDBD"
                  />
                )}
              </View>

              {/* Rejection Reason */}
              {doc.status === "rejected" && doc.rejectionReason && (
                <View style={styles.rejectionBanner}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color="#D32F2F"
                  />
                  <Text style={styles.rejectionText}>
                    {doc.rejectionReason}
                  </Text>
                </View>
              )}

              {/* Uploaded File Info */}
              {doc.file && (
                <View style={styles.fileInfo}>
                  <View style={styles.fileIcon}>
                    <Ionicons
                      name={
                        doc.file.type === "PDF"
                          ? "document-text"
                          : "image"
                      }
                      size={20}
                      color="#2196F3"
                    />
                  </View>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {doc.file.name}
                    </Text>
                    <Text style={styles.fileMeta}>
                      {doc.file.type} • {doc.file.size}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteDocument(doc.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Upload Button */}
              {!doc.file && uploadMethod === "manual" && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => openUploadModal(doc.id)}
                >
                  <Ionicons name="add-circle" size={20} color="#4CAF50" />
                  <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
              )}

              {!doc.file && uploadMethod === "digilocker" && (
                <TouchableOpacity
                  style={[styles.uploadButton, styles.digilockerUploadBtn]}
                  onPress={() =>
                    Alert.alert("Info", "DigiLocker import coming soon")
                  }
                >
                  <Ionicons name="download-outline" size={20} color="#2196F3" />
                  <Text style={[styles.uploadButtonText, { color: "#2196F3" }]}>
                    Import from DigiLocker
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Upload Guidelines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Guidelines</Text>
          <View style={styles.guidelinesCard}>
            <GuidelineItem
              icon="checkmark-circle"
              text="Supported formats: PDF, JPG, PNG (Max 10MB)"
            />
            <GuidelineItem
              icon="checkmark-circle"
              text="Ensure documents are clear and legible"
            />
            <GuidelineItem
              icon="checkmark-circle"
              text="Documents must be in English or include translation"
            />
            <GuidelineItem
              icon="checkmark-circle"
              text="Keep originals for verification purposes"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Save Draft"
            onPress={() => Alert.alert("Success", "Progress saved!")}
            variant="secondary"
            style={styles.saveBtn}
          />
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            style={styles.continueBtn}
          />
        </View>
      </ScrollView>

      {/* Upload Method Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="fade"
        onRequestClose={closeUploadModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeUploadModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Upload Method</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                closeUploadModal();
                handleFileUpload();
              }}
            >
              <View style={styles.modalIconWrap}>
                <Ionicons name="folder-open" size={24} color="#4CAF50" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>File Picker</Text>
                <Text style={styles.modalOptionDesc}>
                  Choose from your device storage
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                closeUploadModal();
                handleCameraCapture();
              }}
            >
              <View style={styles.modalIconWrap}>
                <Ionicons name="camera" size={24} color="#2196F3" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Camera</Text>
                <Text style={styles.modalOptionDesc}>
                  Take a photo of your document
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={closeUploadModal}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function GuidelineItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.guidelineItem}>
      <Ionicons name={icon as any} size={18} color="#4CAF50" />
      <Text style={styles.guidelineText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2c44d",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  methodOptionActive: {
    opacity: 1,
  },
  methodRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  methodRadioActive: {
    borderColor: "#4CAF50",
  },
  methodRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  connectedBadge: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  methodDesc: {
    fontSize: 13,
    color: "#666",
  },
  methodDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
  },
  docCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  docInfo: {
    flex: 1,
    marginRight: 12,
  },
  docName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  docDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  rejectionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  rejectionText: {
    flex: 1,
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "500",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  fileMeta: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F8F4",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
    gap: 8,
  },
  digilockerUploadBtn: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  guidelinesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  saveBtn: {
    flex: 1,
  },
  continueBtn: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  modalOptionDesc: {
    fontSize: 13,
    color: "#666",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});
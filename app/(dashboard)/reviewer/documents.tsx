import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewerHeader } from "../../../components";

type DocItem = {
  id: string;
  title: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
  comment?: string;
};

export default function ReviewerDocumentsScreen() {
  const inset = useSafeAreaInsets();
  const [documents, setDocuments] = useState<DocItem[]>([
    { id: "1", title: "College ID", fileName: "college_id.pdf", status: "pending" },
    { id: "2", title: "Marksheet", fileName: "marksheet_sem1.pdf", status: "pending" },
    { id: "3", title: "Income Proof", fileName: "income_certificate.jpg", status: "pending" },
    { id: "4", title: "Certificates", fileName: "achievements.zip", status: "pending" },
  ]);

  const stats = useMemo(() => {
    const verified = documents.filter((d) => d.status === "verified").length;
    const rejected = documents.filter((d) => d.status === "rejected").length;
    const pending = documents.filter((d) => d.status === "pending").length;
    return { verified, rejected, pending, total: documents.length };
  }, [documents]);

  const allReviewed = stats.pending === 0;
  const hasRejections = stats.rejected > 0;

  const updateDocStatus = (id: string, status: "verified" | "rejected") => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const updateComment = (id: string, comment: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, comment } : doc))
    );
  };

  const handleSave = () => {
    Alert.alert("Saved", "Progress saved successfully");
  };

  const handleSubmit = () => {
    if (!allReviewed) {
      Alert.alert("Incomplete Review", "Please review all documents before submitting");
      return;
    }
    Alert.alert("Submit Review", "Are you sure you want to submit this review?", [
      { text: "Cancel", style: "cancel" },
      { text: "Submit", onPress: () => console.log("Review submitted") },
    ]);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return "document-text";
    if (fileName.match(/\.(jpg|jpeg|png)$/)) return "image";
    if (fileName.endsWith(".zip")) return "folder";
    return "document";
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title="Document Verification"
        subtitle="Review and validate uploaded files"
      />

      {/* Progress Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: "#10B981" }]} />
          <Text style={styles.statText}>Verified: {stats.verified}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.statText}>Rejected: {stats.rejected}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: "#F59E0B" }]} />
          <Text style={styles.statText}>Pending: {stats.pending}</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {documents.map((doc, index) => (
          <View key={doc.id} style={styles.docCard}>
            {/* Document Header */}
            <View style={styles.docTop}>
              <View style={styles.docInfo}>
                <View style={[styles.fileIcon, getIconBgColor(doc.status)]}>
                  <Ionicons 
                    name={getFileIcon(doc.fileName)} 
                    size={22} 
                    color={getIconColor(doc.status)} 
                  />
                </View>
                <View style={styles.docText}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.fileName}>{doc.fileName}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.previewButton}
                onPress={() => console.log("Preview", doc.fileName)}
              >
                <Ionicons name="eye-outline" size={18} color="#3B82F6" />
                <Text style={styles.previewText}>View</Text>
              </TouchableOpacity>
            </View>

            {/* Status Badge */}
            {doc.status !== "pending" && (
              <View style={[styles.statusBadge, getStatusBadgeStyle(doc.status)]}>
                <Ionicons 
                  name={doc.status === "verified" ? "checkmark-circle" : "close-circle"} 
                  size={14} 
                  color="#fff" 
                />
                <Text style={styles.statusBadgeText}>
                  {doc.status === "verified" ? "Verified" : "Rejected"}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.verifyBtn,
                  doc.status === "verified" && styles.verifyBtnActive,
                ]}
                onPress={() => updateDocStatus(doc.id, "verified")}
              >
                <Ionicons
                  name={doc.status === "verified" ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={20}
                  color={doc.status === "verified" ? "#fff" : "#10B981"}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    doc.status === "verified" && styles.actionBtnTextActive,
                  ]}
                >
                  Verify
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.rejectBtn,
                  doc.status === "rejected" && styles.rejectBtnActive,
                ]}
                onPress={() => updateDocStatus(doc.id, "rejected")}
              >
                <Ionicons
                  name={doc.status === "rejected" ? "close-circle" : "close-circle-outline"}
                  size={20}
                  color={doc.status === "rejected" ? "#fff" : "#EF4444"}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    doc.status === "rejected" && styles.actionBtnTextActive,
                  ]}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>

            {/* Comment Section - Only show when rejected or has comment */}
            {(doc.status === "rejected" || doc.comment) && (
              <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>
                  {doc.status === "rejected" ? "Rejection reason *" : "Comment (optional)"}
                </Text>
                <TextInput
                  value={doc.comment}
                  onChangeText={(text) => updateComment(doc.id, text)}
                  placeholder={
                    doc.status === "rejected"
                      ? "Please specify the reason for rejection"
                      : "Add any notes or observations"
                  }
                  placeholderTextColor="#9CA3AF"
                  style={[
                    styles.commentInput,
                    doc.status === "rejected" && !doc.comment && styles.commentInputError,
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: inset.bottom || 16 }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="bookmark-outline" size={20} color="#6B7280" />
          <Text style={styles.saveButtonText}>Save Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, !allReviewed && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!allReviewed}
        >
          <Ionicons name="checkmark-done" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>
            {allReviewed ? "Submit Review" : `${stats.pending} Pending`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getIconBgColor = (status: string) => {
  switch (status) {
    case "verified": return { backgroundColor: "#D1FAE5" };
    case "rejected": return { backgroundColor: "#FEE2E2" };
    default: return { backgroundColor: "#F3F4F6" };
  }
};

const getIconColor = (status: string) => {
  switch (status) {
    case "verified": return "#10B981";
    case "rejected": return "#EF4444";
    default: return "#6B7280";
  }
};

const getStatusBadgeStyle = (status: string) => {
  return status === "verified"
    ? { backgroundColor: "#10B981" }
    : { backgroundColor: "#EF4444" };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  docCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  docTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  docInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  docText: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  fileName: {
    fontSize: 13,
    color: "#6B7280",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  verifyBtn: {
    backgroundColor: "#fff",
    borderColor: "#10B981",
  },
  verifyBtnActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  rejectBtn: {
    backgroundColor: "#fff",
    borderColor: "#EF4444",
  },
  rejectBtnActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  actionBtnTextActive: {
    color: "#fff",
  },
  commentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    minHeight: 70,
    backgroundColor: "#F9FAFB",
  },
  commentInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
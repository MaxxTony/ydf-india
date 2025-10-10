import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewerHeader } from "../../../components";

export default function ReviewerApplicationDetailsScreen() {
  const inset = useSafeAreaInsets();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const app = useMemo(
    () => ({
      scholarshipTitle: "STEM Excellence Scholarship",
      studentName: "Ravi Patel",
      status: "Pending",
      student: {
        age: 19,
        course: "B.Sc. Computer Science",
        category: "General",
        annualIncome: "₹2,40,000",
        email: "ravi.patel@example.com",
        phone: "+91 98765 43210",
      },
      documents: [
        { id: "d1", name: "Aadhaar Card.pdf", type: "ID" },
        { id: "d2", name: "Income Certificate.jpg", type: "Financial" },
        { id: "d3", name: "Marksheet Sem 1.pdf", type: "Academic" },
      ],
      personalStatement:
        "I aspire to contribute to AI for social good. This scholarship will help me focus on research and community projects.",
      comments: [
        {
          id: "c1",
          author: "You",
          text: "Check income certificate clarity.",
          time: "2h ago",
        },
        {
          id: "c2",
          author: "Team",
          text: "Marksheets verified.",
          time: "1d ago",
        },
      ],
    }),
    []
  );

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title={app.scholarshipTitle}
        subtitle={app.studentName}
        rightElement={
          <View
            style={[styles.statusBadge, getStatusBadgeStyle(app.status as any)]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: getStatusColor(app.status as any) },
              ]}
            >
              {app.status}
            </Text>
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Info</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="Name" value={app.studentName} />
            <InfoRow label="Age" value={String(app.student.age)} />
            <InfoRow label="Course" value={app.student.course} />
            <InfoRow label="Category" value={app.student.category} />
            <InfoRow label="Annual Income" value={app.student.annualIncome} />
            <InfoRow label="Email" value={app.student.email} />
            <InfoRow label="Phone" value={app.student.phone} />
          </View>
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Uploaded Documents</Text>
          <View style={styles.docList}>
            {app.documents.map((d) => (
              <View key={d.id} style={styles.docItem}>
                <View style={styles.docLeft}>
                  <View style={styles.docIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#2196F3"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{d.name}</Text>
                    <Text style={styles.docMeta}>{d.type}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/(dashboard)/reviewer/documents")}
                  style={styles.viewDocBtn}
                >
                  <Text style={styles.viewDocText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Application Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.bodyText}>{app.personalStatement}</Text>
        </View>

        {/* Comments */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <View style={{ gap: 12 }}>
            {app.comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color="#333"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentMeta}>
                    {c.author} • {c.time}
                  </Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
            <View style={styles.commentInputRow}>
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor="#999"
                style={styles.commentInput}
              />
              <TouchableOpacity style={styles.commentSendBtn}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Request Update Button */}
        <View style={styles.card}>
          <TouchableOpacity style={[styles.actionBtn, styles.updateBtn, styles.fullWidthBtn]}>
            <Ionicons name="refresh-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Request Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Footer Actions */}
      <View style={[styles.footer, { paddingBottom: inset.bottom + 8 }]}>
        <View style={styles.footerActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.approveBtn, styles.footerBtn]}>
            <Ionicons name="checkmark-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn, styles.footerBtn]}
            onPress={() => setShowRejectModal(true)}
          >
            <Ionicons name="close-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject Application</Text>
            <Text style={styles.modalSubtitle}>Please provide a reason</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Reason for rejection..."
              placeholderTextColor="#999"
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancel]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalReject]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                <Text style={styles.modalRejectText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function getStatusColor(status: "Pending" | "Approved" | "Rejected") {
  switch (status) {
    case "Approved":
      return "#4CAF50";
    case "Rejected":
      return "#F44336";
    default:
      return "#FF9800";
  }
}

function getStatusBadgeStyle(status: "Pending" | "Approved" | "Rejected") {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#E8F5E9" };
    case "Rejected":
      return { backgroundColor: "#FFEBEE" };
    default:
      return { backgroundColor: "#FFF3E0" };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFF3E0",
  },
  statusBadgeText: { fontSize: 12, fontWeight: "800" },
  content: { padding: 20, gap: 16, paddingBottom: 160 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
    padding: 16,
  },
  infoGrid: { gap: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 13, color: "#666", fontWeight: "600" },
  infoValue: { fontSize: 13, color: "#1a1a1a", fontWeight: "700" },
  docList: { gap: 10 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  docLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  docIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  docName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  docMeta: { fontSize: 12, color: "#666" },
  viewDocBtn: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewDocText: { color: "#2196F3", fontWeight: "800", fontSize: 12 },
  bodyText: { fontSize: 14, color: "#333", lineHeight: 20 },
  commentRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  commentMeta: { fontSize: 12, color: "#666", fontWeight: "700" },
  commentText: { fontSize: 14, color: "#333" },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1a1a1a",
  },
  commentSendBtn: { backgroundColor: "#333", padding: 12, borderRadius: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  approveBtn: { backgroundColor: "#4CAF50" },
  updateBtn: { backgroundColor: "#2196F3" },
  rejectBtn: { backgroundColor: "#F44336" },
  actionText: { color: "#fff", fontWeight: "800" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  footerActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  footerBtn: {
    flex: 1,
    justifyContent: "center",
  },
  fullWidthBtn: {
    width: "100%",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1a1a1a" },
  modalSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    color: "#1a1a1a",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  modalCancel: { backgroundColor: "#f5f5f5" },
  modalReject: { backgroundColor: "#F44336" },
  modalCancelText: { color: "#333", fontWeight: "800" },
  modalRejectText: { color: "#fff", fontWeight: "800" },
});

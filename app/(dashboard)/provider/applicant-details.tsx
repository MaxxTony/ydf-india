import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ReviewerHeader from "../../../components/ReviewerHeader";

export default function ProviderApplicantDetailsScreen() {
  const applicant = {
    id: "app-1",
    name: "Ravi Patel",
    age: 20,
    course: "BSc Computer Science",
    college: "ABC Institute of Technology",
    income: 24000,
    category: "OBC",
    essay:
      "I aspire to build scalable solutions that positively impact education accessibility across rural areas.",
    motivation:
      "This scholarship will reduce financial burden and allow me to focus on research and community projects.",
    progress: 72,
  };

  const [notes, setNotes] = useState("");

  const formattedIncome = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(applicant.income),
    [applicant.income]
  );

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Applicant Details" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={18} color="#333" />
              <Text style={styles.infoText}>{applicant.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color="#333" />
              <Text style={styles.infoText}>{applicant.age} yrs</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="school-outline" size={18} color="#333" />
              <Text style={styles.infoText}>{applicant.course}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={18} color="#333" />
              <Text style={styles.infoText}>{applicant.college}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={18} color="#333" />
              <Text style={styles.infoText}>{formattedIncome} / year</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="pricetags-outline" size={18} color="#333" />
              <Text style={styles.infoText}>Category: {applicant.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.label}>Essay</Text>
          <Text style={styles.paragraph}>{applicant.essay}</Text>
          <Text style={styles.label}>Motivation</Text>
          <Text style={styles.paragraph}>{applicant.motivation}</Text>
          <Text style={styles.label}>Uploaded Documents</Text>
          <View style={styles.docsRow}>
            <DocPill title="ID Proof.pdf" />
            <DocPill title="Income Cert.jpg" />
            <DocPill title="Marksheets.zip" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${applicant.progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{applicant.progress}% reviewed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Internal Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add internal notes/comments..."
            placeholderTextColor="#999"
            multiline
            style={styles.notesInput}
          />
        </View>

        <View style={styles.actionsCard}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: "#4CAF50" }]} activeOpacity={0.85} onPress={() => console.log("Approve", applicant.id)}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: "#F44336" }]} activeOpacity={0.85} onPress={() => console.log("Reject", applicant.id)}>
              <Ionicons name="close-circle-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.secondaryBtn]} activeOpacity={0.85} onPress={() => console.log("Download Documents", applicant.id)}>
              <Ionicons name="download-outline" size={18} color="#333" />
              <Text style={styles.secondaryBtnText}>Download Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn]} activeOpacity={0.85} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#333" />
              <Text style={styles.secondaryBtnText}>Back to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DocPill({ title }: { title: string }) {
  return (
    <View style={styles.docPill}>
      <Ionicons name="document-text-outline" size={14} color="#333" />
      <Text style={styles.docText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", paddingTop: 12 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    padding: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { color: "#333", fontWeight: "600" },
  label: { marginTop: 6, marginBottom: 4, color: "#666", fontWeight: "700", fontSize: 12 },
  paragraph: { color: "#333", lineHeight: 20 },
  docsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 6 },
  docPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#f5f5f5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  docText: { color: "#333", fontSize: 12, fontWeight: "600" },
  progressBar: { width: "100%", height: 10, borderRadius: 6, backgroundColor: "rgba(51,51,51,0.08)", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#4CAF50" },
  progressLabel: { marginTop: 8, fontSize: 12, color: "#333", fontWeight: "600" },
  notesInput: { minHeight: 90, borderWidth: 1, borderColor: "rgba(51,51,51,0.12)", borderRadius: 12, padding: 12, color: "#333", backgroundColor: "#fff", textAlignVertical: "top" },
  actionsCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "rgba(51,51,51,0.1)", padding: 16, gap: 10, shadowColor: "#333", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  actionsRow: { flexDirection: "row", gap: 10, justifyContent: "space-between" },
  primaryBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
  secondaryBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: "#f5f5f5" },
  secondaryBtnText: { color: "#333", fontWeight: "800" },
});



import { ReviewerHeader } from "@/components";
import { router } from "expo-router";
import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProviderHelpSupportScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "How to create a scholarship?", a: "Go to Scholarships > Add Scholarship and fill the form." },
    { q: "How to verify KYC?", a: "Open KYC screen, fill details, attach documents and submit." },
  ];

  const toggle = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Help & Support" />
      <View style={styles.content}>
        <Text style={styles.title}>FAQ</Text>
        <View style={styles.card}>
          {faqs.map((f, idx) => (
            <View key={f.q}>
              <TouchableOpacity style={styles.faqRow} onPress={() => toggle(idx)} activeOpacity={0.75}>
                <Text style={styles.faqQ}>{f.q}</Text>
              </TouchableOpacity>
              {openIndex === idx && <Text style={styles.faqA}>{f.a}</Text>}
              {idx < faqs.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={styles.title}>Documentation</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.75}>
            <Text style={styles.link}>Provider Onboarding Guide</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/(dashboard)/provider/contact-support")} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 12 },
  content: { padding: 20 },
  title: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51,51,51,0.15)",
    padding: 12,
    marginBottom: 16,
  },
  faqRow: { paddingVertical: 10 },
  faqQ: { fontWeight: "700", color: "#333" },
  faqA: { marginTop: 6, color: "#555", fontWeight: "600", lineHeight: 20 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 8 },
  linkRow: { paddingVertical: 10 },
  link: { color: "#2563EB", fontWeight: "700" },
  primaryBtn: {
    backgroundColor: "#333",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});



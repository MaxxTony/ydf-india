import { ReviewerHeader } from "@/components";
import { router } from "expo-router";
import React, { useState } from "react";
import { LayoutAnimation, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProviderHelpSupportScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    { 
      q: "How to create a scholarship?", 
      a: "Navigate to the Scholarships section from your dashboard, tap 'Add Scholarship', and complete the form with scholarship details including eligibility criteria, award amount, and application deadlines.",
      icon: "🎓"
    },
    { 
      q: "How to verify KYC?", 
      a: "Access the KYC verification screen, provide your business details, upload required documents (ID proof, business license), and submit for review. Verification typically takes 24-48 hours.",
      icon: "✅"
    },
    { 
      q: "How to manage applications?", 
      a: "View all scholarship applications in the Applications tab. You can filter by status, review applicant profiles, and approve or reject applications with feedback.",
      icon: "📋"
    },
    { 
      q: "What payment methods are supported?", 
      a: "We support bank transfers, UPI, credit/debit cards, and digital wallets for disbursing scholarship funds directly to recipients.",
      icon: "💳"
    },
  ];



  const toggle = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Help & Support" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <Text style={styles.heroSubtitle}>Find answers, documentation, or reach out to our team</Text>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{faqs.length}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              {faqs.map((f, idx) => (
                <View key={f.q}>
                  <TouchableOpacity 
                    style={[styles.faqRow, openIndex === idx && styles.faqRowActive]} 
                    onPress={() => toggle(idx)} 
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqLeft}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.icon}>{f.icon}</Text>
                      </View>
                      <Text style={styles.faqQ}>{f.q}</Text>
                    </View>
                    <View style={[styles.chevron, openIndex === idx && styles.chevronOpen]}>
                      <Text style={styles.chevronText}>›</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {openIndex === idx && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqA}>{f.a}</Text>
                    </View>
                  )}
                  
                  {idx < faqs.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

       
          {/* Contact Support CTA */}
          <View style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Still need help?</Text>
              <Text style={styles.ctaSubtitle}>Our support team is available 24/7</Text>
            </View>
            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={() => router.push("/(dashboard)/provider/contact-support")} 
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Contact Support</Text>
            
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Average response time: ~2 hours</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  content: { 
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 32,
    paddingTop: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  faqRow: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  faqRowActive: {
    backgroundColor: "#F8FAFC",
  },
  faqLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  faqQ: { 
    fontWeight: "600", 
    color: "#1E293B",
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
  chevronOpen: {
    backgroundColor: "#E0E7FF",
    transform: [{ rotate: "270deg" }],
  },
  chevronText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#475569",
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 68,
  },
  faqA: { 
    color: "#475569",
    fontWeight: "500",
    lineHeight: 22,
    fontSize: 14,
  },
  divider: { 
    height: 1, 
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  docsGrid: {
    gap: 12,
  },
  docCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  docIconText: {
    fontSize: 22,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    marginBottom: 2,
  },
  docSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    position: "absolute",
    left: 80,
    bottom: 18,
  },
  docArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  docArrowText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748B",
  },
  ctaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  ctaContent: {
    gap: 4,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
    fontSize: 16,
    letterSpacing: -0.2,
  },
  btnArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
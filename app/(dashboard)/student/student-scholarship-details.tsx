import { AppHeader, Button } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const scholarship = {
  id: 1,
  title: "Merit Scholarship 2024",
  description: "For students with outstanding academic performance and leadership qualities",
  amount: "$5,000",
  deadline: "March 15, 2024",
  category: "Academic",
  status: "Available",
  type: "Merit-based",
  funding: "Donor Funded",
  duration: "1 Academic Year",
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
  benefits: [
    "Tuition fee coverage up to $5,000",
    "Mentorship program access",
    "Networking opportunities with donors and alumni",
  ],
  faqs: [
    { q: "Who can apply?", a: "Undergraduate students with a minimum GPA of 3.5." },
    { q: "Can international students apply?", a: "Yes, if enrolled in an accredited institution." },
    { q: "How will I be notified?", a: "Via email within 4-6 weeks after the deadline." },
  ],
  color: "#4CAF50"
};

export default function ScholarshipDetailsScreen() {
  const [saved, setSaved] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [eligibilityChecks, setEligibilityChecks] = useState<Record<number, boolean>>({});

  const isEligible = useMemo(() => {
    const total = scholarship.eligibility.length;
    const checked = Object.values(eligibilityChecks).filter(Boolean).length;
    return { checked, total, pass: checked === total && total > 0 };
  }, [eligibilityChecks]);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFaqOpenIndex((prev) => (prev === index ? null : index));
  };

  const toggleEligibility = (index: number) => {
    setEligibilityChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: "Expired", color: "#F44336" };
    if (diffDays === 0) return { text: "Today", color: "#FF9800" };
    if (diffDays === 1) return { text: "1 day left", color: "#FF9800" };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: "#FF9800" };
    return { text: `${diffDays} days left`, color: "#666" };
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />
 {/* App Header Replacement */}
        <AppHeader title="Scholarship Details" onBack={() => router.back()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       

        {/* Banner / Logo */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerRow}>
            <Image source={require("@/assets/images/icon.png")} style={styles.bannerLogo} />
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>{scholarship.title}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: `${scholarship.color}15` }]}>
                  <Ionicons name="ribbon-outline" size={14} color={scholarship.color} />
                  <Text style={[styles.badgeText, { color: scholarship.color }]}>{scholarship.type}</Text>
                </View>
                <View style={styles.dot} />
                <Text style={styles.bannerMeta}>{scholarship.funding}</Text>
                <View style={styles.dot} />
                <Text style={styles.bannerMeta}>{scholarship.duration}</Text>
              </View>
            </View>
          </View>
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
              <TouchableOpacity key={index} onPress={() => toggleEligibility(index)} style={styles.criteriaItem} activeOpacity={0.8}>
                <Ionicons
                  name={eligibilityChecks[index] ? "checkbox" : "square-outline"}
                  size={18}
                  color={eligibilityChecks[index] ? "#4CAF50" : "#999"}
                />
                <Text style={styles.criteriaText}>{criteria}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.eligibilityFooter}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(isEligible.checked / Math.max(1, isEligible.total)) * 100}%`, backgroundColor: isEligible.pass ? "#4CAF50" : "#FF9800" }]} />
              </View>
              <Text style={[styles.eligibilityText, { color: isEligible.pass ? "#4CAF50" : "#FF9800" }]}>
                {isEligible.checked}/{isEligible.total} met {isEligible.pass ? "• Eligible" : "• Keep checking"}
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits / Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.documentsCard}>
            {scholarship.benefits.map((benefit, index) => (
              <View key={index} style={styles.documentItem}>
                <Ionicons name="gift-outline" size={16} color="#4CAF50" />
                <Text style={styles.documentText}>{benefit}</Text>
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

        {/* Application Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Process</Text>
          <View style={styles.processCard}>
            {[
              "Review eligibility and prepare documents",
              "Fill out the application form",
              "Upload required documents",
              "Submit before the deadline",
              "Track application status",
            ].map((step, idx) => (
              <View key={idx} style={styles.processItem}>
                <View style={[styles.processIndex, { backgroundColor: `${scholarship.color}15` }]}>
                  <Text style={[styles.processIndexText, { color: scholarship.color }]}>{idx + 1}</Text>
                </View>
                <Text style={styles.processText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          <View style={styles.faqCard}>
            {scholarship.faqs.map((item, index) => {
              const open = faqOpenIndex === index;
              return (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity onPress={() => toggleFaq(index)} style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.q}</Text>
                    <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color="#333" />
                  </TouchableOpacity>
                  {open && (
                    <Text style={styles.faqAnswer}>{item.a}</Text>
                  )}
                </View>
              );
            })}
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

        {/* Actions */}
        <View style={styles.applyContainer}>
          <View style={styles.actionsRow}>
            <Button
              title={saved ? "Saved" : "Save for Later"}
              onPress={() => setSaved(true)}
              variant="secondary"
              style={[styles.actionBtn, ...(saved ? [{ borderColor: "#4CAF50" }] : [])]}
              textStyle={saved ? { color: "#4CAF50" } : undefined}
            />
            <Button
              title="Apply Now"
              onPress={() => router.push("/(dashboard)/student/student-apply-form")}
              variant="primary"
              style={[styles.actionBtn, { backgroundColor: scholarship.color }]}
              textStyle={{ color: "#fff" }}
            />
          </View>
        </View>

        {/* Related Scholarships */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Scholarships</Text>
          <View style={styles.relatedList}>
            {[
              { id: 2, title: "Need-Based Grant", description: "Financial assistance for students in need", amount: "$3,000", deadline: "2024-03-20", category: "Financial Need", eligibility: "Income < $50k", color: "#2196F3" },
              { id: 3, title: "STEM Excellence Award", description: "For students pursuing STEM fields", amount: "$7,500", deadline: "2024-03-10", category: "STEM", eligibility: "STEM Major", color: "#FF9800" },
              { id: 4, title: "Community Service Scholarship", description: "For students with significant community involvement", amount: "$2,500", deadline: "2024-03-25", category: "Community Service", eligibility: "100+ volunteer hours", color: "#9C27B0" },
            ].map((item) => {
              const daysInfo = getDaysRemaining(item.deadline);
              return (
                <View key={item.id} style={[styles.relatedCardFull, { borderLeftColor: item.color }]}>
                  <View style={styles.relatedHeaderRow}>
                    <Text style={styles.relatedTitle}>{item.title}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: `${item.color}15` }]}>
                      <Text style={[styles.categoryBadgeText, { color: item.color }]}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.relatedDescription}>{item.description}</Text>

                  <View style={styles.amountRow}>
                    <View style={styles.amountContainer}>
                      <Text style={styles.amountLabel}>Award Amount</Text>
                      <Text style={[styles.amountText, { color: item.color }]}>{item.amount}</Text>
                    </View>
                  </View>

                  <View style={styles.relatedDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}> 
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Deadline</Text>
                        <View style={styles.deadlineRow}>
                          <Text style={styles.detailText}>{new Date(item.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Text>
                          <Text style={[styles.daysRemaining, { color: daysInfo.color }]}>• {daysInfo.text}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Eligibility</Text>
                        <Text style={styles.detailText}>{item.eligibility}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      onPress={() => router.push("/(dashboard)/student/student-scholarship-details")}
                      style={styles.viewBtn}
                    >
                      <Ionicons name="eye-outline" size={18} color="#333" />
                      <Text style={styles.viewBtnText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push("/(dashboard)/student/student-apply-form")}
                      style={[styles.applyBtn, { backgroundColor: item.color }]}
                    >
                      <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                      <Text style={styles.applyBtnText}>Apply Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
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
  bannerCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
  },
  bannerMeta: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
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
  // INSERT: listing-like amount row styles for related cards
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    marginBottom: 16,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scholarshipDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  // INSERT: icon container for detail rows
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  // INSERT: listing-like text + deadline styles
  detailText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  daysRemaining: {
    fontSize: 13,
    fontWeight: "600",
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
  eligibilityFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 6,
  },
  eligibilityText: {
    fontSize: 12,
    fontWeight: "700",
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
  processCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  processItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  processIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  processIndexText: {
    fontSize: 13,
    fontWeight: "800",
  },
  processText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
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
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  // INSERT: actions row styles matching listing for related cards
  cardActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  viewBtnText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  faqItem: {
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  relatedList: {
    gap: 16,
  },
  relatedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "#eee",
    width: "48%",
  },
  relatedCardFull: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  relatedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  relatedDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  relatedAmount: {
    fontSize: 13,
    fontWeight: "800",
  },
  relatedDetails: {
    gap: 12,
    marginBottom: 16,
  },
  // INSERT: category badge used in related header
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});


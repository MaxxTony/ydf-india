import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewerHeader } from "../../../components";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function HelpSupportScreen() {
  const inset = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "How to verify a document?",
      answer: "To verify a document, open the application details, review the uploaded documents, check for authenticity, completeness, and accuracy. Use the verification tools to mark documents as verified or request additional information if needed.",
    },
    {
      id: "2",
      question: "What happens after approval?",
      answer: "After approving an application, the student will be notified automatically. The application status will be updated in the system, and the scholarship provider will be informed. The student can then proceed with the next steps in the scholarship process.",
    },
    {
      id: "3",
      question: "How to reject an application?",
      answer: "To reject an application, provide a clear reason for rejection in the comments section. The student will receive feedback about why their application was rejected and what they can improve for future applications.",
    },
    {
      id: "4",
      question: "Can I change my review decision?",
      answer: "Yes, you can change your review decision before the final submission. Once submitted, you may need to contact the administrator to make changes depending on the application status.",
    },
    {
      id: "5",
      question: "How to report technical issues?",
      answer: "If you encounter technical issues, use the 'Contact Support' feature to raise a ticket. Include screenshots and detailed description of the problem for faster resolution.",
    },
    {
      id: "6",
      question: "What are the review criteria?",
      answer: "Review criteria include academic performance, financial need, extracurricular activities, essay quality, and document authenticity. Each scholarship may have specific criteria outlined in the application guidelines.",
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    router.push("/(dashboard)/reviewer/contact-support");
  };

  const handleViewGuide = () => {
    // This would typically open a PDF or web view
    // For now, we'll show an alert
    alert("Documentation guide will open in a new window");
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title="Help & Support"
        subtitle="Get help and find answers"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: inset.bottom + 20 }}> 
        {/* Quick Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          
          <View style={styles.quickHelpCard}>
            <View style={styles.quickHelpItem}>
              <View style={styles.quickHelpIcon}>
                <Ionicons name="document-text-outline" size={24} color="#2196F3" />
              </View>
              <View style={styles.quickHelpContent}>
                <Text style={styles.quickHelpTitle}>Documentation</Text>
                <Text style={styles.quickHelpSubtitle}>Complete user guide and tutorials</Text>
              </View>
              <TouchableOpacity
                style={styles.quickHelpButton}
                onPress={handleViewGuide}
                activeOpacity={0.8}
              >
                <Text style={styles.quickHelpButtonText}>View Guide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqCard}>
            {faqItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqQuestion}>
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                    <Ionicons
                      name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedFAQ === item.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
                
                {index < faqItems.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need More Help?</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail-outline" size={32} color="#FF9800" />
            </View>
            <Text style={styles.contactTitle}>Contact Support</Text>
            <Text style={styles.contactSubtitle}>
              Can't find what you're looking for? Our support team is here to help you with any questions or issues.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>Raise a Support Ticket</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <View style={styles.resourcesCard}>
            <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
              <View style={styles.resourceIcon}>
                <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Video Tutorials</Text>
                <Text style={styles.resourceSubtitle}>Step-by-step video guides</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
              <View style={styles.resourceIcon}>
                <Ionicons name="people-outline" size={20} color="#9C27B0" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Community Forum</Text>
                <Text style={styles.resourceSubtitle}>Connect with other reviewers</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
              <View style={styles.resourceIcon}>
                <Ionicons name="calendar-outline" size={20} color="#F44336" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Training Sessions</Text>
                <Text style={styles.resourceSubtitle}>Join live training workshops</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  quickHelpCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickHelpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  quickHelpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  quickHelpContent: {
    flex: 1,
  },
  quickHelpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  quickHelpSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  quickHelpButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickHelpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  faqItem: {
    padding: 20,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 12,
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  faqDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resourcesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 76,
  },
});

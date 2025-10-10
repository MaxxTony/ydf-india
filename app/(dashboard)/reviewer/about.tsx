import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewerHeader } from "../../../components";

export default function AboutScreen() {
  const inset = useSafeAreaInsets();

  const handlePrivacyPolicy = () => {
    // Navigate to privacy policy
    alert("Privacy Policy will open in a new window");
  };

  const handleTermsConditions = () => {
    router.push("/(dashboard)/reviewer/terms-conditions");
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title="About"
        subtitle="App information and team"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: inset.bottom + 20 }}>
        {/* App Logo and Info */}
        <View style={styles.appInfoCard}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="school-outline" size={48} color="#2196F3" />
            </View>
          </View>
          
          <Text style={styles.appName}>Scholarship Review App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A comprehensive platform for reviewing and managing scholarship applications with advanced document verification and decision management tools.
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This App</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              The Scholarship Review App is designed to streamline the scholarship application review process. Our platform provides reviewers with powerful tools to efficiently evaluate applications, verify documents, and make informed decisions.
            </Text>
            
            <Text style={styles.aboutText}>
              Built with modern technology and user experience in mind, this app ensures secure, fair, and transparent scholarship review processes while maintaining the highest standards of data protection and privacy.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featuresCard}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="document-text-outline" size={20} color="#2196F3" />
              </View>
              <Text style={styles.featureText}>Document Verification</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.featureText}>Application Review Tools</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="notifications-outline" size={20} color="#FF9800" />
              </View>
              <Text style={styles.featureText}>Real-time Notifications</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="stats-chart-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.featureText}>Analytics & Reports</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#F44336" />
              </View>
              <Text style={styles.featureText}>Secure Data Handling</Text>
            </View>
          </View>
        </View>

        {/* Development Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Team</Text>
          
          <View style={styles.teamCard}>
            <View style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <Ionicons name="person" size={24} color="#666" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>Tech Solutions Inc.</Text>
                <Text style={styles.memberRole}>Development Team</Text>
              </View>
            </View>
            
            <View style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <Ionicons name="people" size={24} color="#666" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>Design Studio</Text>
                <Text style={styles.memberRole}>UI/UX Design</Text>
              </View>
            </View>
            
            <View style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <Ionicons name="shield-checkmark" size={24} color="#666" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>Security Team</Text>
                <Text style={styles.memberRole}>Data Protection</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="mail-outline" size={20} color="#2196F3" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@scholarshipapp.com</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={20} color="#4CAF50" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="globe-outline" size={20} color="#FF9800" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.scholarshipapp.com</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <View style={styles.legalCard}>
            <TouchableOpacity style={styles.legalItem} onPress={handlePrivacyPolicy} activeOpacity={0.7}>
              <View style={styles.legalIcon}>
                <Ionicons name="shield-outline" size={20} color="#9C27B0" />
              </View>
              <View style={styles.legalContent}>
                <Text style={styles.legalTitle}>Privacy Policy</Text>
                <Text style={styles.legalSubtitle}>How we protect your data</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.legalItem} onPress={handleTermsConditions} activeOpacity={0.7}>
              <View style={styles.legalIcon}>
                <Ionicons name="document-text-outline" size={20} color="#F44336" />
              </View>
              <View style={styles.legalContent}>
                <Text style={styles.legalTitle}>Terms & Conditions</Text>
                <Text style={styles.legalSubtitle}>Terms of service and usage</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightCard}>
          <Text style={styles.copyrightText}>
            © 2024 Scholarship Review App. All rights reserved.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Built with ❤️ for education
          </Text>
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
  appInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
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
  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  teamMember: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  legalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  legalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  legalContent: {
    flex: 1,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  legalSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 76,
  },
  copyrightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  copyrightText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

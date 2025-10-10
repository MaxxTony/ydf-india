import { ReviewerHeader } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProviderAboutScreen() {
  const handleLinkPress = async (url: string, title: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${title}`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open ${title}`);
      console.error("Link error:", error);
    }
  };

  const handleEmailPress = () => {
    handleLinkPress("mailto:support@ydf.org", "Email");
  };

  const handleWebsitePress = () => {
    handleLinkPress("https://ydf.org", "Website");
  };

  const handleTermsPress = () => {
    handleLinkPress("https://ydf.org/terms", "Terms of Service");
  };

  const handlePrivacyPress = () => {
    handleLinkPress("https://ydf.org/privacy", "Privacy Policy");
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader 
        title="About" 
        subtitle="Learn more about YDF Provider Portal"
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Card */}
        <View style={styles.card}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>YDF Provider Portal</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Simplifying scholarship management for providers and students with an intuitive, 
            powerful workflow. Empowering education through seamless connection.
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Scholarships</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Providers</Text>
            </View>
          </View>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          <View style={styles.featuresList}>
            <FeatureItem 
              icon="create-outline" 
              text="Easy scholarship creation & management"
            />
            <FeatureItem 
              icon="people-outline" 
              text="Student application tracking"
            />
            <FeatureItem 
              icon="analytics-outline" 
              text="Real-time analytics & insights"
            />
            <FeatureItem 
              icon="notifications-outline" 
              text="Automated notifications"
            />
          </View>
        </View>

        {/* Team & Credits Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👥 Team & Credits</Text>
          <View style={styles.creditItem}>
            <Ionicons name="code-slash-outline" size={20} color="#666" />
            <View style={styles.creditText}>
              <Text style={styles.creditLabel}>Development</Text>
              <Text style={styles.creditValue}>YDF Engineering Team</Text>
            </View>
          </View>
          
          <View style={styles.creditItem}>
            <Ionicons name="color-palette-outline" size={20} color="#666" />
            <View style={styles.creditText}>
              <Text style={styles.creditLabel}>Design & Product</Text>
              <Text style={styles.creditValue}>YDF Design Studio</Text>
            </View>
          </View>
          
          <View style={styles.creditItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
            <View style={styles.creditText}>
              <Text style={styles.creditLabel}>Quality Assurance</Text>
              <Text style={styles.creditValue}>YDF QA Team</Text>
            </View>
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📞 Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="mail-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@ydf.org</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleWebsitePress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="globe-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>www.ydf.org</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Legal Links Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 Legal & Policies</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={handleTermsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="open-outline" size={16} color="#2563EB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={handlePrivacyPress}
            activeOpacity={0.7}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#2563EB" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="open-outline" size={16} color="#2563EB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleLinkPress("https://ydf.org/licenses", "Licenses")}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.linkText}>Open Source Licenses</Text>
            <Ionicons name="open-outline" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by YDF Team
          </Text>
          <Text style={styles.copyright}>
            © 2025 Youth Development Foundation. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Feature Item Component
const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={18} color="#2563EB" />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  
  // Logo Section
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  appInfo: {
    marginLeft: 16,
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  versionBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  versionText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 12,
  },
  
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
  },
  
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
    fontWeight: "400",
    marginBottom: 20,
  },
  
  // Stats Section
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5e5",
  },
  
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  
  // Features
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#444",
    fontWeight: "500",
    flex: 1,
  },
  
  // Credits
  creditItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  creditText: {
    marginLeft: 12,
    flex: 1,
  },
  creditLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  creditValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  
  // Contact Buttons
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  
  // Link Buttons
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
  },
  
  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  copyright: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
});
import { ReviewerHeader } from "@/components";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleProp, StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export default function ProviderSettingsScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("English");
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);

  const openLinkOrSoon = async (url?: string) => {
    try {
      if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return;
        }
      }
    } catch {}
    Alert.alert("Coming soon", "This will be available soon.");
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => {
            router.replace("/(auth)/sign-in");
          },
        },
      ]
    );
  };

  type SettingCardProps = { children: React.ReactNode; style?: StyleProp<ViewStyle> };
  const SettingCard: React.FC<SettingCardProps> = ({ children, style }) => (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );

  type SettingRowProps = {
    icon?: keyof typeof Ionicons.glyphMap | any;
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    subtitle?: string;
  };
  const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, onPress, rightElement, subtitle }) => (
    <TouchableOpacity 
      style={styles.row} 
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={22} color="#6366F1" />
          </View>
        )}
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.value}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && (
          <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Settings" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingCard>
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              subtitle="Toggle dark theme"
              rightElement={
                <Switch 
                  value={isDark} 
                  onValueChange={setIsDark}
                  trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                  thumbColor={isDark ? "#6366F1" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="language-outline"
              label="Language"
              subtitle="Select your preferred language"
              value={language}
              onPress={() => setLanguage(language === "English" ? "Hindi" : "English")}
            />
          </SettingCard>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingCard>
            <SettingRow
              icon="notifications-outline"
              label="Push Notifications"
              subtitle="Receive alerts and updates"
              rightElement={
                <Switch 
                  value={notifyPush} 
                  onValueChange={setNotifyPush}
                  trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                  thumbColor={notifyPush ? "#6366F1" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="mail-outline"
              label="Email Notifications"
              subtitle="Get updates via email"
              rightElement={
                <Switch 
                  value={notifyEmail} 
                  onValueChange={setNotifyEmail}
                  trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                  thumbColor={notifyEmail ? "#6366F1" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="chatbox-outline"
              label="In-App Notifications"
              subtitle="Show notifications within app"
              rightElement={
                <Switch 
                  value={notifyInApp} 
                  onValueChange={setNotifyInApp}
                  trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                  thumbColor={notifyInApp ? "#6366F1" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                />
              }
            />
          </SettingCard>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingCard>
            <SettingRow
              icon="person-outline"
              label="Profile Settings"
              onPress={() => router.push("/(dashboard)/provider/profile")}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Privacy & Security"
              onPress={() => Alert.alert("Coming soon", "This will be available soon.")}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="key-outline"
              label="Change Password"
              onPress={() => router.push("/(auth)/reset")}
            />
          </SettingCard>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingCard>
            <SettingRow
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => openLinkOrSoon()}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="information-circle-outline"
              label="About"
              onPress={() => router.push("/(dashboard)/provider/about")}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="document-text-outline"
              label="Terms & Conditions"
              onPress={() => router.push("/(dashboard)/provider/terms-conditions")}
            />
          </SettingCard>
        </View>

       
        <Text style={styles.version}>App Version 1.0.0</Text>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 64,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  value: {
    fontSize: 15,
    color: "#6366F1",
    fontWeight: "600",
  },
  chevron: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 70,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "500",
    fontSize: 13,
    marginTop: 24,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 20,
  },
});
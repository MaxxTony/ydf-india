import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewerHeader } from "../../../components";

export default function ReviewerSettingsScreen() {
  const inset = useSafeAreaInsets();

  // Settings state
  const [settings, setSettings] = useState({
    theme: "light", // "light" | "dark"
    language: "english", // "english" | "hindi"
    notifications: true,
    autoSync: false,
  });

  const handleThemeToggle = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    setSettings(prev => ({ ...prev, theme: newTheme }));
    Alert.alert("Theme Changed", `Switched to ${newTheme} theme`);
  };

  const handleLanguageChange = () => {
    const newLanguage = settings.language === "english" ? "hindi" : "english";
    setSettings(prev => ({ ...prev, language: newLanguage }));
    Alert.alert("Language Changed", `Switched to ${newLanguage}`);
  };

  const handleNotificationToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, notifications: value }));
  };

  const handleAutoSyncToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, autoSync: value }));
  };

  const handleHelpSupport = () => {
    router.push("/(dashboard)/reviewer/help-support");
  };

  const handleContactSupport = () => {
    router.push("/(dashboard)/reviewer/contact-support");
  };

  const handleTermsConditions = () => {
    router.push("/(dashboard)/reviewer/terms-conditions");
  };

  const handleAbout = () => {
    router.push("/(dashboard)/reviewer/about");
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title="Settings"
        subtitle="App preferences and preferences"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: inset.bottom + 20 }}>
        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingsCard}>
            {/* Theme Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="moon-outline" size={20} color="#9C27B0" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingSubtitle}>
                    {settings.theme === "light" ? "Light Mode" : "Dark Mode"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.themeToggle}
                onPress={handleThemeToggle}
                activeOpacity={0.8}
              >
                <View style={[styles.themeToggleBg, settings.theme === "dark" && styles.themeToggleBgActive]}>
                  <View style={[styles.themeToggleThumb, settings.theme === "dark" && styles.themeToggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Language Selection */}
            <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="language-outline" size={20} color="#2196F3" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingSubtitle}>
                    {settings.language === "english" ? "English" : "हिंदी"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications-outline" size={20} color="#FF9800" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Push notifications and alerts</Text>
                </View>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#e0e0e0", true: "#FF9800" }}
                thumbColor={settings.notifications ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.divider} />

            {/* Auto Sync */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="sync-outline" size={20} color="#4CAF50" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Auto Sync</Text>
                  <Text style={styles.settingSubtitle}>Automatically sync data (future)</Text>
                </View>
              </View>
              <Switch
                value={settings.autoSync}
                onValueChange={handleAutoSyncToggle}
                trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
                thumbColor={settings.autoSync ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        {/* Support & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="help-circle-outline" size={20} color="#2196F3" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Help & Support</Text>
                  <Text style={styles.settingSubtitle}>FAQs and documentation</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="mail-outline" size={20} color="#FF9800" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Contact Support</Text>
                  <Text style={styles.settingSubtitle}>Raise a support ticket</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal & About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & About</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleTermsConditions} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="document-text-outline" size={20} color="#666" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Terms & Conditions</Text>
                  <Text style={styles.settingSubtitle}>Read our terms of service</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem} onPress={handleAbout} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="information-circle-outline" size={20} color="#4CAF50" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>About</Text>
                  <Text style={styles.settingSubtitle}>App version and team info</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.section}>
          <View style={styles.versionCard}>
            <Text style={styles.versionText}>App Version</Text>
            <Text style={styles.versionNumber}>1.0.0</Text>
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
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 76,
  },
  themeToggle: {
    padding: 4,
  },
  themeToggleBg: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  themeToggleBgActive: {
    backgroundColor: "#9C27B0",
  },
  themeToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  themeToggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  versionCard: {
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
  versionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
  },
});

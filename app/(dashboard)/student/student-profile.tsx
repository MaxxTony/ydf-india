import { AppHeader, Button, CustomTextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const uploadedDocuments = [
  {
    id: 1,
    name: "Official Transcript",
    type: "PDF",
    size: "2.3 MB",
    uploadDate: "2024-02-15",
    status: "verified"
  },
  {
    id: 2,
    name: "Letter of Recommendation",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-02-16",
    status: "pending"
  },
  {
    id: 3,
    name: "Financial Aid Form",
    type: "PDF",
    size: "1.2 MB",
    uploadDate: "2024-02-18",
    status: "verified"
  },
  {
    id: 4,
    name: "Personal Statement",
    type: "PDF",
    size: "456 KB",
    uploadDate: "2024-02-20",
    status: "verified"
  }
];

export default function StudentProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "personal" | "academic" | "documents" | "settings" | "about"
  >("personal");

  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@university.edu");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("01/15/2000");
  const [address, setAddress] = useState("123 University Ave, City, State 12345");

  const [institution, setInstitution] = useState("University of Technology");
  const [major, setMajor] = useState("Computer Science");
  const [gpa, setGpa] = useState("3.75");
  const [graduation, setGraduation] = useState("May 2024");
  const [year, setYear] = useState("Senior");

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "fr" | "ar">("en");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const profileHeader = useMemo(() => (
    <View style={styles.profileSection}>
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=60" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{fullName}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
        <Text style={styles.profileStudentId}>Student ID: 12345678</Text>
      </View>
    </View>
  ), [fullName, email]);

  const handleSavePersonal = () => {
    // Persist personal info (API integration placeholder)
  };

  const handleSaveAcademic = () => {
    // Persist academic info (API integration placeholder)
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    // Call API to change password (placeholder)
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const TabButton = ({
    label,
    icon,
    tab,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    tab: typeof activeTab;
  }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      activeOpacity={0.9}
    >
      <Ionicons
        name={icon}
        size={18}
        color={activeTab === tab ? "#333" : "#666"}
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <AppHeader title="Profile & Settings" onBack={() => router.back()} />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          <TabButton tab="personal" label="Personal" icon="person-outline" />
          <TabButton tab="academic" label="Academic" icon="school-outline" />
          <TabButton tab="documents" label="Documents" icon="documents-outline" />
          <TabButton tab="settings" label="Settings" icon="settings-outline" />
          <TabButton tab="about" label="About" icon="information-circle-outline" />
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {profileHeader}

        {activeTab === "personal" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.formCard}>
              <CustomTextInput label="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
              <CustomTextInput label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
              <CustomTextInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
              <CustomTextInput label="Date of Birth" value={dob} onChangeText={setDob} style={styles.input} />
              <CustomTextInput label="Address" value={address} onChangeText={setAddress} style={styles.input} />
              <Button title="Save Changes" onPress={handleSavePersonal} variant="primary" style={styles.saveButton} />
            </View>
          </View>
        )}

        {activeTab === "academic" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Details</Text>
            <View style={styles.formCard}>
              <CustomTextInput label="Institution" value={institution} onChangeText={setInstitution} style={styles.input} />
              <CustomTextInput label="Major/Field of Study" value={major} onChangeText={setMajor} style={styles.input} />
              <CustomTextInput label="Current GPA" value={gpa} onChangeText={setGpa} keyboardType="numeric" style={styles.input} />
              <CustomTextInput label="Expected Graduation" value={graduation} onChangeText={setGraduation} style={styles.input} />
              <CustomTextInput label="Academic Year" value={year} onChangeText={setYear} style={styles.input} />
              <Button title="Save Academic" onPress={handleSaveAcademic} variant="primary" style={styles.saveButton} />
            </View>
          </View>
        )}

        {activeTab === "documents" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Uploaded Documents</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="cloud-upload-outline" size={16} color="#4CAF50" />
                <Text style={styles.uploadText}>Upload New</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsCard}>
              {uploadedDocuments.map((doc) => (
                <View key={doc.id} style={styles.documentItem}>
                  <View style={styles.documentInfo}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: doc.status === "verified" ? "#4CAF50" + "20" : "#FF9800" + "20" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: doc.status === "verified" ? "#4CAF50" : "#FF9800" },
                          ]}
                        >
                          {doc.status === "verified" ? "Verified" : "Pending"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.documentDetails}>
                      {doc.type} • {doc.size} • {doc.uploadDate}
                    </Text>
                  </View>
                  <View style={styles.documentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="eye-outline" size={16} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="download-outline" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="trash-outline" size={16} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "settings" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>Receive notifications on your device</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setPushEnabled(!pushEnabled)}
                  style={[styles.toggle, pushEnabled ? styles.toggleActive : styles.toggleInactive]}
                >
                  <View style={[styles.toggleThumb, pushEnabled && { alignSelf: "flex-end" }]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Email Notifications</Text>
                    <Text style={styles.settingDescription}>Receive updates via email</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setEmailEnabled(!emailEnabled)}
                  style={[styles.toggle, emailEnabled ? styles.toggleActive : styles.toggleInactive]}
                >
                  <View style={[styles.toggleThumb, emailEnabled && { alignSelf: "flex-end" }]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="moon-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Dark Mode</Text>
                    <Text style={styles.settingDescription}>Switch to dark theme</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setDarkMode(!darkMode)}
                  style={[styles.toggle, darkMode ? styles.toggleActive : styles.toggleInactive]}
                >
                  <View style={[styles.toggleThumb, darkMode && { alignSelf: "flex-end" }]} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Change Password</Text>
            <View style={styles.formCard}>
              <CustomTextInput label="Current Password" value={oldPassword} onChangeText={setOldPassword} secureTextEntry showPasswordToggle style={styles.input} />
              <CustomTextInput label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry showPasswordToggle style={styles.input} />
              <CustomTextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry showPasswordToggle style={styles.input} />
              <Button title="Update Password" onPress={handleChangePassword} variant="primary" style={styles.saveButton} />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Language Preference</Text>
            <View style={styles.languageRow}>
              {([
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "ar", label: "العربية" },
              ] as { code: "en" | "fr" | "ar"; label: string }[]).map((opt) => (
                <TouchableOpacity
                  key={opt.code}
                  onPress={() => setLanguage(opt.code)}
                  style={[styles.langPill, language === opt.code && styles.langPillActive]}
                >
                  <Text style={[styles.langPillText, language === opt.code && styles.langPillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionContainer}>
              <Button
                title="Logout"
                onPress={() => setShowLogoutModal(true)}
                variant="secondary"
                style={styles.signOutButton}
              />
            </View>
          </View>
        )}

        {activeTab === "about" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About App</Text>
            <View style={styles.formCard}>
              <Text style={{ color: "#555", lineHeight: 22 }}>
                Our mission is to empower students by connecting them with donors and
                opportunities. We strive to make education accessible and equitable.
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Information</Text>
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="document-text-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Terms of Use</Text>
                    <Text style={styles.settingDescription}>Read our terms and conditions</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="shield-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                    <Text style={styles.settingDescription}>Learn how we protect your data</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Contact Support</Text>
                    <Text style={styles.settingDescription}>Get help from our team</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Ionicons name="log-out-outline" size={28} color="#333" />
            </View>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
            <Text style={styles.modalSubtitle}>You can log back in anytime.</Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setShowLogoutModal(false)} variant="secondary" />
              <Button title="Logout" onPress={() => { setShowLogoutModal(false); router.push("/(auth)/welcome"); }} variant="primary" />
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  tabsContainer: {
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
    marginRight: 4,
  },
  tabButtonActive: {
    backgroundColor: "#f2c44d",
    borderColor: "rgba(51,51,51,0.2)",
  },
  tabButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#666",
  },
  tabButtonTextActive: {
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  editButton: {
    padding: 8,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  profileStudentId: {
    fontSize: 14,
    color: "#999",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  input: {
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  uploadText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
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
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  documentInfo: {
    flex: 1,
    marginRight: 12,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  documentDetails: {
    fontSize: 12,
    color: "#666",
  },
  documentActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  settingsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleInactive: {
    backgroundColor: "#ddd",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  signOutButton: {
    marginTop: 8,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.2)",
  },
  langPillActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  langPillText: {
    color: "#333",
    fontWeight: "600",
  },
  langPillTextActive: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
});

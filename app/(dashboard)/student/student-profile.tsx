import { Button, CustomTextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@university.edu</Text>
            <Text style={styles.profileStudentId}>Student ID: 12345678</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.formCard}>
            <CustomTextInput
              label="Full Name"
              value="John Doe"
              onChangeText={() => {}}
              style={styles.input}
            />
            <CustomTextInput
              label="Email Address"
              value="john.doe@university.edu"
              onChangeText={() => {}}
              keyboardType="email-address"
              style={styles.input}
            />
            <CustomTextInput
              label="Phone Number"
              value="+1 (555) 123-4567"
              onChangeText={() => {}}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <CustomTextInput
              label="Date of Birth"
              value="01/15/2000"
              onChangeText={() => {}}
              style={styles.input}
            />
            <CustomTextInput
              label="Address"
              value="123 University Ave, City, State 12345"
              onChangeText={() => {}}
              style={styles.input}
            />
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.formCard}>
            <CustomTextInput
              label="Institution"
              value="University of Technology"
              onChangeText={() => {}}
              style={styles.input}
            />
            <CustomTextInput
              label="Major/Field of Study"
              value="Computer Science"
              onChangeText={() => {}}
              style={styles.input}
            />
            <CustomTextInput
              label="Current GPA"
              value="3.75"
              onChangeText={() => {}}
              keyboardType="numeric"
              style={styles.input}
            />
            <CustomTextInput
              label="Expected Graduation"
              value="May 2024"
              onChangeText={() => {}}
              style={styles.input}
            />
            <CustomTextInput
              label="Academic Year"
              value="Senior"
              onChangeText={() => {}}
              style={styles.input}
            />
          </View>
        </View>

        {/* Uploaded Documents */}
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
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: doc.status === 'verified' ? '#4CAF50' + '20' : '#FF9800' + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: doc.status === 'verified' ? '#4CAF50' : '#FF9800' }
                      ]}>
                        {doc.status === 'verified' ? 'Verified' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.documentDetails}>{doc.type} • {doc.size} • {doc.uploadDate}</Text>
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

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your account password</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="finger-print-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>Add extra security to your account</Text>
                </View>
              </View>
              <View style={[styles.toggle, styles.toggleInactive]}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Privacy Settings</Text>
                  <Text style={styles.settingDescription}>Control your data and privacy</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications on your device</Text>
                </View>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive updates via email</Text>
                </View>
              </View>
              <View style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Switch to dark theme</Text>
                </View>
              </View>
              <View style={[styles.toggle, styles.toggleInactive]}>
                <View style={styles.toggleThumb} />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Save Changes"
            onPress={() => {}}
            variant="primary"
            style={styles.saveButton}
          />
          <Button
            title="Sign Out"
            onPress={() => router.push("/(auth)/welcome")}
            variant="secondary"
            style={styles.signOutButton}
          />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
    alignSelf: "flex-end",
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
});

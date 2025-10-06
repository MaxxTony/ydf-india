import { AppHeader, Button, CustomTextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types
interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
}

interface ValidationErrors {
  [key: string]: string;
}

type TabType = "personal" | "academic" | "documents" | "settings" | "about";
type LanguageCode = "en" | "fr" | "ar";

// Mock data with better structure
const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "Official Transcript",
    type: "PDF",
    size: "2.3 MB",
    uploadDate: "2024-02-15",
    status: "verified",
  },
  {
    id: 2,
    name: "Letter of Recommendation",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-02-16",
    status: "pending",
  },
  {
    id: 3,
    name: "Financial Aid Form",
    type: "PDF",
    size: "1.2 MB",
    uploadDate: "2024-02-18",
    status: "verified",
  },
  {
    id: 4,
    name: "Personal Statement",
    type: "PDF",
    size: "456 KB",
    uploadDate: "2024-02-20",
    status: "verified",
  },
];

export default function StudentProfileScreen() {
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "John Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    dob: "01/15/2000",
    address: "123 University Ave, City, State 12345",
  });

  // Academic Information State
  const [academicInfo, setAcademicInfo] = useState({
    institution: "University of Technology",
    major: "Computer Science",
    gpa: "3.75",
    graduation: "May 2024",
    year: "Senior",
  });

  // Settings State
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    darkMode: false,
    language: "en" as LanguageCode,
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Documents State
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);

  // UI State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Animation
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  // Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateGPA = (gpa: string): boolean => {
    const gpaNum = parseFloat(gpa);
    return !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4.0;
  };

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  // Personal Info Handlers
  const handlePersonalInfoChange = useCallback(
    (field: keyof typeof personalInfo, value: string) => {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);

      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const validatePersonalInfo = (): boolean => {
    const errors: ValidationErrors = {};

    if (!personalInfo.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (personalInfo.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!validateEmail(personalInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!validatePhone(personalInfo.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!personalInfo.address.trim()) {
      errors.address = "Address is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonal = async () => {
    if (!validatePersonalInfo()) {
      Alert.alert("Validation Error", "Please fix the errors before saving");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      Alert.alert("Success", "Personal information updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update personal information");
    } finally {
      setIsSaving(false);
    }
  };

  // Academic Info Handlers
  const handleAcademicInfoChange = useCallback(
    (field: keyof typeof academicInfo, value: string) => {
      setAcademicInfo((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);

      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const validateAcademicInfo = (): boolean => {
    const errors: ValidationErrors = {};

    if (!academicInfo.institution.trim()) {
      errors.institution = "Institution name is required";
    }

    if (!academicInfo.major.trim()) {
      errors.major = "Major/Field of study is required";
    }

    if (!validateGPA(academicInfo.gpa)) {
      errors.gpa = "GPA must be between 0.0 and 4.0";
    }

    if (!academicInfo.year.trim()) {
      errors.year = "Academic year is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAcademic = async () => {
    if (!validateAcademicInfo()) {
      Alert.alert("Validation Error", "Please fix the errors before saving");
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      Alert.alert("Success", "Academic information updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update academic information");
    } finally {
      setIsSaving(false);
    }
  };

  // Password Change Handler
  const handleChangePassword = async () => {
    const errors: ValidationErrors = {};

    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }

    if (!validatePassword(passwordData.newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Alert.alert("Validation Error", Object.values(errors)[0]);
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors({});
      Alert.alert("Success", "Password changed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  // Document Handlers
  const handleUploadDocument = () => {
    Alert.alert("Upload Document", "Select document source", [
      { text: "Camera", onPress: () => console.log("Camera selected") },
      { text: "Gallery", onPress: () => console.log("Gallery selected") },
      { text: "Files", onPress: () => console.log("Files selected") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleViewDocument = (docId: number) => {
    console.log("View document:", docId);
    Alert.alert("View Document", "Opening document viewer...");
  };

  const handleDownloadDocument = (docId: number) => {
    console.log("Download document:", docId);
    Alert.alert("Download", "Document download started...");
  };

  const handleDeleteDocument = (docId: number) => {
    setSelectedDocument(docId);
    setShowDeleteModal(true);
  };

  const confirmDeleteDocument = () => {
    if (selectedDocument) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDocument));
      setShowDeleteModal(false);
      setSelectedDocument(null);
      Alert.alert("Success", "Document deleted successfully");
    }
  };

  // Settings Handlers
  const toggleSetting = useCallback((key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLanguageChange = useCallback((lang: LanguageCode) => {
    setSettings((prev) => ({ ...prev, language: lang }));
    Alert.alert(
      "Language Changed",
      `Language set to ${
        lang === "en" ? "English" : lang === "fr" ? "Français" : "العربية"
      }`
    );
  }, []);

  // Logout Handler
  const handleLogout = () => {
    setShowLogoutModal(false);
    // Clear any stored data
    setTimeout(() => {
      router.push("/(auth)/welcome");
    }, 100);
  };

  // Tab Change Handler
  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (hasUnsavedChanges) {
        Alert.alert(
          "Unsaved Changes",
          "You have unsaved changes. Do you want to discard them?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => {
                setHasUnsavedChanges(false);
                setActiveTab(tab);
                setValidationErrors({});
              },
            },
          ]
        );
      } else {
        setActiveTab(tab);
        setValidationErrors({});
      }
    },
    [hasUnsavedChanges]
  );

  // Profile Header Component
  const profileHeader = useMemo(
    () => (
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=60",
              }}
              style={styles.profileImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)"]}
              style={styles.imageOverlay}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{personalInfo.fullName}</Text>
          <Text style={styles.profileEmail}>{personalInfo.email}</Text>
          <View style={styles.studentIdBadge}>
            <Ionicons name="card-outline" size={14} color="#666" />
            <Text style={styles.profileStudentId}>ID: 12345678</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{academicInfo.gpa}</Text>
              <Text style={styles.statLabel}>GPA</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {documents.filter((d) => d.status === "verified").length}
              </Text>
              <Text style={styles.statLabel}>Verified Docs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{academicInfo.year}</Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [
      personalInfo.fullName,
      personalInfo.email,
      academicInfo.gpa,
      academicInfo.year,
      documents,
    ]
  );

  // Tab Button Component
  const TabButton = ({
    label,
    icon,
    tab,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    tab: TabType;
  }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={() => handleTabChange(tab)}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={18} color={isActive ? "#fff" : "#666"} />
        <Text
          style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}
        >
          {label}
        </Text>
        {hasUnsavedChanges && isActive && (
          <View style={styles.unsavedIndicator} />
        )}
      </TouchableOpacity>
    );
  };

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
          <TabButton
            tab="documents"
            label="Documents"
            icon="documents-outline"
          />
          <TabButton tab="settings" label="Settings" icon="settings-outline" />
          <TabButton
            tab="about"
            label="About"
            icon="information-circle-outline"
          />
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {profileHeader}

        <Animated.View style={{ opacity: fadeAnim }}>
          {activeTab === "personal" && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {hasUnsavedChanges && (
                  <View style={styles.unsavedBadge}>
                    <Text style={styles.unsavedText}>Unsaved</Text>
                  </View>
                )}
              </View>
              <View style={styles.formCard}>
                <CustomTextInput
                  label="Full Name"
                  value={personalInfo.fullName}
                  onChangeText={(val) =>
                    handlePersonalInfoChange("fullName", val)
                  }
                  style={styles.input}
                  error={validationErrors.newPassword}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
                <CustomTextInput
                  label="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChangeText={(val) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: val,
                    }))
                  }
                  secureTextEntry
                  showPasswordToggle
                  style={styles.input}
                  error={validationErrors.confirmPassword}
                />
                <Button
                  title={isSaving ? "Updating..." : "Update Password"}
                  onPress={handleChangePassword}
                  variant="primary"
                  style={styles.saveButton}
                  disabled={
                    isSaving ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                />
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Language & Region
              </Text>
              <View style={styles.languageCard}>
                <View style={styles.languageRow}>
                  {(
                    [
                      { code: "en", label: "English", flag: "🇺🇸" },
                      { code: "fr", label: "Français", flag: "🇫🇷" },
                      { code: "ar", label: "العربية", flag: "🇸🇦" },
                    ] as { code: LanguageCode; label: string; flag: string }[]
                  ).map((opt) => (
                    <TouchableOpacity
                      key={opt.code}
                      onPress={() => handleLanguageChange(opt.code)}
                      style={[
                        styles.langPill,
                        settings.language === opt.code && styles.langPillActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.langFlag}>{opt.flag}</Text>
                      <Text
                        style={[
                          styles.langPillText,
                          settings.language === opt.code &&
                            styles.langPillTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {settings.language === opt.code && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#fff"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Account Actions
              </Text>
              <View style={styles.actionContainer}>
                <Button
                  title="Logout"
                  onPress={() => setShowLogoutModal(true)}
                  variant="secondary"
                  style={styles.signOutButton}
                />
                <TouchableOpacity style={styles.deleteAccountButton}>
                  <Ionicons name="warning-outline" size={16} color="#F44336" />
                  <Text style={styles.deleteAccountText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === "academic" && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Academic Details</Text>
                {hasUnsavedChanges && (
                  <View style={styles.unsavedBadge}>
                    <Text style={styles.unsavedText}>Unsaved</Text>
                  </View>
                )}
              </View>
              <View style={styles.formCard}>
                <CustomTextInput
                  label="Institution"
                  value={academicInfo.institution}
                  onChangeText={(val) =>
                    handleAcademicInfoChange("institution", val)
                  }
                  style={styles.input}
                  error={validationErrors.institution}
                />
                <CustomTextInput
                  label="Major/Field of Study"
                  value={academicInfo.major}
                  onChangeText={(val) => handleAcademicInfoChange("major", val)}
                  style={styles.input}
                  error={validationErrors.major}
                />
                <CustomTextInput
                  label="Current GPA"
                  value={academicInfo.gpa}
                  onChangeText={(val) => handleAcademicInfoChange("gpa", val)}
                  style={styles.input}
                  placeholder="0.00 - 4.00"
                  error={validationErrors.gpa}
                />
                <CustomTextInput
                  label="Expected Graduation"
                  value={academicInfo.graduation}
                  onChangeText={(val) =>
                    handleAcademicInfoChange("graduation", val)
                  }
                  style={styles.input}
                  placeholder="e.g., May 2024"
                />
                <CustomTextInput
                  label="Academic Year"
                  value={academicInfo.year}
                  onChangeText={(val) => handleAcademicInfoChange("year", val)}
                  style={styles.input}
                  error={validationErrors.year}
                />
                <Button
                  title={isSaving ? "Saving..." : "Save Academic Info"}
                  onPress={handleSaveAcademic}
                  variant="primary"
                  style={styles.saveButton}
                  disabled={isSaving || !hasUnsavedChanges}
                />
              </View>
            </View>
          )}

          {activeTab === "documents" && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Uploaded Documents</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUploadDocument}
                >
                  <Ionicons name="add-circle" size={16} color="#fff" />
                  <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
              </View>

              {/* Document Stats */}
              <View style={styles.documentStatsRow}>
                <View style={styles.documentStatCard}>
                  <Text style={styles.documentStatValue}>
                    {documents.length}
                  </Text>
                  <Text style={styles.documentStatLabel}>Total</Text>
                </View>
                <View
                  style={[
                    styles.documentStatCard,
                    { backgroundColor: "#4CAF50" + "15" },
                  ]}
                >
                  <Text
                    style={[styles.documentStatValue, { color: "#4CAF50" }]}
                  >
                    {documents.filter((d) => d.status === "verified").length}
                  </Text>
                  <Text style={styles.documentStatLabel}>Verified</Text>
                </View>
                <View
                  style={[
                    styles.documentStatCard,
                    { backgroundColor: "#FF9800" + "15" },
                  ]}
                >
                  <Text
                    style={[styles.documentStatValue, { color: "#FF9800" }]}
                  >
                    {documents.filter((d) => d.status === "pending").length}
                  </Text>
                  <Text style={styles.documentStatLabel}>Pending</Text>
                </View>
              </View>

              <View style={styles.documentsCard}>
                {documents.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="document-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyStateText}>
                      No documents uploaded
                    </Text>
                    <Text style={styles.emptyStateSubtext}>
                      Upload your first document to get started
                    </Text>
                  </View>
                ) : (
                  documents.map((doc) => (
                    <View key={doc.id} style={styles.documentItem}>
                      <View style={styles.documentIconContainer}>
                        <Ionicons
                          name="document-text"
                          size={24}
                          color="#2196F3"
                        />
                      </View>
                      <View style={styles.documentInfo}>
                        <View style={styles.documentHeader}>
                          <Text style={styles.documentName} numberOfLines={1}>
                            {doc.name}
                          </Text>
                        </View>
                        <Text style={styles.documentDetails}>
                          {doc.type} • {doc.size} • {doc.uploadDate}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                doc.status === "verified"
                                  ? "#4CAF50" + "20"
                                  : doc.status === "pending"
                                  ? "#FF9800" + "20"
                                  : "#F44336" + "20",
                            },
                          ]}
                        >
                          <Ionicons
                            name={
                              doc.status === "verified"
                                ? "checkmark-circle"
                                : doc.status === "pending"
                                ? "time"
                                : "close-circle"
                            }
                            size={12}
                            color={
                              doc.status === "verified"
                                ? "#4CAF50"
                                : doc.status === "pending"
                                ? "#FF9800"
                                : "#F44336"
                            }
                          />
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  doc.status === "verified"
                                    ? "#4CAF50"
                                    : doc.status === "pending"
                                    ? "#FF9800"
                                    : "#F44336",
                              },
                            ]}
                          >
                            {doc.status === "verified"
                              ? "Verified"
                              : doc.status === "pending"
                              ? "Pending"
                              : "Rejected"}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.documentActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleViewDocument(doc.id)}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={18}
                            color="#2196F3"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDownloadDocument(doc.id)}
                        >
                          <Ionicons
                            name="download-outline"
                            size={18}
                            color="#666"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteDocument(doc.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#F44336"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {activeTab === "settings" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <View style={styles.settingsCard}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => toggleSetting("pushEnabled")}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons
                        name="notifications-outline"
                        size={20}
                        color="#4CAF50"
                      />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>
                        Push Notifications
                      </Text>
                      <Text style={styles.settingDescription}>
                        Receive notifications on your device
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSetting("pushEnabled")}
                    style={[
                      styles.toggle,
                      settings.pushEnabled
                        ? styles.toggleActive
                        : styles.toggleInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        settings.pushEnabled && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => toggleSetting("emailEnabled")}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name="mail-outline" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>
                        Email Notifications
                      </Text>
                      <Text style={styles.settingDescription}>
                        Receive updates via email
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSetting("emailEnabled")}
                    style={[
                      styles.toggle,
                      settings.emailEnabled
                        ? styles.toggleActive
                        : styles.toggleInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        settings.emailEnabled && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.settingItem, { borderBottomWidth: 0 }]}
                  onPress={() => toggleSetting("darkMode")}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name="moon-outline" size={20} color="#9C27B0" />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Dark Mode</Text>
                      <Text style={styles.settingDescription}>
                        Switch to dark theme
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSetting("darkMode")}
                    style={[
                      styles.toggle,
                      settings.darkMode
                        ? styles.toggleActive
                        : styles.toggleInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        settings.darkMode && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Security
              </Text>
              <View style={styles.formCard}>
                <CustomTextInput
                  label="Current Password"
                  value={passwordData.oldPassword}
                  onChangeText={(val) =>
                    setPasswordData((prev) => ({ ...prev, oldPassword: val }))
                  }
                  secureTextEntry
                  showPasswordToggle
                  style={styles.input}
                  error={validationErrors.oldPassword}
                />
                <CustomTextInput
                  label="New Password"
                  value={passwordData.newPassword}
                  onChangeText={(val) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: val }))
                  }
                  secureTextEntry
                  showPasswordToggle
                  style={styles.input}
                  error={validationErrors.fullName}
                />
                <CustomTextInput
                  label="Email Address"
                  value={personalInfo.email}
                  onChangeText={(val) => handlePersonalInfoChange("email", val)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  error={validationErrors.email}
                />
                <CustomTextInput
                  label="Phone Number"
                  value={personalInfo.phone}
                  onChangeText={(val) => handlePersonalInfoChange("phone", val)}
                  keyboardType="phone-pad"
                  style={styles.input}
                  error={validationErrors.phone}
                />
                <CustomTextInput
                  label="Date of Birth"
                  value={personalInfo.dob}
                  onChangeText={(val) => handlePersonalInfoChange("dob", val)}
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                />
                <CustomTextInput
                  label="Address"
                  value={personalInfo.address}
                  onChangeText={(val) =>
                    handlePersonalInfoChange("address", val)
                  }
                  style={styles.input}
                  error={validationErrors.address}
                />
                <Button
                  title={isSaving ? "Saving..." : "Save Changes"}
                  onPress={handleSavePersonal}
                  variant="primary"
                  style={styles.saveButton}
                  disabled={isSaving || !hasUnsavedChanges}
                />
              </View>
            </View>
          )}

          {activeTab === "about" && (
            <View style={styles.section}>
              <View style={styles.aboutCard}>
                <View style={styles.appIconContainer}>
                  <LinearGradient
                    colors={["#f2c44d", "#e8b738"]}
                    style={styles.appIcon}
                  >
                    <Ionicons name="school" size={32} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={styles.appName}>Student Portal</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appDescription}>
                  Empowering students by connecting them with donors and
                  opportunities. We strive to make education accessible and
                  equitable for everyone.
                </Text>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Information & Support
              </Text>
              <View style={styles.settingsCard}>
                <TouchableOpacity
                  style={styles.settingItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color="#2196F3"
                      />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Terms of Service</Text>
                      <Text style={styles.settingDescription}>
                        Read our terms and conditions
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color="#4CAF50"
                      />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Privacy Policy</Text>
                      <Text style={styles.settingDescription}>
                        Learn how we protect your data
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons
                        name="help-circle-outline"
                        size={20}
                        color="#FF9800"
                      />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Help Center</Text>
                      <Text style={styles.settingDescription}>
                        Find answers to common questions
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.settingItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={20}
                        color="#9C27B0"
                      />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Contact Support</Text>
                      <Text style={styles.settingDescription}>
                        Get help from our team
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
              </View>

              <Text style={styles.copyrightText}>
                © 2024 Student Portal. All rights reserved.
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="log-out-outline" size={32} color="#FF9800" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to logout? You can log back in anytime with
              your credentials.
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowLogoutModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Document Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <View
                style={[
                  styles.modalIconCircle,
                  { backgroundColor: "#F44336" + "15" },
                ]}
              >
                <Ionicons name="trash-outline" size={32} color="#F44336" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Delete Document</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowDeleteModal(false);
                  setSelectedDocument(null);
                }}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title="Delete"
                onPress={confirmDeleteDocument}
                variant="primary"
                style={{ backgroundColor: "#F44336", flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#f2c44d" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      )}
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
  tabsContainer: {
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 12,
  },
  tabsScroll: {
    paddingHorizontal: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButtonActive: {
    backgroundColor: "#333",
    borderColor: "#333",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
  },
  tabButtonTextActive: {
    color: "#fff",
  },
  unsavedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF9800",
    marginLeft: 6,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  studentIdBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  profileStudentId: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  unsavedBadge: {
    backgroundColor: "#FF9800" + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unsavedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF9800",
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  documentStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  documentStatCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
  },
  documentStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  documentStatLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  documentsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  documentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2196F3" + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  documentInfo: {
    flex: 1,
    gap: 4,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  documentDetails: {
    fontSize: 12,
    color: "#999",
  },
  documentActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#999",
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleInactive: {
    backgroundColor: "#ddd",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  languageCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  languageRow: {
    gap: 10,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 8,
  },
  langPillActive: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  langFlag: {
    fontSize: 20,
  },
  langPillText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  langPillTextActive: {
    color: "#fff",
  },
  actionContainer: {
    marginTop: 24,
    gap: 12,
  },
  signOutButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#333",
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F44336",
  },
  aboutCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f2c44d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  copyrightText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF9800" + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
});

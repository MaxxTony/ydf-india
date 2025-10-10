import { Button, CustomTextInput, ReviewerHeader } from "@/components";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ScholarshipFormData = {
  title: string;
  tagline: string;
  category: string;
  sponsorName: string;
  coverImageUri: string | null;
  description: string;
  eligibleCourses: string;
  eligibleYearSemester: string;
  gender: string;
  incomeRange: string;
  location: string;
  otherConditions: string;
  amountType: string;
  amountOrRange: string;
  numAwards: string;
  paymentFrequency: string;
  startDate: string;
  endDate: string;
  applyMethod: string;
  externalUrl: string;
  requiredDocuments: string[];
  sampleDocUri: string | null;
  selectionMethod: string;
  selectionTimeline: string;
  contactEmail: string;
  contactPhone: string;
  status: "Draft" | "Published" | string;
  featured: boolean;
  allowMultipleApplications: boolean;
};

export default function ProviderAddScholarshipScreen() {
  // Consolidated form state
  const [formData, setFormData] = useState<ScholarshipFormData>({
    // Basic Information
    title: "",
    tagline: "",
    category: "",
    sponsorName: "",
    coverImageUri: null,
    description: "",
    
    // Eligibility
    eligibleCourses: "",
    eligibleYearSemester: "",
    gender: "Any",
    incomeRange: "",
    location: "",
    otherConditions: "",
    
    // Funding
    amountType: "",
    amountOrRange: "",
    numAwards: "",
    paymentFrequency: "",
    
    // Application Window
    startDate: "",
    endDate: "",
    applyMethod: "",
    externalUrl: "",
    
    // Documents
    requiredDocuments: [],
    sampleDocUri: null,
    
    // Selection
    selectionMethod: "",
    selectionTimeline: "",
    contactEmail: "",
    contactPhone: "",
    
    // Settings
    status: "Draft",
    featured: false,
    allowMultipleApplications: false,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Constants
  const categories = useMemo(() => ["Govt", "Private", "NGO", "University"], []);
  const genders = useMemo(() => ["Any", "Male", "Female", "Other"], []);
  const amountTypes = useMemo(() => ["Single", "Range", "Monthly"], []);
  const paymentFrequencies = useMemo(() => ["One-time", "Monthly", "Yearly"], []);
  const applyMethods = useMemo(() => ["In-App", "External Link"], []);
  const selectionMethods = useMemo(() => ["Merit", "Interview", "Random"], []);
  const documentsList = useMemo(
    () => [
      "College ID",
      "Marksheet",
      "Income Proof",
      "Aadhaar / National ID",
      "Admission Letter",
      "Recommendation Letter",
    ],
    []
  );

  // Generic update handler
  const updateField = useCallback((field: keyof ScholarshipFormData, value: ScholarshipFormData[keyof ScholarshipFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value } as ScholarshipFormData));
    // Clear error for this field when user starts typing
    if (errors[String(field)]) {
      setErrors((prev) => ({ ...prev, [String(field)]: null }));
    }
  }, [errors]);

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string | null> = {};

    // Basic Information
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    // Application Window
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    
    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Apply Method
    if (formData.applyMethod === "External Link" && !formData.externalUrl.trim()) {
      newErrors.externalUrl = "Application URL is required for external links";
    }

    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }

    // Funding validation
    if (formData.amountType && !formData.amountOrRange.trim()) {
      newErrors.amountOrRange = "Please specify the amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Toggle document selection
  const toggleDocument = useCallback((doc: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter((d) => d !== doc)
        : [...prev.requiredDocuments, doc],
    }));
  }, []);

  // Image picker with error handling
  const handlePickCoverImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permission to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets?.[0]) {
        updateField("coverImageUri", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  // Document picker with error handling
  const handlePickSampleDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        updateField("sampleDocUri", asset.name || asset.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
      console.error("Document picker error:", error);
    }
  };

  // Collect payload helper
  const collectPayload = useCallback((finalStatus: "Draft" | "Published") => ({
    title: formData.title,
    tagline: formData.tagline,
    category: formData.category,
    sponsorName: formData.sponsorName,
    coverImageUri: formData.coverImageUri,
    description: formData.description,
    eligibility: {
      courses: formData.eligibleCourses,
      yearSemester: formData.eligibleYearSemester,
      gender: formData.gender,
      incomeRange: formData.incomeRange,
      location: formData.location,
      otherConditions: formData.otherConditions,
    },
    funding: {
      amountType: formData.amountType,
      amountOrRange: formData.amountOrRange,
      numAwards: formData.numAwards,
      paymentFrequency: formData.paymentFrequency,
    },
    applicationWindow: {
      startDate: formData.startDate,
      endDate: formData.endDate,
      applyMethod: formData.applyMethod,
      externalUrl: formData.applyMethod === "External Link" ? formData.externalUrl : undefined,
    },
    requiredDocuments: formData.requiredDocuments,
    sampleDocUri: formData.sampleDocUri,
    selection: {
      method: formData.selectionMethod,
      timeline: formData.selectionTimeline,
      contact: {
        email: formData.contactEmail,
        phone: formData.contactPhone,
      },
    },
    visibility: {
      status: finalStatus,
      featured: formData.featured,
      allowMultipleApplications: formData.allowMultipleApplications,
    },
  }), [formData]);

  // Action handlers
  const handleSaveDraft = useCallback(() => {
    const payload = collectPayload("Draft");
    console.log("Save Draft", payload);
    Alert.alert("Success", "Scholarship saved as draft!");
    // TODO: API call to save draft
  }, [collectPayload]);

  const handlePreview = useCallback(() => {
    const status: "Draft" | "Published" = formData.status === "Published" ? "Published" : "Draft";
    const payload = collectPayload(status);
    console.log("Preview Scholarship", payload);
    // TODO: Navigate to preview screen
  }, [collectPayload, formData.status]);

  const handlePublish = useCallback(() => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly before publishing."
      );
      return;
    }

    Alert.alert(
      "Publish Scholarship",
      "Are you sure you want to publish this scholarship? It will be visible to all students.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Publish",
          onPress: () => {
            const payload = collectPayload("Published");
            console.log("Publish Scholarship", payload);
            // TODO: API call to publish
            Alert.alert("Success", "Scholarship published successfully!");
          },
        },
      ]
    );
  }, [validateForm, collectPayload]);

  // Check if publish should be disabled
  const isPublishDisabled = useMemo(() => {
    return (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate
    );
  }, [formData.title, formData.category, formData.description, formData.startDate, formData.endDate]);

  // Render chip button component
  const ChipButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ReviewerHeader
        title="Add Scholarship"
        subtitle="Create a new scholarship opportunity"
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.card}>
            <CustomTextInput
              label="Scholarship Title *"
              value={formData.title}
              onChangeText={(text) => updateField("title", text)}
              placeholder="e.g., National Merit Scholarship"
            error={errors.title || undefined}
            />
            
            <CustomTextInput
              label="Tagline / Short Description"
              value={formData.tagline}
              onChangeText={(text) => updateField("tagline", text)}
              placeholder="A catchy one-liner about the scholarship"
            />

            <Text style={styles.label}>
              Category * {errors.category && <Text style={styles.errorText}>({errors.category})</Text>}
            </Text>
            <View style={styles.rowWrap}>
              {categories.map((c) => (
                <ChipButton
                  key={c}
                  label={c}
                  selected={formData.category === c}
                  onPress={() => updateField("category", c)}
                />
              ))}
            </View>

            <CustomTextInput
              label="Sponsor Name"
              value={formData.sponsorName}
              onChangeText={(text) => updateField("sponsorName", text)}
              placeholder="Organization or Sponsor name"
            />

            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickCoverImage}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>
                {formData.coverImageUri ? "Change Cover Image" : "Upload Cover Image"}
              </Text>
            </TouchableOpacity>
            {formData.coverImageUri && (
              <Image
                source={{ uri: formData.coverImageUri }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            )}

            <CustomTextInput
              label="Full Description *"
              value={formData.description}
              onChangeText={(text) => updateField("description", text)}
              placeholder="Describe the scholarship purpose, benefits, and key details..."
              inputStyle={styles.textArea}
            error={errors.description || undefined}
            />
          </View>
        </View>

        {/* Eligibility Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          <View style={styles.card}>
            <CustomTextInput
              label="Eligible Courses / Streams"
              value={formData.eligibleCourses}
              onChangeText={(text) => updateField("eligibleCourses", text)}
              placeholder="e.g., Engineering, Arts, Science, Commerce"
            />
            
            <CustomTextInput
              label="Eligible Year / Semester"
              value={formData.eligibleYearSemester}
              onChangeText={(text) => updateField("eligibleYearSemester", text)}
              placeholder="e.g., 1st to 4th year, All years"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.rowWrap}>
              {genders.map((g) => (
                <ChipButton
                  key={g}
                  label={g}
                  selected={formData.gender === g}
                  onPress={() => updateField("gender", g)}
                />
              ))}
            </View>

            <CustomTextInput
              label="Income Range"
              value={formData.incomeRange}
              onChangeText={(text) => updateField("incomeRange", text)}
              placeholder="e.g., up to ₹2,50,000 per annum"
            />
            
            <CustomTextInput
              label="Location / State / Country"
              value={formData.location}
              onChangeText={(text) => updateField("location", text)}
              placeholder="e.g., India, Maharashtra, Pan-India"
            />
            
            <CustomTextInput
              label="Other Conditions (Optional)"
              value={formData.otherConditions}
              onChangeText={(text) => updateField("otherConditions", text)}
              placeholder="Any additional eligibility requirements"
              inputStyle={styles.textAreaSmall}
            />
          </View>
        </View>

        {/* Funding Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funding Details</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Amount Type</Text>
            <View style={styles.rowWrap}>
              {amountTypes.map((a) => (
                <ChipButton
                  key={a}
                  label={a}
                  selected={formData.amountType === a}
                  onPress={() => updateField("amountType", a)}
                />
              ))}
            </View>

            <CustomTextInput
              label="Amount / Range"
              value={formData.amountOrRange}
              onChangeText={(text) => updateField("amountOrRange", text)}
              placeholder="e.g., ₹50,000 or ₹30,000 - ₹60,000"
              keyboardType="numeric"
            error={errors.amountOrRange || undefined}
            />
            
            <CustomTextInput
              label="Number of Awards"
              value={formData.numAwards}
              onChangeText={(text) => updateField("numAwards", text)}
              placeholder="e.g., 100"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Payment Frequency</Text>
            <View style={styles.rowWrap}>
              {paymentFrequencies.map((p) => (
                <ChipButton
                  key={p}
                  label={p}
                  selected={formData.paymentFrequency === p}
                  onPress={() => updateField("paymentFrequency", p)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Application Window */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Window</Text>
          <View style={styles.card}>
            <CustomTextInput
              label="Start Date *"
              value={formData.startDate}
              onChangeText={(text) => updateField("startDate", text)}
              placeholder="YYYY-MM-DD"
            error={errors.startDate || undefined}
            />
            
            <CustomTextInput
              label="End Date *"
              value={formData.endDate}
              onChangeText={(text) => updateField("endDate", text)}
              placeholder="YYYY-MM-DD"
            error={errors.endDate || undefined}
            />

            <Text style={styles.label}>Apply Method</Text>
            <View style={styles.rowWrap}>
              {applyMethods.map((m) => (
                <ChipButton
                  key={m}
                  label={m}
                  selected={formData.applyMethod === m}
                  onPress={() => updateField("applyMethod", m)}
                />
              ))}
            </View>

            {formData.applyMethod === "External Link" && (
              <CustomTextInput
                label="Application URL"
                value={formData.externalUrl}
                onChangeText={(text) => updateField("externalUrl", text)}
                placeholder="https://example.com/apply"
                autoCapitalize="none"
                keyboardType="default"
                error={errors.externalUrl || undefined}
              />
            )}
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Select Required Documents</Text>
            <View style={styles.rowWrap}>
              {documentsList.map((d) => (
                <ChipButton
                  key={d}
                  label={d}
                  selected={formData.requiredDocuments.includes(d)}
                  onPress={() => toggleDocument(d)}
                />
              ))}
            </View>

            <Text style={styles.label}>Sample / Reference File (Optional)</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickSampleDoc}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>
                {formData.sampleDocUri ? "Change Sample Document" : "Upload Sample Document"}
              </Text>
            </TouchableOpacity>
            {formData.sampleDocUri && (
              <Text style={styles.fileName}>📎 {formData.sampleDocUri}</Text>
            )}
          </View>
        </View>

        {/* Selection Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selection Method</Text>
            <View style={styles.rowWrap}>
              {selectionMethods.map((s) => (
                <ChipButton
                  key={s}
                  label={s}
                  selected={formData.selectionMethod === s}
                  onPress={() => updateField("selectionMethod", s)}
                />
              ))}
            </View>

            <CustomTextInput
              label="Selection Timeline"
              value={formData.selectionTimeline}
              onChangeText={(text) => updateField("selectionTimeline", text)}
              placeholder="e.g., Shortlist by June 15, Results by July 1"
            />
            
            <CustomTextInput
              label="Contact Email"
              value={formData.contactEmail}
              onChangeText={(text) => updateField("contactEmail", text)}
              placeholder="contact@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            error={errors.contactEmail || undefined}
            />
            
            <CustomTextInput
              label="Contact Phone"
              value={formData.contactPhone}
              onChangeText={(text) => updateField("contactPhone", text)}
              placeholder="+91 XXXXXXXXXX"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Visibility & Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility & Settings</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.rowWrap}>
              {["Draft", "Published"].map((s) => (
                <ChipButton
                  key={s}
                  label={s}
                  selected={formData.status === s}
                  onPress={() => updateField("status", s)}
                />
              ))}
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Featured</Text>
                <Text style={styles.toggleHint}>Show on homepage</Text>
              </View>
              <Switch
                value={formData.featured}
                onValueChange={(value) => updateField("featured", value)}
                trackColor={{ false: "#e5e5e5", true: "#666" }}
                thumbColor={formData.featured ? "#333" : "#f4f3f4"}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Allow Multiple Applications</Text>
                <Text style={styles.toggleHint}>Students can apply multiple times</Text>
              </View>
              <Switch
                value={formData.allowMultipleApplications}
                onValueChange={(value) => updateField("allowMultipleApplications", value)}
                trackColor={{ false: "#e5e5e5", true: "#666" }}
                thumbColor={formData.allowMultipleApplications ? "#333" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          variant="secondary"
          title="Save Draft"
          onPress={handleSaveDraft}
          style={styles.bottomButton}
        />
        <View style={styles.buttonSpacer} />
        <Button
          variant="secondary"
          title="Preview"
          onPress={handlePreview}
          style={styles.bottomButton}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Publish"
          onPress={handlePublish}
          disabled={isPublishDisabled}
          style={styles.bottomButton}
        />
      </View>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
    marginTop: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "500",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
  },
  chipSelected: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  chipText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#fff",
  },
  uploadButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  coverImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  textAreaSmall: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  fileName: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
    marginTop: 8,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    marginBottom: 2,
  },
  toggleHint: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomButton: {
    flex: 1,
  },
  buttonSpacer: {
    width: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
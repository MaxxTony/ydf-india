import { Button, CustomTextInput, ReviewerHeader } from "@/components";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProviderAddScholarshipScreen() {
  // Basic Information
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<"Govt" | "Private" | "NGO" | "University" | "">("");
  const [sponsorName, setSponsorName] = useState("");
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const categories = useMemo(() => ["Govt", "Private", "NGO", "University"] as const, []);

  // Eligibility Criteria
  const [eligibleCourses, setEligibleCourses] = useState("");
  const [eligibleYearSemester, setEligibleYearSemester] = useState("");
  const [gender, setGender] = useState<"Any" | "Male" | "Female" | "Other" | "">("");
  const [incomeRange, setIncomeRange] = useState("");
  const [location, setLocation] = useState("");
  const [otherConditions, setOtherConditions] = useState("");

  const genders = useMemo(() => ["Any", "Male", "Female", "Other"] as const, []);

  // Funding Details
  const [amountType, setAmountType] = useState<"Single" | "Range" | "Monthly" | "">("");
  const [amountOrRange, setAmountOrRange] = useState("");
  const [numAwards, setNumAwards] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState<"One-time" | "Monthly" | "Yearly" | "">("");

  const amountTypes = useMemo(() => ["Single", "Range", "Monthly"] as const, []);
  const paymentFrequencies = useMemo(() => ["One-time", "Monthly", "Yearly"] as const, []);

  // Application Window
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyMethod, setApplyMethod] = useState<"In-App" | "External Link" | "">("");
  const [externalUrl, setExternalUrl] = useState("");

  const applyMethods = useMemo(() => ["In-App", "External Link"] as const, []);

  // Required Documents
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
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
  const [sampleDocUri, setSampleDocUri] = useState<string | null>(null);

  // Selection Process
  const [selectionMethod, setSelectionMethod] = useState<"Merit" | "Interview" | "Random" | "">("");
  const [selectionTimeline, setSelectionTimeline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const selectionMethods = useMemo(() => ["Merit", "Interview", "Random"] as const, []);

  // Visibility & Settings
  const [status, setStatus] = useState<"Draft" | "Published" | "">("Draft");
  const [featured, setFeatured] = useState(false);
  const [allowMultipleApplications, setAllowMultipleApplications] = useState(false);

  // Helpers
  const toggleDocument = (doc: string) => {
    setRequiredDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handlePickCoverImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      console.warn("Media library permission not granted");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCoverImageUri(result.assets[0].uri);
    }
  };

  const handlePickSampleDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (!("canceled" in result) || result.canceled) return;
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSampleDocUri(asset.name || asset.uri);
    }
  };

  const handleSaveDraft = () => {
    // Placeholder: persist as draft
    console.log("Save Draft", collectPayload("Draft"));
  };

  const handlePreview = () => {
    // Placeholder: navigate to preview screen or modal
    console.log("Preview Scholarship", collectPayload(status || "Draft"));
  };

  const handlePublish = () => {
    // Placeholder: submit publish
    console.log("Publish Scholarship", collectPayload("Published"));
  };

  const collectPayload = (finalStatus: "Draft" | "Published") => ({
    title,
    tagline,
    category,
    sponsorName,
    coverImageUri,
    description,
    eligibility: {
      courses: eligibleCourses,
      yearSemester: eligibleYearSemester,
      gender,
      incomeRange,
      location,
      otherConditions,
    },
    funding: {
      amountType,
      amountOrRange,
      numAwards,
      paymentFrequency,
    },
    applicationWindow: {
      startDate,
      endDate,
      applyMethod,
      externalUrl: applyMethod === "External Link" ? externalUrl : undefined,
    },
    requiredDocuments,
    sampleDocUri,
    selection: {
      method: selectionMethod,
      timeline: selectionTimeline,
      contact: { email: contactEmail, phone: contactPhone },
    },
    visibility: {
      status: finalStatus,
      featured,
      allowMultipleApplications,
    },
  });

  const isPublishDisabled = useMemo(() => {
    // Minimal gating for publish
    return !title || !category || !description || !startDate || !endDate;
  }, [title, category, description, startDate, endDate]);

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Add Scholarship" subtitle="Create a new scholarship" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.card}>
            <CustomTextInput label="Scholarship Title" value={title} onChangeText={setTitle} placeholder="e.g., National Merit Scholarship" />
            <CustomTextInput label="Tagline / Short Description" value={tagline} onChangeText={setTagline} placeholder="Short catchy line" />

            <Text style={styles.label}>Category</Text>
            <View style={styles.rowWrap}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.chip, category === c && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, category === c && styles.chipTextSelected]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomTextInput label="Sponsor Name" value={sponsorName} onChangeText={setSponsorName} placeholder="Organization / Sponsor" />

            <Text style={styles.label}>Cover Image</Text>
            <View style={styles.coverRow}>
              <Button variant="secondary" title="Upload Cover Image" onPress={handlePickCoverImage} />
            </View>
            {coverImageUri && (
              <Image source={{ uri: coverImageUri }} style={styles.coverImage} />
            )}

            <CustomTextInput
              label="Full Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the scholarship, purpose, benefits, etc."
              inputStyle={{ height: 120, textAlignVertical: "top" }}
            />
          </View>
        </View>

        {/* Eligibility Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          <View style={styles.card}>
            <CustomTextInput label="Eligible Courses / Streams" value={eligibleCourses} onChangeText={setEligibleCourses} placeholder="e.g., Engineering, Arts, Science" />
            <CustomTextInput label="Eligible Year / Semester" value={eligibleYearSemester} onChangeText={setEligibleYearSemester} placeholder="e.g., 1st to 4th year" />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.rowWrap}>
              {genders.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.chip, gender === g && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, gender === g && styles.chipTextSelected]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomTextInput label="Income Range" value={incomeRange} onChangeText={setIncomeRange} placeholder="e.g., up to ₹2,50,000" />
            <CustomTextInput label="Location / State / Country" value={location} onChangeText={setLocation} placeholder="e.g., India, Maharashtra" />
            <CustomTextInput
              label="Other Conditions (optional)"
              value={otherConditions}
              onChangeText={setOtherConditions}
              placeholder="Any additional conditions"
              inputStyle={{ height: 100, textAlignVertical: "top" }}
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
                <TouchableOpacity
                  key={a}
                  onPress={() => setAmountType(a)}
                  style={[styles.chip, amountType === a && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, amountType === a && styles.chipTextSelected]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomTextInput label="Amount / Range" value={amountOrRange} onChangeText={setAmountOrRange} placeholder="e.g., ₹50,000 or ₹30,000 - ₹60,000" keyboardType="numeric" />
            <CustomTextInput label="Number of Awards" value={numAwards} onChangeText={setNumAwards} placeholder="e.g., 100" keyboardType="numeric" />

            <Text style={styles.label}>Payment Frequency</Text>
            <View style={styles.rowWrap}>
              {paymentFrequencies.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPaymentFrequency(p)}
                  style={[styles.chip, paymentFrequency === p && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, paymentFrequency === p && styles.chipTextSelected]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Application Window */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Window</Text>
          <View style={styles.card}>
            <CustomTextInput label="Start Date" value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
            <CustomTextInput label="End Date" value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />

            <Text style={styles.label}>Apply Method</Text>
            <View style={styles.rowWrap}>
              {applyMethods.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setApplyMethod(m)}
                  style={[styles.chip, applyMethod === m && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, applyMethod === m && styles.chipTextSelected]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {applyMethod === "External Link" && (
              <CustomTextInput label="Application URL" value={externalUrl} onChangeText={setExternalUrl} placeholder="https://..." autoCapitalize="none" />
            )}
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Select documents</Text>
            <View style={styles.rowWrap}>
              {documentsList.map((d) => {
                const selected = requiredDocuments.includes(d);
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => toggleDocument(d)}
                    style={[styles.chip, selected && styles.chipSelected]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{d}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Sample / Reference file</Text>
            <View style={styles.coverRow}>
              <Button variant="secondary" title="Upload Sample" onPress={handlePickSampleDoc} />
            </View>
            {sampleDocUri ? (
              <Text style={styles.fileName}>Attached: {sampleDocUri}</Text>
            ) : null}
          </View>
        </View>

        {/* Selection Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Selection Method</Text>
            <View style={styles.rowWrap}>
              {selectionMethods.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectionMethod(s)}
                  style={[styles.chip, selectionMethod === s && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectionMethod === s && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomTextInput label="Selection Timeline" value={selectionTimeline} onChangeText={setSelectionTimeline} placeholder="e.g., Shortlist by June, Results by July" />
            <CustomTextInput label="Contact Email" value={contactEmail} onChangeText={setContactEmail} placeholder="contact@example.com" autoCapitalize="none" keyboardType="email-address" />
            <CustomTextInput label="Contact Phone" value={contactPhone} onChangeText={setContactPhone} placeholder="Phone number" keyboardType="phone-pad" />
          </View>
        </View>

        {/* Visibility & Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility & Settings</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.rowWrap}>
              {["Draft", "Published"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s as "Draft" | "Published")}
                  style={[styles.chip, status === s && styles.chipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, status === s && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Featured</Text>
              <Switch value={featured} onValueChange={setFeatured} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Allow Multiple Applications</Text>
              <Switch value={allowMultipleApplications} onValueChange={setAllowMultipleApplications} />
            </View>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button variant="secondary" title="Save Draft" onPress={handleSaveDraft} style={{ flex: 1 }} />
        <View style={{ width: 12 }} />
        <Button variant="secondary" title="Preview" onPress={handlePreview} style={{ flex: 1 }} />
        <View style={{ width: 12 }} />
        <Button title="Publish" onPress={handlePublish} disabled={isPublishDisabled} style={{ flex: 1 }} />
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  chipSelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  chipText: {
    color: "#333",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#fff",
  },
  coverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  coverImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 8,
  },
  fileName: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  bottomSpacer: {
    height: 24,
  },
});



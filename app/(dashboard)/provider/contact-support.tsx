import { ReviewerHeader } from "@/components";
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../../../components/Button";

type Attachment = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export default function ProviderContactSupportScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleAttach = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;

      // Enforce max size 10MB
      if (asset.size && asset.size > 10 * 1024 * 1024) {
        Alert.alert("File Too Large", "Please select a file smaller than 10MB.");
        return;
      }

      setAttachment({
        uri: asset.uri,
        name: asset.name || 'attachment',
        type: asset.mimeType || 'application/octet-stream',
        size: asset.size,
      });
    } catch (e) {
      Alert.alert("Error", "Failed to pick a file. Please try again.");
    }
  };
  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert("Missing Information", "Please fill in both subject and description.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Success", "Your support ticket has been submitted successfully. Our team will respond within 24 hours.");
      setSubject("");
      setDescription("");
      setAttachment(null);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Contact Support" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>How can we help?</Text>
            <Text style={styles.subtitle}>
              Submit a ticket and our support team will get back to you within 24 hours
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Subject Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Subject <Text style={styles.required}>*</Text>
              </Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'subject' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Brief summary of your issue"
                  placeholderTextColor="rgba(51,51,51,0.4)"
                  style={styles.input}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <View style={[
                styles.inputWrapper,
                styles.textareaWrapper,
                focusedField === 'description' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Provide detailed information about your issue..."
                  placeholderTextColor="rgba(51,51,51,0.4)"
                  multiline
                  numberOfLines={6}
                  style={[styles.input, styles.textarea]}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <Text style={styles.helperText}>
                {description.length}/500 characters
              </Text>
            </View>

            {/* Attachment Section */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Attachment</Text>
              <Text style={[styles.helperText,{marginBottom: 12}]}>
                Add screenshots or files to help us understand your issue
              </Text>
              
              {attachment ? (
                <View style={styles.attachmentPreview}>
                  <View style={styles.attachmentIcon}>
                    <Text style={styles.attachmentIconText}>📎</Text>
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{attachment.name}</Text>
                    <Text style={styles.attachmentSize}>
                      {(attachment.type?.includes('pdf') ? 'PDF' : 'Image')}
                      {attachment.size ? ` • ${(attachment.size / 1024).toFixed(1)} KB` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setAttachment(null)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleAttach}
                  activeOpacity={0.7}
                >
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>📤</Text>
                  </View>
                  <Text style={styles.uploadText}>Upload File</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG or PDF (Max 10MB)</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Need immediate help?</Text>
              <Text style={styles.infoText}>
                Check our FAQ section or contact us directly at support@example.com
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title={submitting ? "Submitting..." : "Submit Ticket"}
            onPress={handleSubmit}
            loading={submitting}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
   
  },
  inputWrapperFocused: {
    borderColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
  },
  textareaWrapper: {
    minHeight: 140,
  },
  textarea: {
    minHeight: 140,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  helperText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadIconText: {
    fontSize: 24,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  attachmentPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  attachmentIconText: {
    fontSize: 20,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#3B82F6",
    lineHeight: 18,
  },
  submitButton: {
    marginTop: 8,
  },
});
import { ReviewerHeader } from "@/components";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../../components/Button";

export default function ProviderContactSupportScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAttach = () => setAttachment("screenshot.png");
  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert("Missing", "Please fill subject and description.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Submitted", "Your ticket has been submitted successfully.");
      setSubject("");
      setDescription("");
      setAttachment(null);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <ReviewerHeader title="Contact Support" />
      <View style={styles.content}>
        <Text style={styles.title}>Raise a Ticket</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Subject</Text>
          <TextInput value={subject} onChangeText={setSubject} placeholder="Enter subject" style={styles.input} />

          <Text style={[styles.label, { marginTop: 12 }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your issue"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textarea]}
          />

          <Button
            title={attachment ? `Attachment: ${attachment}` : "Upload Attachment (static)"}
            variant="secondary"
            onPress={handleAttach}
            style={{ marginTop: 12 }}
          />
        </View>

        <Button title="Submit" onPress={handleSubmit} loading={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 12 },
  content: { padding: 20 },
  title: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51,51,51,0.15)",
    padding: 16,
    marginBottom: 16,
  },
  label: { fontWeight: "700", color: "#333" },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(51,51,51,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  textarea: { height: 120, textAlignVertical: "top" },
});



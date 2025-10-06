import { Button, CustomTextInput } from "@/components";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ApplyFormScreen() {
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
          <Text style={styles.headerTitle}>Apply for Scholarship</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <Text style={styles.progressText}>Personal Info</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Documents</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Review</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formCard}>
            <CustomTextInput
              label="Full Name"
              placeholder="Enter your full name"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
            
            <CustomTextInput
              label="Email Address"
              placeholder="Enter your email"
              value=""
              onChangeText={() => {}}
              keyboardType="email-address"
              style={styles.input}
            />
            
            <CustomTextInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value=""
              onChangeText={() => {}}
              keyboardType="phone-pad"
              style={styles.input}
            />
            
            <CustomTextInput
              label="Student ID"
              placeholder="Enter your student ID"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
            
            <CustomTextInput
              label="Current GPA"
              placeholder="Enter your current GPA"
              value=""
              onChangeText={() => {}}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.sectionTitle}>Academic Information</Text>
          
          <View style={styles.formCard}>
            <CustomTextInput
              label="Institution Name"
              placeholder="Enter your institution name"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
            
            <CustomTextInput
              label="Major/Field of Study"
              placeholder="Enter your major"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
            
            <CustomTextInput
              label="Expected Graduation Date"
              placeholder="MM/YYYY"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
            
            <CustomTextInput
              label="Current Year"
              placeholder="e.g., Sophomore, Junior, Senior"
              value=""
              onChangeText={() => {}}
              style={styles.input}
            />
          </View>

          <Text style={styles.sectionTitle}>Personal Statement</Text>
          
          <View style={styles.formCard}>
            <Text style={styles.textAreaLabel}>Why do you deserve this scholarship? (500 words max)</Text>
            <View style={styles.textAreaContainer}>
              <CustomTextInput
                placeholder="Write your personal statement here..."
                value=""
                onChangeText={() => {}}
                style={styles.textArea}
              
              />
            </View>
            <Text style={styles.wordCount}>0/500 words</Text>
          </View>

          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.formCard}>
            <CustomTextInput
              label="Extracurricular Activities"
              placeholder="List your activities and achievements"
              value=""
              onChangeText={() => {}}
       
           
              style={styles.input}
            />
            
            <CustomTextInput
              label="Work Experience"
              placeholder="Describe your work experience"
              value=""
              onChangeText={() => {}}
              
             
              style={styles.input}
            />
            
            <CustomTextInput
              label="Financial Need Statement"
              placeholder="Explain your financial situation"
              value=""
              onChangeText={() => {}}
          
           
              style={styles.input}
            />
          </View>

          {/* Auto-save indicator */}
          <View style={styles.autoSaveContainer}>
            <Ionicons name="cloud-done-outline" size={16} color="#4CAF50" />
            <Text style={styles.autoSaveText}>Auto-saved</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Save as Draft"
            onPress={() => {}}
            variant="secondary"
            style={styles.draftButton}
          />
          <Button
            title="Continue to Documents"
            onPress={() => router.push("/(dashboard)/student/student-document-upload")}
            variant="primary"
            style={styles.continueButton}
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
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressStep: {
    alignItems: "center",
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  input: {
    marginBottom: 16,
  },
  textAreaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    fontSize: 16,
    color: "#333",
    minHeight: 120,
  },
  wordCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  autoSaveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  autoSaveText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  draftButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});


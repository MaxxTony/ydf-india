import { Button } from "@/components";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function OtpScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 1]}
      />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We have sent a 6-digit code to your email and phone
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* OTP Input */}
          <OtpInput
            numberOfDigits={4}
            focusColor="#fff"
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpBox,
              focusedPinCodeContainerStyle: styles.otpBoxFocused,
              pinCodeTextStyle: styles.otpText,
            }}
          />

          {/* Verify Button */}
          <Button
            title="Verify"
            onPress={() => router.replace("/(auth)/roles")}
            variant="primary"
          />

          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendQuestion}>Didn't receive the code?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(auth)/roles")}
            >
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 4,
    textShadowColor: "rgba(255, 255, 255, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.2)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    gap: 32,
  },
  otpContainer: {
    gap: 12,
  },
  otpBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51, 51, 51, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 48,
    height: 56,
  },
  otpBoxFocused: {
    borderColor: "#f2c44d",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  otpText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  verifyButton: {
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  resendQuestion: {
    color: "rgba(51, 51, 51, 0.7)",
    fontSize: 14,
  },
  resendLink: {
    color: "#333",
    fontWeight: "700",
    fontSize: 14,
  },
});

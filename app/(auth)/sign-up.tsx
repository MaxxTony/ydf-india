import { Button, CustomTextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import PhoneInput from "react-native-phone-number-input";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const phoneInput = useRef<PhoneInput>(null);

  const validate = () => {
    const nextErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    const emailRegex = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/;

    if (firstName.trim().length < 2)
      nextErrors.firstName = "Enter your first name";
    if (lastName.trim().length < 2)
      nextErrors.lastName = "Enter your last name";
    if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
    if (!phoneInput.current?.isValidNumber(phone))
      nextErrors.phone = "Enter a valid phone number";
    if (password.length < 6) nextErrors.password = "Minimum 6 characters";
    if (confirmPassword.length < 6)
      nextErrors.confirmPassword = "Minimum 6 characters";
    if (
      !nextErrors.password &&
      !nextErrors.confirmPassword &&
      password !== confirmPassword
    )
      nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.replace("/(auth)/otp");
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/appImages/new.png")}
              resizeMode="contain"
              style={{ width: 150, height: 150, marginBottom: 20 }}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start your journey</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* First Name Input */}
            <CustomTextInput
              label="First Name"
              placeholder="Your first name"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              error={errors.firstName}
              focused={focusedField === "firstName"}
            />

            {/* Last Name Input */}
            <CustomTextInput
              label="Last Name"
              placeholder="Your last name"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              error={errors.lastName}
              focused={focusedField === "lastName"}
            />

            {/* Email Input */}
            <CustomTextInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              focused={focusedField === "email"}
            />

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View
                style={[
                  styles.phoneContainer,
                  focusedField === "phone" && styles.phoneFocused,
                  errors.phone && styles.phoneError,
                ]}
              >
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={phone}
                  defaultCode="IN"
                  layout="second"
                  onChangeText={setPhone}
                  onChangeFormattedText={(text) => {
                    setPhone(text);
                  }}
                  withDarkTheme={false}
                  withShadow={false}
                  autoFocus={false}
                  containerStyle={styles.phoneInputContainer}
                  textContainerStyle={styles.phoneTextContainer}
                  textInputStyle={styles.phoneTextInput}
                  codeTextStyle={styles.phoneCodeText}
                  flagButtonStyle={styles.phoneFlagButton}
                  countryPickerButtonStyle={styles.countryPickerButton}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Password Input */}
            <CustomTextInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={true}
              error={errors.password}
              focused={focusedField === "password"}
              showPasswordToggle={true}
            />

            {/* Confirm Password Input */}
            <CustomTextInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={true}
              error={errors.confirmPassword}
              focused={focusedField === "confirmPassword"}
              showPasswordToggle={true}
            />

            {/* Create Account Button */}
            <Button
              title={submitting ? "Creating account..." : "Create account"}
              onPress={onSubmit}
              disabled={submitting}
              loading={submitting}
              variant="primary"
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <Button
                title=""
                onPress={() => router.push("/(auth)/roles")}
                variant="social"
                style={styles.socialButton}
              >
                <Ionicons name="logo-google" size={20} color="#333" />
              </Button>

              <Button
                title=""
                onPress={() => router.push("/(auth)/roles")}
                variant="social"
                style={styles.socialButton}
              >
                <Ionicons name="logo-linkedin" size={20} color="#333" />
              </Button>

              <Button
                title=""
                onPress={() => router.push("/(auth)/roles")}
                variant="social"
                style={styles.socialButton}
              >
                <Ionicons name="logo-apple" size={20} color="#333" />
              </Button>
            </View>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInQuestion}>Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
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
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.2)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51, 51, 51, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputFocused: {
    borderColor: "#f2c44d",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  inputError: {
    borderColor: "rgba(239, 68, 68, 0.8)",
  },
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(51, 51, 51, 0.2)",
  },
  dividerText: {
    color: "rgba(51, 51, 51, 0.6)",
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1.5,
    borderColor: "rgba(51, 51, 51, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  signInQuestion: {
    color: "rgba(51, 51, 51, 0.7)",
    fontSize: 15,
  },
  signInLink: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  phoneContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51, 51, 51, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  phoneFocused: {
    borderColor: "#f2c44d",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  phoneError: {
    borderColor: "rgba(239, 68, 68, 0.8)",
  },
  phoneInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    height: 48,
  },
  phoneTextContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    height: 48,
  },
  phoneTextInput: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
    backgroundColor: "transparent",
    height: 48,
  },
  phoneCodeText: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "transparent",
  },
  phoneFlagButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  countryPickerButton: {
    backgroundColor: "transparent",
    width: 70,
  },
});

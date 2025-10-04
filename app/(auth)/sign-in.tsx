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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    password?: string;
  }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const phoneInput = useRef<PhoneInput>(null);

  const validate = () => {
    const nextErrors: { email?: string; phone?: string; password?: string } =
      {};
    const emailRegex = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/;

    if (loginMethod === "email") {
      if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
    } else {
      if (!phoneInput.current?.isValidNumber(phone))
        nextErrors.phone = "Enter a valid phone number";
    }

    if (loginMethod === "email" && password.length < 6)
      nextErrors.password = "Minimum 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (loginMethod === "phone") {
        router.replace("/(auth)/otp");
      } else {
        router.replace("/(auth)/roles");
      }
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
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Login Method Toggle */}
            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setLoginMethod("email")}
                style={[
                  styles.toggleButton,
                  loginMethod === "email" && styles.toggleButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleText,
                    loginMethod === "email" && styles.toggleTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoginMethod("phone")}
                style={[
                  styles.toggleButton,
                  loginMethod === "phone" && styles.toggleButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleText,
                    loginMethod === "phone" && styles.toggleTextActive,
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email/Phone Input */}
            {loginMethod === "email" ? (
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
            ) : (
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
            )}

            {/* Password Input - Only show for email login */}
            {loginMethod === "email" && (
              <CustomTextInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                error={errors.password}
                focused={focusedField === "password"}
                showPasswordToggle={true}
              />
            )}

            {/* Forgot Password - Only show for email login */}
            {loginMethod === "email" && (
              <View style={styles.forgotContainer}>
                <Link href="/(auth)/forgot" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}

            {/* Sign In Button */}
            <Button
              title={submitting
                ? "Signing in..."
                : loginMethod === "phone"
                ? "Next"
                : "Sign in"}
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

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpQuestion}>New here?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Create an account</Text>
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
    paddingTop: 80,
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
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
  },
  passwordToggle: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  signInButton: {
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
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInText: {
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  signUpQuestion: {
    color: "rgba(51, 51, 51, 0.7)",
    fontSize: 15,
  },
  signUpLink: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  methodToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(51, 51, 51, 0.1)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#333",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(51, 51, 51, 0.7)",
  },
  toggleTextActive: {
    color: "#fff",
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

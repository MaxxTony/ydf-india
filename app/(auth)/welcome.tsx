import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#f2c44d", "#f2c44d", "#fff"]}
        style={styles.background}
        locations={[0, 0.7, 1]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.titleSection}>
          <Image
            source={require("@/assets/appImages/new.png")}
            resizeMode="contain"
            style={{ width: 150, height: 150 }}
          />
        </View>

        {/* Bottom Section with Buttons */}
        <View style={styles.bottomSection}>
          <Text style={styles.welcomeText}>
            Sign in or create an account to continue
          </Text>

          <View style={styles.buttonContainer}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.signInButton} activeOpacity={0.8}>
                <Text style={styles.signInText}>Sign in</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity
                style={styles.createAccountButton}
                activeOpacity={0.8}
              >
                <Text style={styles.createAccountText}>Create account</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
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
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: "center",
    gap: 12,
  },
  logo: {
    fontSize: 64,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  bottomSection: {
    gap: 20,
  },
  welcomeText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 14,
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
  signInText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  createAccountButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#333",
  },
  createAccountText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
});
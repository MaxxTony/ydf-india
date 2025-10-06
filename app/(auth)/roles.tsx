import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const roles = [
  { 
    key: "student", 
    label: "Student", 
    description: "Access educational resources and opportunities",
    icon: "school-outline",
    color: "#4CAF50"
  },
  { 
    key: "employee", 
    label: "Employee", 
    description: "Manage work and professional development",
    icon: "briefcase-outline",
    color: "#2196F3"
  },
  { 
    key: "donor", 
    label: "Donor", 
    description: "Support causes and make a difference",
    icon: "heart-outline",
    color: "#E91E63"
  },
];

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>
            Choose how you'd like to proceed
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Role Selection */}
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => (
              <TouchableOpacity
                key={role.key}
                onPress={() => {
                  if (role.key === "employee") {
                    router.replace("/(dashboard)/employee-dashboard");
                  } else if (role.key === "student") {
                    router.replace("/(dashboard)/student-dashboard");
                  } else if (role.key === "donor") {
                    router.replace("/(dashboard)/donor-dashboard");
                  } 
                }}
                style={[styles.roleCard, { borderLeftColor: role.color }]}
                activeOpacity={0.8}
              >
                <View style={styles.roleContent}>
                  <View style={[styles.iconContainer, { backgroundColor: role.color + '20' }]}>
                    <Ionicons name={role.icon as any} size={24} color={role.color} />
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={styles.roleLabel}>{role.label}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
    fontSize: 28,
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
    lineHeight: 22,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  rolesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "rgba(51, 51, 51, 0.1)",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  roleContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  continueContainer: {
    marginTop: 8,
  },
  continueButton: {
    marginTop: 8,
  },
});
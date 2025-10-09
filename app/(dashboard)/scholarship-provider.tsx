import { StyleSheet, Text, View } from "react-native";

export default function ScholarshipProviderDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scholarship Provider Dashboard</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});



import { ReviewerHeader } from "@/components";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProviderAboutScreen() {
  return (
    <View style={styles.container}>
      <ReviewerHeader title="About" />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.logoRow}>
            <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.appName}>YDF Provider Portal</Text>
              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
          </View>
          <Text style={styles.about}>Simplifying scholarships for providers and students with an intuitive workflow.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.item}>Developed by YDF Team</Text>
          <Text style={styles.item}>Design & Product: YDF</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.link}>Terms of Service</Text>
          <Text style={styles.link}>Privacy Policy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 12 },
  content: { padding: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(51,51,51,0.15)",
    padding: 16,
    marginBottom: 16,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 48, height: 48, borderRadius: 8 },
  appName: { fontSize: 18, fontWeight: "800", color: "#111" },
  version: { color: "#666", fontWeight: "600" },
  about: { marginTop: 12, color: "#444", lineHeight: 20, fontWeight: "600" },
  sectionTitle: { fontWeight: "800", color: "#222", marginBottom: 6 },
  item: { color: "#444", fontWeight: "600", marginBottom: 4 },
  link: { color: "#2563EB", fontWeight: "700", marginBottom: 6 },
});



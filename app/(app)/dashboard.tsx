import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 24, justifyContent: "center", alignItems: "center", backgroundColor: "#f2c44d" }}>
      <Image source={require("@/assets/appImages/new.png")} resizeMode="contain" style={{ width: 100, height: 100 }} />
      <Text style={{ fontSize: 32, fontWeight: "800", textAlign: "center", color: "#333" }}>Dashboard</Text>
      <Text style={{ fontSize: 18, color: "#666", textAlign: "center" }}>Coming soon — personalized dashboard for Students, Employees, Donors, and Admins.</Text>

      <Link href="/(auth)/welcome" asChild>
        <TouchableOpacity
          style={{ backgroundColor: "#333", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Sign out</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}



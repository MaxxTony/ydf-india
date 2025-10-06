import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
};

export default function AppHeader({ title, onBack, rightIcon }: Props) {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: Platform.OS === "ios" ? inset.top + 20 : 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#f0f0f0",
      }}
    >
      <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#333", letterSpacing: -0.5 }}>
        {title}
      </Text>
      <View style={{ padding: 8, marginRight: -8 }}>{rightIcon}</View>
    </View>
  );
}



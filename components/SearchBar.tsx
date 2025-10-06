import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  placeholder?: string;
  onChangeText: (t: string) => void;
  onClear?: () => void;
};

export default function SearchBar({ value, onChangeText, onClear, placeholder = "Search..." }: Props) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#fff",marginBottom:10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
          borderRadius: 12,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: "#f0f0f0",
        }}
      >
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#333" }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}



import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-in" options={{ title: "Sign in" }} />
      <Stack.Screen name="(auth)/sign-up" options={{ title: "Create account" }} />
      <Stack.Screen name="(auth)/forgot" options={{ title: "Forgot password" }} />
      <Stack.Screen name="(auth)/otp" options={{ title: "Verify OTP" }} />
      <Stack.Screen name="(auth)/reset" options={{ title: "Reset password" }} />
      <Stack.Screen name="(auth)/roles" options={{ title: "Select role" }} />

      {/* App screens */}
      <Stack.Screen name="(app)/dashboard" options={{ title: "Dashboard" }} />
    </Stack>
  );
}

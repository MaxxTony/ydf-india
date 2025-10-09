import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} >
      {/* Auth screens */}
      <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-in" options={{ title: "Sign in" }} />
      <Stack.Screen name="(auth)/sign-up" options={{ title: "Create account" }} />
      <Stack.Screen name="(auth)/forgot" options={{ title: "Forgot password" }} />
      <Stack.Screen name="(auth)/otp" options={{ title: "Verify OTP" }} />
      <Stack.Screen name="(auth)/reset" options={{ title: "Reset password" }} />
      <Stack.Screen name="(auth)/roles" options={{ title: "Select role" }} />

      {/* Dashboard screens */}
      <Stack.Screen name="(dashboard)/student-mobilizer" options={{ title: "Student Mobilizer Dashboard" }} />
      <Stack.Screen name="(dashboard)/application-reviewer" options={{ title: "Application Reviewer Dashboard" }} />
      <Stack.Screen name="(dashboard)/scholarship-provider" options={{ title: "Scholarship Provider Dashboard" }} />
      <Stack.Screen name="(dashboard)/student-dashboard" options={{ title: "Student Dashboard" }} />
      
      {/* Student Module Screens */}
      <Stack.Screen name="(dashboard)/student/student-scholarship-listing" options={{ title: "Browse Scholarships" }} />
      <Stack.Screen name="(dashboard)/student/student-scholarship-details" options={{ title: "Scholarship Details" }} />
      <Stack.Screen name="(dashboard)/student/student-apply-form" options={{ title: "Apply for Scholarship" }} />
      <Stack.Screen name="(dashboard)/student/student-document-upload" options={{ title: "Document Upload" }} />
      <Stack.Screen name="(dashboard)/student/student-application-status" options={{ title: "Application Status" }} />
      <Stack.Screen name="(dashboard)/student/student-notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="(dashboard)/student/student-calendar" options={{ title: "Calendar & Reminders" }} />
      <Stack.Screen name="(dashboard)/student/student-profile" options={{ title: "Profile & Settings" }} />
    </Stack>
  );
}

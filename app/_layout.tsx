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

      {/* Reviewer Module Screens */}
      <Stack.Screen name="(dashboard)/reviewer/notifications" options={{ title: "Reviewer Notifications" }} />
      <Stack.Screen name="(dashboard)/reviewer/applications" options={{ title: "All Applications" }} />
      <Stack.Screen name="(dashboard)/reviewer/application-details" options={{ title: "Application Details" }} />
      <Stack.Screen name="(dashboard)/reviewer/documents" options={{ title: "Check Documents" }} />
      <Stack.Screen name="(dashboard)/reviewer/reports" options={{ title: "Reports" }} />
      
      {/* Reviewer Profile & Settings Screens */}
      <Stack.Screen name="(dashboard)/reviewer/profile" options={{ title: "Profile" }} />
      <Stack.Screen name="(dashboard)/reviewer/settings" options={{ title: "Settings" }} />
      <Stack.Screen name="(dashboard)/reviewer/help-support" options={{ title: "Help & Support" }} />
      <Stack.Screen name="(dashboard)/reviewer/contact-support" options={{ title: "Contact Support" }} />
      <Stack.Screen name="(dashboard)/reviewer/terms-conditions" options={{ title: "Terms & Conditions" }} />
      <Stack.Screen name="(dashboard)/reviewer/about" options={{ title: "About" }} />
    </Stack>
  );
}

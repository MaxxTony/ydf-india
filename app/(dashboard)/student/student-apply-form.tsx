import { AppHeader, Button, CustomTextInput } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { z } from "zod";

type DocumentItem = {
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
};

const FORM_STORAGE_KEY = "apply_form_draft_v1";

const formSchema = z.object({
  // Personal (can be prefilled in future from profile)
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone is required"),
  studentId: z.string().min(1, "Student ID is required"),

  // Academic
  institution: z.string().min(2, "Institution is required"),
  major: z.string().min(2, "Major is required"),
  gradDate: z.string().min(4, "Graduation date is required"),
  currentYear: z.string().min(2, "Current year is required"),
  gpa: z
    .string()
    .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) <= 4.0), {
      message: "GPA must be a number up to 4.0",
    }),

  // Narrative
  statement: z.string().min(50, "Please write at least 50 characters"),
  activities: z.string().optional().default(""),
  work: z.string().optional().default(""),
  financial: z.string().optional().default(""),

  // Docs
  documents: z.array(
    z.object({ name: z.string(), uri: z.string(), mimeType: z.string().nullable().optional(), size: z.number().nullable().optional() })
  ).min(1, "Please upload at least one document"),

  // Declaration
  agreed: z.boolean().refine((v) => v, { message: "You must agree before submitting" }),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { key: "personal", title: "Personal Details" },
  { key: "academic", title: "Academic Info" },
  { key: "family", title: "Family / Income" },
  { key: "documents", title: "Documents" },
  { key: "summary", title: "Summary" },
  { key: "declare", title: "Declaration" },
] as const;

export default function ApplyFormScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const stepperScrollRef = useRef<ScrollView | null>(null);

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      studentId: "",
      institution: "",
      major: "",
      gradDate: "",
      currentYear: "",
      gpa: "",
      statement: "",
      activities: "",
      work: "",
      financial: "",
      documents: [],
      agreed: false,
    },
    mode: "onChange",
  });

  // Load draft on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          reset(parsed);
        } catch { }
      }
    })();
  }, [reset]);

  // Debounced autosave
  const scheduleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const data = getValues();
      await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
      setLastSavedAt(Date.now());
    }, 600);
  };

  const currentStepKey = useMemo(() => STEPS[stepIndex].key, [stepIndex]);

  const next = async () => {
    // Validate only fields relevant to current step
    const fieldsByStep: Record<string, (keyof FormValues)[]> = {
      personal: ["fullName", "email", "phone", "studentId"],
      academic: ["institution", "major", "gradDate", "currentYear", "gpa"],
      family: ["financial"],
      documents: ["documents"],
      summary: [],
      declare: ["agreed"],
    };
    const fields = fieldsByStep[currentStepKey];
    if (fields.length) {
      const ok = await trigger(fields as any);
      if (!ok) return;
    }
    setStepIndex((i) => {
      const ni = Math.min(i + 1, STEPS.length - 1);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        centerActiveStep(ni);
      });
      return ni;
    });
  };

  const back = () =>
    setStepIndex((i) => {
      const ni = Math.max(0, i - 1);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        centerActiveStep(ni);
      });
      return ni;
    });

  const onPickDocuments = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*", multiple: true, copyToCacheDirectory: true });
    if (res.canceled) return;
    const picked: DocumentItem[] = res.assets.map((a) => ({ name: a.name, uri: a.uri, mimeType: a.mimeType ?? undefined, size: a.size ?? undefined }));
    const existing = getValues("documents");
    setValue("documents", [...existing, ...picked], { shouldDirty: true, shouldValidate: true });
    scheduleSave();
  };

  const removeDocument = (index: number) => {
    const existing = getValues("documents");
    const nextDocs = existing.filter((_, i) => i !== index);
    setValue("documents", nextDocs, { shouldDirty: true, shouldValidate: true });
    scheduleSave();
  };

  const fieldsByStep: Record<string, (keyof FormValues)[]> = {
    personal: ["fullName", "email", "phone", "studentId"],
    academic: ["institution", "major", "gradDate", "currentYear", "gpa"],
    family: ["financial"],
    documents: ["documents"],
    summary: [],
    declare: ["agreed"],
  };

  const findStepForField = (fieldName: keyof FormValues): number => {
    const stepKey = (Object.keys(fieldsByStep) as (keyof typeof fieldsByStep)[])
      .find((k) => (fieldsByStep[k] as (keyof FormValues)[]).includes(fieldName));
    const idx = stepKey ? STEPS.findIndex((s) => s.key === stepKey) : 0;
    return idx >= 0 ? idx : 0;
  };

  const onSubmit = handleSubmit(
    async (values) => {
      await AsyncStorage.removeItem(FORM_STORAGE_KEY);
      router.replace("/(dashboard)/student-dashboard");
    },
    (formErrors) => {
      // Jump to the first errored step and notify user
      const firstErrorField = Object.keys(formErrors)[0] as keyof FormValues | undefined;
      if (firstErrorField) {
        const targetStep = findStepForField(firstErrorField);
        setStepIndex(targetStep);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
          centerActiveStep(targetStep);
        });
        const message = (formErrors[firstErrorField]?.message as string) || "Please complete required fields";
        Alert.alert("Incomplete Application", message);
      }
    }
  );

  const onSaveDraft = async () => {
    const data = getValues();
    await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    setLastSavedAt(Date.now());
  };

  const onLoadDraft = async () => {
    const saved = await AsyncStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
      } catch { }
    }
  };

  const SavedIndicator = () => (
    <View style={styles.autoSaveContainer}>
      <Ionicons name="cloud-done-outline" size={16} color="#4CAF50" />
      <Text style={styles.autoSaveText}>{lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : isDirty ? "Saving…" : "Auto-saved"}</Text>
    </View>
  );

  const STEP_ITEM_WIDTH = 140; // roomy per-step width
  const centerActiveStep = (index: number) => {
    const x = Math.max(0, index * STEP_ITEM_WIDTH - STEP_ITEM_WIDTH);
    stepperScrollRef.current?.scrollTo({ x, animated: true });
  };

  const Stepper = () => {
    const totalWidth = STEP_ITEM_WIDTH * STEPS.length;
    // Colorful theme
    const colorActive = "#111827"; // near-black
    const colorDone = "#10B981"; // emerald
    const colorPending = "#D1D5DB"; // gray-300
    const colorLabel = "#6B7280";
    const customStyles = {
      stepIndicatorSize: 28,
      currentStepIndicatorSize: 32,
      separatorStrokeWidth: 3,
      currentStepStrokeWidth: 2,
      stepStrokeWidth: 2,
      stepStrokeCurrentColor: colorActive,
      stepStrokeFinishedColor: colorDone,
      stepStrokeUnFinishedColor: colorPending,
      separatorFinishedColor: colorDone,
      separatorUnFinishedColor: colorPending,
      stepIndicatorFinishedColor: colorDone,
      stepIndicatorUnFinishedColor: "#FFFFFF",
      stepIndicatorCurrentColor: "#FFFFFF",
      stepIndicatorLabelFontSize: 12,
      currentStepIndicatorLabelFontSize: 12,
      stepIndicatorLabelCurrentColor: colorActive,
      stepIndicatorLabelFinishedColor: "#FFFFFF",
      stepIndicatorLabelUnFinishedColor: "#9CA3AF",
      labelColor: colorLabel,
      currentStepLabelColor: colorActive,
      labelSize: 11,
    } as const;

    return (
      <View style={styles.stepperContainer}>
        <View style={styles.stepperInner}>
          <ScrollView
            ref={stepperScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: totalWidth }}
          >
            <View style={{ width: totalWidth, paddingVertical: 6 }}>
              <StepIndicator
                stepCount={STEPS.length}
                currentPosition={stepIndex}
                customStyles={customStyles}
                direction="horizontal"
                labels={STEPS.map((s) => s.title)}
                onPress={() => { /* disabled by requirement */ }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const Section = ({ children }: { children: React.ReactNode }) => (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 250 }}>
      <View style={styles.formCard}>{children}</View>
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#fff", "#fff", "#f2c44d"]} style={styles.background} locations={[0, 0.3, 1]} />

      <AppHeader title="Apply for Scholarship" onBack={() => router.back()} rightIcon={<TouchableOpacity onPress={onLoadDraft}><Ionicons name="cloud-download-outline" size={22} color="#333" /></TouchableOpacity>} />

      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={{ paddingBottom: 140, paddingTop: 20 }} showsVerticalScrollIndicator={false}>
        <Stepper />

        <View style={styles.formContainer}>
          {currentStepKey === "personal" && (
            <Section>
              <Controller control={control} name="fullName" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Full Name" placeholder="Enter your full name" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.fullName?.message} />
              )} />
              <Controller control={control} name="email" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Email" placeholder="Enter your email" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
              )} />
              <Controller control={control} name="phone" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Phone Number" placeholder="Enter your phone" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} keyboardType="phone-pad" error={errors.phone?.message} />
              )} />
              <Controller control={control} name="studentId" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Student ID" placeholder="Enter your student ID" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.studentId?.message} />
              )} />
            </Section>
          )}

          {currentStepKey === "academic" && (
            <Section>
              <Controller control={control} name="institution" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Institution Name" placeholder="Enter your institution" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.institution?.message} />
              )} />
              <Controller control={control} name="major" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Major / Field of Study" placeholder="Enter your major" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.major?.message} />
              )} />
              <Controller control={control} name="gradDate" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Expected Graduation" placeholder="MM/YYYY" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.gradDate?.message} />
              )} />
              <Controller control={control} name="currentYear" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Current Year" placeholder="e.g., Sophomore" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.currentYear?.message} />
              )} />
              <Controller control={control} name="gpa" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Current GPA" placeholder="Enter GPA (optional)" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} keyboardType="numeric" error={errors.gpa?.message} />
              )} />
            </Section>
          )}

          {currentStepKey === "family" && (
            <Section>
              <Controller control={control} name="financial" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Family / Income Info" placeholder="Explain your financial situation" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.financial?.message} />
              )} />
              <Controller control={control} name="activities" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Extracurricular Activities" placeholder="List your activities" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} />
              )} />
              <Controller control={control} name="work" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Work Experience" placeholder="Describe your work" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} />
              )} />
              <Controller control={control} name="statement" render={({ field: { onChange, value, onBlur } }) => (
                <CustomTextInput label="Personal Statement" placeholder="Why do you deserve this scholarship? (min 50 char)" value={value} onChangeText={(t) => { onChange(t); scheduleSave(); }} onBlur={onBlur} error={errors.statement?.message} inputStyle={{ minHeight: 100, textAlignVertical: "top" }} />
              )} />
            </Section>
          )}

          {currentStepKey === "documents" && (
            <Section>
              <View style={{ gap: 12 }}>
                <Button variant="secondary" onPress={onPickDocuments}>
                  <Text style={{ fontWeight: "700", color: "#333" }}>Pick Documents</Text>
                </Button>
                <Controller control={control} name="documents" render={({ field: { value } }) => (
                  <View style={{ gap: 8 }}>
                    {value?.map((doc, idx) => (
                      <View key={`${doc.uri}-${idx}`} style={styles.docItem}>
                        <Ionicons name="document-attach-outline" size={20} color="#333" />
                        <Text numberOfLines={1} style={styles.docName}>{doc.name}</Text>
                        <TouchableOpacity onPress={() => removeDocument(idx)} style={styles.docRemove}>
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {errors.documents?.message && (
                      <Text style={styles.errorTextInline}>{String(errors.documents.message)}</Text>
                    )}
                  </View>
                )} />
              </View>
            </Section>
          )}

          {currentStepKey === "summary" && (
            <Section>
              <View style={{ gap: 10 }}>
                <Text style={styles.summaryTitle}>Review Your Application</Text>
                {(
                  [
                    ["Full Name", getValues("fullName")],
                    ["Email", getValues("email")],
                    ["Phone", getValues("phone")],
                    ["Student ID", getValues("studentId")],
                    ["Institution", getValues("institution")],
                    ["Major", getValues("major")],
                    ["Graduation", getValues("gradDate")],
                    ["Current Year", getValues("currentYear")],
                    ["GPA", getValues("gpa") || "-"],
                    ["Activities", getValues("activities") || "-"],
                    ["Work", getValues("work") || "-"],
                    ["Financial", getValues("financial") || "-"],
                  ] as const
                ).map(([label, val]) => (
                  <View key={label} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{label}</Text>
                    <Text style={styles.summaryValue}>{val}</Text>
                  </View>
                ))}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Documents</Text>
                  <Text style={styles.summaryValue}>{getValues("documents").length} file(s)</Text>
                </View>
              </View>
            </Section>
          )}

          {currentStepKey === "declare" && (
            <Section>
              <Controller control={control} name="agreed" render={({ field: { value, onChange } }) => (
                <TouchableOpacity onPress={() => { onChange(!value); scheduleSave(); }} style={styles.declareRow}>
                  <Ionicons name={value ? "checkbox" : "square-outline"} size={22} color={value ? "#333" : "#999"} />
                  <Text style={styles.declareText}>I confirm that all information provided is accurate and complete.</Text>
                </TouchableOpacity>
              )} />
              {errors.agreed?.message && <Text style={styles.errorTextInline}>{errors.agreed.message}</Text>}
            </Section>
          )}

          <SavedIndicator />
        </View>

        {/* Spacer handled via contentContainerStyle */}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          {stepIndex === 0 ? (
            <Button title="Resume Later" onPress={onSaveDraft} variant="secondary" style={styles.footerBtn} />
          ) : (
            <Button title="Back" onPress={back} variant="secondary" style={styles.footerBtn} />
          )}
          {stepIndex < STEPS.length - 1 ? (
            <Button title="Next" onPress={next} variant="primary" style={[styles.footerBtn, styles.footerPrimary]} />
          ) : (
            <Button title={isSubmitting ? "Submitting..." : "Submit"} onPress={onSubmit} variant="primary" style={[styles.footerBtn, styles.footerPrimary]} disabled={isSubmitting} />
          )}
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
  scrollView: {
    flex: 1,
  },
  stepperContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stepperInner: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  stepperTrack: {
    height: 28,
    justifyContent: "center",
  },
  stepperBaseLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#E5E7EB",
  },
  stepperActiveLine: {
    position: "absolute",
    left: 0,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#111827",
  },
  stepperDot: {
    position: "absolute",
    top: 5,
    width: 20,
    height: 20,
  },
  dotCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dotCompleted: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  dotActive: {
    borderColor: "#111827",
  },
  stepperLabel: {
    position: "absolute",
    transform: [{ translateX: -50 }],
    width: 100,
    textAlign: "center",
    fontSize: 11,
    color: "#666",
  },
  stepperLabelActive: {
    color: "#333",
    fontWeight: "700",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  autoSaveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  autoSaveText: {
    fontSize: 13,
    color: "#4CAF50",
    marginLeft: 6,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  footerBtn: { flex: 1 },
  footerPrimary: { flex: 1.2 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(51,51,51,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  docName: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
  },
  docRemove: {
    padding: 6,
    marginLeft: 8,
  },
  errorTextInline: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "rgba(51,51,51,0.06)",
  },
  summaryLabel: {
    color: "#666",
    width: "40%",
  },
  summaryValue: {
    color: "#333",
    width: "58%",
    textAlign: "right",
  },
  declareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  declareText: {
    color: "#333",
    flex: 1,
  },
});

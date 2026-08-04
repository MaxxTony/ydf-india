import { AppHeader, Button, CustomTextInput, Toast } from "@/components";
import { useTheme } from "@/context/ThemeContext";

import { addMobilizerStudent, uploadProfileImage, getDropdownDefinitions, DropdownData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exchangeAuthorizationCodeForToken, loginWithDigiLocker, useDigiLockerWebView } from "@/utils/digilockerAuth";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    institution: z.string().optional(),
    gender: z.string().optional(),
    religion: z.string().optional(),
    caste: z.string().optional(),
    date_of_birth: z.string().optional(),
    academic_level: z.string().optional(),
    stream: z.string().optional(),
    year: z.string().optional(),
    university: z.string().optional(),
    marks_10_type: z.string().optional(),
    marks_10_value: z.string().optional(),
    marks_12_type: z.string().optional(),
    marks_12_value: z.string().optional(),
    graduation_type: z.string().optional(),
    graduation_value: z.string().optional(),
    father_name: z.string().optional(),
    mother_name: z.string().optional(),
    domicile_state: z.string().optional(),
    family_annual_income: z.string().optional(),
    category: z.string().optional(),
    registering_as: z.string().optional(),
    village: z.string().optional(),
    block: z.string().optional(),
    district: z.string().optional(),
    whatsapp_number: z.string().optional(),
    session: z.string().optional(),
    scheme_name: z.string().optional(),
    board_10: z.string().optional(),
    board_12: z.string().optional(),
    stream_12: z.string().optional(),
    passing_year_12: z.string().optional(),
    application_type: z.string().optional(),
    competitive_exam: z.string().optional(),
    competitive_exam_name: z.string().optional(),
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    ifsc: z.string().optional(),
    accountholder: z.string().optional(),
    account_type: z.string().optional(),
    aadhar_number: z.string().optional(),
    income_cert_no: z.string().optional(),
    domicile_cert_no: z.string().optional(),
}).superRefine((data, ctx) => {
    const validCGPA = (s: string) => { const n = parseFloat(s); return !isNaN(n) && n >= 0 && n <= 10; };
    const validPct = (s: string) => { const n = parseFloat(s); return !isNaN(n) && n >= 0 && n <= 100; };
    // Only validate when user has filled the field (non-blank). Blank = skip, no error.
    const v10 = (data.marks_10_value || "").trim();
    if (v10) {
        if (data.marks_10_type === "cgpa") {
            if (!validCGPA(v10)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "10th CGPA must be between 0 and 10", path: ["marks_10_value"] });
        } else {
            if (!validPct(v10)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "10th Percentage must be between 0 and 100", path: ["marks_10_value"] });
        }
    }
    const v12 = (data.marks_12_value || "").trim();
    if (v12) {
        if (data.marks_12_type === "cgpa") {
            if (!validCGPA(v12)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "12th CGPA must be between 0 and 10", path: ["marks_12_value"] });
        } else {
            if (!validPct(v12)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "12th Percentage must be between 0 and 100", path: ["marks_12_value"] });
        }
    }
    if (data.academic_level !== "School (Class 1-12)") {
        const vGrad = (data.graduation_value || "").trim();
        if (vGrad) {
            if (data.graduation_type === "cgpa") {
                if (!validCGPA(vGrad)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Graduation CGPA must be between 0 and 10", path: ["graduation_value"] });
            } else {
                if (!validPct(vGrad)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Graduation Percentage must be between 0 and 100", path: ["graduation_value"] });
            }
        }
    }
});

type FormValues = z.infer<typeof formSchema>;

const MARKS_TYPE_OPTIONS = [{ label: "CGPA", value: "cgpa" }, { label: "Percentage", value: "percentage" }];
const ACCOUNT_TYPE_OPTIONS = ["Savings", "Current", "Salary"];

const ADD_TABS = [
    { id: "personal", label: "Personal", icon: "person-outline", color: "#4CAF50" },
    { id: "academic", label: "Academic", icon: "school-outline", color: "#2196F3" },
    { id: "financial", label: "Financial", icon: "cash-outline", color: "#10B981" },
    { id: "documents", label: "Documents", icon: "document-text-outline", color: "#FF9800" },
];

export default function MobilizerAddStudentScreen() {
    const { isDark, colors } = useTheme();
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
    const [activeTab, setActiveTab] = useState<"personal" | "academic" | "financial" | "documents">("personal");

    const getOptionsByShortname = useCallback((shortname: string) => {
        if (!dropdownData) return [];
        const courseField = dropdownData.course_fields?.find((f: any) => f.shortname.toLowerCase() === shortname.toLowerCase());
        if (courseField) return courseField.options;

        const userField = dropdownData.user_fields?.find((f: any) => f.shortname.toLowerCase() === shortname.toLowerCase());
        if (userField) return userField.options;

        return [];
    }, [dropdownData]);

    const insets = useSafeAreaInsets();

    const GENDER_OPTIONS = getOptionsByShortname('gender').map((o: any) => o.label);
    const RELIGION_OPTIONS = getOptionsByShortname('religion').map((o: any) => o.label);
    const CASTE_OPTIONS = getOptionsByShortname('caste').map((o: any) => o.label);
    const CATEGORY_OPTIONS = getOptionsByShortname('category').map((o: any) => o.label);
    const REGISTERING_AS_OPTIONS = getOptionsByShortname('Registering_as').map((o: any) => o.label);
    const ANNUAL_INCOME_OPTIONS = getOptionsByShortname('family_income').map((o: any) => o.label);
    const STATE_OPTIONS = getOptionsByShortname('state').map((o: any) => o.label);
    const DISTRICT_OPTIONS = getOptionsByShortname('district').map((o: any) => o.label);
    const ACADEMIC_LEVEL_OPTIONS = getOptionsByShortname('academic_qualifications').map((o: any) => o.label);
    const STREAM_OPTIONS = getOptionsByShortname('course_category_1').map((o: any) => o.label);
    const YEAR_OPTIONS = getOptionsByShortname('year_of_course').map((o: any) => o.label);
    const SESSION_OPTIONS = getOptionsByShortname('session').map((o: any) => o.label);
    const SCHEME_OPTIONS = getOptionsByShortname('schemename').map((o: any) => o.label);
    const BOARD_10TH_OPTIONS = getOptionsByShortname('passing_10th').map((o: any) => o.label);
    const BOARD_12TH_OPTIONS = getOptionsByShortname('12th_board').map((o: any) => o.label);
    const STREAM_12TH_OPTIONS = getOptionsByShortname('stream_in_12th').map((o: any) => o.label);
    const PASSING_YEAR_12TH_OPTIONS = getOptionsByShortname('12th_passing_year').map((o: any) => o.label);
    const APPLICATION_TYPE_OPTIONS = getOptionsByShortname('application_type').map((o: any) => o.label);
    const COMPETITIVE_EXAM_OPTIONS = getOptionsByShortname('competitive_exam').map((o: any) => o.label);

    const [loading, setLoading] = useState(false);

    // Image & Document state
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<{ uri: string; name: string; type: string; mimeType?: string } | null>(null);
    const [docFile, setDocFile] = useState<{ uri: string; name: string; mimeType: string; size: number } | null>(null);
    const [docSaveAs, setDocSaveAs] = useState("");
    const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size?: string; uri?: string }[]>([]);

    // DigiLocker Integration
    const { WebViewComponent, show: showWebView } = useDigiLockerWebView();
    const [digilockerFiles, setDigilockerFiles] = useState<any[]>([]);
    const [digilockerModalVisible, setDigilockerModalVisible] = useState(false);
    const [digilockerLoading, setDigilockerLoading] = useState(false);
    const [digilockerAccessToken, setDigilockerAccessToken] = useState<string | null>(null);
    const [digilockerHistory, setDigilockerHistory] = useState<{ id: string; name: string }[]>([]);

    const fetchDigiLockerFiles = async (accessToken: string, folderId: string = "") => {
        setDigilockerLoading(true);
        try {
            const url = folderId 
                ? `https://digilocker.meripehchaan.gov.in/public/oauth2/1/files/${folderId}`
                : "https://digilocker.meripehchaan.gov.in/public/oauth2/1/files";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.error_description || result?.error || "Failed to fetch DigiLocker files");
            }
            const items = Array.isArray(result?.items) ? result.items : [];
            setDigilockerFiles(items);
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to fetch DigiLocker files");
        } finally {
            setDigilockerLoading(false);
        }
    };

    const handleDigiLockerClick = async () => {
        try {
            const digiLockerResult = await loginWithDigiLocker(showWebView);
            if (!digiLockerResult) return;

            const data = await exchangeAuthorizationCodeForToken(
                digiLockerResult.authorizationCode,
                digiLockerResult.codeVerifier
            );
            if (data?.access_token) {
                setDigilockerAccessToken(data.access_token);
                setDigilockerHistory([]);
                await fetchDigiLockerFiles(data.access_token);
                setDigilockerModalVisible(true);
            }
        } catch (error: any) {
            console.error("DigiLocker Login Error:", error);
            Alert.alert("Error", error.message || "Failed to connect to DigiLocker");
        }
    };

    const handleDigiLockerBack = async () => {
        if (!digilockerAccessToken || digilockerHistory.length === 0) return;
        const newHistory = [...digilockerHistory];
        newHistory.pop();
        setDigilockerHistory(newHistory);
        const parentFolderId = newHistory.length > 0 ? newHistory[newHistory.length - 1].id : "";
        await fetchDigiLockerFiles(digilockerAccessToken, parentFolderId);
    };

    const handleSelectDigiLockerFile = (file: any) => {
        if (file.type === "dir") {
            setDigilockerHistory(prev => [...prev, { id: file.id || "", name: file.name }]);
            if (digilockerAccessToken) fetchDigiLockerFiles(digilockerAccessToken, file.id);
            return;
        }
        setDocSaveAs(file.name);
        setDigilockerModalVisible(false);
        Alert.alert("DigiLocker Document Selected", `Selected "${file.name}" from DigiLocker.`);
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "image/*"],
                multiple: false,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setDocFile({
                    uri: asset.uri,
                    name: asset.name,
                    mimeType: asset.mimeType || "application/octet-stream",
                    size: asset.size || 0,
                });
                if (!docSaveAs) {
                    setDocSaveAs(asset.name);
                }
            }
        } catch (e) {
            console.error("Document picking failed", e);
        }
    };

    // Picker State
    const [pickerConfig, setPickerConfig] = useState<{ visible: boolean; title: string; options: string[]; field: keyof FormValues | null }>({
        visible: false,
        title: "",
        options: [],
        field: null,
    });

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({
        visible: false,
        message: "",
        type: "info",
    });

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            firstname: "",
            lastname: "",
            email: "",
            phone1: "",
            whatsapp_number: "",
            city: "",
            district: "",
            state: "",
            country: "IN",
            address: "",
            village: "",
            block: "",
            institution: "",
            gender: "",
            religion: "",
            caste: "",
            category: "",
            registering_as: "",
            date_of_birth: "",
            academic_level: "",
            stream: "",
            year: "",
            session: "",
            scheme_name: "",
            university: "",
            board_10: "",
            marks_10_type: "percentage",
            marks_10_value: "",
            board_12: "",
            stream_12: "",
            passing_year_12: "",
            marks_12_type: "percentage",
            marks_12_value: "",
            graduation_type: "percentage",
            graduation_value: "",
            application_type: "",
            competitive_exam: "",
            competitive_exam_name: "",
            father_name: "",
            mother_name: "",
            domicile_state: "",
            family_annual_income: "",
            bank_name: "",
            account_number: "",
            ifsc: "",
            accountholder: "",
            account_type: "",
            aadhar_number: "",
            income_cert_no: "",
            domicile_cert_no: "",
        },
    });

    const fetchDropdowns = useCallback(async () => {
        try {
            const authDataStr = await AsyncStorage.getItem("authData");
            if (authDataStr) {
                const authData = JSON.parse(authDataStr);
                if (authData.token) {
                    const response = await getDropdownDefinitions(authData.token);
                    if (response.success && response.data) {
                        setDropdownData(response.data);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch dropdowns:", error);
        }
    }, []);

    React.useEffect(() => {
        fetchDropdowns();
    }, [fetchDropdowns]);

    const openPicker = (field: keyof FormValues, title: string, options: string[]) => {
        setPickerConfig({ visible: true, title, options, field });
    };

    const handleSelect = (value: string) => {
        if (pickerConfig.field) {
            setValue(pickerConfig.field, value, { shouldValidate: true });
        }
        setPickerConfig((prev) => ({ ...prev, visible: false }));
    };

    const openDatePicker = () => {
        setDatePickerVisible(true);
    };

    const getDatePickerValue = (): Date => {
        const val = getValues("date_of_birth");
        if (!val) return new Date(2005, 0, 1);
        const parts = val.split(/[-/]/);
        if (parts.length >= 3) {
            const y = parseInt(parts[0], 10), m = parseInt(parts[1], 10) - 1, d = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
        }
        return new Date(2005, 0, 1);
    };

    const onDateConfirm = (date: Date) => {
        setValue("date_of_birth", date.toISOString().split("T")[0], { shouldValidate: true });
        setDatePickerVisible(false);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission", "Gallery access is required to upload photo.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
            const asset = result.assets[0];
            setProfileImageUri(asset.uri);
            setProfileImageFile({
                uri: asset.uri,
                name: asset.fileName || `student_${Date.now()}.jpg`,
                type: asset.type || "image/jpeg",
                mimeType: asset.type || "image/jpeg",
            });
        }
    };

    const removeImage = () => {
        setProfileImageUri(null);
        setProfileImageFile(null);
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            const authDataStr = await AsyncStorage.getItem("authData");
            if (!authDataStr) return;
            const { token } = JSON.parse(authDataStr);

            let profileImageFileId: number | null = null;
            if (profileImageFile) {
                const uploadRes = await uploadProfileImage(token, profileImageFile);
                if (uploadRes.success && uploadRes.data?.id) {
                    profileImageFileId = uploadRes.data.id;
                }
            }

            const customfields: { shortname: string; value: string }[] = [];
            if (data.gender) customfields.push({ shortname: "gender", value: data.gender });
            if (data.religion) customfields.push({ shortname: "religion", value: data.religion });
            if (data.caste) customfields.push({ shortname: "caste", value: data.caste });
            if (data.category) customfields.push({ shortname: "category", value: data.category });
            if (data.registering_as) customfields.push({ shortname: "Registering_as", value: data.registering_as });
            if (data.date_of_birth) customfields.push({ shortname: "date_of_birth", value: data.date_of_birth });
            if (data.address) customfields.push({ shortname: "address", value: data.address });
            if (data.district) customfields.push({ shortname: "district", value: data.district });
            if (data.village) customfields.push({ shortname: "village", value: data.village });
            if (data.block) customfields.push({ shortname: "block", value: data.block });
            if (data.whatsapp_number) customfields.push({ shortname: "whatsapp_number", value: data.whatsapp_number });
            if (data.state) customfields.push({ shortname: "state", value: data.state });
            if (data.academic_level) {
                customfields.push({ shortname: "academic_level", value: data.academic_level });
                customfields.push({ shortname: "course", value: data.academic_level });
            }
            if (data.session) customfields.push({ shortname: "session", value: data.session });
            if (data.scheme_name) customfields.push({ shortname: "schemename", value: data.scheme_name });
            if (data.academic_level !== "School (Class 1-12)") {
                if (data.stream) customfields.push({ shortname: "stream", value: data.stream });
                if (data.year) {
                    customfields.push({ shortname: "college_current_year", value: data.year });
                    customfields.push({ shortname: "year_of_course", value: data.year });
                }
                if (data.university) customfields.push({ shortname: "university", value: data.university });
            }
            if (data.board_10) customfields.push({ shortname: "passing_10th", value: data.board_10 });
            if (data.marks_10_type && data.marks_10_value) {
                customfields.push({ shortname: "marks_10_type", value: data.marks_10_type });
                customfields.push({ shortname: "marks_10_value", value: data.marks_10_value.trim() });
                customfields.push({ shortname: "10th", value: data.marks_10_value.trim() });
            }
            if (data.board_12) customfields.push({ shortname: "12th_board", value: data.board_12 });
            if (data.stream_12) customfields.push({ shortname: "stream_in_12th", value: data.stream_12 });
            if (data.passing_year_12) customfields.push({ shortname: "12th_passing_year", value: data.passing_year_12 });
            if (data.marks_12_type && data.marks_12_value) {
                customfields.push({ shortname: "marks_12_type", value: data.marks_12_type });
                customfields.push({ shortname: "marks_12_value", value: data.marks_12_value.trim() });
                customfields.push({ shortname: "12th_marks", value: data.marks_12_value.trim() });
            }
            if (data.academic_level !== "School (Class 1-12)" && data.graduation_type && data.graduation_value) {
                customfields.push({ shortname: "marks_graduation_type", value: data.graduation_type });
                customfields.push({ shortname: "marks_graduation_value", value: data.graduation_value.trim() });
                customfields.push({ shortname: "grade_in_cgpa_1", value: data.graduation_value.trim() });
            }
            if (data.application_type) customfields.push({ shortname: "application_type", value: data.application_type });
            if (data.competitive_exam) customfields.push({ shortname: "competitive_exam", value: data.competitive_exam });
            if (data.competitive_exam_name) customfields.push({ shortname: "competitive_exam_name", value: data.competitive_exam_name });
            if (data.father_name) customfields.push({ shortname: "father_name", value: data.father_name.trim() });
            if (data.mother_name) customfields.push({ shortname: "mother_name", value: data.mother_name.trim() });
            if (data.domicile_state) customfields.push({ shortname: "domicile_state", value: data.domicile_state.trim() });
            if (data.family_annual_income) {
                customfields.push({ shortname: "family_annual_income", value: data.family_annual_income });
                customfields.push({ shortname: "Family_income", value: data.family_annual_income });
            }
            if (data.bank_name) customfields.push({ shortname: "bank_name", value: data.bank_name.trim() });
            if (data.account_number) customfields.push({ shortname: "account_number", value: data.account_number.trim() });
            if (data.ifsc) customfields.push({ shortname: "ifsc", value: data.ifsc.trim() });
            if (data.accountholder) customfields.push({ shortname: "accountholder", value: data.accountholder.trim() });
            if (data.account_type) customfields.push({ shortname: "account_type", value: data.account_type.trim() });
            if (data.aadhar_number) customfields.push({ shortname: "aadhar_card", value: data.aadhar_number.trim() });
            if (data.income_cert_no) customfields.push({ shortname: "income_certificate", value: data.income_cert_no.trim() });
            if (data.domicile_cert_no) customfields.push({ shortname: "domicile_certificate", value: data.domicile_cert_no.trim() });

            const payload: any = {
                username: data.username,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
            };
            if (data.phone1) {
                const digits = data.phone1.replace(/\D/g, "");
                payload.phone1 = digits.length === 10 ? `91${digits}` : digits ? `91${digits}` : data.phone1;
            }
            if (data.city) payload.city = data.city;
            if (data.country) payload.country = data.country;
            if (data.institution) payload.institution = data.institution;
            if (profileImageFileId != null) payload.profileimage_file_id = profileImageFileId;

            customfields.forEach((field, index) => {
                payload[`customfields[${index}][shortname]`] = field.shortname;
                const val = String(field.value).trim();
                payload[`customfields[${index}][value]`] = ["gender", "religion", "caste"].includes(field.shortname) ? val.toLowerCase() : val;
            });



            console.log("=== MOBILIZER ADD STUDENT PAYLOAD ===", JSON.stringify(payload, null, 2));

            const response = await addMobilizerStudent(token, payload);

            if (response.success) {
                setToast({ visible: true, message: "Student added successfully!", type: "success" });
                setTimeout(() => router.back(), 1500);
            } else {
                setToast({ visible: true, message: response.message || "Failed to add student", type: "error" });
            }
        } catch (error: any) {
            setToast({ visible: true, message: error.message || "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const onInvalid = (errors: any) => {
        console.log("Add Student Validation Errors:", errors);
        const firstErrorKey = Object.keys(errors)[0];
        const firstError = errors[firstErrorKey];
        const msg = firstError?.message || "Please fill all required fields correctly.";
        setToast({ visible: true, message: msg, type: "error" });

        if (["username", "password", "firstname", "lastname", "email", "phone1", "city", "state", "address", "father_name", "mother_name", "date_of_birth", "gender", "religion", "caste", "family_annual_income"].includes(firstErrorKey)) {
            setActiveTab("personal");
        } else if (["academic_level", "category", "stream", "institution", "graduation_value", "year", "session"].includes(firstErrorKey)) {
            setActiveTab("academic");
        } else if (["bank_name", "accountholder", "account_number", "ifsc", "account_type"].includes(firstErrorKey)) {
            setActiveTab("financial");
        } else if (["aadhar_number", "income_cert_no", "domicile_cert_no"].includes(firstErrorKey)) {
            setActiveTab("documents");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? colors.background : "#f2c44d" }]}>
            <LinearGradient
                colors={isDark ? ["#121212", "#121212", "#1e1e1e"] : ["#fff", "#fff", "#f2c44d"]}
                style={styles.background}
            />
            <AppHeader title="Add New Student" onBack={() => router.back()} />
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Navigation Tabs */}
                    <View style={styles.tabContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
                            {ADD_TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <TouchableOpacity
                                        key={tab.id}
                                        onPress={() => setActiveTab(tab.id as any)}
                                        style={[
                                            styles.tabButton,
                                            {
                                                backgroundColor: isActive ? tab.color : (isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0"),
                                                borderColor: isActive ? tab.color : (isDark ? "rgba(255,255,255,0.15)" : "#e2e8f0"),
                                            }
                                        ]}
                                    >
                                        <Ionicons name={tab.icon as any} size={16} color={isActive ? "#fff" : (isDark ? "#94A3B8" : "#64748B")} />
                                        <Text style={[styles.tabButtonText, { color: isActive ? "#fff" : (isDark ? "#F1F5F9" : "#0F172A"), fontWeight: isActive ? "700" : "600" }]}>
                                            {tab.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* 1. PERSONAL TAB */}
                    {activeTab === "personal" && (
                        <>
                            {/* Card 1: Personal Details */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
                                <View style={styles.photoContainer}>
                                    <TouchableOpacity onPress={pickImage} style={[styles.photoCircle, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0", borderColor: colors.border, borderWidth: 1 }]}>
                                        {profileImageUri ? (
                                            <Image source={{ uri: profileImageUri }} style={styles.photoImage} />
                                        ) : (
                                            <View style={styles.photoPlaceholder}>
                                                <Ionicons name="camera" size={36} color={colors.primary} />
                                                <Text style={[styles.photoHint, { color: colors.textSecondary }]}>Upload Photo</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {profileImageUri && (
                                        <TouchableOpacity onPress={removeImage} style={[styles.removePhotoBtn, { backgroundColor: '#ff4d4d' }]}>
                                            <Ionicons name="trash-outline" size={16} color="#fff" />
                                            <Text style={styles.removePhotoText}>Remove</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <Controller control={control} name="username" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="at-outline" label="Username *" placeholder="Unique username" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.username?.message} />
                                )} />
                                <Controller control={control} name="password" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="lock-closed-outline" label="Password *" placeholder="Strong password" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry showPasswordToggle error={errors.password?.message} />
                                )} />
                                <Controller control={control} name="firstname" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="person-outline" label="First Name *" placeholder="Student first name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.firstname?.message} />
                                )} />
                                <Controller control={control} name="lastname" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="person-outline" label="Last Name *" placeholder="Student last name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.lastname?.message} />
                                )} />
                                <Controller control={control} name="email" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="mail-outline" label="Email Address *" placeholder="Student email" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" error={errors.email?.message} />
                                )} />
                                <Controller
                                    control={control}
                                    name="phone1"
                                    render={({ field: { onChange, value } }) => (
                                        <View style={styles.phoneFieldWrap}>
                                            <Text style={[styles.phoneLabel, { color: colors.textSecondary }]}>Phone Number</Text>
                                            <View
                                                style={[
                                                    styles.phoneContainer,
                                                    {
                                                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f9f9f9",
                                                        borderColor: errors.phone1 ? "#EF4444" : colors.border,
                                                    },
                                                ]}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", height: 48 }}>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            marginRight: 10,
                                                            paddingRight: 10,
                                                            borderRightWidth: 1,
                                                            borderRightColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(51, 51, 51, 0.1)",
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 20 }}>🇮🇳</Text>
                                                        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginLeft: 8 }}>+91</Text>
                                                    </View>
                                                    <TextInput
                                                        style={[styles.phoneTextInput, { flex: 1, color: colors.text }]}
                                                        value={value || ""}
                                                        onChangeText={(text) => {
                                                            const numeric = text.replace(/[^0-9]/g, "");
                                                            if (numeric.length <= 10) onChange(numeric);
                                                        }}
                                                        placeholder="Mobile Number"
                                                        placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(51, 51, 51, 0.4)"}
                                                        keyboardType="number-pad"
                                                        maxLength={10}
                                                    />
                                                </View>
                                            </View>
                                            {errors.phone1 && <Text style={styles.phoneErrorText}>{errors.phone1.message}</Text>}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Card 2: Basic Details */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Details</Text>
                                <Controller control={control} name="whatsapp_number" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="logo-whatsapp" label="WhatsApp Number" placeholder="Secondary/WhatsApp phone" value={value || ""} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" />
                                )} />
                                <Controller control={control} name="village" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="home-outline" label="Village / City" placeholder="Village or city name" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="block" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="navigate-outline" label="Block" placeholder="Block name" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="application_type" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("application_type", "Application Type", APPLICATION_TYPE_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="document-text-outline" label="Application Type" placeholder="Select Application Type" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="scheme_name" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("scheme_name", "Applying for scheme", SCHEME_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="bookmark-outline" label="Applying for scheme" placeholder="Select Scheme" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="domicile_state" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="flag-outline" label="Domicile State" placeholder="Select/Enter Domicile State" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="district" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("district", "Domicile District", DISTRICT_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="map-outline" label="Domicile District" placeholder="Select Domicile District" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="family_annual_income" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("family_annual_income", "Annual Family Income", ANNUAL_INCOME_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="cash-outline" label="Annual Family Income" placeholder="Select Income Range" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="category" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("category", "Special Category", CATEGORY_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="star-outline" label="Special Category" placeholder="Select Category" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="passing_year_12" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("passing_year_12", "12th Passing Year", PASSING_YEAR_12TH_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="calendar-outline" label="12th Passing Year" placeholder="Select Year" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="marks_12_value" render={({ field: { onChange, value } }) => (
                                    <CustomTextInput icon="ribbon-outline" label="12th Percentage" placeholder="Enter 12th Percentage" value={value || ""} onChangeText={onChange} keyboardType="decimal-pad" />
                                )} />
                                <Controller control={control} name="gender" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("gender", "Select Gender", GENDER_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="male-female-outline" label="Gender *" placeholder="Select Gender" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="date_of_birth" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={openDatePicker}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="calendar-outline" label="Date of Birth *" placeholder="Select DOB" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="religion" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("religion", "Select Religion", RELIGION_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="people-outline" label="Religion *" placeholder="Select Religion" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="caste" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("caste", "Select Caste", CASTE_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="people-outline" label="Caste *" placeholder="Select Caste" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="father_name" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="person-outline" label="Father's Name" placeholder="Enter Father's Name" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="mother_name" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="person-outline" label="Mother's Name" placeholder="Enter Mother's Name" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="address" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="location-outline" label="Address" placeholder="Enter Address" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                            </View>
                        </>
                    )}

                    {/* 2. ACADEMIC TAB */}
                    {activeTab === "academic" && (
                        <>
                            {/* Card 1: Course Information */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Course Information</Text>
                                <Controller control={control} name="academic_level" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("academic_level", "Select Course Name *", ACADEMIC_LEVEL_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="book-outline" label="Course Name *" placeholder="Select your course" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="category" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("category", "Select Category *", CATEGORY_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="grid-outline" label="Category *" placeholder="Select category (e.g. Engineering)" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="stream" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("stream", "Major / Stream *", STREAM_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="ribbon-outline" label="Major / Stream *" placeholder="Select your specialization" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                            </View>

                            {/* Card 2: Institution Details */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Institution Details</Text>
                                <Controller control={control} name="institution" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput 
                                        icon="business-outline" 
                                        label="School / College Name *" 
                                        placeholder="e.g., IIT Delhi, Delhi University" 
                                        value={value || ""} 
                                        onChangeText={onChange} 
                                        onBlur={onBlur} 
                                    />
                                )} />
                            </View>

                            {/* Card 3: Last Year Percentage */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Last Year Percentage</Text>
                                
                                <View style={styles.marksRow}>
                                    <Text style={[styles.marksLabel, { color: colors.textSecondary }]}>Grade Type</Text>
                                    <View style={styles.marksTypeRow}>
                                        {MARKS_TYPE_OPTIONS.map((opt) => (
                                            <Controller key={`grad-${opt.value}`} control={control} name="graduation_type" render={({ field: { value, onChange } }) => (
                                                <TouchableOpacity
                                                    onPress={() => { onChange(opt.value); setValue("graduation_value", ""); }}
                                                    style={[styles.marksChip, { borderColor: colors.border, backgroundColor: value === opt.value ? (colors.primary + "20") : (isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5") }]}
                                                >
                                                    <Text style={[styles.marksChipText, { color: value === opt.value ? colors.primary : colors.text }]}>{opt.label}</Text>
                                                </TouchableOpacity>
                                            )} />
                                        ))}
                                    </View>
                                    <Controller control={control} name="graduation_value" render={({ field: { onChange, value } }) => (
                                        <CustomTextInput
                                            label="Last Year Percentage / CGPA *"
                                            placeholder={watch("graduation_type") === "cgpa" ? "e.g. 8.5 (0–10)" : "e.g. 85 (0–100)"}
                                            value={value || ""}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
                                            error={errors.graduation_value?.message}
                                        />
                                    )} />
                                </View>
                            </View>

                            {/* Card 4: Timeline */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
                                <Controller control={control} name="year" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("year", "Academic Year (Start Year) *", YEAR_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="calendar-outline" label="Academic Year (Start Year) *" placeholder="Select start year" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "400" }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                                <Controller control={control} name="session" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("session", "Expected Academic End Date", SESSION_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="flag-outline" label="Expected Academic End Date" placeholder="Select end date / session" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                            </View>
                        </>
                    )}

                    {/* 3. FINANCIAL TAB */}
                    {activeTab === "financial" && (
                        <>
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Bank & Financial Details</Text>
                                <Controller control={control} name="bank_name" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="business-outline" label="Bank Name" placeholder="e.g. State Bank of India, HDFC" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="accountholder" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="person-outline" label="Account Holder Name" placeholder="Name as per bank passbook" value={value || ""} onChangeText={onChange} onBlur={onBlur} />
                                )} />
                                <Controller control={control} name="account_number" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="card-outline" label="Bank Account Number" placeholder="Account Number" value={value || ""} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" />
                                )} />
                                <Controller control={control} name="ifsc" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="barcode-outline" label="IFSC Code" placeholder="e.g. SBIN0001234" value={value || ""} onChangeText={(t) => onChange(t.toUpperCase())} onBlur={onBlur} autoCapitalize="characters" />
                                )} />
                                <Controller control={control} name="account_type" render={({ field: { value } }) => (
                                    <TouchableOpacity onPress={() => openPicker("account_type", "Account Type", ACCOUNT_TYPE_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput icon="wallet-outline" label="Account Type" placeholder="Select Account Type" value={value || ""} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1 }} rightIcon="chevron-down" />
                                        </View>
                                    </TouchableOpacity>
                                )} />
                            </View>
                        </>
                    )}

                    {/* 4. DOCUMENTS TAB */}
                    {activeTab === "documents" && (
                        <>
                            {/* Card 1: Connect DigiLocker */}
                            <TouchableOpacity style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }]} onPress={handleDigiLockerClick}>
                                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#7C3AED15', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                    <Ionicons name="cloud-upload-outline" size={24} color="#7C3AED" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Connect DigiLocker</Text>
                                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Import documents from DigiLocker</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            {/* Card 2: Upload New File */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload New File</Text>

                                {/* Attachment / File Picker */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={[styles.phoneLabel, { color: colors.textSecondary, marginBottom: 8 }]}>Attachment</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f9f9f9" }}>
                                        <Text style={{ flex: 1, fontSize: 15, color: docFile ? colors.text : colors.textSecondary }} numberOfLines={1}>
                                            {docFile ? docFile.name : "Choose file..."}
                                        </Text>
                                        <TouchableOpacity onPress={handlePickDocument} style={{ backgroundColor: "#e2e8f0", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                                            <Text style={{ fontWeight: '700', color: '#1e293b', fontSize: 14 }}>Browse</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Save as Name */}
                                <CustomTextInput icon="document-text-outline" label="Save as" placeholder="Enter file name" value={docSaveAs} onChangeText={setDocSaveAs} />

                                {/* Author */}
                                <CustomTextInput icon="person-outline" label="Author" value={watch("firstname") ? `${watch("firstname")} ${watch("lastname") || ""}`.trim() : "Student"} onChangeText={() => { }} editable={false} />

                                {/* Upload Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!docFile && !docSaveAs.trim()) {
                                            Alert.alert("Error", "Please select a file to upload.");
                                            return;
                                        }
                                        const fileName = docSaveAs.trim() || docFile?.name || "Uploaded Document";
                                        setUploadedDocs(prev => [...prev, { name: fileName, size: docFile ? `${(docFile.size / 1024).toFixed(1)} KB` : "Document", uri: docFile?.uri }]);
                                        setDocFile(null);
                                        setDocSaveAs("");
                                        Alert.alert("Success", `File "${fileName}" uploaded successfully!`);
                                    }}
                                    style={{ backgroundColor: (docFile || docSaveAs.trim()) ? colors.primary : "#94a3b8", borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Upload this file</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Card 3: Files List Section */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Files ({uploadedDocs.length})</Text>
                                {uploadedDocs.length === 0 ? (
                                    <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }]}>
                                        <Ionicons name="folder-open-outline" size={48} color={isDark ? colors.textSecondary : "#ccc"} />
                                        <Text style={{ color: colors.textSecondary, fontSize: 15, marginTop: 12, fontWeight: '500' }}>No files uploaded yet</Text>
                                    </View>
                                ) : (
                                    <View style={{ gap: 10 }}>
                                        {uploadedDocs.map((doc, idx) => (
                                            <View key={idx} style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border, padding: 14, marginBottom: 0 }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: 'rgba(33,150,243,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                                        <Ionicons name="document-text" size={24} color="#2196F3" />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }} numberOfLines={1}>{doc.name}</Text>
                                                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{doc.size}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => setUploadedDocs(prev => prev.filter((_, i) => i !== idx))}>
                                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </>
                    )}

                </ScrollView>

                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: isDark ? colors.card : "#fff" }]}>
                    <Button
                        title={loading ? "Creating..." : "Create Student Account"}
                        onPress={handleSubmit(onSubmit, onInvalid)}
                        disabled={loading}
                        variant="primary"
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Option Picker Modal */}
            <Modal visible={pickerConfig.visible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerConfig(prev => ({ ...prev, visible: false }))}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{pickerConfig.title}</Text>
                            <TouchableOpacity onPress={() => setPickerConfig(prev => ({ ...prev, visible: false }))}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={pickerConfig.options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={[styles.optionItem, { borderBottomColor: colors.border }]} onPress={() => handleSelect(item)}>
                                    <Text style={[styles.optionText, { color: colors.text }]}>{item}</Text>
                                    {pickerConfig.field && (getValues(pickerConfig.field as any) === item) && (
                                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Date Picker - DOB only */}
            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="date"
                display="spinner"
                date={getDatePickerValue()}
                maximumDate={new Date()}
                onConfirm={onDateConfirm}
                onCancel={() => setDatePickerVisible(false)}
            />

            {WebViewComponent}

            {/* DigiLocker Files Modal */}
            <Modal
                visible={digilockerModalVisible}
                animationType="slide"
                onRequestClose={() => setDigilockerModalVisible(false)}
            >
                <View style={[styles.container, { backgroundColor: isDark ? colors.background : "#f8fafc", paddingTop: insets.top }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            {digilockerHistory.length > 0 && (
                                <TouchableOpacity onPress={handleDigiLockerBack}>
                                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                                </TouchableOpacity>
                            )}
                            <View>
                                <Text style={[styles.modalTitle, { color: colors.text, fontSize: 18, fontWeight: '700' }]}>
                                    {digilockerHistory.length > 0 ? digilockerHistory[digilockerHistory.length - 1].name : "DigiLocker Files"}
                                </Text>
                                {digilockerHistory.length > 0 && (
                                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>DigiLocker Drive</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setDigilockerModalVisible(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {digilockerLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Fetching DigiLocker files...</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                            {digilockerFiles.length === 0 ? (
                                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                                    <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
                                    <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 15 }}>No files found in DigiLocker.</Text>
                                </View>
                            ) : (
                                digilockerFiles.map((file) => (
                                    <TouchableOpacity
                                        key={file.id || file.name}
                                        style={[styles.formCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 14 }]}
                                        onPress={() => handleSelectDigiLockerFile(file)}
                                    >
                                        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: file.type === "dir" ? "rgba(33,150,243,0.1)" : "rgba(124,58,237,0.1)", alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                            <Ionicons name={file.type === "dir" ? "folder" : "document-text"} size={22} color={file.type === "dir" ? "#2196F3" : "#7C3AED"} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }} numberOfLines={1}>{file.name}</Text>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{file.type === "dir" ? "Folder" : (file.mime || "Document")}</Text>
                                        </View>
                                        <Ionicons name={file.type === "dir" ? "chevron-forward" : "checkmark-circle-outline"} size={22} color={colors.primary} />
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>
            </Modal>

            {loading && (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    formCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
    },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, letterSpacing: 0.5 },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
    dropdownIcon: { position: "absolute", right: 12, top: 40 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContent: { borderRadius: 16, maxHeight: "60%", padding: 0, overflow: "hidden" },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)" },
    modalTitle: { fontSize: 18, fontWeight: "700" },
    optionItem: { padding: 18, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    optionText: { fontSize: 16, fontWeight: "500" },
    loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    photoContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 10 },
    photoCircle: { width: 120, height: 120, borderRadius: 60, overflow: "hidden", justifyContent: "center", alignItems: "center", marginBottom: 12 },
    photoImage: { width: 120, height: 120, borderRadius: 60 },
    photoPlaceholder: { alignItems: "center", justifyContent: "center", gap: 8 },
    photoHint: { fontSize: 12, fontWeight: "500" },
    removePhotoBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    removePhotoText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    phoneFieldWrap: { marginBottom: 16 },
    phoneLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
    phoneContainer: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 4 },
    phoneTextInput: { fontSize: 16, paddingVertical: 12, backgroundColor: "transparent", height: 48 },
    phoneErrorText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
    marksRow: { marginBottom: 20 },
    marksLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
    marksTypeRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
    marksChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
    marksChipText: { fontSize: 14, fontWeight: "600" },
    tabContainer: { marginBottom: 20 },
    tabScrollContent: { gap: 10, paddingHorizontal: 2 },
    tabButton: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    tabButtonText: { fontSize: 13, textTransform: "capitalize" },
});

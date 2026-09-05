import { AppHeader, Button, CustomTextInput, Toast } from "@/components";
import { useTheme } from "@/context/ThemeContext";

import {
    createMobilizerStudentAcademicDetail,
    deleteMobilizerStudentAcademicDetail,
    DropdownData,
    getDropdownDefinitions,
    getMobilizerStudentAcademicDetails,
    getMobilizerStudentProfile,
    updateMobilizerStudent,
    updateMobilizerStudentAcademicDetail,
    uploadProfileImage,
} from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exchangeAuthorizationCodeForToken, loginWithDigiLocker, useDigiLockerWebView } from "@/utils/digilockerAuth";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
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
    username: z.string().optional(),
    password: z.string().optional(),
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
    family_annual_income: z.string().optional(),
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    ifsc: z.string().optional(),
    accountholder: z.string().optional(),
    account_type: z.string().optional(),
    aadhar_number: z.string().optional(),
    income_cert_no: z.string().optional(),
    domicile_cert_no: z.string().optional(),
    whatsapp_number: z.string().optional(),
    village: z.string().optional(),
    block: z.string().optional(),
    district: z.string().optional(),
    application_type: z.string().optional(),
    scheme_name: z.string().optional(),
    domicile_state: z.string().optional(),
    category: z.string().optional(),
    stream: z.string().optional(),
    session: z.string().optional(),
    passing_year_12: z.string().optional(),
    competitive_exam_name: z.string().optional(),
    registering_as: z.string().optional(),
    board_10: z.string().optional(),
    board_12: z.string().optional(),
    stream_12: z.string().optional(),
    competitive_exam: z.string().optional(),
}).superRefine((data, ctx) => {
    const checkMarks = (val: string, type?: string) => {
        const n = parseFloat(val);
        if (isNaN(n)) return "Must be a valid number";
        if (n < 0 || n > 100) return "Must be between 0 and 100";
        if (type === "cgpa" && n > 10 && n <= 100) return null; // Value is percentage score (>10, <=100)
        if (type === "cgpa" && n > 10) return "CGPA must be between 0 and 10";
        if (type === "percentage" && n > 100) return "Percentage must be between 0 and 100";
        return null;
    };

    const v10 = (data.marks_10_value || "").trim();
    if (v10) {
        const err = checkMarks(v10, data.marks_10_type);
        if (err) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `10th ${err}`, path: ["marks_10_value"] });
    }
    const v12 = (data.marks_12_value || "").trim();
    if (v12) {
        const err = checkMarks(v12, data.marks_12_type);
        if (err) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `12th ${err}`, path: ["marks_12_value"] });
    }
    if (data.academic_level !== "School (Class 1-12)") {
        const vGrad = (data.graduation_value || "").trim();
        if (vGrad) {
            const err = checkMarks(vGrad, data.graduation_type);
            if (err) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Graduation ${err}`, path: ["graduation_value"] });
        }
    }
});

type FormValues = z.infer<typeof formSchema>;

const MARKS_TYPE_OPTIONS = [{ label: "CGPA", value: "cgpa" }, { label: "Percentage", value: "percentage" }];
const ACCOUNT_TYPE_OPTIONS = ["Savings", "Current", "Salary"];

const EDIT_TABS = [
    { id: "personal", label: "Personal", icon: "person-outline", color: "#4CAF50" },
    { id: "academic", label: "Academic", icon: "school-outline", color: "#2196F3" },
    { id: "financial", label: "Financial", icon: "cash-outline", color: "#10B981" },
    { id: "documents", label: "Documents", icon: "document-text-outline", color: "#FF9800" },
];

const TAB_FIELDS: Record<string, string[]> = {
    personal: [
        "username",
        "password",
        "firstname",
        "lastname",
        "email",
        "phone1",
        "whatsapp_number",
        "village",
        "block",
        "district",
        "application_type",
        "scheme_name",
        "domicile_state",
        "family_annual_income",
        "category",
        "gender",
        "date_of_birth",
        "religion",
        "caste",
        "father_name",
        "mother_name",
        "address",
        "city",
        "state",
        "country",
        "registering_as",
    ],
    academic: [
        "academic_level",
        "category",
        "stream",
        "institution",
        "graduation_type",
        "graduation_value",
        "year",
        "session",
        "university",
        "marks_10_type",
        "marks_10_value",
        "marks_12_type",
        "marks_12_value",
        "board_10",
        "board_12",
        "stream_12",
        "passing_year_12",
        "competitive_exam",
        "competitive_exam_name",
    ],
    financial: [
        "bank_name",
        "accountholder",
        "account_number",
        "ifsc",
        "account_type",
    ],
    documents: [
        "aadhar_number",
        "income_cert_no",
        "domicile_cert_no",
    ],
};

export default function MobilizerEditStudentScreen() {
    const { isDark, colors } = useTheme();
    const { studentId: paramStudentId } = useLocalSearchParams();
    const studentId = Number(paramStudentId);
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
    const SPECIAL_CATEGORY_OPTIONS = getOptionsByShortname('category').map((o: any) => o.label);
    const REGISTERING_AS_OPTIONS = getOptionsByShortname('Registering_as').map((o: any) => o.label);
    const ANNUAL_INCOME_OPTIONS = getOptionsByShortname('family_income').map((o: any) => o.label);
    const STATE_OPTIONS = getOptionsByShortname('state').map((o: any) => o.label);
    const DISTRICT_OPTIONS = getOptionsByShortname('district').map((o: any) => o.label);

    const ACADEMIC_LEVEL_OPTIONS = (getOptionsByShortname('course_name_1').length > 0
        ? getOptionsByShortname('course_name_1')
        : getOptionsByShortname('academic_qualifications')).map((o: any) => o.label);

    const CATEGORY_OPTIONS = (getOptionsByShortname('course_category_1').length > 0
        ? getOptionsByShortname('course_category_1')
        : getOptionsByShortname('category')).map((o: any) => o.label);

    const STREAM_OPTIONS = (getOptionsByShortname('course_stream_1').length > 0
        ? getOptionsByShortname('course_stream_1')
        : getOptionsByShortname('stream_in_12th')).map((o: any) => o.label);

    const YEAR_OPTIONS = getOptionsByShortname('year_of_course').map((o: any) => o.label);
    const SESSION_OPTIONS = getOptionsByShortname('session').map((o: any) => o.label);
    const SCHEME_OPTIONS = getOptionsByShortname('schemename').map((o: any) => o.label);
    const BOARD_10TH_OPTIONS = getOptionsByShortname('passing_10th').map((o: any) => o.label);
    const BOARD_12TH_OPTIONS = getOptionsByShortname('12th_board').map((o: any) => o.label);
    const STREAM_12TH_OPTIONS = getOptionsByShortname('stream_in_12th').map((o: any) => o.label);
    const PASSING_YEAR_12TH_OPTIONS = getOptionsByShortname('12th_passing_year').map((o: any) => o.label);
    const APPLICATION_TYPE_OPTIONS = getOptionsByShortname('application_type').map((o: any) => o.label);
    const COMPETITIVE_EXAM_OPTIONS = getOptionsByShortname('competitive_exam').map((o: any) => o.label);

    const isSchoolCourse = (course: string) => {
        if (!course) return false;
        const schoolLevels = ["10th", "11th", "12th"];
        return schoolLevels.some(level => course.toLowerCase().includes(level.toLowerCase()));
    };

    const is11th12thCourse = (course: string) => {
        if (!course) return false;
        return course.toLowerCase().includes("11th") || course.toLowerCase().includes("12th");
    };

    const [loading, setLoading] = useState(false);
    const [studentName, setStudentName] = useState("");
    const [studentIdCode, setStudentIdCode] = useState("");

    // Image & Document state
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<{ uri: string; name: string; type: string; mimeType?: string } | null>(null);
    const [docFile, setDocFile] = useState<{ uri: string; name: string; mimeType: string; size: number } | null>(null);
    const [docSaveAs, setDocSaveAs] = useState("");
    const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size?: string; uri?: string }[]>([]);

    // Mobilizer Student Academic Qualifications state
    interface AcademicRecordItem {
        id: string;
        course_name: string;
        category?: string;
        institution?: string;
        major?: string;
        percentage?: string;
        cgpa?: string;
        academic_year?: string;
        graduation_year?: string;
    }

    const [academicRecords, setAcademicRecords] = useState<AcademicRecordItem[]>([]);
    const [academicLoading, setAcademicLoading] = useState<boolean>(false);
    const [acadModalVisible, setAcadModalVisible] = useState<boolean>(false);
    const [acadForm, setAcadForm] = useState({
        id: "",
        course_name: "",
        category: "",
        institution: "",
        major: "",
        gradeType: "cgpa" as "cgpa" | "percentage",
        percentage: "",
        cgpa: "",
        academic_year: "",
        graduation_year: "",
    });

    const [acadPickerConfig, setAcadPickerConfig] = useState<{
        visible: boolean;
        title: string;
        options: string[];
        field: "course_name" | "category" | "major" | "academic_year" | "graduation_year" | null;
    }>({
        visible: false,
        title: "",
        options: [],
        field: null,
    });

    const openAcadPicker = (field: "course_name" | "category" | "major" | "academic_year" | "graduation_year", title: string, options: string[]) => {
        setAcadPickerConfig({ visible: true, title, options, field });
    };

    const handleAcadSelect = (value: string) => {
        if (acadPickerConfig.field) {
            setAcadForm((prev) => ({ ...prev, [acadPickerConfig.field!]: value }));
        }
        setAcadPickerConfig({ visible: false, title: "", options: [], field: null });
    };

    const fetchStudentAcademicDetails = async (numStudentId: number) => {
        try {
            setAcademicLoading(true);
            await fetchStudentData();
        } catch (e) {
            console.log("Failed to fetch student academic details:", e);
        } finally {
            setAcademicLoading(false);
        }
    };

    const handleOpenAddAcademic = () => {
        setAcadPickerConfig({ visible: false, title: "", options: [], field: null });
        setAcadForm({
            id: "",
            course_name: "",
            category: "",
            institution: "",
            major: "",
            gradeType: "cgpa",
            percentage: "",
            cgpa: "",
            academic_year: "",
            graduation_year: "",
        });
        setAcadModalVisible(true);
    };

    const handleOpenEditAcademic = (record: AcademicRecordItem) => {
        setAcadPickerConfig({ visible: false, title: "", options: [], field: null });
        const hasPct = !!(record.percentage && record.percentage.trim());
        const hasCgpa = !!(record.cgpa && record.cgpa.trim());
        const inferredGradeType: "cgpa" | "percentage" = hasPct && !hasCgpa ? "percentage" : "cgpa";
        setAcadForm({
            id: record.id,
            course_name: record.course_name || "",
            category: record.category || "",
            institution: record.institution || "",
            major: record.major || "",
            gradeType: inferredGradeType,
            percentage: record.percentage || "",
            cgpa: record.cgpa || "",
            academic_year: record.academic_year || "",
            graduation_year: record.graduation_year || "",
        });
        setAcadModalVisible(true);
    };

    const handleSaveAcademicRecord = async () => {
        if (!acadForm.course_name.trim()) {
            Alert.alert("Error", "Course Name is required.");
            return;
        }

        // Validate CGPA vs Percentage bounds and requirement
        if (acadForm.gradeType === "cgpa") {
            if (!acadForm.cgpa.trim()) {
                Alert.alert("Error", "CGPA is required.");
                return;
            }
            const num = parseFloat(acadForm.cgpa.trim());
            if (isNaN(num) || num < 0 || num > 10) {
                Alert.alert("Invalid CGPA", "CGPA must be between 0 and 10. If you are entering percentage (e.g. 88%), please switch to Percentage (%).");
                return;
            }
        }
        if (acadForm.gradeType === "percentage") {
            if (!acadForm.percentage.trim()) {
                Alert.alert("Error", "Percentage is required.");
                return;
            }
            const num = parseFloat(acadForm.percentage.trim());
            if (isNaN(num) || num < 0 || num > 100) {
                Alert.alert("Invalid Percentage", "Percentage must be between 0 and 100.");
                return;
            }
        }

        try {
            const authDataStr = await AsyncStorage.getItem("authData");
            if (!authDataStr) return;
            const authData = JSON.parse(authDataStr);
            const token = authData.token;
            const numStudentId = Number(studentId);

            const isCgpa = acadForm.gradeType === "cgpa";
            const params = {
                course_name: acadForm.course_name.trim(),
                category: acadForm.category.trim() || undefined,
                institution: acadForm.institution.trim() || undefined,
                major: acadForm.major.trim() || undefined,
                percentage: isCgpa ? "" : (acadForm.percentage.trim() || undefined),
                cgpa: isCgpa ? (acadForm.cgpa.trim() || undefined) : "",
                academic_year: acadForm.academic_year.trim() || undefined,
                graduation_year: acadForm.graduation_year.trim() || undefined,
            };

            let res;
            if (acadForm.id) {
                res = await updateMobilizerStudentAcademicDetail(token, numStudentId, Number(acadForm.id), params);
            } else {
                res = await createMobilizerStudentAcademicDetail(token, numStudentId, params);
            }

            if (res.success) {
                setToast({ visible: true, message: res.message || "Academic detail saved successfully!", type: "success" });
                setAcadModalVisible(false);
                fetchStudentAcademicDetails(numStudentId);
            } else {
                Alert.alert("Error", res.error || res.message || "Failed to save academic detail");
            }
        } catch (err: any) {
            Alert.alert("Error", err.message || "An error occurred");
        }
    };

    const handleDeleteAcademicRecord = (id: string) => {
        Alert.alert("Delete Qualification", "Are you sure you want to delete this qualification?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const authDataStr = await AsyncStorage.getItem("authData");
                        if (!authDataStr) return;
                        const authData = JSON.parse(authDataStr);
                        const numStudentId = Number(studentId);
                        const res = await deleteMobilizerStudentAcademicDetail(authData.token, numStudentId, Number(id));
                        if (res.success) {
                            setToast({ visible: true, message: "Qualification deleted!", type: "success" });
                            fetchStudentAcademicDetails(numStudentId);
                        } else {
                            Alert.alert("Error", res.error || "Failed to delete qualification");
                        }
                    } catch (e: any) {
                        Alert.alert("Error", e.message || "Failed to delete qualification");
                    }
                }
            }
        ]);
    };

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
    const [pickerConfig, setPickerConfig] = useState<{ visible: boolean; title: string; options: string[]; field: string | null }>({
        visible: false,
        title: "",
        options: [],
        field: null,
    });
    const [extraCustomFields, setExtraCustomFields] = useState<Record<string, { label: string; value: string; options?: string[] }>>({});

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [acadEndDatePickerVisible, setAcadEndDatePickerVisible] = useState(false);
    const [acadPassingDatePickerVisible, setAcadPassingDatePickerVisible] = useState(false);

    const getAcadPassingDatePickerDate = () => {
        if (acadForm.academic_year && /^\d{4}$/.test(acadForm.academic_year)) {
            return new Date(parseInt(acadForm.academic_year, 10), 0, 1);
        }
        return new Date();
    };

    const getAcadEndDatePickerDate = () => {
        if (acadForm.graduation_year) {
            const parsed = Date.parse(acadForm.graduation_year);
            if (!isNaN(parsed)) {
                return new Date(parsed);
            }
        }
        return new Date();
    };
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
            firstname: "",
            lastname: "",
            email: "",
            phone1: "",
            city: "",
            state: "",
            country: "IN",
            address: "",
            institution: "",
            gender: "",
            religion: "",
            caste: "",
            date_of_birth: "",
            academic_level: "",
            year: "",
            university: "",
            marks_10_type: "percentage",
            marks_10_value: "",
            marks_12_type: "percentage",
            marks_12_value: "",
            graduation_type: "percentage",
            graduation_value: "",
            father_name: "",
            mother_name: "",
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

    const fetchStudentData = useCallback(async () => {
        if (!studentId) return;
        try {
            setLoading(true);
            const authDataStr = await AsyncStorage.getItem("authData");
            if (!authDataStr) return;
            const authData = JSON.parse(authDataStr);
            if (!authData.token) return;

            // 1. Fetch dropdown definitions
            let currentDropdowns: DropdownData | null = null;
            try {
                const dropdownRes = await getDropdownDefinitions(authData.token);
                if (dropdownRes.success && dropdownRes.data) {
                    currentDropdowns = dropdownRes.data;
                    setDropdownData(dropdownRes.data);
                }
            } catch (e) {
                console.error("Failed to fetch dropdown definitions:", e);
            }

            // 2. Fetch student profile
            const response = await getMobilizerStudentProfile(authData.token, studentId);
            console.log("=== MOBILIZER GET STUDENT PROFILE RESPONSE ===", JSON.stringify(response, null, 2));
            if (response.success && response.data) {
                const d = response.data.student || response.data;
                setStudentName(d.fullname || `${d.firstname} ${d.lastname}` || d.username || "Edit Profile");
                let cf: Record<string, string> = {};
                try {
                    if (typeof d.custom_fields === 'string') cf = JSON.parse(d.custom_fields);
                    else if (typeof d.custom_fields === 'object') cf = d.custom_fields;
                } catch (e) { }

                let finInfo: any = {};
                try {
                    if (typeof d.financial_info === 'string' && d.financial_info.trim() !== '') {
                        finInfo = JSON.parse(d.financial_info);
                    } else if (typeof d.financial_info === 'object' && d.financial_info !== null) {
                        finInfo = d.financial_info;
                    }
                } catch (e) { }

                const rawIdNum = d.idnumber || cf.idnumber || cf.student_id || cf.application_no || cf.reg_no;
                if (rawIdNum && String(rawIdNum).trim() !== "") {
                    setStudentIdCode(String(rawIdNum).trim().toUpperCase());
                } else {
                    const rawId = d.id || studentId;
                    if (rawId) {
                        const s = String(rawId).trim().toUpperCase();
                        setStudentIdCode(s.startsWith("YDFADM") ? s : `YDFADM${s}`);
                    }
                }

                const cleanVal = (val: string | undefined | null) => {
                    if (!val) return "";
                    const lower = String(val).toLowerCase().trim();
                    if (lower === "select" || lower === "choose..." || lower === "select any one" || lower === "n/a" || lower === "na") return "";
                    return String(val).trim();
                };

                setValue("username", cleanVal(d.username));
                setValue("password", cleanVal(d.password || d.raw_password || cf.password));
                setValue("firstname", cleanVal(d.firstname));
                setValue("lastname", cleanVal(d.lastname));
                setValue("email", cleanVal(d.email));

                let phoneStr = cleanVal(d.phone1 || d.phone2 || cf.phone_number || cf.mobile);
                if (phoneStr.startsWith("91") && phoneStr.length >= 12) phoneStr = phoneStr.substring(2);
                else if (phoneStr.startsWith("+91")) phoneStr = phoneStr.substring(3);
                setValue("phone1", phoneStr);

                setValue("city", cleanVal(cf.district || cf.District || cf.College_District || cf.domicile_district || d.city));
                setValue("district", cleanVal(cf.district || cf.District || cf.College_District || cf.domicile_district || d.city));
                setValue("state", cleanVal(cf.state || cf.State || cf.domicile_state));
                setValue("country", cleanVal(d.country) || "IN");
                setValue("address", cleanVal(d.address || cf.address || cf.Village));
                setValue("village", cleanVal(cf.village || cf.Village || d.address));
                setValue("block", cleanVal(cf.block || cf.Block));
                setValue("institution", cleanVal(d.institution || cf.college_name));

                setValue("gender", cleanVal(cf.gender || cf.Gender));
                setValue("religion", cleanVal(cf.religion || cf.Religion));
                setValue("caste", cleanVal(cf.caste || cf.Caste));

                let dobStr = cleanVal(cf.date_of_birth || cf.DOB);
                if (dobStr && !isNaN(Number(dobStr)) && dobStr.length >= 8) {
                    const dObj = new Date(Number(dobStr) * 1000);
                    if (!isNaN(dObj.getTime())) {
                        dobStr = dObj.toISOString().split("T")[0];
                    }
                }
                setValue("date_of_birth", dobStr);

                setValue("academic_level", cleanVal(cf.course || cf.academic_level || d.academic_level || cf.category));
                setValue("year", cleanVal(cf.year_of_course || cf.college_current_year));
                setValue("university", cleanVal(cf.university));

                const val10 = cleanVal(cf["10th"] || cf.percentage_10th || cf.marks_10_value || cf.percentage_10);
                const num10 = parseFloat(val10 || "0");
                const type10 = cleanVal(cf.marks_10_type) || (num10 > 10 ? "percentage" : "cgpa");
                setValue("marks_10_type", type10);
                setValue("marks_10_value", val10);

                const val12 = cleanVal(cf['12th_marks'] || cf.marks_12_value || cf.percentage_12);
                const num12 = parseFloat(val12 || "0");
                const type12 = cleanVal(cf.marks_12_type) || (num12 > 10 ? "percentage" : "cgpa");
                setValue("marks_12_type", type12);
                setValue("marks_12_value", val12);

                const valGrad = cleanVal(cf.grade_in_cgpa_1 || cf.grade_in_cgpa_2 || cf.marks_graduation_value);
                const numGrad = parseFloat(valGrad || "0");
                const typeGrad = cleanVal(cf.marks_graduation_type) || (numGrad > 10 ? "percentage" : "cgpa");
                setValue("graduation_type", typeGrad);
                setValue("graduation_value", valGrad);

                setValue("father_name", cleanVal(cf.father_name || cf.father));
                setValue("mother_name", cleanVal(cf.mother_name || cf.mother));
                setValue("family_annual_income", cleanVal(cf.Family_income || cf.family_annual_income || cf.family_income));

                setValue("bank_name", cleanVal(finInfo.bank_name || cf.bank_name || cf.bankName));
                setValue("account_number", cleanVal(finInfo.account_number || finInfo.account_number_masked || cf.account_number || cf.bank_account_no || cf.bankAccountNo));
                setValue("ifsc", cleanVal(finInfo.ifsc || cf.ifsc || cf.ifsc_code || cf.ifscCode));
                setValue("accountholder", cleanVal(finInfo.accountholder || cf.accountholder || cf.account_holder_name || cf.accountHolderName));
                let rawAccType = cleanVal(
                    finInfo.account_type ||
                    finInfo.accountType ||
                    cf.account_type ||
                    cf.accountType ||
                    cf.accounttype ||
                    cf.type_of_account
                );
                if (rawAccType) {
                    const lower = rawAccType.toLowerCase();
                    const matched = ACCOUNT_TYPE_OPTIONS.find(opt => {
                        const optLower = opt.toLowerCase();
                        return lower === optLower || lower.startsWith(optLower) || optLower.startsWith(lower);
                    });
                    if (matched) rawAccType = matched;
                }
                setValue("account_type", rawAccType);

                setValue("aadhar_number", cleanVal(cf.aadhar_card || cf.idnumber || cf.aachar_card_number));
                setValue("income_cert_no", cleanVal(cf.income_certificate || cf.income_cert_no));
                setValue("domicile_cert_no", cleanVal(cf.domicile_certificate || cf.domicile_cert_no));

                // Set Academic Records from d.academic_details array or fallback to custom_fields
                let acadList: AcademicRecordItem[] = [];
                if (Array.isArray(d.academic_details) && d.academic_details.length > 0) {
                    acadList = d.academic_details.map((item: any) => ({
                        id: String(item.id),
                        course_name: item.course_name || "",
                        category: item.category || "",
                        institution: item.institution || "",
                        major: item.major || "",
                        percentage: item.percentage !== null && item.percentage !== undefined ? String(item.percentage) : "",
                        cgpa: item.cgpa || "",
                        academic_year: item.academic_year || "",
                        graduation_year: item.graduation_year ? String(item.graduation_year) : "",
                    }));
                } else {
                    [1, 2, 3, 4].forEach((idx) => {
                        const cName = cf[`course_name_${idx}`];
                        if (cName && cName !== "Other" && cName !== "Select" && cName.trim() !== "") {
                            acadList.push({
                                id: `cf_${idx}`,
                                course_name: cName,
                                category: cf[`course_category_${idx}`] || "",
                                institution: cf[`college_university_name_${idx}`] || "",
                                major: cf[`course_stream_${idx}`] || "",
                                cgpa: cf[`grade_in_cgpa_${idx}`] || "",
                                percentage: cf[`grade_in_percentage_${idx}`] || "",
                                academic_year: cf[`academic_start_year_${idx}`] || "",
                                graduation_year: cf[`expected_academic_end_date_${idx}`] || "",
                            });
                        }
                    });
                }
                setAcademicRecords(acadList);

                if (d.picture && !d.picture.includes('gravatar.com')) {
                    setProfileImageUri(d.picture);
                }
            }
        } catch (error) {
            console.error("Failed to fetch student profile:", error);
        } finally {
            setLoading(false);
        }
    }, [studentId, setValue]);

    React.useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);

    const openPicker = (field: string, title: string, options: string[]) => {
        setPickerConfig({ visible: true, title, options, field });
    };

    const handleSelect = (value: string) => {
        if (pickerConfig.field) {
            if (pickerConfig.field.startsWith("acad_")) {
                const key = pickerConfig.field.replace("acad_", "");
                setAcadForm((prev) => ({ ...prev, [key]: value }));
            } else if (pickerConfig.field in extraCustomFields) {
                setExtraCustomFields((prev) => ({
                    ...prev,
                    [pickerConfig.field!]: { ...prev[pickerConfig.field!], value },
                }));
            } else {
                setValue(pickerConfig.field as keyof FormValues, value, { shouldValidate: true });
            }
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
            if (data.account_type) {
                const accVal = data.account_type.trim();
                customfields.push({ shortname: "account_type", value: accVal });
                customfields.push({ shortname: "accounttype", value: accVal });
                customfields.push({ shortname: "type_of_account", value: accVal });
            }

            if (data.aadhar_number) customfields.push({ shortname: "aadhar_card", value: data.aadhar_number.trim() });
            if (data.income_cert_no) customfields.push({ shortname: "income_certificate", value: data.income_cert_no.trim() });
            if (data.domicile_cert_no) customfields.push({ shortname: "domicile_certificate", value: data.domicile_cert_no.trim() });

            Object.keys(extraCustomFields).forEach((shortname) => {
                const val = extraCustomFields[shortname].value;
                if (val && val.trim() !== "") {
                    customfields.push({ shortname, value: val.trim() });
                }
            });

            const payload: any = {
                student_id: studentId,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
            };
            if (data.username) payload.username = data.username;
            if (data.password && data.password.trim() !== "") payload.password = data.password.trim();
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

            console.log("=== MOBILIZER EDIT STUDENT PAYLOAD ===", JSON.stringify(payload, null, 2));

            const response = await updateMobilizerStudent(token, payload);

            if (response.success) {
                setToast({ visible: true, message: "Student updated successfully!", type: "success" });
                setTimeout(() => router.back(), 1500);
            } else {
                setToast({ visible: true, message: response.message || "Failed to update student", type: "error" });
            }
        } catch (error: any) {
            setToast({ visible: true, message: error.message || "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCurrentTab = async () => {
        try {
            const data = getValues();
            const activeTabFields = TAB_FIELDS[activeTab] || [];

            // Safe parse against schema
            const result = formSchema.safeParse(data);
            if (!result.success) {
                const issues = result.error.issues;
                // Filter issues strictly to fields belonging to the active tab
                const tabIssues = issues.filter((issue) => {
                    const fieldName = issue.path[0] as string;
                    return activeTabFields.includes(fieldName);
                });

                if (tabIssues.length > 0) {
                    const firstIssue = tabIssues[0];
                    setToast({ visible: true, message: firstIssue.message, type: "error" });
                    return;
                }
            }

            // No validation errors on the current active tab -> execute submit
            await onSubmit(data);
        } catch (err: any) {
            console.error("Save tab error:", err);
            setToast({ visible: true, message: err.message || "Failed to save tab data", type: "error" });
        }
    };

    const onInvalid = (errors: any) => {
        console.log("Edit Student Validation Errors:", errors);
        const firstErrorKey = Object.keys(errors)[0];
        const firstError = errors[firstErrorKey];
        const msg = firstError?.message || "Please fill all required fields correctly.";
        setToast({ visible: true, message: msg, type: "error" });

        if (["username", "firstname", "lastname", "email", "phone1", "city", "state", "address", "father_name", "mother_name", "date_of_birth", "gender", "religion", "caste", "family_annual_income"].includes(firstErrorKey)) {
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
            <AppHeader title={`Edit ${studentName} Profile`} onBack={() => router.back()} />
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
                            {EDIT_TABS.map((tab) => {
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
                                <CustomTextInput icon="id-card-outline" label="Student ID" value={studentIdCode || (studentId ? (String(studentId).startsWith("YDFADM") ? String(studentId) : `YDFADM${studentId}`) : "")} editable={false} onChangeText={() => { }} inputStyle={{ opacity: 1, fontWeight: "700" }} />
                                <Controller control={control} name="username" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput
                                        icon="at-outline"
                                        label="Username *"
                                        placeholder="Unique username"
                                        value={value || ""}
                                        onChangeText={(text) => onChange(text.toLowerCase().trim())}
                                        onBlur={onBlur}
                                        editable={true}
                                        autoCapitalize="none"
                                        error={errors.username?.message}
                                    />
                                )} />
                                <Controller control={control} name="password" render={({ field: { onChange, value, onBlur } }) => (
                                    <CustomTextInput icon="lock-closed-outline" label="Password" placeholder="Enter password" value={value || ""} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.password?.message} />
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
                                    <TouchableOpacity onPress={() => openPicker("category", "Special Category", SPECIAL_CATEGORY_OPTIONS)}>
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
                            {/* Card 0: Academic Qualifications List (CRUD) */}
                            <View style={[styles.formCard, { backgroundColor: isDark ? colors.card : "rgba(255,255,255,0.9)", borderColor: colors.border }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <View>
                                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>Academic Qualifications</Text>
                                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>Manage student educational records</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleOpenAddAcademic}
                                        style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                                    >
                                        <Ionicons name="add" size={16} color="#fff" />
                                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Add</Text>
                                    </TouchableOpacity>
                                </View>

                                {academicLoading ? (
                                    <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
                                ) : academicRecords.length === 0 ? (
                                    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                                        <Ionicons name="school-outline" size={36} color={colors.textSecondary} />
                                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>No academic records added yet.</Text>
                                    </View>
                                ) : (
                                    <View style={{ gap: 10 }}>
                                        {academicRecords.map((item) => (
                                            <View key={item.id} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{item.course_name}</Text>
                                                        {!!item.institution && <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{item.institution}</Text>}
                                                        {!!item.major && <Text style={{ fontSize: 12, color: colors.primary, marginTop: 2 }}>Major: {item.major}</Text>}
                                                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                                                            {!!item.academic_year && <Text style={{ fontSize: 11, color: colors.textSecondary }}>Year: {item.academic_year}</Text>}
                                                            {!!item.cgpa && <Text style={{ fontSize: 11, color: colors.textSecondary }}>CGPA: {item.cgpa}</Text>}
                                                            {!!item.percentage && <Text style={{ fontSize: 11, color: colors.textSecondary }}>Marks: {item.percentage}%</Text>}
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                                        <TouchableOpacity onPress={() => handleOpenEditAcademic(item)} style={{ padding: 4 }}>
                                                            <Ionicons name="create-outline" size={18} color={colors.primary} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDeleteAcademicRecord(item.id)} style={{ padding: 4 }}>
                                                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
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
                                <CustomTextInput icon="person-outline" label="Author" value={studentName || "Student"} onChangeText={() => { }} editable={false} />

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
                        title={loading ? "Saving..." : `Save ${EDIT_TABS.find(t => t.id === activeTab)?.label || "Changes"} Details`}
                        onPress={handleSaveCurrentTab}
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

            {/* ACADEMIC RECORD MODAL */}
            <Modal visible={acadModalVisible} animationType="slide" transparent onRequestClose={() => setAcadModalVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 }}>
                    <View style={{ backgroundColor: isDark ? colors.card : "#fff", borderRadius: 16, padding: 20, maxHeight: "90%", minHeight: 320 }}>
                        {acadPickerConfig.visible ? (
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{acadPickerConfig.title}</Text>
                                    <TouchableOpacity onPress={() => setAcadPickerConfig(prev => ({ ...prev, visible: false }))}>
                                        <Ionicons name="close" size={24} color={colors.text} />
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={acadPickerConfig.options}
                                    keyExtractor={(item, index) => `${item}_${index}`}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                            onPress={() => handleAcadSelect(item)}
                                        >
                                            <Text style={{ fontSize: 16, color: colors.text }}>{item}</Text>
                                            {acadPickerConfig.field && acadForm[acadPickerConfig.field] === item && (
                                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        ) : (
                            <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{acadForm.id ? "Edit Qualification" : "Add Qualification"}</Text>
                                    <TouchableOpacity onPress={() => setAcadModalVisible(false)}>
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* Course / Qualification Name Dropdown */}
                                    <TouchableOpacity onPress={() => openAcadPicker("course_name", "Select Course Name *", ACADEMIC_LEVEL_OPTIONS)}>
                                        <View pointerEvents="none">
                                            <CustomTextInput
                                                icon="book-outline"
                                                label="Course Name *"
                                                placeholder="Select your course"
                                                value={acadForm.course_name || ""}
                                                editable={false}
                                                onChangeText={() => { }}
                                                inputStyle={{ opacity: 1 }}
                                                rightIcon="chevron-down"
                                            />
                                        </View>
                                    </TouchableOpacity>

                                    {/* Category Dropdown (College only) */}
                                    {!isSchoolCourse(acadForm.course_name) && (
                                        <TouchableOpacity onPress={() => openAcadPicker("category", "Select Category *", CATEGORY_OPTIONS)}>
                                            <View pointerEvents="none">
                                                <CustomTextInput
                                                    icon="grid-outline"
                                                    label="Category *"
                                                    placeholder="Select category (e.g. Engineering)"
                                                    value={acadForm.category || ""}
                                                    editable={false}
                                                    onChangeText={() => { }}
                                                    inputStyle={{ opacity: 1 }}
                                                    rightIcon="chevron-down"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {/* Major / Stream Dropdown (College only) */}
                                    {!isSchoolCourse(acadForm.course_name) && (
                                        <TouchableOpacity onPress={() => openAcadPicker("major", "Select Major / Stream *", STREAM_OPTIONS)}>
                                            <View pointerEvents="none">
                                                <CustomTextInput
                                                    icon="ribbon-outline"
                                                    label="Major / Stream *"
                                                    placeholder="Select your specialization"
                                                    value={acadForm.major || ""}
                                                    editable={false}
                                                    onChangeText={() => { }}
                                                    inputStyle={{ opacity: 1 }}
                                                    rightIcon="chevron-down"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {/* Academic Year / Passing Year */}
                                    {isSchoolCourse(acadForm.course_name) ? (
                                        <TouchableOpacity onPress={() => setAcadPassingDatePickerVisible(true)}>
                                            <View pointerEvents="none">
                                                <CustomTextInput
                                                    icon="calendar-outline"
                                                    label="Passing Year *"
                                                    placeholder="Select passing year"
                                                    value={acadForm.academic_year || ""}
                                                    editable={false}
                                                    onChangeText={() => { }}
                                                    inputStyle={{ opacity: 1 }}
                                                    rightIcon="chevron-down"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={() => openAcadPicker("academic_year", "Academic Year (Start Year) *", YEAR_OPTIONS)}>
                                            <View pointerEvents="none">
                                                <CustomTextInput
                                                    icon="calendar-outline"
                                                    label="Academic Year (Start Year) *"
                                                    placeholder="Select year"
                                                    value={acadForm.academic_year || ""}
                                                    editable={false}
                                                    onChangeText={() => { }}
                                                    inputStyle={{ opacity: 1 }}
                                                    rightIcon="chevron-down"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {/* Institution Details (College or 11th/12th) */}
                                    {(!isSchoolCourse(acadForm.course_name) || is11th12thCourse(acadForm.course_name)) && (
                                        <CustomTextInput
                                            icon="business-outline"
                                            label={isSchoolCourse(acadForm.course_name) ? "School Name *" : "College / University Name *"}
                                            placeholder={isSchoolCourse(acadForm.course_name) ? "Enter school name" : "e.g. IIT Delhi, Delhi University"}
                                            value={acadForm.institution || ""}
                                            onChangeText={(t) => setAcadForm((p) => ({ ...p, institution: t }))}
                                        />
                                    )}

                                    {/* End Year / Session (College only) */}
                                    {!isSchoolCourse(acadForm.course_name) && (
                                        <TouchableOpacity onPress={() => setAcadEndDatePickerVisible(true)}>
                                            <View pointerEvents="none">
                                                <CustomTextInput
                                                    icon="flag-outline"
                                                    label="Expected Academic End Date"
                                                    placeholder="Select end date / session"
                                                    value={acadForm.graduation_year || ""}
                                                    editable={false}
                                                    onChangeText={() => { }}
                                                    inputStyle={{ opacity: 1 }}
                                                    rightIcon="chevron-down"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {/* Performance Grade Type Toggle (CGPA vs Percentage) */}
                                    <View style={{ marginTop: 8, marginBottom: 12 }}>
                                        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>Grade Type</Text>
                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => setAcadForm((p) => ({ ...p, gradeType: "cgpa", percentage: "" }))}
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 10,
                                                    borderRadius: 10,
                                                    alignItems: "center",
                                                    borderWidth: 1.5,
                                                    borderColor: acadForm.gradeType === "cgpa" ? colors.primary : colors.border,
                                                    backgroundColor: acadForm.gradeType === "cgpa" ? (colors.primary + "15") : (isDark ? "rgba(255,255,255,0.05)" : "#f8fafc")
                                                }}
                                            >
                                                <Text style={{ fontWeight: "700", color: acadForm.gradeType === "cgpa" ? colors.primary : colors.text }}>CGPA</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => setAcadForm((p) => ({ ...p, gradeType: "percentage", cgpa: "" }))}
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 10,
                                                    borderRadius: 10,
                                                    alignItems: "center",
                                                    borderWidth: 1.5,
                                                    borderColor: acadForm.gradeType === "percentage" ? colors.primary : colors.border,
                                                    backgroundColor: acadForm.gradeType === "percentage" ? (colors.primary + "15") : (isDark ? "rgba(255,255,255,0.05)" : "#f8fafc")
                                                }}
                                            >
                                                <Text style={{ fontWeight: "700", color: acadForm.gradeType === "percentage" ? colors.primary : colors.text }}>Percentage (%)</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {acadForm.gradeType === "cgpa" ? (
                                        <CustomTextInput
                                            label="CGPA (0–10) *"
                                            placeholder="e.g. 8.5"
                                            keyboardType="decimal-pad"
                                            value={acadForm.cgpa || ""}
                                            onChangeText={(t) => {
                                                const num = parseFloat(t);
                                                if (!isNaN(num) && num > 10 && num <= 100) {
                                                    setAcadForm((p) => ({ ...p, gradeType: "percentage", percentage: t, cgpa: "" }));
                                                } else {
                                                    setAcadForm((p) => ({ ...p, cgpa: t }));
                                                }
                                            }}
                                        />
                                    ) : (
                                        <CustomTextInput
                                            label="Percentage (%) *"
                                            placeholder="e.g. 85.5"
                                            keyboardType="decimal-pad"
                                            value={acadForm.percentage || ""}
                                            onChangeText={(t) => setAcadForm((p) => ({ ...p, percentage: t }))}
                                        />
                                    )}

                                    <TouchableOpacity
                                        onPress={handleSaveAcademicRecord}
                                        style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 12 }}
                                    >
                                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Save Qualification</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </>
                        )}
                        {/* Date Picker - Passing Year (School) */}
                        <DateTimePickerModal
                            isVisible={acadPassingDatePickerVisible}
                            mode="date"
                            display="spinner"
                            date={getAcadPassingDatePickerDate()}
                            minimumDate={new Date(1970, 0, 1)}
                            maximumDate={new Date(new Date().getFullYear() + 2, 11, 31)}
                            onConfirm={(date) => {
                                setAcadForm((p) => ({ ...p, academic_year: String(date.getFullYear()) }));
                                setAcadPassingDatePickerVisible(false);
                            }}
                            onCancel={() => setAcadPassingDatePickerVisible(false)}
                        />
                        {/* Date Picker - Expected Academic End Date */}
                        <DateTimePickerModal
                            isVisible={acadEndDatePickerVisible}
                            mode="date"
                            display="spinner"
                            date={getAcadEndDatePickerDate()}
                            minimumDate={new Date(1990, 0, 1)}
                            maximumDate={new Date(2040, 11, 31)}
                            onConfirm={(date) => {
                                setAcadForm((p) => ({ ...p, graduation_year: date.toISOString().split('T')[0] }));
                                setAcadEndDatePickerVisible(false);
                            }}
                            onCancel={() => setAcadEndDatePickerVisible(false)}
                        />
                    </View>
                </KeyboardAvoidingView>
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

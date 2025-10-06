import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../../components/AppHeader";

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n: number) => new Date(now.getTime() - n * 60 * 60 * 1000).toISOString();

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  date: string; // ISO string for grouping
  type: "application" | "deadline" | "document" | "approval" | "announcement" | "system";
  isRead: boolean;
  priority: "low" | "medium" | "high";
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Application Status Update",
    message: "Your Merit Scholarship application is now under review",
    time: "2 hours ago",
    date: hoursAgo(2),
    type: "application",
    isRead: false,
    priority: "high"
  },
  {
    id: 2,
    title: "Deadline Reminder",
    message: "STEM Excellence Award deadline is in 3 days",
    time: "1 day ago",
    date: daysAgo(1),
    type: "deadline",
    isRead: false,
    priority: "high"
  },
  {
    id: 3,
    title: "Document Required",
    message: "Please upload your official transcript for Need-Based Grant",
    time: "2 days ago",
    date: daysAgo(2),
    type: "document",
    isRead: true,
    priority: "medium"
  },
  {
    id: 4,
    title: "Application Approved",
    message: "Congratulations! Your Community Service Scholarship has been approved",
    time: "3 days ago",
    date: daysAgo(3),
    type: "approval",
    isRead: true,
    priority: "high"
  },
  {
    id: 5,
    title: "New Scholarship Available",
    message: "International Student Fund is now accepting applications",
    time: "1 week ago",
    date: daysAgo(7),
    type: "announcement",
    isRead: true,
    priority: "low"
  },
  {
    id: 6,
    title: "System Maintenance",
    message: "The platform will be under maintenance on Sunday 2-4 AM",
    time: "1 week ago",
    date: daysAgo(7),
    type: "system",
    isRead: true,
    priority: "low"
  }
];

const notificationTypes = {
  application: { icon: "document-text", color: "#2196F3" },
  deadline: { icon: "time", color: "#FF9800" },
  document: { icon: "cloud-upload", color: "#4CAF50" },
  approval: { icon: "checkmark-circle", color: "#4CAF50" },
  announcement: { icon: "megaphone", color: "#9C27B0" },
  system: { icon: "settings", color: "#607D8B" }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<
    "all" | "application" | "deadline" | "document" | "approval" | "announcement" | "system"
  >("all");

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const groups = useMemo(() => {
    const today: NotificationItem[] = [];
    const thisWeek: NotificationItem[] = [];
    const older: NotificationItem[] = [];
    const nowDate = new Date();
    const startOfToday = new Date(nowDate);
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(nowDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    filteredNotifications
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(n => {
        const d = new Date(n.date);
        if (d >= startOfToday) {
          today.push(n);
        } else if (d >= sevenDaysAgo) {
          thisWeek.push(n);
        } else {
          older.push(n);
        }
      });

    return { today, thisWeek, older };
  }, [filteredNotifications]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      {/* Header outside ScrollView */}
      <AppHeader
        title="Notifications"
        onBack={() => router.back()}
        rightIcon={
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingVertical:20}} showsVerticalScrollIndicator={false}>

        {/* Notification Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{groups.thisWeek.length}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: "all", label: "All" },
              { key: "application", label: "Applications" },
              { key: "deadline", label: "Deadlines" },
              { key: "document", label: "Documents" },
              { key: "approval", label: "Approvals" },
              { key: "announcement", label: "Announcements" },
              { key: "system", label: "System" },
            ].map(tab => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key as any)}
                style={[styles.filterChip, filter === (tab.key as any) && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, filter === (tab.key as any) && styles.filterTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List - Grouped */}
        <View style={styles.notificationsContainer}>
          {groups.today.length > 0 && (
            <>
              <Text style={styles.groupHeader}>Today</Text>
              {groups.today.map((notification) => {
                const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes];
                return (
                  <TouchableOpacity
                    key={`today-${notification.id}`}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.notificationCardUnread
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.notificationContent}>
                      <View style={[styles.notificationIcon, { backgroundColor: typeInfo.color + '20' }]}>
                        <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                      </View>
                      <View style={styles.notificationInfo}>
                        <View style={styles.notificationHeader}>
                          <Text style={[
                            styles.notificationTitle,
                            !notification.isRead && styles.notificationTitleUnread
                          ]}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {groups.thisWeek.length > 0 && (
            <>
              <Text style={styles.groupHeader}>This Week</Text>
              {groups.thisWeek.map((notification) => {
                const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes];
                return (
                  <TouchableOpacity
                    key={`week-${notification.id}`}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.notificationCardUnread
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.notificationContent}>
                      <View style={[styles.notificationIcon, { backgroundColor: typeInfo.color + '20' }]}>
                        <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                      </View>
                      <View style={styles.notificationInfo}>
                        <View style={styles.notificationHeader}>
                          <Text style={[
                            styles.notificationTitle,
                            !notification.isRead && styles.notificationTitleUnread
                          ]}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {groups.older.length > 0 && (
            <>
              <Text style={styles.groupHeader}>Older</Text>
              {groups.older.map((notification) => {
                const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes];
                return (
                  <TouchableOpacity
                    key={`older-${notification.id}`}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.notificationCardUnread
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.notificationContent}>
                      <View style={[styles.notificationIcon, { backgroundColor: typeInfo.color + '20' }]}>
                        <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                      </View>
                      <View style={styles.notificationInfo}>
                        <View style={styles.notificationHeader}>
                          <Text style={[
                            styles.notificationTitle,
                            !notification.isRead && styles.notificationTitleUnread
                          ]}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>

        {/* Empty State (if no notifications) */}
        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyDescription}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        )}

        {/* Notification Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications on your device</Text>
              </View>
              <TouchableOpacity style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications via email</Text>
              </View>
              <TouchableOpacity style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Deadline Reminders</Text>
                <Text style={styles.settingDescription}>Get reminded about upcoming deadlines</Text>
              </View>
              <TouchableOpacity style={[styles.toggle, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  filterChipActive: {
    backgroundColor: "#333",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  notificationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  groupHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.8,
  },
  notificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
});


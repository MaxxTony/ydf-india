import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const calendarEvents = [
  {
    id: 1,
    title: "Merit Scholarship Deadline",
    date: "2024-03-15",
    time: "11:59 PM",
    type: "deadline",
    priority: "high",
    color: "#F44336",
    description: "Submit your Merit Scholarship application"
  },
  {
    id: 2,
    title: "Document Upload Due",
    date: "2024-03-12",
    time: "5:00 PM",
    type: "document",
    priority: "high",
    color: "#FF9800",
    description: "Upload official transcript for Need-Based Grant"
  },
  {
    id: 3,
    title: "Application Review Meeting",
    date: "2024-03-20",
    time: "2:00 PM",
    type: "meeting",
    priority: "medium",
    color: "#2196F3",
    description: "Committee review session for STEM Excellence Award"
  },
  {
    id: 4,
    title: "Scholarship Results Announcement",
    date: "2024-03-25",
    time: "10:00 AM",
    type: "announcement",
    priority: "high",
    color: "#4CAF50",
    description: "Results for Community Service Scholarship will be announced"
  },
  {
    id: 5,
    title: "Personal Reminder",
    date: "2024-03-18",
    time: "3:00 PM",
    type: "personal",
    priority: "low",
    color: "#9C27B0",
    description: "Prepare for scholarship interview"
  }
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "STEM Excellence Award",
    deadline: "2024-03-10",
    daysLeft: 3,
    color: "#F44336"
  },
  {
    id: 2,
    title: "Need-Based Grant",
    deadline: "2024-03-20",
    daysLeft: 13,
    color: "#FF9800"
  },
  {
    id: 3,
    title: "International Student Fund",
    deadline: "2024-03-18",
    daysLeft: 11,
    color: "#2196F3"
  }
];

const eventTypes = {
  deadline: { icon: "time", color: "#F44336" },
  document: { icon: "document", color: "#FF9800" },
  meeting: { icon: "people", color: "#2196F3" },
  announcement: { icon: "megaphone", color: "#4CAF50" },
  personal: { icon: "person", color: "#9C27B0" }
};

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#fff", "#fff", "#f2c44d"]}
        style={styles.background}
        locations={[0, 0.3, 1]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar & Reminders</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Current Month Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity style={styles.monthButton}>
            <Ionicons name="chevron-back" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.monthText}>March 2024</Text>
          <TouchableOpacity style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 6; // Start from previous month
              const isCurrentMonth = day > 0 && day <= 31;
              const isToday = day === 15; // Mock today
              const hasEvent = [10, 12, 15, 18, 20, 25].includes(day);
              
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.calendarDay,
                    isToday && styles.calendarDayToday,
                    hasEvent && styles.calendarDayWithEvent
                  ]}
                >
                  <Text style={[
                    styles.calendarDayText,
                    !isCurrentMonth && styles.calendarDayTextInactive,
                    isToday && styles.calendarDayTextToday
                  ]}>
                    {day > 0 ? day : ''}
                  </Text>
                  {hasEvent && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Upcoming Deadlines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          {upcomingDeadlines.map((deadline) => (
            <View key={deadline.id} style={styles.deadlineCard}>
              <View style={[styles.deadlineIndicator, { backgroundColor: deadline.color }]} />
              <View style={styles.deadlineInfo}>
                <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                <Text style={styles.deadlineDate}>Due: {deadline.deadline}</Text>
              </View>
              <View style={styles.deadlineDays}>
                <Text style={[styles.deadlineDaysText, { color: deadline.color }]}>
                  {deadline.daysLeft}
                </Text>
                <Text style={styles.deadlineDaysLabel}>days left</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Today's Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Events</Text>
          {calendarEvents.filter(event => event.date === "2024-03-15").map((event) => {
            const typeInfo = eventTypes[event.type as keyof typeof eventTypes];
            return (
              <View key={event.id} style={styles.eventCard}>
                <View style={[styles.eventIcon, { backgroundColor: typeInfo.color + '20' }]}>
                  <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <View style={[styles.eventPriority, { backgroundColor: event.color }]} />
              </View>
            );
          })}
        </View>

        {/* This Week's Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Events</Text>
          {calendarEvents.map((event) => {
            const typeInfo = eventTypes[event.type as keyof typeof eventTypes];
            return (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={[styles.eventIcon, { backgroundColor: typeInfo.color + '20' }]}>
                  <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  <Text style={styles.eventTime}>{event.date} • {event.time}</Text>
                </View>
                <View style={[styles.eventPriority, { backgroundColor: event.color }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>Add Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="calendar-outline" size={24} color="#2196F3" />
              <Text style={styles.quickActionText}>View Full Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="notifications-outline" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>Notification Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="sync-outline" size={24} color="#9C27B0" />
              <Text style={styles.quickActionText}>Sync Calendar</Text>
            </TouchableOpacity>
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
  addButton: {
    padding: 8,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  calendarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  calendarHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  calendarDayToday: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  calendarDayWithEvent: {
    backgroundColor: "#f0f8ff",
  },
  calendarDayText: {
    fontSize: 16,
    color: "#333",
  },
  calendarDayTextInactive: {
    color: "#ccc",
  },
  calendarDayTextToday: {
    color: "#fff",
    fontWeight: "600",
  },
  eventDot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  deadlineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  deadlineIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  deadlineDate: {
    fontSize: 14,
    color: "#666",
  },
  deadlineDays: {
    alignItems: "center",
  },
  deadlineDaysText: {
    fontSize: 20,
    fontWeight: "700",
  },
  deadlineDaysLabel: {
    fontSize: 10,
    color: "#666",
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: "#999",
  },
  eventPriority: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  quickActionText: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
});


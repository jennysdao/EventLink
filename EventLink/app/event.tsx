import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EventDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      <Image 
        source={{ uri: typeof params.imageUri === "string" ? params.imageUri : params.imageUri?.[0] || "" }} 
        style={styles.eventImage} 
      />

      {/* ✅ Back Icon in Top-Right */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Event Details Card */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{params.title}</Text>
        <Text style={styles.date}>
          {params.date && typeof params.date === "string"
            ? new Date(params.date).toDateString()
            : "Invalid Date"}
        </Text>

        {/* About Section */}
        <Text style={styles.sectionHeader}>About</Text>
        <Text style={styles.description}>{params.about}</Text>

        {/* Address Section */}
        <Text style={styles.sectionHeader}>Address</Text>
        <Text style={styles.description}>{params.address || "To be released when RSVP'ed!"}</Text>

        {/* Requirements Section */}
        {params.requirements ? (
          <>
            <Text style={styles.sectionHeader}>Requirements</Text>
            <Text style={styles.description}>{params.requirements}</Text>
          </>
        ) : null}

        {/* RSVP Button */}
        <TouchableOpacity style={styles.rsvpButton}>
          <Text style={styles.rsvpText}>RSVP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  eventImage: { width: "100%", height: 300 },
  backIcon: { 
    position: "absolute", 
    top: 50, // Adjust this value if needed
    right: 20, 
    backgroundColor: "rgba(0,0,0,0.3)", 
    padding: 8, 
    borderRadius: 50 
  },
  detailsContainer: { 
    backgroundColor: "white", 
    padding: 20, 
    marginTop: -20, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#3F587D" },
  date: { fontSize: 16, color: "#748BAB", marginBottom: 10 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#3F587D", marginTop: 15 },
  description: { fontSize: 16, color: "#3F587D", marginTop: 5 },
  rsvpButton: { backgroundColor: "#748BAB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  rsvpText: { color: "white", fontSize: 18, fontWeight: "bold" },
  backButton: { backgroundColor: "#D0D9E8", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  backButtonText: { color: "#3F587D", fontSize: 18, fontWeight: "bold" },
});

export default EventDetails;

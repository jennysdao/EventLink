import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ✅ Define Props Type
interface EventDetailsProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

const EventDetailsComponent: React.FC<EventDetailsProps> = ({ title, date, about, address, requirements, imageUri }) => {
  const router = useRouter();
  const [isRsvped, setIsRsvped] = useState(false);

  useEffect(() => {
    checkIfRsvped();
  }, []);

  // ✅ Check if user has already RSVP'd
  const checkIfRsvped = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (storedRsvpEvents) {
        const rsvpEvents = JSON.parse(storedRsvpEvents);
        const alreadyRsvped = rsvpEvents.some((event: any) => event.title === title);
        setIsRsvped(alreadyRsvped);
      }
    } catch (error) {
      console.error("Error checking RSVP status:", error);
    }
  };

  // ✅ Handle RSVP
  const handleRSVP = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      // If event is not already RSVP'd, add it
      if (!rsvpEvents.some((event: any) => event.title === title)) {
        const newEvent = { title, date, about, address, requirements, imageUri };
        rsvpEvents.push(newEvent);
        await AsyncStorage.setItem("rsvpEvents", JSON.stringify(rsvpEvents));

        setIsRsvped(true);
        Alert.alert("Success", "You have RSVP'd for this event!");
      } else {
        Alert.alert("Already RSVP'd", "You have already RSVP'd for this event.");
      }
    } catch (error) {
      console.error("Error saving RSVP:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      <Image 
        source={{ uri: typeof imageUri === "string" ? imageUri : imageUri?.[0] || "" }} 
        style={styles.eventImage} 
      />

      {/* ✅ Back Icon in Top-Right */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Event Details Card */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date ? new Date(String(date)).toDateString() : "No Date Available"}</Text>

        {/* About Section */}
        <Text style={styles.sectionHeader}>About</Text>
        <Text style={styles.description}>{about}</Text>

        {/* Address Section */}
        <Text style={styles.sectionHeader}>Address</Text>
        <Text style={styles.description}>{address || "To be released when RSVP'ed!"}</Text>

        {/* Requirements Section */}
        {requirements ? (
          <>
            <Text style={styles.sectionHeader}>Requirements</Text>
            <Text style={styles.description}>{requirements}</Text>
          </>
        ) : null}

        {/* RSVP Button */}
        <TouchableOpacity style={[styles.rsvpButton, isRsvped && styles.rsvpDisabled]} onPress={handleRSVP} disabled={isRsvped}>
          <Text style={styles.rsvpText}>{isRsvped ? "RSVP'd" : "RSVP"}</Text>
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
    top: 50, 
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
  rsvpDisabled: { backgroundColor: "#A9A9A9" }, // ✅ Change color if RSVP'd
  rsvpText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default EventDetailsComponent;

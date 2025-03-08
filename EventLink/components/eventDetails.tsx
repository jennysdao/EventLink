import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import AttendeeToggle from "../components/RSVPUserList"; // Import the new component


interface EventProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

const EventDetailsComponent: React.FC<EventProps> = ({ title, date, about, address, requirements, imageUri }) => {
  const router = useRouter();
  const [isRsvped, setIsRsvped] = useState(false);

  useEffect(() => {
    checkIfRsvped();
  }, []);

  const checkIfRsvped = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (storedRsvpEvents) {
        const rsvpEvents = JSON.parse(storedRsvpEvents);
        const alreadyRsvped = rsvpEvents.some((event: { title: string }) => event.title === title);
        setIsRsvped(alreadyRsvped);
      }
    } catch (error) {
      console.error("Error checking RSVP status:", error);
    }
  };

  const handleRSVP = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      if (!rsvpEvents.some((event: { title: string }) => event.title === title)) {
        const newEvent = { title, date, about, address, requirements, imageUri };
        rsvpEvents.push(newEvent);
        await AsyncStorage.setItem("rsvpEvents", JSON.stringify(rsvpEvents));

        setIsRsvped(true);
        Alert.alert("Success", "You have RSVP'd for this event!");
      }
    } catch (error) {
      console.error("Error saving RSVP:", error);
    }
  };

  const handleUnRSVP = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];
  
      // ✅ Remove the event from RSVP list
      rsvpEvents = rsvpEvents.filter((event: any) => event.title !== title);
      await AsyncStorage.setItem("rsvpEvents", JSON.stringify(rsvpEvents));
      
      // ✅ Remove user from attendee list
      const storedAttendees = await AsyncStorage.getItem(`attendees_${title}`);
      if (storedAttendees) {
        let attendeesList = JSON.parse(storedAttendees);
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const latestUser = users[users.length - 1];
          const profilePicture = latestUser.profilePicture || null;
  
          // Remove user from attendees
          attendeesList = attendeesList.filter((attendee: string) => attendee !== profilePicture);
          await AsyncStorage.setItem(`attendees_${title}`, JSON.stringify(attendeesList));
        }
      }
  
      setIsRsvped(false); // ✅ Update state
    } catch (error) {
      console.error("Error handling un-RSVP:", error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.eventImage} />

      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date ? new Date(date).toDateString() : "No Date Available"}</Text>

        <Text style={styles.sectionHeader}>About</Text>
        <Text style={styles.description}>{about}</Text>

        <Text style={styles.sectionHeader}>Address</Text>
        <Text style={styles.description}>{address || "To be released when RSVP'ed!"}</Text>

        {requirements && (
          <>
            <Text style={styles.sectionHeader}>Requirements</Text>
            <Text style={styles.description}>{requirements}</Text>
          </>
        )}

        {isRsvped ? (
          <TouchableOpacity style={[styles.rsvpButton, styles.unrsvpButton]} onPress={handleUnRSVP}>
            <Text style={styles.rsvpText}>Un-RSVP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.rsvpButton} onPress={handleRSVP}>
            <Text style={styles.rsvpText}>RSVP</Text>
          </TouchableOpacity>
        )}
        {isRsvped && <AttendeeToggle eventTitle={title} />}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  eventImage: { width: "100%", height: 300 },
  backIcon: { position: "absolute", top: 50, right: 20, backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 50 },
  detailsContainer: { backgroundColor: "white", padding: 20, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#3F587D" },
  date: { fontSize: 16, color: "#748BAB", marginBottom: 10 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#3F587D", marginTop: 15 },
  description: { fontSize: 16, color: "#3F587D", marginTop: 5 },
  rsvpButton: { backgroundColor: "#748BAB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  unrsvpButton: { backgroundColor: "#D9534F" },
  rsvpText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default EventDetailsComponent;

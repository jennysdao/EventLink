import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const EventDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { title, date, about, address, requirements, imageUri, creator } = params;
  const [currentUser, setCurrentUser] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isRsvped, setIsRsvped] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  
  const fetchCurrentUser = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const latestUser = users[users.length - 1]; //  Get the latest logged-in user
        setUser(latestUser);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const checkIfRsvped = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
  
      console.log("🔍 Checking RSVP status...");
  
      if (storedUsers && storedRsvpEvents) {
        const users = JSON.parse(storedUsers);
        const latestUser = users[users.length - 1]; // Get current user
        const userEmail = latestUser.email;
  
        console.log(`👤 Current User: ${userEmail}`);
  
        const rsvpData = JSON.parse(storedRsvpEvents);
        console.log("📁 Stored RSVP Events:", rsvpData);
  
        const userRsvpEvents = rsvpData[userEmail] || [];
        console.log(` ${userEmail}'s RSVP'd Events:`, userRsvpEvents);
  
        const isUserRsvped = userRsvpEvents.some((event: any) => event.title === title);
        console.log(`❓ Is User RSVP'd?: ${isUserRsvped}`);
  
        setIsRsvped(isUserRsvped);
      }
    } catch (error) {
      console.error("⚠️ Error checking RSVP status:", error);
    }
  };
  
  //  Run `checkIfRsvped()` on load
  useEffect(() => {
    checkIfRsvped();
  }, []);
  

  //  Handle RSVP
const handleRSVP = async () => {
  try {
    const storedUsers = await AsyncStorage.getItem("users");
    const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");

    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const latestUser = users[users.length - 1]; // Get current user
      const userEmail = latestUser.email;

      let rsvpData = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : {};

      // If user doesn't have RSVP events, create a new array
      if (!rsvpData[userEmail]) {
        rsvpData[userEmail] = [];
      }

      // Check if event is already RSVP'd
      if (!rsvpData[userEmail].some((event: any) => event.title === title)) {
        rsvpData[userEmail].push({
          title,
          date,
          about,
          address,
          requirements,
          imageUri,
        });

        await AsyncStorage.setItem("rsvpEvents", JSON.stringify(rsvpData));

        setIsRsvped(true);
        Alert.alert("Success", "You have RSVP'd for this event!");
      }
    }
  } catch (error) {
    console.error("Error saving RSVP:", error);
  }
};

//  Handle Un-RSVP
const handleUnRSVP = async () => {
  try {
    const storedUsers = await AsyncStorage.getItem("users");
    const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");

    if (storedUsers && storedRsvpEvents) {
      const users = JSON.parse(storedUsers);
      const latestUser = users[users.length - 1]; // Get current user
      const userEmail = latestUser.email;

      let rsvpData = JSON.parse(storedRsvpEvents);

      // Remove event from RSVP list
      if (rsvpData[userEmail]) {
        rsvpData[userEmail] = rsvpData[userEmail].filter((event: any) => event.title !== title);
      }

      await AsyncStorage.setItem("rsvpEvents", JSON.stringify(rsvpData));

      setIsRsvped(false);
      Alert.alert("Removed", "You have un-RSVP'd from this event.");
    }
  } catch (error) {
    console.error("Error removing RSVP:", error);
  }
};

  
  //  Call check function in useEffect
  useEffect(() => {
    checkIfRsvped();
  }, [user]);
  
  
  
  


  return (
    <ScrollView style={styles.container}>
    <Image 
      source={{ uri: Array.isArray(imageUri) ? imageUri[0] : imageUri || "" }} 
      style={styles.eventImage} 
    />
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date ? new Date(String(date)).toDateString() : "No Date Available"}</Text>

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
        {isOwner && (
          <TouchableOpacity style={styles.editButton} onPress={() => router.push("/updateEvent")}>
            <Text style={styles.editText}>Edit Event</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {!isRsvped ? (
        <TouchableOpacity style={styles.rsvpButton} onPress={handleRSVP}>
          <Text style={styles.rsvpText}>RSVP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.unRsvpButton} onPress={handleUnRSVP}>
          <Text style={styles.unRsvpText}>Un-RSVP</Text>
        </TouchableOpacity>
      )}


      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Attending</Text>
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
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#3F587D", marginTop: 15 },
  description: { fontSize: 16, color: "#3F587D", marginTop: 5 },

  rsvpButton: { backgroundColor: "#748BAB", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  rsvpText: { color: "white", fontSize: 18, fontWeight: "bold" },

  unRsvpButton: { backgroundColor: "#D9534F", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  unRsvpText: { color: "white", fontSize: 18, fontWeight: "bold" },

  editButton: { backgroundColor: "#3F587D", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 20 },
  editText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default EventDetails;

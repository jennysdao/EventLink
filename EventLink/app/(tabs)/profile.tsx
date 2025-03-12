import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileHeader from "../../components/profileHeader";
import SavedEventCard from "../../components/savedEvents";
import SavedEvents from "../../components/savedEvents"; // Import SavedEvents component
import { useFocusEffect } from "@react-navigation/native"; // Import for auto-refresh

const ProfileScreen = () => {
  const [userName, setUserName] = useState("User");
  const [selectedSchool, setSelectedSchool] = useState("University");
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // Add missing state

  const handleProfilePictureUpdate = (newProfilePicture: string) => {
    setProfilePicture(newProfilePicture);
  };

  // Function to fetch user and RSVP data
  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(`${user.firstName} ${user.lastName}`);
        setProfilePicture(user.profilePicture || null); // Now `setProfilePicture` exists
      }

      const storedSchool = await AsyncStorage.getItem("selectedSchool");
      if (storedSchool) setSelectedSchool(storedSchool);

      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (storedRsvpEvents) setRsvpEvents(JSON.parse(storedRsvpEvents));
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  // Refresh every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Profile Header */}
        <ProfileHeader userName={userName} selectedSchool={selectedSchool} onProfilePictureUpdate={handleProfilePictureUpdate} />


        {/* Saved Events Section */}
        <Text style={styles.sectionTitle}>Going To</Text>
        <SavedEvents /> {/* Render SavedEvents component */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "white" },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "white", alignItems: "center" },
  sectionTitle: { fontSize: 30, fontWeight: "bold", color: "#4C5D7D", marginBottom: 10, marginTop: 20, alignSelf: "flex-start", marginLeft: 20 },
  eventList: { marginTop: 30, paddingBottom: 50 },
  emptyText: { color: "gray", fontSize: 16, textAlign: "center", marginTop: 20 },
});

export default ProfileScreen;
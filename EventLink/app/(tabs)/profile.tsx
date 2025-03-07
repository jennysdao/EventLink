import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileHeader from "../../components/profileHeader";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ✅ Define the User Type
interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  selectedSchool: string;
}

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null); // ✅ Set correct user type
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [rsvpEvents, setRsvpEvents] = useState<any[]>([]);


  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ Fetch User Data from AsyncStorage
  const fetchUserData = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const latestUser = users[users.length - 1]; // ✅ Get logged-in user
        setUser(latestUser); // ✅ Ensure `user` contains firstName, lastName, email, etc.
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchRsvpEvents = async () => {
    if (!user || !user.email) return;
  
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (!storedRsvpEvents) return;
  
      const rsvpEvents = JSON.parse(storedRsvpEvents);
      setRsvpEvents(rsvpEvents[user.email] || []);
    } catch (error) {
      console.error("Error loading RSVP events:", error);
    }
  };
  
  // ✅ Call fetch function in useEffect
  useEffect(() => {
    fetchRsvpEvents();
  }, [user]);
  
  

  // ✅ Refresh Function
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  // ✅ Auto-Refresh on Navigation Focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // ✅ Logout Confirmation Alert
  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: handleLogout }
      ]
    );
  };

  // ✅ Logout Mechanism
  const handleLogout = async () => {
    try {
      router.replace("/(auth)/sign-in"); // Reset navigation stack, preventing back swipe
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Logout Button in the Top Right */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* ✅ Profile Header with User Data */}
      {user && (
        <ProfileHeader
          userName={`${user.firstName} ${user.lastName}`}
          selectedSchool={user.selectedSchool}
          profilePicture={user.profilePicture} // ✅ Pass profile picture correctly
        />
      )}

      {/* Section for Upcoming Events */}
      <Text style={styles.sectionTitle}>Going To</Text>

      {/* Show Placeholder if No Data */}
      {!user && <Text style={styles.emptyText}>Loading profile...</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollViewContent: { flexGrow: 1, alignItems: "center", paddingTop: 50, paddingBottom: 100 },
  sectionTitle: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#4C5D7D", 
    marginBottom: 10, 
    marginTop: 20, 
    alignSelf: "flex-start", 
    marginLeft: 20 
  },
  emptyText: { color: "#4C5D7D", fontSize: 16, textAlign: "center", marginTop: 20 },

  // ✅ Logout Button Style
  logoutButton: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 50,
    zIndex: 10, // Ensure it's always on top
  },
});

export default ProfileScreen;

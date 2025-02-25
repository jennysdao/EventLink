import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import images from "../../constants/images"; // Import background image

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [selectedSchool, setSelectedSchool] = useState("Select a school");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Load stored school and user name
        const storedSchool = await AsyncStorage.getItem("selectedSchool");
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const latestUser = users[users.length - 1]; // Get last signed-up user
          setUserName(`${latestUser.firstName} ${latestUser.lastName}`);
        }
        if (storedSchool) setSelectedSchool(storedSchool);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={images.schoolBackground} style={styles.background} />

      {/* Top Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.greeting}>Hi, {userName}!</Text>

        {/* Logo */}
        <Ionicons name="link-outline" size={60} color="white" />

        {/* School Name */}
        <Text style={styles.schoolText}>Events at</Text>
        <Text style={styles.schoolName}>{selectedSchool}</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find events going on near you"
            placeholderTextColor="gray"
          />
        </View>

        {/* Change School Link */}
        <TouchableOpacity onPress={() => router.push("../(auth)/school-selection")}>
          <Text style={styles.changeSchool}>Change my school</Text>
        </TouchableOpacity>
      </View>

      {/* Events Section */}
      <ScrollView contentContainerStyle={styles.eventsSection}>
        <Text style={styles.sectionTitle}>Going on Today</Text>

        {/* Event Cards Placeholder */}
        <View style={styles.eventCardPlaceholder}>
          <Text style={styles.eventCardText}>No events yet.</Text>
        </View>
        <View style={styles.eventCardPlaceholder}>
          <Text style={styles.eventCardText}>No events yet.</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => console.log("Add Event Pressed")}>
        <Ionicons name="add-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "40%", // Covers top part
  },
  overlay: {
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  schoolText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "80%",
    marginTop: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  changeSchool: {
    color: "#ABC1E2",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3F587D",
    marginBottom: 10,
  },
  eventCardPlaceholder: {
    height: 100,
    backgroundColor: "#D0D9E8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  eventCardText: {
    fontSize: 16,
    color: "#3F587D",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3F587D",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
  },
});

export default Home;

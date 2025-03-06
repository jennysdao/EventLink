import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileHeader from "../../components/profileHeader";
import SavedEventCard from "../../components/savedEvents";

const ProfileScreen = () => {
  const [userName, setUserName] = useState("User");
  const [selectedSchool, setSelectedSchool] = useState("University");
  const [rsvpEvents, setRsvpEvents] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const latestUser = users[users.length - 1];
          setUserName(`${latestUser.firstName} ${latestUser.lastName}`);
        }
        const storedSchool = await AsyncStorage.getItem("selectedSchool");
        if (storedSchool) setSelectedSchool(storedSchool);

        const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
        if (storedRsvpEvents) setRsvpEvents(JSON.parse(storedRsvpEvents));
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <ProfileHeader userName={userName} selectedSchool={selectedSchool} />

      {/* Going To Section */}
      <Text style={styles.sectionTitle}>Going To</Text>

      <FlatList
        data={rsvpEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <SavedEventCard {...item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>That's all for now!</Text>}
        contentContainerStyle={styles.eventList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center", paddingTop: 50 },
  sectionTitle: { fontSize: 30, fontWeight: "bold", color: "#4C5D7D", marginBottom: 10, marginTop: 20, alignSelf: "flex-start", marginLeft: 20 },
  eventList: { marginTop: 30, paddingBottom: 50 },
  emptyText: { color: "white", fontSize: 16, textAlign: "center", marginTop: 20 },
});

export default ProfileScreen;

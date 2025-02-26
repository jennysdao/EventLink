import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../../constants/images";
import SavedEventCard from "../../components/savedEvents";

interface Event {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

const MyEvents = () => {
  const [rsvpEvents, setRsvpEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchRsvpEvents = async () => {
      try {
        const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
        if (storedRsvpEvents) {
          setRsvpEvents(JSON.parse(storedRsvpEvents));
        }
      } catch (error) {
        console.error("Error loading RSVP'd events:", error);
      }
    };

    fetchRsvpEvents();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      {/* Header */}
      <Text style={styles.header}>Your Events</Text>

      {/* RSVP'd Events List */}
      <FlatList
        data={rsvpEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SavedEventCard
            title={item.title}
            date={item.date}
            about={item.about}
            address={item.address}
            requirements={item.requirements}
            imageUri={item.imageUri}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>That's all for now!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center", paddingTop: 40 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "bold", color: "#3F587D", marginBottom: 20 },
  emptyText: { marginTop: 20, fontSize: 16, color: "#748BAB" },
});

export default MyEvents;

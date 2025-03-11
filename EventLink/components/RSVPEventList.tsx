import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RSVPEventsList = () => {
  const [rsvpEvents, setRsvpEvents] = useState([]);

  useEffect(() => {
    const fetchRSVPEvents = async () => {
      try {
        const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
        if (storedRsvpEvents) setRsvpEvents(JSON.parse(storedRsvpEvents));
      } catch (error) {
        console.error("Error loading RSVP events:", error);
      }
    };

    fetchRSVPEvents();
  }, []);

  interface Event {
    title: string;
    date: string;
    location: string;
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Going To</Text>
      <FlatList
        data={rsvpEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEvent}
        ListEmptyComponent={<Text style={styles.emptyText}>That's all for now!</Text>}
        contentContainerStyle={styles.eventList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", alignItems: "center" },
  sectionTitle: { fontSize: 30, fontWeight: "bold", color: "#4C5D7D", marginBottom: 10, marginTop: 20, alignSelf: "flex-start", marginLeft: 20 },
  eventList: { marginTop: 30, paddingBottom: 50 },
  emptyText: { color: "gray", fontSize: 16, textAlign: "center", marginTop: 20 },
  eventCard: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc", width: "100%" },
  eventTitle: { fontSize: 18, fontWeight: "bold" },
  eventDate: { fontSize: 16, color: "gray" },
  eventLocation: { fontSize: 16, color: "gray" },
});

export default RSVPEventsList;
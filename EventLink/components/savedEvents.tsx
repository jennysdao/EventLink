import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EventProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

const SavedEvents = () => {
  const router = useRouter();
  const [savedEvents, setSavedEvents] = useState<EventProps[]>([]);

  useEffect(() => {
    loadRSVPedEvents();
    const interval = setInterval(loadRSVPedEvents, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRSVPedEvents = async () => {
    try {
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (storedRsvpEvents) {
        setSavedEvents(JSON.parse(storedRsvpEvents));
      } else {
        setSavedEvents([]);
      }
    } catch (error) {
      console.error("Error loading saved events:", error);
    }
  };

  return (
    <View style={styles.container}>
      {savedEvents.length === 0 ? (
        <Text style={styles.noEventsText}>No RSVP'ed events found.</Text>
      ) : (
        <FlatList
          data={savedEvents}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() =>
                router.push({
                  pathname: "/event",
                  params: { ...item } as Record<string, any>,
                })
              }
            >
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.eventImage} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}

              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{new Date(String(item.date)).toDateString()}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {item.about}
                </Text>
                <Text style={styles.eventAddress}>{item.address || "Address TBD"}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", width: "100%" },
  header: { fontSize: 24, fontWeight: "bold", color: "#3F587D", marginBottom: 20 },
  noEventsText: { fontSize: 16, color: "#748BAB", textAlign: "center", marginTop: 20 },
  eventCard: { 
    flexDirection: "row",
    backgroundColor: "#E0E7F3", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
    width: "100%",
    alignItems: "center",
  },
  eventImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  noImagePlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    backgroundColor: "#C0C7D0", 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 15 
  },
  noImageText: { color: "#3F587D", fontSize: 12 },
  eventDetails: { flex: 0 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#3F587D" },
  eventDate: { fontSize: 14, color: "#748BAB", marginTop: 2 },
  eventDescription: { fontSize: 14, color: "#3F587D", marginTop: 5 },
  eventAddress: { fontSize: 12, color: "#3F587D", marginTop: 5, fontStyle: "italic" },
});

export default SavedEvents;
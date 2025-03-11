import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [query]);

  const fetchEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);

        // Filter Events Based on Query
        const filtered = parsedEvents.filter((event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.about.toLowerCase().includes(query.toLowerCase()) ||
          event.creator.toLowerCase().includes(query.toLowerCase()) || 
          event.address.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEvents(filtered);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#3F587D" />
        <TextInput
          style={styles.searchInput}
          value={query}
          placeholder="Search events..."
          editable={false} // Make read-only since query is passed via params
        />
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-outline" size={24} color="#3F587D" />
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => router.push({ pathname: "/event", params: { 
              title: item.title, 
              date: item.date, 
              about: item.about, 
              address: item.address, 
              requirements: item.requirements, 
              imageUri: item.imageUri, 
              creator: item.creator
            } 
          })}
          >
            <Image source={{ uri: item.imageUri || "https://via.placeholder.com/150" }} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{new Date(item.date).toDateString()}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>{item.about}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No events found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "white", padding: 20 },
  searchBar: {
    marginTop: 100, 
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7F3",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#3F587D" },
  eventCard: {
    
    flexDirection: "row",
    backgroundColor: "#E0E7F3",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  eventImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#3F587D" },
  eventDate: { fontSize: 14, color: "#748BAB", marginTop: 2 },
  eventDescription: { fontSize: 14, color: "#3F587D", marginTop: 5 },
  noEvents: { color: "#748BAB", fontSize: 16, textAlign: "center", marginTop: 20 },
});

export default SearchScreen;

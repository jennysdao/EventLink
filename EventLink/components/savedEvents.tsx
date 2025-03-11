import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useRSVP } from '../utils/RSVPContext';

interface EventProps {
  title: string;
  date: string;
  about: string;
  address?: string;
  imageUri?: string;
  creator: string; // Add the creator property
}

const SavedEvents = () => {
  const router = useRouter();
  const { savedEvents, loadRSVPedEvents, loading } = useRSVP<EventProps>();

  useEffect(() => {
    loadRSVPedEvents();
  }, []); // Empty dependency array to ensure it only runs once

  const handleEventPress = (event: EventProps) => {
    router.push({
      pathname: '/event',
      params: { ...event } as Record<string, any>,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#748BAB" />
      ) : savedEvents.length === 0 ? (
        <Text style={styles.noEventsText}>No RSVP'ed events found.</Text>
      ) : (
        <FlatList
          data={savedEvents}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item)}>
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
                <Text style={styles.eventAddress}>{item.address || 'Address TBD'}</Text>
                <Text style={styles.eventCreator}>Hosted by {item.creator}</Text> {/* Use the creator property */}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noEventsText}>No RSVP'ed events found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', width: '100%' },
  noEventsText: { fontSize: 16, color: '#748BAB', textAlign: 'center', marginTop: 20 },
  eventCard: { 
    backgroundColor: "#E0E7F3", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10, 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between" // Aligns edit icon correctly
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
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#3F587D" },
  eventDate: { fontSize: 14, color: "#748BAB", marginTop: 2 },
  eventDescription: { fontSize: 14, color: "#3F587D", marginTop: 2 },
  eventAddress: { fontSize: 12, color: "#3F587D", marginTop: 2, fontStyle: "italic" },
  eventCreator: { fontSize: 12, color: "#3F587D", fontStyle: "italic", marginTop: 2 },
});

export default SavedEvents;
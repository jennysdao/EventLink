import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RSVPEventsList = () => {
  interface Event {
    id: number;
    title: string;
    imageUri?: string;
  }
  
  const [rsvpEvents, setRsvpEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSVPEvents = async () => {
      try {
        const storedRsvpEvents = await AsyncStorage.getItem('rsvpEvents');
        if (storedRsvpEvents) {
          setRsvpEvents(JSON.parse(storedRsvpEvents));
        }
      } catch (error) {
        console.error('Error loading RSVP events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPEvents();
  }, []);

  const handleEventPress = (event) => {
    // Handle event press logic here
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#748BAB" />
      ) : rsvpEvents.length === 0 ? (
        <Text style={styles.noEventsText}>No RSVP'ed events found.</Text>
      ) : (
        <FlatList
          data={rsvpEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item)}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.eventImage} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}
              <Text style={styles.eventTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#748BAB',
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  noImageText: {
    color: '#748BAB',
  },
  eventTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RSVPEventsList;
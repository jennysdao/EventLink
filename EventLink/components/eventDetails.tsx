import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRSVP } from '../utils/RSVPContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
  creator: string; // Ensure the creator property is included
}

interface Attendee {
  name: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}

const EventDetailsComponent: React.FC<EventProps> = ({ title, date, about, address, requirements, imageUri, creator }) => {
  const router = useRouter();
  const { currentUser, handleRSVP, handleUnRSVP, savedEvents, loadRSVPedEvents } = useRSVP();
  const [isRsvped, setIsRsvped] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [showAttendees, setShowAttendees] = useState(false);

  useEffect(() => {
    checkIfRsvped();
    loadAttendees();
  }, [savedEvents]);

  const checkIfRsvped = () => {
    if (!currentUser) return;
    const alreadyRsvped = savedEvents.some((event) => event.title === title);
    setIsRsvped(alreadyRsvped);
  };

  const loadAttendees = async () => {
    try {
      const storedAttendees = await AsyncStorage.getItem(`attendees_${title}`);
      if (storedAttendees) {
        const attendeesList = JSON.parse(storedAttendees);
        setAttendees(attendeesList);
        setAttendeeCount(attendeesList.length);
      }
    } catch (error) {
      console.error('Error loading attendees:', error);
    }
  };

  const handleRSVPClick = async () => {
    await handleRSVP({ title, date, about, address, requirements, imageUri, creator });
    loadRSVPedEvents(); // Ensure the saved events list is refreshed
    loadAttendees();
  };

  const handleUnRSVPClick = async () => {
    await handleUnRSVP(title);
    loadRSVPedEvents(); // Ensure the saved events list is refreshed
    loadAttendees();
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.eventImage} />

      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date ? new Date(date).toDateString() : 'No Date Available'}</Text>

        <Text style={styles.sectionHeader}>About</Text>
        <Text style={styles.description}>{about}</Text>

        <Text style={styles.sectionHeader}>Address</Text>
        <Text style={styles.description}>{address || "To be released when RSVP'ed!"}</Text>

        {requirements && (
          <>
            <Text style={styles.sectionHeader}>Requirements</Text>
            <Text style={styles.description}>{requirements}</Text>
          </>
        )}

        <Text style={styles.sectionHeader}>Number of Attendees</Text>
        <Text style={styles.description}>{attendeeCount}</Text>

        <TouchableOpacity style={styles.viewAttendeesButton} onPress={() => setShowAttendees(!showAttendees)}>
          <Text style={styles.viewAttendeesText}>{showAttendees ? 'Hide Attendees' : 'View Attendees'}</Text>
        </TouchableOpacity>

        {showAttendees && (
          <View style={styles.attendeesContainer}>
            {attendees.map((attendee, index) => (
              <View key={index} style={styles.attendee}>
                <Image source={{ uri: attendee.profilePicture }} style={styles.attendeeImage} />
                <Text style={styles.attendeeName}>{attendee.firstName} {attendee.lastName}</Text>
              </View>
            ))}
          </View>
        )}

        {isRsvped ? (
          <TouchableOpacity style={[styles.rsvpButton, styles.unrsvpButton]} onPress={handleUnRSVPClick}>
            <Text style={styles.rsvpText}>Un-RSVP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.rsvpButton} onPress={handleRSVPClick}>
            <Text style={styles.rsvpText}>RSVP</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  eventImage: { width: '100%', height: 300 },
  backIcon: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 50 },
  detailsContainer: { backgroundColor: 'white', padding: 20, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3F587D' },
  date: { fontSize: 16, color: '#748BAB', marginBottom: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#3F587D', marginTop: 15 },
  description: { fontSize: 16, color: '#3F587D', marginTop: 5 },
  rsvpButton: { backgroundColor: '#748BAB', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  unrsvpButton: { backgroundColor: '#D9534F' },
  rsvpText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  viewAttendeesButton: { backgroundColor: '#3F587D', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  viewAttendeesText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  attendeesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  attendee: { alignItems: 'center', margin: 5 },
  attendeeImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'white' },
  attendeeName: { marginTop: 5, fontSize: 14, color: '#3F587D' },
  attendeeEmail: { fontSize: 12, color: '#748BAB' },
});

export default EventDetailsComponent;
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface EventProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

interface User {
  name: string;
  email: string;
  profilePicture: string;
}

interface RSVPContextProps {
  currentUser: User | null;
  savedEvents: EventProps[];
  loading: boolean;
  loadCurrentUser: () => void;
  loadRSVPedEvents: () => void;
  handleRSVP: (event: EventProps) => void;
  handleUnRSVP: (title: string) => void;
}

const RSVPContext = createContext<RSVPContextProps | undefined>(undefined);

export const useRSVP = () => {
  const context = useContext(RSVPContext);
  if (!context) {
    throw new Error('useRSVP must be used within an RSVPProvider');
  }
  return context;
};

export const RSVPProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedEvents, setSavedEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    try {
      const storedCurrentUser = await AsyncStorage.getItem('currentUser');
      if (storedCurrentUser) {
        const user = JSON.parse(storedCurrentUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRSVPedEvents = async () => {
    if (!currentUser) return;

    try {
      const userKey = `rsvpEvents_${currentUser.email}`;
      console.log('Loading RSVP events for userKey:', userKey); // Log userKey
      const storedRsvpEvents = await AsyncStorage.getItem(userKey);
      const rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];
      setSavedEvents(rsvpEvents);
      console.log('Loaded RSVP events:', rsvpEvents);
    } catch (error) {
      console.error('Error loading RSVP events:', error);
    }
  };

  const handleRSVP = async (event: EventProps) => {
    if (!currentUser) {
      Alert.alert('Error', 'User not found. Please sign in again.');
      return;
    }

    try {
      const userKey = `rsvpEvents_${currentUser.email}`;
      console.log('RSVPing event for userKey:', userKey); // Log userKey
      const storedRsvpEvents = await AsyncStorage.getItem(userKey);
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      if (!rsvpEvents.some((e: { title: string }) => e.title === event.title)) {
        rsvpEvents.push(event);
        await AsyncStorage.setItem(userKey, JSON.stringify(rsvpEvents));
        setSavedEvents(rsvpEvents);

        const attendeesKey = `attendees_${event.title}`;
        const storedAttendees = await AsyncStorage.getItem(attendeesKey);
        const attendeesList = storedAttendees ? JSON.parse(storedAttendees) : [];
        attendeesList.push(currentUser);
        await AsyncStorage.setItem(attendeesKey, JSON.stringify(attendeesList));

        Alert.alert('Success', "You have RSVP'd for this event!");
      }
    } catch (error) {
      console.error('Error saving RSVP:', error);
    }
  };

  const handleUnRSVP = async (title: string) => {
    if (!currentUser) {
      Alert.alert('Error', 'User not found. Please sign in again.');
      return;
    }

    try {
      const userKey = `rsvpEvents_${currentUser.email}`;
      console.log('Un-RSVPing event for userKey:', userKey); // Log userKey
      const storedRsvpEvents = await AsyncStorage.getItem(userKey);
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      rsvpEvents = rsvpEvents.filter((event: { title: string }) => event.title !== title);
      await AsyncStorage.setItem(userKey, JSON.stringify(rsvpEvents));
      setSavedEvents(rsvpEvents);

      const attendeesKey = `attendees_${title}`;
      const storedAttendees = await AsyncStorage.getItem(attendeesKey);
      let attendeesList = storedAttendees ? JSON.parse(storedAttendees) : [];
      attendeesList = attendeesList.filter((attendee: { email: string }) => attendee.email !== currentUser.email);
      await AsyncStorage.setItem(attendeesKey, JSON.stringify(attendeesList));

      Alert.alert('Success', "You have un-RSVP'd for this event!");
    } catch (error) {
      console.error('Error removing RSVP:', error);
    }
  };

  useEffect(() => {
    try {
      loadCurrentUser();
    } catch (error) {
      console.error('Error in useEffect loadCurrentUser:', error);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      try {
        loadRSVPedEvents();
      } catch (error) {
        console.error('Error in useEffect loadRSVPedEvents:', error);
      }
    }
  }, [currentUser]);

  return (
    <RSVPContext.Provider value={{ currentUser, savedEvents, loading, loadCurrentUser, loadRSVPedEvents, handleRSVP, handleUnRSVP }}>
      {children}
    </RSVPContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  profilePicture: string;
  email: string;
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
    throw new Error('useRSVP must be used within a RSVPProvider');
  }
  return context;
};

export const RSVPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedEvents, setSavedEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadRSVPedEvents();
    }
  }, [currentUser]);

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
      const storedRsvpEvents = await AsyncStorage.getItem(`rsvpEvents_${currentUser.email}`);
      if (storedRsvpEvents) {
        setSavedEvents(JSON.parse(storedRsvpEvents));
      } else {
        setSavedEvents([]);
      }
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  const handleRSVP = async (event: EventProps) => {
    if (!currentUser) {
      Alert.alert('Error', 'User not found. Please sign in again.');
      return;
    }

    try {
      const storedRsvpEvents = await AsyncStorage.getItem(`rsvpEvents_${currentUser.email}`);
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      if (!rsvpEvents.some((e: { title: string }) => e.title === event.title)) {
        rsvpEvents.push(event);
        await AsyncStorage.setItem(`rsvpEvents_${currentUser.email}`, JSON.stringify(rsvpEvents));
        setSavedEvents(rsvpEvents);

        const storedAttendees = await AsyncStorage.getItem(`attendees_${event.title}`);
        const attendeesList = storedAttendees ? JSON.parse(storedAttendees) : [];
        attendeesList.push(currentUser);
        await AsyncStorage.setItem(`attendees_${event.title}`, JSON.stringify(attendeesList));

        Alert.alert('Success', 'You have RSVP\'d for this event!');
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
      const storedRsvpEvents = await AsyncStorage.getItem(`rsvpEvents_${currentUser.email}`);
      let rsvpEvents = storedRsvpEvents ? JSON.parse(storedRsvpEvents) : [];

      rsvpEvents = rsvpEvents.filter((event: any) => event.title !== title);
      await AsyncStorage.setItem(`rsvpEvents_${currentUser.email}`, JSON.stringify(rsvpEvents));
      setSavedEvents(rsvpEvents);

      const storedAttendees = await AsyncStorage.getItem(`attendees_${title}`);
      const attendeesList = storedAttendees ? JSON.parse(storedAttendees) : [];
      const updatedAttendeesList = attendeesList.filter((attendee: User) => attendee.email !== currentUser.email);
      await AsyncStorage.setItem(`attendees_${title}`, JSON.stringify(updatedAttendeesList));

      Alert.alert('Success', 'You have un-RSVP\'d for this event!');
    } catch (error) {
      console.error('Error handling un-RSVP:', error);
    }
  };

  return (
    <RSVPContext.Provider value={{ currentUser, savedEvents, loading, loadCurrentUser, loadRSVPedEvents, handleRSVP, handleUnRSVP }}>
      {children}
    </RSVPContext.Provider>
  );
};
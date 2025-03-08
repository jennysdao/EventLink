import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface AttendeeToggleProps {
  eventTitle: string;
}

const AttendeeToggle: React.FC<AttendeeToggleProps> = ({ eventTitle }) => {
  const [isAttendee, setIsAttendee] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [isRsvped, setIsRsvped] = useState(false); // ✅ Track RSVP status

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const latestUser = users[users.length - 1];
        setProfilePicture(latestUser.profilePicture || null);
      }

      // ✅ Check if user has RSVP'ed
      const storedRsvpEvents = await AsyncStorage.getItem("rsvpEvents");
      if (storedRsvpEvents) {
        const rsvpEvents = JSON.parse(storedRsvpEvents);
        setIsRsvped(rsvpEvents.some((event: any) => event.title === eventTitle));
      }

      // ✅ Load attendees list
      const storedAttendees = await AsyncStorage.getItem(`attendees_${eventTitle}`);
      if (storedAttendees) {
        const attendeesList = JSON.parse(storedAttendees);
        setAttendees(attendeesList);
        setIsAttendee(attendeesList.includes(profilePicture));
      }
    } catch (error) {
      console.error("Error loading attendee data:", error);
    }
  };

  const toggleAttendeeStatus = async () => {
    try {
      let updatedAttendees = [...attendees];

      if (isAttendee) {
        updatedAttendees = updatedAttendees.filter((attendee) => attendee !== profilePicture);
      } else {
        if (profilePicture) updatedAttendees.push(profilePicture);
      }

      await AsyncStorage.setItem(`attendees_${eventTitle}`, JSON.stringify(updatedAttendees));
      setAttendees(updatedAttendees);
      setIsAttendee(!isAttendee);
    } catch (error) {
      console.error("Error updating attendee status:", error);
    }
  };

  if (!isRsvped) return null; // ✅ Hide toggle if user isn't RSVP'ed

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Show me as an attendee</Text>
        <Switch value={isAttendee} onValueChange={toggleAttendeeStatus} />
      </View>

      <View style={styles.attendeesContainer}>
        {attendees.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.attendeeImage} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, alignItems: "center" },
  toggleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "80%", marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#3F587D" },
  attendeesContainer: { flexDirection: "row", marginTop: 10 },
  attendeeImage: { width: 40, height: 40, borderRadius: 20, marginRight: 5, borderWidth: 2, borderColor: "white" },
});

export default AttendeeToggle;
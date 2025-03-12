import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AttendeesListScreen: React.FC = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const [attendees, setAttendees] = useState<string[]>([]);

  useEffect(() => {
    loadAttendees();
  }, []);

  const loadAttendees = async () => {
    try {
      const storedAttendees = await AsyncStorage.getItem(`attendees_${title}`);
      if (storedAttendees) {
        setAttendees(JSON.parse(storedAttendees));
      }
    } catch (error) {
      console.error("Error loading attendees:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Attendees for {title}</Text>
      <View style={styles.attendeesContainer}>
        {attendees.map((attendee, index) => (
          <View key={index} style={styles.attendee}>
            <Image source={{ uri: attendee.profilePicture }} style={styles.attendeeImage} />
            <Text style={styles.attendeeName}>{attendee.name}</Text>
            <Text style={styles.attendeeEmail}>{attendee.email}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  backIcon: { position: "absolute", top: 50, left: 20, backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 50 },
  title: { fontSize: 24, fontWeight: "bold", color: "#3F587D", textAlign: "center", marginVertical: 20 },
  attendeesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  attendee: { alignItems: 'center', margin: 5 },
  attendeeImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'white' },
  attendeeName: { marginTop: 5, fontSize: 14, color: '#3F587D' },
  attendeeEmail: { fontSize: 12, color: '#748BAB' },
});

export default AttendeesListScreen;
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface EventProps {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
}

const SavedEventCard: React.FC<EventProps> = ({ title, date, about, address, requirements, imageUri }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() =>
        router.push({
          pathname: "/event",
          params: { title, date, about, address, requirements, imageUri },
        })
      }
    >
      {/* Event Image or Placeholder */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.eventImage} />
      ) : (
        <View style={styles.noImagePlaceholder}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      {/* Event Details */}
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventDate}>{new Date(String(date)).toDateString()}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {about}
        </Text>
        <Text style={styles.eventAddress}>{address || "Address TBD"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCard: { 
    flexDirection: "row",
    backgroundColor: "#E0E7F3", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
    width: "90%",
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
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#3F587D" },
  eventDate: { fontSize: 14, color: "#748BAB", marginTop: 2 },
  eventDescription: { fontSize: 14, color: "#3F587D", marginTop: 5 },
  eventAddress: { fontSize: 12, color: "#3F587D", marginTop: 5, fontStyle: "italic" },
});

export default SavedEventCard;

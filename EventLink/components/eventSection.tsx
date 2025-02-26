import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EventSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Going on Today</Text>
      <View style={styles.eventCardPlaceholder}>
        <Text style={styles.eventCardText}>No events yet.</Text>
      </View>
      <View style={styles.eventCardPlaceholder}>
        <Text style={styles.eventCardText}>No events yet.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 80,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: "bold",
    color: "#3F587D",
  },
  eventCardPlaceholder: {
    height: 100,
    backgroundColor: "#D0D9E8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  eventCardText: {
    fontSize: 16,
    color: "#3F587D",
  },
});

export default EventSection;

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import images from "../constants/images";
import { Stack } from "expo-router";

const UpdateEvent = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [title, setTitle] = useState(params?.title || "");
  const [about, setAbout] = useState(params?.about || "");
  const [address, setAddress] = useState(params?.address || "");
  const [requirements, setRequirements] = useState(params?.requirements || "");
  const [imageUri, setImageUri] = useState(params?.imageUri || null);
  const [date, setDate] = useState(
    typeof params?.date === "string" ? new Date(params.date) : new Date());
  const [time, setTime] = useState(
    typeof params?.time === "string" ? new Date(params.time) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, []);

  //  Load Event Details from AsyncStorage
  const loadEventDetails = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        const eventToEdit = events.find((event: any) => event.title === params.title);

        if (eventToEdit) {
          setTitle(eventToEdit.title);
          setAbout(eventToEdit.about);
          setAddress(eventToEdit.address);
          setRequirements(eventToEdit.requirements || "");
          setImageUri(eventToEdit.imageUri || null);
          setDate(new Date(eventToEdit.date));
          setTime(new Date(eventToEdit.time));
        }
      }
    } catch (error) {
      console.error("Error loading event details:", error);
    }
  };

  //  Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  //  Show Date & Time Pickers
  const openDatePicker = () => setShowDatePicker(true);
  const openTimePicker = () => setShowTimePicker(true);

  //  Handle Date & Time Changes
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) setTime(selectedTime);
    setShowTimePicker(false);
  };

  //  Save Updated Event
  const handleUpdateEvent = async () => {
    if (!title || !about || !address) {
      Alert.alert("Missing Fields", "Please fill in all required fields before updating.");
      return;
    }
  
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      let eventsList = storedEvents ? JSON.parse(storedEvents) : [];
  
      const updatedEvents = eventsList.map((event: any) =>
        event.title === params.title
          ? { 
              ...event, 
              title, 
              about, 
              address, 
              requirements, 
              imageUri, 
              date: date.toISOString(), 
              time: time.toISOString(),
              school: event.school // ✅ Preserve school assignment
            }
          : event
      );
  
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
  
      Alert.alert("Success", "Event has been updated!");
      router.push("/(tabs)/home");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  //  Delete Event
  const handleDeleteEvent = async () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const storedEvents = await AsyncStorage.getItem("events");
            let eventsList = storedEvents ? JSON.parse(storedEvents) : [];
  
            // Remove the event from the events list
            const updatedEvents = eventsList.filter((event: any) => event.title !== params.title);
            await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
  
            // Remove the event from all saved RSVP's
            const storedRSVPs = await AsyncStorage.getItem("rsvpEvents");
            let rsvpList = storedRSVPs ? JSON.parse(storedRSVPs) : [];
            const updatedRSVPs = rsvpList.filter((event: any) => event.title !== params.title);
            await AsyncStorage.setItem("rsvpEvents", JSON.stringify(updatedRSVPs));
  
            Alert.alert("Success", "Event has been deleted!");
            router.push("/(tabs)/home");
          } catch (error) {
            console.error("Error deleting event:", error);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <Image source={images.schoolBackground} style={styles.background} />
        <View style={styles.card}>
          {/*  Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close-outline" size={30} color="gray" />
          </TouchableOpacity>

          {/*  Image Upload */}
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {imageUri ? (
              <Image
                source={{ uri: Array.isArray(imageUri) ? imageUri[0] : imageUri || "" }}
                style={styles.uploadedImage}
              />
            ) : (
              <Ionicons name="image-outline" size={50} color="#A9A9A9" />
            )}
          </TouchableOpacity>

          {/* Event Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={Array.isArray(title) ? title.join(", ") : title || ""}
            onChangeText={setTitle}
          />
          {/* Date Picker */}
          <Text style={styles.label}>Event Date</Text>
          <TouchableOpacity style={styles.datePicker} onPress={openDatePicker}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} textColor="black"/>
          )}

          {/* Time Picker */}
          <Text style={styles.label}>Event Time</Text>
          <TouchableOpacity style={styles.datePicker} onPress={openTimePicker}>
            <Text style={styles.dateText}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={time} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onTimeChange} textColor="black"/>
          )}

          {/* About Section */}
          <Text style={styles.label}>About</Text>
          <TextInput
            style={styles.input}
            value={Array.isArray(about) ? about.join(", ") : about || ""}
            onChangeText={setAbout}
          />
          {/* Address Section */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={Array.isArray(requirements) ? requirements.join(", ") : requirements} 
            onChangeText={setRequirements}
          />

          {/* Requirements Section */}
          <Text style={styles.label}>Requirements</Text>
          <TextInput
            style={styles.input}
            value={Array.isArray(requirements) ? requirements.join(", ") : requirements} 
            onChangeText={setRequirements}
          />

          {/*  Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEvent}>
            <Text style={styles.saveText}>UPDATE EVENT</Text>
          </TouchableOpacity>

          {/*  Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
            <Text style={styles.deleteText}>DELETE EVENT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  background: { width: "100%", height: 200 },
  card: { backgroundColor: "white", borderRadius: 15, padding: 20, marginHorizontal: 20, marginTop: -50, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  closeButton: { alignSelf: "flex-end", padding: 5 },
  imageUpload: { alignSelf: "center", width: 100, height: 100, borderRadius: 10, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 10 },
  label: { fontSize: 14, fontWeight: "bold", color: "#3F587D", marginBottom: 5 },
  input: { backgroundColor: "#F5F5F5", borderRadius: 5, paddingHorizontal: 10, height: 45, fontSize: 16, marginBottom: 15 },
  datePicker: { backgroundColor: "#F5F5F5", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 15, alignItems: "center", marginBottom: 15 },
  dateText: { fontSize: 16, color: "#3F587D" },
  saveButton: { backgroundColor: "#3F587D", paddingVertical: 12, borderRadius: 5, alignItems: "center" },
  saveText: { color: "white", fontSize: 18, fontWeight: "bold" },
  deleteButton: { backgroundColor: "#D9534F", paddingVertical: 12, borderRadius: 5, alignItems: "center", marginTop: 10 },
  deleteText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default UpdateEvent;
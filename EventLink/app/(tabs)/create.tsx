import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import images from "../../constants/images";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [requirements, setRequirements] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();

  // ✅ Pick Image
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

  // ✅ Show Date & Time Pickers
  const openDatePicker = () => setShowDatePicker(true);
  const openTimePicker = () => setShowTimePicker(true);

  // ✅ Handle Date & Time Changes
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) setTime(selectedTime);
    setShowTimePicker(false);
  };

  // ✅ Save Event
  const handleShareEvent = async () => {
    if (!title || !about || !address) {
      Alert.alert("Missing Fields", "Please fill in all required fields before sharing.");
      return;
    }

    const storedUsers = await AsyncStorage.getItem("users");
    let creator = "Unknown User";

    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const latestUser = users[users.length - 1];
      creator = `${latestUser.firstName} ${latestUser.lastName}`;
    }

    const newEvent = { 
      title, 
      about, 
      address, 
      requirements, 
      imageUri, 
      creator, 
      date: date.toISOString(), 
      time: time.toISOString()
    };

    try {
      const existingEvents = await AsyncStorage.getItem("events");
      const eventsList = existingEvents ? JSON.parse(existingEvents) : [];
      eventsList.push(newEvent);
      await AsyncStorage.setItem("events", JSON.stringify(eventsList));

      Alert.alert("Success", "Event has been shared!");
      setTitle(""); setAbout(""); setAddress(""); setRequirements(""); setImageUri(null); setDate(new Date()); setTime(new Date());
      router.push("/(tabs)/home");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={images.schoolBackground} style={styles.background} />
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close-outline" size={24} color="gray" />
        </TouchableOpacity>

        {/* ✅ Image Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
          ) : (
            <Ionicons name="image-outline" size={50} color="#A9A9A9" />
          )}
        </TouchableOpacity>

        {/* Event Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Event Name" value={title} onChangeText={setTitle} />

        {/* ✅ Date Picker */}
        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={openDatePicker}>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} textColor="black"/>
        )}

        {/* ✅ Time Picker */}
        <Text style={styles.label}>Event Time</Text>
        <TouchableOpacity style={styles.datePicker} onPress={openTimePicker}>
          <Text style={styles.dateText}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker value={time} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onTimeChange} textColor="black"/>
        )}

        {/* Event Description */}
        <Text style={styles.label}>About</Text>
        <TextInput style={styles.input} placeholder="Describe your event" value={about} onChangeText={setAbout} />

        {/* Event Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Event Address" value={address} onChangeText={setAddress} />

        {/* ✅ Requirements Input */}
        <Text style={styles.label}>Requirements</Text>
        <TextInput style={styles.input} placeholder="Any restrictions (optional)" value={requirements} onChangeText={setRequirements} />

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShareEvent}>
          <Text style={styles.shareText}>SHARE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { width: "100%", height: 200 },
  card: { backgroundColor: "white", borderRadius: 15, padding: 20, marginHorizontal: 20, marginTop: -50, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  closeButton: { alignSelf: "flex-end" },
  imageUpload: { alignSelf: "center", width: 100, height: 100, borderRadius: 10, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 10 },
  label: { fontSize: 14, fontWeight: "bold", color: "#3F587D", marginBottom: 5 },
  input: { backgroundColor: "#F5F5F5", borderRadius: 5, paddingHorizontal: 10, height: 45, fontSize: 16, marginBottom: 15 },
  datePicker: { backgroundColor: "#F5F5F5", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 15, alignItems: "center", marginBottom: 15 },
  dateText: { fontSize: 16, color: "#3F587D" },
  shareButton: { backgroundColor: "#3F587D", paddingVertical: 12, borderRadius: 5, alignItems: "center" },
  shareText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default CreateEvent;

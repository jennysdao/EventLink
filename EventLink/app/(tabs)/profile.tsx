import React, { useState, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "../../components/Profile";
import MyEvents from "../(tabs)/saved";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const [userName, setUserName] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchUserData = async () => {
    try {
      const storedSchool = await AsyncStorage.getItem("selectedSchool");
      const storedUsers = await AsyncStorage.getItem("users");
      const storedProfileImage = await AsyncStorage.getItem("profileImage");

      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const latestUser = users[users.length - 1];
        setUserName(`${latestUser.firstName} ${latestUser.lastName}`);
      }
      if (storedSchool) setSelectedSchool(storedSchool);
      if (storedProfileImage) setProfileImage(storedProfileImage);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Profile
        userName={userName}
        selectedSchool={selectedSchool || "Unknown School"}
        profileImage={profileImage}
        onPickImage={pickImage}
      />
      {/* Display RSVP'd events below the profile */}
      <MyEvents />
    </ScrollView>
  );
};

export default ProfileScreen;

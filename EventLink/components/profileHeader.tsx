import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import images from "../constants/images";

interface ProfileHeaderProps {
    userName: string;
    selectedSchool: string;
    profilePicture?: string;  // ✅ Add this line
  }
  

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName, selectedSchool }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const latestUser = users[users.length - 1];
          setProfilePicture(latestUser.profilePicture || null);
        }
      } catch (error) {
        console.error("Error loading profile picture:", error);
      }
    };

    loadProfilePicture();
  }, []);

  // ✅ Image Picker Function
  const pickProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newProfilePicture = result.assets[0].uri;
      setProfilePicture(newProfilePicture);

      // ✅ Save the new profile picture in AsyncStorage
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        let users = JSON.parse(storedUsers);
        users[users.length - 1].profilePicture = newProfilePicture;
        await AsyncStorage.setItem("users", JSON.stringify(users));
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Profile Picture Upload */}
      <TouchableOpacity onPress={pickProfilePicture} style={styles.profileContainer}>
        <Image 
          source={profilePicture ? { uri: profilePicture } : images.profilePlaceholder} 
          style={styles.profileImage} 
        />
        <View style={styles.editIcon}>
          <Ionicons name="camera-outline" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* User Details */}
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.schoolName}>{selectedSchool}</Text>

      {/* Change School Button */}
      <TouchableOpacity onPress={() => router.push("/(auth)/school-select")}>
        <Text style={styles.changeSchool}>Change my school</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingBottom: 30,
    backgroundColor: "#4C5D7D",
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 50,
  },
  profileContainer: { position: "relative" },
  profileImage: { width: 300, height: 300, borderRadius: 400, borderWidth: 2, borderColor: "white", marginBottom: 20 },
  editIcon: { position: "absolute", bottom: 40, right: 135, backgroundColor: "#3F587D", borderRadius: 15, padding: 5 },
  userName: { fontSize: 22, fontWeight: "bold", color: "white", marginTop: 10 },
  schoolName: { fontSize: 16, color: "#ABC1E2", marginBottom: 5 },
  changeSchool: { fontSize: 14, color: "#ABC1E2", textDecorationLine: "underline" },
});

export default ProfileHeader;

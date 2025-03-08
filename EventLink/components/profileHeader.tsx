import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, BackHandler } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import images from "../constants/images";

interface ProfileHeaderProps {
    userName: string;
    selectedSchool: string;
    profilePicture?: string;
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

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

      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        let users = JSON.parse(storedUsers);
        users[users.length - 1].profilePicture = newProfilePicture;
        await AsyncStorage.setItem("users", JSON.stringify(users));
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: async () => {
          try {
            router.replace("/(auth)/sign-in"); // Prevent navigating back to logged-in state
          } catch (error) {
            console.error("Error logging out:", error);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={pickProfilePicture} style={styles.profileContainer}>
        <Image 
          source={profilePicture ? { uri: profilePicture } : images.profilePlaceholder} 
          style={styles.profileImage} 
        />
        <View style={styles.editIcon}>
          <Ionicons name="camera-outline" size={20} color="white" />
        </View>
      </TouchableOpacity>

      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.schoolName}>{selectedSchool}</Text>

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
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#D9534F",
    padding: 10,
    borderRadius: 20,
  },
  profileContainer: { position: "relative" },
  profileImage: { width: 300, height: 300, borderRadius: 400, borderWidth: 2, borderColor: "white", marginBottom: 20 },
  editIcon: { position: "absolute", bottom: 40, right: 135, backgroundColor: "#3F587D", borderRadius: 15, padding: 5 },
  userName: { fontSize: 22, fontWeight: "bold", color: "white", marginTop: 10 },
  schoolName: { fontSize: 16, color: "#ABC1E2", marginBottom: 5 },
  changeSchool: { fontSize: 14, color: "#ABC1E2", textDecorationLine: "underline" },
});

export default ProfileHeader;

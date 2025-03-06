import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import images from "../constants/images";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
  userName: string;
  selectedSchool: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName, selectedSchool }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      {/* Profile Image */}
      <Image source={images.schoolBackground} style={styles.profileImage} />

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
    paddingTop: 50,
  },
  profileImage: { width: 300, height: 300, borderRadius: 400, marginBottom: 40 },
  userName: { fontSize: 22, fontWeight: "bold", color: "white" },
  schoolName: { fontSize: 16, color: "#ABC1E2", marginBottom: 5 },
  changeSchool: { fontSize: 14, color: "#ABC1E2", textDecorationLine: "underline" },
});

export default ProfileHeader;

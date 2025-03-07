import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Handle Profile Picture Selection
  const pickProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // ✅ Handle Sign Up
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    try {
      // ✅ Retrieve stored users
      const storedUsers = await AsyncStorage.getItem("users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
  
      const lowerCaseEmail = email.toLowerCase(); // Ensure consistency
  
      // ✅ Check if the email is already registered
      if (usersList.some((user: any) => user.email === lowerCaseEmail)) {
        Alert.alert("Error", "An account with this email already exists.");
        return;
      }
  
      // ✅ Create new user object
      const newUser = {
        id: lowerCaseEmail, // ✅ Use email as user ID
        firstName,
        lastName,
        email: lowerCaseEmail, // Store email in lowercase for consistency
        password,
        selectedSchool, // ✅ Ensure school is included
        profilePicture: profilePicture || null, // Optional profile picture
      };
  
      // ✅ Store new user in AsyncStorage
      usersList.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(usersList));
  
      Alert.alert("Success", "Account created successfully!");
      router.push("/(auth)/sign-in"); // ✅ Navigate to sign-in screen after success
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  return (
    <View style={styles.formContainer}>
      {/* ✅ Profile Picture Selection */}
      <TouchableOpacity onPress={pickProfilePicture} style={styles.profileImageContainer}>
      <View style={styles.editIconContainer}>
          <Ionicons name="camera-outline" size={20} color="white" />
        </View>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#A9A9A9" />
        )}

        {/* ✅ Edit Icon Overlay */}
       
      </TouchableOpacity>

      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry value={password} onChangeText={setPassword} />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have an account? */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
          <Text style={styles.signInLink}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#3F587D",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: -25,
    right: 35,
    backgroundColor: "#3F587D",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#2A3B55",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    color: "white",
  },
  signUpButton: {
    backgroundColor: "#3F587D",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 1,
  },
  signUpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  signInText: {
    color: "#A9A9A9",
    fontSize: 14,
  },
  signInLink: {
    color: "#ABC1E2",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SignUpForm;

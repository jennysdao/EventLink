import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();

  // Load users from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, []);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const lowerCaseEmail = email.toLowerCase();

    const userExists = users.find((user) => user.email === lowerCaseEmail);
    if (userExists) {
      Alert.alert("Error", "Email already in use.");
      return;
    }

    // Create a new user and add to local storage
    const newUser: User = {
      id: users.length + 1,
      firstName,
      lastName,
      email: lowerCaseEmail, // Store email in lowercase
      password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

    Alert.alert("Success", "Account created successfully!", [
      { text: "OK", onPress: () => router.push("/(auth)/sign-in") },
    ]);
  };

  return (
    <View style={styles.formContainer}>
      {/* First Name & Last Name - Side by Side */}
      <View style={styles.nameContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#A9A9A9"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#A9A9A9"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter E-mail"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
          <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
          <Ionicons name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already Have an Account? Go to Sign In */}
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
  nameContainer: {
    flexDirection: "row", // ✅ Align inputs side by side
    justifyContent: "space-between",
  },
  inputWrapper: {
    flex: 1, // ✅ Allows equal spacing
    marginRight: 10, // Adds spacing between first and last name
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
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  signUpButton: {
    backgroundColor: "#1f2c40",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  signUpButtonText: {
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

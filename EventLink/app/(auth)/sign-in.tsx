import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "expo-checkbox"; // Install using `expo install expo-checkbox`
import images from "../../constants/images"; // Ensure this path is correct

const { width, height } = Dimensions.get("window");

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
        {/* Logo at the Top */}
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter E-mail"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Remember Me Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? "#3F587D" : undefined}
            />
            <Text style={styles.checkboxText}>Remember login</Text>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3F587D", // Matches the gradient-like background
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20, // Adds space between the logo and title
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#1f2c40",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android shadow
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
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: "white",
  },
  signInButton: {
    backgroundColor: "#3F587D",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignIn;

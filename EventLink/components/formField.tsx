import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Checkbox } from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Import router

interface FormFieldProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
}

const FormField: React.FC<FormFieldProps> = ({ email, setEmail, password, setPassword, rememberMe, setRememberMe }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter(); // ✅ Initialize router

  return (
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

      {/* Password Input with Toggle */}
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

      {/* Remember Me Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? "#3F587D" : undefined} />
        <Text style={styles.checkboxText}>Remember login</Text>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* "Create an Account" Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>First time here?</Text>
        <TouchableOpacity onPress={() => router.push("/sign-up")}>
          <Text style={styles.signUpLink}> Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15, // Spacing before the Sign Up link
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  signUpText: {
    color: "#A9A9A9",
    fontSize: 14,
  },
  signUpLink: {
    color: "#ABC1E2",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FormField;

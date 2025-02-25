import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import SignUpForm from "../../components/signUpForm"; // ✅ Import SignUpForm component

const { width, height } = Dimensions.get("window");

const SignUp = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
        {/* Logo at the Top */}
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />

        {/* Title */}
        <Text style={styles.title}>Welcome to EventLink!</Text>

        {/* Sign Up Form */}
        <SignUpForm />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1f2c40",
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
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
});

export default SignUp;

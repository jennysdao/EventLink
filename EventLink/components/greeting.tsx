import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import images from "../constants/images";

interface GreetingProps {
  userName: string;
  selectedSchool: string;
}

const Greeting: React.FC<GreetingProps> = ({ userName, selectedSchool }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {userName}!</Text>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.schoolText}>Events at</Text>
      <Text style={styles.schoolName}>{selectedSchool}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "light",
    color: "white",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  schoolText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Greeting;

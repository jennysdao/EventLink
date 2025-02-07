import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Use expo-linear-gradient
import images from "../constants/images";
import { Redirect, router } from "expo-router";
import ContinueButton from "../components/continueButton"; // ✅ Import Button Component


const { width, height } = Dimensions.get("window");

export default function Index() {
  return (
    <LinearGradient
      colors={["#748BAB", "#3F587D"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.titleContainer}>
          <Text style={styles.eventText}>Event</Text>
          <Text style={styles.linkText}>Link</Text>
        </View>
        <Text style={styles.poweredBy}>Powered by Agile Aces</Text>
        <ContinueButton text="Continue" />
      </View>

      <Image source={images.waves} style={styles.waves} resizeMode="contain" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 191,
    height: 114,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventText: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  linkText: {
    fontSize: 32,
    fontWeight: "500",
    color: "white",
  },
  poweredBy: {
    fontSize: 13,
    color: "#ABC1E2",
    fontWeight: "400",
    marginTop: 5,
  },
  continueButton: {
    bottom: -30,
    backgroundColor: "#ABC1E2", // Light blue button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3F587D",
  },
  waves: {
    position: "absolute",
    bottom: -1000, 
    width: width * 4,
    height: height * 3,
  },
});

import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Use expo-linear-gradient
import images from "../constants/images";

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
      </View>

      {/* Waves Image Positioned at the Bottom */}
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
    flex: 1, // Allows the content to take up the space above waves
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
  waves: {
    position: "absolute",
    bottom: -1000, // Moves the waves slightly down to make it cover more
    width: width * 4, // Makes it even wider (150% of screen width)
    height: height * 3, // Covers 60% of the screen height
  },
});

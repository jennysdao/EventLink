import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Tabs } from "expo-router";
import images from "../constants/images";
import { RSVPProvider } from '../utils/RSVPContext';
import ContinueButton from "../components/continueButton"; // ✅ Import Button Component

const { width, height } = Dimensions.get("window");

export default function Index() {
  return (
    <View style={styles.container}>
          {/* Waves Positioned at Bottom */}
      <Image source={images.waves} style={styles.waves} resizeMode="contain" />
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.titleContainer}>
        <Text style={styles.eventText}>Event</Text>
        <Text style={styles.linkText}>Link</Text>
      </View>
      <Text style={styles.poweredBy}>Powered by Agile Aces</Text>
      <ContinueButton text="Continue" />

      {/* Navigational Tabs */}
      <Tabs>
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3F587D", // Set a solid background color for now
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
    bottom: -1000, 
    width: width * 4,
    height: height * 3,
  },
});


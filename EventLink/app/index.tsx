import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* EventLink: Bigger & Bold */}
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>EventLink</Text>
      
      <StatusBar style="auto" />

      {/* Go to Profile: Smaller & Blue */}
      <Link href="/home" style={{ fontSize: 18, color: "blue" }}> 
        Go to Home 
      </Link>
    </View>
  );
}

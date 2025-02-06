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
      <Text>EventLink</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{ color: "blue" }}> 
        Go to Profile 
      </Link>
    </View>
  );
}

import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface ContinueButtonProps {
  text: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ text }) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isPressed ? "#3F587D" : "#ABC1E2" }]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => router.push('/sign-in')}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default ContinueButton;

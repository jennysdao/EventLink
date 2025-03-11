import { StyleSheet, Text, View } from 'react-native';
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { RSVPProvider } from '../utils/RSVPContext';


import React from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight-BETA": require("../assets/fonts/Inter-ExtraLight-BETA.ttf"),
    "Inter-ExtraLightItalic-BETA": require("../assets/fonts/Inter-ExtraLightItalic-BETA.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic.ttf"),
    "Inter-Light-BETA": require("../assets/fonts/Inter-Light-BETA.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RSVPProvider>
    <Stack
      screenOptions={{
        gestureEnabled: false, // 🔒 Prevents swipe-back navigation globally
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event" options={{ headerShown: false }} />     
      <Stack.Screen name="updateEvent" options={{ headerShown: false }} />
      <Stack.Screen name="search/searchQuery" options={{ headerShown: false }} />
    </Stack>
    </RSVPProvider>

  );
};

export default RootLayout;

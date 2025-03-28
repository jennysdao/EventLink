import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Image, ScrollView, Text, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import images from "../../constants/images";
import SearchBar from "../../components/searchBar";
import Greeting from "../../components/greeting";
import EventSection from "../../components/eventSection";

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully!");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

// Call this function whenever you need to clear the storage

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [selectedSchool, setSelectedSchool] = useState("Select a school");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const router = useRouter();

  //  Fetch user & school data
  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(`${user.firstName} ${user.lastName}`);
      }
  
      const storedSchool = await AsyncStorage.getItem("selectedSchool");
      if (storedSchool) setSelectedSchool(storedSchool);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  

  const handleSearch = (query: string) => {
    if (query.trim() !== "") {
      router.push({
        pathname: "../search/searchQuery",
        params: { query },
      });
    }
  };
  

   //  Refresh Function (Pull-to-Refresh)
   const onRefresh = async () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => !prev); //  Toggle refresh state
    setRefreshing(false);
  };

  //  Auto-refresh when screen is revisited
  useFocusEffect(
    useCallback(() => {
      setRefreshTrigger((prev) => !prev); //  Triggers refresh
    }, [])
  );

  const debugStorage = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const storedSchool = await AsyncStorage.getItem("selectedSchool");
      console.log("🔎 Debugging AsyncStorage:");
      console.log("👤 Stored Users:", storedUsers ? JSON.parse(storedUsers) : "None");
      console.log("🎓 Stored Selected School:", storedSchool);
    } catch (error) {
      console.error("Error debugging storage:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    debugStorage();
  }, []);

  return (
    
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Background Image */}
      <Image source={images.schoolBg} style={styles.background} />

      {/* Overlay Section */}
      <View style={styles.overlay}>
        <Greeting userName={userName} selectedSchool={selectedSchool} />
        <SearchBar onSearch={(query) => {
          router.push({
            pathname: "../search/searchQuery",
            params: { query },  // Pass query to search screen
          });
        }} />


        {/* Change School Button */}
        <TouchableOpacity onPress={() => router.push("/(auth)/school-select")} style={styles.changeSchoolContainer}>
          <Text style={styles.changeSchool}>Change my school</Text>
        </TouchableOpacity>
      </View>

      {/* Events Section */}
      <EventSection refreshTrigger={refreshTrigger} userName={userName} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    height: 500, 
  },
  overlay: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -350, 
  },
  changeSchoolContainer: {
    marginTop: 30,
    alignSelf: "center", 
  },
  changeSchool: {
    color: "white",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});

export default Home;

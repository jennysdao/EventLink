import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import images from "../../constants/images";

const SchoolSelection = () => {
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const searchBarRef = useRef<View>(null);
  const router = useRouter();

  //  Static list with only 1 school for now
  const universityList = ["University of California Riverside"];

  const handleSearch = (text: string) => {
    setSearch(text);
    setShowDropdown(text.length > 0); // Show dropdown when typing
  };

  const handleSelectSchool = (school: string) => {
    setSelectedSchool(school);
    setSearch(school);
    setShowDropdown(false); // Hide dropdown after selection
  };

  const handleContinue = async () => {
    if (selectedSchool) {
      await AsyncStorage.setItem("selectedSchool", selectedSchool);
      router.push("/(tabs)/home"); //  Navigate to home after selection
    } else {
      Alert.alert("Error", "Please select a school before continuing.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={images.schoolBackground} style={styles.background} />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Ionicons name="link-outline" size={60} color="white" />
        <Text style={styles.title}>Connect with your People.</Text>

        {/* Search Bar */}
        <View
          style={styles.searchContainer}
          ref={searchBarRef}
          onLayout={(event) => {
            const { y, height } = event.nativeEvent.layout;
            setDropdownTop(y + height + 5); //  Dynamically set dropdown position
          }}
        >
          <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find your school"
            placeholderTextColor="gray"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Dropdown for Search Results */}
        {showDropdown && (
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={universityList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectSchool(item)}>
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Selected School Display */}
        {selectedSchool ? <Text style={styles.selectedSchool}>{selectedSchool}</Text> : null}

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        {/* Skip Option */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Text style={styles.skipText}>Continue without selecting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for readability
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 40,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "80%",
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  dropdown: {
    position: "absolute",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  selectedSchool: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: "#ABC1E2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  continueText: {
    color: "#3F587D",
    fontWeight: "bold",
    fontSize: 16,
  },
  skipText: {
    marginTop: 20,
    color: "white",
    textDecorationLine: "underline",
  },
});

export default SchoolSelection;

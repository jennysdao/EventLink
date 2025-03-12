import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch: (query: string) => void; // Ensure this prop is required
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit = () => {
    if (searchText.trim().length > 0) {
      onSearch(searchText);  // Only trigger search if there is text
      Keyboard.dismiss();     // Hide keyboard after submitting
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#748BAB" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Find events going on near you"
        placeholderTextColor="#A9B8D1"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        onSubmitEditing={handleSearchSubmit} // ✅ Search when user presses "Enter"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // ✅ Light blue background
    borderRadius: 25, // ✅ Fully rounded edges
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#3F587D", // ✅ Darker text for better contrast
  },
});

export default SearchBar;
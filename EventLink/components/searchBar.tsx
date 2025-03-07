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
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        style={styles.input}
        placeholder="Search events..."
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearchSubmit} // Only triggers search on return/enter key press
        returnKeyType="search" // Sets keyboard return button to "Search"
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Ionicons name="close" size={20} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7F3",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: "#333",
  },
});

export default SearchBar;

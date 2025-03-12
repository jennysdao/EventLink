import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";


interface ProfileProps {
 userName: string;
 selectedSchool: string;
 profileImage: string | null;
 onPickImage: () => Promise<void>;
}


const Profile: React.FC<ProfileProps> = ({ userName, selectedSchool }) => {
 const [profileImage, setProfileImage] = useState<string | null>(null);


 const pickImage = async () => {
   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [1, 1],
     quality: 1,
   });


   if (!result.canceled) {
     setProfileImage(result.assets[0].uri);
   }
 };


 return (
   <View style={styles.container}>
     {/* Cover Photo */}
     <TouchableOpacity onPress={pickImage} style={styles.coverPhotoContainer}>
       <Image
         style={styles.coverPhoto}
         source={{ uri: profileImage || "https://via.placeholder.com/300x300.png?text=Profile+Pic" }}
         resizeMode="cover"
       />
     </TouchableOpacity>


     {/* Profile Card */}
     <View style={styles.profileCard}>
       <Text style={styles.name}>{userName}</Text>
       <Text style={styles.university}>{selectedSchool}</Text>
       <TouchableOpacity>
         <Text style={styles.changeSchool}>Change my school</Text>
       </TouchableOpacity>
     </View>



   </View>
 );
};


export default Profile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6E7582", 
  },
  profileTitle: {
    marginTop: 50,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  coverPhotoContainer: {
    width: "90%",
    height: 200,
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  profileCard: {
    backgroundColor: "#4C5B6E",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  university: {
    fontSize: 16,
    color: "#dcdcdc",
    marginVertical: 5,
  },
  changeSchool: {
    fontSize: 14,
    color: "#85C1E9",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  goingToText: {
    marginTop: 30,
    marginLeft: 25,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  footerText: {
    marginVertical: 30,
    alignSelf: "center",
    fontSize: 14,
    color: "#ccc",
  },
});
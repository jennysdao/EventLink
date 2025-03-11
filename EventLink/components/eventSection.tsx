import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

//  Define the Event Type
interface Event {
  title: string;
  date: string;
  about: string;
  address: string;
  requirements?: string;
  imageUri?: string;
  creator: string;
  school: string;
}

interface EventSectionProps {
  refreshTrigger?: boolean; //  Receives a trigger from Home.tsx
  userName: string; //  Receive the current logged-in user
}

const EventSection: React.FC<EventSectionProps> = ({ refreshTrigger, userName }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sortOrder, setSortOrder] = useState<"soonest" | "latest">("soonest");
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [hosts, setHosts] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem("events");
      const storedUser = await AsyncStorage.getItem("currentUser");
  
      if (storedEvents && storedUser) {
        const events = JSON.parse(storedEvents);
        const user = JSON.parse(storedUser);
  
        // ✅ Filter events based on selected school
        let filteredEvents = events.filter((event: any) => event.school === user.selectedSchool);
        
        // ✅ Filter events by selected host
        if (selectedHost) {
          filteredEvents = filteredEvents.filter((event: Event) => event.creator === selectedHost);
        }

        // ✅ Sort events by date based on sortOrder
        const sortedEvents = filteredEvents.sort((a: Event, b: Event) => {
          return sortOrder === "soonest"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        });
  
        setEvents(sortedEvents);

        // ✅ Update the list of hosts
        const uniqueHosts = [...new Set(filteredEvents.map((event: Event) => event.creator))];
        setHosts(uniqueHosts as string[]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger, sortOrder, selectedHost]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Going on Near You</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === "soonest" ? "latest" : "soonest")}
        >
          <Ionicons
            name={sortOrder === "soonest" ? "arrow-down-outline" : "arrow-up-outline"}
            size={24}
            color="#3F587D"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsDropdownVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedHost ? selectedHost : "All Hosts"}
        </Text>
        <Ionicons name="chevron-down-outline" size={24} color="#3F587D" />
      </TouchableOpacity>
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedHost(null);
                  setIsDropdownVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>All Hosts</Text>
              </TouchableOpacity>
              {hosts.map((host) => (
                <TouchableOpacity
                  key={host}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedHost(host);
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{host}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() =>
                router.push({
                  pathname: "/event",
                  params: { 
                    title: item.title, 
                    about: item.about, 
                    address: item.address, 
                    requirements: item.requirements, 
                    imageUri: typeof item.imageUri === "string" ? item.imageUri : item.imageUri?.[0] || "",
                    date: typeof item.date === "string" ? item.date : item.date?.[0] || "",
                    creator: item.creator
                  },
                })
              }
            >
              {/* Event Image or Placeholder */}
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.eventImage} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}

              {/* Event Details */}
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{new Date(item.date).toDateString()}</Text>
                <Text style={styles.eventDescription}>{item.about}</Text>
                <Text style={styles.eventAddress}>{item.address}</Text>
                <Text style={styles.eventCreator}>Hosted by {item.creator}</Text>
              </View>

              {/*  Show Edit Icon if the Logged-in User is the Creator */}
              {userName === item.creator && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevents navigation when pressing edit
                    router.push({
                      pathname: "/updateEvent",
                      params: { 
                        title: item.title, 
                        about: item.about, 
                        address: item.address, 
                        requirements: item.requirements, 
                        imageUri: typeof item.imageUri === "string" ? item.imageUri : item.imageUri?.[0] || "",
                        date: typeof item.date === "string" ? item.date : item.date?.[0] || "",
                      },
                    });
                  }}
                >
                  <Ionicons name="create-outline" size={24} color="#3F587D" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No events yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 70 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 25, fontWeight: "bold", color: "#3F587D",},
  sortButton: { marginLeft: 10 },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#E0E7F3",
    borderRadius: 10,
    marginVertical: 10,
  },
  dropdownButtonText: { fontSize: 16, color: "#3F587D" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: { fontSize: 16, color: "#3F587D" },
  eventCard: { 
    backgroundColor: "#E0E7F3", 
    borderRadius: 10, 
    padding: 10, 
    marginTop:15,
    marginBottom: 10, 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between" //  Aligns edit icon correctly
  },
  eventDate: {
    fontSize: 14,
    color: "#3F587D",
    marginTop: 2,
  },
  
  eventImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  noImagePlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    backgroundColor: "#C0C7D0", 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 15 
  },
  noImageText: { color: "#3F587D", fontSize: 12 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#3F587D" },
  eventDescription: { fontSize: 14, color: "#3F587D", marginTop: 2 },
  eventAddress: { fontSize: 12, color: "#3F587D", marginTop: 2, fontStyle: "italic" },
  eventCreator: { fontSize: 12, color: "#3F587D", fontStyle: "italic", marginTop: 2 },
  editIcon: { padding: 10 }, //  Edit icon styling
  noEventsContainer: { 
    height: 100, 
    backgroundColor: "#D0D9E8", 
    borderRadius: 10, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  noEventsText: { fontSize: 16, color: "#3F587D" },
});

export default EventSection;1
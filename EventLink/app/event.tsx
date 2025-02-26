import React from "react";
import { useLocalSearchParams } from "expo-router";
import EventDetailsComponent from "../components/eventDetails";

const EventDetails = () => {
  const params = useLocalSearchParams();

  return (
    <EventDetailsComponent
      title={params.title as string}
      date={params.date as string}
      about={params.about as string}
      address={params.address as string}
      requirements={params.requirements as string}
      imageUri={params.imageUri as string}
    />
  );
};

export default EventDetails;

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EventSection from "../components/eventSection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

const mockEvents = [
    {
        title: "Event 1",
        date: new Date().toISOString(),
        about: "About Event 1",
        address: "Address 1",
        creator: "User1",
        school: "School1",
    },
    {
        title: "Event 2",
        date: new Date().toISOString(),
        about: "About Event 2",
        address: "Address 2",
        creator: "User2",
        school: "School1",
    },
];

const mockUser = {
    selectedSchool: "School1",
};

describe("EventSection", () => {
    beforeEach(() => {
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === "events") {
                return JSON.stringify(mockEvents);
            }
            if (key === "currentUser") {
                return JSON.stringify(mockUser);
            }
            return null;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", async () => {
        const { getByText } = render(<EventSection userName="User1" />);

        await waitFor(() => {
            expect(getByText("Event 1")).toBeTruthy();
            expect(getByText("Event 2")).toBeTruthy();
        });
    });

    it("filters events by host", async () => {
        const { getByText, getByTestId } = render(<EventSection userName="User1" />);

        await waitFor(() => {
            expect(getByText("Event 1")).toBeTruthy();
            expect(getByText("Event 2")).toBeTruthy();
        });

        fireEvent.press(getByTestId("dropdownButton"));
        fireEvent.press(getByText("User1"));

        await waitFor(() => {
            expect(getByText("Event 1")).toBeTruthy();
            expect(() => getByText("Event 2")).toThrow();
        });
    });

    it("sorts events by date", async () => {
        const { getByTestId, getAllByTestId } = render(<EventSection userName="User1" />);

        await waitFor(() => {
            const eventTitles = getAllByTestId("eventTitle").map((node) => node.children[0]);
            expect(eventTitles).toEqual(["Event 1", "Event 2"]);
        });

        fireEvent.press(getByTestId("sortButton"));

        await waitFor(() => {
            const eventTitles = getAllByTestId("eventTitle").map((node) => node.children[0]);
            expect(eventTitles).toEqual(["Event 2", "Event 1"]);
        });
    });

    it("filters events by time", async () => {
        const { getByText, getByTestId } = render(<EventSection userName="User1" />);

        await waitFor(() => {
            expect(getByText("Event 1")).toBeTruthy();
            expect(getByText("Event 2")).toBeTruthy();
        });

        fireEvent.press(getByTestId("timeFilterButton"));
        fireEvent.press(getByText("Going on This Month"));

        await waitFor(() => {
            expect(getByText("Event 1")).toBeTruthy();
            expect(getByText("Event 2")).toBeTruthy();
        });
    });
});
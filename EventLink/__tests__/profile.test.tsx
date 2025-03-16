import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ProfileScreen from "../app/(tabs)/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
}));

// Mock useFocusEffect
jest.mock("@react-navigation/native", () => ({
    useFocusEffect: jest.fn((callback) => callback()),
}));

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", async () => {
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            switch (key) {
                case "currentUser":
                    return JSON.stringify({ firstName: "John", lastName: "Doe", profilePicture: "profilePicUrl" });
                case "selectedSchool":
                    return "Test University";
                case "rsvpEvents":
                    return JSON.stringify([{ id: 1, name: "Event 1" }, { id: 2, name: "Event 2" }]);
                default:
                    return null;
            }
        });

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText("John Doe")).toBeTruthy();
            expect(getByText("Test University")).toBeTruthy();
            expect(getByText("Going To")).toBeTruthy();
        });
    });

    it("handles empty AsyncStorage values", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(<ProfileScreen />);

        await waitFor(() => {
            expect(getByText("User")).toBeTruthy();
            expect(getByText("University")).toBeTruthy();
        });
    });

    it("displays error message on AsyncStorage error", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("AsyncStorage error"));

        render(<ProfileScreen />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading profile data:", expect.any(Error));
        });

        consoleErrorSpy.mockRestore();
    });
});
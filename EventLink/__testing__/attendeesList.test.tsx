import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AttendeesListScreen from "../app/attendeesList";
import { useRouter } from "expo-router";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(() => ({ title: "Test Event" })),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

describe("AttendeesListScreen", () => {
    const mockRouter = { back: jest.fn() };
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
            JSON.stringify([
                { name: "John Doe", email: "john@example.com", profilePicture: "https://example.com/john.jpg" },
            ])
        );

        const { getByText, getByTestId } = render(<AttendeesListScreen />);

        await waitFor(() => {
            expect(getByText("Attendees for Test Event")).toBeTruthy();
            expect(getByText("John Doe")).toBeTruthy();
            expect(getByText("john@example.com")).toBeTruthy();
        });
    });

    it("handles back button press", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
            JSON.stringify([
                { name: "John Doe", email: "john@example.com", profilePicture: "https://example.com/john.jpg" },
            ])
        );

        const { getByTestId } = render(<AttendeesListScreen />);

        await waitFor(() => {
            fireEvent.press(getByTestId("back-button"));
            expect(mockRouter.back).toHaveBeenCalled();
        });
    });

    it("displays error message when loading attendees fails", async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Failed to load"));

        const { getByText } = render(<AttendeesListScreen />);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error loading attendees:", expect.any(Error));
        });
    });
});
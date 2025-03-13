import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import CreateEvent from "../app/(tabs)/create";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import '@testing-library/jest-dom/extend-expect';

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: "Images",
    },
}));

describe("CreateEvent", () => {
    const mockRouter = { back: jest.fn(), push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { getByPlaceholderText, getByText } = render(<CreateEvent />);
        expect(getByPlaceholderText("Event Name")).toBeTruthy();
        expect(getByPlaceholderText("Describe your event")).toBeTruthy();
        expect(getByPlaceholderText("Event Address")).toBeTruthy();
        expect(getByPlaceholderText("Any restrictions (optional)")).toBeTruthy();
        expect(getByText("SHARE")).toBeTruthy();
    });

    it("shows an alert if required fields are missing", async () => {
        const { getByText } = render(<CreateEvent />);
        fireEvent.press(getByText("SHARE"));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Missing Fields", "Please fill in all required fields before sharing.");
        });
    });

    it("saves event correctly", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({ firstName: "John", lastName: "Doe", selectedSchool: "Test School" }));
        const { getByPlaceholderText, getByText } = render(<CreateEvent />);

        fireEvent.changeText(getByPlaceholderText("Event Name"), "Test Event");
        fireEvent.changeText(getByPlaceholderText("Describe your event"), "This is a test event.");
        fireEvent.changeText(getByPlaceholderText("Event Address"), "123 Test St.");

        fireEvent.press(getByText("SHARE"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith("/(tabs)/home");
        });
    });
});
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SchoolSelection from "../app/(auth)/school-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () => ({
    setItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

describe("SchoolSelection", () => {
    const mockRouterPush = jest.fn();
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { getByPlaceholderText, getByText } = render(<SchoolSelection />);
        expect(getByPlaceholderText("Find your school")).toBeTruthy();
        expect(getByText("Connect with your People.")).toBeTruthy();
    });

    it("shows dropdown when typing in search bar", () => {
        const { getByPlaceholderText, getByText } = render(<SchoolSelection />);
        const searchInput = getByPlaceholderText("Find your school");

        fireEvent.changeText(searchInput, "University");

        expect(getByText("University of California Riverside")).toBeTruthy();
    });

    it("selects a school from the dropdown", () => {
        const { getByPlaceholderText, getByText } = render(<SchoolSelection />);
        const searchInput = getByPlaceholderText("Find your school");

        fireEvent.changeText(searchInput, "University");
        fireEvent.press(getByText("University of California Riverside"));

        expect(searchInput.props.value).toBe("University of California Riverside");
    });

    it("shows an alert if continue is pressed without selecting a school", async () => {
        const { getByText } = render(<SchoolSelection />);
        const continueButton = getByText("Continue");

        fireEvent.press(continueButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Please select a school before continuing.");
        });
    });

    it("navigates to home and saves selected school when continue is pressed", async () => {
        const { getByPlaceholderText, getByText } = render(<SchoolSelection />);
        const searchInput = getByPlaceholderText("Find your school");

        fireEvent.changeText(searchInput, "University");
        fireEvent.press(getByText("University of California Riverside"));
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith("selectedSchool", "University of California Riverside");
            expect(mockRouterPush).toHaveBeenCalledWith("/(tabs)/home");
        });
    });

    it("navigates to home when skip is pressed", () => {
        const { getByText } = render(<SchoolSelection />);
        const skipButton = getByText("Continue without selecting");

        fireEvent.press(skipButton);

        expect(mockRouterPush).toHaveBeenCalledWith("/(tabs)/home");
    });
});
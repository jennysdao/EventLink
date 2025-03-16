import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../app/(tabs)/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
    useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock("../../components/searchBar", () => "SearchBar");
jest.mock("../../components/greeting", () => "Greeting");
jest.mock("../../components/eventSection", () => "EventSection");

describe("Home Screen", () => {
    const mockRouterPush = jest.fn();
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
        jest.clearAllMocks();
    });

    it("renders correctly", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
            JSON.stringify({ firstName: "John", lastName: "Doe" })
        );
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("Test School");

        const { getByText } = render(<Home />);

        await waitFor(() => {
            expect(getByText("John Doe")).toBeTruthy();
            expect(getByText("Test School")).toBeTruthy();
        });
    });

    it("navigates to search screen on search", async () => {
        const { getByPlaceholderText } = render(<Home />);
        const searchBar = getByPlaceholderText("Search...");

        fireEvent.changeText(searchBar, "test query");
        fireEvent(searchBar, "submitEditing");

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith({
                pathname: "../search/searchQuery",
                params: { query: "test query" },
            });
        });
    });

    it("navigates to school select screen on button press", () => {
        const { getByText } = render(<Home />);
        const changeSchoolButton = getByText("Change my school");

        fireEvent.press(changeSchoolButton);

        expect(mockRouterPush).toHaveBeenCalledWith("/(auth)/school-select");
    });

    it("refreshes data on pull-to-refresh", async () => {
        const { getByTestId } = render(<Home />);
        const scrollView = getByTestId("scrollView");

        fireEvent.scroll(scrollView, {
            nativeEvent: {
                contentOffset: { y: -100 },
            },
        });

        await waitFor(() => {
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("currentUser");
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("selectedSchool");
        });
    });
});
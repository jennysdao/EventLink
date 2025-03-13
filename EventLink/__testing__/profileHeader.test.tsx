import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileHeader from "../components/profileHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useRSVP } from "../utils/RSVPContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../utils/RSVPContext", () => ({
    useRSVP: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: "Images",
    },
}));

const mockRouter = { replace: jest.fn(), push: jest.fn() };
const mockSetCurrentUser = jest.fn();

describe("ProfileHeader", () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useRSVP as jest.Mock).mockReturnValue({ setCurrentUser: mockSetCurrentUser });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with given props", () => {
        const { getByText } = render(
            <ProfileHeader userName="John Doe" selectedSchool="Harvard" onProfilePictureUpdate={jest.fn()} />
        );

        expect(getByText("John Doe")).toBeTruthy();
        expect(getByText("Harvard")).toBeTruthy();
        expect(getByText("Change my school")).toBeTruthy();
    });

    it("handles logout correctly", async () => {
        const { getByTestId } = render(
            <ProfileHeader userName="John Doe" selectedSchool="Harvard" onProfilePictureUpdate={jest.fn()} />
        );

        fireEvent.press(getByTestId("logout-button"));

        await waitFor(() => {
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith("currentUser");
            expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
            expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)/sign-in");
        });
    });

    it("loads profile picture from AsyncStorage", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
            JSON.stringify({ profilePicture: "test-uri" })
        );

        const { getByTestId } = render(
            <ProfileHeader userName="John Doe" selectedSchool="Harvard" onProfilePictureUpdate={jest.fn()} />
        );

        await waitFor(() => {
            expect(getByTestId("profile-image").props.source).toEqual({ uri: "test-uri" });
        });
    });

    it("updates profile picture", async () => {
        const mockOnProfilePictureUpdate = jest.fn();
        const mockResult = { canceled: false, assets: [{ uri: "new-uri" }] };
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce(mockResult);

        const { getByTestId } = render(
            <ProfileHeader userName="John Doe" selectedSchool="Harvard" onProfilePictureUpdate={mockOnProfilePictureUpdate} />
        );

        fireEvent.press(getByTestId("profile-container"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "currentUser",
                JSON.stringify({ profilePicture: "new-uri" })
            );
            expect(mockOnProfilePictureUpdate).toHaveBeenCalledWith("new-uri");
        });
    });
});
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUpForm from "../components/signUpForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

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

describe("SignUpForm", () => {
    const mockRouterPush = jest.fn();
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { getByPlaceholderText, getByText } = render(<SignUpForm />);
        expect(getByPlaceholderText("Enter First Name")).toBeTruthy();
        expect(getByPlaceholderText("Enter Last Name")).toBeTruthy();
        expect(getByPlaceholderText("Enter Email")).toBeTruthy();
        expect(getByPlaceholderText("Enter Password")).toBeTruthy();
        expect(getByText("Sign Up")).toBeTruthy();
        expect(getByText("Already have an account?")).toBeTruthy();
    });

    it("shows error alert if required fields are missing", async () => {
        const { getByText } = render(<SignUpForm />);
        fireEvent.press(getByText("Sign Up"));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill in all required fields.");
        });
    });

    it("stores new user and navigates to sign-in screen on successful sign up", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const { getByPlaceholderText, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByPlaceholderText("Enter First Name"), "John");
        fireEvent.changeText(getByPlaceholderText("Enter Last Name"), "Doe");
        fireEvent.changeText(getByPlaceholderText("Enter Email"), "john.doe@example.com");
        fireEvent.changeText(getByPlaceholderText("Enter Password"), "password123");

        fireEvent.press(getByText("Sign Up"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "users",
                JSON.stringify([
                    {
                        id: "john.doe@example.com",
                        firstName: "John",
                        lastName: "Doe",
                        email: "john.doe@example.com",
                        password: "password123",
                        profilePicture: null,
                    },
                ])
            );
            expect(Alert.alert).toHaveBeenCalledWith("Success", "Account created successfully!");
            expect(mockRouterPush).toHaveBeenCalledWith("/(auth)/sign-in");
        });
    });

    it("handles profile picture selection", async () => {
        const mockImagePickerResult = {
            canceled: false,
            assets: [{ uri: "test-uri" }],
        };
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce(mockImagePickerResult);

        const { getByTestId } = render(<SignUpForm />);
        fireEvent.press(getByTestId("profile-picture-picker"));

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
            expect(getByTestId("profile-picture")).toHaveProp("source", { uri: "test-uri" });
        });
    });
});
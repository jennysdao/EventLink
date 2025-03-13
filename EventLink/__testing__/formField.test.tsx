import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FormField from "../components/formField";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRSVP } from "../utils/RSVPContext";

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock("../utils/RSVPContext", () => ({
    useRSVP: jest.fn(),
}));

describe("FormField", () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();
    const mockSetRememberMe = jest.fn();
    const mockPush = jest.fn();
    const mockSetCurrentUser = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useRSVP as jest.Mock).mockReturnValue({ setCurrentUser: mockSetCurrentUser });
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { getByPlaceholderText, getByText } = render(
            <FormField
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        expect(getByPlaceholderText("Enter E-mail")).toBeTruthy();
        expect(getByPlaceholderText("Enter Password")).toBeTruthy();
        expect(getByText("Sign In")).toBeTruthy();
        expect(getByText("Create an account")).toBeTruthy();
    });

    it("handles email input change", () => {
        const { getByPlaceholderText } = render(
            <FormField
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        const emailInput = getByPlaceholderText("Enter E-mail");
        fireEvent.changeText(emailInput, "test@example.com");

        expect(mockSetEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("handles password input change", () => {
        const { getByPlaceholderText } = render(
            <FormField
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        const passwordInput = getByPlaceholderText("Enter Password");
        fireEvent.changeText(passwordInput, "password123");

        expect(mockSetPassword).toHaveBeenCalledWith("password123");
    });

    it("toggles password visibility", () => {
        const { getByPlaceholderText, getByRole } = render(
            <FormField
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        const passwordInput = getByPlaceholderText("Enter Password");
        const eyeIcon = getByRole("button");

        fireEvent.press(eyeIcon);
        expect(passwordInput.props.secureTextEntry).toBe(false);

        fireEvent.press(eyeIcon);
        expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it("handles remember me checkbox change", () => {
        const { getByText } = render(
            <FormField
                email=""
                setEmail={mockSetEmail}
                password=""
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        const checkboxText = getByText("Remember login");
        fireEvent.press(checkboxText);

        expect(mockSetRememberMe).toHaveBeenCalledWith(true);
    });

    it("handles sign in with valid credentials", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
            JSON.stringify([{ email: "test@example.com", password: "password123", id: 1, name: "Test User" }])
        );

        const { getByText, getByPlaceholderText } = render(
            <FormField
                email="test@example.com"
                setEmail={mockSetEmail}
                password="password123"
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
                id: 1,
                name: "Test User",
            });
            expect(mockPush).toHaveBeenCalledWith("/(auth)/school-select");
        });
    });

    it("shows error alert with invalid credentials", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
            JSON.stringify([{ email: "test@example.com", password: "password123", id: 1, name: "Test User" }])
        );

        const { getByText, getByPlaceholderText } = render(
            <FormField
                email="wrong@example.com"
                setEmail={mockSetEmail}
                password="wrongpassword"
                setPassword={mockSetPassword}
                rememberMe={false}
                setRememberMe={mockSetRememberMe}
            />
        );

        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(mockSetCurrentUser).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});
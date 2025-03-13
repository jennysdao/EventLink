import React from "react";
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import UpdateEvent from "../app/updateEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(() => ({
        title: "Test Event",
        about: "This is a test event",
        address: "123 Test St",
        requirements: "None",
        imageUri: null,
        date: new Date().toISOString(),
        time: new Date().toISOString(),
    })),
}));

describe("UpdateEvent", () => {
    const mockRouter = { push: jest.fn(), back: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", async () => {
        const { getByText, getByPlaceholderText } = render(<UpdateEvent />);

        await waitFor(() => {
            expect(getByText("Title")).toBeTruthy();
            expect(getByPlaceholderText("Title")).toBeTruthy();
            expect(getByText("Event Date")).toBeTruthy();
            expect(getByText("Event Time")).toBeTruthy();
            expect(getByText("About")).toBeTruthy();
            expect(getByText("Address")).toBeTruthy();
            expect(getByText("Requirements")).toBeTruthy();
        });
    });

    it("loads event details from AsyncStorage", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
            JSON.stringify([
                {
                    title: "Test Event",
                    about: "This is a test event",
                    address: "123 Test St",
                    requirements: "None",
                    imageUri: null,
                    date: new Date().toISOString(),
                    time: new Date().toISOString(),
                },
            ])
        );

        const { getByDisplayValue } = render(<UpdateEvent />);

        await waitFor(() => {
            expect(getByDisplayValue("Test Event")).toBeTruthy();
            expect(getByDisplayValue("This is a test event")).toBeTruthy();
            expect(getByDisplayValue("123 Test St")).toBeTruthy();
            expect(getByDisplayValue("None")).toBeTruthy();
        });
    });

    it("updates event details", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
            JSON.stringify([
                {
                    title: "Test Event",
                    about: "This is a test event",
                    address: "123 Test St",
                    requirements: "None",
                    imageUri: null,
                    date: new Date().toISOString(),
                    time: new Date().toISOString(),
                },
            ])
        );

        const { getByText, getByPlaceholderText } = render(<UpdateEvent />);

        await waitFor(() => {
            fireEvent.changeText(getByPlaceholderText("Title"), "Updated Event");
            fireEvent.changeText(getByPlaceholderText("About"), "Updated about");
            fireEvent.changeText(getByPlaceholderText("Address"), "456 Updated St");
            fireEvent.changeText(getByPlaceholderText("Requirements"), "Updated requirements");
        });

        fireEvent.press(getByText("UPDATE EVENT"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "events",
                expect.stringContaining("Updated Event")
            );
            expect(mockRouter.push).toHaveBeenCalledWith("/(tabs)/home");
        });
    });

    it("deletes event", async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
            JSON.stringify([
                {
                    title: "Test Event",
                    about: "This is a test event",
                    address: "123 Test St",
                    requirements: "None",
                    imageUri: null,
                    date: new Date().toISOString(),
                    time: new Date().toISOString(),
                },
            ])
        );

        const { getByText } = render(<UpdateEvent />);

        fireEvent.press(getByText("DELETE EVENT"));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "events",
                expect.not.stringContaining("Test Event")
            );
            expect(mockRouter.push).toHaveBeenCalledWith("/(tabs)/home");
        });
    });
});
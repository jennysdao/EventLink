import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EventDetailsComponent from '../components/eventDetails';
import { useRSVP } from '../utils/RSVPContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../utils/RSVPContext');
jest.mock('expo-router');
jest.mock('@react-native-async-storage/async-storage');

const mockUseRSVP = useRSVP as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('EventDetailsComponent', () => {
    const mockEvent = {
        title: 'Sample Event',
        date: '2023-10-10',
        about: 'This is a sample event.',
        address: '123 Sample Street',
        requirements: 'None',
        imageUri: 'https://example.com/image.jpg',
        creator: 'John Doe',
    };

    const mockCurrentUser = { name: 'Jane Doe' };
    const mockHandleRSVP = jest.fn();
    const mockHandleUnRSVP = jest.fn();
    const mockLoadRSVPedEvents = jest.fn();

    beforeEach(() => {
        mockUseRSVP.mockReturnValue({
            currentUser: mockCurrentUser,
            handleRSVP: mockHandleRSVP,
            handleUnRSVP: mockHandleUnRSVP,
            savedEvents: [],
            loadRSVPedEvents: mockLoadRSVPedEvents,
        });

        mockUseRouter.mockReturnValue({ back: jest.fn() });

        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
    });

    it('renders event details correctly', () => {
        const { getByText } = render(<EventDetailsComponent {...mockEvent} />);

        expect(getByText('Sample Event')).toBeTruthy();
        expect(getByText('Tue Oct 10 2023')).toBeTruthy();
        expect(getByText('This is a sample event.')).toBeTruthy();
        expect(getByText('123 Sample Street')).toBeTruthy();
        expect(getByText('None')).toBeTruthy();
    });

    it('handles RSVP correctly', async () => {
        const { getByText } = render(<EventDetailsComponent {...mockEvent} />);

        const rsvpButton = getByText('RSVP');
        fireEvent.press(rsvpButton);

        await waitFor(() => {
            expect(mockHandleRSVP).toHaveBeenCalledWith(mockEvent);
            expect(mockLoadRSVPedEvents).toHaveBeenCalled();
        });
    });

    it('handles Un-RSVP correctly', async () => {
        mockUseRSVP.mockReturnValueOnce({
            currentUser: mockCurrentUser,
            handleRSVP: mockHandleRSVP,
            handleUnRSVP: mockHandleUnRSVP,
            savedEvents: [mockEvent],
            loadRSVPedEvents: mockLoadRSVPedEvents,
        });

        const { getByText } = render(<EventDetailsComponent {...mockEvent} />);

        const unrsvpButton = getByText('Un-RSVP');
        fireEvent.press(unrsvpButton);

        await waitFor(() => {
            expect(mockHandleUnRSVP).toHaveBeenCalledWith(mockEvent.title);
            expect(mockLoadRSVPedEvents).toHaveBeenCalled();
        });
    });

    it('toggles attendees list visibility', async () => {
        const { getByText, queryByText } = render(<EventDetailsComponent {...mockEvent} />);

        const viewAttendeesButton = getByText('View Attendees');
        fireEvent.press(viewAttendeesButton);

        await waitFor(() => {
            expect(queryByText('Hide Attendees')).toBeTruthy();
        });

        fireEvent.press(viewAttendeesButton);

        await waitFor(() => {
            expect(queryByText('View Attendees')).toBeTruthy();
        });
    });
});
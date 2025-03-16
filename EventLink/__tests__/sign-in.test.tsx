import React from 'react';
import { render, fireEvent, expect } from '@testing-library/react-native';
import SignIn from '../app/(auth)/sign-in';
import { describe, it } from 'node:test';

describe('SignIn Screen', () => {
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<SignIn />);

        expect(getByText('Sign In')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('updates email state on input change', () => {
        const { getByPlaceholderText } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');

        fireEvent.changeText(emailInput, 'test@example.com');
        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password state on input change', () => {
        const { getByPlaceholderText } = render(<SignIn />);
        const passwordInput = getByPlaceholderText('Password');

        fireEvent.changeText(passwordInput, 'password123');
        expect(passwordInput.props.value).toBe('password123');
    });

    it('toggles remember me checkbox', () => {
        const { getByTestId } = render(<SignIn />);
        const rememberMeCheckbox = getByTestId('rememberMeCheckbox');

        fireEvent.press(rememberMeCheckbox);
        expect(rememberMeCheckbox.props.accessibilityState.checked).toBe(true);

        fireEvent.press(rememberMeCheckbox);
        expect(rememberMeCheckbox.props.accessibilityState.checked).toBe(false);
    });
});
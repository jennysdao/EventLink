import React from 'react';
import { render } from '@testing-library/react-native';
import SignUp from '../app/(auth)/sign-up';
import { ReactTestInstance } from 'react-test-renderer';
import { describe, it, expect } from 'node:test';

describe('SignUp Screen', () => {
    it('renders correctly', () => {
        const { getByText, getByTestId } = render(<SignUp />);

        // Check if the logo is rendered
        const logo = getByTestId('logo');
        expect(logo).toBeTruthy();

        // Check if the title is rendered
        const title = getByText('Welcome to EventLink!');
        expect(title).toBeTruthy();

        // Check if the SignUpForm is rendered
        const signUpForm = getByTestId('signUpForm');
        expect(signUpForm).toBeTruthy();
    });
});



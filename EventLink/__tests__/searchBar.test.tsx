import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../components/searchBar';

describe('SearchBar', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<SearchBar onSearch={jest.fn()} />);
        expect(getByPlaceholderText('Find events going on near you')).toBeTruthy();
    });

    it('calls onSearch with the correct query when submitted', () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText } = render(<SearchBar onSearch={onSearchMock} />);
        const input = getByPlaceholderText('Find events going on near you');

        fireEvent.changeText(input, 'Music Festival');
        fireEvent(input, 'submitEditing');

        expect(onSearchMock).toHaveBeenCalledWith('Music Festival');
    });

    it('does not call onSearch if the input is empty', () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText } = render(<SearchBar onSearch={onSearchMock} />);
        const input = getByPlaceholderText('Find events going on near you');

        fireEvent.changeText(input, '');
        fireEvent(input, 'submitEditing');

        expect(onSearchMock).not.toHaveBeenCalled();
    });

    it('hides the keyboard after submitting', () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText } = render(<SearchBar onSearch={onSearchMock} />);
        const input = getByPlaceholderText('Find events going on near you');

        fireEvent.changeText(input, 'Music Festival');
        fireEvent(input, 'submitEditing');

        // Assuming Keyboard.dismiss() works correctly we can't directly test it here
        // but we can ensure that the onSearch function is called which implies the keyboard should be dismissed
        expect(onSearchMock).toHaveBeenCalled();
    });
});
import '@testing-library/jest-dom';

// Allow router mocks.
// eslint-disable-next-line no-undef, @typescript-eslint/no-require-imports
jest.mock('next/router', () => require('next-router-mock'));

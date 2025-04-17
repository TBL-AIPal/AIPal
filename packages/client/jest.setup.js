import '@testing-library/jest-dom';

// Allow router mocks.
// eslint-disable-next-line no-undef
jest.mock('next/router', () => require('next-router-mock'));

// 🧩 Fix scrollIntoView for JSDOM (Jest's DOM environment)
window.HTMLElement.prototype.scrollIntoView = function () {
    // no-op to silence JSDOM error
  };
  
  // ✅ Mock WebSocket for all tests
  global.WebSocket = class {
    onopen = () => {};
    onmessage = () => {};
    onclose = () => {};
    close = () => {};
    send = () => {};
    constructor() {
      setTimeout(() => this.onopen(), 10); // simulate connect
    }
  };
  
  // ✅ Provide fake env vars (so ws://undefined:undefined won't crash)
  process.env.NEXT_PUBLIC_SERVER_HOST = 'localhost';
  process.env.NEXT_PUBLIC_SERVER_PORT = '1234'; // dummy port
  

// __mocks__/react-markdown.js
const React = require('react');

module.exports = (props) => {
  return React.createElement('div', { 'data-testid': 'mock-markdown' }, props.children);
};

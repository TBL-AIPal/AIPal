class LLMError extends Error {
  constructor(model, message, isOperational = true, stack = '') {
    super(`${model}: ${message}`);
    this.model = model;
    this.isOperational = isOperational;
    this.userString = `${model} Error: ${message}`;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = LLMError;

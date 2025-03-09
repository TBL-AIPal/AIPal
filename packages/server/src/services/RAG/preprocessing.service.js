const { spawn } = require('child_process');
const path = require('path');
const logger = require('../../config/logger');

let pythonProcess;
let responseQueue = [];

// Initialize the Python process once
const initializePythonProcess = () => {
  const scriptPath = path.join(__dirname, 'preprocessing.py');
  pythonProcess = spawn('python', [scriptPath]);

  // Log Python errors
  pythonProcess.stderr.on('data', (data) => {
    logger.error(`Python stderr: ${data.toString()}`);
  });

  pythonProcess.on('error', (err) => {
    logger.error(`Failed to start Python process: ${err.message}`);
  });

  // Read stdout line-by-line
  let buffer = '';
  pythonProcess.stdout.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete lines in buffer
    lines.forEach((line) => {
      if (line.trim()) {
        // Resolve the oldest Promise
        responseQueue.shift()(JSON.parse(line));
      }
    });
  });
};

/**
 * Processes a batch of texts using the Python script.
 * @param {string[]} texts - An array of text chunks to process.
 * @returns {Promise<string[]>} - A promise that resolves to an array of processed texts.
 */
const processTextBatch = (texts) => {
  return new Promise((resolve, reject) => {
    // Add resolver to the queue
    responseQueue.push((result) => {
      if (result.error) {
        reject(new Error(result.error));
      } else {
        resolve(result);
      }
    });

    // Send input as a JSON line
    pythonProcess.stdin.write(`${JSON.stringify(texts)}\n`);
  });
};

/**
 * Processes a single text using the Python script.
 * @param {string} text - A single text to process.
 * @returns {Promise<string>} - A promise that resolves to the processed text.
 */
const processText = async (text) => {
  const results = await processTextBatch([text]);
  return results[0];
};

module.exports = {
  initializePythonProcess,
  processText,
  processTextBatch,
};

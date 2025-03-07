const { spawn } = require('child_process');
const path = require('path');
const logger = require('../../config/logger');

let pythonProcess;

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

  pythonProcess.on('close', (code) => {
    logger.error(`Python process closed with code ${code}`);
  });
};

/**
 * Processes a single text using the Python script.
 * @param {string} text - A single text to process.
 * @returns {Promise<string>} - A promise that resolves to the processed text.
 */
const processText = async (text) => {
  return new Promise((resolve, reject) => {
    let output = '';

    // Handle stdout data
    const onData = (data) => {
      output += data.toString();
    };

    const onClose = () => {
      try {
        const result = JSON.parse(output.trim());
        resolve(result[0]); // Extract the first result from the array
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    };

    const onError = (err) => {
      reject(err);
    };

    pythonProcess.stdout.on('data', onData);
    pythonProcess.on('close', onClose);
    pythonProcess.on('error', onError);

    logger.info('Sending input to Python process:', { text });
    // Send the single text as a JSON array
    pythonProcess.stdin.write(JSON.stringify([text]) + '\n');
    pythonProcess.stdin.end();

    // Cleanup listeners after processing
    pythonProcess.stdout.off('data', onData);
    pythonProcess.off('close', onClose);
    pythonProcess.off('error', onError);
  });
};

/**
 * Processes a batch of texts using the Python script.
 * @param {string[]} texts - An array of text chunks to process.
 * @returns {Promise<string[]>} - A promise that resolves to an array of processed texts.
 */
const processTextBatch = async (texts) => {
  return new Promise((resolve, reject) => {
    let output = '';

    // Handle stdout data
    const onData = (data) => {
      output += data.toString();
    };

    const onClose = () => {
      try {
        const results = JSON.parse(output.trim());
        resolve(results);
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    };

    const onError = (err) => {
      reject(err);
    };

    pythonProcess.stdout.on('data', onData);
    pythonProcess.on('close', onClose);
    pythonProcess.on('error', onError);

    logger.info('Sending input to Python process:', { texts });
    // Send the batch of texts as a JSON array
    pythonProcess.stdin.write(JSON.stringify(texts) + '\n');
    pythonProcess.stdin.end();

    // Cleanup listeners after processing
    pythonProcess.stdout.off('data', onData);
    pythonProcess.off('close', onClose);
    pythonProcess.off('error', onError);
  });
};

module.exports = {
  initializePythonProcess,
  processText,
  processTextBatch,
};

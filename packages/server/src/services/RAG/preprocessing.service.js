const { spawn } = require('child_process');
const path = require('path');
const logger = require('../../config/logger');

const processText = async (text) => {
  const scriptPath = path.join(__dirname, 'preprocessing.py');

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath]);

    // Send the PDF text to Python's stdin
    pythonProcess.stdin.write(text);
    pythonProcess.stdin.end();

    let output = '';
    let errorOutput = '';

    // Collect stdout data from Python
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString(); // Append data as string
    });

    // Collect stderr data from Python
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        logger.info('Python process completed successfully.');
        resolve(output.trim());
      } else {
        const errorMessage = `Python process failed with code ${code}: ${errorOutput}`;
        logger.error(errorMessage);
        reject(new Error(errorMessage));
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Failed to start Python process: ${err.message}`);
      reject(err);
    });
  });
};

module.exports = {
  processText,
};

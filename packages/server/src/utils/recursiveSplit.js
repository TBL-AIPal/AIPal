/**
 * Splits a given text into chunks of specified maximum length with optional overlap,
 * without breaking words.
 *
 * @param {string} text - The input text to be split into chunks.
 * @param {number} maxLength - The maximum allowed length for each chunk.
 * @param {number} overlap - The number of characters to overlap between consecutive chunks.
 * @returns {string[]} An array of text chunks, each within the specified maxLength.
 */
function recursiveSplit(text, maxLength, overlap = 0) {
  if (text.length <= maxLength) {
    return [text];
  }

  // Find the closest whitespace before the maxLength to avoid splitting words
  let splitIndex = text.lastIndexOf(' ', maxLength);

  // If no whitespace is found, use maxLength as the split point
  if (splitIndex === -1) {
    splitIndex = maxLength;
  }

  const chunk = text.slice(0, splitIndex).trim();
  const remainingText = text.slice(splitIndex).trim();

  // Determine the starting point for the next chunk with overlap
  const nextChunkStart = Math.max(0, splitIndex - overlap);

  // Create a new remaining text by taking the overlap into account
  const newRemainingText = remainingText
    .slice(Math.max(0, nextChunkStart - splitIndex))
    .trim();

  // Recursively split the remaining text and combine the results
  return [chunk, ...recursiveSplit(newRemainingText, maxLength, overlap)];
}

module.exports = recursiveSplit;

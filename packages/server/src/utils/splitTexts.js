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

/**
 * Splits pages into chunks with a specified overlap percentage between consecutive pages.
 *
 * @param {string[]} pagesText - An array of strings, where each string represents the text of a page.
 * @param {number} overlap - The percentage of overlap between consecutive pages (e.g., 0.25 for 25%).
 * @returns {string[]} An array of overlapping chunks, each combining text from one or two pages.
 */
function splitPagesWithOverlap(pagesText, overlap) {
  const chunks = [];

  for (let i = 0; i < pagesText.length; i++) {
    const currentPageText = pagesText[i];
    const nextPageText = pagesText[i + 1] || ''; // Next page text (if exists)

    // Calculate overlap length based on the current page's text length and the specified overlap percentage
    const overlapLength = Math.floor(currentPageText.length * overlap);
    const overlapText = nextPageText.slice(0, overlapLength);

    // Combine current page text with overlap from the next page
    const chunk = `${currentPageText}${overlapText}`;
    chunks.push(chunk);
  }

  return chunks;
}

module.exports = { recursiveSplit, splitPagesWithOverlap };

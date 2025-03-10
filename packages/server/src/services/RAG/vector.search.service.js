const mongoose = require('mongoose');
const { generateEmbedding } = require('./embedding.service');
const { processText } = require('./preprocessing.service');
const { Chunk } = require('../../models');
const logger = require('../../config/logger');

async function getContextualData(queryVector, documentIds) {
  try {
    const objectIdList = documentIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    // prettier-ignore
    const aggregate = [
      {
        '$vectorSearch': {
          'index': 'default',
          'path': 'embedding',
          'filter': {
            'document': {
              '$in': objectIdList,
            },
          },
          'queryVector': queryVector,
          'numCandidates': 20,
          'limit': 3,
        },
      },
      {
        '$project': {
          '_id': 0,
          'text': 1,
          'score': {
            '$meta': 'vectorSearchScore',
          },
        },
      },
    ];

    const results = await Chunk.aggregate(aggregate);

    logger.info('Search using Mongoose result:');
    results.forEach((doc) => logger.info(JSON.stringify(doc)));

    return results;
  } catch (error) {
    logger.error('getContextualDataError:', error);
    throw new Error(
      'Failed to query subset of documents for RAG. Check logs for details.',
    );
  }
}

const generateContextualizedQuery = async (query, apiKey, documentIds) => {
  try {
    // Generate embedding for query
    const normalizedQuery = await processText(query);
    const queryVector = await generateEmbedding(normalizedQuery, apiKey);

    // Use vector search to get relevant documents
    const result = await getContextualData(queryVector, documentIds);

    const arrayOfQueryDocs = await result;

    let textDocuments = '';
    arrayOfQueryDocs.forEach((doc) => {
      const string = `\n###CHUNK START###\n${doc.text}\n###CHUNK END###\n`;
      textDocuments += string;
    });

    // Append documents to the start of the query
    const prompt = `
      Use the following context to answer the question at the end. While you can include external information, prioritize details from the provided context. Note that it is not necessary for you to use all the information provided as some of the context may be irrelevant to the question. You may use the information as a starting point and expand more on it.

      Documents:
      ${textDocuments}
      End of Documents.

      Question:
      ${query}`;
    return prompt;
  } catch (error) {
    logger.error('generateContextualizedQueryError:', error);
    throw new Error(
      'Failed to generate text for context. Check logs for details.',
    );
  }
};

module.exports = {
  generateContextualizedQuery,
};

const { MongoClient } = require('mongodb');
const { generateEmbedding } = require('./embedding.service');
const config = require('../../config/config');
const { processText } = require('./preprocessing.service');

// TODO: Filter using the templateId
async function getContextualData(queryVector) {
  // Mongoose does not have support for do vector search in Atlas, thus we are using MongoDB
  const client = new MongoClient(config.mongodb.url);
  try {
    await client.connect();

    const db = client.db(config.mongodb.db);
    const collection = db.collection('documents');

    const aggregate = [
      {
        $vectorSearch: {
          index: 'default',
          path: 'embedding',
          queryVector,
          numCandidates: 20,
          limit: 1,
        },
      },
      {
        $project: {
          _id: 0,
          filename: 1,
          text: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
    ];

    const results = await collection.aggregate(aggregate).toArray();
    return results;
  } catch (error) {
    throw new Error('Failed to query subset of documents');
  } finally {
    await client.close();
  }
}

const generateContextualizedQuery = async (query) => {
  try {
    // Generate embedding for query
    const normalizedQuery = await processText(query);
    const queryVector = await generateEmbedding(normalizedQuery);

    // Use vector search to get relevant documents
    const result = await getContextualData(queryVector);

    const arrayOfQueryDocs = await result;

    let textDocuments = '';
    arrayOfQueryDocs.forEach((doc) => {
      const string = `\nTitle: ${doc.filename}\n${doc.text}\n\n`;
      textDocuments += string;
    });

    // Append documents to the start of the query
    const prompt = `
      Use the following context to answer the question at the end. 
      While you can include external information, prioritize details from the provided context.
      Note that it is not necessary for you to use all the information provided as some
      of the context may be irrelevant to the question. You may use the information as a starting
      point and expand more on it.

      Documents:
      ${textDocuments}
      End of Documents.

      Question:
      ${query}`;
    return prompt;
  } catch (error) {
    throw new Error('Failed to generate text');
  }
};

module.exports = {
  generateContextualizedQuery,
};

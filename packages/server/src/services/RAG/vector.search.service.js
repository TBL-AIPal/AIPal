const { MongoClient } = require('mongodb');
const { generateEmbedding } = require('./embedding.service');
const config = require('../../config/config');

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
    const queryVector = await generateEmbedding(query);

    // Use vector search to get relevant documents
    const result = await getContextualData(queryVector);

    const arrayOfQueryDocs = await result;

    let textDocuments = '';
    arrayOfQueryDocs.forEach((doc) => {
      const string = `${doc.text}\n\n`;
      textDocuments += string;
    });

    // Append documents to the start of the query
    const prompt = `Use the following pieces of context to answer the question at the end.
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

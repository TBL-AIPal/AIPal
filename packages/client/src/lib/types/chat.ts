export interface ChatMessage {
    id?: string; // Optional, only if messages are stored in a database
    roomId?: string; // Optional, useful for identifying messages per room
    sender: string; // ✅ Add sender (who sent the message)
    role: 'user' | 'assistant' | 'system'; // Defines who sent the message
    content: string; // The actual message content
    modelUsed?: string; // ✅ Track which AI model was used (optional)
    timestamp?: string; // Optional timestamp
  }
  
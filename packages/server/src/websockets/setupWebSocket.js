const WebSocket = require('ws');

const rooms = {}; // Store active rooms and connections

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server }); // ✅ Attach WebSocket to the existing HTTP server

  wss.on('connection', (ws, req) => {
    try {
      const urlParts = new URL(req.url, `http://${req.headers.host}`).pathname.split('/');
      const roomId = urlParts[urlParts.length - 1]; // Extract last segment as room ID

      if (!roomId) {
        ws.close(); // Close connection if no room ID
        return;
      }

      if (!rooms[roomId]) rooms[roomId] = new Set();
      rooms[roomId].add(ws);

      ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        // ✅ Broadcast the message to everyone else in the room
        rooms[roomId].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        });
      });

      ws.on('close', () => {
        rooms[roomId].delete(ws);
        if (rooms[roomId].size === 0) delete rooms[roomId];
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close();
    }
  });

  console.log('✅ WebSocket server attached to HTTP server');
};

module.exports = setupWebSocket;

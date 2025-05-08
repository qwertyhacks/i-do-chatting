const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend URL for security
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static("public")); // Serve index.html and frontend from /public

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", (data) => {
    // Broadcast message to all clients
    io.emit("chat message", {
      username: data.username,
      message: data.message
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// const activeStudents = {}; // Track active students and their sockets

// io.on("connection", (socket) => {
//   console.log("✅ New client connected");

//   socket.on("studentOnline", ({ studentId }) => {
//     console.log(`📢 Student ${studentId} is online`);

//     // If already logged in from another device
//     if (activeStudents[studentId]) {
//       console.log(`⚠️ Multiple login detected for Student ${studentId}`);
//       io.emit("multipleLoginAlert", { studentId });

//       // Force logout the previous session
//       activeStudents[studentId].emit("forceLogout");
//       activeStudents[studentId].disconnect();
//     }

//     activeStudents[studentId] = socket;
//     io.emit("updateOnlineStudents", Object.keys(activeStudents));
//   });

//   socket.on("student_cheating", ({ studentId, message }) => {
//     console.log(`🚨 Student ${studentId} is cheating! Reason: ${message}`);
//     io.emit("cheatingAlert", { studentId, message });
//   });

//   socket.on("disconnect", () => {
//     const studentId = Object.keys(activeStudents).find((id) => activeStudents[id] === socket);
//     if (studentId) {
//       delete activeStudents[studentId];
//       io.emit("updateOnlineStudents", Object.keys(activeStudents));
//     }
//     console.log("❌ Client disconnected");
//   });
// });

// // Use PORT from environment variable or default to 4000
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 WebSocket server running on port ${PORT}`);
// });
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const activeStudents = {}; // Track active students and their sockets
const eventLogs = {}; // Log of multiple login events for each student

io.on("connection", (socket) => {
  console.log("✅ New client connected");

  socket.on("studentOnline", ({ studentId }) => {
    console.log(`📢 Student ${studentId} is online`);

    // If already logged in from another device
    if (activeStudents[studentId]) {
      console.log(`⚠️ Multiple login detected for Student ${studentId}`);
      
      // Log the multiple login event
      if (!eventLogs[studentId]) {
        eventLogs[studentId] = {
          count: 0,
          message: `Multiple login attempts for Student ${studentId}`,
        };
      }
      eventLogs[studentId].count++;

      io.emit("forceLogout", { studentId, message: eventLogs[studentId].message, count: eventLogs[studentId].count });

      // Force logout the previous session
      activeStudents[studentId].emit("forceLogout");
      activeStudents[studentId].disconnect();
    }

    activeStudents[studentId] = socket;
    io.emit("updateOnlineStudents", Object.keys(activeStudents));
  });

  socket.on("student_cheating", ({ studentId, message }) => {
    console.log(`🚨 Student ${studentId} is cheating! Reason: ${message}`);
    io.emit("cheatingAlert", { studentId, message });
  });

  socket.on("disconnect", () => {
    const studentId = Object.keys(activeStudents).find((id) => activeStudents[id] === socket);
    if (studentId) {
      delete activeStudents[studentId];
      io.emit("updateOnlineStudents", Object.keys(activeStudents));
    }
    console.log("❌ Client disconnected");
  });
});

// Use PORT from environment variable or default to 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});

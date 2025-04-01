import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing WebSocket server...");
    io = new Server(res.socket.server, {
      cors: { origin: "*" },
    });

    const activeStudents = {}; // Track active students and their sockets

    io.on("connection", (socket) => {
      console.log("✅ New client connected");

      socket.on("studentOnline", ({ studentId }) => {
        console.log(`📢 Student ${studentId} is online`);

        // If already logged in from another device
        if (activeStudents[studentId]) {
          console.log(`⚠️ Multiple login detected for Student ${studentId}`);
          io.emit("multipleLoginAlert", { studentId });

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

    res.socket.server.io = io;
  } else {
    console.log("⚡ WebSocket server already running.");
  }
  res.end();
}






// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins (change this for security)
//   },
// });

// const activeStudents = {}; // Track active students

// io.on("connection", (socket) => {
//   console.log("✅ New client connected");

//   socket.on("studentOnline", ({ studentId }) => {
//     console.log(`📢 Student ${studentId} is online`);

//     // If the student is already online, force logout the previous session
//     if (activeStudents[studentId]) {
//       activeStudents[studentId].emit("forceLogout");
//       activeStudents[studentId].disconnect();
//     }

//     activeStudents[studentId] = socket;

//     io.emit("updateOnlineStudents", Object.keys(activeStudents));
//   });

//   // Handle cheating detection
//   socket.on("student_cheating", ({ studentId, message }) => {
//     console.log(`🚨 Student ${studentId} is cheating! Reason: ${message}`);

//     // Emit cheating alert to all connected admins
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

// const PORT = process.env.WS_PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 WebSocket server running on port ${PORT}`);
// });




import { Server } from "socket.io";

const io = new Server(3001, {
  cors: { origin: "*" }
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
    socket.userId = userId;
    console.log("User registered:", userId, "->", socket.id);
  });

  // User initiates a call
  socket.on("call-request", ({ fromUserId, toUserId }) => {
    const targetSocket = userSocketMap[toUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { fromUserId });
      console.log(`Call request from ${fromUserId} to ${toUserId}`);
    }
  });

  // Call accepted
  socket.on("call-accept", ({ fromUserId, toUserId }) => {
    const targetSocket = userSocketMap[toUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("call-accepted", { fromUserId });
      console.log(`Call accepted by ${fromUserId} to ${toUserId}`);
    }
  });

  // Call rejected
  socket.on("call-reject", ({ fromUserId, toUserId }) => {
    const targetSocket = userSocketMap[toUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("call-rejected", { fromUserId });
      console.log(`Call rejected by ${fromUserId} to ${toUserId}`);
    }
  });

  socket.on("webrtc-offer", ({ toUserId, offer }) => {
  const targetSocket = userSocketMap[toUserId];
  if(targetSocket) io.to(targetSocket).emit("webrtc-offer", { fromUserId: socket.userId, offer });
});

socket.on("webrtc-answer", ({ toUserId, answer }) => {
  const targetSocket = userSocketMap[toUserId];
  if(targetSocket) io.to(targetSocket).emit("webrtc-answer", { answer });
});

socket.on("webrtc-ice-candidate", ({ toUserId, candidate }) => {
  const targetSocket = userSocketMap[toUserId];
  if(targetSocket) io.to(targetSocket).emit("webrtc-ice-candidate", { candidate });
});

  socket.on("disconnect", () => {
    // Remove disconnected user
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});

console.log("Socket server running on :3001");

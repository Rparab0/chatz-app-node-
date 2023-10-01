const io = require("socket.io")(5000);
const users = {};

// Function to update and emit the user list to clients
function updateUserList() {
  io.emit("user-list-updated", Object.values(users));
}

io.on("connection", (socket) => {
  // If any new user joins, let others know
  socket.on("new-user-joined", (username) => {
    console.log("New user", username);
    users[socket.id] = username;
    updateUserList(); // Update the user list and send it to clients
    socket.broadcast.emit("user-joined", username);
  });

  socket.on("send", (message) => {
    // If someone sends a message, broadcast it to other people
    socket.broadcast.emit("receive", {
      message: message,
      username: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    // Someone left the chat, let others know
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      updateUserList(); // Update the user list and send it to clients
      socket.broadcast.emit("left", username);
    }
  });
});

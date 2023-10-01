document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");

  if (username !== null && username !== "") {
    // If a username is found in localStorage, use it
    initializeChat(username);
  }
});

function initializeChat(username) {
  const socket = io("http://localhost:5000", { transports: ["websocket"] });
  const form = document.getElementById("send-container");
  const messageInput = document.getElementById("messanginp");
  const messageContainer = document.querySelector(".Chats");
  const messageHeader = document.querySelector(".contacthead");
  const otherUsers = document.getElementById("otherUsers");

  var audio = new Audio(
    "assets/facebook-messenger-tone-wapking-fm-mp3-17015-19072-43455.mp3"
  );

  // Emit the new-user-joined event with the username.
  socket.emit("new-user-joined", username);
  // Add the user's username to the top of the chat immediately.
  addUserNameToHeader(username);

  // if server sends a message, receive it
  socket.on("receive", (data) => {
    append(`${data.username}: ${data.message}`, "left");
    audio.play(); // Play the notification sound for incoming messages.
  });

  // if a user leaves the chat, append the info to the container
  socket.on("left", (leftUser) => {
    appendLeftUser(`${leftUser} left the chat`, "right");
  });

  // if the user list is updated, update it in the "otherUsers" div
  socket.on("user-list-updated", (updatedUsers) => {
    updateOtherUsersList(updatedUsers);
  });

  // function used to add messages (event info) to the container
  function append(message, position) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.append(messageElement);
    messageElement.scrollIntoView({ behavior: "smooth" });
  }

  // Function to add a left user message to the chat container
  function appendLeftUser(message, position) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("leftAlert", position);
    messageContainer.append(messageElement);
    messageElement.scrollIntoView({ behavior: "smooth" });
  }

  // Function to add the user's username to the top of the chat immediately.
  function addUserNameToHeader(username) {
    const headerElement = document.createElement("div");
    headerElement.innerText = username;
    headerElement.classList.add("name");
    messageHeader.innerHTML = ""; // Clear any previous content in the header.
    messageHeader.append(headerElement);
  }

  // Function to update the list of users in the "otherUsers" div
  function updateOtherUsersList(users) {
    otherUsers.innerHTML = ""; // Clear any previous user list
    users.forEach((user) => {
      const userElement = document.createElement("div");
      userElement.innerText = user;
      userElement.classList.add("user");
      otherUsers.append(userElement);
    });
  }

  // Event listener to send messages when the form is submitted
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });
}

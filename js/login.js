document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username !== "") {
      localStorage.setItem("username", username);
      isRedirecting = true;
      window.location.href = "ChatzApp.html";
      // Remove the line below, you don't need to set isRedirecting to false here
      // isRedirecting = false; // Redirect to the chat page (index.html)
    }
  });
});

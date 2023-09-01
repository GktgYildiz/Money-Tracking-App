// Auth middleware
const currentPath = location.pathname;
const username = localStorage.username;
if (currentPath !== "/login.html" && !username) {
  location.href = "/login.html";
}

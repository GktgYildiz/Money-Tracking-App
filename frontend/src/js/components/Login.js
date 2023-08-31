const registeredUsers = [
  {
    username: "john",
    password: "ciccc",
  },
  {
    username: "kanayo",
    password: "ciccc",
  },
  {
    username: "shuya",
    password: "ciccc",
  },
  {
    username: "sky",
    password: "ciccc",
  },
  {
    username: "taiki",
    password: "ciccc",
  },
];

$(document).ready(function () {
  $("input").on("focus", function () {
    $("#incorrect-msg").addClass("opacity-0");
  });

  $("#password-visible-icon").click(function () {
    let passwordStatus = $(this).attr("src");
    if (passwordStatus === "images/visibility.svg") {
      $(this).attr("src", "images/visibility_off.svg");
      $("#password").attr("type", "text");
    } else {
      $(this).attr("src", "images/visibility.svg");
      $("#password").attr("type", "password");
    }
  });

  $("#login-btn").click(function (event) {
    let inputUsername = $("#loginusername").val();
    let inputPassword = $("#password").val();

    const loginUser = registeredUsers.find(
      ({ username, password }) => username === inputUsername && password === inputPassword
    );

    if (loginUser) {
      localStorage.setItem("username", inputUsername);
      $(this).attr("href", "index.html");
    } else {
      event.preventDefault();
      $("#incorrect-msg").removeClass("opacity-0");
    }
  });
});

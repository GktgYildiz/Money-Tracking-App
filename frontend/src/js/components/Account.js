import { displayPopup } from "../common.js";
import { apiClient } from "../index.js";

$(document).ready(async function () {
  try {
    // ==========================
    // Fetch data
    // ==========================
    const [fetchedCategories, fetchedAccounts, fetchedTransactions] = await Promise.all([
      apiClient.fetchCategories(),
      apiClient.fetchAccounts(),
      apiClient.fetchTransactions(),
    ]);

    // ==========================
    // Login Popup and Navigation bar
    // ==========================
    let username = localStorage.username;
    if (username) {
      username = username.charAt(0).toUpperCase() + username.slice(1);
      $("#nav-username").text(username);
      $("#nav-userimg").attr("src", `images/${username}.png`);
      const loginSuccessMessage = `You are logged in as ${username}!`;
      displayPopup(loginSuccessMessage, "success");
    } else {
      $("#nav-username").text("Guest");
      $("#nav-userimg").attr("src", `images/DefaultProfileIcon.png`);
    }

    // ==========================
    // Logout
    // ==========================
    $("#nav-user-account").on("click", function () {
      if (username) {
        const willLogout = confirm("Do you want to log out?");
        if (willLogout) {
          localStorage.removeItem("username");
          location.href = "/login.html";
        }
      } else {
        location.href = "/login.html";
      }
    });

    // ==========================
    // Create Account
    // ==========================

    $("#na-account-form").submit(async function (event) {
      event.preventDefault();
      const accountPayload = { newAccount: $("#na-new-account").val() };
      try {
        const account = await apiClient.createAccount(accountPayload);

        // append the new account data to the account summery
        $("#as-table").append(`<tr id="as-account-${account.id}"></tr>`);
        $(`#as-account-${account.id}`).append(
          `<td>${account.id}</td>`,
          `<td>${account.username}</td>`,
          `<td>CA$0.00</td>`
        );

        // set tailwind styles
        setStyles();

        // account created popup
        const newAccountSuccessMessage = `Account "${account.username}" has been created!`;
        displayPopup(newAccountSuccessMessage, "success");

        $("#na-new-account").val(null); // Reset input
      } catch (error) {
        // Error message popup
        const newAccountErrorMessage = "Please enter your account name";
        displayPopup(newAccountErrorMessage, "error");
      }
    });

    // ==========================
    // Account Summary
    // ==========================
    fetchedAccounts.forEach((element) => {
      // call calcBalance
      let balance = calcBalance(element);
      balance = balance.toLocaleString("en-US", { style: "currency", currency: "CAD" });

      $("#as-table").append(`<tr id="as-account-${element.id}"></tr>`);
      $(`#as-account-${element.id}`).append(
        `<td>${element.id}</td>`,
        `<td>${element.username}</td>`,
        `<td>${balance}</td>`
      );

      if (balance[0] === "-") {
        $(`#as-account-${element.id} td:last-child`).addClass("text-[#FF0000]");
      }
    });

    setStyles();
  } catch (err) {
    console.error(err);
  }
});

// calcrate balance
function calcBalance(account) {
  let transactions = account.transactions;
  let sum = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "Deposit") {
      sum += transaction.amount;
    } else if (transaction.type === "Withdraw") {
      sum -= transaction.amount;
    } else if (transaction.type === "Transfer" && transaction.accountIdFrom === account.id) {
      sum -= transaction.amount;
    } else if (transaction.type === "Transfer" && transaction.accountIdTo === account.id) {
      sum += transaction.amount;
    }
  });

  return sum;
}

// Add tailwind classes
function setStyles() {
  $("#as-table-head th").addClass("px-4 py-2");
  $("#as-table tr td:first-child").addClass("rounded-l-lg text-right px-4 py-2");
  $("#as-table tr td:nth-child(2)").addClass("px-4 py-2");
  $("#as-table tr td:last-child").addClass("rounded-r-lg px-4 py-2 text-right");
  $("#as-table tr:nth-child(odd)").addClass("bg-burntSienna bg-opacity-10");
  $("#as-table tr:first-child").removeClass("bg-slate-200 bg-opacity-10");
}

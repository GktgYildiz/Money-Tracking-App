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
    // console.log(fetchedCategories, fetchedAccounts, fetchedTransactions);

    // ==========================
    // Create Account
    // ==========================

    $("#na-account-form").submit(async function (event) {
      event.preventDefault();
      const accountPayload = { newAccount: $("#na-new-account").val() };
      try {
        const account = await apiClient.createAccount(accountPayload);
        $("#na-result").text("Your account created!: " + JSON.stringify(account));
        $("#na-new-account").val(null); // Reset input
      } catch (error) {
        $("#na-result").text("An error occurred: " + error.message);
      }
    });

    // ==========================
    // Account Summary
    // ==========================
    // Code here
  } catch (err) {
    console.error(err);
  }
});

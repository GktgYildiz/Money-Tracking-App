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
    // console.log(fetchedAccounts[]);
    // console.log(fetchedCategories, fetchedAccounts, fetchedTransactions);

    // ==========================
    // Create Account
    // ==========================

    $("#na-account-form").submit(async function (event) {
      event.preventDefault();
      const accountPayload = { newAccount: $("#na-new-account").val() };
      try {
        const account = await apiClient.createAccount(accountPayload);
        // $("#na-result").text("Your account created!: " + JSON.stringify(account));

        $('#as-table').append(`<tr id="as-account-${account.id}"></tr>`)
        $(`#as-account-${account.id}`).append(`<td>${account.id}</td>`)
        $(`#as-account-${account.id}`).append(`<td>${account.username}</td>`)
        $(`#as-account-${account.id}`).append(`<td>0</td>`)
        setStyles()

        $('#na-popup p').text(`Account "${account.username}" has been created!`)
        $('#na-popup').fadeIn()
        setTimeout(() => {
          $('#na-popup').fadeOut()
        }, 3000);


        $("#na-new-account").val(null); // Reset input
        
        // location.reload();
      } catch (error) {
        $("#na-result").text("An error occurred: " + error.message);
      }
    });

    // ==========================
    // Account Summary
    // ==========================
    // Code here

    fetchedAccounts.forEach(element => {
      $('#as-table').append(`<tr id="as-account-${element.id}"></tr>`);
      $(`#as-account-${element.id}`).append(`<td>${element.id}</td>`);
      $(`#as-account-${element.id}`).append(`<td>${element.username}</td>`);
      $(`#as-account-${element.id}`).append(`<td>0</td>`);
    });

    setStyles()
  } catch (err) {
    console.error(err);
  }

});

// Add tailwind classes
function setStyles() {
  $('#as-table-head th').addClass('px-4 py2')
  $('#as-table tr td:first-child').addClass('w-24 text-right px-4 py2')
  $('#as-table tr td:nth-child(2)').addClass('px-4 py2')
  $('#as-table tr td:last-child').addClass('px-4 py2 text-right')
  $('#as-table tr:nth-child(odd)').addClass('bg-slate-200')
}

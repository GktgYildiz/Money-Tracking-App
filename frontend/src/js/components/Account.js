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
    console.log('fetched account', fetchedAccounts);
    // console.log('fetched transactions', fetchedTransactions);
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

        // append the new account data to the account summery
        $('#as-table').append(`<tr id="as-account-${account.id}"></tr>`)
        $(`#as-account-${account.id}`).append(`<td>${account.id}</td>`, `<td>${account.username}</td>`, `<td>CA$0.00</td>`)

        // set tailwind styles
        setStyles()

        // account created popup
        $('#na-popup p').text(`Account "${account.username}" has been created!`)
        $('#na-popup').fadeIn()
        setTimeout(() => {
          $('#na-popup').fadeOut()
        }, 3000);


        $("#na-new-account").val(null); // Reset input
        
      } catch (error) {
        $("#na-result").text("An error occurred: " + error.message);
      }
    });

    // ==========================
    // Account Summary
    // ==========================
    // Code here

    fetchedAccounts.forEach(element => {

      // call calcBalance
      let balance = calcBalance(element)
      balance = balance.toLocaleString("en-US", {style:"currency", currency:"CAD"});
      
      $('#as-table').append(`<tr id="as-account-${element.id}"></tr>`);
      $(`#as-account-${element.id}`).append(`<td>${element.id}</td>`, `<td>${element.username}</td>`, `<td>${balance}</td>`);
      
    });

    setStyles()

  } catch (err) {
    console.error(err);
  }

});

// calcrate balance 
function calcBalance(account) {
  let transactions = account.transactions
  let sum = 0

  transactions.forEach(transaction => {
    if(transaction.type === "Deposit") {
      sum += transaction.amount
    } else if (transaction.type === "Withdraw") {
      sum -= transaction.amount
    } else if (transaction.type === "Transfer" && transaction.accountIdFrom === account.id) {
      sum -= transaction.amount
    } else if (transaction.type === "Transfer" && transaction.accountIdTo === account.id) {
      sum += transaction.amount
    }
  });

  return sum
}

// Add tailwind classes
function setStyles() {
  $('#as-table-head th').addClass('px-4 py2')
  $('#as-table tr td:first-child').addClass('w-24 text-right px-4 py2')
  $('#as-table tr td:nth-child(2)').addClass('px-4 py2')
  $('#as-table tr td:last-child').addClass('px-4 py2 text-right')
  $('#as-table tr:nth-child(odd)').addClass('bg-slate-200')
}

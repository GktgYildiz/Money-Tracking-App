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
    // Transaction History
    // ==========================
    // Code here

    const allTheTransactions = [].concat(...fetchedTransactions)
    // console.log(allTheTransactions)

    // allTheTransactions.forEach( transaction1 => {
    //   console.log(transaction1)
    // })


    // let transactions = fetchedTransactions[0]
    // console.log(transactions)
    

    // ===============
    // for filter
    // ===============

    // showing users in filter 
    let selectedUserId = "";
    fetchedAccounts.forEach( account => {
      $("#th-select").append(`<option value="${account.id}">${account.username}</option>`)
    })


    $('#th-select').on('change', function() {
      selectedUserId = this.value;

      fetchFilteredTransactions(selectedUserId);
    });

    // ========================
    // for transaction history
    // ========================


    // ========================
    // for transaction history
    // ========================

   //  Display all the transactions when you refresh the page
    allTheTransactions.forEach( transaction => {

      // identify username
      let username = ""
      fetchedAccounts.forEach(account => {
        if(transaction.accountId === account.id) {
          username = account.username
        }
      });

      // identify catetgory name
      let categoryName = ""
      fetchedCategories.forEach(category => {
        if(transaction.categoryId === category.id) {
          categoryName = category.name
        }
      });

      // set accountIdFrom & accountIdTo
      let accountIdFrom = "";
      let accountIdTo = "";

      if (transaction.type === "Transfer") {
        accountIdFrom = transaction.accountIdFrom;
        accountIdTo = transaction.accountIdTo;
      } else if (transaction.type === "Withdraw" || transaction.type === "Deposit") {
        accountIdFrom = "-"
        accountIdTo = "-"
      }

      $("#th-table").append(`<tr id="th-tr-${transaction.id}"></tr>`);   
      $(`#th-tr-${transaction.id}`).append(
        `<td>${transaction.accountId}</td>`,
        `<td>${username}</td>`,
        `<td>${transaction.type}</td>`,
        `<td>${categoryName}</td>`,
        `<td>${transaction.description}</td>`,
        `<td>${transaction.amount}</td>`,
        `<td>${accountIdFrom}</td>`,
        `<td>${accountIdTo}</td>`,
        )
    })


    const fetchFilteredTransactions = (id) => {
      console.log(id)
      if(id === "") {
        // reset the table
        $("#th-table td").remove()

        // Display all the transactions
        allTheTransactions.forEach( transaction => {

          // identify username
          let username = ""
          fetchedAccounts.forEach(account => {
            if(transaction.accountId === account.id) {
              username = account.username
            }
          });
  
          // identify catetgory name
          let categoryName = ""
          fetchedCategories.forEach(category => {
            if(transaction.categoryId === category.id) {
              categoryName = category.name
            }
          });
  
          // set accountIdFrom & accountIdTo
          let accountIdFrom = "";
          let accountIdTo = "";
  
          if (transaction.type === "Transfer") {
            accountIdFrom = transaction.accountIdFrom;
            accountIdTo = transaction.accountIdTo;
          } else if (transaction.type === "Withdraw" || transaction.type === "Deposit") {
            accountIdFrom = "-"
            accountIdTo = "-"
          }
  
          $("#th-table").append(`<tr id="th-tr-${transaction.id}"></tr>`);   
          $(`#th-tr-${transaction.id}`).append(
            `<td>${transaction.accountId}</td>`,
            `<td>${username}</td>`,
            `<td>${transaction.type}</td>`,
            `<td>${categoryName}</td>`,
            `<td>${transaction.description}</td>`,
            `<td>${transaction.amount}</td>`,
            `<td>${accountIdFrom}</td>`,
            `<td>${accountIdTo}</td>`,
            )
        })

      }
      else {
        // reset the table
        $("#th-table td").remove();


        // Display filtered transactions
        let i = selectedUserId - 1;
        let selectedTransactions = fetchedTransactions[i]
  
        
        selectedTransactions.forEach(selectedTransaction => {
        console.log(selectedTransaction)
        // identify username
        let username = ""
        fetchedAccounts.forEach(account => {
          if(selectedTransaction.accountId === account.id) {
            username = account.username
          }
        });
  
        // identify catetgory name
        let categoryName = ""
        fetchedCategories.forEach(category => {
          if(selectedTransaction.categoryId === category.id) {
            categoryName = category.name
          }
        });
  
        // set accountIdFrom & accountIdTo
        let accountIdFrom = "";
        let accountIdTo = "";
  
        if (selectedTransaction.type === "Transfer") {
          accountIdFrom = selectedTransaction.accountIdFrom;
          accountIdTo = selectedTransaction.accountIdTo;
        } else if (selectedTransaction.type === "Withdraw" || selectedTransaction.type === "Deposit") {
          accountIdFrom = "-"
          accountIdTo = "-"
        }
  
        $("#th-table").append(`<tr id="th-tr-${selectedTransaction.id}"></tr>`);   
        $(`#th-tr-${selectedTransaction.id}`).append(
          `<td>${selectedTransaction.accountId}</td>`,
          `<td>${username}</td>`,
          `<td>${selectedTransaction.type}</td>`,
          `<td>${categoryName}</td>`,
          `<td>${selectedTransaction.description}</td>`,
          `<td>${selectedTransaction.amount}</td>`,
          `<td>${accountIdFrom}</td>`,
          `<td>${accountIdTo}</td>`,
          )
        });

      }

      
    }
    
    fetchFilteredTransactions

    
    
  } catch (err) {
    console.error(err);
  }
        
});
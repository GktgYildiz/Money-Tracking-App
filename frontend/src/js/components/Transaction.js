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
    // console.log(fetchedAccounts);
    console.log(fetchedCategories);

    // ==========================
    // Transaction
    // ==========================
    // Code here

    //Display accounts that have been fetched in options for "from account"
    const fromAccount = $("#t-desired-account");

    fetchedAccounts.forEach((account) => {
      const accountOption = $("<option></option>").val(account.id).text(`${account.username}`);
      fromAccount.append(accountOption);
    });

    fromAccount.on("change", function () {
      const selectedFromAccountId = $(fromAccount).val();

      // Clear existing options in "toAccount" dropdown
      const toAccount = $("#t-target-account");
      toAccount.empty();

      // Display accounts that have been fetched in options for "to account"
      fetchedAccounts.forEach((account) => {
        if (account.id !== selectedFromAccountId) {
          const targetAccountOption = $("<option></option>").val(account.id).text(`${account.username}`);
          toAccount.append(targetAccountOption);
        }
      });
      toAccount.find(`option[value="${selectedFromAccountId}"]`).remove();
    });

    //Display categories that have been fetched
    const selectCategory = $("#t-category-dropdown");
    fetchedCategories.forEach((category) => {
      const categoryOptions = $("<option></option>").val(category.id).text(`${category.name}`);
      selectCategory.append(categoryOptions);
    });

    //======================
    // Create new category
    //======================
    $("#t-new-category-form").submit(async function (event) {
      event.preventDefault();
      alert("New category");
      const categoryPayload = { newCategory: $("#t-new-category").val() };
      console.log(categoryPayload);
      try {
        const category = await apiClient.createCategory(categoryPayload);
        $("#na-result").text("Your category created!: " + JSON.stringify(category));
        $("#t-new-category").val(null); // Reset input
      } catch (error) {
        $("#na-result").text("An error occurred: " + error.message);
      }
    });
    // $("#t-new-category-form").submit(async function (event) {
    //   event.preventDefault();
    //   const addNewCategory = { newCategory: $("#t-new-category").val() };
    //   try {
    //     const category = await apiClient.addCategory(addNewCategory);
    //     $("#na-result").text("Your account created!: " + JSON.stringify(category));

    //     var correctIcon = "./images/svg/correctCategory.svg";
    //     $("#t-new-category-icon").attr("src", correctIcon);
    //     $("#t-new-category").val(null); // Reset input
    //   } catch (error) {
    //     $("#na-result").text("error!: " + JSON.stringify(category));

    //     var errorIcon = "./images/svg/errorCategory.svg";
    //     $("#t-new-category-icon").attr("src", errorIcon);
    //   }
    // });
  } catch (err) {
    console.error(err);
  }
});

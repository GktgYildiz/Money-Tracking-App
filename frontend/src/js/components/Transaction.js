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
      const addNewCategory = { newCategory: $("#t-new-category").val() };
      try {
        const category = await apiClient.createCategory(addNewCategory);

        // add new category to dropdown
        const selectCategory = $("#t-category-dropdown");
        const categoryOption = $("<option></option>").val(category.id).text(category.name);
        selectCategory.append(categoryOption);

        // make the new category as selected
        categoryOption.prop("selected", true);

        const correctIcon = "./images/svg/correctCategory.svg";
        $("#t-new-category-icon").attr("src", correctIcon);
        $("#t-new-category").val(null);
      } catch (error) {
        const errorIcon = "./images/svg/errorCategory.svg";
        $("#t-new-category-icon").attr("src", errorIcon);
      }
    });

    //==============================
    // Amount formatters
    //==============================

    $("#t-amound-input").on({
      keyup: function () {
        formatCurrency($(this));
        console.log($(this).val());
      },
      shadow: function () {
        formatCurrency($(this), "shadow");
      },
    });

    function formatNumber(n) {
      return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatCurrency(input, shadow) {
      // put $ sign in front of nubmer
      const input_val = input.val();

      if (input_val === "") {
        return;
      }
      const original_len = input_val.length;
      const caret_pos = input.prop("selectionStart");

      // check for decimal
      if (input_val.indexOf(".") >= 0) {
        const decimal_pos = input_val.indexOf(".");

        const left_side = input_val.substring(0, decimal_pos);
        const right_side = input_val.substring(decimal_pos);

        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        if (shadow === "shadow") {
          right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = "$ " + left_side + "." + right_side;
      } else {
        input_val = formatNumber(input_val);
        input_val = "$ " + input_val;

        // final formatting
        if (shadow === "shadow") {
          input_val += ".00";
        }
      }

      // send updated string to input
      input.val(input_val);

      // put caret back in the right position
      const updated_len = input_val.length;
      caret_pos = updated_len - original_len + caret_pos;
      input[0].setSelectionRange(caret_pos, caret_pos);
    }

    //===============PERSONEL NOTE==========Dont forget to convert amount to integer, remove $ sign from input
  } catch (err) {
    console.error(err);
  }
});

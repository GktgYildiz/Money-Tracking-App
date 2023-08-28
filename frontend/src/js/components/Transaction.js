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
    console.log(fetchedTransactions);

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

      // Add the default placeholder option
      const defaultOption = $("<option selected disabled></option>").val("-1").text("Choose Account");
      toAccount.append(defaultOption);

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
    const defaultOption = $("<option selected disabled></option>").val("-1").text("Choose Category");
    selectCategory.append(defaultOption);
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

        var correctIcon = "./images/svg/correctCategory.svg";
        $("#t-new-category-icon").attr("src", correctIcon);
        $("#t-new-category").val(null);
      } catch (error) {
        var errorIcon = "./images/svg/errorCategory.svg";
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
      var input_val = input.val();

      if (input_val === "") {
        return;
      }
      var original_len = input_val.length;
      var caret_pos = input.prop("selectionStart");

      // check for decimal
      if (input_val.indexOf(".") >= 0) {
        var decimal_pos = input_val.indexOf(".");

        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

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
      var updated_len = input_val.length;
      caret_pos = updated_len - original_len + caret_pos;
      input[0].setSelectionRange(caret_pos, caret_pos);
    }

    //==========================================
    // transfer button click handlers
    //==========================================

    $("#t-transaction-btn").on("click", async function () {
      // Get input values
      const transactionType = $("input[name='transaction']:checked").val();
      const fromAccountId = parseInt($("#t-desired-account").val(), 10);
      const toAccountId = parseInt($("#t-target-account").val(), 10);
      const categoryId = parseInt($("#t-category-dropdown").val(), 10);
      const description = $("#t-description-textarea").val();
      const amount = parseFloat(
        $("#t-amound-input")
          .val()
          .replace(/[^\d.]/g, "")
      );

      let transactionPayload; // Define a variable to hold the transaction payload

      // Check the selected transaction type and create the appropriate payload
      if (transactionType === "Transfer") {
        transactionPayload = {
          newTransaction: {
            type: transactionType,
            accountIdFrom: fromAccountId,
            accountIdTo: toAccountId,
            categoryId: categoryId,
            description: description,
            amount: amount,
          },
        };
      } else if (transactionType === "Deposit" || transactionType === "Withdraw") {
        transactionPayload = {
          newTransaction: {
            type: transactionType,
            accountId: fromAccountId,
            categoryId: categoryId,
            description: description,
            amount: amount,
          },
        };
      }

      try {
        const createdTransaction = await apiClient.createTransaction(transactionPayload);
        // Handle successful response, maybe show a success message.
        console.log("Transaction created:", createdTransaction);

        // Display the success SVG icon and apply GSAP animation
        const successIcon = $("#t-transaction-confirm-svg")
          .attr("src", "./images/svg/correctCategory.svg")
          .removeClass("invisible");
        gsap.fromTo(successIcon, { opacity: 0 }, { opacity: 1, duration: 0.5 });

        // Hide the success SVG icon after 3 seconds with GSAP animation
        setTimeout(() => {
          gsap.to(successIcon, {
            opacity: 0,
            duration: 0.5,
            onComplete: function () {
              successIcon.addClass("invisible"); // Add the invisible class after animation
            },
          });
        }, 2500);
      } catch (error) {
        // Handle error, show an error message to the user.
        console.error("Transaction creation failed:", error);
        // Display the error SVG icon and apply GSAP animation
        const errorIcon = $("#t-transaction-confirm-svg")
          .attr("src", "./images/svg/errorCategory.svg")
          .removeClass("invisible");
        gsap.fromTo(errorIcon, { opacity: 0 }, { opacity: 1, duration: 0.5 });

        // Hide the error SVG icon after 3 seconds with GSAP animation
        setTimeout(() => {
          gsap.to(errorIcon, {
            opacity: 0,
            duration: 0.5,
            onComplete: function () {
              errorIcon.addClass("invisible"); // Add the invisible class after animation
            },
          });
        }, 2500);
      }

      //===============PERSONAL NOTE==========
      // put error message for validation result fail
      // put confirm message for validation result success
    });
    //==========================================
    // Step by step animations, hide and show
    //==========================================
    // Add event listener to radio buttons with name "transaction"
    $("input[name='transaction']").on("change", function () {
      const selectedValue = $(this).val();
      const tContainer = $("#t-container");
      const tChooseAccount = $("#t-choose-account");
      const tChooseTarget = $("#t-choose-target");
      const tChooseCategory = $("#t-choose-category");
      const tAddDescription = $("#t-add-description");
      const tAddDescriptionText = $("#t-description-textarea");
      const tTransactionFormButton = $("#t-transaction-form-button");
      const tTransactionButton = $("#t-transaction-btn");
      const tDesiredAccount = $("#t-desired-account");
      const tCategoryDropdown = $("#t-category-dropdown");
      const tTargetAccount = $("#t-target-account");
      const tAmount = $("#t-add-amount");
      const tAmountInput = $("#t-amound-input");

      // Set selected options to -1
      tDesiredAccount.val("-1");
      tCategoryDropdown.val("-1");
      tTargetAccount.val("-1");
      tAmountInput.val("");
      tAddDescriptionText.val("");

      tTransactionFormButton.text(`${selectedValue}`);

      gsap.to([tChooseAccount, tChooseTarget, tChooseCategory, tAddDescription, tAmount, tTransactionButton], {
        maxHeight: 0,
        duration: 0.5,
      });

      if (selectedValue === "Transfer") {
        // Animate showing "From" and "To" account
        gsap.to([tContainer, tChooseAccount, tChooseTarget], {
          maxHeight: 200,
          duration: 0.5,
        });
      } else if (selectedValue === "Deposit" || selectedValue === "Withdraw") {
        // Animate showing only "From" account and "Category"
        gsap.to([tContainer, tChooseAccount, tChooseCategory], {
          maxHeight: 200,
          duration: 0.5,
        });

        // Hide the "To" account section
        tChooseTarget.hide();
      } else {
        // Animate showing only "From" account
        gsap.to([tContainer, tChooseAccount], {
          maxHeight: 200,
          duration: 0.5,
        });

        // Hide the "To" account section and "Category" section
        tChooseTarget.hide();
        tChooseCategory.hide();
      }
      // Show the "To" account section if the selected transaction is "Transfer"
      if (selectedValue === "Transfer") {
        tChooseTarget.show();
      }
    });
    $("#t-desired-account").on("change", function () {
      const selectedValue = $(this).val();
      const tChooseTarget = $("#t-choose-target");

      if (selectedValue !== "-1") {
        gsap.to([tChooseTarget], { maxHeight: tChooseTarget[0].scrollHeight, duration: 0.5 });
      } else {
        gsap.to([tChooseTarget], { maxHeight: 0, duration: 0.5 });
      }
      if (selectedValue !== "-1") {
        $("#t-choose-category").hide();
      }
      {
        $("#t-choose-category").show();
      }
    });

    $("#t-category-dropdown").on("change", function () {
      const selectedValue = $(this).val();
      const tAddDescription = $("#t-add-description");

      if (selectedValue !== "-1") {
        gsap.to([tAddDescription], { maxHeight: tAddDescription[0].scrollHeight, duration: 0.5 });
      } else {
        gsap.to([tAddDescription], { maxHeight: 0, duration: 0.5 });
      }
    });

    $("#t-target-account").on("change", function () {
      const selectedValue = $(this).val();
      const tChooseCategory = $("#t-choose-category");

      if (selectedValue !== "-1") {
        gsap.to([tChooseCategory], { maxHeight: tChooseCategory[0].scrollHeight, duration: 0.5 });
      } else {
        gsap.to([tChooseCategory], { maxHeight: 0, duration: 0.5 });
      }
    });

    $("#t-description-textarea").on("input", function () {
      const textContent = $(this).val();
      const tAddAmount = $("#t-add-amount");

      if (textContent !== "") {
        gsap.to([tAddAmount], { maxHeight: tAddAmount[0].scrollHeight, duration: 0.5 });
      } else {
        gsap.to([tAddAmount], { maxHeight: 0, duration: 0.5 });
      }
    });

    $("#t-amound-input").on("input", function () {
      const inputValue = $(this).val();
      const tTransactionButton = $("#t-transaction-btn");

      if (inputValue !== "") {
        gsap.to([tTransactionButton], { maxHeight: tTransactionButton[0].scrollHeight, duration: 0.5 });
      } else {
        gsap.to([tTransactionButton], { maxHeight: 0, duration: 0.5 });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

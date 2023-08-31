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
        $("#t-category-message").addClass("text-green-600");
        $("#t-category-message")
          .next()
          .removeClass("opacity-50")
          .addClass("opacity-100")
          .next()
          .removeClass("opacity-25")
          .addClass("opacity-50");
        tAddDescription.removeClass("invisible");
        gsap.set(tAddDescription, { opacity: 0, height: 0 });
        gsap.to(tAddDescription, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });

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

    $("#t-transaction-form-button").on("click", async function () {
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
      //show error message for validation result
    });

    //==========================================
    // Step by step animations, hide and show
    //==========================================

    //target elements on global scope
    // container of input elements
    const tContainer = $("#t-container");
    const tAccountLabel = $("#t-account-label");

    //From account
    const tChooseAccount = $("#t-choose-account");
    const tDesiredAccount = $("#t-desired-account");

    //To account
    const tChooseTarget = $("#t-choose-target");
    const tTargetAccount = $("#t-target-account");

    //Category
    const tChooseCategory = $("#t-choose-category");
    const tCategoryDropdown = $("#t-category-dropdown");

    //Description
    const tAddDescription = $("#t-add-description");
    const tAddDescriptionText = $("#t-description-textarea");

    //Amount
    const tAmount = $("#t-add-amount");
    const tAmountInput = $("#t-amound-input");

    //Transaction button
    const tTransactionButton = $("#t-transaction-btn");
    const tTransactionFormButton = $("#t-transaction-form-button");

    //Validation container
    const tValidationContainer = $("#t-validation");
    const tValidationSteps = $("#t-validation-steps");
    const tValidationTypeSVG = $("#t-transaction-validation-typeSvg");
    const tValidationType = $("#t-transaction-validation-type");
    const tValidationStepMessage = $("#t-transaction-stepMessages");

    //=======================
    //Validation container
    //=======================
    $("input[name='transaction']").on("change", function () {
      const selectedValue = $(this).val();
      tValidationType.text(`${selectedValue}`);

      if (selectedValue === "Deposit") {
        tValidationTypeSVG.html(`
          <img src="./images/svg/validation/Vector.svg" class="absolute top-5 left-3" />
          <img src="./images/svg/validation/Vector (1).svg" class="absolute top-3 left-1 vector-img" />
          <img src="./images/svg/validation/Vector (1).svg" class="absolute top-4 left-2 vector-img" />
          <img src="./images/svg/validation/plus.svg" alt="" srcset="" class="absolute left-14 top-3" />
        `);
        const validationDepositSvg = document.querySelectorAll(".vector-img");
        const tl = gsap.timeline({ repeat: -1 });

        validationDepositSvg.forEach((target) => {
          tl.to(target, { opacity: 1, duration: 0.3 })
            .to(target, { opacity: 0, duration: 0.3 })
            .to({}, { duration: 0.3 });
        });
        tl.play();
      } else if (selectedValue === "Withdraw") {
        tValidationTypeSVG.html(`
          <img src="./images/svg/validation/withdrawMachine.svg" class="absolute left-12 top-2" />
          <img src="./images/svg/validation/withdrawMoney.svg" class="absolute top-5 left-2 withdraw-atm" />
        `);
        const validationWithdrawSvg = document.querySelectorAll(".withdraw-atm");
        const tl2 = gsap.timeline({ repeat: -1 });

        tl2
          .to(validationWithdrawSvg, { opacity: 1, x: 0, duration: 0.3 }) // Fade in and move to x: 0
          .to(validationWithdrawSvg, { opacity: 0.2, x: -3, duration: 1 }) // Fade out and move to x: -3
          .to({}, { duration: 0.3 }); // Delay between animations

        tl2.play();
      } else if (selectedValue === "Transfer") {
        tValidationTypeSVG.html(`
          <img src="./images/svg/validation/transfer_arrowUp.svg" class="absolute top-2 left-3 trans-up" />
          <img src="./images/svg/validation/Vector.svg" class="absolute top-5 left-3 trans-money" />
          <img src="./images/svg/validation/transfer_arrowDown.svg" class="absolute top-8 mt-4 left-3 trans-down" />
        `);

        const validationTransArrowUp = document.querySelectorAll(".trans-up");
        const validationTransArrowDown = document.querySelectorAll(".trans-down");
        const validationTransMoney = document.querySelectorAll(".trans-money");
        const tl3 = gsap.timeline({ repeat: -1 });
        const tl4 = gsap.timeline({ repeat: -1 });
        const tl5 = gsap.timeline({ repeat: -1 });
        tl3
          .to(validationTransArrowUp, { opacity: 1, x: -2, duration: 0.75 }) //fade in and move to x:-1
          .to(validationTransArrowUp, { opacity: 0.2, x: 8, duration: 0.75 }); //fade out and move to x:4

        tl4
          .to(validationTransArrowDown, { opacity: 1, x: 2, duration: 0.75 }) //fade in and move to x:-1
          .to(validationTransArrowDown, { opacity: 0.2, x: -8, duration: 0.75 }); //fade out and move to x:4

        tl5
          .to(validationTransMoney, {
            skewX: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power2.inOut",
          })
          .to(validationTransMoney, {
            skewX: -20,
            opacity: 0.2,
            duration: 0.75,
            ease: "power2.inOut",
          });
      }
      const tMessageList = [
        { id: "t-main-message", message: "Choose main account" },
        { id: "t-target-message", message: "Choose target account" },
        { id: "t-category-message", message: "Choose category" },
        { id: "t-description-message", message: "Type your description" },
        { id: "t-amount-message", message: "Type amount" },
        { id: "t-transaction-message-btn", message: "Make transaction" },
      ];
      if (selectedValue === "Transfer") {
        tValidationStepMessage.html(
          "<ul id='t-transaction-message-list' class='font-lora text-sm text-gray-400'></ul>"
        );

        tMessageList.forEach((messageObj, index) => {
          const messageWithNumber = `${index + 1}. ${messageObj.message}`;
          $("#t-transaction-message-list").append(
            `<li id="${messageObj.id}" class="opacity-25">${messageWithNumber}</li>`
          );
        });
      } else if (selectedValue === "Withdraw" || selectedValue === "Deposit") {
        tValidationStepMessage.html(
          "<ul id='t-transaction-message-list' class='font-lora text-sm text-gray-400'></ul>"
        );
        let messageCounter = 1;
        tMessageList.forEach((messageObj) => {
          if (messageObj.id !== "t-target-message") {
            const messageWithNumber = `${messageCounter}. ${messageObj.message}`;
            $("#t-transaction-message-list").append(
              `<li id="${messageObj.id}" class="opacity-25">${messageWithNumber}</li>`
            );
            messageCounter++;
          }
        });
      }
      $("#t-main-message").removeClass("opacity-25").next().removeClass("opacity-25").addClass("opacity-50");
    });
    // + (90 - index * 15)
    //=======================
    // navbar animation
    //=======================

    // Get the "Account" list item by its ID
    const accountLink = $("#account-link");
    const transactionLink = $("#transaction-link");
    const summaryLink = $("#summary-link");
    const historyLink = $("#history-link");

    // Get the target section by its ID
    const secNewAccount = $("#sec-new-account");
    const secNewTransaction = $("#sec-transaction");
    const secAccountSummary = $("#sec-account-summary");
    const secTransactionHistory = $("#sec-transaction-history");

    // Click event handler for "Account" list item
    accountLink.click(function () {
      secNewAccount[0].scrollIntoView({ behavior: "smooth" });
      secNewAccount.focus();
    });

    // Click event handler for "Transaction" list item
    transactionLink.click(function () {
      secNewTransaction[0].scrollIntoView({ behavior: "smooth" });
      secNewTransaction.focus();
    });

    // Click event handler for "Summary" list item
    summaryLink.click(function () {
      secAccountSummary[0].scrollIntoView({ behavior: "smooth" });
      secAccountSummary.focus();
    });

    // Click event handler for "History" list item
    historyLink.click(function () {
      secTransactionHistory[0].scrollIntoView({ behavior: "smooth" });
      secTransactionHistory.focus();
    });

    //=======================
    // new transaction headline's svg button
    //=======================
    const svgContainer = $("#t-svg-container");
    const tMethodDiv = $("#t-method");
    const tTransactionHeadline = $("#t-transaction-headline");
    const svg = $("#t-new-transaction-svg");

    let isOpen = false;

    svgContainer.on("click", function () {
      tDesiredAccount.val("-1");
      tCategoryDropdown.val("-1");
      tTargetAccount.val("-1");
      tAmountInput.val("");
      tAddDescriptionText.val("");
      tAccountLabel.addClass("invisible");
      tAccountLabel.addClass("invisible");
      tChooseAccount.addClass("invisible");
      tValidationContainer.addClass("invisible");
      tChooseTarget.addClass("invisible");
      tChooseCategory.addClass("invisible");
      tAddDescription.addClass("invisible");
      tAmount.addClass("invisible");
      tTransactionButton.addClass("invisible");
      isOpen = !isOpen;
      if (isOpen) {
        tMethodDiv.removeClass("invisible");
        gsap.set(tMethodDiv, { opacity: 0, height: 0 });
        gsap.to(tMethodDiv, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
        tTransactionHeadline.removeClass("invisible");
        gsap.set(tTransactionHeadline, { opacity: 0, height: 0 });
        gsap.to(tTransactionHeadline, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });

        gsap.to(svg, { rotation: 45, fill: "red" });
      } else {
        tMethodDiv.addClass("invisible");
        tTransactionHeadline.addClass("invisible");
        gsap.to(svg, { rotation: 0, fill: "green" });
      }
    });

    // make transaction type buttons larger on hover
    const transactions = ["Transfer", "Withdraw", "Deposit"];

    transactions.forEach((transaction) => {
      const labelId = `#t-${transaction.toLowerCase()}-label`;
      const label = $(labelId);

      let tween = gsap.to(label, {
        scale: 1.1,
        ease: "none",
        paused: true,
      });

      label.on("mouseenter", () => {
        gsap.to(tween, { duration: 1.3, time: tween.duration(), ease: "elastic.out(0.8, 0.3)" });
      });
      label.on("mouseleave", () => {
        gsap.to(tween, { duration: 0.1, time: 0, ease: "none", overwrite: true });
      });
    });

    //add event handler for transaction type change
    $("input[name='transaction']").on("change", function () {
      // type of transfer
      const selectedValue = $(this).val();

      //make button text dynamic
      tTransactionFormButton.text(`${selectedValue}`);

      // make sure inputs are cleared after selected value changed
      tDesiredAccount.val("-1");
      tCategoryDropdown.val("-1");
      tTargetAccount.val("-1");
      tAmountInput.val("");
      tAddDescriptionText.val("");
      tChooseAccount.removeClass("invisible");
      tValidationContainer.removeClass("invisible");
      tChooseTarget.addClass("invisible");
      tChooseCategory.addClass("invisible");
      tAddDescription.addClass("invisible");
      tAmount.addClass("invisible");
      tTransactionButton.addClass("invisible");

      gsap.set(tChooseAccount, { opacity: 0, height: 0 });
      gsap.to(tChooseAccount, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      gsap.set(tValidationContainer, { opacity: 0, height: 0 });
      gsap.to(tValidationContainer, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });

      const transactions = ["Transfer", "Withdraw", "Deposit"];

      transactions.forEach((transaction) => {
        const labelId = `#t-${transaction.toLowerCase()}-label`;
        const label = $(labelId);

        if (selectedValue === transaction) {
          label.removeClass("bg-deepBlue");
          tAccountLabel.removeClass("invisible");
          gsap.set(tAccountLabel, { opacity: 0, height: 0 });
          gsap.to(tAccountLabel, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
          label.addClass("bg-green-600");
          label.addClass("border-2");
          label.addClass("border-whiteSmoke");
        } else {
          label.removeClass("bg-green-600");
          label.removeClass("border-2");
          label.removeClass("border-whiteSmoke");
          label.addClass("bg-deepBlue");
        }
      });
    });

    //add event handler for "From Account"
    tDesiredAccount.on("change", function () {
      // type of transfer
      const selectedValue = $("input[name='transaction']:checked").val();

      if (selectedValue !== "Transfer") {
        tChooseTarget.hide();
        tChooseCategory.removeClass("invisible");
        gsap.set(tChooseCategory, { opacity: 0, height: 0 });
        gsap.to(tChooseCategory, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      } else {
        tChooseTarget.show();
      }

      if (tDesiredAccount.val() != -1) {
        tChooseTarget.removeClass("invisible");
        gsap.set(tChooseTarget, { opacity: 0, height: 0 });
        gsap.to(tChooseTarget, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
        $("#t-main-message").addClass("text-green-600");
        $("#t-main-message")
          .next()
          .removeClass("opacity-50")
          .addClass("opacity-100")
          .next()
          .removeClass("opacity-25")
          .addClass("opacity-50");
      } else {
        tChooseTarget.addClass("invisible");
        $("#t-main-message").removeClass("text-green-400");
      }
    });

    //show category when "To account" is selected
    tTargetAccount.on("change", function () {
      tChooseCategory.removeClass("invisible");
      gsap.set(tChooseCategory, { opacity: 0, height: 0 });
      gsap.to(tChooseCategory, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      $("#t-target-message").addClass("text-green-600");
      $("#t-target-message")
        .next()
        .removeClass("opacity-50")
        .addClass("opacity-100")
        .next()
        .removeClass("opacity-25")
        .addClass("opacity-50");
    });

    // category add svg event handlers
    $("#t-new-category-icon").click(function () {
      const tNewCategoryForm = $("#t-new-category-form");
      if (tNewCategoryForm.hasClass("invisible")) {
        tNewCategoryForm.removeClass("invisible");
        gsap.set(tNewCategoryForm, { opacity: 0, height: 0 });
        gsap.to(tNewCategoryForm, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      } else {
        tNewCategoryForm.addClass("invisible");
      }
    });

    //show description when category selected
    tCategoryDropdown.on("change", function () {
      tAddDescription.removeClass("invisible");
      gsap.set(tAddDescription, { opacity: 0, height: 0 });
      gsap.to(tAddDescription, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      $("#t-category-message").addClass("text-green-600");
      $("#t-category-message")
        .next()
        .removeClass("opacity-50")
        .addClass("opacity-100")
        .next()
        .removeClass("opacity-25")
        .addClass("opacity-50");
    });

    // show amount section when description is not null
    tAddDescriptionText.on("input", function () {
      tAmount.removeClass("invisible");
      gsap.set(tAmount, { opacity: 0, height: 0 });
      gsap.to(tAmount, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      $("#t-description-message").addClass("text-green-600");
      $("#t-description-message")
        .next()
        .removeClass("opacity-50")
        .addClass("opacity-100")
        .next()
        .removeClass("opacity-25")
        .addClass("opacity-50");
    });

    tAmountInput.on("input", function () {
      tTransactionButton.removeClass("invisible");
      gsap.set(tTransactionButton, { opacity: 0, height: 0 });
      gsap.to(tTransactionButton, { opacity: 1, height: "auto", duration: 1, ease: "power2.out" });
      $("#t-amount-message").addClass("text-green-600");
      $("#t-amount-message")
        .next()
        .removeClass("opacity-50")
        .addClass("opacity-100")
        .next()
        .removeClass("opacity-25")
        .addClass("opacity-50");
    });
    tTransactionButton.on("click", function () {
      $("#t-transaction-message-btn").addClass("text-green-600");
      $("#t-transaction-message-btn").next().removeClass("opacity-50").addClass("opacity-100");
      tValidationContainer.removeClass("shadow-[0px_10px_1px_rgba(255,_38,_38,_1),_0_10px_20px_rgba(255,_38,_30,_1)]");
      tValidationContainer.addClass("shadow-[0px_10px_1px_rgba(_76,161,_84,_1),_0_10px_20px_rgba(_76,161,_84,_1)]");
    });
  } catch (err) {
    console.error(err);
  }
});

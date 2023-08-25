// ==============================
// These are the sample codes and be never invoked from the actual app
// ==============================
async function CreateAccountsSample() {
  try {
    // =================================
    // Create Dummy Accounts
    // =================================
    const accountPayload1 = { newAccount: "Mario" };
    const accountPayload2 = { newAccount: "Luigi" };
    const [account1, account2] = await Promise.all([
      apiClient.createAccount(accountPayload1),
      apiClient.createAccount(accountPayload2),
    ]);
    // Debug
    console.log("Dummy Account1", account1);
    console.log("Dummy Account2", account2);
  } catch (err) {
    console.error(err);
  }
}

async function CreateCategorySample() {
  try {
    const categoryPayload = { newCategory: "Grocery" };
    const category = await apiClient.createCategory(categoryPayload);
    // Debug
    console.log("Dummy category", category);
  } catch (err) {
    console.error(err);
  }
}

async function CreateTransactionSample() {
  try {
    // =================================
    // Transfer
    // =================================
    const transactionPayload1 = {
      newTransaction: {
        accountIdFrom: 2,
        accountIdTo: 1,
        type: "Transfer",
        amount: 100,
        categoryId: 2,
        description: "Hey Luigi! Thank you for getting me the super mushroom",
      },
    };
    // =================================
    // Deposit
    // =================================
    const transactionPayload2 = {
      newTransaction: {
        accountId: 1,
        type: "Deposit",
        amount: 500,
        categoryId: 1,
        description: "Deposit description",
      },
    };
    // =================================
    // Withdraw
    // =================================
    const transactionPayload3 = {
      newTransaction: {
        accountId: 1,
        type: "Withdraw",
        amount: 300,
        categoryId: 2,
        description: "Withdraw description",
      },
    };
    const [transaction1, transaction2, transaction3] = await Promise.all([
      apiClient.createTransaction(transactionPayload1),
      apiClient.createTransaction(transactionPayload2),
      apiClient.createTransaction(transactionPayload3),
    ]);
    // Debug
    console.log("Dummy Transaction1: ", transaction1);
    console.log("Dummy Transaction2: ", transaction2);
    console.log("Dummy Transaction3: ", transaction3);
  } catch (err) {
    console.error(err);
  }
}

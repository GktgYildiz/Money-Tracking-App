import { getAccounts, validateAccount } from "./accounts.js";
import { validateCategory } from "./categories.js";

let transactionCounter = 0;
export const addTransaction = (transaction) => {
  const newTransactions = [];
  const accounts = getAccounts();
  accounts.forEach((account) => {
    if (
      account.id === transaction.accountIdFrom ||
      account.id === transaction.accountIdTo ||
      account.id === transaction.accountId
    ) {
      transactionCounter++;
      const {
        accountId,
        accountIdFrom,
        accountIdTo,
        type,
        amount,
        categoryId,
        description,
      } = transaction;
      let newTransaction = {
        accountId,
        accountIdFrom,
        accountIdTo,
        type,
        amount,
        categoryId,
        description,
        id: transactionCounter,
      };
      if (account.id === accountIdFrom) {
        newTransaction.accountId = accountIdFrom;
      }
      if (account.id === accountIdTo) {
        newTransaction.accountId = accountIdTo;
      }
      account.transactions.push(newTransaction);
      newTransactions.push(newTransaction);
    }
  });
  return newTransactions;
};

export const getAllTransactions = () => {
  const accounts = getAccounts();
  let allTransactions = [];
  accounts.forEach((account) => {
    allTransactions = [...allTransactions, account.transactions];
  });
  return allTransactions;
};

export const validateTransaction = (transaction) => {
  if (!transaction) return "Invalid data";
  if (!transaction.type) {
    return "Invalid transaction type";
  }
  if (
    transaction.type === "Transfer" &&
    (!transaction.accountIdFrom ||
      !transaction.accountIdTo ||
      !validateAccount(transaction.accountIdFrom) ||
      !validateAccount(transaction.accountIdTo))
  ) {
    return "Invalid account id.";
  }
  if (
    (transaction.type === "Deposit" || transaction.type === "Withdraw") &&
    (!transaction.accountId || !validateAccount(transaction.accountId))
  ) {
    return "Invalid account id.";
  }
  if (
    !transaction.amount ||
    transaction.amount <= 0 ||
    !Number(transaction.amount)
  )
    return "Invalid transaction amount";
  if (!transaction.categoryId || !validateCategory(transaction.categoryId)) {
    return "Invalid category";
  }
  return "validated";
};

export default { addTransaction, getAllTransactions, validateTransaction };

const accounts = [];

export const fetchAccounts = () => {
  return accounts;
};

export const addAccount = (username) => {
  const newAccount = { username, id: accounts.length + 1, transactions: [] };
  accounts.push(newAccount);
  return newAccount;
};

export const validateAccount = (accountId) => {
  return accounts.find((acc) => acc.id === accountId);
};

export default { fetchAccounts, addAccount, validateAccount };

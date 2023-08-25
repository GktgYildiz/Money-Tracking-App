export class BankingApiClient {
  constructor(baseUrl) {
    if (BankingApiClient.instance) {
      return BankingApiClient.instance;
    }
    BankingApiClient.instance = this;

    this.baseUrl = baseUrl;
  }
  // ==================================
  // Accounts
  // ==================================
  /**
   * @typedef {Object} AccountPayload
   * @property {string} newAccount - New account name
   */

  /**
   * @param {AccountPayload} accountPayload
   */
  async createAccount(accountPayload) {
    const url = `${this.baseUrl}/accounts`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountPayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to create an account: ${res.status}`);
      }
      const accounts = await res.json();
      return accounts;
    } catch (err) {
      throw new Error(`Failed to create an account: ${err.message}`);
    }
  }

  async fetchAccounts() {
    const url = `${this.baseUrl}/accounts`;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch accounts: ${res.status}`);
      }

      const accounts = await res.json();
      return accounts;
    } catch (err) {
      throw new Error(`Failed to fetch accounts: ${err.message}`);
    }
  }

  // ==================================
  // Categories
  // ==================================
  /**
   * @typedef {Object} CategoryPayload
   * @property {string} newCategory - New category name
   */

  /**
   * @param {CategoryPayload} categoryPayload
   */
  async createCategory(categoryPayload) {
    const url = `${this.baseUrl}/categories`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryPayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to create a category: ${res.status}`);
      }
      const accounts = await res.json();
      return accounts;
    } catch (err) {
      throw new Error(`Failed to fetch accounts: ${err.message}`);
    }
  }

  async fetchCategories() {
    const url = `${this.baseUrl}/categories`;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }

      const categories = await res.json();
      return categories;
    } catch (err) {
      throw new Error(`Failed to fetch categories: ${err.message}`);
    }
  }

  // ==================================
  // Transactions
  // ==================================
  /**
   * @typedef {Object} TransactionPayload
   * @property {Object} newTransaction - New transaction information
   * @property {number} newTransaction.accountIdFrom - Sender account ID
   * @property {number} newTransaction.accountIdTo - Receiver account ID
   * @property {string} newTransaction.type - Transaction Type: "Deposit" | "Withdraw" | "Transfer"
   * @property {number} newTransaction.amount - Amount of money
   * @property {number} newTransaction.categoryId - Category ID
   * @property {string} newTransaction.description - Description of transaction
   */

  /**
   * @param {TransactionPayload} transactionPayload
   */
  async createTransaction(transactionPayload) {
    const url = `${this.baseUrl}/transactions`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionPayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to create a transaction: ${res.status}`);
      }
      const accounts = await res.json();
      return accounts;
    } catch (err) {
      throw new Error(`Failed to fetch transactions: ${err.message}`);
    }
  }

  async fetchTransactions() {
    const url = `${this.baseUrl}/transactions`;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch transactions: ${res.status}`);
      }

      const transactions = await res.json();
      return transactions;
    } catch (err) {
      throw new Error(`Failed to fetch transactions: ${err.message}`);
    }
  }
}

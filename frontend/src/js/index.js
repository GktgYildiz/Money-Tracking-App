import { API_URL } from "./common.js";
import { BankingApiClient } from "./api/ApiClient.js";

// Init API Client
export const apiClient = new BankingApiClient(API_URL);

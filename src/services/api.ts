import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://YOUR-FRIEND-PC-IP:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(
    "smart_civic_access_token"
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
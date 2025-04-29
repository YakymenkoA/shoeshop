import { sendRequest } from "./api";

const API_ENDPOINT = "/auth";

export const AuthService = {
  signin: (data) => sendRequest(`${API_ENDPOINT}/login`, data),
  signup: (data) => sendRequest(`${API_ENDPOINT}/register`, data),
  confirmEmail: (token, email) => sendRequest(`${API_ENDPOINT}/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
};

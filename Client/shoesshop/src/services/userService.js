import { sendRequest } from "./api";

const API_ENDPOINT = "/user";

export const UserService = {
  getUserInfo: () => sendRequest(`${API_ENDPOINT}/userinfo`, null, "GET"),
  updateUserAvatar: (form) => sendRequest(`${API_ENDPOINT}/avatar`, form, "PUT"),
  updateUserInfo: (data) => sendRequest(`${API_ENDPOINT}/updateinfo`, data, "PUT"),
  isAdmin: () => sendRequest(`${API_ENDPOINT}/checkrole`, null, "GET"),
  updateUserPass: (data) => sendRequest(`${API_ENDPOINT}/updatepass`, data, "PUT")
};

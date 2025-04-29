import { sendRequest } from "./api";

const API_ENDPOINT = "/brands";

export const BrandService = {
  getAll: () => sendRequest(`${API_ENDPOINT}/Get`, null, "GET"),
  create: (data) => sendRequest(`${API_ENDPOINT}/Create`, data, "POST"),
  update: (id, data) => sendRequest(`${API_ENDPOINT}/Update/${id}`, data, "PUT"),
  delete: (id) => sendRequest(`${API_ENDPOINT}/Delete/${id}`, null, "DELETE"),
};

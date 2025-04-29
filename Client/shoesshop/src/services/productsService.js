import { sendRequest } from "./api";

const API_ENDPOINT = "/Products";

export  const ProductsService = {
    getAll: () => sendRequest(`${API_ENDPOINT}`, null, "GET"),
    create: (data) => sendRequest(`${API_ENDPOINT}`, data, "POST"),
    getProductById: (id) => sendRequest(`${API_ENDPOINT}/${id}`, null, "GET")
  };

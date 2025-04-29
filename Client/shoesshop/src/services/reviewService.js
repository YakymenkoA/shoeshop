import { sendRequest } from "./api";

const API_ENDPOINT = "/Reviews";

export const ReviewService = {
    getAll: (page = 1, pageSize = 10) => sendRequest(`${API_ENDPOINT}?page=${page}&pageSize=${pageSize}`, null, "GET"),
    getById: (id) => sendRequest(`${API_ENDPOINT}/${id}`, null, "GET"),
    getByProductId: (productId) => sendRequest(`${API_ENDPOINT}/byProduct/${productId}`, null, "GET"),
    create: (data) => sendRequest(`${API_ENDPOINT}`, data, "POST"),
    update: (id, data) => sendRequest(`${API_ENDPOINT}/${id}`, data, "PUT"),
    delete: (id) => sendRequest(`${API_ENDPOINT}/${id}`, null, "DELETE"),
};

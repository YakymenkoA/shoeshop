import { sendRequest } from "./api";

const API_ENDPOINT = "/orders";

export const OrdersService = {
    getAllUserOrders: () => sendRequest(`${API_ENDPOINT}/userorders`, null, "GET"),
    getOrderById: (id) => sendRequest(`${API_ENDPOINT}/${id}`, null, "GET"),
    createOrder: (data) => sendRequest(`${API_ENDPOINT}`, data)
};

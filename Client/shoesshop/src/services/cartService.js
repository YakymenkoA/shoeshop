import { sendRequest } from "./api";

const API_ENDPOINT = "/cartitems";

export const CartItemService = {
    createCartItem: (data) => sendRequest(`${API_ENDPOINT}`, data),
    getCartItems: () => sendRequest(`${API_ENDPOINT}`, null, "GET"),
    deleteCartItem: (id) => sendRequest(`${API_ENDPOINT}/${id}`, null, "DELETE"),
    updateCartItem: (data) => sendRequest(`${API_ENDPOINT}/update`, data, "PUT"),
    getCartItemCount: () => sendRequest(`${API_ENDPOINT}/quantity`, null, "GET"),
};

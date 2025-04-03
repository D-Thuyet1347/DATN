import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/cart";

const cartAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getCart = async (userId) => {
    try {
        const response = await cartAPI.post("/getCart", { userId });
        return response.data.cartData;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const addToCart = async (userId, itemId) => {
    try {
        await cartAPI.post("/addToCart", { userId, itemId });
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const decreaseFromCart = async (userId, itemId) => {
    try {
        await cartAPI.post("/decreaseFromCart", { userId, itemId });
    } catch (error) {
        console.error("Error decreasing cart item:", error);
        throw error;
    }
};

export const removeFromCart = async (userId, itemId) => {
    try {
        await cartAPI.post("/removeFromCart", { userId, itemId });
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

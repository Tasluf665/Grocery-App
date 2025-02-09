import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories, fetchProductDetails } from "./fetchProducts";

// 🔹 Async thunk to fetch categories from Firestore
export const getCategories = createAsyncThunk(
    "categories/fetchAll",
    async () => await fetchCategories()
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload; // 🔹 Now products are real objects
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default categoriesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsByCategoryOrSection } from "./fetchProducts";

// 🔹 Async thunk to fetch products by category or section
export const getProductsByCategoryOrSection = createAsyncThunk(
    "products/fetchByCategoryOrSection",
    async ({ id, type }) => {
        return await fetchProductsByCategoryOrSection(id, type);
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProductsByCategoryOrSection.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductsByCategoryOrSection.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProductsByCategoryOrSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsBySearch } from "./fetchProducts";

// 🔹 Async thunk for searching products
export const searchProducts = createAsyncThunk(
    "search/fetchProducts",
    async (query) => {
        return await fetchProductsBySearch(query);
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        results: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default searchSlice.reducer;

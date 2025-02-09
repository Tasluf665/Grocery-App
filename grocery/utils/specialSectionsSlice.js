import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllSpecialSections } from "./fetchProducts";

// 🔹 Async thunk to fetch special sections from Firestore
export const getSpecialSections = createAsyncThunk(
    "specialSections/fetchAll",
    async () => {
        return await fetchAllSpecialSections();
    }
);

const specialSectionsSlice = createSlice({
    name: "specialSections",
    initialState: {
        sections: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSpecialSections.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSpecialSections.fulfilled, (state, action) => {
                state.loading = false;
                state.sections = action.payload;
            })
            .addCase(getSpecialSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default specialSectionsSlice.reducer;

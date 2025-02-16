import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // 🔹 Import Firebase

// 🔹 Fetch favorite products (Resolve Firestore References)
export const fetchPayments = createAsyncThunk("payments/fetch", async () => {
    const user = auth.currentUser;
    if (!user) return []; // No user logged in

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? userSnap.data().payments || [] : [];
});

const paymentsSlice = createSlice({
    name: "payments",
    initialState: {
        payments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default paymentsSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebase"; // 🔹 Import Firebase

// 🔹 Fetch favorite products (Resolve Firestore References)
export const fetchFavorites = createAsyncThunk("favorites/fetch", async () => {
    const user = auth.currentUser;
    if (!user) return []; // No user logged in

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const productRefs = userSnap.data().favorites || []; // Get product references

    if (productRefs.length === 0) return []; // No favorites

    // 🔹 Fetch all product details using references
    const productPromises = productRefs.map(async (productRef) => {
        const productSnap = await getDoc(productRef);
        return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
    });

    const products = await Promise.all(productPromises);
    return products.filter((product) => product !== null); // Remove null values
});

// 🔹 Add a product to favorites (Store as Firestore Reference and return full product data)
export const addFavorite = createAsyncThunk("favorites/add", async (productId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const productRef = doc(db, "products", productId);

    await updateDoc(userRef, {
        favorites: arrayUnion(productRef), // 🔹 Store reference, not string
    });

    // 🔹 Fetch full product details immediately
    const productSnap = await getDoc(productRef);
    return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
});

// 🔹 Remove a product from favorites (Remove Firestore Reference)
export const removeFavorite = createAsyncThunk("favorites/remove", async (productId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const productRef = doc(db, "products", productId);

    await updateDoc(userRef, {
        favorites: arrayRemove(productRef), // 🔹 Remove reference, not string
    });

    return productId;
});

// 🔹 Favorites Slice
const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        favorites: [], // Stores product details, not just IDs
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                if (action.payload) {
                    state.favorites.push(action.payload); // ✅ Now directly adding full product data
                }
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter((item) => item.id !== action.payload);
            });
    },
});

export default favoritesSlice.reducer;

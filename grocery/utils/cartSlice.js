import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import Firebase

// 🔹 Fetch Cart Items (Resolve Firestore References)
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const cartRefs = userSnap.data().cart || [];

    if (cartRefs.length === 0) return [];

    // 🔹 Fetch product details in a batch
    const cartPromises = cartRefs.map(async (cartItem) => {
        const productRef = cartItem.product;
        const productSnap = await getDoc(productRef);
        return productSnap.exists()
            ? { id: productSnap.id, ...productSnap.data(), quantity: cartItem.quantity }
            : null;
    });

    const cartItems = await Promise.all(cartPromises);
    return cartItems.filter((item) => item !== null);
});

// 🔹 Add a product to the cart (Store as Firestore Reference)
export const addToCart = createAsyncThunk("cart/add", async ({ productId, quantity = 1 }) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const productRef = doc(db, "products", productId);

    const userSnap = await getDoc(userRef);
    const cart = userSnap.exists() ? userSnap.data().cart || [] : [];

    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.product.id === productRef.id);

    let updatedCart;
    if (existingItem) {
        // If exists, increase quantity by the desired amount
        updatedCart = cart.map((item) =>
            item.product.id === productRef.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    } else {
        // If not, add new product with the desired quantity
        updatedCart = [...cart, { product: productRef, quantity }];
    }

    await updateDoc(userRef, { cart: updatedCart });

    return { id: productId, quantity: existingItem ? existingItem.quantity + quantity : quantity };
});


// 🔹 Decrease a product quantity (Remove if quantity is 1)
export const decreaseFromCart = createAsyncThunk("cart/decrease", async (productId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const cart = userSnap.data().cart || [];
    const existingItem = cart.find((item) => item.product.id === productId);

    let updatedCart;
    if (existingItem && existingItem.quantity > 1) {
        // Reduce quantity
        updatedCart = cart.map((item) =>
            item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
    } else {
        // If quantity is 1, remove item
        updatedCart = cart.filter((item) => item.product.id !== productId);
    }

    await updateDoc(userRef, { cart: updatedCart });

    return { id: productId, quantity: existingItem ? existingItem.quantity - 1 : 0 };
});

// 🔹 Remove a product from the cart
export const removeFromCart = createAsyncThunk("cart/remove", async (productId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const cart = userSnap.data().cart || [];
    const updatedCart = cart.filter((item) => item.product.id !== productId);

    await updateDoc(userRef, { cart: updatedCart });

    return productId;
});

// 🔹 Add all favorite products to the cart (Avoid duplicates)
export const addAllFavoritesToCart = createAsyncThunk("cart/addAllFavorites", async (_, { getState, dispatch }) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const cart = userSnap.data().cart || [];
    const favorites = getState().favorites.favorites; // Get favorites from Redux store

    let updatedCart = [...cart];

    // Loop through favorites and add only missing items to cart
    favorites.forEach((favorite) => {
        const existsInCart = cart.some((item) => item.product.id === favorite.id);
        if (!existsInCart) {
            updatedCart.push({ product: doc(db, "products", favorite.id), quantity: 1 });
        }
    });

    await updateDoc(userRef, { cart: updatedCart });

    // 🔹 Auto-refresh cart after updating
    dispatch(fetchCart());
});


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const existingItem = state.cart.find((item) => item.id === action.payload.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.cart.push(action.payload);
                }
            })
            .addCase(decreaseFromCart.fulfilled, (state, action) => {
                const existingItem = state.cart.find((item) => item.id === action.payload.id);
                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        existingItem.quantity -= 1;
                    } else {
                        // If quantity becomes 0, remove item
                        state.cart = state.cart.filter((item) => item.id !== action.payload.id);
                    }
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = state.cart.filter((item) => item.id !== action.payload);
            })
            .addCase(addAllFavoritesToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAllFavoritesToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addAllFavoritesToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default cartSlice.reducer;

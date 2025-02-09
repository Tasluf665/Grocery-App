import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Keep this import for Redux Persist
import authReducer from "./authSlice"; // 🔹 Import auth slice
import specialSectionsReducer from "./specialSectionsSlice";
import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productsSlice";
import searchReducer from "./searchSlice";
import favoritesReducer from "./favoritesSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage, // ✅ This is required for Redux Persist (separate from Firebase)
    whitelist: ["auth", "favorites"], // 🔹 Persist only selected reducers
};

const rootReducer = combineReducers({
    auth: authReducer, // 🔹 Add auth to store
    favorites: favoritesReducer,
    specialSections: specialSectionsReducer,
    products: productsReducer,
    search: searchReducer,
    categories: categoriesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // ✅ Avoid serialization issues with Firebase objects
        }),
});

export const persistor = persistStore(store);

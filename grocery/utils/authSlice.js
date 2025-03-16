import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // 🔹 Import Firebase
import { updateUserProfile, changeUserPassword } from './authService';


// 🔹 Register User & Save to Firestore
export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });
            await sendEmailVerification(user);

            // 🔹 Save user info in Firestore
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username,
                favorites: [],
                createdAt: new Date().toISOString(),
                emailVerified: false,
            });

            await signOut(auth); // Logout after signup until verification
            return { uid: user.uid, email: user.email, username };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await sendEmailVerification(user);
                await signOut(auth);
                return rejectWithValue("Email not verified. Check your inbox.");
            } else {
                // 🔹 Get user data from Firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                return userSnap.exists() ? userSnap.data() : null;
            }


        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Forgot Password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return "Password reset email sent!";
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await signOut(auth);
});

export const updateProfileThunk = createAsyncThunk(
    'auth/updateProfile',
    async (name, { rejectWithValue }) => {
        try {
            await updateUserProfile(name);
            return { username: name };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const changePasswordThunk = createAsyncThunk(
    'auth/changePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            await changeUserPassword(currentPassword, newPassword);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        signupError: null,
        loginError: null,
        message: null,
    },
    reducers: {
        resetError: (state) => {
            state.signupError = null;
            state.loginError = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Handle Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.signupError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.signupError = action.payload;
            })

            // 🔹 Handle Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.loginError = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action.payload;
            })

            // 🔹 Handle Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Handle Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })

            // 🔹 Handle Update Profile
            .addCase(updateProfileThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Handle Change Password
            .addCase(changePasswordThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePasswordThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;

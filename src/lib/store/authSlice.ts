import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface AuthState {
    user: any;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

// Async thunk для регистрации
export const signUp = createAsyncThunk(
    'auth/signUp',
    async (userData: SignUpData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;

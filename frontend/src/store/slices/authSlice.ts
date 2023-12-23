import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserCredenitials } from "../../../../shared/types/user";
import authApiService from "../../services/authApi/authApiService";
import { setIsPageLoading } from "./systemSlice";
import { AppThunk, UserOrNull } from "../../types/app";
import userApiService from "../../services/user/userApiService";

interface AuthState {
  loggedInUser: UserOrNull;
}

const initialState: AuthState = {
  loggedInUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser(state, action: PayloadAction<UserOrNull>) {
      state.loggedInUser = action.payload;
    },
  },
});

export const { setLoggedInUser } = authSlice.actions;

export default authSlice.reducer;

export function signup(userCredentials: UserCredenitials): AppThunk {
  return async dispatch => {
    const user = await authApiService.signup(userCredentials);
    dispatch(setLoggedInUser(user));
  };
}

export function login(username: string, password: string): AppThunk {
  return async dispatch => {
    const user = await authApiService.login(username, password);
    dispatch(setLoggedInUser(user));
  };
}

export function loginWithToken(): AppThunk {
  return async dispatch => {
    dispatch(setIsPageLoading(true));
    try {
      const user = await authApiService.loginWithToken();
      dispatch(setLoggedInUser(user));
    } catch (err) {
      dispatch(setIsPageLoading(false));
    }
  };
}

export function logout(): AppThunk {
  return async dispatch => {
    await authApiService.logout();
    dispatch(setLoggedInUser(null));
  };
}

export function updateLoggedInUser(user: User): AppThunk {
  return async dispatch => {
    const updatedUser = await userApiService.update(user);
    dispatch(setLoggedInUser(updatedUser));
  };
}

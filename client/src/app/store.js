// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk"; // Correct import for redux-thunk
import {rootReducer} from "../reducers/rootReducer";
import {jwtDecode} from "jwt-decode";

// Retrieve and decode the token from localStorage
const token = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).accessToken : null;
let userInfoFromLocalStorage = null;

if (token) {
  try {
    userInfoFromLocalStorage = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
  }
}

// Define initial state
const initialState = {
  userLogin: {
    userInfo: userInfoFromLocalStorage ? { accessToken: token } : null,
  },
};

// Configure middleware
const mymiddleware = [thunk];

// Configure store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mymiddleware),
  devTools: true,
});

export default store;

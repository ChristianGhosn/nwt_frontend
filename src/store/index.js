import { configureStore } from "@reduxjs/toolkit";
// Import your slices here
import cashReducer from "./slices/cashSlice";

export const store = configureStore({
  reducer: {
    cash: cashReducer,
  },
});

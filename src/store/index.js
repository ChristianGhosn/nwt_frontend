import { configureStore } from "@reduxjs/toolkit";
// Import your slices here
import cashReducer from "./slices/cashSlice";
import etfReducer from "./slices/etfSlice";

export const store = configureStore({
  reducer: {
    cash: cashReducer,
    etf: etfReducer,
  },
});

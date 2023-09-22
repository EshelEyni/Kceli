import { configureStore } from "@reduxjs/toolkit";

import systemSlice from "./slices/systemSlice";
import authSlice from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    system: systemSlice,
    auth: authSlice,
  },
});

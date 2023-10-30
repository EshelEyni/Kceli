import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SystemState {
  isPageLoading: boolean;
  isAppHeaderBtnGoBtnShown: boolean;
}

const initialState: SystemState = {
  isPageLoading: true,
  isAppHeaderBtnGoBtnShown: false,
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setIsPageLoading(state, action: PayloadAction<boolean>) {
      state.isPageLoading = action.payload;
    },
    setGoBackBtnLink(state, action: PayloadAction<boolean>) {
      state.isAppHeaderBtnGoBtnShown = action.payload;
    },
  },
});

export const { setIsPageLoading, setGoBackBtnLink } = systemSlice.actions;

export default systemSlice.reducer;

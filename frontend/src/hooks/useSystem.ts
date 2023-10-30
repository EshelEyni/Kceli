import { useSelector } from "react-redux";
import { RootState } from "../types/app";
import { SystemState } from "../store/slices/systemSlice";

export function useSystem(): SystemState {
  const { isPageLoading, isAppHeaderBtnGoBtnShown: goBackBtnLink } = useSelector((state: RootState) => state.system);
  return { isPageLoading, isAppHeaderBtnGoBtnShown: goBackBtnLink };
}

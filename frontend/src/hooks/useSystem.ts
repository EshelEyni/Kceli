import { useSelector } from "react-redux";
import { RootState } from "../types/app";

type UseSystem = {
  isPageLoading: boolean;
};

export function useSystem(): UseSystem {
  const { isPageLoading } = useSelector((state: RootState) => state.system);
  return { isPageLoading };
}

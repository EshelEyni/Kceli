import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DayData } from "../../../shared/types/dayData";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { useAuth } from "./useAuth";

type useGetTodayDataResult = {
  dailyData: DayData | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetTodayData(): useGetTodayDataResult {
  const { loggedInUser } = useAuth();
  const getClockKey = () => {
    const now = new Date();
    return [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("/");
  };
  const [clockKey, setClockKey] = useState(getClockKey);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      setClockKey(getClockKey());
      clearTimeout(timer);
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      // Recheck clock/zone changes while open, and schedule precisely at local midnight.
      timer = setTimeout(check, Math.min(midnight.getTime() - now.getTime(), 30000));
    };
    check();
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  const {
    data: dailyData,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["today", loggedInUser?.id, clockKey],
    queryFn: dayDataApiService.getToday,
    enabled: !!loggedInUser,
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });

  return { dailyData, error, isLoading, isSuccess, isError };
}

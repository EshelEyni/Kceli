import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../../shared/types/user";
import { DailyMotivationResult } from "../../../shared/types/dailyMotivation";

function localClock() {
  const now = new Date();
  return { date: [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-"),
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone };
}
export function useDailyMotivation(user: User | null, active = true) {
  const enabled = active && user?.dailyMotivationEnabled === true;
  const [clock, setClock] = useState(localClock);
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const next = localClock();
      setClock(previous => previous.date === next.date && previous.zone === next.zone ? previous : next);
      clearTimeout(timer);
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(check, Math.min(midnight.getTime() - now.getTime(), 30000));
    };
    check();
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => { clearTimeout(timer); window.removeEventListener("focus", check); document.removeEventListener("visibilitychange", check); };
  }, [enabled]);
  const query = useQuery<DailyMotivationResult>({
    queryKey: ["dailyMotivation", user?.id, user?.language, clock.date, clock.zone],
    enabled, retry: false, staleTime: 0, cacheTime: 0,
    refetchOnWindowFocus: "always", refetchOnReconnect: "always",
    refetchInterval: data => data?.status === "pending" ? 2000 : false,
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/user/daily-motivation", {
        method: "POST", credentials: "include", cache: "no-store", signal,
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timeZone: clock.zone }),
      });
      if (!response.ok) throw new Error("Daily motivation unavailable");
      const body = await response.json();
      const data = body.data;
      if (body.status !== "success" || !data || typeof data.localDate !== "string" ||
          !["disabled", "pending", "ready", "failed"].includes(data.status) ||
          (data.status === "ready" && (typeof data.text !== "string" || !data.text.trim() || data.text.length > 240)))
        throw new Error("Invalid daily motivation");
      return data;
    },
  });
  // Disabling takes effect immediately, even if an older request finishes later.
  return enabled && !query.isError && query.data?.localDate === localClock().date && query.data.status === "ready"
    ? query.data.text : null;
}

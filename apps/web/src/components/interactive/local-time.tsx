"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/** Live clock in the owner's time zone. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (seconds === null) return <span className="tabular-nums">--:--:--</span>;

  const date = new Date(seconds * 1000);
  const time = date.toLocaleTimeString("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {time}
    </time>
  );
}

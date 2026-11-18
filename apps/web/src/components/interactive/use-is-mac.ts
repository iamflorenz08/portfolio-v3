import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function useIsMac() {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true,
  );
}

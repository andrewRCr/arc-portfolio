/**
 * useIsClient - Hydration detection hook
 *
 * Returns true only after client-side hydration, false on server.
 * Uses useSyncExternalStore (React 18+ recommended pattern) for safe
 * hydration-aware rendering.
 *
 * @example
 * const isClient = useIsClient();
 * // Only render client-specific content after hydration
 * if (!isClient) return <Placeholder />;
 * return <ClientOnlyContent />;
 */

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

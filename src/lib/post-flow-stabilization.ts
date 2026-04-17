/** Optional: pause fellowship rails when stabilizing (env `NEXT_PUBLIC_POST_FLOW_STABILIZE=1`). */
export function isPostFlowStabilizationMode(): boolean {
  try {
    return process.env.NEXT_PUBLIC_POST_FLOW_STABILIZE === "1";
  } catch {
    return false;
  }
}

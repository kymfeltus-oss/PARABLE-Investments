/**
 * Optional: reduce concurrent image traffic on /my-sanctuary.
 * Set `NEXT_PUBLIC_POST_FLOW_BANDWIDTH_EMERGENCY=0` in `.env.local` for full UI.
 */
export function isEmergencyPostFlowBandwidthSave(): boolean {
  try {
    return process.env.NEXT_PUBLIC_POST_FLOW_BANDWIDTH_EMERGENCY !== "0";
  } catch {
    return true;
  }
}

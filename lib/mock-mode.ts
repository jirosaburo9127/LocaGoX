export function isMockModeEnabled() {
  return process.env.LOCAGOX_MOCK_MODE === "1" || process.env.LOCAGOX_MOCK_MODE === "true";
}

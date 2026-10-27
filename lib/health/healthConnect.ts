// No native HealthKit / Health Connect provider is installed or configured yet.
// An unavailable integration must never appear to have measured zero activity.

export interface HealthData {
  steps: number;
  calories: number;
  workouts: { name: string; duration: number; calories: number; date: string }[];
}

export async function requestHealthPermissions(): Promise<boolean> {
  return false;
}

export async function readHealthData(_date: Date): Promise<HealthData> {
  throw new Error("A sincronização de saúde ainda não está disponível.");
}

export function isHealthAvailable(): boolean {
  return false;
}

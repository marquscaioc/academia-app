import { Platform } from "react-native";

// Abstraction layer for Apple Health / Google Health Connect
// Requires native build (expo-health-connect) — web returns empty data

export interface HealthData {
  steps: number;
  calories: number;
  workouts: { name: string; duration: number; calories: number; date: string }[];
}

export async function requestHealthPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  try {
    // This will need expo-health-connect installed for native builds
    // For now, return false on web and handle gracefully
    return false;
  } catch {
    return false;
  }
}

export async function readHealthData(_date: Date): Promise<HealthData> {
  if (Platform.OS === "web") {
    return { steps: 0, calories: 0, workouts: [] };
  }

  try {
    // Placeholder: actual implementation requires expo-health-connect
    // which needs a native build (not available on web/Expo Go)
    return { steps: 0, calories: 0, workouts: [] };
  } catch {
    return { steps: 0, calories: 0, workouts: [] };
  }
}

export function isHealthAvailable(): boolean {
  return Platform.OS !== "web";
}

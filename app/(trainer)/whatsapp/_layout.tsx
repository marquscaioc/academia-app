import { Stack } from "expo-router";

export default function WhatsAppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B0811" },
      }}
    />
  );
}

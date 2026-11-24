import { Tabs } from "expo-router";
import { Text } from "react-native";

const icon =
  (glyph: string) =>
  ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{glyph}</Text>
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("\uD83C\uDFE0") }} />
      <Tabs.Screen name="create" options={{ title: "Tambah", tabBarIcon: icon("\u2795") }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorite", tabBarIcon: icon("\u2764\uFE0F") }} />
    </Tabs>
  );
}
import { Link, Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#22c55e",
        tabBarStyle: {
          backgroundColor: "#07100b",
          borderTopColor: "#1a3325",
        },
        headerStyle: {
          backgroundColor: "#07100b",
        },
        headerTintColor: "#ffffff",
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "event",
                web: "event",
              }}
              tintColor={color}
              size={24}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: "info.circle", android: "info", web: "info" }}
                    size={22}
                    tintColor="#86a894"
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Ordens de Serviço",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "doc.text",
                android: "assignment",
                web: "assignment",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

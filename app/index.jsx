import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getUserSession } from "../utils/authHelper";

export default function IndexScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log("[INDEX] Checking auth status...");
      const session = await getUserSession();
      console.log("[INDEX] Session data:", session);

      if (session && session.isAuthenticated) {
        // User is logged in, go to dashboard
        console.log("[INDEX] User authenticated, navigating to tabs...");
        router.replace("/(tabs)");
      } else {
        // User is not logged in, go to auth page
        console.log("[INDEX] User not authenticated, navigating to Auth...");
        router.replace("/Auth");
      }
    } catch (error) {
      console.error("[INDEX] Auth check error:", error);
      // On error, redirect to auth
      router.replace("/Auth");
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading while checking auth
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00b4d8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    justifyContent: "center",
    alignItems: "center",
  },
});

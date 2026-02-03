import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "userSession";

export const isAuthenticated = async () => {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    if (!session) return false;

    const sessionData = JSON.parse(session);
    return sessionData.isAuthenticated === true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const getUserSession = async () => {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    console.log("[AUTH HELPER] Raw session from storage:", session);
    if (!session) return null;

    const parsed = JSON.parse(session);
    console.log("[AUTH HELPER] Parsed session:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const saveUserSession = async (sessionData) => {
  try {
    console.log("[AUTH HELPER] Saving session:", sessionData);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    console.log("[AUTH HELPER] Session saved successfully");
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    console.log("[AUTH HELPER] Session cleared");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

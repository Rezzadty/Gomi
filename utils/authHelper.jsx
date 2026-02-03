import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'userSession';

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const session = await SecureStore.getItemAsync(SESSION_KEY);
    if (!session) return false;

    const sessionData = JSON.parse(session);
    return sessionData.isAuthenticated === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get user session data
export const getUserSession = async () => {
  try {
    const session = await SecureStore.getItemAsync(SESSION_KEY);
    if (!session) return null;

    return JSON.parse(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Save user session
export const saveUserSession = async (sessionData) => {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Logout user
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

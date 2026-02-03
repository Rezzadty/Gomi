import CryptoJS from "crypto-js";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SuccessModal } from "../components/SuccessModal";
import { saveUserSession } from "../utils/authHelper";
import "../utils/cryptoPolyfill"; // Must be first to setup crypto

const SECRET_KEY = "iot-dashboard-secret-key-2025";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const encryptedCredentials = {
    username: CryptoJS.AES.encrypt("admin", SECRET_KEY).toString(),
    password: CryptoJS.AES.encrypt("password123", SECRET_KEY).toString(),
  };

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return "";
    }
  };

  const handleLogin = async () => {
    console.log("Login button pressed");
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    console.log("Validating credentials...");

    try {
      const validUsername = decryptData(encryptedCredentials.username);
      const validPassword = decryptData(encryptedCredentials.password);

      console.log("Username valid:", username === validUsername);
      console.log("Password valid:", password === validPassword);

      if (username === validUsername && password === validPassword) {
        console.log("Login successful, saving session...");
        await saveUserSession({
          isAuthenticated: true,
          username: username,
          loginTime: new Date().toISOString(),
        });

        console.log("Session saved successfully");
        setLoading(false);
        setShowSuccessModal(true);
      } else {
        console.log("Invalid credentials");
        setError("Invalid username or password");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  const handleModalComplete = () => {
    setShowSuccessModal(false);
    // Navigate to dashboard after modal closes
    setTimeout(() => {
      console.log("Navigating to dashboard...");
      router.replace("/(tabs)");
    }, 300);
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Air Quality Monitor</Text>
          <Text style={styles.subtitle}>
            Dashboard Monitoring Kualitas Udara
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading || showSuccessModal}
            activeOpacity={0.7}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        message="Mengalihkan ke dashboard..."
        onComplete={handleModalComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1a2f47",
    borderRadius: 16,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0f1f33",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#ffffff",
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  successText: {
    color: "#22c55e",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#00b4d8",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#334155",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
    marginTop: 10,
  },
});

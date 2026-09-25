import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { api } from "../services/api";
import { saveToken } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password) {
    Alert.alert(
      "Error",
      "Please enter your email and password."
    );
    return;
  }

  // TEMPORARY DEMO LOGIN
  // Remove this block when real backend login is ready.
  if (
    email.trim().toLowerCase() === "abc@gmail.com" &&
    password === "1234"
  ) {
    console.log("Demo login successful");

    router.replace("/home");
    return;
  }
// to this line 
  try {
    setLoading(true);

    const response = await api.post("/api/auth/login", {
      email: email.trim(),
      password: password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    const token = response.data.access_token;

    if (!token) {
      Alert.alert(
        "Login Failed",
        "No access token was received from the server."
      );
      return;
    }

    await saveToken(token);

    console.log("JWT saved successfully");

    router.replace("/home");

  } catch (error: any) {
    console.log("LOGIN ERROR:", error);
    console.log(
      "LOGIN ERROR RESPONSE:",
      error.response?.data
    );

    if (error.response?.status === 401) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password."
      );
    } else if (error.response?.status === 400) {
      Alert.alert(
        "Login Failed",
        "Invalid login data."
      );
    } else {
      Alert.alert(
        "Connection Error",
        "Unable to connect to the SMART CIVIC server."
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

      {/* Back */}
      <Pressable
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to continue using SMART CIVIC.
      </Text>

      {/* Email */}
      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#94A3B8"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      {/* Password */}
      <Text style={styles.label}>
        Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      {/* Login Button */}
      <Pressable
        style={[
          styles.loginButton,
          loading && styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginText}>
            LOGIN
          </Text>
        )}
      </Pressable>

      {/* Register */}
      <View style={styles.registerRow}>
        <Text style={styles.registerLabel}>
          Don't have an account?
        </Text>

        <Pressable
          onPress={() => router.push("/register")}
          disabled={loading}
        >
          <Text style={styles.registerLink}>
            {" "}Register
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 25,
    paddingTop: 60,
  },

  back: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 35,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 22,
  },

  loginButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerLabel: {
    color: "#64748B",
    fontSize: 14,
  },

  registerLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },
});
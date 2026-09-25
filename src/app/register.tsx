import React, { useState } from "react";
import { api } from "../services/api";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Check empty fields
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    // Check phone number
    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send registration request to FastAPI
      const response = await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully.",
        [
          {
            text: "Login",
            onPress: () => router.replace("/login"),
          },
        ]
      );

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log("REGISTER ERROR:", error);
      console.log("REGISTER ERROR RESPONSE:", error.response?.data);

      if (error.response?.status === 409) {
        Alert.alert(
          "Registration Failed",
          "An account with this email or phone number already exists."
        );
      } else if (error.response?.status === 400) {
        Alert.alert(
          "Registration Failed",
          "Invalid registration data."
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back */}
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join SMART CIVIC and help improve your community.
      </Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#94A3B8"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your 10-digit phone number"
        placeholderTextColor="#94A3B8"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Create a password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Register Button */}
      <Pressable
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </Text>
      </Pressable>

      {/* Login */}
      <View style={styles.loginRow}>
        <Text style={styles.loginLabel}>
          Already have an account?
        </Text>

        <Pressable
          onPress={() => router.replace("/login")}
          disabled={loading}
        >
          <Text style={styles.loginLink}> Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },

  back: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 25,
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
    marginBottom: 30,
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
    marginBottom: 20,
  },

  registerButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  loginLabel: {
    color: "#64748B",
    fontSize: 14,
  },

  loginLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },
});
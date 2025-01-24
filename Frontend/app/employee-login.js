import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import apiClient from "../constants/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { width, height } = Dimensions.get("window");

  const handleLogin = async () => {
    try {
      const response = await apiClient.post('/auth/login/employee', {
        email: username, // Use the email entered in the login form
        password,
      });

      const user = response.data;

      // Store the email in AsyncStorage
      await AsyncStorage.setItem('userEmail', username);

      alert('Login successful!');
      router.push('/EmployeeSchedule'); // Navigate to the Employee Schedule
    } catch (error) {
      alert(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  

  const handleRegister = () => {
    router.push("/employee-register");
  };

  const handleGoogleLogin = () => {
    alert("Google login functionality coming soon!");
  };

  return (
    <ImageBackground
      source={require("../assets/images/back.jpg")} // Path to your background image
      style={styles.background}
    >
      <View style={[styles.container, { padding: width > 600 ? 40 : 20 }]}>
        <View
          style={[
            styles.card,
            {
              width: width > 600 ? "50%" : "85%",
              padding: width > 600 ? 30 : 20,
            },
          ]}
        >
          <Text style={styles.heading}>Employee Login</Text>

          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.text}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* OR Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* Google Login Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image
              source={require("../assets/images/google-logo.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// Responsive Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Cover the entire screen
    justifyContent: "center", // Vertically center the content
    alignItems: "center", // Horizontally center the content
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 50, // Adjusted padding for top
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background to make the content stand out
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4F46E5",
    width: "100%",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default EmployeeLogin;
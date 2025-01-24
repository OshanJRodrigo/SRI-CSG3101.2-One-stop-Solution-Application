import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { scale, verticalScale, moderateScale } from "../app/responsive"; // Import scaling utilities
import apiClient from "../constants/api";
import { signInWithPopup } from "firebase/auth"; // Import Google login methods
import { auth, provider } from "../constants/firebaseConfig"; // Adjust the path to firebaseConfig
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const router = useRouter();

  const { width } = Dimensions.get("window");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In Success. User Info:", user);
      alert(`Welcome ${user.displayName}`);
      router.push("/category-page");
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await apiClient.post("/auth/login/customer", {
        email: username,
        password,
      });

      const user = response.data;

      // Store user details in AsyncStorage
      if (user.id) {
        await AsyncStorage.setItem("customerId", user.id); // Store the customer ID
      } else {
        console.warn("Customer ID is undefined or null. Not storing in AsyncStorage.");
      }

      if (user.name) {
        await AsyncStorage.setItem("userName", user.name); // Store the user's name
      } else {
        console.warn("User name is undefined or null. Not storing in AsyncStorage.");
      }

      // Store the email in AsyncStorage
      await AsyncStorage.setItem("userEmail", username); // Use the email entered in the login form

      alert("Login successful!");
      router.push("/category-page");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  const handleRegister = () => {
    router.push("/customer-register");
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/back.jpg")}
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
          <Text style={styles.heading}>Welcome back</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.text}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Image
              source={require("../assets/images/google-logo.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={
                isLoginSuccessful
                  ? require("../assets/images/verified.gif")
                  : require("../assets/images/fail.gif")
              }
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>
              {isLoginSuccessful
                ? "Login successful!"
                : "Invalid username or password."}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

// Responsive Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensure the image covers the screen
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
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    borderRadius: 10,
    shadowColor: "rgba(255, 250, 250, 0.8)",
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
    borderColor: "rgba(0, 0, 0, 0.3)",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomerLogin;
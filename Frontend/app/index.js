import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] = useState(require("../assets/images/back.jpg"));
  const [showLogo, setShowLogo] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  const fadeAnimLogo = useRef(new Animated.Value(0)).current;
  const fadeAnimWelcome = useRef(new Animated.Value(0)).current;
  const fadeAnimContent = useRef(new Animated.Value(0)).current;

  // Add a new animated value for vertical translation
  const translateYAnim = useRef(new Animated.Value(300)).current; // Initial position is 300px below the top

  useEffect(() => {
    // Fade in logo
    Animated.timing(fadeAnimLogo, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Fade out logo
      setTimeout(() => {
        Animated.timing(fadeAnimLogo, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setShowLogo(false);
          setShowWelcome(true);
          // Fade in Welcome
          Animated.timing(fadeAnimWelcome, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(fadeAnimWelcome, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }).start(() => {
                setShowWelcome(false);
                setShowMainContent(true);
                setBackgroundImage(require("../assets/images/intro2.jpg"));
                // Animate the container to move up
                Animated.timing(translateYAnim, {
                  toValue: 0, // Move it to the top (0)
                  duration: 1000,
                  useNativeDriver: true,
                }).start();
                // Fade in main content
                Animated.timing(fadeAnimContent, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }).start();
              });
            }, 1000);
          });
        });
      }, 1000);
    });
  }, [fadeAnimLogo, fadeAnimWelcome, fadeAnimContent, translateYAnim]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      {showLogo && (
        <View style={styles.center}>
          <Animated.Image
            source={require("../assets/images/logo1.png")}
            style={[styles.logo, { opacity: fadeAnimLogo }]}
          />
        </View>
      )}

      {showWelcome && (
        <View style={styles.center}>
          <Animated.Text style={[styles.welcomeText, { opacity: fadeAnimWelcome }]}>
            Welcome
          </Animated.Text>
        </View>
      )}

      {showMainContent && (
        <Animated.View
          style={[styles.mainContainer, { opacity: fadeAnimContent, transform: [{ translateY: translateYAnim }] }]}
        >
          <View style={styles.buttonsContainer}>
            <Text style={styles.solutionText}>A Simple Solution</Text>
            <Text style={styles.solutionText}>For Everything</Text>
            <Text style={styles.categoryText}>Please select your category</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/employee-login")}
            >
              <Text style={styles.buttonText}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCustomer}
              onPress={() => router.push("/customer-login")}
            >
              <Text style={styles.buttonCustomerText}>Customer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

export const config = {
  header: false,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  mainContainer: {
    flex: 1,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  solutionText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
    width: "90%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonCustomer: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
    width: "90%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonCustomerText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location"; // For location access
import { StyleSheet } from "react-native";
import apiClient from "../constants/api";

const EmployeeRegister = () => {
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNumber, setIdNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [idCardImage, setIdCardImage] = useState(null);
  const [experienceDocument, setExperienceDocument] = useState(null);
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null); // For storing location

  // Categories for skills
  const categories = [
    "Plumbing",
    "Electrical Wiring",
    "Furniture Repair",
    "Appliance Repair",
    "Gardening",
    "Painting",
    "Carpentry",
    "AC Repair",
    "Masonry",
    "Floor Tiling",
  ];

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIdCardImage(result.assets[0].uri);
    }
  };

  // Function to pick a document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type !== "cancel") {
        setExperienceDocument(result);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Function to get the user's current location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      alert("Location fetched successfully!");
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Error getting location. Please try again.");
    }
  };

  // Function to handle registration
  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone", PhoneNumber);
      formData.append("skills", JSON.stringify([selectedCategory]));
      formData.append("charge_per_hour", "50");
      formData.append("experience", experience);

      // Append location if available
      if (location) {
        formData.append("latitude", location.coords.latitude);
        formData.append("longitude", location.coords.longitude);
      }

      // Append ID card image if provided
      if (idCardImage) {
        const idCardFileExtension = idCardImage.split(".").pop().toLowerCase();
        const idCardMimeType =
          idCardFileExtension === "png" ? "image/png" : "image/jpeg";
        formData.append("id_card_image", {
          uri: idCardImage,
          type: idCardMimeType,
          name: `id_card.${idCardFileExtension}`,
        });
      }

      // Append experience document if provided
      if (experienceDocument) {
        formData.append("experience_document", {
          uri: experienceDocument.uri,
          type: experienceDocument.type || "application/pdf",
          name: experienceDocument.name,
        });
      }

      // Send data to the backend
      const response = await apiClient.post("/auth/register/employee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);
      alert(response.data.message || "Employee registered successfully!");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/back.jpg")} // Path to your background image
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Employee Registration
          </Text>

          {/* First Name Input */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Last Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Address Input */}
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Phone Number Input */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={PhoneNumber}
            onChangeText={setIdNumber}
          />

          {/* Location Button */}
          <TouchableOpacity style={styles.button} onPress={getLocation}>
            <Text style={styles.buttonText}>
              {location ? "Location Fetched" : "Allow Your Current Location"}
            </Text>
          </TouchableOpacity>

          {/* ID Card Image Upload */}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>
              {idCardImage ? "Change ID Card Image" : "Upload ID Card Image"}
            </Text>
          </TouchableOpacity>
          {idCardImage && (
            <Image
              source={{ uri: idCardImage }}
              style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 10 }}
            />
          )}

          {/* Experience Details Input */}
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Experience Details"
            multiline
            value={experience}
            onChangeText={setExperience}
          />

          {/* Experience Document Upload */}
          <TouchableOpacity style={styles.button} onPress={pickDocument}>
            <Text style={styles.buttonText}>
              {experienceDocument
                ? "Change Experience Document"
                : "Upload Experience Document"}
            </Text>
          </TouchableOpacity>
          {experienceDocument && (
            <Text style={{ textAlign: "center", marginBottom: 10 }}>
              {experienceDocument.name} ({(experienceDocument.size / 1024).toFixed(2)} KB)
            </Text>
          )}

          {/* Category Selection */}
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Select a Category:
          </Text>
          <ScrollView horizontal style={{ marginBottom: 10 }}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryBox,
                  selectedCategory === category && styles.selectedCategoryBox,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={{
                    color: selectedCategory === category ? "#fff" : "#000",
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  categoryBox: {
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  selectedCategoryBox: {
    backgroundColor: "#007BFF",
  },
  registerButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default EmployeeRegister;
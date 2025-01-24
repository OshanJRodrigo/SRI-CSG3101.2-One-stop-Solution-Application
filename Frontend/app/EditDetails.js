import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Picker,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const EditDetails = ({ userDetails, setUserDetails, navigation }) => {
  // Initialize formData with userDetails or default values
  const [formData, setFormData] = useState({
    dp: userDetails?.dp || require("../assets/images/google-logo.png"), // Default image if dp is not available
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",
    address: userDetails?.address || "",
    contact: userDetails?.contact || "",
    category: userDetails?.category || "Plumbing", // Default category
  });

  // Categories list
  const categories = [
    "Plumbing",
    "Electrical Repairs",
    "Furniture Repair",
    "Appliance Repair",
    "Painting",
    "Carpentry",
    "Landscaping",
    "Cleaning Services",
    "Pest Control",
    "Handyman Services",
  ];

  // Pick an image from the library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData({ ...formData, dp: result.uri });
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Validate form data
  const validateForm = () => {
    const { firstName, lastName, email, address, contact } = formData;
    if (!firstName || !lastName || !email || !address || !contact) {
      Alert.alert("Validation Error", "Please fill in all the fields.");
      return false;
    }
    return true;
  };

  // Save changes and go back to schedule
  const handleSave = () => {
    if (validateForm()) {
      setUserDetails(formData);
      navigation.goBack(); // Navigate back to EmployeeSchedule
    }
  };

  if (!userDetails) {
    return <Text>Loading...</Text>; // Show loading if userDetails is not available
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Your Details</Text>

      {/* Profile Picture */}
      <TouchableOpacity style={styles.dpContainer} onPress={pickImage}>
        <Image
          source={formData.dp ? { uri: formData.dp } : require("../assets/images/google-logo.png")} // Use default image if dp is not available
          style={styles.dp}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(value) => handleChange("address", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={formData.contact}
        onChangeText={(value) => handleChange("contact", value)}
      />

      {/* Category Selector */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Category:</Text>
        <Picker
          selectedValue={formData.category}
          onValueChange={(value) => handleChange("category", value)}
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  dpContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  dp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  changePhotoText: {
    color: "#4F46E5",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

EditDetails.defaultProps = {
  userDetails: {
    dp: require("../assets/images/google-logo.png"),
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contact: "",
    category: "Plumbing",
  },
};

export default EditDetails;

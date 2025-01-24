import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, ImageBackground } from "react-native";
const EmployeeView = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Placeholder data for the nearest and best employees
  const nearestEmployeePremium1 = {
    name: "John Doe",
    distance: "1.2 km away",
    pricePerHour: "$50/hr", // Price per hour for Premium
  };

  const nearestEmployeePremium2 = {
    name: "Alice Brown",
    distance: "2.4 km away",
    pricePerHour: "$55/hr", // Price per hour for Premium
  };

  const nearestEmployeePremium3 = {
    name: "David Wilson",
    distance: "3.1 km away",
    pricePerHour: "$53/hr", // Price per hour for Premium
  };

  const bestEmployeePremium = {
    name: "Jane Smith",
    rating: "4.9/5",
    pricePerHour: "$70/hr", // Price per hour for Best Employee in Premium
  };

  const nearestEmployeeNormal1 = {
    name: "Mike Johnson",
    distance: "3.4 km away",
    pricePerHour: "$30/hr", // Price per hour for Normal
  };

  const nearestEmployeeNormal2 = {
    name: "Eva Green",
    distance: "4.2 km away",
    pricePerHour: "$32/hr", // Price per hour for Normal
  };

  const nearestEmployeeNormal3 = {
    name: "Chris White",
    distance: "5.3 km away",
    pricePerHour: "$31/hr", // Price per hour for Normal
  };

  const bestEmployeeNormal = {
    name: "Sarah Lee",
    rating: "4.7/5",
    pricePerHour: "$40/hr", // Price per hour for Best Employee in Normal
  };

  // Function to show the modal and set the selected employee
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  // Function to handle the confirm action
  const handleConfirm = () => {
    alert("Booking Confirmed");
    setIsModalVisible(false); // Close the modal after confirmation
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal without confirming
  };

  return (
    <ImageBackground
      source={require("../assets/images/back.jpg")} // Path to your background image
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Upper Section: Title */}
        <View style={styles.upperContainer}>
          <Text style={styles.title}>Google Map</Text>
        </View>

        {/* Premium Package Section */}
        <View style={styles.premiumSection}>
          <Text style={styles.packageTitle}>Premium Package</Text>

          {/* Horizontal Scroll for Premium Package Employees */}
          <ScrollView horizontal contentContainerStyle={styles.scrollRow}>
            {/* Nearest Employee 1 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeePremium1)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 1</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeePremium1.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeePremium1.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeePremium1.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Nearest Employee 2 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeePremium2)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 2</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeePremium2.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeePremium2.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeePremium2.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Nearest Employee 3 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeePremium3)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 3</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeePremium3.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeePremium3.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeePremium3.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Best Employee */}
            <TouchableOpacity onPress={() => handleEmployeeClick(bestEmployeePremium)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Best Employee</Text>
                <Text style={styles.boxText}>Name: {bestEmployeePremium.name}</Text>
                <Text style={styles.boxText}>Rating: {bestEmployeePremium.rating}</Text>
                <Text style={styles.boxText}>Price: {bestEmployeePremium.pricePerHour}</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Normal Package Section */}
        <View style={styles.normalSection}>
          <Text style={styles.packageTitle}>Normal Package</Text>

          {/* Horizontal Scroll for Normal Package Employees */}
          <ScrollView horizontal contentContainerStyle={styles.scrollRow}>
            {/* Nearest Employee 1 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeeNormal1)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 1</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeeNormal1.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeeNormal1.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeeNormal1.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Nearest Employee 2 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeeNormal2)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 2</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeeNormal2.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeeNormal2.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeeNormal2.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Nearest Employee 3 */}
            <TouchableOpacity onPress={() => handleEmployeeClick(nearestEmployeeNormal3)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Nearest Employee 3</Text>
                <Text style={styles.boxText}>Name: {nearestEmployeeNormal3.name}</Text>
                <Text style={styles.boxText}>Distance: {nearestEmployeeNormal3.distance}</Text>
                <Text style={styles.boxText}>Price: {nearestEmployeeNormal3.pricePerHour}</Text>
              </View>
            </TouchableOpacity>

            {/* Best Employee */}
            <TouchableOpacity onPress={() => handleEmployeeClick(bestEmployeeNormal)}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Best Employee</Text>
                <Text style={styles.boxText}>Name: {bestEmployeeNormal.name}</Text>
                <Text style={styles.boxText}>Rating: {bestEmployeeNormal.rating}</Text>
                <Text style={styles.boxText}>Price: {bestEmployeeNormal.pricePerHour}</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Modal for Booking Confirmation */}
        <Modal
          visible={isModalVisible}
          animationType=""
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <Text style={styles.modalText}>
                Do you want to book {selectedEmployee ? selectedEmployee.name : ""}?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#",
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },

  upperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
    textAlign: 'center',
  },
  scrollRow: {
    flexDirection: "row",
    paddingHorizontal: 400,
    justifyContent: "center",
    alignItems: 'center',
  },
  box: {
    width: 200,
    height: 250,
    backgroundColor: "rgba(105, 187, 225, 0.7)",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    alignItems: "center",
    justifyContent: 'center', 
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  boxText: {
    fontSize: 14,
    color: "#666",
  },
  normalSection: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(212, 35, 35, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row", 
    justifyContent: "center", // This centers the buttons horizontally
    alignItems: "center", // This centers them vertically if needed
    width: "100%", // Ensure buttons take the full width of the container
    marginTop: 10, // Add spacing if needed
  },

  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EmployeeView;

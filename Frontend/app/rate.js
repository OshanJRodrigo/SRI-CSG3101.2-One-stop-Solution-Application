import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install expo-fontawesome package

const Rate = () => {
  // Sample employee data
  const employeeName = 'John Doe';
  const employeePhoto = 'https://via.placeholder.com/100'; // Replace with the actual photo URL
  const [rating, setRating] = useState(0); // Track the rating value

  const handleStarPress = (index) => {
    setRating(index + 1); // Set the rating when a star is pressed
  };

  const renderReceiptTab = () => {
    return (
      <View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Estimated Fare:</Text>
          <Text style={styles.receiptValue}>LKR 652.47</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Estimated Duration:</Text>
          <Text style={styles.receiptValue}>21 minutes 41 seconds</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Estimated Distance:</Text>
          <Text style={styles.receiptValue}>6.45 km</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Actual Fare:</Text>
          <Text style={styles.receiptValue}>LKR 652.47</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Actual Duration:</Text>
          <Text style={styles.receiptValue}>27 minutes 24 seconds</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Actual Distance:</Text>
          <Text style={styles.receiptValue}>6.69 km</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Discount:</Text>
          <Text style={styles.receiptValue}>-LKR 0.00</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Total Trip Fare:</Text>
          <Text style={styles.receiptValue}>LKR 652.47</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Paid Amount:</Text>
          <Text style={styles.receiptValue}>LKR 652.47</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Paid by:</Text>
          <Text style={styles.receiptValue}>Cash</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Employee Photo and Name */}
      <View style={styles.employeeContainer}>
        <Image source={{ uri: employeePhoto }} style={styles.employeePhoto} />
        <Text style={styles.employeeName}>{employeeName}</Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>What do you think about the service?</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
              <FontAwesome
                name={index < rating ? 'star' : 'star-o'}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Receipt Details Section */}
      <ScrollView style={styles.receiptContainer}>
        {renderReceiptTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  employeeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  employeePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  receiptContainer: {
    marginTop: 20,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#555',
  },
  receiptValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
  },
});

export default Rate;

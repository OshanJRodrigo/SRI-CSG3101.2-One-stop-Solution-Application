import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

function PaymentScreen({  }) {
  

  const balance = 2782.56; // Example balance, you can replace it with the actual value from userDetails

  return (
    <ImageBackground source={require('../assets/images/back.jpg')} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.balanceText}>Saving Account</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        <Text style={styles.bankDetails}>IBAN: DE89 3704 0044 0532 0130 00</Text>
        <Text style={styles.bankDetails}>BIC: COBADEFFXXX</Text>
      </View>

      <ScrollView style={styles.transactions}>
        <Text style={styles.transactionHeader}>Today</Text>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionText}>Internet Bill</Text>
          <Text style={styles.transactionAmount}>- $60.00</Text>
        </View>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionText}>To your balance</Text>
          <Text style={styles.transactionAmount}>+ $30.00</Text>
        </View>

        <Text style={styles.transactionHeader}>11 Dec, 2024</Text>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionText}>Masum Parvej</Text>
          <Text style={styles.transactionAmount}>+ $60.00</Text>
        </View>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionText}>To your balance</Text>
          <Text style={styles.transactionAmount}>+ $70.00</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // Transparent background to show the image
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    color: '#fff', // White text to stand out on the background
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff', // White text for balance amount
  },
  bankDetails: {
    fontSize: 14,
    color: '#ddd', // Lighter text for bank details
  },
  transactions: {
    marginTop: 20,
  },
  transactionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#fff',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  transactionText: {
    fontSize: 16,
    color: '#fff', // White text for transaction details
  },
  transactionAmount: {
    fontSize: 16,
    color: '#fff', // White text for amounts
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF', // Blue color for buttons
    padding: 15,
    borderRadius: 5,
    width: '28%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Details = () => {
  // Sample data for service and customer details
  const serviceId = '123456';
  const serviceName = 'Plumbing';
  const serviceDate = '2025-01-17';
  const serviceTime = '10:00 AM';
  const customerName = 'John Doe';
  const customerService = 'Plumbing';

  const [selectedTab, setSelectedTab] = useState('receipt');

  const renderReceiptTab = () => {
    return (
      <View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Estimated Fee:</Text>
          <Text style={styles.receiptValue}>LKR 652.47</Text>
        </View>
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Estimated Duration:</Text>
          <Text style={styles.receiptValue}>21 minutes 41 seconds</Text>
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
        <View style={styles.separator} />
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Discount:</Text>
          <Text style={styles.receiptValue}>-LKR 0.00</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.receiptItem}>
          <Text style={styles.receiptLabel}>Total fee:</Text>
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

  const renderHelpTab = () => {
    return (
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Help Section</Text>
        {/* Add Help content here */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.serviceId}>Service ID: {serviceId}</Text>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        {/* Top Section - Service Name, Date and Time */}
        <View style={styles.topContainer}>
          <Text style={styles.serviceName}>{serviceName}</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>{serviceDate}</Text>
            <Text style={styles.dateTimeText}>{serviceTime}</Text>
          </View>
        </View>

        {/* Status and Rate Now Button */}
        {/* Status and Rate Now Button */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Completed</Text>
          
          <TouchableOpacity 
            style={styles.rateButton}
            onPress={() => navigation.navigate('rate')} // Navigate to Rate.js
          >
            <Text style={styles.rateButtonText}>view your rating</Text>
          </TouchableOpacity>
        </View>

        {/* customer Details Container */}
        <View style={styles.customerContainer}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.customerService}>{customerService}</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact the customer</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'receipt' && styles.activeTab]}
            onPress={() => setSelectedTab('receipt')}
          >
            <Text style={styles.tabText}>Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'help' && styles.activeTab]}
            onPress={() => setSelectedTab('help')}
          >
            <Text style={styles.tabText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.tabContent}>
          {selectedTab === 'receipt' ? renderReceiptTab() : renderHelpTab()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  serviceId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
    marginBottom: 20,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  rateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  customerContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  customerService: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  contactButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
    
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tabText: {
    color: '#333',
    fontSize: 14,
  },
  tabContent: {
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
  helpContainer: {
    padding: 20,
  },
  helpText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Details;

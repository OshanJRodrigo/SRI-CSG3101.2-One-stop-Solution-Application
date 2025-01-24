import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

const ActivityPage = () => {
  const [activeTab, setActiveTab] = useState('Ongoing');
  const router = useRouter();

  // Sample data for ongoing services (empty in this case)
  const ongoingActivities = []; // Update this to test content in "Ongoing"
  const completedActivities = [
    {
      id: 1,
      name: 'Activity Name',
      serviceType: 'Plumbing',
      serviceId: '12345',
      date: '12th January 2025',
      time: '10:30 AM',
      description: 'Short description of the completed activity.',
      locationFrom: '123 Main St',
      locationTo: '456 Park Ave',
      price: 120,
    },

    // Add more entries as needed
  ];

  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Ongoing':
        if (ongoingActivities.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Image source={require('../assets/images/LD.gif')} style={styles.emptyImage} />
              <Text style={styles.emptyText}>You have no ongoing services</Text>
              <Text style={styles.emptyText}>at the moment</Text>
            </View>
          );
        }
        // If there are ongoing activities, render a scrollable list of them
        return (
          <ScrollView style={styles.completedContainer}>
            {ongoingActivities.map((activity) => (
              <View key={activity.id} style={styles.card}>
                <Image source={require('../assets/images/logo1.png')} style={styles.cardLogo} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardServices}>Services Type: {activity.serviceType}</Text>
                  <View style={styles.cardDateContainer}>
                    <Text style={styles.cardDate}>{activity.date}</Text>
                    <Text style={styles.cardTime}>{activity.time}</Text>
                  </View>
                  <Text style={styles.newLineText}>Service ID: {activity.serviceId}</Text>
                  <Text style={styles.cardCompleted}>Ongoing</Text>
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => router.push('/CustomerView')}
                  >
                    <Text style={styles.rateButtonText}>Go to service</Text>
                  </TouchableOpacity>
  
                  <View style={styles.detailsContainer}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => router.push('/ondetails')}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                    <View style={styles.priceContainer}>
                      <Image source={require('../assets/images/money.png')} style={styles.priceLogo} />
                      <Text style={styles.priceText}>${activity.price}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        );

      case 'Completed':
        if (completedActivities.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No completed activities to display.</Text>
            </View>
          );
        }
        return (
          <ScrollView style={styles.completedContainer}>
            {completedActivities.map((activity) => (
              <View key={activity.id} style={styles.card}>
                <Image source={require('../assets/images/logo1.png')} style={styles.cardLogo} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardServices}>Services Type: {activity.serviceType}</Text>
                  <View style={styles.cardDateContainer}>
                    <Text style={styles.cardDate}>{activity.date}</Text>
                    <Text style={styles.cardTime}>{activity.time}</Text>
                  </View>
                  <Text style={styles.newLineText}>Service ID: {activity.serviceId}</Text>
                  <Text style={styles.cardCompleted}>Completed</Text>
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => router.push('/rate')}
                  >
                    <Text style={styles.rateButtonText}>Rate now</Text>
                  </TouchableOpacity>
   
                  <View style={styles.detailsContainer}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => router.push('/details')}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                    <View style={styles.priceContainer}>
                      <Image source={require('../assets/images/money.png')} style={styles.priceLogo} />
                      <Text style={styles.priceText}>${activity.price}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        );

      case 'Complaints':
        if (ongoingActivities.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Image source={require('../assets/images/bad.gif')} style={styles.emptyImage} />
              <Text style={styles.emptyText}>You have no complaints</Text>
              <Text style={styles.emptyText}>at the moment</Text>
            </View>
          );
        }
        return <Text style={styles.tabContent}>Here are your ongoing activities.</Text>;
    }
  };

  return (
    <ImageBackground source={require('../assets/images/wh.jpg')} style={styles.container}>
      <View style={styles.mainContent}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Activities</Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabBar}>
          {['Ongoing', 'Completed', 'Complaints'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Render Active Tab Content */}
        <ScrollView style={styles.tabContentContainer}>
          {renderTabContent()}
        </ScrollView>
      </View>

      {/* Footer with Bottom Buttons (fixed at the bottom) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/category-page')}>
          <Image source={require('../assets/images/home.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/Activity')}>
          <Image source={require('../assets/images/activity.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/Notification')}>
          <Image source={require('../assets/images/notification.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/Account')}>
          <Image source={require('../assets/images/account.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  mainContent: {
    flex: 1,
    paddingBottom: 80, // Adjusted to prevent overlap with footer
  },
  titleContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 100,
  },
  emptyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLogo: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  cardContent: {
    marginLeft: 60,
  },
  cardServices: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
  },
  cardDateContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  newLineText: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
  },
  cardCompleted: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 10,
  },
  rateButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationContainer: {
    marginTop: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  detailsButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLogo: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#007BFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  footerIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  footerButtonText: {
    color: '#007BFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ActivityPage;
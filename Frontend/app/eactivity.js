import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons'; // Import icons from the library

const ActivityPage = () => {
  const [activeTab, setActiveTab] = useState('Ongoing');
  const router = useRouter();

  // Sample data for activities
  const activities = [
    {
      id: 1,
      name: 'Activity Name',
      serviceType: 'Plumbing Service',
      serviceId: 'SRV-001',
      date: '12th January 2025',
      time: '10:30 AM',
      locationFrom: '123 Main St',
      locationTo: '456 Park Ave',
      price: 120,
      status: 'ongoing',
    },
    {
      id: 2,
      name: 'Another Activity',
      serviceType: 'Electrical Work',
      serviceId: 'SRV-002',
      date: '10th January 2025',
      time: '2:15 PM',
      locationFrom: '789 Oak Rd',
      locationTo: '321 Pine St',
      price: 85,
      status: 'completed',
    },
  ];

  // Render activity card
  const ActivityCard = ({ activity }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="home-repair-service" size={20} color="#007BFF" />
          </View>
          <View>
            <Text style={styles.serviceType}>{activity.serviceType}</Text>
            <Text style={styles.serviceId}>ID: {activity.serviceId}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.date}>{activity.date}</Text>
          <Text style={styles.time}>{activity.time}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={16} color="#777" />
        <View>
          <Text style={styles.locationText}>From: {activity.locationFrom}</Text>
          <Text style={styles.locationText}>To: {activity.locationTo}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <FontAwesome name="money" size={16} color="#007BFF" />
          <Text style={styles.priceText}>${activity.price}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => router.push('/edetails')}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (activity.status === 'completed') {
                router.push('/erate');
              } else {
                router.push('/CustomerView');
              }
            }}
          >
            {activity.status === 'completed' ? (
              <>
                <FontAwesome name="star" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Rate Service</Text>
              </>
            ) : (
              <>
                <Feather name="arrow-right" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Go to Service</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render empty state
  const EmptyState = ({ message, icon: Icon }) => (
    <View style={styles.emptyContainer}>
      <Icon size={48} color="#777" />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

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
          {activeTab === 'Ongoing' && (
            activities.filter((a) => a.status === 'ongoing').length > 0 ? (
              activities
                .filter((a) => a.status === 'ongoing')
                .map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
            ) : (
              <EmptyState
                message="No ongoing services"
                icon={() => <MaterialIcons name="hourglass-empty" size={48} color="#777" />}
              />
            )
          )}

          {activeTab === 'Completed' && (
            activities.filter((a) => a.status === 'completed').length > 0 ? (
              activities
                .filter((a) => a.status === 'completed')
                .map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
            ) : (
              <EmptyState
                message="No completed activities"
                icon={() => <FontAwesome name="star-o" size={48} color="#777" />}
              />
            )
          )}

          {activeTab === 'Complaints' && (
            <EmptyState
              message="No complaints filed"
              icon={() => <MaterialIcons name="warning" size={48} color="#777" />}
            />
          )}
        </ScrollView>
      </View>

      {/* Footer with Bottom Navigation */}
      <View style={styles.footer}>
        {[
          { icon: 'home', label: 'Home', route: '/EmployeeSchedule' },
          { icon: 'activity', label: 'Activity', route: '/eactivity' },
          { icon: 'bell', label: 'Notification', route: '/enotification' },
          { icon: 'user', label: 'Account', route: '/eaccount' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.footerButton}
            onPress={() => router.push(item.route)}
          >
            <Feather name={item.icon} size={24} color="#007BFF" />
            <Text style={styles.footerButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 80, // Adjust for footer height
  },
  titleContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  tabContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceId: {
    fontSize: 12,
    color: '#777',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    marginRight: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#007BFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default ActivityPage;
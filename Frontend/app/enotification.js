import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      // Example notifications
      setNotifications([
        {
          id: 1,
          image: require('../assets/images/logo1.png'), // Replace with your image path
          serviceType: 'Plumbing Service',
          location: 'Mithila Samara',
          timeSlot: '10:00 AM',
        },

      ]);
    };

    fetchNotifications();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/wh.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {notifications.length === 0 ? (
            <View style={styles.noNotificationsContainer}>
              <Image
                source={require('../assets/images/notifications.gif')}
                style={styles.noNotificationsIcon}
              />
              <Text style={styles.noNotificationsText}>You have no notifications</Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationCard}>
                <Image
                  source={notification.image}
                  style={styles.notificationImage}
                />
                <View style={styles.notificationDetails}>
                  <Text style={styles.serviceType}>{notification.serviceType}</Text>
                  <Text style={styles.location}>{notification.location}</Text>
                  <Text style={styles.timeSlot}>{notification.timeSlot}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/EmployeeSchedule')}
          >
            <Image source={require('../assets/images/home.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/eactivity')}
          >
            <Image source={require('../assets/images/activity.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/enotification')}
          >
            <Image source={require('../assets/images/notification.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/eaccount')}
          >
            <Image source={require('../assets/images/account.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  noNotificationsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noNotificationsIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  noNotificationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  notificationDetails: {
    flex: 1,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeSlot: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1, // Take equal space
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1, // Take equal space
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default NotificationPage;

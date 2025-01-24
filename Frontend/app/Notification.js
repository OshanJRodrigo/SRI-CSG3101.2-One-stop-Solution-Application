import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulated empty notifications
      setNotifications([]);
    };
    fetchNotifications();
  }, []);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.iconCircle}>
        <Ionicons name="notifications-off-outline" size={48} color="#A0AEC0" />
      </View>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>You're all caught up!</Text>
    </View>
  );

  const NavBar = () => (
    <View style={styles.navbar}>
      {[
        { icon: 'home-outline', label: 'Home', route: '/category-page' },
        { icon: 'time-outline', label: 'Activity', route: '/Activity' },
        { icon: 'notifications-outline', label: 'Alerts', route: '/Notification' },
        { icon: 'person-outline', label: 'Profile', route: '/Account' }
      ].map((item, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.navItem}
          onPress={() => router.push(item.route)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={item.label === 'Alerts' ? '#3182CE' : '#718096'} 
          />
          <Text style={[
            styles.navLabel,
            item.label === 'Alerts' && styles.activeNavLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EmptyState />
      </ScrollView>

      <NavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748'
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#EDF2F7'
  },
  clearButtonText: {
    color: '#3182CE',
    fontSize: 14,
    fontWeight: '500'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%'
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center'
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  navItem: {
    alignItems: 'center'
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#718096'
  },
  activeNavLabel: {
    color: '#3182CE'
  }
});

export default NotificationPage;
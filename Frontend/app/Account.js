import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import apiClient from '../constants/api';

const AccountPage = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) return;
        const response = await apiClient.get(`/auth/customer/${email}`);
        setCustomerName(`${response.data.first_name} ${response.data.last_name}`);
      } catch (error) {
        console.error('Failed to fetch customer name:', error);
      }
    };
    fetchCustomerName();
  }, []);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    router.push('/customer-login');
  };

  const MenuButton = ({ icon, title, onPress }) => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.menuButtonGradient}
      >
        <Image source={icon} style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4a90e2', '#357abd']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <Image
            source={require('../assets/images/support.png')}
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={styles.nameContainer}
            onPress={() => router.push('/CustomerInfoPage')}
          >
            <Text style={styles.name}>{customerName || 'Loading...'}</Text>
            <Text style={styles.viewProfile}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.menuSection}>
          <MenuButton
            icon={require('../assets/images/member-card.png')}
            title="Membership Help"
            onPress={() => router.push('/membership-help')}
          />
          <MenuButton
            icon={require('../assets/images/support.png')}
            title="Help and Support"
            onPress={() => router.push('/support')}
          />
          <MenuButton
            icon={require('../assets/images/payment-method.png')}
            title="Payment"
            onPress={() => router.push('/payment')}
          />
          <MenuButton
            icon={require('../assets/images/contractor.png')}
            title="Earn with OneSalution"
            onPress={() => router.push('/earn-with-onesalution')}
          />
          <MenuButton
            icon={require('../assets/images/info.png')}
            title="About Us"
            onPress={() => router.push('/about-us')}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navbar}>
        {[
          { icon: 'home', label: 'Home', route: '/category-page' },
          { icon: 'time', label: 'Activity', route: '/Activity' },
          { icon: 'notifications', label: 'Alerts', route: '/Notification' },
          { icon: 'person', label: 'Account', route: '/Account' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={index === 3 ? "#007AFF" : "#666"} 
            />
            <Text style={[styles.navLabel, index === 3 && styles.activeNavLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <BlurView intensity={90} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffffff'
  },
  nameContainer: {
    marginLeft: 15,
  },
  name: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  viewProfile: {
    color: '#ffffff',
    opacity: 0.8,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  menuSection: {
    padding: 20,
  },
  menuButton: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#ff4757',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavLabel: {
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#2d3436',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  confirmButton: {
    backgroundColor: '#ff4757',
  },
  cancelButtonText: {
    color: '#2d3436',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountPage;
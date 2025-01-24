import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, Modal, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import apiClient from '../constants/api';

const AccountPage = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const fetchEmployeeName = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) return;
        const response = await apiClient.get(`/auth/employee/${email}`);
        const data = response.data;
        setEmployeeName(`${data.first_name} ${data.last_name}`);
      } catch (error) {
        console.error('Failed to fetch employee name:', error);
      }
    };
    fetchEmployeeName();
  }, []);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await AsyncStorage.clear();
    router.push('/employee-login');
  };

  const MenuButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.menuButtonGradient}
      >
        <Image source={icon} style={styles.menuIcon} />
        <Text style={styles.menuText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/wh.jpg')}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Header */}
          <BlurView intensity={80} style={styles.profileHeader}>
            <Image
              source={require('../assets/images/support.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.nameContainer}
              onPress={() => router.push('/ecus')}
            >
              <Text style={styles.nameText}>{employeeName || 'Loading...'}</Text>
              <Text style={styles.viewProfileText}>View Profile ›</Text>
            </TouchableOpacity>
          </BlurView>

          {/* Menu Options */}
          <View style={styles.menuGrid}>
            <MenuButton
              icon={require('../assets/images/member-card.png')}
              label="Membership Help"
              onPress={() => router.push('/membership-help')}
            />
            <MenuButton
              icon={require('../assets/images/support.png')}
              label="Help & Support"
              onPress={() => router.push('/HelpAndSupport')}
            />
            <MenuButton
              icon={require('../assets/images/payment-method.png')}
              label="Payment"
              onPress={() => router.push('/PaymentScreen')}
            />
            <MenuButton
              icon={require('../assets/images/contractor.png')}
              label="Become a User"
              onPress={() => router.push('/becomeauser')}
            />
            <MenuButton
              icon={require('../assets/images/info.png')}
              label="About Us"
              onPress={() => router.push('/about-us')}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Navigation */}
        <BlurView intensity={80} style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/EmployeeSchedule')}
          >
            <Image source={require('../assets/images/home.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/eactivity')}
          >
            <Image source={require('../assets/images/activity.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/enotification')}
          >
            <Image source={require('../assets/images/notification.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, styles.activeNav]}
            onPress={() => router.push('/eaccount')}
          >
            <Image source={require('../assets/images/account.png')} style={styles.navIcon} />
            <Text style={[styles.navText, styles.activeText]}>Account</Text>
          </TouchableOpacity>
        </BlurView>

        {/* Logout Modal */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          animationType="fade"
        >
          <BlurView intensity={90} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  viewProfileText: {
    fontSize: 14,
    color: '#007AFF',
  },
  menuGrid: {
    paddingHorizontal: 20,
  },
  menuButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
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
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activeNav: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  activeText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountPage;
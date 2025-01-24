import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiClient from '../constants/api';

const CustomerInfoPage = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [info, setInfo] = useState({ phone: '', email: '' });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) return;
        const response = await apiClient.get(`/auth/customer/${email}`);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setInfo({ phone: response.data.phone, email: response.data.email });
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
      }
    };
    fetchCustomerData();
  }, []);

  const handleEdit = (field) => {
    setSelectedField(field);
    setFieldValue(field === 'name' ? `${firstName} ${lastName}` : info[field]);
    setModalVisible(true);
  };

  const saveChanges = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;

      const updatedData = selectedField === 'name'
        ? { first_name: firstName, last_name: lastName }
        : { [selectedField]: fieldValue };

      await apiClient.put(`/auth/customer/${email}`, updatedData);
      
      if (selectedField === 'name') {
        const [newFirstName, ...rest] = fieldValue.split(' ');
        setFirstName(newFirstName);
        setLastName(rest.join(' '));
      } else {
        setInfo(prev => ({ ...prev, [selectedField]: fieldValue }));
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to update customer data:', error);
    }
  };

  const InfoCard = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.cardGradient}
      >
        <View style={styles.cardIcon}>
          <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>{label}</Text>
          <Text style={styles.cardValue}>{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4a90e2', '#357abd']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {firstName?.[0] || ''}{lastName?.[0] || ''}
            </Text>
          </View>
          <Text style={styles.fullName}>{`${firstName} ${lastName}`}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoCard
            icon="person-outline"
            label="Full Name"
            value={`${firstName} ${lastName}`}
            onPress={() => handleEdit('name')}
          />
          <InfoCard
            icon="call-outline"
            label="Phone Number"
            value={info.phone}
            onPress={() => handleEdit('phone')}
          />
          <InfoCard
            icon="mail-outline"
            label="Email Address"
            value={info.email}
            onPress={() => handleEdit('email')}
          />
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={90} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedField === 'name' ? 'Edit Name' : `Edit ${selectedField}`}
            </Text>
            {selectedField === 'name' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#666"
                />
              </>
            ) : (
              <TextInput
                style={styles.input}
                value={fieldValue}
                onChangeText={setFieldValue}
                placeholderTextColor="#666"
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  fullName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3436',
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2d3436',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    color: '#2d3436',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  saveButton: {
    backgroundColor: '#4a90e2',
  },
  cancelButtonText: {
    color: '#2d3436',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomerInfoPage;
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

const ServiceProviderProfile = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [info, setInfo] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    nic: '',
    address: '',
  });

  const categories = [
    "Plumbing", "Electrical Wiring", "Furniture Repair", 
    "Appliance Repair", "Gardening", "Painting", 
    "Carpentry", "AC Repair", "Masonry", "Floor Tiling"
  ];

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) return;
        const response = await apiClient.get(`/auth/employee/${email}`);
        setInfo({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          phone: response.data.phone,
          email: response.data.email,
          nic: response.data.nic,
          address: response.data.address,
        });
        setSelectedCategories(response.data.skills || []);
      } catch (error) {
        console.error('Failed to fetch provider data:', error);
      }
    };
    fetchProviderData();
  }, []);

  const handleEdit = (field) => {
    setSelectedField(field);
    setFieldValue(info[field]);
    setModalVisible(true);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const saveChanges = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;

      const updatedData = { [selectedField]: fieldValue };
      await apiClient.put(`/auth/employee/${email}`, updatedData);
      setInfo(prev => ({ ...prev, [selectedField]: fieldValue }));
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to update provider data:', error);
    }
  };

  const saveCategories = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;

      await apiClient.put(`/auth/employee/${email}`, { skills: selectedCategories });
      setCategoryModalVisible(false);
    } catch (error) {
      console.error('Failed to update categories:', error);
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
        <Text style={styles.headerTitle}>Service Provider Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {info.first_name?.[0]}{info.last_name?.[0]}
            </Text>
          </View>
          <Text style={styles.fullName}>
            {`${info.first_name} ${info.last_name}`}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoCard
            icon="person-outline"
            label="Full Name"
            value={`${info.first_name} ${info.last_name}`}
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
          <InfoCard
            icon="card-outline"
            label="NIC Number"
            value={info.nic}
            onPress={() => handleEdit('nic')}
          />
          <InfoCard
            icon="location-outline"
            label="Address"
            value={info.address}
            onPress={() => handleEdit('address')}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Skills & Categories</Text>
          <TouchableOpacity 
            style={styles.categoriesCard}
            onPress={() => setCategoryModalVisible(true)}
          >
            <View style={styles.categoriesContainer}>
              {selectedCategories.map((category, index) => (
                <View key={index} style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{category}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={90} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {selectedField}
            </Text>
            <TextInput
              style={styles.input}
              value={fieldValue}
              onChangeText={setFieldValue}
              placeholderTextColor="#666"
            />
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

      {/* Categories Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={90} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Categories</Text>
            <ScrollView style={styles.categoriesList}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(category) && styles.selectedCategory
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[
                    styles.categoryItemText,
                    selectedCategories.includes(category) && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                  {selectedCategories.includes(category) && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveCategories}
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
  categoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  categoryChipText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
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
  categoriesList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f6fa',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#4a90e2',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#2d3436',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
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
  },
});

export default ServiceProviderProfile;
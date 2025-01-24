import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Animated as RNAnimated,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../constants/api';
import StarRating from '../components/StarRating';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 220;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MapScreen = () => {
  const params = useLocalSearchParams();
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  const [markers, setMarkers] = useState([]);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // State to toggle date picker
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  let mapIndex = 0;
  let mapAnimation = new RNAnimated.Value(0);

  // Fetch customer ID from backend
  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (!userEmail) {
          console.warn('User email not found in AsyncStorage.');
          return;
        }

        const response = await apiClient.get(`/auth/customer/${userEmail}`);
        if (response.data && response.data.id) {
          setCustomerId(response.data.id);
        } else {
          console.warn('Customer ID not found in response.');
        }
      } catch (error) {
        console.error('Failed to fetch customer ID:', error);
        Alert.alert('Error', 'Failed to fetch customer ID. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerId();
  }, []);

  // Parse and transform data
  useEffect(() => {
    const { customerLocation: customerLocationString, markers: markersString } = stableParams;

    if (!customerLocationString || !markersString) {
      console.warn('Customer location or markers data is missing.');
      return;
    }

    try {
      const parsedCustomerLocation = JSON.parse(customerLocationString);
      const parsedMarkers = JSON.parse(markersString);

      console.log('Parsed Customer Location:', parsedCustomerLocation);
      console.log('Parsed Markers:', parsedMarkers);

      setCustomerLocation({
        latitude: parsedCustomerLocation.latitude,
        longitude: parsedCustomerLocation.longitude,
      });

      const transformedMarkers = parsedMarkers
        .slice(0, 5) // Limit to 5 nearest employees
        .map((business, index) => ({
          id: business.id || index,
          profileImageUrl: business.profileImageUrl || "https://via.placeholder.com/150",
          firstName: business.firstName || "Unknown",
          lastName: business.lastName || "",
          phone: business.phone || "123-456-7890",
          stars: business.stars || 5,
          numOfReviews: business.numOfReviews || 0,
          chargePerHour: business.chargePerHour || 0,
          distanceFromCustomer: business.distanceFromCustomer || "0.0 km",
          latitude: business.latitude || 0,
          longitude: business.longitude || 0,
          email: business.email || "",
          address: business.address || "",
          experience: business.experience || 0,
          starCategoryCount: business.starCategoryCount || {},
        }));

      if (JSON.stringify(transformedMarkers) !== JSON.stringify(markers)) {
        setMarkers(transformedMarkers);
      }
    } catch (error) {
      console.error('Failed to parse data:', error);
      Alert.alert('Error', 'Failed to parse data. Please check the input format.');
    }
  }, [stableParams, markers]);

  // Handle "Book Now" button click
  const handleBookNow = async (marker) => {
    if (!customerId) {
      Alert.alert('Error', 'Customer ID not found. Please log in again.');
      return;
    }

    // Show the time slot selection modal
    setSelectedMarker(marker);
    setTimeSlotModalVisible(true);
  };

  // Handle time slot selection
  const handleTimeSlotSelection = async (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotModalVisible(false);

    try {
      const bookingData = {
        customerId: customerId,
        employeeId: selectedMarker.id,
        chargePerHour: selectedMarker.chargePerHour,
        serviceDuration: 1,
        serviceType: "Repair",
        status: "pending",
        dateOfBooking: selectedDate.toISOString(), // Use selected date
        timeSlot: timeSlot, // Add the selected time slot to the booking data
        employeeName: `${selectedMarker.firstName} ${selectedMarker.lastName}`,
        employeeLocation: {
          latitude: selectedMarker.latitude,
          longitude: selectedMarker.longitude,
        },
      };

      console.log('Booking Data:', bookingData);

      const response = await apiClient.post('/bookings', bookingData);
      console.log('Booking Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Booking has been successfully created!');
      } else {
        Alert.alert('Error', 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'An error occurred while creating the booking. Please try again.');
    }
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  // Handle "View Profile" button click
  const handleViewProfile = (marker) => {
    setSelectedMarker(marker);
    setProfileModalVisible(true);
  };

  // Automatically focus the marker corresponding to the selected card
  useEffect(() => {
    const listener = mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= markers.length) index = markers.length - 1;
      if (index <= 0) index = 0;

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { latitude, longitude } = markers[index];
          mapRef.current.animateToRegion(
            {
              latitude: latitude - 0.02,
              longitude: longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            },
            1000
          );
        }
      }, 10);
    });

    return () => {
      mapAnimation.removeListener(listener);
    };
  }, [markers]);

  // Handle card click
  const handleCardPress = (marker) => {
    setSelectedMarker(marker);
    setModalVisible(true);

    mapRef.current.animateToRegion(
      {
        latitude: marker.latitude - 0.02,
        longitude: marker.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      1000
    );
  };

  // Relocate to customer location
  const handleRelocate = () => {
    if (customerLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: customerLocation.latitude,
          longitude: customerLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Nearby</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        customMapStyle={[]}
        initialRegion={{
          latitude: customerLocation?.latitude || 0,
          longitude: customerLocation?.longitude || 0,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
      >
        {/* Customer Marker */}
        {customerLocation && (
          <Marker
            coordinate={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
            }}
            title="You"
            onPress={handleRelocate}
          >
            <View style={styles.customerMarker}>
              <View style={styles.customerDot} />
              <View style={styles.customerRing} />
            </View>
          </Marker>
        )}

        {/* Employee Markers */}
        {markers.map((marker, index) => {
          const scaleStyle = {
            transform: [{ scale: mapAnimation.interpolate({
              inputRange: [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                (index + 1) * CARD_WIDTH,
              ],
              outputRange: [0.75, 1.03, 0.75],
              extrapolate: 'clamp',
            }) }],
          };

          return (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={(e) => {
                let x = index * CARD_WIDTH + index * 20;
                if (Platform.OS === 'ios') x = x - SPACING_FOR_CARD_INSET;
                scrollViewRef.current.scrollTo({ x, y: 0, animated: true });
              }}
            >
              <RNAnimated.View style={[styles.markerWrap, scaleStyle]}>
                <Image
                  source={{ uri: marker.profileImageUrl }}
                  style={styles.markerImage}
                  resizeMode="cover"
                />
                <View style={styles.markerRating}>
                  <Text style={styles.markerRatingText}>{marker.stars}</Text>
                  <Ionicons name="star" size={8} color="#FFD700" />
                </View>
              </RNAnimated.View>
            </Marker>
          );
        })}
      </MapView>

      {/* Cards */}
      <RNAnimated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
          { useNativeDriver: true }
        )}
      >
        {markers.map((marker) => (
          <TouchableOpacity
            key={marker.id}
            style={styles.card}
            onPress={() => handleCardPress(marker)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
              style={styles.cardGradient}
            >
              <Image
                source={{ uri: marker.profileImageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>{marker.firstName} {marker.lastName}</Text>
                  <View style={styles.ratingContainer}>
                    <StarRating rating={marker.stars} numOfRatings={marker.numOfReviews} />
                    <Text style={styles.reviewCount}>({marker.numOfReviews})</Text>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.infoItem}>
                    <MaterialIcons name="location-on" size={16} color="#666" />
                    <Text style={styles.infoText}>{marker.distanceFromCustomer} away</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <FontAwesome5 name="dollar-sign" size={14} color="#666" />
                    <Text style={styles.infoText}>LKR {marker.chargePerHour}/hr</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewProfile(marker)}
                  >
                    <Text style={styles.actionButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handleBookNow(marker)}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </RNAnimated.ScrollView>

      {/* Relocate Button */}
      <TouchableOpacity
        style={styles.relocateButton}
        onPress={handleRelocate}
      >
        <View style={styles.relocateButtonInner}>
          <MaterialIcons name="my-location" size={24} color="#333" />
        </View>
      </TouchableOpacity>

      {/* Booking Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.primaryButton]}
              onPress={() => {
                handleBookNow(selectedMarker);
                setModalVisible(false);
              }}
            >
              <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleViewProfile(selectedMarker);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            <ScrollView>
              <View style={styles.profileHeader}>
                <Image
                  source={{ uri: selectedMarker?.profileImageUrl || "https://via.placeholder.com/150" }}
                  style={styles.profileImage}
                />
                <Text style={styles.name}>{selectedMarker?.firstName} {selectedMarker?.lastName}</Text>
                <Text style={styles.rating}>Rating: {selectedMarker?.stars} ({selectedMarker?.numOfReviews} reviews)</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <Text style={styles.detailText}>Phone: {selectedMarker?.phone}</Text>
                <Text style={styles.detailText}>Email: {selectedMarker?.email}</Text>
                <Text style={styles.detailText}>Address: {selectedMarker?.address}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Service Details</Text>
                <Text style={styles.detailText}>Experience: {selectedMarker?.experience} years</Text>
                <Text style={styles.detailText}>Charge Per Hour: LKR {selectedMarker?.chargePerHour}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                {selectedMarker?.starCategoryCount &&
                  Object.entries(selectedMarker.starCategoryCount).map(([key, value]) => (
                    <Text key={key} style={styles.detailText}>{key}: {value}</Text>
                  ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Slot Modal */}
      <Modal
        visible={timeSlotModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTimeSlotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timeSlotModalContent}>
            <View style={styles.timeSlotHeader}>
              <View style={styles.timeSlotHeaderLeft}>
                <Ionicons name="calendar" size={20} color="#4A90E2" />
                <Text style={styles.timeSlotHeaderTitle}>Select Time Slot</Text>
              </View>
              <View style={styles.timeSlotHeaderRight}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.timeSlotDuration}>60 min</Text>
              </View>
            </View>

            <View style={styles.dateSelector}>
              <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} style={styles.dateArrow}>
                <Ionicons name="chevron-back" size={20} color="#666" />
              </TouchableOpacity>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateWeekday}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} style={styles.dateArrow}>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.timeSlotGrid}>
                {Array.from({ length: 11 }, (_, i) => {
                  const hour = 10 + i;
                  const timeSlot = `${hour}:00`;
                  const isAvailable = Math.random() > 0.3; // Simulate availability
                  return (
                    <TouchableOpacity
                      key={timeSlot}
                      disabled={!isAvailable}
                      onPress={() => setSelectedTimeSlot(timeSlot)}
                      style={[
                        styles.timeSlotButton,
                        !isAvailable && styles.timeSlotButtonDisabled,
                        selectedTimeSlot === timeSlot && styles.timeSlotButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          !isAvailable && styles.timeSlotTextDisabled,
                          selectedTimeSlot === timeSlot && styles.timeSlotTextSelected,
                        ]}
                      >
                        {timeSlot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              disabled={!selectedTimeSlot}
              onPress={() => handleTimeSlotSelection(selectedTimeSlot)}
              style={[
                styles.confirmButton,
                !selectedTimeSlot && styles.confirmButtonDisabled,
              ]}
            >
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </TouchableOpacity>

            {/* Cancel Button with Gap */}
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setTimeSlotModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 90,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  map: {
    flex: 1,
  },
  customerMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  customerRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    opacity: 0.3,
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerRating: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerRatingText: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 2,
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  cardInfo: {
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  actionButton: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  primaryButtonText: {
    color: '#fff',
  },
  relocateButton: {
    position: 'absolute',
    bottom: CARD_HEIGHT + 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  relocateButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  profileModalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  timeSlotModalContent: {
    width: width * 0.8,
    maxHeight: height * 0.6,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  cancelButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeSlotHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeSlotHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeSlotDuration: {
    fontSize: 14,
    color: '#666',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  dateArrow: {
    padding: 8,
  },
  dateDisplay: {
    alignItems: 'center',
  },
  dateWeekday: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotButton: {
    flexBasis: '30%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  timeSlotButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  timeSlotButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  timeSlotTextDisabled: {
    color: '#999',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonContainer: {
    marginTop: 10, // Added gap between Confirm Booking and Cancel button
  },
});

export default MapScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState([
    { time: "09:00 AM", status: "available" },
    { time: "10:00 AM", status: "booked", details: {
      name: "Jane Doe",
      phone: "+1 123 456 7890",
      email: "jane.doe@example.com",
      location: "123 Main St"
    }},
    { time: "11:00 AM", status: "available" },
    { time: "01:00 PM", status: "available" },
    { time: "02:00 PM", status: "booked", details: {
      name: "John Smith",
      phone: "+1 987 654 3210",
      email: "john.smith@example.com",
      location: "456 Elm St"
    }},
    { time: "03:00 PM", status: "available" }
  ]);
  const router = useRouter();

  const userName = "user noob";
  const greeting = new Date().getHours() < 12 ? "Good Morning" : 
                  new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening";

  // Handle date change
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // Format the selected date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle cancel booking
  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const updatedSlots = timeSlots.map(slot => {
              if (slot.time === selectedSlot.time) {
                return { ...slot, status: "available", details: null };
              }
              return slot;
            });
            setTimeSlots(updatedSlots);
            setModalVisible(false);
            Alert.alert("Booking Cancelled", "The booking has been successfully cancelled.");
          },
        },
      ]
    );
  };

  // Handle mark as booked
  const handleMarkAsBooked = () => {
    const updatedSlots = timeSlots.map(slot => {
      if (slot.time === selectedSlot.time) {
        return {
          ...slot,
          status: "booked",
          details: {
            name: "New Booking",
            phone: "+1 000 000 0000",
            email: "new.booking@example.com",
            location: "New Location"
          },
        };
      }
      return slot;
    });
    setTimeSlots(updatedSlots);
    setSelectedSlot(updatedSlots.find(slot => slot.time === selectedSlot.time)); // Update selected slot
    Alert.alert("Booking Confirmed", "You have marked the slot as booked.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hi, {userName}</Text>
            <Text style={styles.headerSubtitle}>{greeting}</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Date Picker */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {formattedDate}
              </Text>
            </TouchableOpacity>

            {/* Show Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Search */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search time slots..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Time Slots */}
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    slot.status === 'booked' ? styles.bookedSlot : styles.availableSlot
                  ]}
                  onPress={() => {
                    setSelectedSlot(slot);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.timeText}>{slot.time}</Text>
                  <View style={[
                    styles.statusBadge,
                    slot.status === 'booked' ? styles.bookedBadge : styles.availableBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Time Slot Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {selectedSlot?.status === 'booked' ? (
                <View style={styles.detailsContainer}>
                  <Text style={styles.bookingConfirmationText}>
                    You have marked the slot as booked.
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailText}>{selectedSlot.details.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailText}>{selectedSlot.details.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailText}>{selectedSlot.details.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailText}>{selectedSlot.details.location}</Text>
                  </View>

                  {/* Cancel Booking Button */}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelBooking}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.bookingContainer}>
                  <Text style={styles.bookingText}>Would you like to book this time slot?</Text>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleMarkAsBooked}
                  >
                    <Text style={styles.bookButtonText}>Mark as Booked</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/EmployeeSchedule')}>
            <Image source={require('../assets/images/home.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/eactivity')}>
            <Image source={require('../assets/images/activity.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/enotification')}>
            <Image source={require('../assets/images/notification.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/eaccount')}>
            <Image source={require('../assets/images/account.png')} style={styles.footerIcon} />
            <Text style={styles.footerButtonText}>Account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  mainContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    flex: 1,
    marginTop: 20,
  },
  datePickerButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  availableSlot: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#81c784',
  },
  bookedSlot: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: '#66bb6a',
  },
  bookedBadge: {
    backgroundColor: '#ef5350',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  detailsContainer: {
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  detailText: {
    flex: 1,
    fontSize: 16,
  },
  bookingContainer: {
    alignItems: 'center',
  },
  bookingText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bookingConfirmationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4c669f',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  footerButtonText: {
    color: '#4c669f',
    fontSize: 12,
  },
});

export default ScheduleScreen;
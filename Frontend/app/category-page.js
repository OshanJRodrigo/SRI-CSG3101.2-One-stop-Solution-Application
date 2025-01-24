import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import getCurrentLocation from "../hooks/getCurrentLocation";
import apiClient from "../constants/api";

const categories = [
  { name: "Plumbing", icon: "build-outline" },
  { name: "Electricians", icon: "flash-outline" },
  { name: "Furniture Repair", icon: "bed-outline" },
  { name: "Appliance Repair", icon: "hardware-chip-outline" },
  { name: "Painters", icon: "color-palette-outline" },
  { name: "Carpenters", icon: "hammer-outline" },
  { name: "Landscaping", icon: "leaf-outline" },
  { name: "Cleaning", icon: "sparkles-outline" },
  { name: "Pest Control", icon: "bug-outline" },
  { name: "Handyman", icon: "construct-outline" },
];

const CategoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userName = "Kalana Samara";

  const greeting = new Date().getHours() < 12 ? "Good Morning" : 
                  new Date().getHours() < 18 ? "Good Afternoon" : 
                  "Good Evening";

  const filteredCategories = searchQuery === '' ? categories : 
    categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

const handleCategorySelection = async (category) => {
  try {
    // Step 1: Get current location
    const location = await getCurrentLocation();
    if (!location) {
      alert("Unable to fetch location.");
      return;
    }

    // Step 2: Format the payload
    const payload = {
      category, // Selected category
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    // Step 3: Send data to the backend
    const response = await apiClient.post("/ml/predict", payload);

    // Step 4: Process the response
    console.log("Prediction Response:", response.data); // Log ML response for debugging

    // Step 5: Navigate to MapScreen with the ML response
    router.push({
      pathname: "/MapScreen",
      params: {
        markers: JSON.stringify(response.data), // Pass ML response to the MapScreen
        customerLocation: JSON.stringify(location),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while sending data to the ML model. Please try again.");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchQuery(category.name);
                handleCategorySelection(category.name);
              }}
            >
              <Ionicons name={category.icon} size={24} color="#666" />
              <Text style={styles.suggestionText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            {filteredCategories.slice(0, Math.ceil(filteredCategories.length/2)).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => handleCategorySelection(category.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={category.icon} size={32} color="#007AFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            {filteredCategories.slice(Math.ceil(filteredCategories.length/2)).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => handleCategorySelection(category.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={category.icon} size={32} color="#007AFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.navbar}>
        {[
          { icon: 'home', label: 'Home' },
          { icon: 'time', label: 'Activity' },
          { icon: 'notifications', label: 'Notification' },
          { icon: 'person', label: 'Account' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.navItem}
            onPress={() => router.push(`/${item.label}`)}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={index === 0 ? "#007AFF" : "#666"} 
            />
            <Text style={[styles.navLabel, index === 0 && styles.activeNavLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'space-between',
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    position: 'relative',
    zIndex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    zIndex: 2,
    maxHeight: 200,
    overflow: 'scroll',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#212529',
  },
  categoriesContainer: {
    padding: 10,
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    marginTop: 10,
    marginBottom: 100,
  },
  categoryRow: {
    flexDirection: 'row',
   
  },
  categoryCard: {
    width: 140,
    height: 140,
    marginRight: 16,
    marginBottom: -10,
    backgroundColor: '#fff',
    borderRadius: 16,
    
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
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
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryPage;
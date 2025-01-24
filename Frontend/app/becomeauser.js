import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Earn = () => {
  const navigation = useNavigation();

  const navigateToEmployeeRegistration = () => {
    navigation.navigate('customer-login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* GIF at the top */}
      <Image
        source={require('../assets/images/job.gif')} // Update the path to your actual GIF file
        style={styles.gif}
      />
      
      {/* Text Content */}
      <Text style={styles.heading}>Unlock Opportunities with [One-Stop Solution App]</Text>
      <Text style={styles.paragraph}>
        Welcome to [One-Stop Solution App]—your go-to platform for connecting skilled service providers with those in need of high-quality, reliable maintenance services. 
      </Text>
      
      <Text style={styles.subheading}>Why Choose [One-Stop Solution App]?</Text>
      <Text style={styles.paragraph}>
        Developed by a dedicated team under the guidance of Dr. H.M.M. Caldera, this app bridges the gap between service seekers and skilled professionals, solving key challenges in the industry:
      </Text>
      <Text style={styles.paragraph}>
        • **Ease of Access**: Quickly find or offer services with a user-friendly interface.{'\n'}
        • **Verified Professionals**: Connect with skilled and trusted service providers.{'\n'}
        • **Efficiency**: Streamlined bookings and instant communication reduce response times.{'\n'}
        • **Secure Payments**: Reliable payment systems ensure smooth transactions.{'\n'}
        • **Transparency**: View detailed profiles, pricing, and reviews for informed decisions.
      </Text>

      <Text style={styles.subheading}>How It Works</Text>
      <Text style={styles.paragraph}>
        1. **Sign Up**: Create an account to access the platform's features.{'\n'}
        2. **Complete Your Profile**: Showcase your skills or preferences to get started.{'\n'}
        3. **Engage**: Book or provide services with ease, backed by a secure and efficient system.{'\n'}
        4. **Feedback**: Share or receive reviews to build credibility and trust.
      </Text>
      
      <Text style={styles.subheading}>Our Mission</Text>
      <Text style={styles.paragraph}>
        To create a seamless connection between households and skilled service providers, ensuring timely, reliable, and high-quality solutions to everyday maintenance challenges.
      </Text>

      {/* Button to navigate */}
      <View style={styles.buttonContainer}>
        <Button
          title="Join Us Today"
          onPress={navigateToEmployeeRegistration}
          color="#1E90FF"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  gif: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#666',
  },
  buttonContainer: {
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Earn;

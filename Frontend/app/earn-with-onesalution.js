import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Earn = () => {
  const navigation = useNavigation();

  const navigateToEmployeeRegistration = () => {
    navigation.navigate('employee-register');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* GIF at the top */}
      <Image
        source={require('../assets/images/job.gif')} // Update the path to your actual GIF file
        style={styles.gif}
      />
      
      {/* Text Content */}
      <Text style={styles.heading}>Be Your Own Boss with [One-Stop Solution App] - Earn, Serve, and Succeed!</Text>
      <Text style={styles.paragraph}>
        Looking for Flexible Work Opportunities? Start Earning Today!
      </Text>
      <Text style={styles.paragraph}>
        [One-Stop Solution App] connects skilled service providers like you with customers seeking high-quality 
        maintenance and repair services for their households and small businesses. Whether you specialize in 
        plumbing, electrical repairs, carpentry, or any other maintenance task, there’s work waiting for you.
      </Text>
      
      <Text style={styles.subheading}>Why Join [One-Stop Solution App]?</Text>
      <Text style={styles.paragraph}>
        • Guaranteed Opportunities: Connect with verified customers in need of your expertise.{'\n'}
        • Flexible Schedule: Work on your own terms—accept jobs whenever it suits you.{'\n'}
        • Instant Payments: Get paid immediately for completed tasks.{'\n'}
        • Work Variety: Choose from a wide range of tasks, including household repairs, appliance maintenance, and more.{'\n'}
        • Reliable Platform: Gain trust and credibility through our verified and structured system.
      </Text>
      
      <Text style={styles.subheading}>How to Get Started?</Text>
      <Text style={styles.paragraph}>
        1. Sign Up Today: Register as a service provider on [One-Stop Solution App]—our simple onboarding process gets you started quickly.{'\n'}
        2. Complete Your Profile: Share your expertise, set your pricing, and update your availability.{'\n'}
        3. Start Serving and Earning: Browse job requests in your area, accept tasks, and get paid for your work!
      </Text>
      
      {/* Button to navigate */}
      <View style={styles.buttonContainer}>
        <Button
          title="Become a Service Provider"
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

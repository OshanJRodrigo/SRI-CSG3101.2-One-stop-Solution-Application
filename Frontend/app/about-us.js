import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image } from 'react-native';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* GIF at the top */}
      <Image
        source={require('../assets/images/logo1.png')} // Update the path to your actual GIF file
        style={styles.gif}
      />
      
      <Text style={styles.heading}>About [One-Stop Solution App]</Text>

      <Text style={styles.paragraph}>
        [One-Stop Solution App] is a comprehensive platform designed to connect skilled service providers with customers seeking high-quality maintenance and repair services for their households and small businesses. Whether you specialize in plumbing, electrical repairs, carpentry, or any other maintenance task, [One-Stop Solution App] brings you endless work opportunities at your fingertips.
      </Text>

      <Text style={styles.paragraph}>
        Born from the need to simplify and streamline the way service providers and customers connect, [One-Stop Solution App] ensures that skilled professionals can work on their terms, providing convenience and reliable services to customers. Our platform prioritizes your expertise, offers flexible scheduling, instant payments, and a variety of work options to help you succeed in your career.
      </Text>

      <Text style={styles.subheading}>[One-Stop Solution App] HQ</Text>
      <Text style={styles.paragraph}>No 123 Main Street, Colombo 07, Sri Lanka</Text>

      <Text style={styles.subheading}>Support - Service Providers</Text>
      <Text style={styles.paragraph}>
        Phone: <Text style={styles.link} onPress={() => Linking.openURL('tel:+94111234567')}>0111234567</Text>
      </Text>
      <Text style={styles.paragraph}>
        Email: <Text style={styles.link} onPress={() => Linking.openURL('mailto:support@onestopapp.lk')}>support@onestopapp.lk</Text>
      </Text>

      <Text style={styles.subheading}>Website</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.onestopapp.lk')}>www.onestopapp.lk</Text>
      </Text>

      <Text style={styles.paragraph}>
        Your feedback is important to us. Report any bugs in our app, suggest improvements, or provide your ideas about [One-Stop Solution App] so we can serve you even better.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
    marginBottom: 20,
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
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default AboutUs;

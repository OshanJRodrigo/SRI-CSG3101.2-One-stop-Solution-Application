import React from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';

const Responsive = () => {
  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Determine if the device is in portrait or landscape mode
  const isPortrait = height > width;

  return (
    <View style={[styles.container, isPortrait ? styles.portrait : styles.landscape]}>
      <Text style={styles.title}>Responsive Design</Text>
      <Text style={styles.text}>Screen Width: {width.toFixed(2)} px</Text>
      <Text style={styles.text}>Screen Height: {height.toFixed(2)} px</Text>
      <Text style={styles.text}>
        Orientation: {isPortrait ? 'Portrait' : 'Landscape'}
      </Text>
    </View>
  );
};

export default Responsive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  portrait: {
    backgroundColor: '#f0f8ff',
  },
  landscape: {
    backgroundColor: '#ffe4e1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

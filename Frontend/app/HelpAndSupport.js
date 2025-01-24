import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const HelpAndSupport = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      alert('Permission to access the gallery is required!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Report a Technical Problem</Text>

      {/* Text Input with Upload Button */}
      <View style={styles.textBoxContainer}>
        <TextInput
          style={styles.textBox}
          placeholder="Explain your problem..."
          multiline
          value={problemDescription}
          onChangeText={setProblemDescription}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* Display Uploaded Image */}
      {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  textBoxContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  textBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default HelpAndSupport;

import * as Location from 'expo-location';

const getCurrentLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied.');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

export default getCurrentLocation;

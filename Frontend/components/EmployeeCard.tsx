// References: https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/ExploreScreen.js
// Source code for generating employee cards dynamically

import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  runOnJS, 
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import StarRating from './StarRating';
import StarBarChart from './StarBarChart';
import Entypo from '@expo/vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = 197;//190; //220
const CARD_WIDTH = width * 0.8;


/* const marker = {
    id: 1,
    business_name: "Fixit Computer & iPhone Repair",
    price: 40,
    business_overall_rating: 5.0,
    num_stars: 50,
    latitude: 30.0020398,
    longitude: -90.1321281,
    distance_from_customer: "7.72 km",
    image_URL: "https://cdn12.picryl.com/photo/2016/12/31/caricature-human-person-people-fd3459-1024.jpg"
  } */



const Card = ({marker, onExpand, onContract}) => {

/* marker: a map object containing details of a marker on the google map (details send by the ML model for a particular employee)
   onExpand: a callback function which is called when dragging up or increasing the height of this Card
   onContract: a callback function which is called when dragging down or reducing the height of this Card
 */

  const initialY = height - 730; //0 //height - 730; // Start vertically bottom  height - 285
  const initialHeight = CARD_HEIGHT //200; // Default height of the box
  const maxHeight = 340;//380 //400; // Maximum expanded height 500


  const translateY = useSharedValue(initialY);
  const boxHeight = useSharedValue(initialHeight);


  /* for the drag up indicator visibility */
  const dragUpIndicatorInitialVisbility = 1  // initally fully visible
  const dragUpIndicatorVisibilityLevel = useSharedValue(dragUpIndicatorInitialVisbility); // initally fully visible


   /* for controlling the visibility of hidden StarBarChart*/
  const [isShowhiddenStarBarChart, setIsShowhiddenStarBarChart] = useState(false);


  const panGesture = Gesture.Pan()
    //.runOnJS(true)// This makes sure the onExpand(marker) and onContract(marker) callbacks are executed on the JS thread instead on UI thread which results in crashing the app.
    .onUpdate((event) => {

      
      if (event.translationY < 0) { // checking whether the card is dragging upward

        // Expand the height as the box is dragged upward
        boxHeight.value = interpolate(
          -event.translationY, // Negative translation (upward)
          [0, 200], // Input range
          [initialHeight, maxHeight], // Output range
          'clamp' // Prevents overshooting the range
        );

        // reducing the visibility of drag up indicator as the card is expanded
        dragUpIndicatorVisibilityLevel.value = interpolate(
            -event.translationY,
            [0, 200],
            [1, 0],
        );

        // Ensure the bottom of the box stays at the same position
        // Adjust translateY to account for the expansion while keeping the bottom fixed
        translateY.value = initialY - (boxHeight.value - initialHeight);

        //runOnJS is used to makes sure the following functions are executed on the JS thread instead on UI thread which results in crashing the app.
        runOnJS(onExpand)(marker);
        //onExpand(marker);
        runOnJS(setIsShowhiddenStarBarChart)(true); // show the StarBarChart when dragging up this card
        //setIsShowhiddenStarBarChart(true);
      }
    })
    .onEnd((event) => {

      // Occurs this only if the event was dragging upwards
      if (event.translationY < 0) { 
        // Snap back to the initial position when gesture ends
        //translateX.value = withSpring(translateX.value);
        translateY.value = withSpring(initialY, {damping: 200 ,stiffness: 200});

        // Reset height to the default
        boxHeight.value = initialHeight;

        //runOnJS is used to makes sure the following functions are executed on the JS thread instead on UI thread which results in crashing the app.
        runOnJS(onContract)(marker);
        //onContract(marker);
        runOnJS(setIsShowhiddenStarBarChart)(false); // hide the StarBarChart when dragging down this card
        //setIsShowhiddenStarBarChart(false);

        // show the drag up indicator again
        dragUpIndicatorVisibilityLevel.value = dragUpIndicatorInitialVisbility;
      }

    });



  const animatedDragUpDownStyle = useAnimatedStyle(() => ({
    transform: [
     /*  { translateX: translateX.value }, */
      { translateY: translateY.value },
    ],
    height: boxHeight.value, // Dynamically adjust height
    //backgroundColor: boxColor.value,
  }));


  const dragUpIndicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dragUpIndicatorVisibilityLevel.value,
  }));


  return (
    <GestureHandlerRootView>
        <View style={styles.container}>
          <GestureDetector gesture={panGesture}>

                  <Animated.View 
                      style={[styles.card, animatedDragUpDownStyle]} 
                      key={marker.id}
  /*                     onLayout={(event) => {
                          const { x, y, width, height } = event.nativeEvent.layout;
                          console.log(`Card Position - X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}`);
                          // Save the position in state if needed
                      }} */
                  >
                      {/* Card Image and Text */}
                      <View style={styles.cardImageAndTextContent}>

                          <Image 
                              source={{uri: marker.profileImageUrl}}
                              style={styles.cardImage}
                              resizeMode='cover'
                          />
                          
                          {/* Card Text */}
                          <View style={styles.textContent}>

                              <Text style={[styles.cardtitle, {fontSize: 18, bottom: 5 }]}>{marker.firstName} {marker.lastName}</Text>

                              <Text style={styles.phone}> Call: {marker.phone}</Text>

                              <View style={styles.distanceFromCustomer}>
                                  <Entypo name="location-pin" size={17.1} color="gray" />
                                  <Text numberOfLines={1} style={styles.cardDescription}>{marker.distanceFromCustomer} away from you</Text>
                              </View>

                              <View style={styles.ratingAndPrice}>
                                  <StarRating rating={marker.stars} numOfRatings={marker.numOfReviews}/>
                                  <Text numberOfLines={1} style={[styles.cardDescription, {fontSize: 17, fontWeight: "bold"}]}>LKR {marker.chargePerHour}/hr</Text>
                              </View>

                          </View>

                      </View>

                      {/* Buttons */}
                      <View style={styles.button}>

                          {/* Book Now button */}
                          <TouchableOpacity
                              onPress={() => {}} // add a functionality that activates when this button is pressed
                              style={[styles.buttonContent, {
                                  marginLeft: 5,
                                  //alignSelf: 'flex-start',
                              }]}
                          >
                              <Text style={styles.buttonText}>Book Now</Text>
                          </TouchableOpacity>

                          {/* View Profile button */}
                          <TouchableOpacity
                              onPress={() => {}} // add a functionality that activates when this button is pressed
                              style={[styles.buttonContent, {
                                  marginRight: 5,
                                  //alignSelf: 'flex-end',
                              }]}
                          >
                              <Text style={styles.buttonText}>View Profile</Text>
                          </TouchableOpacity>

                      </View>

                      {/* Drag up indicator */}
                      <Animated.View style={[styles.dragUpIndicator,  dragUpIndicatorAnimatedStyle]}>
                          <Entypo name="chevron-up" size={21} color="gray" />
                      </Animated.View>

                      {/* Hidden StarBarChart */}
                      <View style={styles.StarBarChart}>
                          {isShowhiddenStarBarChart &&  <StarBarChart rating={marker.starCategoryCount}/>}
                      </View>
                      
                  </Animated.View>
                  
          </GestureDetector>
        </View>
    </GestureHandlerRootView>
  );
};



export default Card;


const styles = StyleSheet.create({
  container: { // change the size and position of the employee card along with the the size and position of the scrollView in  '../app/MapScreen'
    flex: 1,
    bottom: 132,
    marginTop:300,  //125,//85,//300,//85, //adjust the position of employee card within the scroll view
    //position: 'absolute'
  },
  card: {  // change the size and position of the employee card along with the the size and position of the scrollView in  '../app/MapScreen'
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10, //5, 
    borderTopRightRadius: 10, //5,
    borderBottomLeftRadius: 10, //5,
    borderBottomRightRadius: 10, //5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImageAndTextContent: {
    flexDirection: 'row', // Arrange image and text side by side
    //alignItems: 'center', // Align vertically centered
    marginBottom: 2
    //bottom: 3,
  },
  cardImage: {
    flex: 3,
    //width: "100%",
    //height: "100%",
    //alignSelf: "center",
    aspectRatio: 1.04,
    //top: 1,
    borderRadius: 70,
    left: 5,
    top: 5,
  },
  textContent: {
    flex: 4,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  button: {
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContent: {
    width: '48%',
    padding:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#FF6347',
    borderWidth: 1,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  phone: {
    fontSize: 15, 
    right: 3, 
    top: 4
  },
  distanceFromCustomer: {
    flexDirection: 'row', 
    marginTop: 'auto', 
    top: 17
  },
  ratingAndPrice: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 'auto', 
    top: 15
  },
  dragUpIndicator: {
    bottom: 7, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  StarBarChart: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    bottom: 15
  }    
});


